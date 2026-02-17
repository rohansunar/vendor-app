
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Text, View } from 'react-native';

interface EarningsSummaryCardProps {
    balance: number;
}

export const EarningsSummaryCard: React.FC<EarningsSummaryCardProps> = ({
    balance,
}) => {
    return (
        <View style={styles.cardContainer}>
            <LinearGradient
                colors={['#2563EB', '#1D4ED8']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.card}
            >
                <View className="flex-row justify-between items-start mb-4">
                    <View>
                        <Text style={styles.label}>TOTAL BALANCE</Text>
                        <Text style={styles.balance}>₹{balance.toFixed(2)}</Text>
                    </View>
                    <View style={styles.iconContainer}>
                        <Feather name="trending-up" size={24} color="#FFF" />
                    </View>
                </View>

                <View className="flex-row items-center pt-4 border-t border-white/10">
                    <View className="bg-emerald-400/20 px-3 py-1.5 rounded-lg flex-row items-center mr-3">
                        <Feather name="arrow-up-right" size={14} color="#34D399" />
                        <Text className="text-emerald-400 text-xs font-extra-bold ml-1">+2.4%</Text>
                    </View>
                    <Text className="text-white/60 text-xs font-medium uppercase tracking-wider">vs last month</Text>
                </View>
            </LinearGradient>
        </View>
    );
};

const styles = {
    cardContainer: {
        marginBottom: 24,
        borderRadius: 24,
        backgroundColor: '#FFFFFF',
        shadowColor: '#64748B',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.15,
        shadowRadius: 16,
        elevation: 6,
    },
    card: {
        borderRadius: 24,
        padding: 24,
        overflow: 'hidden',
    } as const,
    label: {
        fontSize: 12,
        fontWeight: '800' as const,
        color: 'rgba(255, 255, 255, 0.7)',
        letterSpacing: 1.5,
        marginBottom: 8,
    },
    balance: {
        fontSize: 36,
        fontWeight: '800' as const,
        color: '#FFFFFF',
        letterSpacing: -1,
    },
    iconContainer: {
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
        padding: 12,
        borderRadius: 16,
    }
};
