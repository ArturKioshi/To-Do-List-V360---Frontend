import type { CreateTodoItemParams, TodoItemAPIResponse, UpdateTodoItemParams } from "../dtos/todoItem";
import { api } from "./api";

export const todoItemService = {
    
    getItemsByListId: (listId: number) => {
        const response = api.get<TodoItemAPIResponse[]>(`/todo_lists/${listId}/todo_items`);
        return response;
    },

    getTodoItemById: (itemId: number) => {
        const response = api.get<TodoItemAPIResponse>(`/todo_items/${itemId}`);
        return response;
    },

    createTodoItem: (listId: number, data: CreateTodoItemParams) => {
        const response = api.post<TodoItemAPIResponse>(`/todo_lists/${listId}/todo_items`, {
            todo_item: data
        });
        return response;
    },

    updateTodoItem: (itemId: number, data: UpdateTodoItemParams) => {
        const response = api.patch<TodoItemAPIResponse>(`/todo_items/${itemId}`, {
            todo_item: data
        });
        return response;
    },

    deleteTodoItem: (itemId: number) => {
        const response = api.delete(`/todo_items/${itemId}`);
        return response;
    }
};