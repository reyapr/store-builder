import { ICategory } from "@/interfaces/category";
import { IStore } from "@/interfaces/store";

export interface ICreateProductRequest {
  name: string;
  price: number;
  stock: number;
  storeId: string;
  categoryIds: string[];
}

export interface ICategoryInput {
  label: string;
  value: string;
}

export interface ICreateProductInput {
  name: string;
  price: string;
  stock: number;
  storeId: string;
  categories: ICategoryInput[];
}

export interface IProduct {
  id: string;
  name: string;
  price: number;
  stock: number;
  store: IStore;
  categories: ICategory[];
}

export interface IEditProductRequest {
  id: string;
  name: string;
  price: string;
  stock: number;
  storeId: string;
  categories: ICategoryInput[];
}

export interface IProductCart extends IProduct {
  quantity: number;
}