import { TaskCard } from './TasksCard';
import { ListOptionsButton, NewTask } from './buttons';
import type { List, Task } from '../types/types';
import type { TaskUpdateDTO } from '../services/apiService';
import { useTaskList } from '../hooks/useTaskList';
import { ListOptions } from './ListOptions';
import { SortableContext } from '@dnd-kit/sortable';
import { useDroppable } from '@dnd-kit/core';

interface TaskListProps {
  list: List;
  onAddTask: (listId: List['id']) => void;
  onUpdateList: (listId: List['id'], newName: string) => void;
  onUpdateTask: (taskId: Task['id'], updateData: TaskUpdateDTO) => void;
  onDeleteList: (listId: List['id']) => void;
  onDeleteTask: (taskId: Task['id'], listId: List['id'], taskName: string) => void;
  onDuplicateTask: (task: Task, listId: List['id']) => void;
  onOpenSidebar: (task: Task, listId: List['id']) => void;
  onToggleComplete: (task: Task) => void;
}

export function TaskList({ 
  list, 
  onAddTask, 
  onUpdateList, 
  onUpdateTask,
  onDeleteList,
  onDeleteTask,    
  onDuplicateTask,
  onOpenSidebar,
  onToggleComplete
}: TaskListProps) {
  
  const {
    isEditingTitle,
    currentName,
    setCurrentName,
    handleTitleSave,
    handleKeyDown,
    handleNewTaskClick,
    isOptionsOpen,
    handleOpenOptions,
    handleCloseOptions,
    handleEditClick,
    handleDeleteClick
  } = useTaskList({ list, onAddTask, onUpdateList, onDeleteList });

  const taskIds = list.tasks.map(task => task.id);

  const tasksSorted = list.tasks.sort((a, b) => a.displayOrder - b.displayOrder);

  const { setNodeRef, isOver } = useDroppable({
    id: list.id,
    data: { 
      type: 'List'
    }
  });

const handleOpenSidebarWrapper = (task: Task) => {
    onOpenSidebar(task, list.id);
  };
  const handleDeleteTaskWrapper = (task: Task) => {
    onDeleteTask(task.id, list.id, task.name);
  };
  const handleDuplicateTaskWrapper = (task: Task) => {
    onDuplicateTask(task, list.id);
  };

  return (
    <div 
    className="
      font-poppins w-[477px] min-h-[859px] rounded-lg border
      pt-4 pb-6 px-4 flex flex-col gap-3 border-[#4E4E4E] shrink-0 relative 
      ">
      <div className='
        flex justify-between items-center text-white
        w-full h-12 text-[19.2px] font-semibold
      '>
        {isEditingTitle ? (
          <input
            type="text"
            value={currentName}
            onChange={(e) => setCurrentName(e.target.value)}
            onBlur={handleTitleSave}
            onKeyDown={handleKeyDown}
            autoFocus
            className="
              text-[19.2px] font-semibold bg-gray-700 text-white 
              border-none rounded-md px-2 w-full
            "
          />
        ) : (
          <p>
            {list.name}
          </p>
        )}
        <ListOptionsButton onClick={handleOpenOptions}/>
      </div>

      {isOptionsOpen && (
        <ListOptions 
          onClose={handleCloseOptions}
          onEdit={handleEditClick}
          onDelete={handleDeleteClick}
        />
      )}

      <SortableContext items={taskIds}>
        <div 
        ref={setNodeRef}
        className={` 
          grow   
            flex flex-col 
            gap-3           
            min-h-[100px]   
        ${isOver ? 'bg-blue-900/30 border-3-white' : ''}
      `}>
        {tasksSorted.map((task, index) => (
          <TaskCard 
            key={task.id} 
            task={task} 
            index={index} 
            onUpdateTask={onUpdateTask}
            onToggleComplete={onToggleComplete}
            onOpenSidebar={handleOpenSidebarWrapper}
            onDeleteTask={handleDeleteTaskWrapper} 
            onDuplicateTask={handleDuplicateTaskWrapper}
          />
        ))}
        </div>
      </SortableContext>

      <div>
        <NewTask onClick={handleNewTaskClick} />
      </div>
    </div>
  );
}