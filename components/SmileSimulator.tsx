import React, { useState, useRef } from 'react';
import { Upload, Sparkles, Loader2, Image as ImageIcon, AlertCircle, Wand2 } from 'lucide-react';

const SmileSimulator: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [prompt, setPrompt] = useState('');
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
        // Remove data:image/type;base64, prefix
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
        // Opção 2: Clareamento
        setPrompt("Realize um clareamento dental profissional nesta imagem. Remova o amarelado dos dentes, deixando-os com uma tonalidade B1 (branco natural brilhante). Mantenha o realismo, reflexos de saliva e sombras naturais entre os dentes. Não altere o formato dos dentes, apenas a cor.");
        break;
      case 'veneers':
        // Opção 3: Lentes de Contato
        setPrompt("Simule a aplicação de lentes de contato dentais em cerâmica nesta pessoa. Aumente ligeiramente o volume dos dentes para preencher o corredor bucal, corrija a simetria e deixe o sorriso mais harmônico e branco. Mantenha o aspecto realista e vítreo da cerâmica.");
        break;
      case 'correction':
        // Variação para correções leves
        setPrompt("Corrija leves desalinhamentos e imperfeições nas bordas dos dentes mantendo a naturalidade.");
        break;
    }
  };

  const handleGenerate = async () => {
    if (!selectedFile || !prompt) return;

    setLoading(true);
    setError(null);

    try {
      // Dynamic import to prevent crash on load if library is missing or fails
      let GoogleGenAI;
      try {
        // @ts-ignore
        const module = await import("@google/genai");
        GoogleGenAI = module.GoogleGenAI;
      } catch (importError: any) {
        console.error("Failed to import @google/genai", importError);
        throw new Error(`Erro de Importação: ${importError.message || importError}`);
      }

      // Tenta recuperar a chave de API de todas as formas possíveis.
      // Na Vercel (Vite), variáveis públicas DEVEM começar com VITE_
      // @ts-ignore
      let apiKey = (import.meta.env && import.meta.env.VITE_API_KEY) || (window.process && window.process.env && window.process.env.API_KEY) || process.env.API_KEY;
      
      // Limpeza de segurança: remove espaços e aspas se o usuário tiver colado errado
      if (apiKey) {
        apiKey = apiKey.trim().replace(/^["']|["']$/g, '');
      }

      if (!apiKey) {
        throw new Error("CHAVE_FALTANDO: A variável VITE_API_KEY não foi encontrada.");
      }

      const ai = new GoogleGenAI({ apiKey });
      const base64Data = await fileToBase64(selectedFile);
      
      // Opção 1: O "Prompt Mestre" (Recomendado)
      const systemContext = `
        Atue como um especialista em Odontologia Estética. Edite esta imagem para simular um tratamento de 'Sorriso de Hollywood' natural.
        
        DIRETRIZES TÉCNICAS OBRIGATÓRIAS:
        1. Realize um clareamento dental mantendo a textura e brilho naturais (evite branco fosco/papel).
        2. Corrija leves desalinhamentos e imperfeições nas bordas dos dentes.
        3. Mantenha a gengiva com cor saudável e natural.
        4. É CRUCIAL preservar a identidade da pessoa, o formato dos lábios e a iluminação original da foto. Mexa APENAS nos dentes.
      `;

      // Combinação do Prompt Mestre com o pedido do usuário
      const finalPrompt = `${systemContext}
      
      INSTRUÇÃO ESPECÍFICA DO PACIENTE:
      ${prompt}
      
      Retorne APENAS a imagem editada.`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [
            {
              inlineData: {
                data: base64Data,
                mimeType: selectedFile.type,
              },
            },
            {
              text: finalPrompt
            },
          ],
        },
      });

      let foundImage = false;
      if (response.candidates?.[0]?.content?.parts) {
        for (const part of response.candidates[0].content.parts) {
          if (part.inlineData) {
            const base64EncodeString = part.inlineData.data;
            const imageUrl = `data:image/png;base64,${base64EncodeString}`;
            setResultImage(imageUrl);
            foundImage = true;
            break;
          }
        }
      }

      if (!foundImage) {
        // Se chegou aqui, a IA respondeu mas não mandou imagem. Vamos ver o texto.
        const textResponse = response.candidates?.[0]?.content?.parts?.[0]?.text;
        throw new Error(`IA_SEM_IMAGEM: A IA respondeu, mas não gerou imagem. Resposta: ${textResponse?.substring(0, 100)}...`);
      }

    } catch (err: any) {
      console.error(err);
      // MODO DEBUG: Mostra o erro cru para o usuário copiar
      const rawMessage = err instanceof Error ? err.message : JSON.stringify(err);
      
      // Tenta extrair detalhes de erro da API do Google se existirem
      let detailedError = rawMessage;
      if (err.response) {
         try {
             detailedError += ` | Status: ${err.response.status} ${err.response.statusText}`;
         } catch (e) {}
      }

      setError(`ERRO TÉCNICO (Mande print): ${detailedError}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-16 bg-[#0B1120] text-white">
      <div className="container mx-auto px-4 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-brand-900 border border-brand-700 rounded-full px-4 py-1 mb-4">
            <Sparkles size={16} className="text-brand-400" />
            <span className="text-xs font-bold text-brand-100 uppercase tracking-wider">IA Generativa</span>
          </div>
          <h2 className="text-3xl lg:text-5xl font-bold mb-4">Simulador de Sorriso com IA</h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            Visualize o poder de um novo sorriso. Envie sua foto e nossa Inteligência Artificial criará uma simulação personalizada.
          </p>
        </div>

        <div className="max-w-6xl mx-auto bg-[#131B2E] border border-gray-800 rounded-2xl overflow-hidden shadow-2xl">
          <div className="flex flex-col lg:flex-row min-h-[600px]">
            
            {/* Left Column: Controls */}
            <div className="w-full lg:w-1/3 p-6 lg:p-8 border-b lg:border-b-0 lg:border-r border-gray-800 flex flex-col gap-6">
              
              {/* Step 1: Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">1. Sua foto (Sorriso visível)</label>
                <div 
                  className={`
                    relative border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all
                    ${previewUrl ? 'border-brand-600 bg-brand-900/20' : 'border-gray-700 hover:border-brand-500 hover:bg-gray-800'}
                  `}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    className="hidden" 
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                  {previewUrl ? (
                    <div className="relative h-40 w-full">
                      <img src={previewUrl} alt="Preview" className="w-full h-full object-contain rounded" />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 hover:opacity-100 transition-opacity rounded">
                        <span className="text-white text-sm font-medium">Trocar foto</span>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center py-4">
                      <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center mb-3 text-gray-400">
                        <Upload size={24} />
                      </div>
                      <span className="text-sm text-gray-400 font-medium">Clique para enviar foto</span>
                      <span className="text-xs text-gray-500 mt-1">JPG ou PNG</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Step 2: Prompt */}
              <div className="flex-grow">
                <label className="block text-sm font-medium text-gray-300 mb-2">2. Escolha o tratamento</label>
                
                {/* Quick Actions */}
                <div className="flex gap-2 mb-3 overflow-x-auto pb-2 scrollbar-hide">
                  <button 
                    onClick={() => handleQuickPrompt('whitening')}
                    className="text-xs bg-gray-800 hover:bg-gray-700 border border-gray-700 text-gray-300 px-3 py-1.5 rounded-full whitespace-nowrap transition-colors"
                  >
                    ✨ Clareamento
                  </button>
                  <button 
                    onClick={() => handleQuickPrompt('veneers')}
                    className="text-xs bg-gray-800 hover:bg-gray-700 border border-gray-700 text-gray-300 px-3 py-1.5 rounded-full whitespace-nowrap transition-colors"
                  >
                    🦷 Lentes de Contato
                  </button>
                  <button 
                    onClick={() => handleQuickPrompt('correction')}
                    className="text-xs bg-gray-800 hover:bg-gray-700 border border-gray-700 text-gray-300 px-3 py-1.5 rounded-full whitespace-nowrap transition-colors"
                  >
                    📏 Alinhamento
                  </button>
                </div>

                <textarea
                  className="w-full bg-[#0B1120] border border-gray-700 rounded-xl p-4 text-white placeholder-gray-500 focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all resize-none h-32 text-sm"
                  placeholder="Ou descreva seu desejo (ex: alinhar os dentes, remover manchas...)"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                />
              </div>

              {/* Generate Button */}
              <div>
                <button
                  onClick={handleGenerate}
                  disabled={loading || !selectedFile || !prompt}
                  className={`
                    w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all
                    ${loading || !selectedFile || !prompt 
                      ? 'bg-gray-700 text-gray-400 cursor-not-allowed' 
                      : 'bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-500 hover:to-brand-400 text-white shadow-lg shadow-brand-900/20 hover:shadow-brand-900/40 transform hover:-translate-y-0.5'}
                  `}
                >
                  {loading ? (
                    <>
                      <Loader2 size={24} className="animate-spin" />
                      Processando...
                    </>
                  ) : (
                    <>
                      <Wand2 size={24} />
                      Gerar Simulação
                    </>
                  )}
                </button>
                {error && (
                  <div className="mt-3 p-3 bg-red-900/50 border border-red-500 rounded-lg flex flex-col gap-1 text-red-200 text-xs break-words">
                    <div className="flex items-center gap-2 font-bold text-red-100">
                      <AlertCircle size={16} />
                      <span>Erro Detectado:</span>
                    </div>
                    {error}
                  </div>
                )}
              </div>
            </div>

            {/* Right Column: Result */}
            <div className="w-full lg:w-2/3 bg-[#0f1522] relative min-h-[400px] flex items-center justify-center p-4 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-repeat opacity-100">
              {resultImage ? (
                <div className="relative w-full h-full flex flex-col items-center justify-center animate-in fade-in duration-700">
                   <img 
                    src={resultImage} 
                    alt="Resultado IA" 
                    className="max-w-full max-h-[600px] object-contain rounded-lg shadow-2xl border border-gray-800"
                  />
                  <div className="flex gap-4 mt-6">
                    <button 
                      onClick={() => setResultImage(null)}
                      className="px-6 py-2 rounded-full bg-gray-800 text-white hover:bg-gray-700 transition-colors"
                    >
                      Nova Simulação
                    </button>
                    <a 
                      href="https://wa.me/5579999837184?text=Ol%C3%A1!%20Fiz%20uma%20simula%C3%A7%C3%A3o%20no%20site%20e%20gostaria%20de%20saber%20se%20consigo%20esse%20resultado."
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-6 py-2 rounded-full bg-whatsapp hover:bg-whatsappHover text-white font-bold transition-colors"
                    >
                      Quero esse resultado!
                    </a>
                  </div>
                  <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md text-white text-xs px-3 py-1 rounded-full border border-white/10 flex items-center gap-1">
                    <Sparkles size={10} className="text-brand-400" />
                    Gerado por IA Gemini
                  </div>
                </div>
              ) : (
                <div className="text-center text-gray-600 max-w-sm px-6">
                  <div className="w-24 h-24 bg-gray-800/30 rounded-full flex items-center justify-center mx-auto mb-6 border border-gray-800">
                    <ImageIcon size={48} className="opacity-40" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-gray-400">O resultado aparecerá aqui</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">
                    Envie sua foto e selecione um dos tratamentos rápidos ou descreva seu desejo. A mágica leva cerca de 5-10 segundos.
                  </p>
                </div>
              )}
            </div>

          </div>
        </div>

        {/* Disclaimer */}
        <p className="text-center text-gray-500 text-xs mt-6 max-w-3xl mx-auto">
          * Esta é uma simulação artística (IA) para fins ilustrativos e não representa garantia de resultado clínico. 
          Agende uma avaliação para um diagnóstico preciso.
        </p>

      </div>
    </section>
  );
};

export default SmileSimulator;