
import { ErrorState } from '@/shared/ui/ErrorState';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, RefreshControl, ScrollView, View } from 'react-native';
import { EarningsFilter, FilterRange } from '../components/EarningsFilter';
import { EarningsSummaryCard } from '../components/EarningsSummaryCard';
import { TransactionBreakdown } from '../components/TransactionBreakdown';
import { fetchEarningsData } from '../services/earnings.service';
import { EarningsResponse } from '../types';

export const EarningsScreen = () => {
    const [data, setData] = useState<EarningsResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Filter State
    const [range, setRange] = useState<FilterRange>('weekly');
    const [startDate, setStartDate] = useState<Date>();
    const [endDate, setEndDate] = useState<Date>();

    const loadData = async (isRefresh = false) => {
        if (!isRefresh) setLoading(true);
        try {
            setError(null);
            const params = {
                startDate: startDate?.toISOString().split('T')[0],
                endDate: endDate?.toISOString().split('T')[0],
            };

            const response = await fetchEarningsData(params);
            setData(response);
        } catch (err) {
            setError('Failed to load earnings data. Please try again.');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    // Initial load and filter change trigger
    useEffect(() => {
        // Set default dates for weekly view if not set
        if (!startDate && !endDate && range === 'weekly') {
            const end = new Date();
            const start = new Date();
            start.setDate(end.getDate() - 7);
            setStartDate(start);
            setEndDate(end);
            // We don't fetch here because setStartDate/BondDate will trigger the next effect if we add them as deps
            // But better to just call loadData with these values directly or rely on the state update?
            // Let's rely on the useEffect below that watches [range, startDate, endDate]
        }
    }, []);

    useEffect(() => {
        if (startDate && endDate) {
            loadData();
        }
    }, [range, startDate, endDate]);


    const onRangeChange = (newRange: FilterRange, start?: Date, end?: Date) => {
        setRange(newRange);
        if (start) setStartDate(start);
        if (end) setEndDate(end);
    };

    const onRefresh = () => {
        setRefreshing(true);
        loadData(true);
    };

    if (loading && !refreshing && !data) {
        return (
            <View className="flex-1 justify-center items-center bg-[#F8FAFC]">
                <ActivityIndicator size="large" color="#3B82F6" />
            </View>
        );
    }

    // Flatten the transactions array of arrays
    const allTransactions = data?.transactions?.flat() || [];

    return (
        <ScrollView
            className="flex-1 bg-[#F8FAFC]"
            contentContainerStyle={{ padding: 20, paddingBottom: 40, flexGrow: 1 }}
            refreshControl={
                <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                    tintColor="#3B82F6"
                    colors={['#3B82F6']}
                />
            }
        >
            {!error && (
                <EarningsFilter
                    selectedRange={range}
                    startDate={startDate}
                    endDate={endDate}
                    onRangeChange={onRangeChange}
                />
            )}

            {error ? (
                <View style={{ flex: 1, height: 400 }}>
                    <ErrorState
                        onRetry={() => loadData()}
                        footer="Please come back later if the issue persists"
                    />
                </View>
            ) : (
                data && (
                    <>
                        <EarningsSummaryCard balance={data.summary.balance} />
                        <TransactionBreakdown transactions={allTransactions} />
                    </>
                )
            )}
        </ScrollView>
    );
};
