import { useState } from 'react';
import { SideBar } from './components/SideBar';
import { useTodoLists } from './hooks/useTodoLists';
import { useTodoItems } from './hooks/useTodoItems';
import { Button } from './components/Button';
import { PlusCircle } from 'phosphor-react';
import { TodoItemCard } from './components/TodoItemCard';
import { CreateTodoItemModal } from './components/CreateTodoItemModal';
import type { CreateTodoItemParams } from './dtos/todoItem';

export function App() {
    const [activeTodoListId, setActiveTodoListId] = useState<number | undefined>();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { todoLists } = useTodoLists();
    const { items, isLoading, isError, completItem, deleteItem, createItem } = useTodoItems(activeTodoListId ?? null);

    const list = todoLists.find(list => list.id === activeTodoListId);

    const handleToggleComplete = async (itemId: number) => {
        const item = items.find(i => i.id === itemId);
        if (item) {
            await completItem({ itemId, completed: !item.completed });
        }
    };

    const handleDeleteItem = async (itemId: number) => {
        const item = items.find(i => i.id === itemId);
        if (item) {
            await deleteItem(itemId);
        }
    }

    const handleCreateItem = async (data: CreateTodoItemParams) => {
        await createItem(data);
    }

    return (
        <div className="flex h-full">
            <SideBar 
                activeTodoListId={activeTodoListId}
                onTodoListSelect={setActiveTodoListId}
            />
            <main className="flex-1 bg-background ">
                <div className="p-8">
                    <h1 className="text-4xl font-bold mb-3 text-headline">V360 Todo App</h1>
                    {activeTodoListId && (
                        <div className='text-black border-t-2 border-headline'>
                            <h2 className='text-2xl font-semibold pt-2'>
                                {list?.title}
                            </h2> 
                            <h3 className='text-black'>
                                {list?.description}
                            </h3>

                            {isLoading && (
                                <p className='text-gray-600 mt-4'>Carregando tarefas...</p>
                            )}

                            {isError && (
                                <p className='text-red-500 mt-4'>Erro ao carregar tarefas</p>
                            )}

                            {!isLoading && !isError && items.length === 0 && (
                                <div className='max-w-64 flex flex-col items-start gap-2'>
                                    <p className='text-gray-500 mt-4'>Nenhuma tarefa nesta lista</p>
                                    <Button onClick={() => setIsModalOpen(true)}>
                                        <div className='flex gap-1 justify-center items-center'>
                                            <PlusCircle size={24} />
                                            <span>Nova Tarefa</span>
                                        </div>
                                    </Button>
                                </div>
                        
                            )}

                            {!isLoading && !isError && items.length > 0 && (
                                <div className='mt-3'>
                                    <div className='max-w-64'>
                                        <Button onClick={() => setIsModalOpen(true)}>
                                            <div className='flex gap-1 justify-center items-center'>
                                                <PlusCircle size={24} />
                                                <span>Nova Tarefa</span>
                                            </div>
                                        </Button>
                                    </div>

                                    <div className='flex flex-col gap-2 mt-2'>
                                        {items.map(item => (
                                            <TodoItemCard 
                                                key={item.id}
                                                item={item}
                                                onToggleComplete={handleToggleComplete}
                                                onDelete={handleDeleteItem}
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}

                            <CreateTodoItemModal 
                                isOpen={isModalOpen}
                                onClose={() => setIsModalOpen(false)}
                                onCreate={handleCreateItem}
                            />
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}

