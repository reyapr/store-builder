import { ICategory } from "@/interfaces/category";
import { IStore } from "@/interfaces/store";

export interface ICreateProductRequest {
  name: string;
  price: number;
  quantity: number;
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
  quantity: number;
  storeId: string;
  categories: ICategoryInput[];
}

export interface IProduct {
  id: string;
  name: string;
  price: number;
  quantity: number;
  store: IStore;
  categories: ICategory[];
}