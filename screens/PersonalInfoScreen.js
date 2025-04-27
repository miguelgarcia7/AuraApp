import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    SafeAreaView,
    Image,
    Alert,
    ActivityIndicator,
    Platform,
    ScrollView,
    KeyboardAvoidingView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as SecureStore from 'expo-secure-store';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { getProfilePhotoPath } from '../utils/profileUtils';
import { IMG_BASE_URL } from '../utils/constants';

const PersonalInfoScreen = () => {
    const navigation = useNavigation();
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [profileData, setProfileData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        about: '',
        photo: '',
        default_language_id: 1,
    });
    const [languages, setLanguages] = useState([]);
    const [selectedImage, setSelectedImage] = useState(null);
    const [imageSource, setImageSource] = useState({ uri: `${IMG_BASE_URL}/default-avatar.png` });

    useEffect(() => {
        fetchProfileData();
    }, []);

    useEffect(() => {

        const updateImageSource = async () => {
            if (selectedImage) {
                setImageSource({ uri: selectedImage.uri });
            } else if (profileData.photo) {
                const profileId = await SecureStore.getItemAsync('profile_id');
                setImageSource({ uri: getProfilePhotoPath(profileId, profileData.photo) });
            } else {
                setImageSource({ uri: `${IMG_BASE_URL}/default-avatar.png` });
            }
        };

        updateImageSource();
    }, [selectedImage, profileData.photo]);

    const fetchProfileData = async () => {
        try {
            const loginCode = await SecureStore.getItemAsync('login_code');
            const profileId = await SecureStore.getItemAsync('profile_id');

            const response = await fetch('https://app.3dnaturesounds.com/api/get_profile_for_edit/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: `login_code=${loginCode}&profile_id=${profileId}`,
            });

            const data = await response.json();

            if (data.success === 1) {
                setProfileData({
                    ...data.profile,
                    default_language_id: data.profile.language_id || 1,
                });
                setLanguages(data.languages || []);
            } else {
                Alert.alert('Error', 'Failed to load profile data');
            }
        } catch (error) {
            console.error('Error fetching profile:', error);
            Alert.alert('Error', 'Failed to load profile data');
        } finally {
            setLoading(false);
        }
    };

    const pickImage = async () => {
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (permissionResult.granted === false) {
            Alert.alert('Permission Required', 'Please grant access to your photo library');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
        });

        if (!result.canceled) {
            setSelectedImage(result.assets[0]);
        }
    };

    const handleUpdateProfile = async () => {
        try {
            setUpdating(true);
            const loginCode = await SecureStore.getItemAsync('login_code');
            const profileId = await SecureStore.getItemAsync('profile_id');

            const formData = new FormData();
            formData.append('profile_id', profileId);
            formData.append('login_code', loginCode);
            formData.append('first_name', profileData.first_name);
            formData.append('last_name', profileData.last_name);
            formData.append('email', profileData.email);
            formData.append('about', profileData.about);
            formData.append('default_language_id', profileData.default_language_id);

            if (selectedImage) {
                const uri = selectedImage.uri;
                const filename = uri.split('/').pop();
                const match = /\.(\w+)$/.exec(filename);
                const type = match ? `image/${match[1]}` : 'image/jpeg';

                formData.append('photo', {
                    uri: Platform.OS === 'ios' ? uri.replace('file://', '') : uri,
                    name: filename,
                    type,
                });
            }

            const response = await fetch('https://app.3dnaturesounds.com/api/update_profile/', {
                method: 'POST',
                body: formData,
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            const data = await response.json();

            if (data.success === 1) {
                setShowSuccess(true);
                setTimeout(() => {
                    setShowSuccess(false);
                }, 3000);
            } else {
                Alert.alert('Error', data.error || 'Failed to update profile');
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            Alert.alert('Error', 'Failed to update profile');
        } finally {
            setUpdating(false);
        }
    };



    if (loading) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#4A4AF4" />
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.navigate('Account')}
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
                <ScrollView style={styles.content}>
                    <View style={styles.profilePhotoSection}>
                        <TouchableOpacity onPress={pickImage}>
                            <View style={styles.profileImageContainer}>
                                <Image source={imageSource} style={styles.profileImage} />
                                <View style={styles.editPhotoButton}>
                                    <Ionicons name="camera" size={20} color="#4A4AF4" />
                                </View>
                            </View>
                        </TouchableOpacity>
                    </View>

                    {showSuccess && (
                        <View style={styles.successMessage}>
                            <Ionicons name="checkmark-circle" size={20} color="white" />
                            <Text style={styles.successText}>Profile updated successfully</Text>
                        </View>
                    )}

                    <View style={styles.formSection}>
                        <Text style={styles.fieldLabel}>First Name</Text>
                        <View style={styles.inputContainer}>
                            <TextInput
                                style={styles.input}
                                value={profileData.first_name}
                                onChangeText={(text) => setProfileData({ ...profileData, first_name: text })}
                                placeholder="Enter first name"
                                placeholderTextColor="#666"
                            />
                        </View>

                        <Text style={styles.fieldLabel}>Last Name</Text>
                        <View style={styles.inputContainer}>
                            <TextInput
                                style={styles.input}
                                value={profileData.last_name}
                                onChangeText={(text) => setProfileData({ ...profileData, last_name: text })}
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
                                    onChangeText={(text) => setProfileData({ ...profileData, email: text })}
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
                                onChangeText={(text) => setProfileData({ ...profileData, about: text })}
                                placeholder="Tell us about yourself"
                                placeholderTextColor="#666"
                                multiline
                                numberOfLines={4}
                                textAlignVertical="top"
                            />
                        </View>
                    </View>
                </ScrollView>

                <View style={styles.footer}>
                    <TouchableOpacity
                        style={styles.updateButton}
                        onPress={handleUpdateProfile}
                        disabled={updating}
                    >
                        {updating ? (
                            <ActivityIndicator size="small" color="white" />
                        ) : (
                            <Text style={styles.updateButtonText}>Update Profile</Text>
                        )}
                    </TouchableOpacity>
                </View>
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
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        flex: 1,
        paddingHorizontal: 20,
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
        backgroundColor: '#1E1E1E',
    },
    editPhotoButton: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: '#121212',
        borderRadius: 12,
        padding: 8,
        borderWidth: 1,
        borderColor: '#4A4AF4',
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