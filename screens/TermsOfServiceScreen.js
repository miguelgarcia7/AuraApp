// screens/TermsOfServiceScreen.js
import React from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    SafeAreaView,
    StatusBar,
    ScrollView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const TermsOfServiceScreen = ({ navigation }) => {
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
                <Text style={styles.headerTitle}>Terms of Service</Text>
                <View style={styles.placeholder} />
            </View>

            <ScrollView style={styles.content}>
                <Text style={styles.dateText}>Effective Date: December 20, 2024</Text>

                <Text style={styles.termsText}>
                    These Terms of Service ("Terms") govern your access to and use of the Aura mobile application ("App"). By accessing or using the App, you agree to be bound by these Terms.
                </Text>

                <View style={styles.sectionContainer}>
                    <Text style={styles.sectionTitle}>1. Use of the App:</Text>

                    <View style={styles.bulletItem}>
                        <Text style={styles.bulletPoint}>•</Text>
                        <Text style={styles.bulletText}>
                            You must be at least 13 years old to use the App.
                        </Text>
                    </View>

                    <View style={styles.bulletItem}>
                        <Text style={styles.bulletPoint}>•</Text>
                        <Text style={styles.bulletText}>
                            You are responsible for maintaining the confidentiality of your account information and password.
                        </Text>
                    </View>

                    <View style={styles.bulletItem}>
                        <Text style={styles.bulletPoint}>•</Text>
                        <Text style={styles.bulletText}>
                            You are responsible for all activity that occurs under your account.
                        </Text>
                    </View>

                    <View style={styles.bulletItem}>
                        <Text style={styles.bulletPoint}>•</Text>
                        <Text style={styles.bulletText}>
                            You agree to use the App only for lawful purposes and in accordance with all applicable laws and regulations.
                        </Text>
                    </View>

                    <View style={styles.bulletItem}>
                        <Text style={styles.bulletPoint}>•</Text>
                        <Text style={styles.bulletText}>
                            You agree not to use the App in any way that could damage, disable, overburden, or impair any server or network connected to the App.
                        </Text>
                    </View>

                    <View style={styles.bulletItem}>
                        <Text style={styles.bulletPoint}>•</Text>
                        <Text style={styles.bulletText}>
                            You agree not to attempt to gain unauthorized access to the App or any related systems or networks.
                        </Text>
                    </View>
                </View>

                <View style={styles.sectionContainer}>
                    <Text style={styles.sectionTitle}>2. Content:</Text>

                    <View style={styles.bulletItem}>
                        <Text style={styles.bulletPoint}>•</Text>
                        <Text style={styles.bulletText}>
                            The App contains content owned or licensed by Aura. This content is protected by copyright, trademark, and other laws.
                        </Text>
                    </View>

                    <View style={styles.bulletItem}>
                        <Text style={styles.bulletPoint}>•</Text>
                        <Text style={styles.bulletText}>
                            You may not modify, reproduce, distribute, create derivative works from, publicly display, or exploit in any way any content from the App without explicit permission from Aura.
                        </Text>
                    </View>

                    <View style={styles.bulletItem}>
                        <Text style={styles.bulletPoint}>•</Text>
                        <Text style={styles.bulletText}>
                            Any user-generated content you submit to the App may be used by Aura for any purpose related to the App.
                        </Text>
                    </View>
                </View>

                <View style={styles.sectionContainer}>
                    <Text style={styles.sectionTitle}>3. Subscriptions and Payments:</Text>

                    <View style={styles.bulletItem}>
                        <Text style={styles.bulletPoint}>•</Text>
                        <Text style={styles.bulletText}>
                            Certain features of the App may require a subscription. Subscription fees are clearly displayed before purchase.
                        </Text>
                    </View>

                    <View style={styles.bulletItem}>
                        <Text style={styles.bulletPoint}>•</Text>
                        <Text style={styles.bulletText}>
                            Subscriptions automatically renew unless auto-renew is turned off at least 24 hours before the end of the current period.
                        </Text>
                    </View>

                    <View style={styles.bulletItem}>
                        <Text style={styles.bulletPoint}>•</Text>
                        <Text style={styles.bulletText}>
                            Payment will be charged to your App Store or Google Play account at confirmation of purchase.
                        </Text>
                    </View>
                </View>

                <View style={styles.sectionContainer}>
                    <Text style={styles.sectionTitle}>4. Disclaimer of Warranties:</Text>

                    <Text style={styles.termsText}>
                        THE APP IS PROVIDED "AS IS" WITHOUT WARRANTY OF ANY KIND. AURA DISCLAIMS ALL WARRANTIES, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.
                    </Text>
                </View>

                <View style={styles.sectionContainer}>
                    <Text style={styles.sectionTitle}>5. Limitation of Liability:</Text>

                    <Text style={styles.termsText}>
                        IN NO EVENT SHALL AURA BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING WITHOUT LIMITATION, LOSS OF PROFITS, DATA, USE, GOODWILL, OR OTHER INTANGIBLE LOSSES, RESULTING FROM YOUR ACCESS TO OR USE OF OR INABILITY TO ACCESS OR USE THE APP.
                    </Text>
                </View>

                <View style={styles.sectionContainer}>
                    <Text style={styles.sectionTitle}>6. Termination:</Text>

                    <Text style={styles.termsText}>
                        Aura may terminate or suspend your account and access to the App at any time, without prior notice or liability, for any reason, including without limitation if you breach these Terms.
                    </Text>
                </View>

                <View style={styles.sectionContainer}>
                    <Text style={styles.sectionTitle}>7. Changes to Terms:</Text>

                    <Text style={styles.termsText}>
                        Aura reserves the right to modify or replace these Terms at any time. If a revision is material, we will provide at least 30 days' notice prior to any new terms taking effect.
                    </Text>
                </View>

                <View style={[styles.sectionContainer, styles.lastSection]}>
                    <Text style={styles.sectionTitle}>8. Contact Us:</Text>

                    <Text style={styles.termsText}>
                        If you have any questions about these Terms, please contact us at:
                    </Text>

                    <Text style={[styles.termsText, styles.contactInfo]}>
                        Email: terms@aura-app.com{'\n'}
                        Address: 123 Sleep Avenue, Suite 100{'\n'}
                        Dreamland, CA 94107{'\n'}
                        United States
                    </Text>
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
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#2A2A2A',
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
    content: {
        flex: 1,
        padding: 16,
    },
    dateText: {
        color: 'white',
        fontSize: 16,
        marginBottom: 16,
    },
    termsText: {
        color: 'white',
        fontSize: 14,
        lineHeight: 22,
        marginBottom: 16,
    },
    sectionContainer: {
        marginBottom: 24,
    },
    lastSection: {
        marginBottom: 40,
    },
    sectionTitle: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 12,
    },
    bulletItem: {
        flexDirection: 'row',
        marginBottom: 12,
    },
    bulletPoint: {
        color: 'white',
        fontSize: 14,
        marginRight: 8,
        top: 2,
    },
    bulletText: {
        color: 'white',
        fontSize: 14,
        lineHeight: 22,
        flex: 1,
    },
    contactInfo: {
        marginTop: 8,
    }
});

export default TermsOfServiceScreen;