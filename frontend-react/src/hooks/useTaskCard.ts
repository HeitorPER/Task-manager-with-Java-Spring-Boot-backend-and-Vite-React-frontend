import { useState, useEffect, useRef } from 'react';
import type { Task } from '../types/types';
import type { TaskUpdateDTO } from '../services/apiService';

interface UseTaskCardProps {
  task: Task;
  onUpdateTask: (taskId: Task['id'], updateData: TaskUpdateDTO) => void;
  onDeleteTask: (task: Task) => void;
  onDuplicateTask: (task: Task) => void;
  onOpenSidebar: (task: Task) => void;
}

export const useTaskCard = ({ task, onUpdateTask, onDeleteTask, onDuplicateTask, onOpenSidebar }: UseTaskCardProps) => {
  const [isEditingName, setIsEditingName] = useState(false);
  const [currentName, setCurrentName] = useState(task.name);

  const [isOptionsOpen, setIsOptionsOpen] = useState(false);
  const [menuPosition, setMenuPosition] = useState<{ x: number, y: number } | null>(null);

  const menuRef = useRef<HTMLDivElement>(null);

  const handleNameSave = () => {
    setIsEditingName(false);
    const trimmedName = currentName.trim();
    if (trimmedName && trimmedName !== task.name) {
      onUpdateTask(task.id, { name: trimmedName });
    } else {
      setCurrentName(task.name);
    }
  };

  const handleNameKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' ) handleNameSave();
    if (e.key === 'Escape') {
      setIsEditingName(false);
      setCurrentName(task.name);
    }
  };
  
  const handleOpenOptions = () => {
    setIsOptionsOpen(true);
  };

  const handleCloseOptions = () => {
    setIsOptionsOpen(false);
  };

  const handleEditClick = () => {
    setIsEditingName(true);
    setMenuPosition(null); 
  };
  
  const handleDeleteClick = () => {
    onDeleteTask(task);
    setMenuPosition(null); 
  };
  
  const handleDuplicateClick = () => {
    onDuplicateTask(task);
    setMenuPosition(null); 
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setMenuPosition({ x: e.clientX, y: e.clientY });
  };

  const handlePriorityChange = (newPriority: 'LOW' | 'MEDIUM' | 'HIGH' | 'VERY_HIGH') => {
    onUpdateTask(task.id, { priority: newPriority });
  };

  const handleCardClick = (e: React.MouseEvent) => {
    // Não abre a sidebar se o usuário estiver clicando num input ou botão
    if ((e.target as HTMLElement).closest('input, button, a')) return;
    if (isEditingName) return; // Não abre se estiver editando o nome

    onOpenSidebar(task);
  };

  useEffect(() => {
    if (!isEditingName) {
      setCurrentName(task.name);
    }
  }, [task.name, isEditingName]);

  useEffect(() => {
    if (!menuPosition) return;
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuPosition(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("contextmenu", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("contextmenu", handleClickOutside);
    };
  }, [menuPosition]);

  return {
    isEditingName,
    currentName,
    setIsEditingName,
    setCurrentName,
    handleNameSave,
    handleNameKeyDown,
    isOptionsOpen,
    handleOpenOptions,
    handleCloseOptions,
    handleEditClick,
    handleDeleteClick,
    handleDuplicateClick,
    menuPosition,
    menuRef,
    handleContextMenu,
    handlePriorityChange,
    handleCardClick
  };
};