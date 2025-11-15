import { useState, useRef, useEffect } from 'react';
import {HighPriority, LowPriority, MediumPriority, VeryHighPriority} from './priorityTags';
import { BsCaretDownFill } from "react-icons/bs";
import type {PriorityType} from '../types/types'

interface PriorityDropdownProps {
    currentPriority: string; 
    onSelect: (newPriority: PriorityType) => void;
}

export function PriorityDropDown({ currentPriority, onSelect }: PriorityDropdownProps){
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const handleSelect = (priority: PriorityType) => {
        onSelect(priority);
        setIsOpen(false);
    };

    useEffect(() =>{
        function handleClickOutside(event: MouseEvent){
            if(dropdownRef.current && !dropdownRef.current.contains(event.target as Node)){
                setIsOpen(false);
            }
        }   
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const renderTag = (priority: string) => {
        switch (priority) {
            case 'LOW': return <LowPriority />;
            case 'MEDIUM': return <MediumPriority />;
            case 'HIGH': return <HighPriority />;
            case 'VERY_HIGH': return <VeryHighPriority />;
            default: return <LowPriority />;
        }
    };
    
    return(
    <div className="relative inline-block" ref={dropdownRef}>
            <div 
                onClick={() => setIsOpen(!isOpen)} 
                className="
                    cursor-pointer 
                    flex items-center gap-2 rounded-sm justify-between
                    hover:bg-[#4E4E4E]
                    active:bg-[#343333]
                    w-[205px] h-9
                    py-1 px-2
                    text-white
                    hover:brightness-110
                    border-[#4E4E4E]
                    border
                "
            >
                {renderTag(currentPriority)}
                
                <BsCaretDownFill size={12} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`}/>
            </div>

            {isOpen && (
                <div className="
                    absolute 
                    top-9 left-0 z-30
                    shadow-xl  
                    flex flex-col
                    w-[143px] h-7
                ">
                    <div onClick={() => handleSelect('LOW')} className="bg-[#252628] w-[180px] h-9
                    py-1 px-2 cursor-pointer rounded-t-sm hover:brightness-110 border-white hover:border-l-2">
                        <LowPriority />
                    </div>
                    <div onClick={() => handleSelect('MEDIUM')} className="bg-[#252628] w-[180px] h-9
                    py-1 px-2 cursor-pointer hover:brightness-110 border-white hover:border-l-2">
                        <MediumPriority />
                    </div>
                    <div onClick={() => handleSelect('HIGH')} className="bg-[#252628] w-[180px] h-9
                    py-1 px-2 cursor-pointer hover:brightness-110 border-white hover:border-l-2">
                        <HighPriority />
                    </div>
                    <div onClick={() => handleSelect('VERY_HIGH')} className="bg-[#252628] w-[180px] h-9
                    py-1 px-2 cursor-pointer rounded-b-sm hover:brightness-110 border-white hover:border-l-2">
                        <VeryHighPriority />
                    </div>
                </div>
            )}
        </div>
    )
}