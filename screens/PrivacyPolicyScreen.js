// screens/PrivacyPolicyScreen.js
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

const PrivacyPolicyScreen = ({ navigation }) => {
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
                <Text style={styles.headerTitle}>Privacy Policy</Text>
                <View style={styles.placeholder} />
            </View>

            <ScrollView style={styles.content}>
                <Text style={styles.dateText}>Effective Date: December 19, 2024</Text>

                <Text style={styles.policyText}>
                    Aura ("Aura," "we," "us," or "our") is committed to protecting the privacy of our users ("you" or "your"). This Privacy Policy explains what information we collect, how we use it, and how we protect it.
                </Text>

                <View style={styles.sectionContainer}>
                    <Text style={styles.sectionTitle}>1. Information We Collect:</Text>

                    <View style={styles.bulletItem}>
                        <Text style={styles.bulletPoint}>•</Text>
                        <Text style={styles.bulletText}>
                            <Text style={styles.boldText}>Account Information:</Text> When you create a Aura account, we collect your email address, username (if applicable), and password.
                        </Text>
                    </View>

                    <View style={styles.bulletItem}>
                        <Text style={styles.bulletPoint}>•</Text>
                        <Text style={styles.bulletText}>
                            <Text style={styles.boldText}>Usage Data:</Text> We collect data about how you use the app, such as the sounds you listen to, the mixes you create, and the features you use.
                        </Text>
                    </View>

                    <View style={styles.bulletItem}>
                        <Text style={styles.bulletPoint}>•</Text>
                        <Text style={styles.bulletText}>
                            <Text style={styles.boldText}>Device Information:</Text> We collect information about the device you use to access Aura, such as the device type, operating system, and IP address.
                        </Text>
                    </View>
                </View>

                <View style={styles.sectionContainer}>
                    <Text style={styles.sectionTitle}>2. How We Use Your Information:</Text>

                    <View style={styles.bulletItem}>
                        <Text style={styles.bulletPoint}>•</Text>
                        <Text style={styles.bulletText}>
                            <Text style={styles.boldText}>Provide and Improve the Service:</Text> We use your information to provide you with Aura, personalize your experience, and develop new features.
                        </Text>
                    </View>

                    <View style={styles.bulletItem}>
                        <Text style={styles.bulletPoint}>•</Text>
                        <Text style={styles.bulletText}>
                            <Text style={styles.boldText}>Communicate with You:</Text> We may use your email address to send you updates about Aura, respond to your inquiries, or provide customer support.
                        </Text>
                    </View>

                    <View style={styles.bulletItem}>
                        <Text style={styles.bulletPoint}>•</Text>
                        <Text style={styles.bulletText}>
                            <Text style={styles.boldText}>Analytics:</Text> We use your information to analyze how users interact with Aura, identify trends, and improve our service.
                        </Text>
                    </View>
                </View>

                <View style={styles.sectionContainer}>
                    <Text style={styles.sectionTitle}>3. Data Protection:</Text>

                    <View style={styles.bulletItem}>
                        <Text style={styles.bulletPoint}>•</Text>
                        <Text style={styles.bulletText}>
                            <Text style={styles.boldText}>Security Measures:</Text> We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.
                        </Text>
                    </View>

                    <View style={styles.bulletItem}>
                        <Text style={styles.bulletPoint}>•</Text>
                        <Text style={styles.bulletText}>
                            <Text style={styles.boldText}>Data Retention:</Text> We retain your personal information only for as long as necessary to fulfill the purposes outlined in this Privacy Policy, unless a longer retention period is required by law.
                        </Text>
                    </View>
                </View>

                <View style={styles.sectionContainer}>
                    <Text style={styles.sectionTitle}>4. Third-Party Services:</Text>

                    <Text style={styles.policyText}>
                        Aura may use third-party services to help provide our service. These third parties may have access to your personal information only to perform specific tasks on our behalf and are obligated not to disclose or use it for any other purpose.
                    </Text>
                </View>

                <View style={styles.sectionContainer}>
                    <Text style={styles.sectionTitle}>5. Your Rights:</Text>

                    <Text style={styles.policyText}>
                        Depending on your location, you may have certain rights regarding your personal information, such as the right to access, correct, delete, or restrict processing of your data. To exercise these rights, please contact us at privacy@aura-app.com.
                    </Text>
                </View>

                <View style={styles.sectionContainer}>
                    <Text style={styles.sectionTitle}>6. Changes to This Privacy Policy:</Text>

                    <Text style={styles.policyText}>
                        We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Effective Date" at the top of this Privacy Policy.
                    </Text>
                </View>

                <View style={[styles.sectionContainer, styles.lastSection]}>
                    <Text style={styles.sectionTitle}>7. Contact Us:</Text>

                    <Text style={styles.policyText}>
                        If you have any questions or concerns about this Privacy Policy, please contact us at:
                    </Text>

                    <Text style={[styles.policyText, styles.contactInfo]}>
                        Email: privacy@aura-app.com{'\n'}
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
    policyText: {
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
    boldText: {
        fontWeight: 'bold',
    },
    contactInfo: {
        marginTop: 8,
    }
});

export default PrivacyPolicyScreen;