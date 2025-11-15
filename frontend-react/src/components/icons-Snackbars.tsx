import { BsFillCalendarWeekFill, BsFillXCircleFill, BsCheckCircleFill, BsXLg } from "react-icons/bs"; 
import { useState, useRef, useEffect } from 'react';
import { AiFillDelete } from "react-icons/ai";
import { DayPicker } from 'react-day-picker';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface DateViewerProps {
  date: string | null | undefined; 
  overdue?: boolean;
}

export function DateViewer({ date , overdue = false}: DateViewerProps){
    const dateObject = date ? parseISO(date) : undefined;
    const formattedDate = dateObject 
        ? `${format(dateObject, "d")} ${format(dateObject, "MMM", { locale: ptBR }).toUpperCase()}, ${format(dateObject, "yyyy")}`
        : null;  
    return(
        <div className={`
        w-[126px] h-7 rounded-sm font-family-poppins 
        flex items-center justify-between py-1 px-2
        ${overdue 
            ? 'bg-red-600 text-white' 
            : 'bg-[#E0E0E0] text-gray'
        }
        `}>
        <BsFillCalendarWeekFill/>  
        <span className="text-sm font-medium flex text-center">{formattedDate}</span>
        </div>
    )
}

interface DateViewerSideBarProps {
  selectedDate: string | null | undefined;
  onSelectDate: (date: Date) => void;
}

export function DateViewerSideBar({ selectedDate, onSelectDate }: DateViewerSideBarProps){
    const [isOpen, setIsOpen] = useState(false);
    const pickerRef = useRef<HTMLDivElement>(null);

    const dateObject = selectedDate ? parseISO(selectedDate) : undefined;

    const formattedDate = dateObject 
        ? `${format(dateObject, "d")} ${format(dateObject, "MMM", { locale: ptBR }).toUpperCase()}, ${format(dateObject, "yyyy")}`
        : "Definir data"; 

    useEffect(() => {
        if (!isOpen) return;
        function handleClickOutside(event: MouseEvent) {
            if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [isOpen]);

    const handleDayClick = (date: Date | undefined) => {
        if (date) {
            onSelectDate(date);
            setIsOpen(false);
        }
    };

    return(
        <div className="relative" ref={pickerRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className='
                    w-auto h-7 rounded-sm text-white font-poppins
                    flex items-center gap-2 py-1 px-2 border
                    border-[#4E4E4E]
                    hover:bg-[#4E4E4E] transition-colors'>
                <BsFillCalendarWeekFill/> 
                <span className="text-sm">{formattedDate}</span>
            </button>
            {isOpen && (
                <div className="p-4 absolute top-10 left-0 z-30 bg-[#1E1E1E] border border-[#4E4E4E] rounded-lg shadow-xl">
                    <DayPicker
                        mode="single"
                        selected={dateObject}
                        onSelect={handleDayClick}
                        locale={ptBR}
                        styles={{
                            caption: { color: '#FFF' },
                            head: { color: '#9CA3AF' },
                            day: { color: '#FFF' },
                            day_selected: { backgroundColor: '#3B82F6', color: '#FFF' },
                            day_today: { color: '#FF0000', fontWeight: 'bold' },
                            day_disabled: { color: '#4B5563' },
                        }}
                    />
                </div>
            )}
        </div>
    )
}

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
            w-[413px] h-[200px]
        '>
            <div className="flex justify-end h-6">
                <button onClick={onClose} className="hover:text-gray-400 text-white transition-colors">
                    <BsFillXCircleFill size={20}/>
                </button>
            </div>
            <div className="text-left flex flex-col gap-[17px] items-start">
                <p className=" text-[19.2px] font-semibold mb-2 w-[352px]">
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
            w-[413px] h-[200px]
        '>
            <div className="flex justify-end h-6">
                <button onClick={onClose} className="hover:text-gray-400 text-white transition-colors">
                    <BsFillXCircleFill size={20}/>
                </button>
            </div>
            <div className="text-left flex flex-col gap-[17px] items-start">
                <p className=" text-[19.2px] font-semibold mb-2 w-[352px]">
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



interface SucessDeleteListProps {
  onClose: () => void;
}

export function SucessDeleteList({ onClose }: SucessDeleteListProps){
    return(
        <div className='
        fixed top-16 left-1/2 -translate-x-1/2 z-50
        border-[0.5px] border-white flex justify-between items-center
        bg-bg font-family-poppins text-success rounded-xl 
        px-4 py-2 w-[336px] h-10
        '>
            <div className="flex items-center gap-2">
                <BsCheckCircleFill/>
                <p>Lista deletada com sucesso!</p>
            </div>
            <button onClick={onClose}>
                <BsXLg/>
            </button>
        </div>
    )

}

interface SucessDeleteTaskProps {
  onClose: () => void;
}

export function SucessDeleteTask({ onClose }: SucessDeleteTaskProps) {
    return(
        <div className='
        fixed top-16 left-1/2 -translate-x-1/2 z-50
        border-[0.5px] border-white flex justify-between items-center
        bg-bg font-family-poppins text-success rounded-xl 
        px-4 py-2 w-[336px] h-10
        '>
            <div className="flex items-center gap-2">
                <BsCheckCircleFill/>
                <p>Tarefa deletada com sucesso!</p>
            </div>
            <button onClick={onClose}>
                <BsXLg/>
            </button>
        </div>
    )

}