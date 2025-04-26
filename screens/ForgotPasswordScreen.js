// screens/ForgotPasswordScreen.js
import React, { useState } from 'react';
import {
    StyleSheet,
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ActivityIndicator,
    SafeAreaView,
    StatusBar
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const ForgotPasswordScreen = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmit = async () => {
        if (!email) {
            setError('Please enter your email');
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            const response = await fetch('https://app.3dnaturesounds.com/api/send_reset_code/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();

            if (data.success === 1) {
                setSuccessMessage(data.message || 'Reset code sent successfully.');
                setIsSubmitted(true);
            } else {
                setError(data.message || 'Invalid email. Please check and try again.');
            }
        } catch (err) {
            console.error('Reset code error:', err);
            setError('Connection error. Please try again later.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" />

            {/* Header with Logo */}
            <View style={styles.logo}>
                <Ionicons name="moon" size={24} color="#5D5FEF" />
            </View>

            {/* Back button (if needed) */}
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <Ionicons name="arrow-back" size={24} color="white" />
                    <Text style={styles.backButtonText}>Back</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.content}>
                {!isSubmitted ? (
                    <>
                        <View style={styles.titleContainer}>
                            <Text style={styles.title}>Forgot Your Password? 🔑</Text>
                            <Text style={styles.subtitle}>
                                No worries! Enter the email associated with your AuraApp account below.
                                We'll send you a one-time verification code to reset your password.
                            </Text>
                        </View>

                        {error ? (
                            <View style={styles.errorContainer}>
                                <Text style={styles.errorText}>{error}</Text>
                            </View>
                        ) : null}

                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Your Registered Email</Text>
                            <View style={styles.inputWrapper}>
                                <Ionicons name="mail-outline" size={20} color="#808080" style={styles.inputIcon} />
                                <TextInput
                                    style={styles.input}
                                    placeholder="Enter your email"
                                    placeholderTextColor="#808080"
                                    value={email}
                                    onChangeText={setEmail}
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                />
                            </View>
                        </View>

                        <View style={styles.buttonContainer}>
                            <TouchableOpacity
                                style={styles.button}
                                onPress={handleSubmit}
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <ActivityIndicator color="white" />
                                ) : (
                                    <Text style={styles.buttonText}>Reset Password</Text>
                                )}
                            </TouchableOpacity>
                        </View>
                    </>
                ) : (
                    <View style={styles.successContainer}>
                        <View style={styles.successIconContainer}>
                            <Ionicons name="checkmark-circle" size={60} color="#5D5FEF" />
                        </View>
                        <Text style={styles.successTitle}>Success!</Text>
                        <Text style={styles.successMessage}>{successMessage}</Text>
                        <Text style={styles.successInstructions}>
                            Please check your email for the verification code.
                        </Text>
                        <TouchableOpacity
                            style={styles.backToLoginButton}
                            onPress={() => {
                                setIsSubmitted(false);
                                setSuccessMessage('');
                            }}
                        >
                            <Text style={styles.backToLoginText}>Back to Reset Password</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </View>
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
        flex: 1,
        padding: 24,
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
    inputContainer: {
        marginBottom: 24,
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
    buttonContainer: {
        marginTop: 'auto',
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
    },
    // Success state styles
    successContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 24,
    },
    successIconContainer: {
        backgroundColor: 'rgba(93, 95, 239, 0.1)',
        borderRadius: 50,
        padding: 20,
        marginBottom: 20,
    },
    successTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 12,
    },
    successMessage: {
        fontSize: 16,
        color: '#A0A0A0',
        textAlign: 'center',
        marginBottom: 12,
    },
    successInstructions: {
        fontSize: 14,
        color: '#A0A0A0',
        textAlign: 'center',
    },
    backToLoginButton: {
        marginTop: 40,
    },
    backToLoginText: {
        color: '#5D5FEF',
        fontSize: 16,
        textDecorationLine: 'underline',
    }
});

export default ForgotPasswordScreen;