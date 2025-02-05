import { Instagram, Clock } from 'lucide-react';

interface HeaderProps {
  isAutomating: boolean;
  currentProfile: string | null;
  progress: number;
}

export function Header({ isAutomating, currentProfile, progress }: HeaderProps) {
  return (
    <header className="mb-8">
      <h1 className="text-3xl font-bold text-white flex items-center gap-2">
        <Instagram className="w-8 h-8" />
        Automação Instagram
      </h1>
      {isAutomating && (
        <div className="mt-4">
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <div className="animate-spin">
              <Clock className="w-4 h-4" />
            </div>
            <span>Automação em andamento - Perfil atual: {currentProfile}</span>
          </div>
          <div className="mt-2 w-full bg-gray-700 rounded-full h-2">
            <div 
              className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}
    </header>
  );
}