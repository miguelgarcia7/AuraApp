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
    const [selectedTab, setSelectedTab] = useState('Featured');
    const [sounds, setSounds] = useState([]);
    const [samples, setSamples] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    // Tabs for filtering sounds
    const tabs = ['All', 'Featured', 'Recent'];

    useEffect(() => {
        fetchSounds();
    }, []);

    const fetchSounds = async () => {
        try {
            setIsLoading(true);

            // Get stored credentials
            const profileId = await SecureStore.getItemAsync('profile_id');
            const loginCode = await SecureStore.getItemAsync('login_code');

            if (!profileId || !loginCode) {
                setError('Please login to view sounds');
                setIsLoading(false);
                return;
            }

            // Create FormData object
            const formData = new FormData();
            formData.append('profile_id', profileId);
            formData.append('login_code', loginCode);

            // Make API call to get sounds using form-data
            const response = await fetch('https://dev.3dnaturesounds.com/api/get_profile_sounds/', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                },
                body: formData
            });

            const data = await response.json();

            if (data.success === 1) {
                setSounds(data.sounds || []);
                setSamples(data.samples || []);
            } else {
                setError('Failed to load sounds');
            }
        } catch (err) {
            console.error('Error fetching sounds:', err);
            setError('Connection error. Please try again later.');
        } finally {
            setIsLoading(false);
        }
    };

    // Get the data to display based on the selected tab
    const getDisplayData = () => {
        switch (selectedTab) {
            case 'All':
                return [...sounds, ...samples];
            case 'Featured':
                // For this example, let's assume Featured items are ones with a premium flag
                // You might need to adjust this logic based on your actual data structure
                return [...sounds, ...samples].filter((item, index) => index % 3 === 0); // Just for demo
            case 'Recent':
                // For this example, we'll just show sounds (not samples) as "recent"
                return sounds;
            default:
                return [...sounds, ...samples];
        }
    };

    // Get image URL for a sound
    const getSoundImageUrl = (photo) => {
        return `https://dev.3dnaturesounds.com/assets/images/${photo}`;
    };

    // Determine if an item has premium/highlighted status (for the crown icon)
    const isPremium = (item, index) => {
        // This is just a placeholder logic - replace with your actual premium determination
        return index % 3 === 0;
    };

    const renderSoundItem = ({ item, index }) => (
        <TouchableOpacity
            style={styles.soundCard}
            onPress={() => {
                // Handle sound selection/playback
                console.log('Sound selected:', item.title);
            }}
        >
            <Image
                source={{ uri: getSoundImageUrl(item.photo) }}
                style={styles.soundImage}
                resizeMode="cover"
            />
            {isPremium(item, index) && (
                <View style={styles.crownBadge}>
                    <Ionicons name="crown" size={16} color="#fff" />
                </View>
            )}
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
                <TouchableOpacity style={styles.menuButton}>
                    <Ionicons name="ellipsis-vertical" size={24} color="white" />
                </TouchableOpacity>
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
                        onPress={fetchSounds}
                    >
                        <Text style={styles.retryButtonText}>Retry</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <FlatList
                    data={getDisplayData()}
                    renderItem={renderSoundItem}
                    keyExtractor={(item) => item.sound_id?.toString() || item.id?.toString()}
                    contentContainerStyle={styles.soundsGrid}
                    numColumns={2}
                    showsVerticalScrollIndicator={false}
                />
            )}

            <View style={styles.bottomTabs}>
                <TouchableOpacity style={styles.bottomTab} onPress={() => {}}>
                    <Ionicons name="musical-notes" size={24} color="white" />
                    <Text style={styles.bottomTabText}>Sounds</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.bottomTab} onPress={() => {}}>
                    <Ionicons name="grid" size={24} color="gray" />
                    <Text style={styles.bottomTabText}>Library</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.bottomTab} onPress={() => {}}>
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
    menuButton: {
        padding: 8,
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
        padding: 8,
        color: 'white',
        fontWeight: '600',
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
    },
    crownBadge: {
        position: 'absolute',
        top: 8,
        right: 8,
        backgroundColor: 'orange',
        borderRadius: 12,
        width: 24,
        height: 24,
        alignItems: 'center',
        justifyContent: 'center',
    },
    bottomTabs: {
        flexDirection: 'row',
        borderTopWidth: 1,
        borderTopColor: '#2A2A2A',
        paddingVertical: 8,
    },
    bottomTab: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: 8,
    },
    bottomTabText: {
        fontSize: 12,
        marginTop: 4,
        color: 'gray',
    },
});

export default HomeScreen;