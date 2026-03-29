# Email Verification with OTP

## Overview

Sistema de verificação de email com código OTP (One-Time Password) de 6 dígitos. Integrado ao fluxo de cadastro do usuário.

**Fluxo:**
1. Usuário se registra em `/register`
2. Backend cria usuário e envia OTP por email
3. Usuário verifica código em `/verify-otp`
4. Email marcado como verificado
5. Redireciona para `/financial-profile`

## Características

- **OTP:** 6 dígitos aleatórios
- **Expiração:** 5 minutos
- **Max Tentativas:** 3
- **Bloqueio:** 15 minutos após exceder tentativas
- **Segurança:** OTP hasheado com bcrypt (não em plaintext)

## Backend

### Controllers (`src/controllers/authController.js`)
```javascript
class AuthController {
  registerWithOtp()    // POST /auth/register-with-otp
  verifyEmail()        // POST /auth/verify-email
  resendOtp()          // POST /auth/resend-otp
}
```

### Services (`src/services/authService.js`)
- `registerUserWithOtp()` - Orquestra registro + OTP
- `verifyEmailWithOtp()` - Valida OTP + marca como verificado
- `resendOtpCode()` - Regenera e resenvia

### Sub-services (`src/services/auth/`)
- `register.service.js` - Criação usuário + OTP
- `otp.service.js` - Gerenciamento OTP
- `email.service.js` - Integração Nodemailer
- `emailVerification.service.js` - Orquestração de fluxo
- `verifyEmail.service.js` - Confirmação de email

### Repository (`src/repositories/userRepository.js`)
- `updateOtp(userId, {otpCodeHash, otpExpiresAt, otpAttempts})`
- `incrementOtpAttempts(userId)`
- `updateEmailVerification(userId, verified)`

### Database
```sql
ALTER TABLE usuarios ADD COLUMN (
  email_verificado BOOLEAN NOT NULL DEFAULT FALSE,
  otp_codigo_hash VARCHAR(255) NULL,
  otp_expira_em DATETIME NULL,
  otp_tentativas INT NOT NULL DEFAULT 0
);
```

## Frontend

### Pages (`src/pages/auth/`)

**Register.jsx**
- Form: Nome, Email, CPF, Phone, Password
- Validação de entrada
- Chama POST `/auth/register-with-otp`
- Redireciona para `/verify-otp`

**VerifyOtp.jsx**
- 6 inputs (1 dígito cada)
- Auto-focus entre campos
- Backspace para voltar
- Timer 30s para reenvio
- Chama POST `/auth/verify-email`
- Redireciona para `/financial-profile`

### Styles (`src/styles/forms.css`)
- `.otp-input-group` - Container
- `.otp-input` - Estilo dos inputs
- `.otp-footer` - Área de reenvio

## API

**POST /api/auth/register-with-otp**
```json
{
  "name": "João",
  "email": "joao@test.com",
  "cpf": "12345678901",
  "phone": "11999999999",
  "password": "Senha@123"
}
```

**POST /api/auth/verify-email**
```json
{
  "userId": 1,
  "otpCode": "123456"
}
```

**POST /api/auth/resend-otp**
```json
{
  "userId": 1
}
```

## Configuration

### `.env`
```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=seu-email@gmail.com
EMAIL_PASSWORD=sua-app-password

FRONTEND_URL=http://localhost:5173

OTP_EXPIRATION_MINUTES=5
OTP_MAX_ATTEMPTS=3
OTP_LOCKOUT_MINUTES=15
```

## Testing

1. Registrar: http://localhost:5173/register
2. Preencher formulário
3. Verificar email
4. Digitar 6 dígitos
5. Confirmar redirecionamento
