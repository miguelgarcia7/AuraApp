// screens/AccountScreen.js
import React, { useState, useEffect } from 'react';
import {
    StyleSheet,
    View,
    Text,
    Image,
    TouchableOpacity,
    SafeAreaView,
    StatusBar,
    ScrollView,
    Modal,
    Animated,
    Dimensions,
    BlurView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as SecureStore from 'expo-secure-store';

const AccountScreen = ({ navigation }) => {
    const [profileData, setProfileData] = useState({
        name: 'Andrew Ainsley',
        email: 'miguel@miguelangelgarcia.com'
    });
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const [modalAnimation] = useState(new Animated.Value(0));

    useEffect(() => {
        // Load profile data from server or secure storage
        loadProfileData();
    }, []);

    useEffect(() => {
        if (showLogoutModal) {
            Animated.timing(modalAnimation, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true
            }).start();
        } else {
            Animated.timing(modalAnimation, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true
            }).start();
        }
    }, [showLogoutModal]);

    const loadProfileData = async () => {
        try {
            // Get stored credentials
            const profileId = await SecureStore.getItemAsync('profile_id');
            const loginCode = await SecureStore.getItemAsync('login_code');

            if (!profileId || !loginCode) {
                // Handle not logged in state if needed
                return;
            }

            // In a real app, you would fetch profile data from your API here
            // For now, we'll use the static data in state
        } catch (err) {
            console.error('Error loading profile data:', err);
        }
    };

    const handleLogout = async () => {
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

            // Make API call to logout
            const response = await fetch('https://dev.3dnaturesounds.com/api/logout/', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                },
                body: formData
            });

            const data = await response.json();

            // Clear secure storage regardless of API response success
            await SecureStore.deleteItemAsync('profile_id');
            await SecureStore.deleteItemAsync('login_code');

            // Hide modal
            setShowLogoutModal(false);

            // Short delay to allow modal animation to complete
            setTimeout(() => {
                navigation.reset({
                    index: 0,
                    routes: [{ name: 'Welcome' }], // Navigate to Login screen instead of Welcome
                });
            }, 300);

        } catch (err) {
            console.error('Error during logout:', err);

            // Even if there's an error, clear local credentials and redirect to login
            await SecureStore.deleteItemAsync('profile_id');
            await SecureStore.deleteItemAsync('login_code');

            setShowLogoutModal(false);
            setTimeout(() => {
                navigation.reset({
                    index: 0,
                    routes: [{ name: 'Welcome' }],
                });
            }, 300);
        }
    };

    const navigateTo = (screen) => {
        // Navigate to the specified screen
        navigation.navigate(screen);
    };

    const renderMenuItem = (icon, title, onPress, color = 'white', isLogout = false) => (
        <TouchableOpacity
            style={styles.menuItem}
            onPress={onPress}
        >
            <View style={styles.menuIconContainer}>
                <Ionicons name={icon} size={24} color={isLogout ? '#FF3B30' : color} />
            </View>
            <Text style={[styles.menuItemText, isLogout && styles.logoutText]}>{title}</Text>
            {!isLogout && <Ionicons name="chevron-forward" size={20} color="gray" />}
        </TouchableOpacity>
    );

    const renderLogoutModal = () => {
        const translateY = modalAnimation.interpolate({
            inputRange: [0, 1],
            outputRange: [300, 0]
        });

        return (
            <Modal
                visible={showLogoutModal}
                transparent={true}
                animationType="none"
                onRequestClose={() => setShowLogoutModal(false)}
            >
                <View style={styles.modalOverlay}>
                    <Animated.View
                        style={[
                            styles.logoutModalContainer,
                            { transform: [{ translateY }] }
                        ]}
                    >
                        <Text style={styles.logoutModalTitle}>Logout</Text>
                        <Text style={styles.logoutModalSubtitle}>Sure you want to log out?</Text>

                        <View style={styles.logoutButtonsContainer}>
                            <TouchableOpacity
                                style={styles.cancelButton}
                                onPress={() => setShowLogoutModal(false)}
                            >
                                <Text style={styles.cancelButtonText}>Cancel</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.confirmLogoutButton}
                                onPress={handleLogout}
                            >
                                <Text style={styles.confirmLogoutText}>Yes, Logout</Text>
                            </TouchableOpacity>
                        </View>
                    </Animated.View>
                </View>
            </Modal>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" />

            <View style={styles.header}>
                <View style={styles.logo}>
                    <Ionicons name="moon" size={24} color="#5D5FEF" />
                </View>
                <Text style={styles.headerTitle}>Account</Text>
                <View style={styles.placeholder} />
            </View>

            <ScrollView style={styles.content}>
                {/* Upgrade Banner */}
                <TouchableOpacity style={styles.upgradeBanner}>
                    <View style={styles.crownContainer}>
                        <Ionicons name="crown" size={24} color="#FF9500" />
                    </View>
                    <View style={styles.upgradeTextContainer}>
                        <Text style={styles.upgradeTitle}>Upgrade Plan Now!</Text>
                        <Text style={styles.upgradeSubtitle}>Enjoy all the benefits and explore more possibilities</Text>
                    </View>
                </TouchableOpacity>

                {/* Profile Section */}
                <View style={styles.profileSection}>
                    <Image
                        source={require('../assets/profile-placeholder.jpg')}
                        style={styles.profileImage}
                    />
                    <View style={styles.profileInfo}>
                        <Text style={styles.profileName}>{profileData.name}</Text>
                        <Text style={styles.profileEmail}>{profileData.email}</Text>
                    </View>
                    <TouchableOpacity style={styles.editButton}>
                        <Ionicons name="refresh" size={20} color="white" />
                    </TouchableOpacity>
                </View>

                {/* Menu Items */}
                <View style={styles.menuSection}>
                    {renderMenuItem('settings', 'Preferences', () => navigateTo('Preferences'))}
                    {renderMenuItem('person', 'Personal Info', () => navigateTo('PersonalInfo'))}
                    {renderMenuItem('star', 'Billing & Subscriptions', () => navigateTo('Billing'))}
                    {renderMenuItem('help-circle', 'Help & Support', () => navigateTo('Support'))}
                </View>

                {/* Logout Button */}
                <View style={styles.logoutSection}>
                    {renderMenuItem('log-out', 'Logout', () => setShowLogoutModal(true), '#FF3B30', true)}
                </View>
            </ScrollView>

            {/* Bottom Tabs */}
            <View style={styles.bottomTabs}>
                <TouchableOpacity
                    style={styles.bottomTab}
                    onPress={() => navigation.navigate('Home')}
                >
                    <Ionicons name="grid" size={24} color="gray" />
                    <Text style={[styles.bottomTabText, { color: 'gray' }]}>Home</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.bottomTab}>
                    <Ionicons name="person" size={24} color="white" />
                    <Text style={styles.bottomTabText}>Account</Text>
                </TouchableOpacity>
            </View>

            {/* Logout Modal */}
            {renderLogoutModal()}
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
    content: {
        flex: 1,
    },
    upgradeBanner: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#4A4AF4',
        borderRadius: 12,
        padding: 16,
        margin: 16,
    },
    crownContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    upgradeTextContainer: {
        flex: 1,
    },
    upgradeTitle: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    upgradeSubtitle: {
        color: 'rgba(255, 255, 255, 0.8)',
        fontSize: 12,
    },
    profileSection: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#2A2A2A',
    },
    profileImage: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#2A2A2A',
    },
    profileInfo: {
        flex: 1,
        marginLeft: 12,
    },
    profileName: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
    profileEmail: {
        color: 'gray',
        fontSize: 14,
        marginTop: 4,
    },
    editButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    menuSection: {
        marginTop: 20,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 16,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#2A2A2A',
    },
    menuIconContainer: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    menuItemText: {
        flex: 1,
        color: 'white',
        fontSize: 16,
    },
    logoutSection: {
        marginTop: 20,
    },
    logoutText: {
        color: '#FF3B30',
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
    // Logout Modal Styles
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        justifyContent: 'flex-end',
    },
    logoutModalContainer: {
        backgroundColor: '#1E1E1E',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 24,
        paddingBottom: 40,
    },
    logoutModalTitle: {
        color: '#FF3B30',
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
        textAlign: 'center',
    },
    logoutModalSubtitle: {
        color: 'white',
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 24,
    },
    logoutButtonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    cancelButton: {
        flex: 1,
        backgroundColor: '#2A2A2A',
        borderRadius: 25,
        paddingVertical: 15,
        marginRight: 8,
        alignItems: 'center',
    },
    cancelButtonText: {
        color: 'white',
        fontWeight: '600',
    },
    confirmLogoutButton: {
        flex: 1,
        backgroundColor: '#4A4AF4',
        borderRadius: 25,
        paddingVertical: 15,
        marginLeft: 8,
        alignItems: 'center',
    },
    confirmLogoutText: {
        color: 'white',
        fontWeight: '600',
    },
});

export default AccountScreen;