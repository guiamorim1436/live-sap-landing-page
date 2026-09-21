# Landing Page - Live SAP S/4HANA (Clone 100% Fiel)

Clone da página [live-sap-03-10-26](https://lp.trainning.com.br/live-sap-03-10-26) com:
- Design e tipografia 100% fiéis
- Contador regressivo em tempo real
- Captura e persistência automática de parâmetros UTM (`utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, `utm_term`)
- Envio direto para o CRM via Vercel Serverless Function com autenticação `x-api-key`
- Redirecionamento automático para a página de confirmação/upsell Kiwify (`obrigado.html`)

---

## 📡 Integração com o CRM da Trainning

- **Endpoint:** `https://api.trainning.com.br/functions/v1/api-leads`
- **Header:** `x-api-key: <CRM_API_KEY>`
- **Payload enviado:**

```json
{
  "nome": "João Silva",
  "email": "joao@email.com",
  "telefone": "11999998888",
  "empresa": "Acme Ltda",
  "cargo": "Analista de TI",
  "sede_cidade": "São Paulo",
  "seniority": "Transição de carreira",
  "curso_interesse": "SAP S/4HANA",
  "course_format": "",
  "form_name": "Inscrição Live SAP S/4HANA",
  "origem": "LP Live SAP S/4HANA",
  "observacoes": "Nome: João Silva\nEmpresa: Acme Ltda\nTelefone: 11999998888\nMomento da carreira: Transição de carreira\nCargo: Analista de TI\nCidade: São Paulo",
  "tags": [
    "live-sap",
    "landing-page"
  ],
  "utm_source": "LP Live SAP S/4HANA"
}
```

---

## 🚀 Como Configurar na Vercel

1. No painel do seu projeto na [Vercel](https://vercel.com):
2. Vá em **Settings > Environment Variables** e adicione:
   - `CRM_API_KEY`: A sua API key da Trainning (será enviada no header `x-api-key`).
   - `CRM_API_URL`: *(Opcional, já vem pré-configurado com https://api.trainning.com.br/functions/v1/api-leads)*.
3. Faça o redeploy ou dê um push no repositório.

---

## 🎯 Rastreamento de UTMs

A captura de UTMs funciona de forma persistente:
1. Quando o lead acessa a página com links de campanha (ex: `/?utm_source=facebook&utm_campaign=live-outubro`), os dados são capturados e salvos no `sessionStorage`.
2. Mesmo se o lead navegar ou recarregar a página, as UTMs originais são mantidas e enviadas junto ao cadastro para o CRM.
