import { API_BASE_PROFILE, IMG_BASE_URL } from './constants';

export function calculatePhotoDirectory(id) {
    const divisors = [5, 4, 3, 2, 1];
    for (const divisor of divisors) {
        if (id % divisor === 0) {
            return divisor;
        }
    }
    return 1; // Fallback, though this case should never occur
}

export function getProfilePhotoPath(profileId, photo) {
    if (!photo || photo.trim() === "") {
        return `${IMG_BASE_URL}/default-avatar.png`; // Return default avatar if no photo
    }
    const directory = calculatePhotoDirectory(profileId);
    return `${API_BASE_PROFILE}/${directory}/${photo}`;
}