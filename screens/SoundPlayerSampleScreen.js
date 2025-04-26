import React, { useState, useEffect, useRef } from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    ImageBackground,
    SafeAreaView,
    StatusBar,
    ActivityIndicator,
    ScrollView,
    Dimensions
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import * as SecureStore from 'expo-secure-store';

const { width, height } = Dimensions.get('window');

const SoundPlayerSampleScreen = ({ route, navigation }) => {
    const { soundId, soundTitle, soundPhoto } = route.params || {};

    const [sound, setSound] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [elapsedTime, setElapsedTime] = useState(0);
    const [soundData, setSoundData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    const timerRef = useRef(null);

    useEffect(() => {
        fetchSoundDetails();

        // Clean up on unmount
        return () => {
            if (sound) {
                sound.unloadAsync();
            }
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
        };
    }, []);

    const fetchSoundDetails = async () => {
        try {
            setIsLoading(true);

            // Get stored credentials
            const profileId = await SecureStore.getItemAsync('profile_id');
            const loginCode = await SecureStore.getItemAsync('login_code');

            // Create FormData object
            const formData = new FormData();
            formData.append('sound_id', soundId);

            // Only add credentials if they exist
            if (profileId && loginCode) {
                formData.append('profile_id', profileId);
                formData.append('login_code', loginCode);
            }

            // Make API call using form-data
            const response = await fetch('https://app.3dnaturesounds.com/api/get_sample_sound/', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                },
                body: formData
            });

            const data = await response.json();

            if (data.success === 1 && data.sound) {
                setSoundData(data.sound);
            } else {
                throw new Error(data.message || 'Failed to load sound details');
            }
        } catch (err) {
            console.error('Error fetching sound details:', err);
            setError(err.message || 'Failed to load sound. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const loadAndPlaySound = async () => {
        try {
            // Make sure to stop and unload any existing sound
            if (sound) {
                await sound.unloadAsync();
            }

            // Set up audio session for playback in background
            await Audio.setAudioModeAsync({
                playsInSilentModeIOS: true,
                staysActiveInBackground: true,
                shouldDuckAndroid: true,
            });

            // For sample sounds, use the sample_file URL or construct URL differently
            const soundUrl = `https://app.3dnaturesounds.com/assets/samples/${soundId}.mp3`;

            // Load the sound from the sample URL
            const { sound: newSound } = await Audio.Sound.createAsync(
                { uri: soundUrl },
                { shouldPlay: true, isLooping: true },
                onPlaybackStatusUpdate
            );

            setSound(newSound);
            setIsPlaying(true);
            startTimer();
        } catch (err) {
            console.error('Error playing sound:', err);
            setError('Failed to play sound. Please try again.');
        }
    };

    const onPlaybackStatusUpdate = (status) => {
        if (status.isLoaded) {
            if (status.isPlaying !== isPlaying) {
                setIsPlaying(status.isPlaying);
            }
        } else if (status.error) {
            console.error('Playback error:', status.error);
            setError('There was an error playing this sound.');
        }
    };

    const startTimer = () => {
        if (timerRef.current) {
            clearInterval(timerRef.current);
        }

        timerRef.current = setInterval(() => {
            setElapsedTime(prev => prev + 1);
        }, 1000);
    };

    const stopTimer = () => {
        if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
        }
    };

    const togglePlayPause = async () => {
        if (sound) {
            if (isPlaying) {
                await sound.pauseAsync();
                setIsPlaying(false);
                stopTimer();
            } else {
                await sound.playAsync();
                setIsPlaying(true);
                startTimer();
            }
        } else if (soundData) {
            loadAndPlaySound();
        }
    };

    const handleBackPress = async () => {
        // Stop the sound if it's playing
        if (sound && isPlaying) {
            await sound.pauseAsync();
            setIsPlaying(false);
            stopTimer();
        }
        navigation.goBack();
    };

    const formatTime = (seconds) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;

        return [
            hours.toString().padStart(2, '0'),
            minutes.toString().padStart(2, '0'),
            secs.toString().padStart(2, '0')
        ].join(':');
    };

    const getImageUrl = (photo) => {
        return `https://app.3dnaturesounds.com/assets/images/${photo}`;
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" translucent={true} backgroundColor="transparent" />

            <ImageBackground
                source={{
                    uri: soundData ? getImageUrl(soundData.photo) : getImageUrl(soundPhoto)
                }}
                style={styles.backgroundImage}
            >
                <SafeAreaView style={styles.safeArea}>
                    {/* Header with back button and title */}
                    <View style={styles.header}>
                        <TouchableOpacity
                            style={styles.backButton}
                            onPress={handleBackPress}
                        >
                            <Ionicons name="arrow-back" size={24} color="white" />
                        </TouchableOpacity>
                        <Text style={styles.title}>
                            {soundData ? soundData.title : soundTitle}
                        </Text>
                        <View style={{ width: 24 }} />
                    </View>

                    {isLoading ? (
                        <View style={styles.loadingContainer}>
                            <ActivityIndicator size="large" color="white" />
                        </View>
                    ) : error ? (
                        <View style={styles.errorContainer}>
                            <Text style={styles.errorText}>{error}</Text>
                            <TouchableOpacity
                                style={styles.retryButton}
                                onPress={fetchSoundDetails}
                            >
                                <Text style={styles.retryText}>Retry</Text>
                            </TouchableOpacity>
                        </View>
                    ) : (
                        <View style={styles.content}>
                            {/* Timer display */}
                            <View style={styles.timerContainer}>
                                <View style={styles.timerCircle}>
                                    <Text style={styles.timer}>{formatTime(elapsedTime)}</Text>
                                </View>
                            </View>

                            {/* Description */}
                            {soundData?.about && (
                                <ScrollView
                                    style={styles.descriptionContainer}
                                    contentContainerStyle={styles.descriptionContent}
                                    showsVerticalScrollIndicator={false}
                                >
                                    <Text style={styles.description}>
                                        {soundData.about}
                                    </Text>
                                </ScrollView>
                            )}

                            {/* Playback controls */}
                            <View style={styles.controls}>
                                <TouchableOpacity
                                    style={styles.playPauseButton}
                                    onPress={togglePlayPause}
                                >
                                    <Ionicons
                                        name={isPlaying ? "pause" : "play"}
                                        size={36}
                                        color="white"
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>
                    )}
                </SafeAreaView>
            </ImageBackground>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    backgroundImage: {
        flex: 1,
        width: '100%',
        height: '100%',
    },
    safeArea: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: StatusBar.currentHeight + 20,
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        color: 'white',
        textAlign: 'center',
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    timerContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 30,
    },
    timerCircle: {
        width: 180,
        height: 180,
        borderRadius: 90,
        borderWidth: 2,
        borderColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
    },
    timer: {
        fontSize: 30,
        fontWeight: 'bold',
        color: 'white',
    },
    descriptionContainer: {
        maxHeight: 200,
        marginHorizontal: 20,
        marginVertical: 20,
    },
    descriptionContent: {
        paddingBottom: 10,
    },
    description: {
        color: 'white',
        fontSize: 16,
        lineHeight: 24,
        textAlign: 'center',
    },
    controls: {
        alignItems: 'center',
        marginTop: 30,
        marginBottom: 40,
    },
    playPauseButton: {
        width: 70,
        height: 70,
        borderRadius: 35,
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    errorText: {
        fontSize: 16,
        color: 'white',
        textAlign: 'center',
        marginBottom: 20,
    },
    retryButton: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        borderRadius: 20,
    },
    retryText: {
        color: 'white',
        fontWeight: 'bold',
    },
});

export default SoundPlayerSampleScreen;