/**
 * Vercel Serverless Function: /api/subscribe
 * Envia o lead para o CRM da Trainning: https://api.trainning.com.br/functions/v1/api-leads
 * Header: x-api-key: <CRM_API_KEY>
 */
export default async function handler(req, res) {
  // CORS Headers
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
      utm_source,
      utm_medium,
      utm_campaign,
      utm_content,
      utm_term
    } = req.body;

    // Validação básica dos campos obrigatórios
    if (!name || !email || !mobile_phone) {
      return res.status(400).json({
        success: false,
        message: 'Campos obrigatórios ausentes: Nome, Email e Celular são necessários.'
      });
    }

    // Telefone sanitizado (apenas números)
    const cleanPhone = mobile_phone.replace(/\D/g, '');

    // Payload estruturado exatamente conforme as especificações do CRM
    const crmPayload = {
      nome: name.trim(),
      email: email.trim().toLowerCase(),
      telefone: cleanPhone,
      empresa: (company || '').trim(),
      cargo: (job_title || '').trim(),
      sede_cidade: (city || '').trim(),
      seniority: (cf_momento_profissional || '').trim(),
      curso_interesse: "SAP S/4HANA",
      course_format: "Mentorado (Ao Vivo)",
      form_name: "Inscrição Live SAP S/4HANA",
      origem: utm_source || "landing-page",
      tags: [
        "live-sap",
        "landing-page",
        ...(utm_campaign ? [utm_campaign] : [])
      ],
      utm_source: utm_source || undefined,
      utm_medium: utm_medium || undefined,
      utm_campaign: utm_campaign || undefined,
      utm_content: utm_content || undefined,
      utm_term: utm_term || undefined
    };

    console.log('[ENVIANDO LEAD PARA CRM]:', JSON.stringify(crmPayload, null, 2));

    const CRM_URL = process.env.CRM_API_URL || 'https://api.trainning.com.br/functions/v1/api-leads';
    const CRM_API_KEY = process.env.CRM_API_KEY || process.env.PLATFORM_API_KEY || '';

    const headers = {
      'Content-Type': 'application/json'
    };

    if (CRM_API_KEY) {
      headers['x-api-key'] = CRM_API_KEY;
    }

    const apiResponse = await fetch(CRM_URL, {
      method: 'POST',
      headers,
      body: JSON.stringify(crmPayload)
    });

    const responseText = await apiResponse.text();

    if (!apiResponse.ok) {
      console.error('[ERRO API CRM]:', apiResponse.status, responseText);
      return res.status(502).json({
        success: false,
        message: `Falha na integração com o CRM: ${apiResponse.statusText}`,
        detail: responseText
      });
    }

    console.log('[RESPOSTA CRM SUCESSO]:', responseText);

    // Retorna sucesso para o navegador com URL de redirecionamento
    return res.status(200).json({
      success: true,
      message: 'Inscrição realizada e lead enviado com sucesso!',
      redirect_url: process.env.REDIRECT_AFTER_SUBMIT_URL || '/obrigado.html'
    });

  } catch (error) {
    console.error('[ERRO /api/subscribe]:', error);
    return res.status(500).json({
      success: false,
      message: 'Erro interno ao processar inscrição.',
      error: error.message
    });
  }
}
