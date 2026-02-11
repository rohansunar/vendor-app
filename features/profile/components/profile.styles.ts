import { StyleSheet } from 'react-native';

export const profileStyles = StyleSheet.create({
  /* ---------------- Screen ---------------- */

  container: {
    flex: 1,
    backgroundColor: '#F8FAFF',
  },

  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 40,
  },

  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8FAFF',
  },

  /* ---------------- Header Section ---------------- */

  profileHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },

  avatarLarge: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: '#2563EB',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },

  avatarText: {
    color: '#FFFFFF',
    fontSize: 30,
    fontWeight: '700',
  },

  profileName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
  },

  businessName: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 4,
  },

  /* ---------------- Card ---------------- */

  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
    marginBottom: 20,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 16,
  },

  /* ---------------- Labels ---------------- */

  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#475569',
    marginBottom: 6,
  },

  /* ---------------- Inputs ---------------- */

  input: {
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    color: '#0F172A',
    backgroundColor: '#FFFFFF',
    marginBottom: 16,
  },

  inputDisabled: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    color: '#94A3B8',
    backgroundColor: '#F1F5F9',
    marginBottom: 16,
  },

  /* ---------------- Toggle Row ---------------- */

  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 8,
  },

  toggleLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#0F172A',
  },

  /* ---------------- Status Row ---------------- */

  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },

  statusLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#0F172A',
  },

  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 14,
  },

  /* ---------------- Time Inputs ---------------- */

  timeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 16,
  },

  timeInputWrapper: {
    flex: 1,
  },

  /* ---------------- Operating Days ---------------- */

  daysContainer: {
    marginTop: 8,
    marginBottom: 16,
  },

  dayChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    marginRight: 8,
    marginBottom: 8,
  },

  dayChipActive: {
    backgroundColor: '#2563EB',
    borderColor: '#2563EB',
  },

  dayText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#334155',
  },

  dayTextActive: {
    color: '#FFFFFF',
  },

  /* ---------------- Metadata ---------------- */

  metaContainer: {
    marginTop: 10,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },

  metaText: {
    fontSize: 12,
    color: '#64748B',
    marginBottom: 4,
  },
});
