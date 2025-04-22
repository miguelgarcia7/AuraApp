// screens/RegisterScreen.js
import React, { useState } from 'react';
import {
    StyleSheet,
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ActivityIndicator,
    SafeAreaView,
    StatusBar,
    ScrollView,
    Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as SecureStore from 'expo-secure-store';

const RegisterScreen = ({ navigation }) => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        firstName: '',
        lastName: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [agreeToTerms, setAgreeToTerms] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const updateFormData = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const validateForm = () => {
        if (!formData.email || !formData.password || !formData.firstName || !formData.lastName) {
            setError('Please fill in all required fields');
            return false;
        }

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return false;
        }

        if (!agreeToTerms) {
            setError('You must agree to the Terms & Conditions');
            return false;
        }

        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            setError('Please enter a valid email address');
            return false;
        }

        // Password strength validation
        if (formData.password.length < 8) {
            setError('Password must be at least 8 characters long');
            return false;
        }

        return true;
    };

    const handleRegister = async () => {
        if (!validateForm()) {
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            // Create FormData for API call
            const formDataObj = new FormData();
            formDataObj.append('email', formData.email);
            formDataObj.append('password', formData.password);
            formDataObj.append('first_name', formData.firstName);
            formDataObj.append('last_name', formData.lastName);

            // Make API call to register endpoint
            const response = await fetch('https://dev.3dnaturesounds.com/api/register/', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                },
                body: formDataObj
            });

            const data = await response.json();

            if (data.success === 1) {
                // Show success message
                Alert.alert(
                    "Account Created",
                    "Your account has been created successfully! Please log in with your credentials.",
                    [
                        {
                            text: "OK",
                            onPress: () => navigation.navigate('Login')
                        }
                    ]
                );
            } else {
                setError(data.message || 'Registration failed. Please try again.');
            }
        } catch (err) {
            console.error('Registration error:', err);
            setError('Connection error. Please try again later.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleTermsPress = () => {
        navigation.navigate('TermsOfService');
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" />
            {/* Header with Logo */}
            <View style={styles.logo}>
                <Ionicons name="moon" size={24} color="#5D5FEF" />
            </View>

            {/* Back button */}
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <Ionicons name="arrow-back" size={24} color="white" />
                    <Text style={styles.backButtonText}>Back</Text>
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                <View style={styles.content}>
                    <View style={styles.titleContainer}>
                        <Text style={styles.title}>Create Account ✨</Text>
                        <Text style={styles.subtitle}>
                            Join Aura to discover a world of tranquil sleep sounds and relaxation
                        </Text>
                    </View>

                    {error ? (
                        <View style={styles.errorContainer}>
                            <Text style={styles.errorText}>{error}</Text>
                        </View>
                    ) : null}

                    <View style={styles.formContainer}>
                        {/* First Name */}
                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>First Name</Text>
                            <View style={styles.inputWrapper}>
                                <Ionicons name="person-outline" size={20} color="#808080" style={styles.inputIcon} />
                                <TextInput
                                    style={styles.input}
                                    placeholder="First Name"
                                    placeholderTextColor="#808080"
                                    value={formData.firstName}
                                    onChangeText={(text) => updateFormData('firstName', text)}
                                />
                            </View>
                        </View>

                        {/* Last Name */}
                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Last Name</Text>
                            <View style={styles.inputWrapper}>
                                <Ionicons name="person-outline" size={20} color="#808080" style={styles.inputIcon} />
                                <TextInput
                                    style={styles.input}
                                    placeholder="Last Name"
                                    placeholderTextColor="#808080"
                                    value={formData.lastName}
                                    onChangeText={(text) => updateFormData('lastName', text)}
                                />
                            </View>
                        </View>

                        {/* Email */}
                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Email</Text>
                            <View style={styles.inputWrapper}>
                                <Ionicons name="mail-outline" size={20} color="#808080" style={styles.inputIcon} />
                                <TextInput
                                    style={styles.input}
                                    placeholder="Email"
                                    placeholderTextColor="#808080"
                                    value={formData.email}
                                    onChangeText={(text) => updateFormData('email', text)}
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                />
                            </View>
                        </View>

                        {/* Password */}
                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Password</Text>
                            <View style={styles.inputWrapper}>
                                <Ionicons name="lock-closed-outline" size={20} color="#808080" style={styles.inputIcon} />
                                <TextInput
                                    style={styles.input}
                                    placeholder="Password (min. 8 characters)"
                                    placeholderTextColor="#808080"
                                    value={formData.password}
                                    onChangeText={(text) => updateFormData('password', text)}
                                    secureTextEntry={!showPassword}
                                />
                                <TouchableOpacity
                                    style={styles.eyeIcon}
                                    onPress={() => setShowPassword(!showPassword)}
                                >
                                    <Ionicons
                                        name={showPassword ? "eye-off-outline" : "eye-outline"}
                                        size={20}
                                        color="#808080"
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* Confirm Password */}
                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Confirm Password</Text>
                            <View style={styles.inputWrapper}>
                                <Ionicons name="lock-closed-outline" size={20} color="#808080" style={styles.inputIcon} />
                                <TextInput
                                    style={styles.input}
                                    placeholder="Confirm Password"
                                    placeholderTextColor="#808080"
                                    value={formData.confirmPassword}
                                    onChangeText={(text) => updateFormData('confirmPassword', text)}
                                    secureTextEntry={!showConfirmPassword}
                                />
                                <TouchableOpacity
                                    style={styles.eyeIcon}
                                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                                >
                                    <Ionicons
                                        name={showConfirmPassword ? "eye-off-outline" : "eye-outline"}
                                        size={20}
                                        color="#808080"
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* Terms and Conditions */}
                        <View style={styles.checkboxContainer}>
                            <TouchableOpacity
                                style={styles.checkbox}
                                onPress={() => setAgreeToTerms(!agreeToTerms)}
                            >
                                {agreeToTerms ? (
                                    <Ionicons name="checkbox" size={22} color="#5D5FEF" />
                                ) : (
                                    <Ionicons name="square-outline" size={22} color="#808080" />
                                )}
                            </TouchableOpacity>
                            <Text style={styles.checkboxLabel}>
                                I agree to Aura{' '}
                                <Text style={styles.textLink} onPress={handleTermsPress}>
                                    Terms & Conditions
                                </Text>.
                            </Text>
                        </View>
                    </View>

                    <View style={styles.footer}>
                        <Text style={styles.footerText}>
                            Already have an account?{' '}
                            <Text
                                style={styles.textLink}
                                onPress={() => navigation.navigate('Login')}
                            >
                                Sign in
                            </Text>
                        </Text>

                        <TouchableOpacity
                            style={styles.button}
                            onPress={handleRegister}
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <ActivityIndicator color="white" />
                            ) : (
                                <Text style={styles.buttonText}>Create Account</Text>
                            )}
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#121212',
    },
    logo: {
        alignItems: 'center',
        marginTop: 48,
    },
    scrollView: {
        flex: 1,
    },
    header: {
        padding: 16,
    },
    backButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
    },
    backButtonText: {
        color: 'white',
        fontSize: 16,
        marginLeft: 8,
    },
    content: {
        padding: 24,
        paddingBottom: 40,
    },
    titleContainer: {
        marginBottom: 24,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 14,
        color: '#A0A0A0',
        lineHeight: 20,
    },
    errorContainer: {
        backgroundColor: 'rgba(255, 0, 0, 0.1)',
        borderRadius: 8,
        padding: 12,
        marginBottom: 16,
    },
    errorText: {
        color: '#FF6B6B',
        fontSize: 14,
    },
    formContainer: {
        marginBottom: 24,
    },
    inputContainer: {
        marginBottom: 16,
    },
    label: {
        fontSize: 14,
        fontWeight: '500',
        color: 'white',
        marginBottom: 8,
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#2A2A2A',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#3A3A3A',
    },
    inputIcon: {
        padding: 12,
    },
    input: {
        flex: 1,
        color: 'white',
        paddingVertical: 12,
        paddingRight: 12,
    },
    eyeIcon: {
        padding: 12,
    },
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 8,
    },
    checkbox: {
        marginRight: 8,
    },
    checkboxLabel: {
        fontSize: 14,
        color: '#A0A0A0',
        flex: 1,
    },
    textLink: {
        color: '#5D5FEF',
    },
    footer: {
        marginTop: 16,
    },
    footerText: {
        textAlign: 'center',
        fontSize: 14,
        color: '#A0A0A0',
        marginBottom: 16,
    },
    button: {
        backgroundColor: '#5D5FEF',
        borderRadius: 50,
        paddingVertical: 16,
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    }
});

export default RegisterScreen;