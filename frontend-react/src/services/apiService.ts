import type { List, Task } from '../types/types';

export interface ListCreateDTO {
  name: string;
}
export interface TaskCreateDTO {
  name: string;
  description: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'VERY_HIGH';
  listId: List['id'];
  finishDate?: string | null | undefined; 
}
export interface TaskUpdateDTO {
  name?: string;
  description?: string;
  priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'VERY_HIGH';
  completed?: boolean;
  newfinishDate?: string | null | undefined; 
  displayOrder?: number;
}

//const API_URL = "http://localhost:8080";

const API_URL = import.meta.env.VITE_API_URL;

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    throw new Error(errorBody.error || `Erro ${response.status}`);
  }
  return response.json() as Promise<T>;
}

export const fetchLists = (): Promise<List[]> => {
  return fetch(`${API_URL}/lists`).then(res => handleResponse<List[]>(res));
};

export const createList = (dto: ListCreateDTO): Promise<List> => {
  return fetch(`${API_URL}/lists`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dto)
  }).then(res => handleResponse<List>(res));
};

export const updateList = (id: List['id'], dto: ListCreateDTO): Promise<List> => {
  return fetch(`${API_URL}/lists/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dto)
  }).then(res => handleResponse<List>(res));
};

export const createTask = (dto: TaskCreateDTO): Promise<Task> => {
  return fetch(`${API_URL}/tasks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dto)
  }).then(res => handleResponse<Task>(res));
};

export const updateTask = (id: Task['id'], dto: TaskUpdateDTO): Promise<Task> => {
  return fetch(`${API_URL}/tasks/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dto)
  }).then(res => handleResponse<Task>(res));
};

export const deleteList = (id: List['id']): Promise<void> => {
  return fetch(`${API_URL}/lists/${id}`, {
    method: 'DELETE'
  }).then(response => {
    if (!response.ok) {
      return response.json().then(err => { throw new Error(err.error || 'Falha ao deletar lista'); });
    }
    return Promise.resolve();
  });
};

export const deleteTask = (id: Task['id']): Promise<void> => {
  return fetch(`${API_URL}/tasks/${id}`, {
    method: 'DELETE'
  }).then(response => {
    if (!response.ok) {
      return response.json().then(err => { throw new Error(err.error || 'Falha ao deletar tarefa'); });
    }
    return Promise.resolve();
  });
};

interface ReorderTasksDTO {
  newListId: string | number;
  taskIds: (string | number)[];
}

export const reorderTasks = (listId: string | number, taskIds: (string | number)[]): Promise<void> => {
  const dto: ReorderTasksDTO = {
    newListId: listId,
    taskIds: taskIds
  };

  return fetch(`${API_URL}/tasks/reorder`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dto)
  }).then(res => {
    if (!res.ok) throw new Error('Falha ao reordenar tarefas');
  });
};