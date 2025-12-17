import React from 'react';
import { EXPERT_INFO } from '../constants';
import { MessageCircle } from 'lucide-react';

interface ButtonProps {
  text?: string;
  className?: string;
  fullWidth?: boolean;
}

const Button: React.FC<ButtonProps> = ({ 
  text = "Agendar primeira consulta gratuita", 
  className = "",
  fullWidth = false
}) => {
  return (
    <a 
      href={EXPERT_INFO.whatsappLink}
      target="_blank"
      rel="noopener noreferrer"
      className={`
        inline-flex items-center justify-center gap-2
        bg-whatsapp hover:bg-whatsappHover 
        text-white font-bold py-4 px-8 rounded-full 
        transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl
        text-lg uppercase tracking-wide
        ${fullWidth ? 'w-full' : 'w-auto'}
        ${className}
      `}
    >
      <MessageCircle size={24} />
      {text}
    </a>
  );
};

export default Button;