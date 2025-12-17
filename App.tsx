import React from 'react';
import Hero from './components/Hero';
import About from './components/About';
import Gallery from './components/Gallery';
import Features from './components/Features';
import Process from './components/Process';
import FinalCTA from './components/FinalCTA';
import Footer from './components/Footer';

function App() {
  return (
    <main className="min-h-screen bg-white text-gray-900 selection:bg-brand-200 selection:text-brand-900">
      <Hero />
      <About />
      <Gallery />
      <Features />
      <Process />
      <FinalCTA />
      <Footer />
      
      {/* Sticky Mobile CTA */}
      <div className="fixed bottom-4 left-4 right-4 z-40 md:hidden">
        <a 
          href="https://wa.me/5579999837184?text=Ol%C3%A1!%20Vim%20pelo%20Instagram%20da%20Cl%C3%ADnica%20%C3%81gape%20e%20gostaria%20de%20agendar%20uma%20avalia%C3%A7%C3%A3o%20odontol%C3%B3gica."
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 bg-whatsapp text-white font-bold py-3 px-6 rounded-full shadow-lg w-full text-center hover:bg-whatsappHover transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/></svg>
          Agendar no WhatsApp
        </a>
      </div>
    </main>
  );
}

export default App;