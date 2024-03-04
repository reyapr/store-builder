import { IProduct, IProductCart } from "@/interfaces/product";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface IState {
  products: IProductCart[];
  totalPrice: number;
}

export interface IActions {
  addProduct: (product: IProduct) => void;
  removeProduct: (productId: string) => void;
  getTotalQuantity: () => number;
  clearCart: () => void;
}

export const cartStore = create<IState & IActions>()(persist((set, get) => ({
    products: [],
    totalPrice: 0,
    addProduct: (product) => {
      const productInCart = get().products.find((p) => p.id === product.id);
      if(productInCart && productInCart.quantity + 1 > productInCart?.stock) {
        throw new Error('Stock is not enough');
      }
      
      if (productInCart) {
        set((state) => ({
          products: state.products.map((p) =>
            p.id === product.id
              ? { ...p, quantity: p.quantity + 1}
              : p
          ),
        }));
      } else {
        set((state) => ({
          products: [
            ...state.products,
            {
              ...product,
              quantity: 1,
            },
          ],
        }));
      }
    
    },
    removeProduct: (productId) =>
      set((state) => ({
        products: state.products.filter((product) => product.id !== productId),
      })),
    getTotalQuantity: () => get().products.reduce((acc, product) => acc + product.quantity, 0),
    clearCart: () => set({ products: [] }),
  }),
  {
    name: 'cart',
  }
));