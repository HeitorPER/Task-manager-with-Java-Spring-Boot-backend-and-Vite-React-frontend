import { NewList } from '../components/buttons';
import { TaskList } from '../components/TaskList';
import {TaskCard} from '../components/TasksCard'
import { useHome } from '../hooks/useHome';
import {SucessDeleteList, ConfirmDeleteList, ConfirmDeleteTask, SucessDeleteTask} from '../components/icons-Snackbars'
import { SideBarEditionPage } from './SideBar';
import { DndContext, PointerSensor, useSensor, useSensors, closestCorners, DragOverlay, defaultDropAnimationSideEffects} from '@dnd-kit/core';
import type {DropAnimation} from '@dnd-kit/core';

const dropAnimationConfig: DropAnimation = {
  sideEffects: defaultDropAnimationSideEffects({
    styles: {
      active: { opacity: '0.5' },
    },
  }),
};

export function HomePage() {
  
  const { 
    lists, 
    isLoading, 
    isSidebarClosing,
    handleAddNewList, 
    handleUpdateList, 
    handleAddNewTask, 
    handleUpdateTask,
    handleDeleteList,
    handleDeleteTask,
    handleDuplicateTask,
    showSuccessSnackbar,
    handleCloseSnackbar,
    listToDelete,
    handleConfirmDeleteList,
    handleCancelDeleteList,
    editingTask,        
    handleOpenSidebar,  
    handleCloseSidebar,
    handleToggleTaskComplete,
    taskToDelete,
    handleConfirmDeleteTask,
    handleCancelDeleteTask,
    showTaskDeleteSnackbar,
    handleCloseTaskSnackbar,
    handleTaskDragStart,
    handleTaskDragEnd,
    activeDragTask 
  } = useHome();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {distance: 5,},
    })
  );

  if (isLoading) {
    return <div className="text-white p-10">Carregando quadro...</div>;
  }

  const onDeleteTaskFromSidebar = () => {
    if (editingTask) {
      handleDeleteTask(editingTask.task.id, editingTask.listId, editingTask.task.name);
    }
  };

  return (
    <DndContext 
      sensors={sensors} 
      onDragStart={handleTaskDragStart}
      onDragEnd={handleTaskDragEnd}
      collisionDetection={closestCorners} 
    >
    <div className='
      w-full min-h-screen
      px-[50px] py-[50px]
      items-start flex
      gap-5 overflow-x-auto
      bg-[#1E1E1E]
    '>
      {lists.map(list => (
        <TaskList 
          key={list.id} 
          list={list}
          onAddTask={handleAddNewTask}
          onUpdateList={handleUpdateList}
          onUpdateTask={handleUpdateTask}
          onDeleteList={handleDeleteList}
          onDeleteTask={handleDeleteTask}   
          onDuplicateTask={handleDuplicateTask}
          onOpenSidebar={handleOpenSidebar}
          onToggleComplete={handleToggleTaskComplete}
        />
      ))}
      
      <NewList onClick={handleAddNewList} />

      {editingTask && (
        <SideBarEditionPage
          task={editingTask.task}
          onClose={handleCloseSidebar}
          onSave={handleUpdateTask}
          isClosing={isSidebarClosing}
          onDeleteTask={onDeleteTaskFromSidebar}
          onToggleComplete={handleToggleTaskComplete}
          />
      )}

      {listToDelete && (
        <ConfirmDeleteList 
            listName={listToDelete.name}
            onConfirm={handleConfirmDeleteList}
            onClose={handleCancelDeleteList}
        />
      )}

      {showSuccessSnackbar && (
        <SucessDeleteList onClose={handleCloseSnackbar} />
      )}


      {taskToDelete && (
        <ConfirmDeleteTask
          taskName={taskToDelete.taskName}
          onConfirm={handleConfirmDeleteTask}
          onClose={handleCancelDeleteTask}
        />
      )}
      {showTaskDeleteSnackbar && (
        <SucessDeleteTask onClose={handleCloseTaskSnackbar} />
      )}

      <DragOverlay dropAnimation={dropAnimationConfig}>
          {activeDragTask ? (
            <TaskCard
              task={activeDragTask}
              index={0}
              onUpdateTask={() => {}}
              onDeleteTask={() => {}}
              onDuplicateTask={() => {}}
              onOpenSidebar={() => {}}
              onToggleComplete={() => {}}
            />
          ) : null}
      </DragOverlay>
    </div>
    </DndContext>
  );
}