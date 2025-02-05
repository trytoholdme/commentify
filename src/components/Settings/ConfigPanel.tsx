import { Settings, Clock, Send } from 'lucide-react';
import { AlertCircle } from 'lucide-react';

interface ConfigPanelProps {
  postUrl: string;
  intervalSeconds: number;
  isAutomating: boolean;
  onPostUrlChange: (url: string) => void;
  onIntervalChange: (seconds: number) => void;
  onStartAutomation: () => void;
}

export function ConfigPanel({
  postUrl,
  intervalSeconds,
  isAutomating,
  onPostUrlChange,
  onIntervalChange,
  onStartAutomation
}: ConfigPanelProps) {
  return (
    <div className="lg:col-span-1 space-y-6">
      <div className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700">
        <div className="flex items-center gap-2 mb-4 text-indigo-400">
          <Settings className="w-5 h-5" />
          <h2 className="text-xl font-semibold">Configurações</h2>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300">
              URL da Publicação
            </label>
            <div className="mt-1 relative">
              <input
                type="url"
                value={postUrl}
                onChange={(e) => onPostUrlChange(e.target.value)}
                className="block w-full rounded-lg bg-gray-700 border-gray-600 text-white focus:ring-indigo-500 focus:border-indigo-500 pr-10"
                placeholder="https://instagram.com/p/..."
              />
              {postUrl && !postUrl.match(/https:\/\/www\.instagram\.com\/p\/[\w-]+\/?/) && (
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                  <AlertCircle className="h-5 w-5 text-red-500" />
                </div>
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300">
              Intervalo (segundos)
            </label>
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-gray-400" />
              <input
                type="number"
                value={intervalSeconds}
                onChange={(e) => onIntervalChange(Number(e.target.value))}
                min="1"
                className="block w-full rounded-lg bg-gray-700 border-gray-600 text-white focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700">
        <button
          onClick={onStartAutomation}
          disabled={isAutomating}
          className={`w-full inline-flex items-center justify-center px-4 py-3 rounded-lg text-lg font-medium transition-colors ${
            isAutomating
              ? 'bg-gray-600 cursor-not-allowed'
              : 'bg-indigo-600 hover:bg-indigo-700 focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-indigo-500'
          }`}
        >
          {isAutomating ? (
            <>
              <Clock className="w-5 h-5 mr-2 animate-spin" />
              Automação em Andamento...
            </>
          ) : (
            <>
              <Send className="w-5 h-5 mr-2" />
              Iniciar Automação
            </>
          )}
        </button>
      </div>
    </div>
  );
}