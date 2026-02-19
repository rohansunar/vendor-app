import { z } from 'zod';

export const riderSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    phone: z
        .string()
        .length(10, 'Phone number must be exactly 10 digits')
        .regex(/^\d+$/, 'Phone number must contain only digits'),
});

export type RiderFormValues = z.infer<typeof riderSchema>;
