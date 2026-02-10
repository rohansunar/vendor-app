import { StyleSheet } from 'react-native';

export const authStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFF',
    paddingHorizontal: 24,
    justifyContent: 'center',
  },

  logoContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },

  logoText: {
    fontSize: 28,
    fontWeight: '700',
    color: '#2563EB',
    letterSpacing: -0.5,
  },

  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },

  title: {
    fontSize: 22,
    fontWeight: '600',
    color: '#0F172A',
    marginBottom: 8,
  },

  subtitle: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 24,
  },

  input: {
    height: 54,
    borderRadius: 14,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#0F172A',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
  },

  errorText: {
    color: '#DC2626',
    fontSize: 13,
    marginTop: 8,
  },

  otpRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 16,
  },

  otpBox: {
    width: 46,
    height: 54,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    backgroundColor: '#FFFFFF',
  },

  otpText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0F172A',
  },

  timerText: {
    marginTop: 16,
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
  },
});
