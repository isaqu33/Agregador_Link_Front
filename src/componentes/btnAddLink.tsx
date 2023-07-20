import { Plus } from "phosphor-react";


export default function BtnAddLink() {
    return (
        <button type="button" className=' w-[70px] hover:bg-violet-400 bg-[#A971F1] rounded-full p-4 h-[70px] flex items-center outline-none'>
            <Plus size={40} color="#ffff" weight="bold" />
        </button>
    )
}

