// utils/constants.js

// API Base URLs
export const BASE_URL = 'https://app.3dnaturesounds.com';
export const API_BASE_URL = 'https://app.3dnaturesounds.com/api';
export const API_BASE_PROFILE = 'https://app.3dnaturesounds.com/assets/profiles';
export const IMG_BASE_URL = 'https://app.3dnaturesounds.com/assets/images';
export const SAMPLE_BASE_URL = 'https://app.3dnaturesounds.com/assets/samples';

// API Endpoints
export const API_ENDPOINTS = {
    LOGIN: '/login/',
    REGISTER: '/register/',
    FORGOT_PASSWORD: '/forgot_password/',
    GET_PROFILE: '/get_profile/',
    GET_PROFILE_SOUNDS: '/get_profile_sounds/',
    GET_SOUND: '/get_sound/',
    GET_SAMPLE_SOUND: '/get_sample_sound/',
    LOGOUT: '/logout/',
    UPDATE_PROFILE: '/update_profile/',
    CONTACT_SUPPORT: '/send_contact_message/',
};

// App Configuration
export const APP_CONFIG = {
    TIMEOUT_MS: 10000,
    APP_VERSION: '1.0.0',
    MAX_RETRY_ATTEMPTS: 3,
};

// UI Constants
export const COLORS = {
    PRIMARY: '#5D5FEF',
    SECONDARY: '#4F46E5',
    BACKGROUND: '#121212',
    CARD_BACKGROUND: '#1e1e1e',
    TEXT_PRIMARY: '#FFFFFF',
    TEXT_SECONDARY: '#A0A0A0',
    ERROR: '#FF6B6B',
    BORDER: '#333333',
};

// Other constants
export const SOUND_TYPES = {
    PROFILE: 'profile',
    SAMPLE: 'sample',
};

// Default values
export const DEFAULT_AVATAR = 'placeholder.png';
export const DEFAULT_ERROR_MESSAGE = 'Something went wrong. Please try again.';