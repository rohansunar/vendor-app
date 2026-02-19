import { dashboardStyles } from '@/features/dashboard/components/dashboard.styles';
import { SectionHeader } from '@/features/dashboard/components/SectionHeader';
import { StatCard } from '@/features/dashboard/components/StatCard';
import { useDashboard } from '@/features/dashboard/hooks/useDashboard';
import { useNotifications } from '@/features/notifications/context/NotificationContext';
import { ErrorState } from '@/shared/ui/ErrorState';
import { router } from 'expo-router';
import { useEffect } from 'react';
import { RefreshControl, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function Dashboard() {
  const insets = useSafeAreaInsets();
  const { register } = useNotifications();
  const { data, isLoading, isError, error, isRefetching, refetch } =
    useDashboard();

  useEffect(() => {
    register();
  }, [register]);

  if (isLoading) {
    return (
      <View
        style={[
          dashboardStyles.container,
          { justifyContent: 'center', alignItems: 'center' },
        ]}
      >
        <Text>Loading dashboard…</Text>
      </View>
    );
  }
  if (isError) {
    return (
      <ErrorState
        title="Dashboard Error"
        message={(error as Error).message}
        onRetry={() => refetch()}
      />
    );
  }

  if (!data) {
    return (
      <View style={dashboardStyles.container}>
        <Text>Failed to load dashboard</Text>
      </View>
    );
  }

  return (
    <ScrollView
      contentContainerStyle={{
        padding: 16,
        paddingBottom: 24 + insets.bottom, // 🔥 important
      }}
      style={dashboardStyles.container}
      refreshControl={
        <RefreshControl refreshing={isRefetching} onRefresh={refetch} />
      }
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={dashboardStyles.headerTitle}>Dashboard</Text>

      {/* Today's Orders */}
      <View style={dashboardStyles.section}>
        <SectionHeader title="Today's Orders" />
        <View style={dashboardStyles.cardRow}>
          <StatCard
            icon="shopping-bag"
            value={data.today.totalOrders}
            label="Total"
            color="#2563EB"
            onPress={() => router.push('/orders')}
          />
          <StatCard
            icon="clock"
            value={data.today.pending}
            label="Pending"
            color="#D97706"
            isLast
            onPress={() => router.push('/orders')}
          />
        </View>
      </View>

      {/* Earnings */}
      <View style={dashboardStyles.section}>
        <SectionHeader title="Earnings" />
        <View style={dashboardStyles.cardRow}>
          <StatCard
            icon="trending-up"
            value={`₹${data.earnings.todaySales}`}
            label="Today"
            color="#059669"
            onPress={() => router.push('/earnings')}
          />
          <StatCard
            icon="bar-chart-2"
            value={`₹${data.earnings.monthlySales}`}
            label="This Month"
            color="#7C3AED"
            isLast
            onPress={() => router.push('/earnings')}
          />
        </View>
      </View>

      {/* Products */}
      <View style={dashboardStyles.section}>
        <SectionHeader title="Products" />
        <View style={dashboardStyles.cardRow}>
          <StatCard
            icon="box"
            value={data.products.totalListedProducts}
            label="Listed"
            color="#DB2777"
            onPress={() => router.push('/products')}
          />
          <StatCard
            icon="check"
            value={data.products.approvedProducts}
            label="Approved"
            color="#2563EB"
            isLast
            onPress={() => router.push('/products')}
          />
        </View>
      </View>
    </ScrollView>
  );
}
