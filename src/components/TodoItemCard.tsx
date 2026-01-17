import { CalendarBlank, Flag, Trash } from 'phosphor-react';
import type { TodoItemAPIResponse } from '../dtos/todoItem';
import { ClassMerge } from '../utils/ClassMerge';
import { formatDate } from '../utils/dateUtils';

interface TodoItemCardProps {
  item: TodoItemAPIResponse;
  onToggleComplete?: (id: number) => void;
  onDelete?: (id: number) => void;
}

const priorityColors = {
  1: 'text-green-600',
  2: 'text-yellow-600',
  3: 'text-red-600',
};

const priorityLabels = {
  1: 'Baixa',
  2: 'Média',
  3: 'Alta',
};

export function TodoItemCard({ item, onToggleComplete, onDelete }: TodoItemCardProps) {

  function handleToggleComplete(e: React.MouseEvent) {
    e.stopPropagation();
    onToggleComplete?.(item.id);
  }

  function handleDelete(e: React.MouseEvent) {
    e.stopPropagation();
    if (window.confirm('Tem certeza que deseja excluir esta tarefa?')) {
      onDelete?.(item.id);
    }
  }

  return (
    <div
      className={ClassMerge(
        'bg-white border-2 border-gray-200 rounded-lg p-4 hover:border-secondary transition-colors group',
        item.completed && 'opacity-60'
      )}
    >
      <div className="flex items-start gap-3">
        {/* Checkbox */}
        <button
          onClick={(e) => handleToggleComplete(e)}
          className={ClassMerge(
            'w-5 h-5 rounded border-2 flex items-center justify-center transition-colors mt-0.5 hover:cursor-pointer',
            item.completed
              ? 'bg-secondary border-secondary'
              : 'border-gray-300 hover:border-secondary'
          )}
        >
          {item.completed && (
            <span className="text-white text-sm">✓</span>
          )}
        </button>

        {/* Content */}
        <div className="flex-1">
          <h3 className={ClassMerge(
            'font-semibold text-headline mb-1',
            item.completed && 'line-through'
          )}>
            {item.title}
          </h3>
          
          {item.content && (
            <p className="text-sm text-gray-600 mb-2">{item.content}</p>
          )}

          {/* Date and Priority */}
          <div className="flex items-center gap-4 text-sm">
            {item.due_date && (
              <div className="flex items-center gap-1 text-gray-500">
                <CalendarBlank size={16} />
                <span>{formatDate(item.due_date)}</span>
              </div>
            )}

            <div className={ClassMerge(
              'flex items-center gap-1 font-medium',
              priorityColors[item.priority as keyof typeof priorityColors]
            )}>
              <Flag size={16} weight="fill" />
              <span>{priorityLabels[item.priority as keyof typeof priorityLabels]}</span>
            </div>
          </div>
        </div>

        {/* Delete Button */}
        <button
          onClick={handleDelete}
          className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-red-500/10 rounded hover:cursor-pointer"
          title="Excluir tarefa"
        >
          <Trash size={24} className="text-red-500" />
        </button>
      </div>
    </div>
  );
}
