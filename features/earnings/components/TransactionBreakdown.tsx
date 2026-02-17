
import { Feather } from '@expo/vector-icons';
import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { TransactionSummary } from '../types';

interface TransactionBreakdownProps {
    transactions: TransactionSummary[];
}

export const TransactionBreakdown: React.FC<TransactionBreakdownProps> = ({
    transactions,
}) => {
    const [isFeesExpanded, setIsFeesExpanded] = useState(false);

    const formatCurrency = (amount: string) => {
        const value = parseFloat(amount);
        return `₹${Math.abs(value).toFixed(2)}`;
    };

    const isPositive = (amount: string) => parseFloat(amount) > 0;

    // Grouping
    const sales = transactions.filter(t => t.feeType === 'SALE' && t.type === 'SALE');
    const refunds = transactions.filter(t => t.type === 'REFUND');
    const payouts = transactions.filter(t => t.type === 'PAYOUT');
    const platformFees = transactions.filter(t => t.type === 'PLATFORM_FEE');

    const totalSales = sales.reduce((sum, t) => sum + parseFloat(t._sum.amount), 0);
    const totalRefunds = refunds.reduce((sum, t) => sum + parseFloat(t._sum.amount), 0);
    const totalPayouts = payouts.reduce((sum, t) => sum + parseFloat(t._sum.amount), 0);
    const totalPlatformFees = platformFees.reduce((sum, t) => sum + parseFloat(t._sum.amount), 0);

    const getIconColor = (type: string) => {
        switch (type) {
            case 'SALE': return { color: '#2563EB', bg: '#EFF6FF' };
            case 'REFUND': return { color: '#EF4444', bg: '#FEF2F2' };
            case 'PAYOUT': return { color: '#10B981', bg: '#F0FDF4' };
            case 'FEES': return { color: '#4F46E5', bg: '#EEF2FF' };
            default: return { color: '#64748B', bg: '#F8FAFF' };
        }
    };

    const InfoCard = ({
        title,
        amount,
        icon,
        onPress,
        expanded,
        children,
        type
    }: {
        title: string;
        amount: number;
        icon: string;
        onPress?: () => void;
        expanded?: boolean;
        children?: React.ReactNode;
        type: string;
    }) => {
        const style = getIconColor(type);
        return (
            <TouchableOpacity
                activeOpacity={onPress ? 0.8 : 1}
                onPress={onPress}
                style={styles.cardContainer}
            >
                <View style={styles.cardHeader}>
                    <View style={[styles.iconBg, { backgroundColor: style.bg }]}>
                        <Feather name={icon as any} size={20} color={style.color} />
                    </View>
                    <View style={styles.headerText}>
                        <Text style={styles.cardTitle}>{title}</Text>
                        <Text style={[styles.cardAmount, { color: isPositive(amount.toString()) ? '#10B981' : '#0F172A' }]}>
                            {amount >= 0 ? '+' : '-'}{formatCurrency(amount.toString())}
                        </Text>
                    </View>
                    {onPress && (
                        <Feather name={expanded ? "chevron-up" : "chevron-down"} size={22} color="#94A3B8" />
                    )}
                </View>
                {expanded && children}
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.container}>
            <Text style={styles.sectionHeader}>TRANSACTION OVERVIEW</Text>

            <InfoCard
                type="SALE"
                title="Total Sales"
                amount={totalSales}
                icon="shopping-cart"
            />

            <InfoCard
                type="FEES"
                title="Platform Fees"
                amount={totalPlatformFees}
                icon="layers"
                onPress={() => setIsFeesExpanded(!isFeesExpanded)}
                expanded={isFeesExpanded}
            >
                <View style={styles.breakdownContainer}>
                    {platformFees.map((item, idx) => (
                        <View key={idx} style={styles.breakdownRow}>
                            <View style={styles.breakdownLabelContainer}>
                                <View style={styles.dot} />
                                <Text style={styles.breakdownLabel}>{item.feeType.replace(/_/g, ' ')}</Text>
                            </View>
                            <Text style={styles.breakdownValue}>-{formatCurrency(item._sum.amount)}</Text>
                        </View>
                    ))}
                </View>
            </InfoCard>

            <View style={styles.row}>
                <View style={{ flex: 1 }}>
                    <InfoCard
                        type="REFUND"
                        title="Refunds"
                        amount={totalRefunds}
                        icon="refresh-ccw"
                    />
                </View>
                <View style={{ width: 16 }} />
                <View style={{ flex: 1 }}>
                    <InfoCard
                        type="PAYOUT"
                        title="Payouts"
                        amount={totalPayouts}
                        icon="check-circle"
                    />
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginTop: 8,
    },
    sectionHeader: {
        fontSize: 12,
        fontWeight: '800',
        color: '#94A3B8',
        letterSpacing: 1.5,
        marginBottom: 16,
        paddingLeft: 4,
    },
    cardContainer: {
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        marginBottom: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: '#F1F5F9',
        shadowColor: '#64748B',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconBg: {
        width: 48,
        height: 48,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
    },
    headerText: {
        flex: 1,
    },
    cardTitle: {
        fontSize: 13,
        fontWeight: '700',
        color: '#64748B',
        marginBottom: 4,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    cardAmount: {
        fontSize: 18,
        fontWeight: '800',
        color: '#0F172A',
    },
    breakdownContainer: {
        marginTop: 16,
        paddingTop: 16,
        borderTopWidth: 1,
        borderTopColor: '#F8FAFC',
    },
    breakdownRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    breakdownLabelContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    dot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: '#CBD5E1',
        marginRight: 8,
    },
    breakdownLabel: {
        fontSize: 13,
        color: '#475569',
        fontWeight: '500',
    },
    breakdownValue: {
        fontSize: 13,
        fontWeight: '700',
        color: '#0F172A',
    },
    row: {
        flexDirection: 'row',
    },
});
