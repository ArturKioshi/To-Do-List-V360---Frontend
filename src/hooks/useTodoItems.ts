import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { todoItemService } from "../services/todoItemService";
import type { CreateTodoItemParams, UpdateTodoItemParams } from "../dtos/todoItem";

export function useTodoItems(listId: number | null) {
    const queryClient = useQueryClient();
    const queryKey = ['todo-items', listId];

    const {data, isLoading, isError} = useQuery({
        queryKey: queryKey,
        queryFn: async() => {
            if (!listId) {
                return [];
            }

            const response = await todoItemService.getItemsByListId(listId);
            return response.data; 
        },
        enabled: !!listId,
        staleTime: 1000 * 60 * 5,
    });

    const createMutation = useMutation({
        mutationFn: (data: CreateTodoItemParams) => {
            if (!listId) {
                throw new Error("List ID is required to create a todo item.");
            }
            return todoItemService.createTodoItem(listId, data);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey });
        }
    })

    const updateMutation = useMutation({
        mutationFn: ({ itemId, data }: { itemId: number; data: UpdateTodoItemParams }) => 
            todoItemService.updateTodoItem(itemId, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey });
        }
    });

    const deleteMutation = useMutation({
        mutationFn: (itemId: number) => todoItemService.deleteTodoItem(itemId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey });
        }
    });

    const completeMutation = useMutation({
        mutationFn: ({ itemId, completed }: { itemId: number; completed: boolean }) => 
            todoItemService.updateTodoItem(itemId, { completed }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey });
        }
    })

    return {
        items: data ?? [],
        isLoading,
        isError,

        createItem: createMutation.mutateAsync,
        isCreating: createMutation.isPending,

        updateItem: updateMutation.mutateAsync,
        isUpdating: updateMutation.isPending,

        deleteItem: deleteMutation.mutateAsync,
        isDeleting: deleteMutation.isPending,

        completItem: completeMutation.mutateAsync,
        isCompleting: completeMutation.isPending,
    };

}