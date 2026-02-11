import { StyleSheet } from 'react-native';

export const bankStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFF',
  },

  scrollContent: {
    padding: 16,
  },

  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 16,
  },

  input: {
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },

  readOnlyText: {
    fontSize: 14,
    marginBottom: 8,
    color: '#0F172A',
  },

  statusRow: {
    marginTop: 16,
  },

  badgeRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
});
