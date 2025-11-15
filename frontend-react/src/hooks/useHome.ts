import { useState, useEffect } from 'react';
import type { List, Task } from '../types/types';
import * as api from '../services/apiService';
import type { DragEndEvent, DragStartEvent} from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';


export const useHome = () => {
  const [lists, setLists] = useState<List[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showSuccessSnackbar, setShowSuccessSnackbar] = useState(false);
  const [listToDelete, setListToDelete] = useState<List | null>(null);
  const [taskToDelete, setTaskToDelete] = useState<{ taskId: string | number, listId: string | number, taskName: string } | null>(null);
  const [showTaskDeleteSnackbar, setShowTaskDeleteSnackbar] = useState(false);
  const [editingTask, setEditingTask] = useState<{ task: Task, listId: List['id'] } | null>(null);
  const [isSidebarClosing, setIsSidebarClosing] = useState(false);
  const [activeDragTask, setActiveDragTask] = useState<Task | null>(null);

  const handleOpenSidebar = (task: Task, listId: List['id']) => {
    setIsSidebarClosing(false);
    setEditingTask({ task, listId });
  };

  const handleCloseSidebar = () => {
    setIsSidebarClosing(true);
  };

  useEffect(() => {
    if (isSidebarClosing) {
      const timer = setTimeout(() => {
        setEditingTask(null); 
        setIsSidebarClosing(false); 
      }, 300);

      return () => clearTimeout(timer);
    }
  }, [isSidebarClosing]);

  useEffect(() => {
    api.fetchLists()
      .then(data => setLists(data))
      .catch(error => {
        console.error("Erro ao carregar quadro:", error);
        alert(`Erro ao carregar quadro: ${error.message}`);
      })
      .finally(() => setIsLoading(false));
  }, []);

  const handleAddNewList = async () => {
    try {
      const currentListCount = lists.length;
      const newListName = `Lista ${currentListCount + 1}`;
      const newList = await api.createList({ name: newListName });
      const listWithTasks = { ...newList, tasks: newList.tasks || [] };
      setLists(currentLists => [...currentLists, listWithTasks]);
    } catch (error) {
      console.error("Erro ao criar lista:", error);
      alert(`Erro: ${(error as Error).message}`);
    }
  };

  const handleUpdateList = async (listId: List['id'], newName: string) => {
    try {
      const updatedList = await api.updateList(listId, { name: newName });
      setLists(currentLists => 
        currentLists.map(list => 
          list.id === updatedList.id ? updatedList : list
        )
      );
    } catch (error) {
      console.error("Erro ao atualizar lista:", error);
      alert(`Erro: ${(error as Error).message}`);
    }
  };

  const handleAddNewTask = async (listId: List['id']) => {
    try {
      const newTask = await api.createTask({
        name: 'Nova Tarefa',
        description: '',
        priority: 'LOW',
        listId: listId
      });
      
      setLists(currentLists => 
        currentLists.map(list => 
          list.id === listId ? { ...list, tasks: [...list.tasks, newTask] } : list
        )
      );

      setEditingTask({ task: newTask, listId: listId });
    } catch (error) {
      console.error("Erro ao criar tarefa:", error);
      alert(`Erro: ${(error as Error).message}`);
    }
  };

  const handleUpdateTask = async (taskId: Task['id'], updateData: api.TaskUpdateDTO) => {
    try {
      const updatedTask = await api.updateTask(taskId, updateData);
      setLists(currentLists => 
        currentLists.map(list => ({
          ...list,
          tasks: list.tasks.map(task => 
            task.id === updatedTask.id ? updatedTask : task
          )
        }))
      );
      setEditingTask(prevState => {
        if (prevState && prevState.task.id === updatedTask.id) {
          return { ...prevState, task: updatedTask };
        }
        return prevState;
      });
    } catch (error) {
      console.error("Erro ao atualizar tarefa:", error);
      alert(`Erro: ${(error as Error).message}`);
    }
  };

  const handleRequestDeleteList = (listId: List['id']) => {
    const list = lists.find(l => l.id === listId);
    if (list) {
      setListToDelete(list);
    }
  };

  useEffect(() => {
    if (showSuccessSnackbar) {
      const timer = setTimeout(() => {
        setShowSuccessSnackbar(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showSuccessSnackbar]);

  const handleConfirmDeleteList = async () => {
    if (!listToDelete) return;

    try {
      await api.deleteList(listToDelete.id);
      setLists(currentLists => currentLists.filter(l => l.id !== listToDelete.id));
      setListToDelete(null); 

      setShowSuccessSnackbar(true); 
      
    } catch (error) {
      console.error("Erro ao deletar:", error);
      alert("Erro ao deletar lista");
    }
  };

  const handleCancelDeleteList = () => {
    setListToDelete(null);
  };

  const handleCloseSnackbar = () => {
    setShowSuccessSnackbar(false);
  };

  const handleDeleteTask = (taskId: Task['id'], listId: List['id'], taskName: string) => {
    setTaskToDelete({ taskId, listId, taskName });
};

  const handleDeleteTaskFromSidebar = () => {
    if (!editingTask) return; 
    handleDeleteTask(editingTask.task.id, editingTask.listId, editingTask.task.name);
    handleCloseSidebar();
  };

  const handleDuplicateTask = async (taskToDuplicate: Task, listId: List['id']) => {
    try {
      const dto: api.TaskCreateDTO = {
        name: `${taskToDuplicate.name} (Cópia)`,
        description: taskToDuplicate.description || '',
        priority: taskToDuplicate.priority || 'LOW',
        listId: listId
      };
      
  const newTask = await api.createTask(dto);
      setLists(currentLists => 
        currentLists.map(list => 
          list.id === listId 
            ? { ...list, tasks: [...list.tasks, newTask] }
            : list
        )
      );

      setEditingTask({ task: newTask, listId: listId });
    } catch (error) {
      console.error("Erro ao duplicar tarefa:", error);
      alert(`Erro: ${(error as Error).message}`);
    }
  };

  const handleToggleTaskComplete = (task: Task) => {
    const isNowCompleted = !task.completed;

    handleUpdateTask(task.id, { 
      completed: isNowCompleted,
    });
    };

    useEffect(() => {
    if (showTaskDeleteSnackbar) {
      const timer = setTimeout(() => setShowTaskDeleteSnackbar(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showTaskDeleteSnackbar]);

  const handleCloseTaskSnackbar = () => {
    setShowTaskDeleteSnackbar(false);
  };

  const handleConfirmDeleteTask = async () => {
    if (!taskToDelete) return;

    try {
      await api.deleteTask(taskToDelete.taskId);
      
      setLists(currentLists => 
        currentLists.map(list => 
          list.id === taskToDelete.listId
            ? { ...list, tasks: list.tasks.filter(task => task.id !== taskToDelete.taskId) }
            : list
        )
      );

      if (editingTask && editingTask.task.id === taskToDelete.taskId) {
        handleCloseSidebar();
      }
      
      setTaskToDelete(null);
      setShowTaskDeleteSnackbar(true);

    } catch (error) {
      console.error("Erro ao deletar tarefa:", error);
      alert(`Erro: ${(error as Error).message}`);
    }
  };

  const handleCancelDeleteTask = () => {
    setTaskToDelete(null); 
  };

  const handleTaskDragStart = (event: DragStartEvent) => {
    const { active } = event;
    if (active.data.current?.type === 'Task') {
      setActiveDragTask(active.data.current.task as Task);
    }
  };

  const handleTaskDragEnd = (event: DragEndEvent) => {
    setActiveDragTask(null); 
    const { active, over } = event;
    
    // Verificação de segurança 1
    if (!over || active.id === over.id) return;

    // --- 1. Identificar a Tarefa (Active) ---
    const activeData = active.data.current; 
    if (!activeData || activeData.type !== 'Task') return;
    
    // Variáveis que faltavam:
    const activeTaskId = active.id.toString();
    const oldListId = activeData.listId.toString();

    // --- 2. Identificar o Destino (Over) ---
    const overData = over.data.current;
    if (!overData) return;

    // Variáveis que faltavam:
    const overIsList = overData.type === 'List';
    const overIsTask = overData.type === 'Task';

    if (!overIsList && !overIsTask) return; // Largou num sítio inválido

    // Corrigido: 'newListId' não existe, a variável correta é 'overListId'
    const overListId = overIsList 
        ? over.id.toString() 
        : overData.listId.toString();

    // --- 3. Atualização Otimista (Mover no Frontend) ---
    setLists(currentLists => {
      const oldListIndex = currentLists.findIndex(l => l.id.toString() === oldListId);
      const newListIndex = currentLists.findIndex(l => l.id.toString() === overListId); // Corrigido

      if (oldListIndex === -1 || newListIndex === -1) return currentLists;

      const newListsState = currentLists.map(list => ({...list, tasks: [...list.tasks]}));
      const oldList = newListsState[oldListIndex];
      const newList = newListsState[newListIndex];

      // 'activeTaskId' agora está definido e isto funciona:
      const oldTaskIndex = oldList.tasks.findIndex(t => t.id.toString() === activeTaskId);
      if (oldTaskIndex === -1) return currentLists;

      // 1. Remove da lista antiga
      const [movedTask] = oldList.tasks.splice(oldTaskIndex, 1);
      
      // 2. Adiciona à nova lista
      // 'overIsList' agora está definido e isto funciona:
      const newIndex = overIsList ? 0 : (overData.index ?? 0);
      newList.tasks.splice(newIndex, 0, movedTask);

      // --- 3. Atualizar o 'displayOrder' (Sua lógica estava correta) ---
      if (oldListId !== overListId) { // Corrigido
        oldList.tasks.forEach((task, index) => {
          task.displayOrder = index;
        });
      }
      newList.tasks.forEach((task, index) => {
        task.displayOrder = index;
      });
      // -------------------------------

      // --- 4. Salvar no Backend (Sua lógica estava correta) ---
      if (oldListId !== overListId) { // Corrigido
        api.reorderTasks(oldListId, oldList.tasks.map(t => t.id));
        api.reorderTasks(overListId, newList.tasks.map(t => t.id)); // Corrigido
      } else {
        api.reorderTasks(overListId, newList.tasks.map(t => t.id)); // Corrigido
      }
      
      return newListsState;
    });
  };
  return {
    lists,
    isLoading,
    editingTask,
    isSidebarClosing,
    handleAddNewList,
    handleUpdateList,
    handleAddNewTask,
    handleUpdateTask,
    handleDeleteList: handleRequestDeleteList,
    handleDuplicateTask, 
    handleDeleteTask,
    showSuccessSnackbar,
    handleCloseSnackbar,
    listToDelete, 
    handleConfirmDeleteList, 
    handleCancelDeleteList, 
    handleOpenSidebar,  
    handleCloseSidebar,
    handleDeleteTaskFromSidebar,
    handleToggleTaskComplete,
    handleConfirmDeleteTask,
    handleCancelDeleteTask,
    handleCloseTaskSnackbar,
    taskToDelete,
    showTaskDeleteSnackbar,
    handleTaskDragEnd,
    handleTaskDragStart,
    activeDragTask,
  };
};

  