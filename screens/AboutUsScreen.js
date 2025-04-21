// screens/AboutUsScreen.js
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

const AboutUsScreen = ({ navigation }) => {
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
                <Text style={styles.headerTitle}>About Us</Text>
                <View style={styles.placeholder} />
            </View>

            <ScrollView style={styles.content}>
                <View style={styles.blueBar} />

                <View style={styles.aboutContent}>
                    <Text style={styles.tagline}>Escape. Relax. Snooze.</Text>

                    <Text style={styles.aboutText}>
                        We're all about good vibes and better sleep. Our 3D nature sound app lets you escape to a rainy forest, a breezy beach, or a cozy mountain cabin—without leaving your bed. Plug in, press play, and let the waves, birds, and gentle rain take it from there.
                    </Text>

                    <Text style={styles.aboutText}>
                        Just hit play and let nature do the magic. 😴✨
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
        position: 'relative',
    },
    blueBar: {
        position: 'absolute',
        top: 20,
        right: 16,
        width: 4,
        height: 240,
        backgroundColor: '#4A4AF4',
        borderRadius: 2,
    },
    aboutContent: {
        padding: 16,
        paddingTop: 24,
    },
    tagline: {
        color: 'white',
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    aboutText: {
        color: 'white',
        fontSize: 16,
        lineHeight: 24,
        marginBottom: 24,
    }
});

export default AboutUsScreen;