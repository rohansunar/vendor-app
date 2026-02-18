import * as Notifications from 'expo-notifications';

export enum DeviceType {
    ANDROID = 'ANDROID',
    IOS = 'IOS',
    WEB = 'WEB',
}

export interface RegisterTokenPayload {
    deviceToken: string;
    deviceId: string;
    deviceType: DeviceType;
    deviceName: string;
}

export interface NotificationState {
    token: string | null;
    notification: Notifications.Notification | null;
    error: string | null;
    permissionStatus: Notifications.PermissionStatus | null;
}

export interface NotificationContextType extends NotificationState {
    register: () => Promise<void>;
    clearNotification: () => void;
}
