import { useState, useEffect } from 'react';
import type { List } from '../types/types';

interface UseTaskListProps {
  list: List;
  onAddTask: (listId: List['id']) => void;
  onUpdateList: (listId: List['id'], newName: string) => void;
  onDeleteList: (listId: List['id']) => void;
}

export const useTaskList = ({ list, onAddTask, onUpdateList, onDeleteList}: UseTaskListProps) => {
  
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [currentName, setCurrentName] = useState(list.name);
  const [isOptionsOpen, setIsOptionsOpen] = useState(false);

  const handleTitleSave = () => {
    setIsEditingTitle(false);
    
    const trimmedName = currentName.trim();
    if (trimmedName && trimmedName !== list.name) {
      onUpdateList(list.id, trimmedName);
    } else {
      setCurrentName(list.name);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleTitleSave();
    }
    if (e.key === 'Escape') {
      setIsEditingTitle(false);
      setCurrentName(list.name);
    }
  };

  const handleNewTaskClick = () => {
    onAddTask(list.id);
  };

  const handleOpenOptions = () => {
    setIsOptionsOpen(true);
  };

  const handleCloseOptions = () => {
    setIsOptionsOpen(false);
  };
  
  const handleEditClick = () => {
    setIsEditingTitle(true);
    setIsOptionsOpen(false);
  };
  
  const handleDeleteClick = () => {
    onDeleteList(list.id);
    setIsOptionsOpen(false); 
  };

  useEffect(() => {
    if (!isEditingTitle) {
      setCurrentName(list.name);
    }
  }, [list.name, isEditingTitle]);

  return {
    isEditingTitle,
    currentName,
    isOptionsOpen,
    setIsEditingTitle,
    setCurrentName,
    handleTitleSave,
    handleKeyDown,
    handleNewTaskClick,
    handleOpenOptions, 
    handleCloseOptions,
    handleEditClick,
    handleDeleteClick
  };
};