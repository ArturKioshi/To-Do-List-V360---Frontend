export interface TodoListAPIResponse {
  id: number;
  title: string;
  description: string | null; 
  created_at: string; // ISO 8601
  updated_at: string;
}

export type CreateTodoListParams = {
  title: string;
  description?: string;
}