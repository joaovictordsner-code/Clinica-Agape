import React from 'react';
import Button from './Button';

const Hero: React.FC = () => {
  return (
    <section className="relative bg-gradient-to-b from-brand-50 to-white pt-10 pb-16 lg:pt-20 lg:pb-24 overflow-hidden">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="max-w-4xl mx-auto text-center z-10 relative">
          
          <div className="inline-block bg-brand-100 text-brand-900 px-4 py-1.5 rounded-full text-sm font-semibold mb-6">
            Dentista em Simão Dias
          </div>
          
          <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
            Recupere a confiança do seu sorriso com a <span className="text-brand-600">Clínica Ágape</span>
          </h1>
          
          <p className="text-lg lg:text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Tratamentos odontológicos humanizados, tecnologia de ponta e resultados que transformam vidas. Sua avaliação inicial é por nossa conta.
          </p>
          
          <div className="flex flex-col items-center gap-3">
            <Button className="animate-pulse" />
            <p className="text-sm text-gray-500 flex items-center gap-1">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              Resposta rápida • Sem compromisso
            </p>
          </div>

          {/* Decorative background blob behind text */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-brand-100 rounded-full blur-3xl -z-10 opacity-40 pointer-events-none"></div>
        </div>
      </div>
    </section>
  );
};

export default Hero;