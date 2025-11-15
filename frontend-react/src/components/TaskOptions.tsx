import { AiFillDelete } from "react-icons/ai";
import { BsFillPencilFill } from "react-icons/bs";
import { BsPlusSquareDotted } from "react-icons/bs";
import { forwardRef } from 'react';

interface TaskOptionsProp{
    onDuplicate: () =>void;
    onClose: () => void;
    onEdit: () => void;
    onDelete: () => void;
    x: number;
    y: number;

}


export const TaskOptions = forwardRef<HTMLDivElement, TaskOptionsProp>(
  ({onDuplicate, onClose, onEdit, onDelete, x, y}, ref) => {
    return (
        <>
      <div 
        onClick={onClose} 
        onContextMenu={(e) => {
          e.preventDefault(); 
          onClose();          
        }}
        className="fixed inset-0 z-10"
      />
        <div
        ref={ref}
        className="
        fixed 
        top-14 
        right-4 
        w-48
        bg-[#282828] 
        border border-[#4E4E4E] 
        rounded-lg 
        shadow-lg 
        z-20
        text-white
        font-family-poppins"
        style={{ top: y, left: x }}
        >
        <button
        onClick={onEdit}
          className="
            flex items-center gap-3 w-full px-4 py-3 
            hover:bg-[#4E4E4E] rounded-t-lg
          "
        >
            <BsFillPencilFill/>
            <span>Editar</span>
        </button>
        <button
        onClick={onDuplicate}
          className="
            flex items-center gap-3 w-full px-4 py-3 
            hover:bg-[#4E4E4E]
          "
        >
            <BsPlusSquareDotted/>
            <span>Duplicar</span>
        </button>
        <button 
          onClick={onDelete}
          className="
            flex items-center gap-3 w-full px-4 py-3 
            text-red-500 
            hover:bg-[#4E4E4E] 
            rounded-b-lg
          "
        >
          <AiFillDelete />
          <span>Deletar</span>
        </button>

        </div>
    
    </>
    )
});


