import type { Task } from '../types/types';
import type { TaskUpdateDTO } from '../services/apiService';
import { useTaskCard } from '../hooks/useTaskCard';
import { FinishTaskButton} from './buttons'
import {DateViewer} from './icons-Snackbars'
import { TaskOptions } from './TaskOptions';
import { HighPriority, LowPriority, MediumPriority, VeryHighPriority } from './priorityTags';
import {isTaskOverdue} from '../utils/dateUtils'
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

export interface TaskCardProps {
  task: Task;
  index: number;
  onUpdateTask: (taskId: Task['id'], updateData: TaskUpdateDTO) => void;
  onDeleteTask: (task: Task) => void;
  onDuplicateTask: (task: Task) => void;
  onOpenSidebar: (task: Task) => void;
  onToggleComplete: (task: Task) => void;
}

function RenderPriorityTag({ priority }: { priority: string | undefined }) {
  switch (priority) {
    case 'VERY_HIGH':
      return <VeryHighPriority />;
    case 'HIGH':
      return <HighPriority />;
    case 'MEDIUM':
      return <MediumPriority />;
    case 'LOW':
      return <LowPriority />;
    default:
      return <LowPriority />;
  }
}

export function TaskCard({ task, index, onUpdateTask, onDeleteTask, onDuplicateTask, onOpenSidebar, onToggleComplete }: TaskCardProps) {
  
  const {
    isEditingName,
    currentName,
    setIsEditingName,
    setCurrentName,
    handleNameSave,
    handleNameKeyDown,
    menuPosition,
    menuRef,
    handleContextMenu,
    handleCloseOptions,
    handleEditClick,
    handleDeleteClick,
    handleDuplicateClick,
    handleCardClick,
  } = useTaskCard({ task, onUpdateTask, onDeleteTask, onDuplicateTask, onOpenSidebar });

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({
    id: task.id,
    data: {
      type: 'Task',
      listId: task.listId,
      index: index,
      task: task,
    }
  });

  const overdue = isTaskOverdue(task);

  let opacity = 1; // Padrão
  if (isDragging) {
    opacity = 0; // Fica invisível (para o 'DragOverlay')
  } else if (task.completed) {
    opacity = 0.5; // Fica 50% opaco se estiver completo
  }
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: opacity, // <-- Usa a opacidade calculada
  };


  return (
    <div 
    ref={setNodeRef}
    style={style}
    {...attributes}
    {...listeners}    
    onContextMenu={handleContextMenu} 
    onClick={handleCardClick}
    className={`
      cursor-grab
    font-family-poppins
        w-[445px] h-[221px] rounded-lg border py-3 px-2 border-[#4E4E4E]
        bg-transparent gap-3
        flex flex-col
        transition-all duration-300 ease-out
        hover:border-white active:bg-[#343333]
        ${overdue ? 'hover:bg-red-800/60' : 'bg-linear-to-r hover:from-[#232323] hover:to-[#393939]'}
    `}>
       <div className='
            justify-between
            flex
            items-center
            w-[429px] h-10
            
            '>
            <RenderPriorityTag priority={task.priority} />
            <FinishTaskButton
            isCompleted={task.completed} 
          onClick={(e) => {
            e.stopPropagation();
            onToggleComplete(task);
          }}
            />
            </div>

      <div className='gap font-family-poppins w-[429px] h-[105px]'>
      {isEditingName ? (
        <input
          type="text"
          value={currentName}
          onChange={(e) => setCurrentName(e.target.value)}
          onBlur={handleNameSave}
          onKeyDown={handleNameKeyDown}
          autoFocus
          className=" p-1 text-white rounded w-[429px] h-[29px] flex"
        />
      ) : (
        <h6 
          onClick={() => setIsEditingName(true)} 
          className="text-white font-semibold cursor-pointer"
        >
          {task.name}
        </h6>
      )}

    
        <p className="text-sm text-white min-h-[72px] line-clamp-3">
          {task.description || 'Adicionar descrição...'}
        </p>
        
      </div>

      {menuPosition && (
        <TaskOptions
          ref={menuRef}
          x={menuPosition.x}
          y={menuPosition.y}
          onClose={handleCloseOptions}
          onEdit={handleEditClick}
          onDelete={handleDeleteClick}
          onDuplicate={handleDuplicateClick}
        />
      )}

        <DateViewer 
        date={task.finishDate}
        overdue={overdue}
        />
      
      
    </div>
  );
}