// screens/FAQScreen.js
import React, { useState } from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    SafeAreaView,
    StatusBar,
    ScrollView,
    TextInput,
    Animated
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Sample FAQ data - in a real app, this might come from an API
const faqData = [
    {
        id: '1',
        question: 'What is Aura?',
        answer: 'Aura is a mobile app that offers a collection of soothing sleep sounds to help you relax and improve your sleep quality.'
    },
    {
        id: '2',
        question: 'How does Aura work?',
        answer: 'Aura works by providing a library of high-quality nature sounds and white noise options that you can play to create a peaceful environment. You can customize your sound experience, set timers, and create favorite playlists for different needs or times of day.'
    },
    {
        id: '3',
        question: 'Is Aura free to use?',
        answer: 'Aura offers both free and premium options. The basic version gives you access to a limited collection of sounds at no cost. The premium subscription unlocks the full library, allows offline listening, removes ads, and provides advanced features like sound mixing and extended timers.'
    },
    {
        id: '4',
        question: 'Can I use Aura offline?',
        answer: 'Yes, with a premium subscription you can download your favorite sounds for offline use. This is perfect for travel or areas with limited connectivity. Free users need an internet connection to stream sounds.'
    },
    {
        id: '5',
        question: 'Is my data secure with Aura?',
        answer: 'Absolutely. We take data privacy seriously. Aura only collects minimal usage data to improve your experience, and all personal information is encrypted. We never share or sell your data to third parties. You can review our full privacy policy for more details.'
    },
    {
        id: '6',
        question: 'Can I export my Aura data?',
        answer: 'Yes, you can export your usage statistics and favorite playlists from the Account settings. This is useful if you want to switch devices or back up your personalized settings.'
    },
    {
        id: '7',
        question: 'How do I contact support?',
        answer: 'You can reach our support team through the "Contact Support" option in the Help & Support menu. Alternatively, you can email us directly at support@aura-app.com. We aim to respond to all inquiries within 24 hours.'
    }
];

const FAQScreen = ({ navigation }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [expandedId, setExpandedId] = useState('1'); // Default to first item expanded
    const [animatedValues, setAnimatedValues] = useState(() => {
        // Initialize animation values for each FAQ item
        const values = {};
        faqData.forEach(item => {
            values[item.id] = new Animated.Value(item.id === '1' ? 1 : 0);
        });
        return values;
    });

    // Filter FAQ items based on search query
    const filteredFAQs = faqData.filter(item => {
        const query = searchQuery.toLowerCase();
        return (
            item.question.toLowerCase().includes(query) ||
            item.answer.toLowerCase().includes(query)
        );
    });

    const toggleAccordion = (id) => {
        const isExpanded = expandedId === id;

        // Animate the closing of currently expanded item
        if (expandedId) {
            Animated.timing(animatedValues[expandedId], {
                toValue: 0,
                duration: 300,
                useNativeDriver: false
            }).start();
        }

        // If clicking on a different item, expand it
        if (!isExpanded) {
            setExpandedId(id);
            Animated.timing(animatedValues[id], {
                toValue: 1,
                duration: 300,
                useNativeDriver: false
            }).start();
        } else {
            setExpandedId(null);
        }
    };

    const renderFAQItem = (item) => {
        const isExpanded = expandedId === item.id;

        // Calculate the max height for the animated container
        const maxHeight = animatedValues[item.id].interpolate({
            inputRange: [0, 1],
            outputRange: [0, 500] // Adjust this value based on your content
        });

        return (
            <View key={item.id} style={styles.faqItem}>
                <TouchableOpacity
                    style={styles.questionContainer}
                    onPress={() => toggleAccordion(item.id)}
                >
                    <Text style={styles.questionText}>{item.question}</Text>
                    <Ionicons
                        name={isExpanded ? "chevron-up" : "chevron-down"}
                        size={20}
                        color="#A0A0A0"
                    />
                </TouchableOpacity>

                <Animated.View style={[styles.answerContainer, { maxHeight }]}>
                    <Text style={styles.answerText}>{item.answer}</Text>
                </Animated.View>
            </View>
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
                <Text style={styles.headerTitle}>FAQ</Text>
                <View style={styles.placeholder} />
            </View>

            <View style={styles.searchContainer}>
                <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search"
                    placeholderTextColor="#666"
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                />
            </View>

            <ScrollView style={styles.content}>
                {filteredFAQs.map(item => renderFAQItem(item))}

                {filteredFAQs.length === 0 && (
                    <View style={styles.noResultsContainer}>
                        <Text style={styles.noResultsText}>No matching FAQs found</Text>
                    </View>
                )}
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
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        margin: 16,
        paddingHorizontal: 16,
        backgroundColor: '#1E1E1E',
        borderRadius: 10,
        height: 44,
    },
    searchIcon: {
        marginRight: 8,
    },
    searchInput: {
        flex: 1,
        color: 'white',
        height: '100%',
        fontSize: 16,
    },
    content: {
        flex: 1,
        paddingHorizontal: 16,
    },
    faqItem: {
        marginBottom: 8,
        borderRadius: 10,
        overflow: 'hidden',
        backgroundColor: '#1E1E1E',
    },
    questionContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
    },
    questionText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '500',
        flex: 1,
    },
    answerContainer: {
        overflow: 'hidden',
    },
    answerText: {
        color: '#A0A0A0',
        fontSize: 14,
        lineHeight: 20,
        padding: 16,
        paddingTop: 0,
    },
    noResultsContainer: {
        padding: 24,
        alignItems: 'center',
    },
    noResultsText: {
        color: '#A0A0A0',
        fontSize: 16,
    }
});

export default FAQScreen;