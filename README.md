# 💸 Invest_IA

**Sistema Inteligente de Gestão Financeira Pessoal**

Uma aplicação web moderna para registro e análise de finanças pessoais com sugestões inteligentes baseadas em IA.

---

## 🎯 O Projeto

O **Invest_IA** permite que você:
- 📊 Registre receitas e despesas
- 💰 Acompanhe seu saldo em tempo real
- 🎯 Defina metas financeiras
- 🤖 Receba sugestões inteligentes com IA
- 📈 Analise padrões de consumo

---

## 🧠 Diferencial

A IA não é apenas um chat. Ela analisa seu comportamento financeiro para sugerir economia, identificar gastos excessivos e recomendar investimentos baseados no seu perfil.

> ⚠️ As sugestões são informativas, não constituem aconselhamento financeiro profissional.

---

## 📦 Estrutura

```
invest_ia/
├─ frontend/          # React + Vite + Tailwind
├─ backend/           # Node.js + Express + Prisma
├─ docs/              # Documentação
└─ README.md
```

Veja os READMEs em `frontend/docs` e `backend/docs` para detalhes completos.

---

## ⚙️ Tecnologias

**Frontend:** React, Vite, Tailwind CSS

**Backend:** Node.js, Express, Prisma, MySQL

**Autenticação:** JWT, OTP por email, bcrypt

**Arquitetura:** MVC com Services, DTOs, Repositories

---

## 🚀 Quick Start

### Pré-requisitos
- Node.js v18+
- MySQL/MariaDB
- Git

### Setup

```bash
# Clone e entre na pasta
git clone https://github.com/SEU-USUARIO/invest_ia.git
cd invest_ia

# Backend
cd backend
cp .env.example .env
npm install
npx prisma generate
npm run dev  # Roda em http://localhost:3000

# Frontend (em outro terminal)
cd frontend
cp .env.example .env
npm install
npm run dev  # Roda em http://localhost:5173
```

---

## 🔐 Variáveis de Ambiente

### Backend (.env)
```env
PORT=3000
NODE_ENV=development
DATABASE_URL="mysql://root:password@localhost:3306/invest_ia"
JWT_SECRET=sua_chave_secreta_aqui
JWT_EXPIRE=7d
EMAIL_FROM=seu_email@gmail.com
GEMINI_API_KEY=sua_chave_api_gemini
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:3000/api
VITE_NODE_ENV=development
```

> Nunca comite arquivos .env - use .env.example como template

---

## ✨ Funcionalidades

✅ Autenticação com JWT e OTP  
✅ Dashboard financeiro  
✅ Registro de receitas e despesas  
✅ Perfil financeiro do usuário  
✅ Rate limiting e segurança  
🔄 Sugestões com IA (em desenvolvimento)  
⏳ Relatórios e análises (planejado)  
⏳ Gráficos e charts (planejado)  

---

## � Documentação

Para informações detalhadas, consulte:

- [Backend Docs](./backend/docs) - Arquitetura, autenticação, validators
- [Frontend Docs](./frontend/docs) - Componentes, serviços
- [Database Schema](./backend/docs/DATABASE_SCHEMA.md)
- [API Routes](./backend/src/routes)

---

## 🌟 Status

🚧 **Em desenvolvimento ativo** (~70% pronto)

---

## 🤝 Contribuindo

1. Fork o repositório
2. Crie uma branch (`git checkout -b feature/sua-feature`)
3. Commit suas mudanças (`git commit -m 'Add sua-feature'`)
4. Push para a branch (`git push origin feature/sua-feature`)
5. Abra um Pull Request

---

## 📄 Licença

MIT License - veja [LICENSE](./LICENSE) para detalhes

---

## 👨‍💻 Autor

**Afonso B. Plentz**

- GitHub: [AfonsoPTZ](https://github.com/AfonsoPTZ)
- LinkedIn: [afonsoplentz](https://www.linkedin.com/in/afonsoplentz/)
