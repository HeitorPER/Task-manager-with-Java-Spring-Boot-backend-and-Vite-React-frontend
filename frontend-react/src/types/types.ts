export type PriorityType = 'LOW' | 'MEDIUM' | 'HIGH' | 'VERY_HIGH';

export interface Task {
  id: string | number;
  name: string; 
  description?: string;
  priority?: PriorityType;
  listId: number | string;
  finishDate?: string | null;
  completed: boolean;
  displayOrder: number;
}

export interface List {
  id: string | number;
  name: string; 
  tasks: Task[];
}