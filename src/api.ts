import axios from 'axios';
import { Profile } from './types';

// Configuração global do axios
axios.defaults.timeout = 30000;
axios.defaults.maxRedirects = 5;

// Headers padrão para todas as requisições
const defaultHeaders = {
  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
  'Accept-Language': 'en-US,en;q=0.9',
  'Accept-Encoding': 'gzip, deflate, br',
  'Cache-Control': 'no-cache',
  'Pragma': 'no-cache',
  'Sec-Fetch-Dest': 'document',
  'Sec-Fetch-Mode': 'navigate',
  'Sec-Fetch-Site': 'none',
  'Sec-Fetch-User': '?1',
  'Upgrade-Insecure-Requests': '1'
};

const makeRequest = async (url: string, options: any = {}) => {
  const isProduction = process.env.NODE_ENV === 'production';
  
  if (isProduction) {
    const response = await axios.post('/api/proxy', {
      url,
      method: options.method || 'GET',
      data: options.data,
      headers: options.headers
    });
    return response.data;
  }
  
  return axios(url, options);
};

export async function getPostIdFromUrl(postUrl: string, proxy?: string): Promise<string> {
  try {
    if (!postUrl.match(/https:\/\/(www\.)?instagram\.com\/p\/[\w-]+\/?/)) {
      throw new Error('URL inválida. Use uma URL de post do Instagram (ex: https://www.instagram.com/p/xyz123)');
    }

    console.log(`🔍 Acessando a página da publicação: ${postUrl}`);
    
    const config: any = {
      headers: {
        ...defaultHeaders,
        'Host': 'www.instagram.com'
      },
      validateStatus: (status: number) => status >= 200 && status < 300
    };

    if (proxy) {
      try {
        const [protocol, auth] = proxy.split('://');
        const [credentials, host] = auth.split('@');
        const [username, password] = credentials.split(':');
        const [hostname, port] = host.split(':');

        config.proxy = {
          protocol,
          host: hostname,
          port: parseInt(port),
          auth: { username, password }
        };
      } catch (error) {
        throw new Error('Formato de proxy inválido. Use: protocol://username:password@host:port');
      }
    }

    const response = await makeRequest(postUrl, config);

    if (!response.data) {
      throw new Error('Página não retornou conteúdo');
    }

    const patterns = [
      /"media_id":"(\d+)"/,
      /instagram:\/\/media\?id=(\d+)/,
      /"id":"(\d+)"/,
      /data\-media\-id="(\d+)"/,
      /instagram:\/\/media\?id=(\d+)/,
      /"id":"(\d+)_(\d+)"/
    ];

    for (const pattern of patterns) {
      const match = response.data.match(pattern);
      if (match && match[1]) {
        console.log(`✅ ID da publicação encontrado: ${match[1]}`);
        return match[1];
      }
    }

    if (response.data.includes('Página não encontrada') || 
        response.data.includes('Page Not Found') ||
        response.data.includes('Sorry, this page isn')) {
      throw new Error('Publicação não encontrada. Verifique se a URL está correta e se a publicação existe.');
    }

    throw new Error('ID da publicação não encontrado. A publicação pode estar indisponível ou ser privada.');
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.code === 'ECONNABORTED') {
        throw new Error('Tempo limite excedido ao acessar a publicação. Tente novamente.');
      }
      if (error.response) {
        if (error.response.status === 404) {
          throw new Error('Publicação não encontrada. Verifique se a URL está correta.');
        }
        if (error.response.status === 429) {
          throw new Error('Muitas requisições. Aguarde alguns minutos e tente novamente.');
        }
        throw new Error(`Erro ${error.response.status} ao acessar a publicação. Tente novamente mais tarde.`);
      }
      if (error.request) {
        throw new Error('Não foi possível conectar ao Instagram. Verifique sua conexão.');
      }
    }
    
    if (error instanceof Error) {
      throw error;
    }

    console.error('❌ Erro ao obter ID da publicação:', error);
    throw new Error('Erro inesperado ao obter ID da publicação. Tente novamente.');
  }
}

interface PostComment {
  profile: Profile;
  postUrl: string;
  comment: string;
}

export async function comentarInstagram({ profile, postUrl, comment }: PostComment): Promise<boolean> {
  try {
    if (!comment.trim()) {
      throw new Error('O comentário não pode estar vazio');
    }

    console.log(`🔍 Obtendo ID da publicação a partir da URL: ${postUrl}`);
    const postId = await getPostIdFromUrl(postUrl, profile.proxy);

    if (!postId) {
      throw new Error('Falha ao obter o ID da publicação');
    }

    console.log(`✅ ID da publicação extraído: ${postId}`);

    let cookies;
    try {
      cookies = JSON.parse(profile.cookie);
      if (!Array.isArray(cookies)) {
        throw new Error('Formato de cookie inválido');
      }
    } catch (error) {
      throw new Error('Cookie inválido. Certifique-se que está no formato JSON correto.');
    }

    const sessionid = cookies.find((c: any) => c.name === 'sessionid')?.value;
    const csrftoken = cookies.find((c: any) => c.name === 'csrftoken')?.value;
    const mid = cookies.find((c: any) => c.name === 'mid')?.value;
    const ig_did = cookies.find((c: any) => c.name === 'ig_did')?.value;

    if (!sessionid || !csrftoken) {
      throw new Error('Cookies sessionid ou csrftoken não encontrados. Verifique o cookie do perfil.');
    }

    const cookieString = cookies.map((c: any) => `${c.name}=${c.value}`).join('; ');

    const config: any = {
      headers: {
        ...defaultHeaders,
        'Content-Type': 'application/x-www-form-urlencoded',
        'X-CSRFToken': csrftoken,
        'X-Instagram-AJAX': '1',
        'X-IG-App-ID': '936619743392459',
        'X-IG-WWW-Claim': '0',
        'X-Requested-With': 'XMLHttpRequest',
        'Cookie': cookieString,
        'Origin': 'https://www.instagram.com',
        'Referer': postUrl,
        'Host': 'www.instagram.com'
      },
      validateStatus: (status: number) => status >= 200 && status < 300
    };

    if (profile.proxy) {
      try {
        const [protocol, auth] = profile.proxy.split('://');
        const [credentials, host] = auth.split('@');
        const [username, password] = credentials.split(':');
        const [hostname, port] = host.split(':');

        config.proxy = {
          protocol,
          host: hostname,
          port: parseInt(port),
          auth: {
            username,
            password
          }
        };
      } catch (error) {
        throw new Error('Formato de proxy inválido. Use: protocol://username:password@host:port');
      }
    }

    // Adicionar delay aleatório para evitar detecção
    await new Promise(resolve => setTimeout(resolve, Math.random() * 2000 + 1000));

    const response = await makeRequest(
      `https://www.instagram.com/api/v1/web/comments/${postId}/add/`,
      {
        method: 'POST',
        data: `comment_text=${encodeURIComponent(comment)}`,
        headers: config.headers,
        proxy: config.proxy
      }
    );

    if (response.data.status === 'ok' || response.status === 200) {
      console.log(`✅ Comentário enviado com sucesso pelo perfil ${profile.name}: "${comment}"`);
      return true;
    }

    throw new Error('Resposta inesperada do Instagram. Tente novamente.');
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.code === 'ECONNABORTED') {
        throw new Error('Tempo limite excedido ao enviar comentário. Tente novamente.');
      }
      if (error.response) {
        if (error.response.status === 404) {
          throw new Error('Publicação não encontrada. Verifique se a URL está correta.');
        }
        if (error.response.status === 429) {
          throw new Error('Muitas requisições. Aguarde alguns minutos e tente novamente.');
        }
        if (error.response.status === 403) {
          throw new Error('Acesso negado. Verifique se o cookie do perfil está válido.');
        }
        throw new Error(`Erro ${error.response.status} ao comentar. Tente novamente mais tarde.`);
      }
      if (error.request) {
        throw new Error('Não foi possível conectar ao Instagram. Verifique sua conexão.');
      }
    }

    if (error instanceof Error) {
      console.error(`❌ Erro na conta ${profile.name}:`, error.message);
      throw error;
    }

    console.error(`❌ Erro na conta ${profile.name}:`, error);
    throw new Error('Erro inesperado ao comentar. Tente novamente.');
  }
}