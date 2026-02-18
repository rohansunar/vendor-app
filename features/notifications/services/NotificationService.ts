import { apiClient } from '@/core/api/client';
import { API_ENDPOINTS } from '@/core/api/endpoints';
import { ENV } from '@/core/config/env';
import Constants from 'expo-constants';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { DeviceType, RegisterTokenPayload } from '../types/notification.types';

/**
 * Service to handle push notification logic using expo-notifications.
 * Follows SOLID principles by encapsulating notification concerns.
 */
class NotificationService {
    constructor() {
        this.configureForegroundHandler();
    }

    /**
     * Configures how notifications should be handled when the app is in the foreground.
     */
    private configureForegroundHandler() {
        Notifications.setNotificationHandler({
            handleNotification: async () => ({
                shouldShowAlert: true,
                shouldPlaySound: true,
                shouldSetBadge: true,
                shouldShowBanner: true,
                shouldShowList: true,
            }),
        });
    }

    /**
     * Requests permissions and retrieves the Expo Push Token.
     * Then registers the token with the backend.
     */
    async registerForPushNotificationsAsync(): Promise<string | null> {
        if (!Device.isDevice) {
            console.warn('Must use physical device for Push Notifications');
            return null;
        }

        try {
            const { status: existingStatus } = await Notifications.getPermissionsAsync();
            let finalStatus = existingStatus;

            if (existingStatus !== 'granted') {
                const { status } = await Notifications.requestPermissionsAsync();
                finalStatus = status;
            }

            if (finalStatus !== 'granted') {
                throw new Error('Push notification permission not granted');
            }

            const projectId =
                Constants?.expoConfig?.extra?.eas?.projectId ??
                Constants?.easConfig?.projectId ?? ENV.PROJECT_ID;
            const tokenData = await Notifications.getExpoPushTokenAsync({
                projectId,
            });
            const token = tokenData.data;

            await this.registerTokenWithBackend(token);

            return token;
        } catch (error) {
            console.error('Error registering for push notifications:', error);
            throw error;
        }
    }

    /**
     * Sends the push token and device information to the backend.
     */
    private async registerTokenWithBackend(token: string) {
        const payload: RegisterTokenPayload = {
            deviceToken: token,
            deviceId: Device.osBuildId || 'unknown',
            deviceType: Platform.OS.toUpperCase() as DeviceType,
            deviceName: Device.deviceName || 'unknown',
        };

        try {
            await apiClient.post(API_ENDPOINTS.NOTIFICATION_REGISTER, payload);
        } catch (error) {
            console.error('Failed to register token with backend:', error);
            throw error;
        }
    }

    /**
     * Adds a listener for incoming notifications while the app is foregrounded.
     */
    addNotificationListener(callback: (notification: Notifications.Notification) => void) {
        return Notifications.addNotificationReceivedListener(callback);
    }

    /**
     * Adds a listener for when a user interacts with a notification (e.g., taps it).
     */
    addResponseListener(callback: (response: Notifications.NotificationResponse) => void) {
        return Notifications.addNotificationResponseReceivedListener(callback);
    }
}

export const notificationService = new NotificationService();
