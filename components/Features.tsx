import React from 'react';
import { ShieldCheck, Heart, Clock, Award } from 'lucide-react';
import Button from './Button';

const Features: React.FC = () => {
  const features = [
    {
      icon: ShieldCheck,
      title: "Segurança Total",
      description: "Protocolos rigorosos de biossegurança e esterilização para sua proteção."
    },
    {
      icon: Heart,
      title: "Cuidado Humano",
      description: "Não tratamos apenas dentes, acolhemos histórias e cuidamos de você."
    },
    {
      icon: Award,
      title: "Excelência Técnica",
      description: "Profissionais em constante atualização com as melhores técnicas do mercado."
    },
    {
      icon: Clock,
      title: "Agilidade",
      description: "Respeitamos seu tempo com atendimentos pontuais e tratamentos eficientes."
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4 lg:px-8">
        <h2 className="text-3xl lg:text-4xl font-bold text-center text-gray-900 mb-12">
          Por que escolher a Clínica Ágape?
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {features.map((feature, index) => (
            <div key={index} className="bg-brand-50 rounded-2xl p-6 hover:shadow-lg transition-shadow duration-300 border border-brand-100 text-center lg:text-left">
              <div className="bg-white w-14 h-14 rounded-full flex items-center justify-center shadow-sm mb-4 mx-auto lg:mx-0 text-brand-600">
                <feature.icon size={28} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Intermediate CTA */}
        <div className="bg-brand-900 rounded-3xl p-8 md:p-12 text-center text-white shadow-xl relative overflow-hidden">
          <div className="relative z-10">
            <h3 className="text-2xl md:text-3xl font-bold mb-4">
              Ainda com dúvida?
            </h3>
            <p className="text-brand-100 mb-8 max-w-xl mx-auto">
              Não deixe a dor ou a insegurança aumentarem. Converse diretamente conosco pelo WhatsApp e tire todas as suas dúvidas agora mesmo.
            </p>
            <Button text="Falar com a Dra. no WhatsApp" />
          </div>
          
          {/* Decorative circles */}
          <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-64 h-64 bg-brand-700 rounded-full opacity-50 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-64 h-64 bg-brand-700 rounded-full opacity-50 blur-3xl"></div>
        </div>
      </div>
    </section>
  );
};

export default Features;