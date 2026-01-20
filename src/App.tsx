import { useState } from 'react';
import { SideBar } from './components/SideBar';
import { useTodoLists } from './hooks/useTodoLists';
import { useTodoItems } from './hooks/useTodoItems';
import { Button } from './components/Button';
import { PlusCircle, List } from 'phosphor-react';
import { TodoItemCard } from './components/TodoItemCard';
import { CreateOrUpdateTodoItemModal } from './components/CreateOrEditTodoItemModal';
import type { CreateTodoItemParams, TodoItemAPIResponse } from './dtos/todoItem';
import { ClassMerge } from './utils/ClassMerge';
import { PencilSimple } from 'phosphor-react';
import { CreateOrEditTodoListModal } from './components/CreateOrEditTodoListModal';

export function App() {
    const [activeTodoListId, setActiveTodoListId] = useState<number | undefined>();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isEditListModalOpen, setIsEditListModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<TodoItemAPIResponse | undefined>();
    const { todoLists } = useTodoLists();
    const { items, isLoading, isError, completItem, deleteItem, createItem, updateItem } = useTodoItems(activeTodoListId ?? null);
    const { createTodoList,updateTodoList } = useTodoLists();

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

    const handleUpdateItem = async (id: number, data: CreateTodoItemParams) => {
        await updateItem({ itemId: id, data });
    }

    const handleCreateList = async (title: string, description?: string) => {
        await createTodoList({ title, description });
    }

    const handleUpdateList = async (id: number, title: string, description?: string) => {
        await updateTodoList({ id, data: { title, description } });
    }

    return (
        <div className="flex h-full relative">
            {/* Backdrop mobile */}
            {isSidebarOpen && (
                <div 
                    className="fixed inset-0 bg-black/30 z-40 lg:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <div className={ClassMerge("fixed lg:relative inset-y-0 left-0 z-50 lg:z-auto transition-transform duration-300 lg:translate-x-0",  
                isSidebarOpen ? "translate-x-0" : "-translate-x-full"
            )}>
                <SideBar 
                    activeTodoListId={activeTodoListId}
                    onTodoListSelect={(id) => {
                        setActiveTodoListId(id);
                        setIsSidebarOpen(false);
                    }}
                />
            </div>

            <main className="flex-1 bg-background">
                {/* Button to open sidebar */}
                <div className="lg:hidden p-4">
                    <button
                        onClick={() => setIsSidebarOpen(true)}
                        className="p-2 hover:bg-gray-100 rounded transition-colors hover:cursor-pointer"
                    >
                        <List size={24} className="text-headline" />
                    </button>
                </div>

                <div className="p-4 lg:p-8">
                    <h1 className="text-4xl font-bold mb-3 text-headline">V360 Todo App</h1>
                    {activeTodoListId && (
                        <div className='text-black border-t-2 border-headline'>
                            <h2 className='text-2xl font-semibold pt-2 flex items-center gap-0.5'>
                                {list?.title}
                                <button
                                    onClick={() => setIsEditListModalOpen(true)}
                                    className="p-1 hover:bg-gray-100 rounded transition-colors hover:cursor-pointer"
                                >
                                    <PencilSimple size={20} />
                                </button>
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
                                                onEdit={(item) => {
                                                    setEditingItem(item);
                                                    setIsModalOpen(true);
                                                }}
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}

                            <CreateOrEditTodoListModal 
                                isOpen={isEditListModalOpen}
                                onClose={() => setIsEditListModalOpen(false)}
                                onCreate={handleCreateList}
                                todoList={list}
                                onUpdate={handleUpdateList}
                            />

                            <CreateOrUpdateTodoItemModal 
                                isOpen={isModalOpen}
                                onClose={() => {
                                    setIsModalOpen(false);
                                    setEditingItem(undefined);
                                }}
                                onCreate={handleCreateItem}
                                todoItem={editingItem}
                                onUpdate={handleUpdateItem}
                            />
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}

