import { MessageCircle, X } from "lucide-react";
import { Dispatch, SetStateAction } from "react";

const BubbleButton = ({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  return (
    <button
      onClick={() => setIsOpen(!isOpen)}
      className={`
      fixed bottom-6 right-6 bg-blue-500 text-white 
      rounded-full p-3 shadow-lg hover:bg-blue-600 
      transition-all duration-300 ease-in-out hover:scale-105
      ${isOpen ? "rotate-180" : ""}
    `}
    >
      {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
    </button>
  );
};

export default BubbleButton;
