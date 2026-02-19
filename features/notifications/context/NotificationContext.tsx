import { useAuth } from '@/core/providers/AuthProvider';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { notificationService } from '../services/Notification.service';
import { NotificationContextType, NotificationState } from '../types/notification.types';

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { isAuthenticated } = useAuth();
    const [state, setState] = useState<NotificationState>({
        token: null,
        notification: null,
        error: null,
        permissionStatus: null,
    });

    const register = React.useCallback(async () => {
        try {
            const token = await notificationService.registerForPushNotificationsAsync();
            setState(prev => {
                if (prev.token === token) return prev;
                return { ...prev, token, error: null };
            });
        } catch (error: any) {
            setState(prev => ({ ...prev, error: error.message || 'Failed to register' }));
        }
    }, []);

    const clearNotification = React.useCallback(() => {
        setState(prev => {
            if (prev.notification === null) return prev;
            return { ...prev, notification: null };
        });
    }, []);

    const contextValue = React.useMemo(() => ({
        ...state,
        register,
        clearNotification
    }), [state, register, clearNotification]);

    useEffect(() => {
        const notificationListener = notificationService.addNotificationListener(notification => {
            setState(prev => ({ ...prev, notification }));
        });

        const responseListener = notificationService.addResponseListener(response => {
            // Handle navigation or other actions here based on notification content
            console.log('Notification Response:', response);
        });

        return () => {
            notificationListener.remove();
            responseListener.remove();
        };
    }, []);

    return (
        <NotificationContext.Provider value={contextValue}>
            {children}
        </NotificationContext.Provider>
    );
};

export const useNotifications = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotifications must be used within a NotificationProvider');
    }
    return context;
};
