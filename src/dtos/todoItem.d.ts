export interface TodoItemAPIResponse {
  id: number;
  todo_list_id: number;
  title: string;
  content: string | null;
  completed: boolean;
  priority: number; // 1, 2 ou 3
  due_date: string | null;
  created_at: string;
  updated_at: string;
}

export type CreateTodoItemParams = {
  title: string;
  content?: string;
  priority?: number;
  due_date?: string | null;
};

export type UpdateTodoItemParams = Partial<CreateTodoItemParams> & {
  completed?: boolean;
};