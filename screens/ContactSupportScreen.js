// screens/ContactSupportScreen.js
import React from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    SafeAreaView,
    StatusBar,
    ScrollView,
    Linking,
    Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const supportOptions = [
    {
        id: 'customer_support',
        title: 'Customer Support',
        icon: 'headset',
        url: 'https://app.3dnaturesounds.com/support'
    },
    {
        id: 'website',
        title: 'Website',
        icon: 'globe',
        url: 'https://app.3dnaturesounds.com/'
    },
    {
        id: 'whatsapp',
        title: 'WhatsApp',
        icon: 'logo-whatsapp',
        url: 'https://whatsapp.com/'
    },
    {
        id: 'facebook',
        title: 'Facebook',
        icon: 'logo-facebook',
        url: 'https://facebook.com/'
    },
    {
        id: 'twitter',
        title: 'X (Formerly Twitter)',
        icon: 'logo-twitter',
        url: 'https://twitter.com/'
    },
    {
        id: 'instagram',
        title: 'Instagram',
        icon: 'logo-instagram',
        url: 'https://instagram.com/'
    }
];

const ContactSupportScreen = ({ navigation }) => {
    const handleOptionPress = (option) => {
        Linking.canOpenURL(option.url)
            .then(supported => {
                if (supported) {
                    Linking.openURL(option.url);
                } else {
                    Alert.alert(
                        'Error',
                        `Cannot open URL: ${option.url}`,
                        [{ text: 'OK' }]
                    );
                }
            })
            .catch(err => {
                console.error('An error occurred', err);
                Alert.alert(
                    'Error',
                    'Something went wrong while trying to open the link',
                    [{ text: 'OK' }]
                );
            });
    };

    const renderSupportOption = (option) => {
        // Special case for X (Twitter) icon
        const iconName = option.id === 'twitter' ? 'logo-twitter' : option.icon;

        return (
            <TouchableOpacity
                key={option.id}
                style={styles.optionItem}
                onPress={() => handleOptionPress(option)}
            >
                <View style={styles.optionLeft}>
                    <View style={styles.iconContainer}>
                        <Ionicons name={iconName} size={24} color="#4A4AF4" />
                    </View>
                    <Text style={styles.optionTitle}>{option.title}</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#A0A0A0" />
            </TouchableOpacity>
        );
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
                <Text style={styles.headerTitle}>Contact Support</Text>
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
        padding: 16,
    },
    optionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#1E1E1E',
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
    },
    optionLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    optionTitle: {
        color: 'white',
        fontSize: 16,
        fontWeight: '500',
        marginLeft: 12,
    },
});

export default ContactSupportScreen;