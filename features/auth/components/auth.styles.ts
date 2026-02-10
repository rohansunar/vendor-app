import { StyleSheet } from 'react-native';

export const authStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0F1F', // deep navy
    paddingHorizontal: 24,
    justifyContent: 'center',
  },

  card: {
    borderRadius: 20,
    padding: 24,
    backgroundColor: '#0F172A',
    borderWidth: 1,
    borderColor: '#1E293B',
  },

  title: {
    fontSize: 28,
    fontWeight: '600',
    color: '#E5E7EB',
    letterSpacing: -0.4,
  },

  subtitle: {
    fontSize: 15,
    color: '#9CA3AF',
    marginTop: 6,
    marginBottom: 24,
  },

  input: {
    height: 56,
    borderRadius: 14,
    paddingHorizontal: 16,
    fontSize: 18,
    color: '#E5E7EB',
    backgroundColor: '#020617',
    borderWidth: 1,
  },

  errorText: {
    color: '#EF4444',
    marginTop: 8,
    fontSize: 14,
  },

  /* OTP specific */
  otpRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 16,
  },

  otpBox: {
    width: 48,
    height: 56,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#020617',
    borderWidth: 1,
  },

  otpText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#E5E7EB',
  },

  timerText: {
    marginTop: 16,
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
  },

  button: {
    height: 56,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
  },

  buttonText: {
    fontSize: 17,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
