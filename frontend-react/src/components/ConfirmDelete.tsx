import { AiFillDelete } from "react-icons/ai";
import {BsFillXCircleFill} from "react-icons/bs"; 

interface ConfirmDeleteListProps {
  listName: string;
  onClose: () => void; 
  onConfirm: () => void;
}

export function ConfirmDeleteList({listName, onClose, onConfirm}: ConfirmDeleteListProps){
    return(
        <>
        <div 
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-40 backdrop-blur"
        />
        <div className='
            fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50
            bg-bg border border-white 
            text-white 
            font-family-poppins 
            rounded-xl
            py-3 px-4
            flex flex-col gap-3
            shadow-2xl
            w-[370px] h-[190px]
            md:w-[413px] md:h-[200px]
        '>
            <div className="flex justify-end h-6">
                <button onClick={onClose} className="hover:text-gray-400 text-white transition-colors">
                    <BsFillXCircleFill size={20}/>
                </button>
            </div>
            <div className="text-left flex flex-col gap-[17px] items-start">
                <p className="text-[16px] md:text-[19.2px] font-semibold mb-2 w-[352px]">
                    Tem certeza que deseja deletar a lista "{listName}"?
                </p>
                <p className="text-gray-400 text-sm">
                    Essa ação não é reversível.
                </p>
            
            <button 
                onClick={onConfirm}
                className="
                    flex items-center justify-center
                     text-danger
                    
                "
            >
                <AiFillDelete size={20}/>
                <p>Deletar</p>
            </button>
            </div>

        </div>
        </>
    )
}

interface ConfirmDeleteTaskProps {
  taskName: string;
  onClose: () => void;
  onConfirm: () => void;
}

export function ConfirmDeleteTask({ taskName, onClose, onConfirm }: ConfirmDeleteTaskProps) {
    return(
        <>
        <div 
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-40 backdrop-blur"
        />
        <div className='
            fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50
            bg-bg border border-white 
            text-white 
            font-family-poppins 
            rounded-xl
            py-3 px-4
            flex flex-col gap-3
            shadow-2xl
            w-[370px] h-[190px]
            md:w-[413px] md:h-[200px]
        '>
            <div className="flex justify-end h-6">
                <button onClick={onClose} className="hover:text-gray-400 text-white transition-colors">
                    <BsFillXCircleFill size={20}/>
                </button>
            </div>
            <div className="text-left flex flex-col gap-[17px] items-start">
                <p className="text-[16px] md:text-[19.2px] font-semibold mb-2 w-[352px]">
                    Tem certeza que deseja deletar a Tarefa "{taskName}"?
                </p>
                <p className="text-gray-400 text-sm">
                    Essa ação não é reversível.
                </p>
            
            <button 
                onClick={onConfirm}
                className="
                    flex items-center justify-center
                     text-danger
                    
                "
            >
                <AiFillDelete size={20}/>
                <p>Deletar</p>
            </button>
            </div>

        </div>
        </>
    )
}