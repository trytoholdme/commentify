import { create } from 'zustand';

interface Proxy {
  ip: string;
  port: number;
}

interface ProxyStore {
  proxies: Proxy[];
  currentIndex: number;
  setProxies: (proxies: Proxy[]) => void;
  getNextProxy: () => Proxy | null;
}

// Store para gerenciar os proxies
export const useProxyStore = create<ProxyStore>((set, get) => ({
  proxies: [],
  currentIndex: 0,
  setProxies: (proxies) => set({ proxies, currentIndex: 0 }),
  getNextProxy: () => {
    const { proxies, currentIndex } = get();
    if (proxies.length === 0) return null;
    
    const proxy = proxies[currentIndex];
    set({ currentIndex: (currentIndex + 1) % proxies.length });
    return proxy;
  },
}));

// Função para inicializar os proxies
export function initializeProxies(proxyData: any) {
  const proxies = proxyData.data.map((item: any) => ({
    ip: item.ip,
    port: item.port,
  }));
  
  useProxyStore.getState().setProxies(proxies);
}

// Função para obter a string de configuração do proxy
export function getProxyString(proxy: Proxy | null): string | undefined {
  if (!proxy) return undefined;
  return `http://${proxy.ip}:${proxy.port}`;
}