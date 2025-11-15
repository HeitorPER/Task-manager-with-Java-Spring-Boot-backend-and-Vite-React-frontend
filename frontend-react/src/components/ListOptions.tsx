import { AiFillDelete } from "react-icons/ai";
import { BsFillPencilFill } from "react-icons/bs";

interface ListOptionsProps {
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export function ListOptions({ onClose, onEdit, onDelete }: ListOptionsProps){
    return(
        <>
      <div 
        onClick={onClose} 
        className="fixed inset-0 z-10"
      />
      
      <div className="
        absolute 
        top-14 
        right-4 
        w-48
        bg-[#282828] 
        border border-[#4E4E4E] 
        rounded-lg 
        shadow-lg 
        z-20
        text-white
        font-family-poppins
      ">
        <button 
          onClick={onEdit}
          className="
            flex items-center gap-3 w-full px-4 py-3 
            hover:bg-[#4E4E4E] rounded-t-lg
          "
        >
          <BsFillPencilFill/>
          <span>Renomear</span>
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
          <span>Deletar lista</span>
        </button>
      </div>
    </>
  );
}