import {useEffect, useState} from 'react'
import {FinishTaskButton, CloseSideBarButton } from '../components/buttons'
import {PriorityDropDown} from '../components/PriorityDropDown'
import {DateViewerSideBar} from '../components/icons-Snackbars'
import type {TaskUpdateDTO} from '../services/apiService'
import type {Task} from '../types/types'
import {AiFillDelete} from 'react-icons/ai'
import { formatISO } from 'date-fns';

interface TaskEditSidebarProps {
  task: Task;
  onClose: () => void;
  onSave: (taskId: Task['id'], updateData: TaskUpdateDTO) => void;
  isClosing: boolean;
  onDeleteTask: () => void; 
  onToggleComplete: (task: Task) => void;
}

export function SideBarEditionPage({ task, onClose, onSave , isClosing,  onDeleteTask, onToggleComplete }: TaskEditSidebarProps){


    const [draftDesc, setDraftDesc] = useState(task.description || '');
    const [hasAnimatedIn, setHasAnimatedIn] = useState(false);

    const handleSave = () => {
    if (draftDesc !== (task.description || '')) {
      onSave(task.id, { description: draftDesc });
    }
  };

    const handleDateChange = (newDate: Date) => {
    const dateString = formatISO(newDate, { representation: 'date' });
    onSave(task.id, { newfinishDate: dateString });
  };

  useEffect(() => {
      const timer = setTimeout(() => {
        setHasAnimatedIn(true);
      }, 10);
      return () => clearTimeout(timer);
    }, []);

  useEffect(() => {
        setDraftDesc(task.description || '');
    }, [task.id]);

  const handleSaveAndClose = () => {
    handleSave();
    onClose();
  };

  const handlePriorityChange = (newPriority: 'LOW' | 'MEDIUM' | 'HIGH' | 'VERY_HIGH') => {
        onSave(task.id, { priority: newPriority });
    };

    return (
    <>
      <div 
        onClick={handleSaveAndClose}
        className="fixed inset-0 bg-black/30 z-30" 
      />
      <div className={`
        fixed 
        top-0 
        right-0 
        h-full 
        w-full
        md:w-[608px] 
        bg-[#1E1E1E] 
        border-l border-white
        shadow-2xl 
        z-40
        flex flex-col
        items-center
        transform 
        transition-transform 
        duration-300 
        ease-out
        font-family-poppins
        pt-10
        
        ${(hasAnimatedIn && !isClosing) ? 'translate-x-0' : 'translate-x-full'}
      `}>
        <CloseSideBarButton onClick={handleSaveAndClose} /> 
        <div className='w-[473px] h-[606px] flex flex-col gap-5'>
        <div className="flex justify-between items-center ">
          
          
          <h2 className="text-white font-bold text-[33.18px]">{task.name}</h2>
          <FinishTaskButton
          isCompleted={task.completed} 
            onClick={() => onToggleComplete(task)}
          />
        </div>
        
        <div className='border w-full border-[#4E4E4E]'/>

        <div className="text-white font-semibold flex justify-start gap-10.5 items-start">
            <p>Data de conclusão</p>
            <DateViewerSideBar 
            selectedDate={task.finishDate}
            onSelectDate={handleDateChange}
            />
        </div>

        <div className="text-white font-semibold flex justify-start gap-26 items-start">
            <p>Prioridade</p>
            <PriorityDropDown
            currentPriority={task.priority || 'LOW'} 
            onSelect={handlePriorityChange} 
            />
        </div>

        <div className='border w-full border-[#4E4E4E]'/>

        <div className="grow">
          <label className="text-white font-semibold mb-2 block ">
            Descrição
          </label>
          <textarea
            value={draftDesc}
            onChange={(e) => setDraftDesc(e.target.value)}
            onBlur={handleSave} 
            placeholder="Adicionar descrição..."
            className="text-white border border-[#4E4E4E] 
            w-[473px] h-[232px] resize-none rounded-sm py-2 px-2"
          />
        </div>

        <div className='border w-full border-[#4E4E4E]'/>

        <button 
            onClick={onDeleteTask}
            className="
                flex items-center gap-3 w-min-[107px] h-1 
                text-danger py-3
                hover:bg-[#4E4E4E] 
                rounded-sm
                ">
                  <AiFillDelete />
                  <span>Deletar</span>
        </button>
        </div>
        
      </div>
    </>
  );
}