import { z } from 'zod';

/**
 * Zod schema for address form validation.
 * Mirrors the validation logic in AddressForm.tsx.
 */
export const addressSchema = z.object({
  address: z
    .string()
    .min(1, 'Detailed address is required for deliveries')
    .min(8, 'Please provide a more specific address details'),

  pincode: z
    .string()
    .min(1, 'Pincode is required to locate your area')
    .regex(/^\d{6}$/, 'Please enter a valid 6-digit area pincode'),

  city: z.string().min(1, 'City is required'),

  state: z.string().min(1, 'State is required'),

  lat: z.string().optional(),

  lng: z.string().optional(),
});

/**
 * Inferred TypeScript type from addressSchema.
 * Matches AddressFormData in address.types.ts
 */
export type AddressFormValues = z.infer<typeof addressSchema>;
