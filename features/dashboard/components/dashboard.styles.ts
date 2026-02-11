import { StyleSheet } from 'react-native';

export const dashboardStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFF',
  },

  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#0F172A',
  },

  section: {
    marginTop: 20,
  },

  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },

  card: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginRight: 12,
  },

  cardLast: {
    marginRight: 0,
  },

  cardValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0F172A',
    marginTop: 8,
  },

  cardLabel: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 4,
  },
});
