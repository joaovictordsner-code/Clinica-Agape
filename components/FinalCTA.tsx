import React from 'react';
import Button from './Button';

const FinalCTA: React.FC = () => {
  return (
    <section className="py-20 bg-gradient-to-br from-brand-600 to-brand-800 text-white text-center">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl lg:text-5xl font-bold mb-6">
          Seu novo sorriso começa agora
        </h2>
        <p className="text-xl text-brand-100 mb-10 max-w-2xl mx-auto">
          Não adie mais o cuidado que você merece. A primeira consulta é gratuita e estamos prontos para te receber.
        </p>
        <Button text="Quero agendar minha avaliação grátis" className="text-xl px-10 py-5" />
      </div>
    </section>
  );
};

export default FinalCTA;