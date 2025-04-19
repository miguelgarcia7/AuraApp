// screens/LoginScreen.js
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
    Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as SecureStore from 'expo-secure-store';

const LoginScreen = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [agreeToTerms, setAgreeToTerms] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleLogin = async () => {
        if (!email || !password) {
            setError('Please fill in all fields');
            return;
        }

        if (!agreeToTerms) {
            setError('You must agree to the Terms & Conditions');
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            const response = await fetch('https://dev.3dnaturesounds.com/api/login/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (data.success === 1) {
                // Store credentials securely
                await SecureStore.setItemAsync('profile_id', data.profile_id.toString());
                await SecureStore.setItemAsync('login_code', data.login_code);

                console.log('Login successful', {
                    profile_id: data.profile_id,
                    login_code: data.login_code
                });

                // Navigate to main app screen (not implemented yet)
                // navigation.navigate('Home');
                navigation.navigate('Home');
                Alert.alert('Success', 'Login successful!');
            } else {
                setError('Login failed. Please check your credentials.');
            }
        } catch (err) {
            console.error('Login error:', err);
            setError('Connection error. Please try again later.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" />

            {/* Back button (if needed) */}
            <View style={styles.header}>
                <Ionicons name="arrow-back" size={24} color="white" />
            </View>

            <View style={styles.content}>
                <View style={styles.titleContainer}>
                    <Text style={styles.title}>Join Aura Today ✨</Text>
                    <Text style={styles.subtitle}>
                        Create your Aura account to unlock a world of tranquil sleep sounds
                    </Text>
                </View>

                {error ? (
                    <View style={styles.errorContainer}>
                        <Text style={styles.errorText}>{error}</Text>
                    </View>
                ) : null}

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Email</Text>
                    <View style={styles.inputWrapper}>
                        <Ionicons name="mail-outline" size={20} color="#808080" style={styles.inputIcon} />
                        <TextInput
                            style={styles.input}
                            placeholder="Email"
                            placeholderTextColor="#808080"
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                            autoCapitalize="none"
                        />
                    </View>
                </View>

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Password</Text>
                    <View style={styles.inputWrapper}>
                        <Ionicons name="lock-closed-outline" size={20} color="#808080" style={styles.inputIcon} />
                        <TextInput
                            style={styles.input}
                            placeholder="Password"
                            placeholderTextColor="#808080"
                            value={password}
                            onChangeText={setPassword}
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
                        I agree to Aura <Text style={styles.textLink}>Terms & Conditions</Text>.
                    </Text>
                </View>

                <View style={styles.footer}>
                    <Text style={styles.footerText}>
                        Already have an account? <Text style={styles.textLink} onPress={() => {}}>Sign in</Text>
                    </Text>

                    <TouchableOpacity
                        style={styles.button}
                        onPress={handleLogin}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <ActivityIndicator color="white" />
                        ) : (
                            <Text style={styles.buttonText}>Sign up</Text>
                        )}
                    </TouchableOpacity>
                </View>
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
        padding: 16,
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
        marginBottom: 24,
    },
    checkbox: {
        marginRight: 8,
    },
    checkboxLabel: {
        fontSize: 14,
        color: '#A0A0A0',
    },
    textLink: {
        color: '#5D5FEF',
    },
    footer: {
        marginTop: 'auto',
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

export default LoginScreen;