# 💸 Invest.IA

Sistema de Gestão Financeira com Inteligência Artificial.

---

## 🎯 Sobre o Projeto

O **Invest.IA** é uma aplicação web que permite ao usuário:

* Registrar ganhos e despesas
* Acompanhar saldo financeiro em tempo real
* Gerenciar investimentos e patrimônio
* Definir metas financeiras
* Visualizar resumos mensais
* Receber sugestões inteligentes com base em IA

---

## 🧠 Diferencial

A IA do sistema não funciona apenas como chat.

Ela analisa o comportamento financeiro do usuário para gerar sugestões como:

* Identificação de gastos excessivos
* Padrões de consumo
* Sugestões de economia
* Sugestões de investimento baseadas em perfil e contexto

> ⚠️ A IA fornece sugestões informativas, não aconselhamento financeiro definitivo.

---

## 📦 Estrutura do Projeto

```
invest.ia/
├─ frontend/              # React + Vite
│  ├─ src/
│  │  ├─ components/      # Componentes React
│  │  ├─ pages/           # Páginas da aplicação
│  │  ├─ services/        # Serviços (API calls)
│  │  ├─ assets/          # Imagens, ícones, estilos
│  │  ├─ App.jsx
│  │  └─ main.jsx
│  ├─ public/
│  ├─ .env.example
│  └─ package.json
│
├─ backend/               # Node.js + Express
│  ├─ src/
│  │  ├─ config/          # Configurações
│  │  ├─ controllers/     # Controladores
│  │  ├─ middlewares/     # Middlewares
│  │  ├─ models/          # Modelos de dados
│  │  ├─ repositories/    # Camada de dados
│  │  ├─ routes/          # Rotas da API
│  │  ├─ services/        # Lógica de negócio
│  │  ├─ utils/           # Utilitários
│  │  ├─ validators/      # Validações
│  │  ├─ app.js
│  │  └─ server.js
│  ├─ db/
│  │  ├─ schema.sql       # Estrutura do BD
│  │  └─ seed.sql         # Dados iniciais
│  ├─ .env.example
│  └─ package.json
│
├─ docs/                  # Documentação
├─ .gitignore
└─ README.md
```

---

## ⚙️ Tecnologias

### Frontend
* React
* Vite
* JavaScript

### Backend
* Node.js
* Express
* MySQL/MariaDB

### Outros
* Git & GitHub
* Arquitetura em camadas (Controller, Service, Repository)

---

## 🚀 Como Rodar o Projeto

### 1. Clonar Repositório

```bash
git clone https://github.com/SEU-USUARIO/invest.ia.git
cd invest.ia
```

---

### 2. Rodar Backend

```bash
cd backend
cp .env.example .env
npm install
npm run dev
```

Servidor disponível em: `http://localhost:3000`

---

### 3. Rodar Frontend

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

Aplicação disponível em: `http://localhost:5173`

---

## 🔐 Variáveis de Ambiente

### Backend (`backend/.env`)

```
PORT=3000
NODE_ENV=development

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=invest_ia
DB_PORT=3306
```

---

### Frontend (`frontend/.env`)

```
VITE_API_URL=http://localhost:3000/api
VITE_NODE_ENV=development
```

---

## 📌 Funcionalidades (em desenvolvimento)

* [ ] Cadastro de usuário
* [ ] Registro de ganhos
* [ ] Registro de despesas
* [ ] Cálculo automático de saldo
* [ ] Dashboard financeiro
* [ ] Análise com IA
* [ ] Sugestões inteligentes

---

## 📚 Objetivo

Este projeto foi desenvolvido com foco em:

* Arquitetura de sistemas escalável
* Boas práticas de desenvolvimento
* Integração entre frontend e backend
* Uso de IA em aplicações reais

---

## ⭐ Status

🚧 Em desenvolvimento

---

## 📖 Documentação

Veja a pasta [docs](./docs) para documentação detalhada.

---

## 📋 Requisitos

* Node.js 16+
* npm ou yarn
* MySQL/MariaDB

---

## 👨‍💻 Autor

**Afonso B. Plentz**

* GitHub: https://github.com/AfonsoPTZ
* LinkedIn: https://www.linkedin.com/in/afonsoplentz/

---

## 📄 Licença

MIT
