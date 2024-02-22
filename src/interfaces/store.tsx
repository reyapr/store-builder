
export interface ICreateStoreRequest {
  name: string;
  email: string;
}

export interface IUpdateStoreRequest {
  id: string;
  name: string;
}

export interface ISubmitStoreFormRequest {
  name: string;
  id?: string;
}