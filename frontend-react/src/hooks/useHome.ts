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
    // Limpa os estados de "arrastar"
    setActiveDragTask(null);

    const { active, over } = event;
    if (!over || active.id === over.id) return; // Não mudou

    const oldListId = active.data.current?.listId.toString();
    const overData = over.data.current;
    if (!overData || !oldListId) return;

    const overListId = (overData.type === 'List') 
        ? over.id.toString() 
        : overData.listId.toString();

    // --- ATUALIZAÇÃO FINAL E SALVAMENTO ---
    setLists(currentLists => {
      const oldList = currentLists.find(l => l.id.toString() === oldListId)!;
      const newList = currentLists.find(l => l.id.toString() === overListId)!;
      
      const activeTaskId = active.id.toString();
      
      // O 'taskIndex' é o índice na lista onde a tarefa está AGORA
      // (Se foi movida pelo onDragOver, está na newList)
      const listToCheck = (oldListId === overListId) ? oldList : newList;
      const taskIndex = listToCheck.tasks.findIndex(t => t.id.toString() === activeTaskId);
      
      if (taskIndex === -1) return [...currentLists];

      // Encontra o novo índice
      let newIndex;
      if (overData.type === 'Task') {
        newIndex = newList.tasks.findIndex(t => t.id.toString() === over.id.toString());
      } else {
        // Se largou na lista, mas não numa tarefa, coloca no fim
        newIndex = newList.tasks.length;
      }
      
      // Se estava na mesma lista, usa 'arrayMove'
      if (oldListId === overListId) {
          const reorderedList = arrayMove(oldList.tasks, taskIndex, newIndex);
          oldList.tasks = reorderedList;
      } else {
          // Se mudou de lista, o 'onDragOver' já moveu, só precisamos de ajustar a posição final
          const [movedTask] = newList.tasks.splice(taskIndex, 1); // Tira de onde o onDragOver pôs
          newList.tasks.splice(newIndex, 0, movedTask); // Insere no sítio certo
      }
      
      // --- 6. SALVAR NO BACKEND (A LÓGICA ANTIGA ESTÁ CORRETA) ---
      if (oldListId !== overListId) {
        api.reorderTasks(oldListId, oldList.tasks.map(t => t.id));
        api.reorderTasks(overListId, newList.tasks.map(t => t.id));
      } else {
        api.reorderTasks(overListId, newList.tasks.map(t => t.id));
      }

      return [...currentLists];
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

  