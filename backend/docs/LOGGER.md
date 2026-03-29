# 📋 Logger Configuration - Pino Setup

## 🎯 Visão Geral

O sistema de logging foi implementado com **Pino** + **Pino-HTTP**, seguindo os padrões de código existentes no projeto.

### Donde usamos?
- ✅ **Controllers** - Logs de requisições e respostas
- ✅ **Repositories** - Logs de operações no banco de dados
- ✅ **Services** - Logs de lógica de negócio
- ✅ **Middlewares** - Logger HTTP automático e tratamento de erros
- ✅ **Server** - Inicialização do aplicativo

---

## 🏗️ Arquitetura de Logging

### 1️⃣ **logger.js** - Configuração Centralizada
```javascript
const logger = require("../utils/logger");
```

**Modo Development** (NODE_ENV=development):
- Usa `pino-pretty` para output colorido e legível
- Timestamps formatados
- Ignora `pid` e `hostname`

**Modo Production** (NODE_ENV=production):
- Output em JSON (estruturado)
- Otimizado para parsing e armazenamento

### 2️⃣ **logger.middleware.js** - HTTP Request/Response
```javascript
app.use(loggerMiddleware);
```

Registra automaticamente:
- Method (GET, POST, etc)
- URL da requisição
- Status HTTP da resposta
- Tempo de resposta (response time)
- IP do cliente
- User-Agent

Níveis de log por status:
- `4xx` → WARN (cliente)
- `5xx` → ERROR (servidor)
- Sucesso → INFO

### 3️⃣ **error.middleware.js** - Tratamento de Erros
```javascript
app.use(errorMiddleware);
```

Registra erros com contexto completo:
- Stack trace
- Method + URL
- Status code
- Mensagem de erro

Development: Inclui stack trace na resposta  
Production: Oculta stack trace da resposta

### 4️⃣ **notFound.middleware.js** - Rotas 404
```javascript
app.use(notFoundMiddleware);
```

Registra tentativas de acesso a rotas inexistentes:
- Method
- URL
- IP do cliente

---

## 📊 Níveis de Log

| Level | Quando usar | Exemplo |
|-------|-----------|---------|
| `debug` | Detalhes técnicos (queries, buscas) | `logger.debug({ userId }, "Searching user")` |
| `info` | Eventos normais (criação, login, sucesso) | `logger.info({ userId }, "User created")` |
| `warn` | Avisos (dados inválidos, não encontrado) | `logger.warn({ email }, "Email not found")` |
| `error` | Erros da aplicação | `logger.error({ error }, "DB query failed")` |

---

## 🔧 Como Usar nos Arquivos

### Em Controllers
```javascript
const logger = require("../utils/logger");

async function registerController(request, response) {
  try {
    const { email } = request.body;
    
    logger.info({ email }, "Attempting user registration");
    
    const result = await authService.registerUser(...);
    
    logger.info({ userId: result.id }, "User registered successfully");
    
    return response.status(201).json(...);
    
  } catch (error) {
    logger.error({ error: error.message, email }, "Error on registration");
    return response.status(400).json(...);
  }
}
```

### Em Repositories
```javascript
const logger = require("../utils/logger");

async findByEmail(email) {
  try {
    logger.debug({ email }, "Searching user by email");
    
    const [rows] = await pool.query(
      "SELECT * FROM usuarios WHERE email = ?",
      [email]
    );
    
    if (!rows[0]) {
      logger.debug({ email }, "User not found");
      return null;
    }
    
    return rows[0];
    
  } catch (error) {
    logger.error({ error: error.message }, "Error search user");
    throw error;
  }
}
```

### Em Services
```javascript
const logger = require("../utils/logger");

async registerUser(name, email, cpf, phone, password) {
  try {
    logger.info({ email }, "Service: Starting registration");
    
    // validações...
    
    const newUser = await authRepository.create({...});
    
    logger.info({ userId: newUser.id }, "Service: User created");
    
    return newUser;
    
  } catch (error) {
    logger.error({ error: error.message }, "Service: Error registering");
    throw error;
  }
}
```

---

## 📝 Padrão de Logging

### ✅ Inclua Contexto
```javascript
// ✅ Bom - tem contexto
logger.info({ userId, email, action: "update" }, "User updated");

// ❌ Ruim - sem contexto
logger.info("Something happened");
```

### ✅ Use Mensagens Descritivas
```javascript
// ✅ Bom
logger.error({ error: error.message, userId }, "Error updating user profile");

// ❌ Ruim
logger.error("Error");
```

### ✅ Log em Pontos Chave
```javascript
// Controllers: antes/depois de chamar service
// Repositories: antes/depois de queries
// Services: início de operações, validações, sucesso
// Middlewares: requisições, erros
```

---

## 🚀 Output Examples

### Development Mode
```
INFO (user-service): User registered successfully
      userId: "123"
      email: "test@example.com"
      timestamp: 2024-03-29T10:30:45.123Z

GET /api/auth/register 201 - 42ms
```

### Production Mode (JSON)
```json
{
  "level": 30,
  "time": 1711778445123,
  "userId": "123",
  "email": "test@example.com",
  "msg": "User registered successfully"
}
```

---

## 🔍 Visualizando Logs

### No Terminal
```bash
npm run dev
```

**Output colorido em development:**
```
  2024-03-29 10:30:45 [INFO] User registered successfully
    → userId: 123, email: test@example.com
```

### Em Production
Os logs em JSON podem ser piped para ferramentas como:
- **ELK Stack** (Elasticsearch, Logstash, Kibana)
- **Splunk**
- **DataDog**
- **CloudWatch**

---

## ⚙️ Configuração (Variáveis de Ambiente)

No `.env`:
```env
NODE_ENV=development          # development ou production
LOG_LEVEL=info               # debug, info, warn, error
```

**Padrões default:**
```javascript
LOG_LEVEL = process.env.LOG_LEVEL || "info"
NODE_ENV = process.env.NODE_ENV || "development"
```

---

## 📂 Ordem de Middlewares (Importante!)

Em `app.js`:
```javascript
// 1. Logger HTTP (PRIMEIRO!)
app.use(loggerMiddleware);

// 2. CORS, parsers, routes...
app.use(express.json());
app.use("/api/auth", authRoutes);

// 3. Middleware 404 (ANTES de error)
app.use(notFoundMiddleware);

// 4. Error handler (ÚLTIMO!)
app.use(errorMiddleware);
```

**Por quê?**
- Logger precisa capturar todas as requisições
- Error handler precisa vir por último para capturar tudo
- 404 precisa vir antes do error handler

---

## 📌 Resumo das Mudanças

| Arquivo | Mudanças |
|---------|----------|
| `utils/logger.js` | ✅ Criado - Configuração Pino |
| `middlewares/logger.middleware.js` | ✅ Criado - HTTP logging |
| `middlewares/error.middleware.js` | ✅ Criado - Error handler |
| `middlewares/notFound.middleware.js` | ✅ Criado - 404 handler |
| `controllers/authController.js` | ✅ Logs adicionados |
| `controllers/perfilFinanceiroController.js` | ✅ Logs adicionados |
| `repositories/authRepository.js` | ✅ Logs adicionados |
| `repositories/perfilFinanceiroRepository.js` | ✅ Logs adicionados |
| `services/authService.js` | ✅ Logs adicionados |
| `app.js` | ✅ Middlewares integrados |
| `server.js` | ✅ Logger na inicialização |

---

## 🎓 Exemplo de Fluxo Completo

### 1️⃣ Request HTTP chega:
```
POST /api/auth/register
```

### 2️⃣ Logger middleware (HTTP):
```
[INFO] POST /api/auth/register
```

### 3️⃣ Controller registra:
```
[INFO] Attempting user registration (email: test@example.com)
```

### 4️⃣ Service registra:
```
[INFO] Service: Validating user data
[INFO] Service: Creating user in database
```

### 5️⃣ Repository registra:
```
[DEBUG] Checking if email exists
[INFO] Creating new user in DB (userId: 123)
```

### 6️⃣ Controller registra sucesso:
```
[INFO] User registered successfully (userId: 123)
```

### 7️⃣ Logger middleware (Response):
```
[INFO] POST /api/auth/register 201 - 125ms
```

---

## 🐛 Troubleshooting

### Logs não aparecem?
1. Verifique `NODE_ENV` em `.env`
2. Verifique `LOG_LEVEL` em `.env`
3. Verifique se `pino` e `pino-pretty` estão instalados

### Logs aparecem em JSON em development?
```bash
# Reinstale pino-pretty
npm install --save-dev pino-pretty

# Verifique NODE_ENV
echo "NODE_ENV=$NODE_ENV"
```

### Muito verbose?
```env
# Mude LOG_LEVEL em .env
LOG_LEVEL=warn
```

---

**Pronto! 🎉 Sistema de logging implementado e funcionando!**
