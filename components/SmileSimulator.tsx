import React, { useState, useEffect, useRef } from 'react';
import { Upload, Sparkles, Loader2, Image as ImageIcon, AlertCircle, Wand2, Clock, ShieldCheck, Zap } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

const SmileSimulator: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [prompt, setPrompt] = useState('');
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState("Processando...");
  const [error, setError] = useState<string | null>(null);
  const [hasPaidKey, setHasPaidKey] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Verifica se o dono já selecionou uma chave paga
  useEffect(() => {
    const checkKey = async () => {
      if (window.aistudio && typeof window.aistudio.hasSelectedApiKey === 'function') {
        const selected = await window.aistudio.hasSelectedApiKey();
        setHasPaidKey(selected);
      }
    };
    checkKey();
  }, []);

  const handleActivatePro = async () => {
    if (window.aistudio && typeof window.aistudio.openSelectKey === 'function') {
      await window.aistudio.openSelectKey();
      setHasPaidKey(true); // Assume sucesso para evitar race conditions
    } else {
      alert("Para ativar o modo ilimitado, você deve configurar o faturamento em: ai.google.dev/gemini-api/docs/billing");
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError("A imagem deve ter no máximo 5MB.");
        return;
      }
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setResultImage(null);
      setError(null);
    }
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        const base64 = result.split(',')[1];
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleQuickPrompt = (type: 'whitening' | 'veneers' | 'correction') => {
    switch(type) {
      case 'whitening':
        setPrompt("Realize um clareamento dental profissional de ultra-realismo. Cor B1 natural. Mantenha brilho e sombras.");
        break;
      case 'veneers':
        setPrompt("Simule facetas de porcelana perfeitas. Corrija alinhamento, tamanho e brancura. Aspecto vítreo natural.");
        break;
      case 'correction':
        setPrompt("Corrija o alinhamento dos dentes frontais e remova pequenas manchas.");
        break;
    }
  };

  const handleGenerate = async () => {
    if (!selectedFile || !prompt) return;

    setLoading(true);
    setError(null);
    setLoadingText("Conectando com a IA...");

    try {
      const base64Data = await fileToBase64(selectedFile);
      
      const systemContext = `
        VOCÊ É UM DENTISTA ESTÉTICO DE ELITE. 
        EDITE A IMAGEM DO PACIENTE PARA UM RESULTADO DE 'CAPA DE REVISTA' MAS 100% NATURAL.
        USE O MODELO GEMINI 3 PRO PARA MÁXIMA DEFINIÇÃO.
        FOQUE APENAS NOS DENTES E SORRISO.
      `;

      const finalPrompt = `${systemContext}\nSOLICITAÇÃO: ${prompt}\nRETORNE APENAS A IMAGEM.`;

      let success = false;
      let attempt = 1;
      const maxRetries = 2;

      while (!success && attempt <= maxRetries) {
        try {
          // Criamos a instância aqui para pegar a chave mais atualizada (paga ou free)
          const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
          
          setLoadingText(attempt > 1 ? "Otimizando processamento..." : "Esculpindo seu novo sorriso...");

          const response = await ai.models.generateContent({
            model: 'gemini-3-pro-image-preview',
            contents: {
              parts: [
                { inlineData: { data: base64Data, mimeType: selectedFile.type } },
                { text: finalPrompt }
              ],
            },
            config: {
              imageConfig: {
                aspectRatio: "1:1",
                imageSize: "1K" // Qualidade superior
              }
            }
          });

          if (response.candidates?.[0]?.content?.parts) {
            for (const part of response.candidates[0].content.parts) {
              if (part.inlineData) {
                setResultImage(`data:image/png;base64,${part.inlineData.data}`);
                success = true;
                break;
              }
            }
          }
          
          if (!success) throw new Error("A IA não gerou a imagem.");

        } catch (err: any) {
          const errMsg = err.message || "";
          const isRateLimit = errMsg.includes('429') || errMsg.includes('RESOURCE_EXHAUSTED') || errMsg.includes('Quota exceeded');

          if (isRateLimit && attempt < maxRetries && !hasPaidKey) {
            let seconds = 30; // Tempo reduzido para parecer mais rápido
            while (seconds > 0) {
              setLoadingText(`Refinando detalhes finais... (${seconds}s)`);
              await new Promise(r => setTimeout(r, 1000));
              seconds--;
            }
            attempt++;
          } else if (errMsg.includes("Requested entity was not found")) {
            // Se a chave selecionada deu erro, resetamos
            setHasPaidKey(false);
            throw new Error("Erro de conexão. Clique em 'Ativar Modo Ilimitado' novamente.");
          } else {
            throw err;
          }
        }
      }

    } catch (err: any) {
      console.error(err);
      setError(hasPaidKey 
        ? "Erro técnico na geração. Tente uma foto com iluminação melhor." 
        : "Servidor em alta demanda. Para uso ilimitado, o administrador deve ativar o Modo Pro.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-16 bg-[#0B1120] text-white overflow-hidden">
      <div className="container mx-auto px-4 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-brand-900/50 border border-brand-700/50 rounded-full px-4 py-1 mb-4">
            <Zap size={14} className="text-yellow-400 fill-yellow-400" />
            <span className="text-[10px] font-black text-brand-100 uppercase tracking-[0.2em]">Tecnologia Gemini 3 Pro</span>
          </div>
          <h2 className="text-3xl lg:text-5xl font-bold mb-4 tracking-tight">Simulador de Sorriso <span className="text-brand-500">Ultra-Realista</span></h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-base">
            Visualize sua transformação com a Inteligência Artificial mais avançada do mundo. 
            Resultados em alta definição para o seu planejamento estético.
          </p>
        </div>

        <div className="max-w-6xl mx-auto bg-[#131B2E] border border-gray-800 rounded-3xl overflow-hidden shadow-2xl relative">
          
          {/* Admin Toggle */}
          <button 
            onClick={handleActivatePro}
            className={`absolute top-4 right-4 z-20 flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-bold transition-all ${hasPaidKey ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-gray-800 text-gray-500 border border-gray-700 hover:text-white hover:border-brand-500'}`}
          >
            {hasPaidKey ? <ShieldCheck size={14} /> : <Zap size={14} />}
            {hasPaidKey ? 'MODO ILIMITADO ATIVO' : 'ADMIN: ATIVAR MODO ILIMITADO'}
          </button>

          <div className="flex flex-col lg:flex-row min-h-[600px]">
            
            {/* Left Column: Controls */}
            <div className="w-full lg:w-1/3 p-6 lg:p-8 border-b lg:border-b-0 lg:border-r border-gray-800 flex flex-col gap-6 bg-[#161F35]">
              
              <div>
                <label className="block text-xs font-bold text-brand-400 uppercase tracking-widest mb-3">1. Carregar Foto</label>
                <div 
                  className={`
                    relative border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all
                    ${previewUrl ? 'border-brand-500 bg-brand-500/5' : 'border-gray-700 hover:border-brand-500 bg-gray-900/50'}
                  `}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange}/>
                  {previewUrl ? (
                    <div className="relative h-44 w-full">
                      <img src={previewUrl} alt="Preview" className="w-full h-full object-cover rounded-xl" />
                      <div className="absolute inset-0 bg-black/60 opacity-0 hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center font-bold text-xs">Trocar Foto</div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center py-6">
                      <div className="w-14 h-14 bg-gray-800 rounded-2xl flex items-center justify-center mb-4 text-brand-500 shadow-inner">
                        <Upload size={28} />
                      </div>
                      <span className="text-sm font-semibold text-gray-300">Selecione sua foto</span>
                      <p className="text-[10px] text-gray-500 mt-2">Formatos: JPG, PNG • Máx 5MB</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex-grow">
                <label className="block text-xs font-bold text-brand-400 uppercase tracking-widest mb-3">2. Escolher Tratamento</label>
                
                <div className="grid grid-cols-1 gap-2 mb-4">
                  <button onClick={() => handleQuickPrompt('whitening')} className="text-left text-xs bg-gray-800/50 hover:bg-brand-600/20 border border-gray-700 hover:border-brand-500 p-3 rounded-xl transition-all flex items-center gap-3">
                    <span className="w-8 h-8 rounded-lg bg-gray-700 flex items-center justify-center text-lg">✨</span>
                    <div>
                      <div className="font-bold text-white">Clareamento</div>
                      <div className="text-[10px] text-gray-500 italic">Dentes mais brancos e brilhantes</div>
                    </div>
                  </button>
                  <button onClick={() => handleQuickPrompt('veneers')} className="text-left text-xs bg-gray-800/50 hover:bg-brand-600/20 border border-gray-700 hover:border-brand-500 p-3 rounded-xl transition-all flex items-center gap-3">
                    <span className="w-8 h-8 rounded-lg bg-gray-700 flex items-center justify-center text-lg">🦷</span>
                    <div>
                      <div className="font-bold text-white">Lentes de Contato</div>
                      <div className="text-[10px] text-gray-500 italic">Alinhamento e volume perfeito</div>
                    </div>
                  </button>
                </div>

                <textarea
                  className="w-full bg-[#0B1120] border border-gray-700 rounded-xl p-4 text-white placeholder-gray-600 focus:ring-1 focus:ring-brand-500 outline-none transition-all resize-none h-28 text-xs font-medium"
                  placeholder="Ou descreva seu desejo..."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                />
              </div>

              <div>
                <button
                  onClick={handleGenerate}
                  disabled={loading || !selectedFile || !prompt}
                  className={`
                    w-full py-4 rounded-2xl font-black text-sm uppercase tracking-[0.2em] flex items-center justify-center gap-3 transition-all
                    ${loading || !selectedFile || !prompt 
                      ? 'bg-gray-800 text-gray-600 cursor-not-allowed' 
                      : 'bg-brand-600 hover:bg-brand-500 text-white shadow-xl shadow-brand-900/30 transform hover:-translate-y-1'}
                  `}
                >
                  {loading ? (
                    <>
                      {loadingText.includes("s)") ? <Clock size={20} className="animate-pulse" /> : <Loader2 size={20} className="animate-spin" />}
                      {loadingText}
                    </>
                  ) : (
                    <>
                      <Wand2 size={20} />
                      Gerar Agora
                    </>
                  )}
                </button>
                {error && (
                  <div className="mt-4 p-4 bg-red-950/30 border border-red-500/50 rounded-xl flex flex-col gap-2">
                    <div className="flex items-center gap-2 text-red-400 font-bold text-xs uppercase tracking-wider">
                      <AlertCircle size={14} />
                      Aviso do Sistema
                    </div>
                    <p className="text-[11px] text-red-200/80 leading-relaxed font-medium">{error}</p>
                    {!hasPaidKey && (
                      <button onClick={handleActivatePro} className="text-[10px] text-brand-400 hover:underline text-left mt-1 font-bold">
                        Dono da Clínica: Clique aqui para remover limites
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Right Column: Result */}
            <div className="w-full lg:w-2/3 bg-[#0F1629] relative min-h-[500px] flex items-center justify-center p-6 lg:p-12 overflow-hidden">
              <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#0ea5e9_1px,transparent_1px)] [background-size:20px_20px]"></div>
              
              {resultImage ? (
                <div className="relative w-full h-full flex flex-col items-center justify-center animate-in zoom-in duration-500">
                   <img 
                    src={resultImage} 
                    alt="Resultado da Transformação" 
                    className="max-w-full max-h-[550px] object-contain rounded-3xl shadow-[0_0_50px_rgba(14,165,233,0.3)] border border-brand-500/30"
                  />
                  <div className="flex flex-wrap justify-center gap-3 mt-8">
                    <button 
                      onClick={() => setResultImage(null)}
                      className="px-8 py-3 rounded-full bg-gray-800 text-gray-300 hover:bg-gray-700 font-bold text-xs transition-all uppercase tracking-widest border border-gray-700"
                    >
                      Refazer
                    </button>
                    <a 
                      href={`https://wa.me/5579999837184?text=Ol%C3%A1!%20Fiz%20uma%20simula%C3%A7%C3%A3o%20IA%20e%20amei%20o%20resultado.%20Gostaria%20de%20saber%20como%20fa%C3%A7o%20para%20ter%20esse%20sorriso!`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-8 py-3 rounded-full bg-whatsapp hover:bg-whatsappHover text-white font-black text-xs transition-all uppercase tracking-widest shadow-lg shadow-whatsapp/20"
                    >
                      Amei! Agendar agora
                    </a>
                  </div>
                </div>
              ) : (
                <div className="text-center relative z-10">
                  <div className="w-32 h-32 bg-brand-500/5 rounded-[40px] flex items-center justify-center mx-auto mb-8 border border-brand-500/20 rotate-12">
                    <ImageIcon size={56} className="text-brand-500/20 -rotate-12" />
                  </div>
                  <h3 className="text-2xl font-bold mb-3 text-gray-200">Pronto para a mágica?</h3>
                  <p className="text-sm text-gray-500 max-w-xs mx-auto font-medium leading-relaxed">
                    Nossa IA Gemini 3 Pro processará sua foto para criar uma simulação odontológica de alta precisão.
                  </p>
                </div>
              )}
            </div>

          </div>
        </div>

        <div className="flex flex-col items-center mt-12 gap-4">
           <div className="flex items-center gap-4 opacity-30 grayscale hover:grayscale-0 transition-all cursor-default">
              <span className="text-[10px] font-bold tracking-[0.3em] uppercase">Powered By</span>
              <img src="https://upload.wikimedia.org/wikipedia/commons/8/8a/Google_Gemini_logo.svg" alt="Google Gemini" className="h-4" />
           </div>
           <p className="text-center text-gray-600 text-[10px] max-w-2xl mx-auto uppercase tracking-wider font-bold">
            Simulação artística digital • Não substitui avaliação clínica presencial • Propriedade da Clínica Ágape
          </p>
        </div>

      </div>
    </section>
  );
};

export default SmileSimulator;