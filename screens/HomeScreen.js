// screens/HomeScreen.js
import React, { useState, useEffect } from 'react';
import {
    StyleSheet,
    View,
    Text,
    Image,
    TouchableOpacity,
    FlatList,
    SafeAreaView,
    StatusBar,
    ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as SecureStore from 'expo-secure-store';

const HomeScreen = ({ navigation }) => {
    const [selectedTab, setSelectedTab] = useState('All');
    const [profileSounds, setProfileSounds] = useState([]);
    const [sampleSounds, setSampleSounds] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    // Tabs for filtering sounds
    const tabs = ['All', 'My Sounds', 'New Sounds'];

    useEffect(() => {
        loadAllSounds();
    }, []);

    const loadAllSounds = async () => {
        setIsLoading(true);
        setError('');

        try {
            await Promise.all([
                fetchProfileSounds(),
                fetchSampleSounds()
            ]);
        } catch (err) {
            console.error('Error loading sounds:', err);
            setError('Failed to load sounds. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const fetchProfileSounds = async () => {
        try {
            // Get stored credentials
            const profileId = await SecureStore.getItemAsync('profile_id');
            const loginCode = await SecureStore.getItemAsync('login_code');

            if (!profileId || !loginCode) {
                throw new Error('Login credentials not found');
            }

            // Create FormData object
            const formData = new FormData();
            formData.append('profile_id', profileId);
            formData.append('login_code', loginCode);

            // Make API call using form-data
            const response = await fetch('https://dev.3dnaturesounds.com/api/get_profile_sounds/', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                },
                body: formData
            });

            // console.log("profileId: " + profileId);
            // console.log("loginCode: " + loginCode);

            const data = await response.json();

            if (data.success === 1) {

                // Combine both sounds and samples from profile API
                const allProfileSounds = [
                    ...(data.sounds || []).map(sound => ({
                        ...sound,
                        id: sound.sound_id,
                        source: 'profile'
                    })),
                    ...(data.samples || []).map(sample => ({
                        ...sample,
                        source: 'profile_sample'
                    }))
                ];

                setProfileSounds(allProfileSounds);

            } else {
                console.log('error 1');
                throw new Error(data.message || 'Failed to load profile sounds');
            }
        } catch (err) {
            console.log('error 2');
            console.error('Error fetching profile sounds:', err);
            throw err;
        }
    };

    const fetchSampleSounds = async () => {
        try {
            // Get stored credentials
            const profileId = await SecureStore.getItemAsync('profile_id');
            const loginCode = await SecureStore.getItemAsync('login_code');

            // Create FormData object
            const formData = new FormData();
            if (profileId && loginCode) {
                formData.append('profile_id', profileId);
                formData.append('login_code', loginCode);
            }

            // Make API call using form-data
            const response = await fetch('https://dev.3dnaturesounds.com/api/get_sample_sounds/', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                },
                body: formData
            });

            const data = await response.json();

            if (data.success === 1) {
                const samples = (data.sounds || []).map(sound => ({
                    ...sound,
                    source: 'sample'
                }));

                setSampleSounds(samples);
            } else {
                throw new Error(data.message || 'Failed to load sample sounds');
            }
        } catch (err) {
            console.error('Error fetching sample sounds:', err);
            throw err;
        }
    };

    // Get the filtered data based on the selected tab
    const getFilteredSounds = () => {
        switch (selectedTab) {
            case 'All':
                return [...profileSounds, ...sampleSounds];
            case 'My Sounds':
                return profileSounds.filter(sound => sound.source === 'profile');
            case 'New Sounds':
                return sampleSounds;
            default:
                return [...profileSounds, ...sampleSounds];
        }
    };

    // Get image URL for a sound
    const getSoundImageUrl = (photo) => {
        return `https://dev.3dnaturesounds.com/assets/images/${photo}`;
    };

    const handleSoundPress = (item) => {
        navigation.navigate('SoundPlayer', {
            soundId: item.id || item.sound_id,
            soundTitle: item.title,
            soundPhoto: item.photo
        });
    };

    const renderSoundItem = ({ item, index }) => (
        <TouchableOpacity
            style={styles.soundCard}
            onPress={() => {
                // Handle sound selection
                //console.log('Sound selected:', item.title, item);
                handleSoundPress(item)
            }}
        >
            <Image
                source={{ uri: getSoundImageUrl(item.photo) }}
                style={styles.soundImage}
                resizeMode="cover"
            />
            <Text style={styles.soundTitle}>{item.title}</Text>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" />

            <View style={styles.header}>
                <View style={styles.logo}>
                    <Ionicons name="moon" size={24} color="#5D5FEF" />
                </View>
                <Text style={styles.headerTitle}>Home</Text>
                <View style={styles.placeholder} />
            </View>

            <View style={styles.tabContainer}>
                {tabs.map(tab => (
                    <TouchableOpacity
                        key={tab}
                        style={[
                            styles.tab,
                            selectedTab === tab && styles.activeTab
                        ]}
                        onPress={() => setSelectedTab(tab)}
                    >
                        <Text
                            style={[
                                styles.tabText,
                                selectedTab === tab && styles.activeTabText
                            ]}
                        >
                            {tab}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            {isLoading ? (
                <View style={styles.loaderContainer}>
                    <ActivityIndicator size="large" color="#5D5FEF" />
                </View>
            ) : error ? (
                <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>{error}</Text>
                    <TouchableOpacity
                        style={styles.retryButton}
                        onPress={loadAllSounds}
                    >
                        <Text style={styles.retryButtonText}>Retry</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <FlatList
                    data={getFilteredSounds()}
                    renderItem={renderSoundItem}
                    keyExtractor={(item) => (item.id || item.sound_id || Math.random().toString()).toString()}
                    contentContainerStyle={styles.soundsGrid}
                    numColumns={2}
                    showsVerticalScrollIndicator={false}
                />
            )}

            <View style={styles.bottomTabs}>
                <TouchableOpacity style={styles.bottomTab}>
                    <Ionicons name="grid" size={24} color="white" />
                    <Text style={styles.bottomTabText}>Home</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.bottomTab}
                    onPress={() => navigation.navigate('Account')}
                >
                    <Ionicons name="person" size={24} color="gray" />
                    <Text style={styles.bottomTabText}>Account</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#121212',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
    },
    logo: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(93, 95, 239, 0.2)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'white',
    },
    placeholder: {
        width: 40,
    },
    tabContainer: {
        flexDirection: 'row',
        paddingHorizontal: 16,
        marginBottom: 16,
    },
    tab: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
        marginRight: 8,
    },
    activeTab: {
        backgroundColor: '#5D5FEF',
    },
    tabText: {
        color: '#A0A0A0',
        fontWeight: '500',
    },
    activeTabText: {
        color: 'white',
    },
    loaderContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
    },
    errorText: {
        color: '#FF6B6B',
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 16,
    },
    retryButton: {
        backgroundColor: '#5D5FEF',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 50,
    },
    retryButtonText: {
        color: 'white',
        fontWeight: '600',
    },
    soundsGrid: {
        padding: 8,
    },
    soundCard: {
        flex: 1,
        margin: 8,
        borderRadius: 12,
        overflow: 'hidden',
        height: 180,
        position: 'relative',
    },
    soundImage: {
        width: '100%',
        height: '100%',
    },
    soundTitle: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: 12,
        color: 'white',
        fontWeight: '600',
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
    },
    bottomTabs: {
        flexDirection: 'row',
        borderTopWidth: 1,
        borderTopColor: '#2A2A2A',
        paddingVertical: 12,
    },
    bottomTab: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: 8,
    },
    bottomTabText: {
        fontSize: 12,
        marginTop: 4,
        color: 'white',
    },
});

export default HomeScreen;