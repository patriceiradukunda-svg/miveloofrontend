import { z } from 'zod';
export const productSchema = z.object({
  name: z.string().trim().min(2, 'Enter the product name.'),
  category: z.enum(['grains', 'legumes', 'vegetables', 'fruits', 'tubers', 'dairy-eggs', 'protein'], { errorMap: () => ({ message: 'Choose a category.' }) }),
  description: z.string().trim().min(10, 'Describe the product in at least 10 characters.').max(1000),
  unit: z.string().trim().min(1, 'Enter a unit, like kg or bunch.'),
  price: z.coerce.number({ invalid_type_error: 'Enter a number.' }).int().positive('Price must be more than 0.').optional().or(z.literal('').transform(() => undefined)),
  quantity: z.coerce.number({ invalid_type_error: 'Enter a number.' }).int().min(0, 'Quantity cannot be negative.'),
  district: z.string().trim().min(2, 'Enter the general location (district).'),
  minOrder: z.coerce.number().int().min(0).optional().or(z.literal('').transform(() => undefined)),
});
export type ProductInput = z.infer<typeof productSchema>;
