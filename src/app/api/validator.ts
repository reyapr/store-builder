import { z } from 'zod'

// Category
export const createCategorySchema = z.object({
  name: z.string(),
  storeId: z.string()
})

export const updateCategorySchema = z.object({
  name: z.string(),
  storeId: z.string()
})

// Store
export const createStoreSchema = z.object({
  name: z.string(),
  email: z.string().email()
})

export const updateStoreSchema = z.object({
  id: z.string(),
  name: z.string(),
  userId: z.string(),
})

// Product
export const createProductSchema = z.object({
  name: z.string(),
  price: z.number(),
  stock: z.number().optional().nullable(),
  storeId: z.string(),
  categoryIds: z.array(z.string()),
  description: z.string(),
  image: z.any()
})

export const updateProductSchema = z.object({
  name: z.string(),
  price: z.number(),
  stock: z.number().optional().nullable(),
  storeId: z.string(),
  categoryIds: z.array(z.string()),
  description: z.string(),
  image: z.any()
})

// Order
export const createOrderSchema = z.object({
  storeName: z.optional(z.string()),
  orderer: z.object({
    name: z.string(),
    email: z.string(),
    phoneNumber: z.string(),
    address: z.string()
  }),
  items: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      price: z.number(),
      stock: z.number(),
      store: z.object({
        id: z.string(),
        name: z.string(),
        isDeleted: z.boolean(),
        createdAt: z.string(),
        updatedAt: z.string()
      }),
      description: z.string(),
      imageUrl: z.string(),
      categories: z.array(
        z.object({
          id: z.string(),
          name: z.string(),
          storeId: z.string(),
          createdAt: z.string(),
          updatedAt: z.string()
        })
      ),
      quantity: z.number()
    })
  ),
  totalPrice: z.number()
})

export const updateOrderStatusSchema = z.object({
  status: z.string()
})


// Schedule

export const createProductScheduleSchema = z.object({

  productId: z.string(),
  date: z.string()
  
})
