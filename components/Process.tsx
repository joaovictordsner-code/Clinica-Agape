import React from 'react';
import { MessageSquare, CalendarCheck, Sparkles } from 'lucide-react';

const Process: React.FC = () => {
  const steps = [
    {
      icon: MessageSquare,
      title: "1. Contato Rápido",
      description: "Clique no botão do WhatsApp e nos mande um 'Oi'. Nossa equipe te responderá rapidamente."
    },
    {
      icon: CalendarCheck,
      title: "2. Agendamento",
      description: "Escolhemos juntos o melhor horário para você, sem complicação e sem burocracia."
    },
    {
      icon: Sparkles,
      title: "3. Avaliação Gratuita",
      description: "Você vem até a clínica, avaliamos seu caso e propomos a melhor solução para seu sorriso."
    }
  ];

  return (
    <section className="py-16 bg-gray-50 border-t border-gray-100">
      <div className="container mx-auto px-4 lg:px-8">
        <h2 className="text-3xl lg:text-4xl font-bold text-center text-gray-900 mb-12">
          Sua primeira consulta em 3 passos
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {steps.map((step, index) => (
            <div key={index} className="relative flex flex-col items-center text-center">
              {/* Connector Line (Desktop) */}
              {index !== steps.length - 1 && (
                <div className="hidden md:block absolute top-8 left-1/2 w-full h-0.5 bg-gray-200 -z-10"></div>
              )}
              
              <div className="w-16 h-16 bg-brand-600 text-white rounded-full flex items-center justify-center shadow-lg mb-6 text-2xl font-bold border-4 border-white">
                <step.icon size={28} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{step.title}</h3>
              <p className="text-gray-600 max-w-xs mx-auto">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Process;