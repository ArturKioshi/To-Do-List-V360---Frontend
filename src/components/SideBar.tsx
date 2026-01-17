import { useState } from 'react';
import { useTodoLists } from '../hooks/useTodoLists';
import { ClipboardText, PlusCircle } from 'phosphor-react';
import { SideBarItem } from './SideBarItem';
import { CreateTodoListModal } from './CreateTodoListModal';
import { Button } from './Button';

interface SideBarProps {
  activeTodoListId?: number;
  onTodoListSelect: (todoListId: number) => void;
}

export function SideBar({ activeTodoListId, onTodoListSelect }: SideBarProps) {
    const { todoLists, isLoading, isError, deleteTodoList, createTodoList } = useTodoLists();
    const [isModalOpen, setIsModalOpen] = useState(false);

    const activeId = activeTodoListId;

    const handleDelete = async (e: React.MouseEvent, id: number) => {
        e.stopPropagation();
        if (window.confirm('Tem certeza que deseja excluir esta lista?')) {
            await deleteTodoList(id);
        }
    };

    const handleCreateList = async (title: string, description?: string) => {
        await createTodoList({ title, description });
    };

    if (isLoading) {
        return (
            <div className="w-64 bg-white h-screen flex flex-col border-r border-gray-200 items-center justify-center">
                <p className="text-(--color-headline)">Carregando...</p>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="w-64 bg-white h-screen flex flex-col border-r border-gray-200 items-center justify-center">
                <p className="text-red-500">Erro ao carregar listas</p>
            </div>
        );
    }

  return (
    <div className="w-64 bg-white h-screen flex flex-col border-r border-gray-200">
      {/* Logo */}
      <div className="p-6">
        <div className="flex items-center gap-2">
          <ClipboardText size={26} />
          <h1 className="text-xl font-bold text-(--color-headline)">V360 Tasks</h1>
        </div>
      </div>

      {/* Project List */}
      <nav className="flex-1 px-3">
        {todoLists.map((todoList) => (
          <SideBarItem
            key={todoList.id}
            todoList={todoList}
            isActive={todoList.id === activeId}
            onSelect={onTodoListSelect}
            onDelete={handleDelete}
          />
        ))}
      </nav>

      {/* Button */}
      <div className='p-3'>
        <Button onClick={() => setIsModalOpen(true)} >
          <div className='flex gap-1 justify-center items-center'>
            <PlusCircle size={24} />
            <span>Nova Lista</span>
          </div>
        </Button>
      </div>

      <CreateTodoListModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreate={handleCreateList}
      />
    </div>
  );
}
