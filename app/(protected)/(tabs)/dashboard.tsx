import { dashboardStyles } from '@/features/dashboard/components/dashboard.styles';
import { SectionHeader } from '@/features/dashboard/components/SectionHeader';
import { StatCard } from '@/features/dashboard/components/StatCard';
import { useDashboard } from '@/features/dashboard/hooks/useDashboard';
import { RefreshControl, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function Dashboard() {
  const insets = useSafeAreaInsets();
  const { data, isLoading, isError, error, isRefetching, refetch } =
    useDashboard();

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
      <View
        style={[
          dashboardStyles.container,
          { justifyContent: 'center', alignItems: 'center' },
        ]}
      >
        <Text
          style={{
            color: '#DC2626',
            fontSize: 16,
            marginBottom: 12,
          }}
        >
          {(error as Error).message}
        </Text>

        <Text
          style={{ color: '#2563EB', fontWeight: '600' }}
          onPress={() => refetch()}
        >
          Tap to retry
        </Text>
      </View>
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
          />
          <StatCard
            icon="clock"
            value={data.today.pending}
            label="Pending"
            isLast
          />
        </View>
      </View>

      {/* Earnings */}
      <View style={dashboardStyles.section}>
        <SectionHeader title="Earnings" />
        <View style={dashboardStyles.cardRow}>
          <StatCard
            icon="dollar-sign"
            value={`₹${data.earnings.todaySales}`}
            label="Today"
          />
          <StatCard
            icon="bar-chart-2"
            value={`₹${data.earnings.monthlySales}`}
            label="This Month"
            isLast
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
          />
          <StatCard
            icon="check"
            value={data.products.approvedProducts}
            label="Approved"
            isLast
          />
        </View>
      </View>

      {/* Payouts */}
      <View style={dashboardStyles.section}>
        <SectionHeader title="Payouts" />
        <View style={dashboardStyles.cardRow}>
          <StatCard
            icon="calendar"
            value={
              data.payouts.nextPayoutDate
                ? `₹${data.payouts.nextPayoutAmount}`
                : '—'
            }
            label="Next Payout"
          />
          <StatCard
            icon="info"
            value={data.payouts.status}
            label="Status"
            isLast
          />
        </View>
      </View>
    </ScrollView>
  );
}
