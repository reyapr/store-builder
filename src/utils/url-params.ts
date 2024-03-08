import { ReadonlyURLSearchParams } from "next/navigation";

export interface IQueryParams {
  key: string;
  value: string;
}

export const createQueryString = (currentParams: ReadonlyURLSearchParams, queryParams: IQueryParams) => {
  const current = new URLSearchParams(Array.from(currentParams.entries()));
  if(queryParams.value) {
    current.set(queryParams.key, queryParams.value);
  } else {
    current.delete(queryParams.key);
  }
  
  const query = current.toString();
  return query ? `?${query}` : '';
};


