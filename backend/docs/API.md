# SGES — API Reference

Base URL: `http://localhost:3000`

---

## Autenticação

A API usa **JWT Bearer Token**. Endpoints protegidos exigem o header:

```
Authorization: Bearer <token>
```

Tokens são obtidos via `POST /v1/auth` e expiram em **24 horas**.

### Roles disponíveis

| Role | Permissões |
|------|-----------|
| `ADMIN` | Criar usuários, todas as operações |
| `TEACHER` | Acesso autenticado básico |

---

## Validações globais de senha

| Regra | Valor |
|-------|-------|
| Mínimo de caracteres | 4 |
| Máximo de caracteres | 8 |

Aplicada em: criação de usuário, login e redefinição de senha.

---

## Endpoints

### GET /health

Verifica se a API está no ar.

**Autenticação:** Nenhuma

**Resposta de sucesso:**
```json
200 OK
{ "ok": true }
```

**curl:**
```bash
curl -X GET http://localhost:3000/health
```

---

### POST /v1/auth

Autentica um usuário e retorna um JWT.

**Autenticação:** Nenhuma

**Body:**
```json
{
  "email": "string (email válido)",
  "password": "string (4–8 chars)"
}
```

**Respostas:**

| Status | Situação |
|--------|----------|
| 200 | Credenciais válidas — retorna `{ token }` |
| 400 | Campos inválidos ou fora dos limites |
| 401 | Email não encontrado ou senha incorreta |

**curl — sucesso:**
```bash
curl -X POST http://localhost:3000/v1/auth \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@sges.com",
    "password": "Adm1234"
  }'
```

**curl — credenciais erradas:**
```bash
curl -X POST http://localhost:3000/v1/auth \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@sges.com",
    "password": "errada"
  }'
```

**curl — validação (senha muito curta):**
```bash
curl -X POST http://localhost:3000/v1/auth \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@sges.com",
    "password": "ab"
  }'
```

---

### POST /v1/users

Cria um novo usuário no sistema. Restrito a **ADMIN**.

**Autenticação:** Bearer Token (role `ADMIN`)

**Body:**
```json
{
  "name": "string (mín. 2 chars)",
  "email": "string (email válido)",
  "password": "string (4–8 chars)",
  "registerCode": "string (mín. 1 char) — opcional, gerado automaticamente se omitido",
  "role": "ADMIN | TEACHER"
}
```

> **registerCode** é opcional. Se não for enviado, o sistema gera um código de 6 dígitos baseado no timestamp (`Date.now() % 1_000_000`, com zero-padding). O valor gerado é retornado no body da resposta.

**Respostas:**

| Status | Situação |
|--------|----------|
| 201 | Usuário criado — retorna dados sem `password` |
| 400 | Campos inválidos ou fora dos limites |
| 401 | Token ausente ou inválido |
| 403 | Token válido mas role não é ADMIN |
| 409 | Email já cadastrado |

**curl — criar TEACHER:**
```bash
curl -X POST http://localhost:3000/v1/users \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <ADMIN_TOKEN>" \
  -d '{
    "name": "João Silva",
    "email": "joao@unb.br",
    "password": "Jao1234",
    "registerCode": "202512345",
    "role": "TEACHER"
  }'
```

**curl — criar ADMIN:**
```bash
curl -X POST http://localhost:3000/v1/users \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <ADMIN_TOKEN>" \
  -d '{
    "name": "Maria Admin",
    "email": "maria@unb.br",
    "password": "Mar1234",
    "registerCode": "ADM-002",
    "role": "ADMIN"
  }'
```

**curl — sem token (401):**
```bash
curl -X POST http://localhost:3000/v1/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Teste",
    "email": "teste@unb.br",
    "password": "Test123",
    "registerCode": "TST-001",
    "role": "TEACHER"
  }'
```

**curl — email duplicado (409):**
```bash
curl -X POST http://localhost:3000/v1/users \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <ADMIN_TOKEN>" \
  -d '{
    "name": "Duplicado",
    "email": "joao@unb.br",
    "password": "Dup1234",
    "registerCode": "DUP-001",
    "role": "TEACHER"
  }'
```

---

### POST /v1/auth/forgot-password

Solicita a recuperação de senha. Gera um código de 6 dígitos, salva no banco com validade de **30 minutos** e dispara um email via fila assíncrona (BullMQ).

> **Segurança:** sempre retorna `200` independente de o email existir ou não, para evitar enumeração de usuários.

**Autenticação:** Nenhuma

**Body:**
```json
{
  "email": "string (email válido)"
}
```

**Respostas:**

| Status | Situação |
|--------|----------|
| 200 | Requisição processada (email existe ou não) |
| 400 | Email com formato inválido |

**curl — email existente:**
```bash
curl -X POST http://localhost:3000/v1/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{
    "email": "joao@unb.br"
  }'
```

**curl — email inexistente (ainda retorna 200):**
```bash
curl -X POST http://localhost:3000/v1/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{
    "email": "naoexiste@unb.br"
  }'
```

**curl — email inválido (400):**
```bash
curl -X POST http://localhost:3000/v1/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{
    "email": "nao-e-um-email"
  }'
```

---

### POST /v1/auth/reset-password

Redefine a senha do usuário utilizando o código de 6 dígitos recebido por email. O código é invalidado após uso bem-sucedido.

**Autenticação:** Nenhuma

**Body:**
```json
{
  "email": "string (email válido)",
  "code": "string (exatamente 6 dígitos numéricos)",
  "newPassword": "string (4–8 chars)"
}
```

**Respostas:**

| Status | Situação |
|--------|----------|
| 200 | Senha alterada com sucesso |
| 400 | Campos inválidos (email, código fora do formato, senha fora dos limites) |
| 401 | Código incorreto, expirado ou inexistente |

**curl — sucesso:**
```bash
curl -X POST http://localhost:3000/v1/auth/reset-password \
  -H "Content-Type: application/json" \
  -d '{
    "email": "joao@unb.br",
    "code": "847291",
    "newPassword": "NovaJao1"
  }'
```

**curl — código errado (401):**
```bash
curl -X POST http://localhost:3000/v1/auth/reset-password \
  -H "Content-Type: application/json" \
  -d '{
    "email": "joao@unb.br",
    "code": "000000",
    "newPassword": "NovaJao1"
  }'
```

**curl — código com formato inválido (400):**
```bash
curl -X POST http://localhost:3000/v1/auth/reset-password \
  -H "Content-Type: application/json" \
  -d '{
    "email": "joao@unb.br",
    "code": "123",
    "newPassword": "NovaJao1"
  }'
```

**curl — nova senha fora dos limites (400):**
```bash
curl -X POST http://localhost:3000/v1/auth/reset-password \
  -H "Content-Type: application/json" \
  -d '{
    "email": "joao@unb.br",
    "code": "847291",
    "newPassword": "SenhaMuitoLonga123"
  }'
```

---

## Fluxo completo — Exemplo ponta a ponta

### 1. Login como ADMIN e obter token

```bash
TOKEN=$(curl -s -X POST http://localhost:3000/v1/auth \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@sges.com","password":"Adm1234"}' \
  | jq -r '.token')

echo "Token: $TOKEN"
```

### 2. Criar um professor

```bash
curl -X POST http://localhost:3000/v1/users \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "name": "Prof. Carlos",
    "email": "carlos@unb.br",
    "password": "Car1234",
    "registerCode": "202512001",
    "role": "TEACHER"
  }'
```

### 3. Professor faz login

```bash
TEACHER_TOKEN=$(curl -s -X POST http://localhost:3000/v1/auth \
  -H "Content-Type: application/json" \
  -d '{"email":"carlos@unb.br","password":"Car1234"}' \
  | jq -r '.token')
```

### 4. Professor solicita recuperação de senha

```bash
curl -X POST http://localhost:3000/v1/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{"email":"carlos@unb.br"}'
```

### 5. (Dev) Buscar o código gerado diretamente no banco

```bash
docker exec heartlink.pg psql -U postgres -d req-sges \
  -c "SELECT reset_code, reset_code_expires_at FROM users WHERE email = 'carlos@unb.br';"
```

### 6. Redefinir senha com o código

```bash
curl -X POST http://localhost:3000/v1/auth/reset-password \
  -H "Content-Type: application/json" \
  -d '{
    "email": "carlos@unb.br",
    "code": "<CODIGO_DO_BANCO>",
    "newPassword": "Nova1234"
  }'
```

### 7. Login com a nova senha

```bash
curl -X POST http://localhost:3000/v1/auth \
  -H "Content-Type: application/json" \
  -d '{"email":"carlos@unb.br","password":"Nova1234"}'
```

---

## Respostas de erro — Estrutura

**Erro de validação (400):**
```json
{
  "errors": [
    {
      "code": "too_small",
      "minimum": 4,
      "type": "string",
      "inclusive": true,
      "exact": false,
      "message": "String must contain at least 4 character(s)",
      "path": ["password"]
    }
  ]
}
```

**Erro de negócio (401, 403, 409):**
```json
{
  "message": "Invalid credentials"
}
```

**Erro interno (500):**
```json
{
  "message": "Internal server error"
}
```

---

## Configuração de ambiente (dev)

| Variável | Valor padrão dev |
|----------|-----------------|
| `PORT` | `3000` |
| `POSTGRES_URL` | `postgresql://postgres:postgres@127.0.0.1:5432/req-sges` |
| `JWT_SECRET` | `dev-secret-key` |
| `REDIS_URL` | *(opcional — workers desativados se ausente)* |
| `SMTP_HOST` | *(opcional — emails não enviados se ausente)* |
| `SMTP_PORT` | `587` |
| `SMTP_USER` | *(opcional)* |
| `SMTP_PASS` | *(opcional)* |
| `SMTP_FROM` | *(opcional)* |
