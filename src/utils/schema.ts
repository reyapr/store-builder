import { z } from 'zod'

// Category
export const orderInputForm = z.object({
  name: z.string().min(4, 'Terlalu pendek').max(50, 'Terlalu panjang'),
  phoneNumber: z
    .string()
    .min(8, { message: 'Nomor telepon harus terdiri dari minimal 8 karakter' })
    .max(14, {
      message: 'Nomor telepon harus terdiri dari maksimal 14 karakter'
    })
    .refine((value) => value.startsWith('+62') || value.startsWith('08'), {
      message: 'Nomor telepon harus diawali dengan +62 atau 08'
    }),
  email: z.string().email(),
  address: z.string().optional()
})

export const adminProductForm = z.object({
  name: z.string({ required_error: 'Nama diperlukan' }),
  price: z.string({ required_error: 'Harga diperlukan' }),
  stock: z
    .number()
    .min(0, 'Stok tidak bisa negatif')
    .nonnegative('Stok diperlukan'),
  storeId: z.string({ required_error: 'Toko diperlukan' }),
  categoryIds: z.array(z.string()).min(1, 'Setidaknya satu kategori diperlukan'),
  description: z.string().optional()
});