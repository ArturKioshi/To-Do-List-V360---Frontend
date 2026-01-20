import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react';
import { X } from 'phosphor-react';
import { useState, useEffect } from 'react';
import { Button } from './Button';
import type { CreateTodoItemParams, TodoItemAPIResponse } from '../dtos/todoItem';

interface CreateTodoItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (data: CreateTodoItemParams) => Promise<void>;
  todoItem?: TodoItemAPIResponse;
  onUpdate?: (id: number, data: CreateTodoItemParams) => Promise<void>;
}

export function CreateOrUpdateTodoItemModal({ isOpen, onClose, onCreate, todoItem, onUpdate }: CreateTodoItemModalProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [priority, setPriority] = useState<number>(2);
  const [dueDate, setDueDate] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const isEditMode = !!todoItem;

  useEffect(() => {
    if (todoItem) {
      setTitle(todoItem.title);
      setContent(todoItem.content || '');
      setPriority(todoItem.priority);
      setDueDate(todoItem.due_date || '');
    } else {
      setTitle('');
      setContent('');
      setPriority(2);
      setDueDate('');
    }
  }, [todoItem, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setIsLoading(true);
    try {
      const data: CreateTodoItemParams = {
        title,
        content: content || undefined,
        priority,
        due_date: dueDate || null,
      };

      if (isEditMode && onUpdate && todoItem) {
        await onUpdate(todoItem.id, data);
      } else {
        await onCreate(data);
      }
      
      setTitle('');
      setContent('');
      setPriority(2);
      setDueDate('');
      onClose();
    } catch (error) {
      console.error(`Erro ao ${isEditMode ? 'atualizar' : 'criar'} tarefa:`, error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      setTitle('');
      setContent('');
      setPriority(2);
      setDueDate('');
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onClose={handleClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" />
      
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel className="w-full max-w-md bg-white rounded-xl shadow-xl">
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <DialogTitle className="text-xl font-bold text-(--color-headline)">
              {isEditMode ? 'Editar Tarefa' : 'Nova Tarefa'}
            </DialogTitle>
            <button
              onClick={handleClose}
              disabled={isLoading}
              className="p-1 hover:bg-gray-100 rounded transition-colors disabled:opacity-50 hover:cursor-pointer"
            >
              <X size={24} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-(--color-headline) mb-2">
                Título *
              </label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Digite o título da tarefa"
                disabled={isLoading}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-(--color-headline) focus:border-2 disabled:opacity-50"
                required
              />
            </div>

            <div>
              <label htmlFor="content" className="block text-sm font-medium text-(--color-headline) mb-2">
                Descrição
              </label>
              <textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Digite uma descrição (opcional)"
                disabled={isLoading}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-(--color-headline) focus:border-2 resize-none disabled:opacity-50"
              />
            </div>

            <div>
              <label htmlFor="priority" className="block text-sm font-medium text-(--color-headline) mb-2">
                Prioridade
              </label>
              <select
                id="priority"
                value={priority}
                onChange={(e) => setPriority(Number(e.target.value))}
                disabled={isLoading}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-(--color-headline) focus:border-2 disabled:opacity-50"
              >
                <option value={1}>Baixa</option>
                <option value={2}>Média</option>
                <option value={3}>Alta</option>
              </select>
            </div>

            <div>
              <label htmlFor="dueDate" className="block text-sm font-medium text-(--color-headline) mb-2">
                Data de Vencimento
              </label>
              <input
                id="dueDate"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                disabled={isLoading}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-(--color-headline) focus:border-2 disabled:opacity-50"
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                onClick={handleClose}
                disabled={isLoading}
                variant="cancel"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                onClick={() => null}
                disabled={isLoading || !title.trim()}
              >
                {isLoading ? (isEditMode ? 'Atualizando...' : 'Criando...') : (isEditMode ? 'Atualizar Tarefa' : 'Criar Tarefa')}
              </Button>
            </div>
          </form>
        </DialogPanel>
      </div>
    </Dialog>
  );
}
