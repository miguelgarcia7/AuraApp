import React, { useState, useRef } from 'react';
import {
    StyleSheet,
    View,
    Text,
    Image,
    TouchableOpacity,
    SafeAreaView,
    StatusBar,
    Dimensions,
    FlatList
} from 'react-native';

const { width } = Dimensions.get('window');

const IntroScreen = ({ navigation }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const flatListRef = useRef(null);

    const slides = [
        {
            id: '1',
            title: 'Meet Aura - Your Portal to Serene Sleep',
            description: 'Embark on a journey to a peaceful night\'s rest with Aura. Explore a curated collection of soothing sleep sounds.',
            image: require('../assets/moon-logo.png'), // Replace with your actual logo path
        },
        {
            id: '2',
            title: 'Personalize Your Perfect Sleep Soundtrack',
            description: 'Aura empowers you to create a sleep experience that\'s uniquely yours. Mix and match a variety of soothing sounds.',
            image: require('../assets/moon-logo.png'), // Replace with your actual logo path
        },
        {
            id: '3',
            title: 'Unlock Premium & Access Exclusive Benefits',
            description: 'Upgrade to Aura Premium for access to an expanded library of premium sleep sounds. Dive into an amazing sleep experience.',
            image: require('../assets/moon-logo.png'), // Replace with your actual logo path
        },
    ];

    const handleNext = () => {
        if (currentIndex < slides.length - 1) {
            flatListRef.current.scrollToIndex({
                index: currentIndex + 1,
                animated: true
            });
        } else {
            // Last slide - navigate to Home
            navigation.navigate('Home');
        }
    };

    const handleSkip = () => {s
        navigation.navigate('Login');
    };

    const renderItem = ({ item, index }) => {
        const isLastSlide = index === slides.length - 1;

        return (
            <View style={styles.slide}>
                <View style={styles.topSection}>
                    <View style={styles.logoContainer}>
                        <Image source={item.image} style={styles.logo} />
                        <Text style={styles.logoText}>Aura</Text>
                    </View>
                </View>

                <View style={styles.contentSection}>
                    <Text style={styles.title}>{item.title}</Text>
                    <Text style={styles.description}>{item.description}</Text>
                </View>

                <View style={styles.bottomSection}>
                    <View style={styles.indicators}>
                        {slides.map((_, i) => (
                            <View
                                key={i}
                                style={[
                                    styles.indicator,
                                    i === index && styles.activeIndicator
                                ]}
                            />
                        ))}
                    </View>

                    <View style={styles.buttonsContainer}>
                        {!isLastSlide ? (
                            <>
                                <TouchableOpacity
                                    style={styles.skipButton}
                                    onPress={handleSkip}
                                >
                                    <Text style={styles.skipButtonText}>Skip</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={styles.continueButton}
                                    onPress={handleNext}
                                >
                                    <Text style={styles.continueButtonText}>Continue</Text>
                                </TouchableOpacity>
                            </>
                        ) : (
                            <TouchableOpacity
                                style={styles.getStartedButton}
                                onPress={handleNext}
                            >
                                <Text style={styles.getStartedButtonText}>Let's Get Started</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                </View>
            </View>
        );
    };

    const onViewableItemsChanged = useRef(({ viewableItems }) => {
        if (viewableItems.length > 0) {
            setCurrentIndex(viewableItems[0].index);
        }
    }).current;

    const viewabilityConfig = useRef({
        itemVisiblePercentThreshold: 50
    }).current;

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" />

            <FlatList
                ref={flatListRef}
                data={slides}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onViewableItemsChanged={onViewableItemsChanged}
                viewabilityConfig={viewabilityConfig}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#121212',
    },
    slide: {
        width,
        flex: 1,
        justifyContent: 'space-between',
    },
    topSection: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#5D5FEF',
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
    },
    logoContainer: {
        alignItems: 'center',
    },
    logo: {
        width: 100,
        height: 100,
        resizeMode: 'contain',
    },
    logoText: {
        marginTop: 16,
        fontSize: 28,
        fontWeight: 'bold',
        color: 'white',
    },
    contentSection: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 24,
        paddingVertical: 40,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'white',
        textAlign: 'center',
        marginBottom: 16,
    },
    description: {
        fontSize: 16,
        color: '#A0A0A0',
        textAlign: 'center',
        lineHeight: 24,
    },
    bottomSection: {
        paddingBottom: 40,
    },
    indicators: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 24,
    },
    indicator: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#333333',
        marginHorizontal: 4,
    },
    activeIndicator: {
        backgroundColor: '#5D5FEF',
        width: 24,
    },
    buttonsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        paddingHorizontal: 24,
    },
    skipButton: {
        flex: 1,
        paddingVertical: 16,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 100,
        marginRight: 8,
        backgroundColor: '#333333',
    },
    skipButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
    continueButton: {
        flex: 1,
        paddingVertical: 16,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 100,
        marginLeft: 8,
        backgroundColor: '#5D5FEF',
    },
    continueButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
    getStartedButton: {
        paddingVertical: 16,
        paddingHorizontal: 32,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 100,
        backgroundColor: '#5D5FEF',
        width: '80%',
        alignSelf: 'center',
    },
    getStartedButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
});

export default IntroScreen;