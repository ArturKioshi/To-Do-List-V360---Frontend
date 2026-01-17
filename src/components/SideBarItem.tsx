import { Trash } from 'phosphor-react';
import { ClassMerge } from '../utils/ClassMerge';
import type { TodoListAPIResponse } from '../dtos/todoList';

interface SideBarItemProps {
  todoList: TodoListAPIResponse;
  isActive: boolean;
  onSelect: (id: number) => void;
  onDelete: (e: React.MouseEvent, id: number) => void;
}

export function SideBarItem({ todoList, isActive, onSelect, onDelete }: SideBarItemProps) {
  return (
    <div
      className={ClassMerge(
        'w-full flex items-center justify-between px-3 py-2.5 rounded-lg mb-1 transition-colors group',
        isActive
          ? 'bg-secondary text-white'
          : 'text-(--color-headline) hover:bg-gray-100',
      )}
    >
      <button
        onClick={() => onSelect(todoList.id)}
        className="flex-1 flex flex-col items-start hover:cursor-pointer"
      >
        <span className="font-medium">{todoList.title}</span>
        {todoList.description && (
          <span className="text-xs opacity-80">{todoList.description}</span>
        )}
      </button>
      <button
        onClick={(e) => onDelete(e, todoList.id)}
        className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-red-500/10 rounded hover:cursor-pointer"
        title="Excluir lista"
      >
        <Trash size={18} className="text-red-500" />
      </button>
    </div>
  );
}
