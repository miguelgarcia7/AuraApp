// screens/HelpSupportScreen.js
import React from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    SafeAreaView,
    StatusBar,
    ScrollView,
    Linking
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const supportOptions = [
    {
        id: 'faq',
        title: 'FAQ',
        icon: 'help-circle',
        screen: 'FAQ'
    },
    {
        id: 'contact',
        title: 'Contact Support',
        icon: 'mail',
        screen: 'ContactSupport'
    },
    {
        id: 'privacy',
        title: 'Privacy Policy',
        icon: 'lock-closed',
        screen: 'PrivacyPolicy'
    },
    {
        id: 'terms',
        title: 'Terms of Service',
        icon: 'document-text',
        screen: 'TermsOfService'
    },
    {
        id: 'feedback',
        title: 'Feedback',
        icon: 'chatbubble',
        screen: 'Feedback'
    },
    {
        id: 'about',
        title: 'About us',
        icon: 'information-circle',
        screen: 'AboutUs'
    },
    {
        id: 'rate',
        title: 'Rate us',
        icon: 'star',
        action: () => {
            // This would typically open the app store page
            Linking.openURL('https://apps.apple.com');
        }
    },
    {
        id: 'website',
        title: 'Visit Our Website',
        icon: 'globe',
        action: () => {
            Linking.openURL('https://3dnaturesounds.com');
        }
    },
    {
        id: 'social',
        title: 'Follow us on Social Media',
        icon: 'logo-instagram',
        screen: 'SocialMedia'
    }
];

const HelpSupportScreen = ({ navigation }) => {
    const handleOptionPress = (option) => {
        if (option.action) {
            option.action();
        } else if (option.screen) {
            navigation.navigate(option.screen);
        }
    };

    const renderSupportOption = (option) => (
        <TouchableOpacity
            key={option.id}
            style={styles.optionItem}
            onPress={() => handleOptionPress(option)}
        >
            <Text style={styles.optionTitle}>{option.title}</Text>
            <Ionicons name="chevron-forward" size={20} color="#A0A0A0" />
        </TouchableOpacity>
    );

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
                <Text style={styles.headerTitle}>Help & Support</Text>
                <View style={styles.placeholder} />
            </View>

            <ScrollView style={styles.content}>
                <View style={styles.optionsContainer}>
                    {supportOptions.map(option => renderSupportOption(option))}
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
    },
    optionsContainer: {
        paddingTop: 8,
    },
    optionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 16,
        paddingHorizontal: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#2A2A2A',
    },
    optionTitle: {
        color: 'white',
        fontSize: 16,
        fontWeight: '500',
    },
});

export default HelpSupportScreen;