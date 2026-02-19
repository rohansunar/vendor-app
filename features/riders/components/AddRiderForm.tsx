import { Feather } from '@expo/vector-icons';
import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
    ActivityIndicator,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { RiderFormValues, riderSchema } from '../rider.schema';

interface AddRiderFormProps {
    onSuccess?: () => void;
    onSubmit: (data: RiderFormValues) => Promise<void>;
    isLoading: boolean;
}

export function AddRiderForm({ onSuccess, onSubmit, isLoading }: AddRiderFormProps) {
    const {
        control,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<RiderFormValues>({
        resolver: zodResolver(riderSchema),
        defaultValues: {
            name: '',
            phone: '',
        },
    });

    const handleFormSubmit = async (data: RiderFormValues) => {
        try {
            await onSubmit(data);
            reset();
            onSuccess?.();
        } catch (error) {
            // Error handled by hook toast
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Add New Rider</Text>

            <View style={styles.formRow}>
                <View style={styles.inputContainer}>
                    <Controller
                        control={control}
                        name="name"
                        render={({ field: { onChange, onBlur, value } }) => (
                            <View style={[styles.inputWrapper, errors.name && styles.inputError]}>
                                <Feather name="user" size={16} color="#64748B" style={styles.icon} />
                                <TextInput
                                    placeholder="Name"
                                    onBlur={onBlur}
                                    onChangeText={onChange}
                                    value={value}
                                    style={styles.input}
                                    placeholderTextColor="#94A3B8"
                                />
                            </View>
                        )}
                    />
                    {errors.name && <Text style={styles.errorText}>{errors.name.message}</Text>}
                </View>

                <View style={styles.inputContainer}>
                    <Controller
                        control={control}
                        name="phone"
                        render={({ field: { onChange, onBlur, value } }) => (
                            <View style={[styles.inputWrapper, errors.phone && styles.inputError]}>
                                <Feather name="phone" size={16} color="#64748B" style={styles.icon} />
                                <TextInput
                                    placeholder="Phone"
                                    keyboardType="phone-pad"
                                    onBlur={onBlur}
                                    onChangeText={onChange}
                                    value={value}
                                    style={styles.input}
                                    placeholderTextColor="#94A3B8"
                                    maxLength={10}
                                />
                            </View>
                        )}
                    />
                    {errors.phone && <Text style={styles.errorText}>{errors.phone.message}</Text>}
                </View>

                <TouchableOpacity
                    style={styles.submitButton}
                    onPress={handleSubmit(handleFormSubmit)}
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <ActivityIndicator color="#FFF" size="small" />
                    ) : (
                        <Feather name="plus" size={20} color="#FFF" />
                    )}
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#F8FAFC',
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        // shadow for premium feel
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 2,
    },
    title: {
        fontSize: 14,
        fontWeight: '700',
        color: '#1E293B',
        marginBottom: 12,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    formRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 8,
    },
    inputContainer: {
        flex: 1,
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#CBD5E1',
        borderRadius: 10,
        paddingHorizontal: 10,
        height: 44,
    },
    inputError: {
        borderColor: '#EF4444',
    },
    icon: {
        marginRight: 8,
    },
    input: {
        flex: 1,
        fontSize: 14,
        color: '#0F172A',
        padding: 0,
    },
    submitButton: {
        backgroundColor: '#2563EB',
        width: 44,
        height: 44,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#2563EB',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    errorText: {
        color: '#EF4444',
        fontSize: 10,
        marginTop: 4,
        marginLeft: 4,
    },
});
