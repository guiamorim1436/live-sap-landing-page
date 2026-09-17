# Landing Page - Live SAP S/4HANA (Clone 100% Fiel)

Clone da página [live-sap-03-10-26](https://lp.trainning.com.br/live-sap-03-10-26), otimizado para deploy imediato no **Vercel** e integração direta com a sua plataforma via API.

---

## 🚀 Como Subir para o GitHub e Vercel

### 1. Inicializar o Git e Enviar para o GitHub

No terminal, dentro da pasta `live-sap-landing-page`:

```bash
cd "live-sap-landing-page"
git init
git add .
git commit -m "feat: landing page clone 100% fiel com vercel serverless function"
git branch -M main
git remote add origin https://github.com/SEU_USUARIO/SEU_REPOSITORIO.git
git push -u origin main
```

### 2. Conectar na Vercel

1. Acesse [vercel.com](https://vercel.com) e clique em **"Add New..." > "Project"**.
2. Importe o repositório que acabou de criar no GitHub.
3. Em **Environment Variables**, adicione:
   - `PLATFORM_API_URL`: A URL do endpoint da sua plataforma que receberá o lead (ex: `https://sua-plataforma.com/api/leads`).
   - `PLATFORM_API_KEY`: (Opcional) Token de autorização Bearer para autenticar o envio.
   - `REDIRECT_AFTER_SUBMIT_URL`: (Opcional) URL para onde redirecionar o usuário após o cadastro.
4. Clique em **Deploy**. Pronto! Sua página estará no ar com HTTPS e CDN global.

---

## 📡 Payload Enviado para sua API

Quando o usuário clica em **"QUERO PARTICIPAR GRATUITAMENTE"**, o front-end envia um `POST /api/subscribe`, que processa no back-end da Vercel e dispara o seguinte JSON para a sua plataforma (`PLATFORM_API_URL`):

```json
{
  "name": "Nome do Usuário",
  "email": "usuario@empresa.com",
  "company": "Nome da Empresa",
  "job_title": "Cargo",
  "phone": "11999999999",
  "phone_formatted": "(11) 99999-9999",
  "city": "São Paulo",
  "momento_profissional": "Transição de carreira",
  "source": "Landing Page Live SAP",
  "submitted_at": "2026-09-17T18:45:00.000Z"
}
```

---

## 📁 Estrutura de Arquivos

- `index.html`: Landing page completa com design 100% fiel, cronômetro regressivo e máscara de telefone.
- `api/subscribe.js`: Vercel Serverless Function que recebe os dados do formulário e encaminha para a sua API sem expor chaves no front-end.
- `package.json`: Configurações do projeto.
- `.env.example`: Exemplo de configuração de variáveis de ambiente.
