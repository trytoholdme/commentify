import axios from 'axios';
import { Profile } from './types';

export async function getPostIdFromUrl(postUrl: string, proxy?: string): Promise<string> {
  try {
    if (!postUrl.match(/https:\/\/(www\.)?instagram\.com\/p\/[\w-]+\/?/)) {
      throw new Error('URL inválida. Use uma URL de post do Instagram (ex: https://www.instagram.com/p/xyz123)');
    }

    console.log(`🔍 Acessando a página da publicação: ${postUrl}`);
    
    const proxyUrl = postUrl.replace('https://www.instagram.com', '/instagram');
    
    const config: any = {
      headers: {
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Safari/537.36',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      },
      maxRedirects: 5,
      timeout: 30000, // 30 second timeout
      validateStatus: (status: number) => status >= 200 && status < 300
    };

    if (proxy) {
      try {
        const [protocol, auth] = proxy.split('://');
        const [credentials, host] = auth.split('@');
        const [username, password] = credentials.split(':');
        const [hostname, port] = host.split(':');

        config.proxy = {
          protocol: protocol,
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

    const response = await axios.get(proxyUrl, config);

    if (!response.data) {
      throw new Error('Página não retornou conteúdo');
    }

    // Try multiple patterns to find the post ID
    const patterns = [
      /"media_id":"(\d+)"/,
      /instagram:\/\/media\?id=(\d+)/,
      /"id":"(\d+)"/,
      /data\-media\-id="(\d+)"/
    ];

    for (const pattern of patterns) {
      const match = response.data.match(pattern);
      if (match && match[1]) {
        console.log(`✅ ID da publicação encontrado: ${match[1]}`);
        return match[1];
      }
    }

    // Check if the page indicates the post doesn't exist
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
    
    // Se for um erro que já tratamos, repassa a mensagem
    if (error instanceof Error) {
      throw error;
    }

    // Erro genérico
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

    if (!sessionid || !csrftoken) {
      throw new Error('Cookies sessionid ou csrftoken não encontrados. Verifique o cookie do perfil.');
    }

    const cookieString = cookies.map((c: any) => `${c.name}=${c.value}`).join('; ');

    const config: any = {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'X-CSRFToken': csrftoken,
        'X-Instagram-AJAX': '1019667473',
        'X-Requested-With': 'XMLHttpRequest',
        'X-Instagram-Cookies': cookieString,
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Safari/537.36',
        'Origin': 'https://www.instagram.com',
        'Referer': postUrl
      },
      timeout: 30000,
      validateStatus: (status: number) => status >= 200 && status < 300
    };

    if (profile.proxy) {
      try {
        const [protocol, auth] = profile.proxy.split('://');
        const [credentials, host] = auth.split('@');
        const [username, password] = credentials.split(':');
        const [hostname, port] = host.split(':');

        config.proxy = {
          protocol: protocol,
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

    const response = await axios.post(
      `/instagram/api/v1/web/comments/${postId}/add/`,
      `comment_text=${encodeURIComponent(comment)}`,
      config
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

    // Se for um erro que já tratamos, repassa a mensagem
    if (error instanceof Error) {
      console.error(`❌ Erro na conta ${profile.name}:`, error.message);
      throw error;
    }

    // Erro genérico
    console.error(`❌ Erro na conta ${profile.name}:`, error);
    throw new Error('Erro inesperado ao comentar. Tente novamente.');
  }
}