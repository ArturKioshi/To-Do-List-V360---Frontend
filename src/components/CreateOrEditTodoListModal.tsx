import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react';
import { X } from 'phosphor-react';
import { useState, useEffect } from 'react';
import { Button } from './Button';
import type { TodoListAPIResponse } from '../dtos/todoList';

interface CreateOrEditTodoListModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (title: string, description?: string) => Promise<void>;
  onUpdate?: (id: number, title: string, description?: string) => Promise<void>;
  todoList?: TodoListAPIResponse;
}

export function CreateOrEditTodoListModal({ isOpen, onClose, onCreate, onUpdate, todoList }: CreateOrEditTodoListModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const isEditMode = !!todoList;

  useEffect(() => {
    if (todoList) {
      setTitle(todoList.title);
      setDescription(todoList.description || '');
    } else {
      setTitle('');
      setDescription('');
    }
  }, [todoList, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setIsLoading(true);
    try {
      if (isEditMode && onUpdate && todoList) {
        await onUpdate(todoList.id, title, description || undefined);
      } else {
        await onCreate(title, description || undefined);
      }
      setTitle('');
      setDescription('');
      onClose();
    } catch (error) {
      console.error(`Erro ao ${isEditMode ? 'atualizar' : 'criar'} lista:`, error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      setTitle('');
      setDescription('');
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onClose={handleClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30"  />
      
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel className="w-full max-w-md bg-white rounded-xl shadow-xl">
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <DialogTitle className="text-xl font-bold text-(--color-headline)">
              {isEditMode ? 'Editar Lista de Tarefas' : 'Nova Lista de Tarefas'}
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
                placeholder="Digite o título da lista"
                disabled={isLoading}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-(--color-headline) focus:border-2 disabled:opacity-50"
                required
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-(--color-headline) mb-2">
                Descrição
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Digite uma descrição (opcional)"
                disabled={isLoading}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-(--color-headline) focus:border-2 resize-none disabled:opacity-50"
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
                {isLoading 
                  ? (isEditMode ? 'Atualizando...' : 'Criando...') 
                  : (isEditMode ? 'Atualizar Lista' : 'Criar Lista')
                }
              </Button>
            </div>
          </form>
        </DialogPanel>
      </div>
    </Dialog>
  );
}
