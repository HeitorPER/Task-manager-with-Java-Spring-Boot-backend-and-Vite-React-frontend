import { MdAccountCircle } from "react-icons/md";
import { BsCheck2, BsBellFill, BsThreeDots, BsFillPlusCircleFill, BsArrowBarRight } from "react-icons/bs";

export function ProfileButton(){
    return(
    <button className="
    flex
    items-center
    justify-center
    h-9
    w-32
    top-5 
    left-5 
    rounded-xl 
    py-1 
    px-4 
    gap-2
    font-family-poppins

    transition-all
      duration-300 
      ease-out
      hover:bg-[#4E4E4E]
      hover:scale-105
    ">
        <div>
        <MdAccountCircle className='
        h-7
        w-auto
        text-white
        '/>
        </div>
        <div className='text-white'>
        <p>joao</p>
        </div>
    </button>
    );
}

export function NotificationButton(){
    return(
        <button className="
        text-white
        w-8
        h-[33px]
        flex
        items-center
        justify-center
        rounded-lg

        transition-colors
        duration-300
        ease-out
        hover:bg-[#4E4E4E]
        active:bg-[#343333]
        ">
            <BsBellFill />
        </button>
    )
}

interface FinishTaskButtonProps {
  isCompleted: boolean;
  onClick: (event: React.MouseEvent) => void;
  className?: string;
}

export function FinishTaskButton({isCompleted, onClick, className}:FinishTaskButtonProps){
    return(
      <button
          onClick={onClick}
          className={`
              flex items-center justify-center gap-2
              w-[113px] h-7 rounded-lg 
              font-poppins text-sm font-semibold 
              transition-all duration-200
              
              ${isCompleted 
                  ? ' text-green-800'
                  : ' text-gray-400 hover:text-green-400 '
              }
              
              ${className || ''} 
          `}
      >
          <div className={`
              relative flex items-center justify-center
              w-5 h-5 rounded-full
              border border-dashed 
              
              transition-colors duration-200
              ${isCompleted 
                  ? 'border-green-800' 
                  : 'group-hover:border-green-400' 
              }
          `}>
            <BsCheck2 className={`
                text-lg 
                ${isCompleted 
                    ? 'text-green-800' 
                    : ' group-hover:text-green-400' 
                }
            `}/>
          </div>
          <p>{isCompleted ? 'Finalizado' : 'Finalizar'}</p>
      </button>
    )
}

interface ListOptionsButtonProps {
  onClick: () => void;
}

export function ListOptionsButton({onClick}: ListOptionsButtonProps){
    return(
        <button 
        onClick={onClick}
        className="
        text-white
        w-8
        h-[33px]
        flex
        items-center
        justify-center
        rounded-lg

        transition-colors
        duration-300
        ease-out
        hover:bg-[#4E4E4E]
        active:bg-[#343333]
        ">
            <BsThreeDots />
        </button>
    )
}


interface NewListProps {
  onClick: () => void;
}

export function NewList({ onClick }: NewListProps) {
  return (
    <button
      onClick={onClick}
      className="
        text-white
        font-poppins
        text-[19.2px]
        flex
        items-center
        justify-start /* Corrigido de justify-right */
        rounded-lg
        gap-2
        px-2
        py-2
        w-[300px]
        h-[45px]
        transition-colors
        duration-300
        ease-out
        hover:bg-[#4E4E4E]
        active:bg-[#343333]
      "
    >
      <BsFillPlusCircleFill />
      <p>Nova lista</p>
    </button>
  );
}

interface NewTaskProps {
  onClick: () => void;
}

export function NewTask({ onClick }: NewTaskProps) {
  return (
    <button
      onClick={onClick}
      className="
        text-white
        font-poppins /* Corrigido de font-family-poppins */
        text-[19.2px]
        flex
        items-center
        justify-center
        rounded-lg
        gap-2
        px-2
        py-2

        transition-colors
        duration-300
        ease-out
        hover:bg-[#4E4E4E]
        active:bg-[#343333]
      "
    >
      <BsFillPlusCircleFill />
      <p>Nova tarefa</p>
    </button>
  );
}

interface CloseSideBarProps {
  onClick: () => void;
}


export function CloseSideBarButton({onClick}: CloseSideBarProps){
  return(
    <button 
        onClick={onClick}
        className='
        text-white
        w-8
        h-8
        flex
        items-center
        justify-center
        rounded-lg

        absolute
          top-12
          left-5 
          z-10

        transition-colors
        duration-300
        ease-out
        hover:bg-[#4E4E4E]
        active:bg-[#343333]'>
          <BsArrowBarRight/>
    </button>
  )
}
