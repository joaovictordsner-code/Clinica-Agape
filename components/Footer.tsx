import React from 'react';
import { EXPERT_INFO } from '../constants';
import { Instagram, MapPin } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white py-12 border-t border-gray-800">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 text-center md:text-left">
          
          <div>
            <h3 className="text-2xl font-bold mb-2">{EXPERT_INFO.name}</h3>
            <p className="text-gray-400">{EXPERT_INFO.profession}</p>
          </div>

          <div className="flex flex-col items-center md:items-start gap-4">
            <div className="flex items-center gap-2 text-gray-300">
              <MapPin size={18} className="text-brand-500" />
              <span>{EXPERT_INFO.address}</span>
            </div>
            
            <a 
              href={EXPERT_INFO.instagramLink} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-brand-400 hover:text-white transition-colors"
            >
              <Instagram size={20} />
              Seguir no Instagram
            </a>
          </div>

        </div>

        <div className="mt-8 pt-8 border-t border-gray-800 text-center text-sm text-gray-600">
          © {new Date().getFullYear()} {EXPERT_INFO.name}. Todos os direitos reservados.
        </div>
      </div>
    </footer>
  );
};

export default Footer;