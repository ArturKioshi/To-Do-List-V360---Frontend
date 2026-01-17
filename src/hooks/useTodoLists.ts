import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { CreateTodoListParams } from "../dtos/todoList"; 
import { todoListService } from "../services/todoListService";

export function useTodoLists() {
    const queryClient = useQueryClient();

    const { data, isLoading, isError } = useQuery({
        queryKey: ['todo-lists'], 
        queryFn: async () => {
            const response = await todoListService.getTodoLists();
            return response.data;
        },
        staleTime: 1000 * 60 * 5,
    });

    const createMutation = useMutation({
        mutationFn: (params: CreateTodoListParams) => todoListService.createTodoList(params),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['todo-lists'] });
        }
    });

    const deleteMutation = useMutation({
        mutationFn: (id: number) => todoListService.deleteTodoList(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['todo-lists'] });
        }
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, data }: { id: number; data: Partial<CreateTodoListParams> }) => 
            todoListService.updateTodoList(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['todo-lists'] });
        }
    });

    return {
        todoLists: data ?? [], 
    
        isLoading,
        isError,
        
        createTodoList: createMutation.mutateAsync,
        isCreating: createMutation.isPending,

        deleteTodoList: deleteMutation.mutateAsync,
        isDeleting: deleteMutation.isPending,

        updateTodoList: updateMutation.mutateAsync, 
        isUpdating: updateMutation.isPending,
    };
}