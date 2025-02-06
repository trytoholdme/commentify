import type { VercelRequest, VercelResponse } from '@vercel/node';
import axios from 'axios';

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
  'Upgrade-Insecure-Requests': '1',
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', '*');
    res.setHeader('Access-Control-Max-Age', '86400');
    return res.status(200).end();
  }

  try {
    if (!req.body || !req.body.url) {
      return res.status(400).json({ error: 'URL is required' });
    }

    const { url, method = 'GET', data, headers = {} } = req.body;

    // Validate URL
    if (!url.startsWith('https://www.instagram.com')) {
      return res.status(400).json({ error: 'Invalid URL' });
    }

    // Prepare request headers
    const requestHeaders = {
      ...defaultHeaders,
      ...headers,
      'Host': 'www.instagram.com',
      'Origin': 'https://www.instagram.com',
      'Referer': 'https://www.instagram.com/'
    };

    // Make request to Instagram
    const response = await axios({
      url,
      method,
      data,
      headers: requestHeaders,
      maxRedirects: 5,
      timeout: 30000,
      validateStatus: () => true,
      decompress: true
    });

    // Set response headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', '*');
    res.setHeader('Access-Control-Expose-Headers', 'set-cookie');
    
    // Preserve Instagram cookies
    if (response.headers['set-cookie']) {
      res.setHeader('set-cookie', response.headers['set-cookie']);
    }

    // Return response
    return res.status(response.status).json({
      data: response.data,
      headers: response.headers
    });
  } catch (error: any) {
    console.error('Proxy error:', error.message);
    
    // Return detailed error for debugging
    return res.status(500).json({ 
      error: 'Internal Server Error',
      message: error.message,
      details: error.response?.data || error.stack
    });
  }
}
