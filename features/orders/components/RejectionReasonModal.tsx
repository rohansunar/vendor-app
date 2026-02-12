import React from 'react';
import {
    Modal,
    StyleSheet,
    Text,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
} from 'react-native';

interface RejectionReasonModalProps {
    visible: boolean;
    onClose: () => void;
    onSelect: (reason: string) => void;
}

const REJECTION_REASONS = ['Distance Far Away', 'Not Serving Today'];

export function RejectionReasonModal({
    visible,
    onClose,
    onSelect,
}: RejectionReasonModalProps) {
    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onClose}
        >
            <TouchableWithoutFeedback onPress={onClose}>
                <View style={styles.overlay}>
                    <TouchableWithoutFeedback>
                        <View style={styles.content}>
                            <Text style={styles.title}>Select Rejection Reason</Text>
                            {REJECTION_REASONS.map((reason) => (
                                <TouchableOpacity
                                    key={reason}
                                    style={styles.option}
                                    onPress={() => onSelect(reason)}
                                >
                                    <Text style={styles.optionText}>{reason}</Text>
                                </TouchableOpacity>
                            ))}
                            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
                                <Text style={styles.cancelText}>Cancel</Text>
                            </TouchableOpacity>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    content: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 24,
        width: '100%',
        maxWidth: 400,
    },
    title: {
        fontSize: 18,
        fontWeight: '700',
        color: '#0F172A',
        marginBottom: 20,
        textAlign: 'center',
    },
    option: {
        paddingVertical: 14,
        borderBottomWidth: 1,
        borderBottomColor: '#F1F5F9',
    },
    optionText: {
        fontSize: 16,
        color: '#334155',
        textAlign: 'center',
    },
    cancelButton: {
        marginTop: 16,
        paddingVertical: 12,
    },
    cancelText: {
        fontSize: 16,
        color: '#64748B',
        textAlign: 'center',
        fontWeight: '600',
    },
});
