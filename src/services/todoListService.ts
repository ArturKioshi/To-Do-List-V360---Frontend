import type { CreateTodoListParams, TodoListAPIResponse } from "../dtos/todoList"
import { api } from "./api"

export const todoListService = {
    getTodoLists: () => {
        const response = api.get<TodoListAPIResponse[]>("/todo_lists");
        return response;
    },

    getTodoListById: (id: number) => {
        const response = api.get<TodoListAPIResponse>(`/todo_lists/${id}`);
        return response;
    },

    createTodoList: (data: CreateTodoListParams) => {
        const response = api.post<TodoListAPIResponse>("/todo_lists", {
            todo_list: data
        });
        return response;
    },

    updateTodoList: (id: number, data: Partial<CreateTodoListParams>) => {
        const response = api.patch<TodoListAPIResponse>(`/todo_lists/${id}`, {
            todo_list: data
        });
        return response;
    },

    deleteTodoList: (id: number) => {
        const response = api.delete(`/todo_lists/${id}`);
        return response;
    },

    
}