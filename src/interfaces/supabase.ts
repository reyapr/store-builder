import { StorageError } from "@supabase/storage-js";

export interface ISupabaseDataUploadResponse {
  id: string; 
  path: string; 
  fullPath: string 
}
export interface ISupabaseUploadResponse { 
  data: ISupabaseDataUploadResponse | null,
  error: StorageError
}
