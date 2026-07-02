# SGES - Sistema de Gestão Educacional e Social

[![Documentação](https://img.shields.io/badge/docs-GitHub%20Pages-blue.svg)](https://mdsreq-fga-unb.github.io/REQ-2026.1-T01-SGES/)
[![React](https://img.shields.io/badge/frontend-React%20%2B%20Vite-blue)](./frontend)
[![Node.js](https://img.shields.io/badge/backend-Express%20%2B%20TS-green)](./backend)
[![Plataforma](https://img.shields.io/badge/plataforma-Vercel-orange.svg)](https://requisitos-2026-1-sges-equipev.vercel.app)

Repositório de desenvolvimento do **SGES (Sistema de Gestão Educacional e Social)**, desenvolvido no contexto da disciplina de Engenharia de Requisitos 1 (REQ-T1) da Universidade de Brasília (FGA-UnB) para o semestre de 2026.1.

O SGES tem como objetivo prover uma solução robusta e integrada para o gerenciamento de turmas, alunos, frequências, agendamentos e atividades com impacto educacional e social.

---

## 🌐 Link da Plataforma & Credenciais de Teste

A aplicação está publicada e pode ser acessada pelo link:
*   **Plataforma (Vercel):** [https://requisitos-2026-1-sges-equipev.vercel.app](https://requisitos-2026-1-sges-equipev.vercel.app)

Para acessar o painel administrativo da plataforma com o perfil de **Professor**, utilize as seguintes credenciais de teste:
*   **E-mail:** `adminsges@gmail.com`
*   **Senha:** `sges@2026`

---

## 📂 Estrutura do Repositório

O projeto é organizado como um monorrepósito contendo os seguintes módulos principais:

*   **[`/backend`](./backend)**: API RESTful construída em Node.js com Express e TypeScript. Utiliza TypeORM para mapeamento objeto-relacional com banco de dados PostgreSQL e BullMQ para processamento de filas em background.
*   **[`/frontend`](./frontend)**: Interface web responsiva desenvolvida em React + Vite com TypeScript, estilizada com Tailwind CSS. Gerenciamento de estado feito através do Zustand e consultas/sincronização via React Query.
*   **[`/docs`](./docs)**: Documentação completa do projeto utilizando MkDocs (Tema Material), cobrindo Casos de Uso (CSUs), visão de produto, matrizes de rastreabilidade e atas de reuniões.

---

## 🛠️ Tecnologias Principais

### Backend
*   **Runtime & Linguagem:** Node.js, TypeScript, TSX
*   **Framework Web:** Express
*   **Banco de Dados & ORM:** PostgreSQL, TypeORM
*   **Mensageria & Filas:** BullMQ (com Redis)
*   **Validação & Logging:** Zod, Pino Logger
*   **Testes:** Vitest, Supertest

### Frontend
*   **Linguagem & Bundler:** TypeScript, Vite
*   **Biblioteca UI:** React, Tailwind CSS, Lucide React
*   **Gerenciamento de Estado:** Zustand
*   **Comunicação API:** Axios, React Query (TanStack Query)
*   **Testes:** Vitest, MSW (Mock Service Worker)

### Documentação
*   **Gerador de site estático:** MkDocs
*   **Tema:** Material para MkDocs
*   **Extensões:** Mermaid.js (diagramas), MathJax (expressões matemáticas)

---

## 🚀 Como Executar Localmente

### 1. Documentação (MkDocs)

Para rodar o servidor de documentação local:

1.  Crie o ambiente virtual do Python:
    ```bash
    python3 -m venv venv
    ```
2.  Ative o ambiente virtual:
    *   No Linux/macOS: `source venv/bin/activate`
    *   No Windows: `venv\Scripts\activate`
3.  Instale as dependências:
    ```bash
    pip install -r requirements.txt
    ```
4.  Inicie o servidor MkDocs:
    ```bash
    ./docs_start.sh
    ```
    Ou manualmente: `mkdocs serve`
5.  Acesse `http://127.0.0.1:8000` no seu navegador.

---

### 2. Backend

1.  Navegue até a pasta backend:
    ```bash
    cd backend
    ```
2.  Instale as dependências:
    ```bash
    npm install
    ```
3.  Suba os serviços locais (PostgreSQL/Redis) utilizando o Docker Compose:
    ```bash
    docker compose up -d
    ```
4.  Configure as variáveis de ambiente baseando-se no arquivo `./env/.env.dev` ou crie `./env/.env.local` se necessário.
5.  Execute as migrações do banco de dados e os seeds (dados iniciais):
    ```bash
    # Executar migrações
    npm run dev
    # (Opcional) Executar o seed
    npm run seed
    ```
6.  Execute em modo de desenvolvimento:
    ```bash
    npm run dev
    ```
7.  Para rodar os testes unitários/integração:
    ```bash
    npm run test
    ```

---

### 3. Frontend

1.  Navegue até a pasta frontend:
    ```bash
    cd frontend
    ```
2.  Instale as dependências:
    ```bash
    npm install
    ```
3.  Execute o servidor de desenvolvimento Vite:
    ```bash
    npm run dev
    ```
4.  Abra a URL exibida no terminal (normalmente `http://localhost:5173`).

---

## 🤝 Diretrizes de Contribuição e Commits

Seguimos a convenção de **Conventional Commits** e todas as mensagens de commit devem ser escritas em **Português Brasileiro**, utilizando prefixos apropriados:

*   `feat:` para novas funcionalidades (ex: `feat: adiciona validação de conflito de horários`)
*   `fix:` para correções de bugs (ex: `fix: corrige formatação da data de presença`)
*   `docs:` para documentação (ex: `docs: atualiza README com instruções de desenvolvimento`)
*   `style:` alterações de formatação de código (ex: `style: formata arquivos com prettier`)
*   `refactor:` refatorações no código sem alteração de comportamento
*   `test:` adição ou correção de testes
