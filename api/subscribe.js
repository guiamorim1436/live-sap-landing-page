/**
 * Vercel Serverless Function: /api/subscribe
 * Recebe os dados do lead da Landing Page e envia para a sua plataforma via API.
 */
export default async function handler(req, res) {
  // Configuração de CORS (caso acesse de outro domínio)
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Método não permitido' });
  }

  try {
    const {
      name,
      email,
      company,
      job_title,
      mobile_phone,
      city,
      cf_momento_profissional,
      source,
      submitted_at
    } = req.body;

    // Validação básica dos campos obrigatórios
    if (!name || !email || !mobile_phone) {
      return res.status(400).json({
        success: false,
        message: 'Campos obrigatórios ausentes: Nome, Email e Celular são necessários.'
      });
    }

    const payload = {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      company: (company || '').trim(),
      job_title: (job_title || '').trim(),
      phone: mobile_phone.replace(/\D/g, ''),
      phone_formatted: mobile_phone,
      city: (city || '').trim(),
      momento_profissional: cf_momento_profissional || '',
      source: source || 'Landing Page Live SAP',
      submitted_at: submitted_at || new Date().toISOString()
    };

    console.log('[LEAD RECEBIDO]:', payload);

    // URL da API da sua plataforma configurada nas variáveis de ambiente da Vercel
    const PLATFORM_API_URL = process.env.PLATFORM_API_URL;
    const PLATFORM_API_KEY = process.env.PLATFORM_API_KEY;

    if (PLATFORM_API_URL) {
      const apiResponse = await fetch(PLATFORM_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(PLATFORM_API_KEY ? { 'Authorization': `Bearer ${PLATFORM_API_KEY}` } : {})
        },
        body: JSON.stringify(payload)
      });

      if (!apiResponse.ok) {
        const errorBody = await apiResponse.text();
        console.error('[ERRO PLATAFORMA API]:', errorBody);
        return res.status(502).json({
          success: false,
          message: 'Falha ao integrar com a plataforma externa.'
        });
      }
    } else {
      console.warn('[AVISO] PLATFORM_API_URL não definida. Configure nas variáveis de ambiente da Vercel.');
    }

    // Retorna sucesso para o navegador
    return res.status(200).json({
      success: true,
      message: 'Inscrição realizada com sucesso!',
      // Redireciona para a página de confirmação/agradecimento:
      redirect_url: process.env.REDIRECT_AFTER_SUBMIT_URL || '/obrigado.html'
    });

  } catch (error) {
    console.error('[ERRO /api/subscribe]:', error);
    return res.status(500).json({
      success: false,
      message: 'Erro interno ao processar inscrição.'
    });
  }
}
