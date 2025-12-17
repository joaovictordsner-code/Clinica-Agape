import React from 'react';
import { ABOUT_IMAGE } from '../constants';
import { CheckCircle2 } from 'lucide-react';

const About: React.FC = () => {
  const benefits = [
    "Atendimento 100% humanizado e acolhedor",
    "Especialistas em transformar sorrisos e autoestima",
    "Ambiente moderno e equipamentos de última geração",
    "Clareza e honestidade em cada orçamento"
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          
          {/* Image */}
          <div className="w-full lg:w-5/12">
            <div className="relative rounded-2xl overflow-hidden shadow-xl">
              <img 
                src={ABOUT_IMAGE} 
                alt="Dra. da Clínica Ágape" 
                className="w-full h-auto"
              />
            </div>
          </div>

          {/* Content */}
          <div className="w-full lg:w-7/12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
              Quem cuida do seu sorriso?
            </h2>
            <div className="prose prose-lg text-gray-600 mb-8">
              <p className="mb-4">
                Olá! Nós somos a equipe da <strong>Clínica Ágape</strong>. Nossa missão vai muito além de tratar dentes; nós cuidamos de pessoas.
              </p>
              <p>
                Entendemos que ir ao dentista pode gerar ansiedade em muitas pessoas. Por isso, criamos um ambiente onde você se sente em casa, acolhido e respeitado desde o primeiro contato.
              </p>
              <p>
                Aqui em Simão Dias, dedicamos nossa carreira a devolver a confiança de sorrir para nossos pacientes, combinando técnica de excelência com um toque humano que faz toda a diferença.
              </p>
            </div>

            <ul className="space-y-3">
              {benefits.map((benefit, index) => (
                <li key={index} className="flex items-start gap-3">
                  <CheckCircle2 className="text-brand-600 shrink-0 mt-1" size={20} />
                  <span className="text-gray-700 font-medium">{benefit}</span>
                </li>
              ))}
            </ul>
          </div>

        </div>
      </div>
    </section>
  );
};

export default About;