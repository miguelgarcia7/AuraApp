import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, StatusBar } from 'react-native';
import {Ionicons} from "@expo/vector-icons";

const WelcomeScreen = ({ navigation }) => {
    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" />

            {/* Header with Logo */}
            <View style={styles.logo}>
                <Ionicons name="moon" size={24} color="#5D5FEF" />
            </View>

            {/* Main Content */}
            <View style={styles.contentContainer}>
                <Text style={styles.title}>Welcome!</Text>
                <Text style={styles.subtitle}>Begin your journey to better sleep</Text>

                {/* Buttons */}
                <TouchableOpacity
                    style={styles.signUpButton}
                    onPress={() => navigation.navigate('Register')}
                >
                    <Text style={styles.signUpButtonText}>Sign up</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.loginButton}
                    onPress={() => navigation.navigate('Login')}
                >
                    <Text style={styles.loginButtonText}>Log in</Text>
                </TouchableOpacity>
            </View>

            {/* Footer */}
            <View style={styles.footer}>
                <TouchableOpacity onPress={() => navigation.navigate('PrivacyPolicy')}>
                    <Text style={styles.footerText}>Privacy Policy</Text>
                </TouchableOpacity>
                <Text style={styles.footerDot}>·</Text>
                <TouchableOpacity onPress={() => navigation.navigate('TermsOfService')}>
                    <Text style={styles.footerText}>Terms of Service</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#121212',
        paddingHorizontal: 24,
    },
    logo: {
        alignItems: 'center',
        marginTop: 48,
    },
    contentContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        maxWidth: 350,
        alignSelf: 'center',
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: 'white',
        textAlign: 'center',
        marginBottom: 12,
    },
    subtitle: {
        fontSize: 18,
        color: '#A0A0A0',
        textAlign: 'center',
        marginBottom: 48,
    },
    signUpButton: {
        width: '100%',
        backgroundColor: '#4F46E5',
        paddingVertical: 16,
        borderRadius: 12,
        marginBottom: 16,
    },
    signUpButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
        textAlign: 'center',
    },
    loginButton: {
        width: '100%',
        backgroundColor: '#1E1E1E',
        paddingVertical: 16,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#333333',
    },
    loginButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
        textAlign: 'center',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        paddingVertical: 24,
        marginBottom: 8,
    },
    footerText: {
        fontSize: 14,
        color: '#A0A0A0',
    },
    footerDot: {
        fontSize: 14,
        color: '#A0A0A0',
        marginHorizontal: 8,
    },
});

export default WelcomeScreen;