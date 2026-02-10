/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{ts,tsx}', './app/**/*.{ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        // Base surfaces
        background: '#0A0F1F',
        surface: '#0F172A',

        // Primary (blue premium)
        primary: '#2563EB',
        primaryDark: '#1E40AF',
        primarySoft: '#60A5FA',

        // Text
        textPrimary: '#E5E7EB',
        textSecondary: '#9CA3AF',

        // Status
        error: '#EF4444',
      },
    },
  },
  plugins: [],
};
