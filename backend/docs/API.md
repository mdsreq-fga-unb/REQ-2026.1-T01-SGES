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
| `ADMIN` | Criar e deletar usuários, listar usuários, todas as operações |
| `TEACHER` | Acesso autenticado básico |

---

## Validações de senha

| Regra | Valor | Onde se aplica |
|-------|-------|----------------|
| Mínimo de caracteres | 4 | Login (`POST /v1/auth`), redefinição (`POST /v1/auth/reset-password`) |
| Máximo de caracteres | 8 | Login (`POST /v1/auth`), redefinição (`POST /v1/auth/reset-password`) |

> A senha de acesso inicial é **gerada automaticamente** pelo sistema na criação do usuário e enviada por email.

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
curl http://localhost:3000/health
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
  -d '{"email":"admin@sges.com","password":"Adm1234"}'
```

**curl — credenciais erradas (401):**
```bash
curl -X POST http://localhost:3000/v1/auth \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@sges.com","password":"errada"}'
```

**curl — senha muito curta (400):**
```bash
curl -X POST http://localhost:3000/v1/auth \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@sges.com","password":"ab"}'
```

---

### GET /v1/users

Lista usuários paginados (10 por página). Restrito a **ADMIN**.

**Autenticação:** Bearer Token (role `ADMIN`)

**Query params:**

| Param | Tipo | Padrão | Descrição |
|-------|------|--------|-----------|
| `page` | número inteiro ≥ 1 | `1` | Página solicitada |

**Resposta de sucesso (200):**
```json
{
  "data": [
    {
      "id": "uuid",
      "name": "string",
      "email": "string",
      "role": "ADMIN | TEACHER",
      "registerCode": "string",
      "createdAt": "ISO 8601"
    }
  ],
  "page": 1,
  "limit": 10,
  "total": 42,
  "totalPages": 5
}
```

**Respostas:**

| Status | Situação |
|--------|----------|
| 200 | Lista retornada com sucesso |
| 400 | Parâmetro `page` inválido (< 1 ou não numérico) |
| 401 | Token ausente ou inválido |
| 403 | Token válido mas role não é ADMIN |

**curl — página 1 (padrão):**
```bash
curl http://localhost:3000/v1/users \
  -H "Authorization: Bearer <ADMIN_TOKEN>"
```

**curl — página específica:**
```bash
curl "http://localhost:3000/v1/users?page=2" \
  -H "Authorization: Bearer <ADMIN_TOKEN>"
```

**curl — sem token (401):**
```bash
curl http://localhost:3000/v1/users
```

**curl — page inválida (400):**
```bash
curl "http://localhost:3000/v1/users?page=0" \
  -H "Authorization: Bearer <ADMIN_TOKEN>"
```

---

### POST /v1/users

Cria um novo usuário. Restrito a **ADMIN**.

A senha de acesso é **gerada automaticamente** pelo sistema e enviada ao email do usuário. O `registerCode` também é gerado automaticamente pelo sistema.

**Autenticação:** Bearer Token (role `ADMIN`)

**Body:**
```json
{
  "name": "string (mín. 2 chars)",
  "email": "string (email válido)",
  "role": "ADMIN | TEACHER"
}
```

**Respostas:**

| Status | Situação |
|--------|----------|
| 201 | Usuário criado — retorna dados sem `password` |
| 400 | Campos inválidos |
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
    "role": "ADMIN"
  }'
```

**curl — sem token (401):**
```bash
curl -X POST http://localhost:3000/v1/users \
  -H "Content-Type: application/json" \
  -d '{"name":"Teste","email":"teste@unb.br","role":"TEACHER"}'
```

**curl — email duplicado (409):**
```bash
curl -X POST http://localhost:3000/v1/users \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <ADMIN_TOKEN>" \
  -d '{"name":"Duplicado","email":"joao@unb.br","role":"TEACHER"}'
```

---

### DELETE /v1/users/:id

Deleta um usuário pelo ID. Restrito a **ADMIN**.

**Autenticação:** Bearer Token (role `ADMIN`)

**Path param:** `id` — UUID do usuário

**Respostas:**

| Status | Situação |
|--------|----------|
| 204 | Usuário deletado (sem body) |
| 400 | `id` não é um UUID válido |
| 401 | Token ausente ou inválido |
| 403 | Token válido mas role não é ADMIN |
| 404 | Usuário não encontrado |

**curl — sucesso (204):**
```bash
curl -X DELETE http://localhost:3000/v1/users/11111111-1111-1111-1111-111111111111 \
  -H "Authorization: Bearer <ADMIN_TOKEN>"
```

**curl — id inválido (400):**
```bash
curl -X DELETE http://localhost:3000/v1/users/nao-e-uuid \
  -H "Authorization: Bearer <ADMIN_TOKEN>"
```

**curl — usuário inexistente (404):**
```bash
curl -X DELETE http://localhost:3000/v1/users/00000000-0000-0000-0000-000000000000 \
  -H "Authorization: Bearer <ADMIN_TOKEN>"
```

---

### POST /v1/auth/forgot-password

Solicita recuperação de senha. Gera um código de 6 dígitos, salva no banco com validade de **30 minutos** e envia por email.

> **Segurança:** sempre retorna `200` independente de o email existir ou não (evita enumeração de usuários).

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
| 200 | Requisição processada |
| 400 | Email com formato inválido |

**curl — email existente:**
```bash
curl -X POST http://localhost:3000/v1/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{"email":"joao@unb.br"}'
```

**curl — email inexistente (retorna 200 mesmo assim):**
```bash
curl -X POST http://localhost:3000/v1/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{"email":"naoexiste@unb.br"}'
```

**curl — email inválido (400):**
```bash
curl -X POST http://localhost:3000/v1/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{"email":"nao-e-um-email"}'
```

---

### POST /v1/auth/reset-password

Redefine a senha usando o código de 6 dígitos recebido por email. O código é invalidado após o uso.

**Autenticação:** Nenhuma

**Body:**
```json
{
  "email": "string (email válido)",
  "code": "string (exatamente 6 dígitos)",
  "newPassword": "string (4–8 chars)"
}
```

**Respostas:**

| Status | Situação |
|--------|----------|
| 200 | Senha alterada com sucesso |
| 400 | Campos inválidos |
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
  -d '{"email":"joao@unb.br","code":"000000","newPassword":"NovaJao1"}'
```

**curl — código com formato inválido (400):**
```bash
curl -X POST http://localhost:3000/v1/auth/reset-password \
  -H "Content-Type: application/json" \
  -d '{"email":"joao@unb.br","code":"123","newPassword":"NovaJao1"}'
```

**curl — nova senha fora dos limites (400):**
```bash
curl -X POST http://localhost:3000/v1/auth/reset-password \
  -H "Content-Type: application/json" \
  -d '{"email":"joao@unb.br","code":"847291","newPassword":"SenhaMuitoLonga123"}'
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

### 2. Listar usuários existentes

```bash
curl "http://localhost:3000/v1/users?page=1" \
  -H "Authorization: Bearer $TOKEN"
```

### 3. Criar um professor (senha gerada automaticamente e enviada por email)

```bash
curl -X POST http://localhost:3000/v1/users \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "name": "Prof. Carlos",
    "email": "carlos@unb.br",
    "role": "TEACHER"
  }'
```

### 4. Professor faz login com a senha recebida por email

```bash
TEACHER_TOKEN=$(curl -s -X POST http://localhost:3000/v1/auth \
  -H "Content-Type: application/json" \
  -d '{"email":"carlos@unb.br","password":"<SENHA_DO_EMAIL>"}' \
  | jq -r '.token')
```

### 5. Professor solicita recuperação de senha

```bash
curl -X POST http://localhost:3000/v1/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{"email":"carlos@unb.br"}'
```

### 6. (Dev) Buscar o código gerado diretamente no banco

```bash
docker exec req.sges.pg psql -U postgres -d req-sges \
  -c "SELECT reset_code, reset_code_expires_at FROM users WHERE email = 'carlos@unb.br';"
```

### 7. Redefinir senha com o código

```bash
curl -X POST http://localhost:3000/v1/auth/reset-password \
  -H "Content-Type: application/json" \
  -d '{
    "email": "carlos@unb.br",
    "code": "<CODIGO_DO_EMAIL>",
    "newPassword": "Nova1234"
  }'
```

### 8. Login com a nova senha

```bash
curl -X POST http://localhost:3000/v1/auth \
  -H "Content-Type: application/json" \
  -d '{"email":"carlos@unb.br","password":"Nova1234"}'
```

### 9. ADMIN deleta o professor

```bash
# Obter o ID do professor listando usuários
curl "http://localhost:3000/v1/users" -H "Authorization: Bearer $TOKEN" | jq '.data[] | select(.email=="carlos@unb.br") | .id'

# Deletar pelo ID
curl -X DELETE http://localhost:3000/v1/users/<ID_DO_PROFESSOR> \
  -H "Authorization: Bearer $TOKEN"
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

**Erro de negócio (401, 403, 404, 409):**
```json
{
  "message": "User not found"
}
```

**Erro interno (500):**
```json
{
  "message": "Internal server error"
}
```

---

## Resumo de endpoints

| Método | Rota | Auth | Descrição |
|--------|------|------|-----------|
| GET | `/health` | — | Health check |
| POST | `/v1/auth` | — | Login |
| GET | `/v1/users` | ADMIN | Listar usuários (paginado) |
| POST | `/v1/users` | ADMIN | Criar usuário |
| DELETE | `/v1/users/:id` | ADMIN | Deletar usuário |
| POST | `/v1/auth/forgot-password` | — | Solicitar código de reset |
| POST | `/v1/auth/reset-password` | — | Redefinir senha com código |

---

## Configuração de ambiente (dev)

| Variável | Descrição |
|----------|-----------|
| `PORT` | Porta HTTP (padrão: `3000`) |
| `POSTGRES_URL` | URL de conexão com o PostgreSQL |
| `JWT_SECRET` | Chave secreta para assinar JWTs |
| `REDIS_URL` | URL do Redis — habilita workers BullMQ assíncronos |
| `SMTP_HOST` | Host SMTP (ex: `smtp.gmail.com`) |
| `SMTP_PORT` | Porta SMTP (padrão: `587`) |
| `SMTP_USER` | Email de autenticação SMTP (só o endereço, sem display name) |
| `SMTP_PASS` | Gmail App Password gerado em https://myaccount.google.com/apppasswords |
| `SMTP_FROM` | Remetente (pode incluir display name: `SGES <email@gmail.com>`) |
