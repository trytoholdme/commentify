import { motion } from 'framer-motion';
import { Cookie, ExternalLink, AlertCircle } from 'lucide-react';

export function TutorialSection() {
  return (
    <div className="gradient-border p-6">
      <div className="flex items-center gap-3 mb-6">
        <Cookie className="w-6 h-6 text-indigo-400" />
        <h2 className="text-xl font-bold text-white">Tutorial: Como Exportar Cookies</h2>
      </div>

      <div className="space-y-6">
        <div className="bg-gray-800/50 rounded-lg p-6 space-y-4">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold">1</span>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">Instalar a Extensão Cookie Editor</h3>
              <p className="text-gray-300 mb-3">
                Primeiro, instale a extensão Cookie Editor no seu navegador Chrome.
              </p>
              <a
                href="https://chromewebstore.google.com/detail/cookie-editor/hlkenndednhfkekhgcdicdfddnkalmdm"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-indigo-400 hover:text-indigo-300 transition-colors"
              >
                Instalar Cookie Editor
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        <div className="bg-gray-800/50 rounded-lg p-6 space-y-4">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold">2</span>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">Exportar os Cookies</h3>
              <p className="text-gray-300">
                Após fazer login na plataforma desejada:
              </p>
              <ol className="list-decimal list-inside text-gray-300 space-y-2 mt-2">
                <li>Abra a extensão Cookie Editor</li>
                <li>Clique em "This Site"</li>
                <li>Clique em "Export" e selecione ".JSON"</li>
              </ol>
            </div>
          </div>
        </div>

        <div className="bg-gray-800/50 rounded-lg p-6 space-y-4">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold">3</span>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">Adicionar na Commentify</h3>
              <p className="text-gray-300">
                Cole o JSON exportado no campo "Cookie" ao adicionar um novo perfil na Commentify.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4 mt-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-yellow-500 font-semibold mb-1">Importante</h4>
              <p className="text-gray-300">
                É necessário manter o perfil logado na plataforma para que os cookies não sejam invalidados.
                Recomendamos usar um navegador separado para manter as sessões ativas.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}