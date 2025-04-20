// screens/PersonalInfoScreen.js
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
    TextInput,
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    Keyboard
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as SecureStore from 'expo-secure-store';

const PersonalInfoScreen = ({ navigation }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [error, setError] = useState('');
    const [profileData, setProfileData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        about: '',
        photo: '',
        plan_id: 1,
        plan: 'Free'
    });
    const [languages, setLanguages] = useState([]);
    const [selectedLanguage, setSelectedLanguage] = useState(1);
    const [selectedLanguageName, setSelectedLanguageName] = useState('English');

    useEffect(() => {
        loadProfileData();
    }, []);

    const loadProfileData = async () => {
        setIsLoading(true);
        setError('');

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
            const response = await fetch('https://dev.3dnaturesounds.com/api/get_profile_for_edit/', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                },
                body: formData
            });

            const data = await response.json();

            if (data.success === 1) {
                setProfileData(data.profile);
                setLanguages(data.languages);
                // Set default selected language (assuming the first one is the default)
                if (data.languages && data.languages.length > 0) {
                    setSelectedLanguage(data.languages[0].id);
                    setSelectedLanguageName(data.languages[0].language);
                }
            } else {
                throw new Error(data.message || 'Failed to load profile data');
            }
        } catch (err) {
            console.error('Error fetching profile data:', err);
            setError('Failed to load profile data. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const updateProfile = async () => {
        Keyboard.dismiss();
        setIsSaving(true);
        setError('');
        setShowSuccess(false);

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
            formData.append('first_name', profileData.first_name);
            formData.append('last_name', profileData.last_name);
            formData.append('email', profileData.email);
            formData.append('about', profileData.about);
            formData.append('default_language_id', selectedLanguage);

            // Make API call using form-data
            const response = await fetch('https://dev.3dnaturesounds.com/api/update_profile/', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                },
                body: formData
            });

            const data = await response.json();

            if (data.success === 1) {
                setShowSuccess(true);
                // Hide success message after 3 seconds
                setTimeout(() => {
                    setShowSuccess(false);
                }, 3000);
            } else {
                throw new Error(data.message || 'Failed to update profile');
            }
        } catch (err) {
            console.error('Error updating profile:', err);
            setError('Failed to update profile. Please try again.');
        } finally {
            setIsSaving(false);
        }
    };

    const getProfileImageUrl = () => {
        if (profileData.photo && profileData.photo !== '') {
            return `https://dev.3dnaturesounds.com/assets/images/${profileData.photo}`;
        }
        return require('../assets/profile-placeholder.jpg');
    };

    const handleInputChange = (field, value) => {
        setProfileData(prevData => ({
            ...prevData,
            [field]: value
        }));
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" />

            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <Ionicons name="arrow-back" size={24} color="white" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Personal Info</Text>
                <View style={styles.placeholder} />
            </View>

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardAvoidingView}
            >
                {isLoading ? (
                    <View style={styles.loaderContainer}>
                        <ActivityIndicator size="large" color="#5D5FEF" />
                    </View>
                ) : error ? (
                    <View style={styles.errorContainer}>
                        <Text style={styles.errorText}>{error}</Text>
                        <TouchableOpacity
                            style={styles.retryButton}
                            onPress={loadProfileData}
                        >
                            <Text style={styles.retryButtonText}>Retry</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <>
                        <ScrollView
                            style={styles.content}
                            contentContainerStyle={styles.contentContainer}
                        >
                            {/* Profile Photo Section */}
                            <View style={styles.profilePhotoSection}>
                                <View style={styles.profileImageContainer}>
                                    <Image
                                        source={getProfileImageUrl()}
                                        style={styles.profileImage}
                                    />
                                    <View style={styles.editPhotoButton}>
                                        <Ionicons name="checkmark-circle" size={20} color="#5D5FEF" />
                                    </View>
                                </View>
                            </View>

                            {/* Success Message */}
                            {showSuccess && (
                                <View style={styles.successMessage}>
                                    <Ionicons name="checkmark-circle" size={20} color="white" />
                                    <Text style={styles.successText}>Profile updated successfully</Text>
                                </View>
                            )}

                            {/* Form Fields */}
                            <View style={styles.formSection}>
                                <Text style={styles.fieldLabel}>First Name</Text>
                                <View style={styles.inputContainer}>
                                    <TextInput
                                        style={styles.input}
                                        value={profileData.first_name}
                                        onChangeText={(text) => handleInputChange('first_name', text)}
                                        placeholder="Enter first name"
                                        placeholderTextColor="#666"
                                    />
                                </View>

                                <Text style={styles.fieldLabel}>Last Name</Text>
                                <View style={styles.inputContainer}>
                                    <TextInput
                                        style={styles.input}
                                        value={profileData.last_name}
                                        onChangeText={(text) => handleInputChange('last_name', text)}
                                        placeholder="Enter last name"
                                        placeholderTextColor="#666"
                                    />
                                </View>

                                <Text style={styles.fieldLabel}>Email</Text>
                                <View style={styles.inputContainer}>
                                    <View style={styles.emailContainer}>
                                        <Ionicons name="mail" size={20} color="#A0A0A0" style={styles.emailIcon} />
                                        <TextInput
                                            style={styles.emailInput}
                                            value={profileData.email}
                                            onChangeText={(text) => handleInputChange('email', text)}
                                            placeholder="Enter email address"
                                            placeholderTextColor="#666"
                                            keyboardType="email-address"
                                            autoCapitalize="none"
                                        />
                                    </View>
                                </View>

                                <Text style={styles.fieldLabel}>About Me</Text>
                                <View style={styles.inputContainer}>
                                    <TextInput
                                        style={[styles.input, styles.textArea]}
                                        value={profileData.about}
                                        onChangeText={(text) => handleInputChange('about', text)}
                                        placeholder="Tell us about yourself"
                                        placeholderTextColor="#666"
                                        multiline
                                        numberOfLines={4}
                                        textAlignVertical="top"
                                    />
                                </View>

                                <Text style={styles.fieldLabel}>Language</Text>
                                <View style={styles.languageContainer}>
                                    <Text style={styles.languageText}>{selectedLanguageName}</Text>
                                    <Ionicons name="chevron-down" size={20} color="#A0A0A0" />
                                </View>
                            </View>
                        </ScrollView>
                        <View style={styles.footer}>
                            <TouchableOpacity
                                style={styles.updateButton}
                                onPress={updateProfile}
                                disabled={isSaving}
                            >
                                {isSaving ? (
                                    <ActivityIndicator size="small" color="white" />
                                ) : (
                                    <Text style={styles.updateButtonText}>Update Profile</Text>
                                )}
                            </TouchableOpacity>
                        </View>
                    </>
                )}
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#121212',
    },
    keyboardAvoidingView: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
    },
    backButton: {
        width: 40,
        height: 40,
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
    content: {
        flex: 1,
    },
    contentContainer: {
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
    profilePhotoSection: {
        alignItems: 'center',
        marginTop: 16,
        marginBottom: 24,
    },
    profileImageContainer: {
        position: 'relative',
    },
    profileImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
    },
    editPhotoButton: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: '#121212',
        borderRadius: 12,
    },
    successMessage: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#4CAF50',
        padding: 12,
        borderRadius: 8,
        marginBottom: 16,
    },
    successText: {
        color: 'white',
        marginLeft: 8,
        fontWeight: '500',
    },
    formSection: {
        marginBottom: 24,
    },
    fieldLabel: {
        color: 'white',
        fontSize: 16,
        marginBottom: 10,
        marginTop: 16,
    },
    inputContainer: {
        backgroundColor: '#1E1E1E',
        borderRadius: 12,
        overflow: 'hidden',
    },
    input: {
        color: 'white',
        padding: 16,
        fontSize: 16,
    },
    emailContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: 16,
    },
    emailIcon: {
        marginRight: 8,
    },
    emailInput: {
        flex: 1,
        color: 'white',
        padding: 16,
        paddingLeft: 0,
        fontSize: 16,
    },
    textArea: {
        minHeight: 100,
    },
    languageContainer: {
        backgroundColor: '#1E1E1E',
        borderRadius: 12,
        padding: 16,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    languageText: {
        color: 'white',
        fontSize: 16,
    },
    footer: {
        padding: 20,
        borderTopWidth: 1,
        borderTopColor: '#2A2A2A',
    },
    updateButton: {
        backgroundColor: '#4A4AF4',
        borderRadius: 25,
        padding: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    updateButtonText: {
        color: 'white',
        fontWeight: '600',
        fontSize: 16,
    },
});

export default PersonalInfoScreen;