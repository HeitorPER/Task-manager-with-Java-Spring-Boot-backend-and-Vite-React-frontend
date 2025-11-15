import { parseISO, isPast } from 'date-fns';
import type { Task } from '../types/types';

export const isTaskOverdue = (task: Task): boolean => {
  if (task.completed) {
    return false; 
  }
  if (!task.finishDate) {
    return false;
  }
  /**if(task.finishDate == todayDate){
    return false;
  }*/

  const expectedDate = parseISO(task.finishDate);
  return isPast(expectedDate);
};