/* eslint-disable no-unused-vars */
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import { IProduct, IProductCart } from '@/interfaces/product'

export interface IState {
  products: IProductCart[]
}

export interface IActions {
  addProduct: (product: IProduct) => void
  removeProduct: (productId: string) => void
  getTotalQuantity: () => number
  clearCart: () => void
  getProducts: () => IProductCart[]
  getTotalPrice: () => number
  updateProductQuantity: (productId: string, num: number) => void
}

export const cartStore = create<IState & IActions>()(
  persist(
    (set, get) => ({
      products: [],
      addProduct: (product) => {
        const productInCart = get().products.find((p) => p.id === product.id)

        if (productInCart) {
          set((state) => ({
            products: state.products.map((p) =>
              p.id === product.id ? { ...p, quantity: p.quantity + 1 } : p
            )
          }))
        } else {
          set((state) => ({
            products: [
              ...state.products,
              {
                ...product,
                quantity: 1
              }
            ]
          }))
        }
      },
      removeProduct: (productId) =>
        set((state) => ({
          products: state.products.filter((product) => product.id !== productId)
        })),
      getTotalQuantity: () =>
        get().products.reduce((acc, product) => acc + product.quantity, 0),
      clearCart: () => set({ products: [] }),
      getProducts: () => get().products,
      getTotalPrice: () =>
        get().products.reduce(
          (acc, product) => acc + product.price * product.quantity,
          0
        ),
      updateProductQuantity: (productId, num) => {
        set((state) => ({
          products: state.products.map((p: IProductCart) =>
            p.id === productId ? { ...p, quantity: p.quantity + num } : p
          )
        }))
      }
    }),
    {
      name: 'cart'
    }
  )
)
