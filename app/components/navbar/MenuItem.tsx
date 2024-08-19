"use client";

interface MenuItemProps {
    onClick: () => void;
    label: string;
    isRed?: boolean;
}

const MenuItem: React.FC<MenuItemProps> = ({onClick, label, isRed}) => {
  return (
    <div onClick={onClick} className={`px-4 py-3 hover:bg-neutral-100 transition font-semibold ${isRed ? 'text-red-500': 'text-black'}`}>
        {label}
    </div>
  )
}

export default MenuItem