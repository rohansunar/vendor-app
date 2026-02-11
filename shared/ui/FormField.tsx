import { Controller } from 'react-hook-form';
import { Text, TextInput, View } from 'react-native';

export function FormField({
  control,
  name,
  placeholder,
  error,
  keyboardType,
  autoCapitalize,
}: any) {
  return (
    <View style={{ marginBottom: 14 }}>
      <Controller
        control={control}
        name={name}
        render={({ field: { onChange, value } }) => (
          <TextInput
            placeholder={placeholder}
            value={value}
            onChangeText={onChange}
            keyboardType={keyboardType}
            autoCapitalize={autoCapitalize}
            style={[
              styles.input,
              error && { borderColor: '#DC2626' },
            ]}
          />
        )}
      />
      {error && (
        <Text style={styles.errorText}>{error}</Text>
      )}
    </View>
  );
}

const styles = {
  input: {
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 12,
    padding: 12,
  },
  errorText: {
    color: '#DC2626',
    fontSize: 12,
    marginTop: 4,
  },
};
