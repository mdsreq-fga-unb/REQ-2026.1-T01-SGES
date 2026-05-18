# 6. Matriz de Ação e Priorização

Esta seção consolida a avaliação de todos os requisitos mapeados, cruzando o **Valor de Negócio (1 a 5)** com a **Complexidade Técnica (1 a 5)** para determinar o quadrante de ação estratégico na esteira de desenvolvimento.

## 6.1. Racional de Pontuação e Rastreabilidade

Para garantir que a atribuição de notas não seja baseada em empirismo, a priorização segue uma heurística estrita de rastreabilidade, avaliando o impacto real para a instituição e o esforço de engenharia.

### A. Rastreabilidade do Valor de Negócio (Eixo Y)

No contexto do Terceiro Setor, o "Valor" é mensurado pela mitigação de riscos institucionais e pelo impacto social direto, dividindo-se em três pesos centrais:

- **Peso Legal (Risco Extremo - Notas 4 a 5):** Requisitos inegociáveis para a sobrevivência e adequação da instituição. Lidar com famílias vulneráveis exige rigor com a LGPD. (Exemplo: _RNF01 - Criptografia Sensível_ e _RF07 - Cadastrar família assistida_ recebem nota 5).
- **Peso da Missão (Impacto Social - Notas 4 a 5):** Funcionalidades que resolvem o problema motivador do software: o combate à evasão. (Exemplo: _RF17 - Emitir alerta de evasão_ recebe nota 5, pois atua diretamente na retenção do beneficiário).
- **Peso de Conforto Operacional (Nice-to-have - Notas 1 a 3):** Funcionalidades secundárias que geram conforto ou caminhos alternativos de gestão, mas não salvam vidas ou previnem processos legais. (Exemplo: _RF23 - Exportar matriz em PDF_ recebe nota 3, pois a gestão já possui acesso aos dados em tela).

### B. Análise de Complexidade Técnica (Eixo X)

A complexidade reflete o esforço arquitetural e as horas de desenvolvimento necessárias para a implementação:

- **Nível 1 e 2 (Trivial / Padrão de Mercado):** Operações elementares de CRUD (Criar, Ler, Atualizar, Deletar) ou funcionalidades amplamente resolvidas por _frameworks_ modernos. (Exemplo: _RF01 - Autenticar usuário_ recebe nota 2, dada a maturidade das bibliotecas de autenticação atuais).
- **Nível 3 (Lógica Relacional Moderada):** Requisitos que exigem cruzamento de múltiplas tabelas e validações de regras de negócio antes da persistência de dados. (Exemplo: _RF13 - Matricular beneficiário_, que exige validação de vagas, choque de horários e status ativo).
- **Nível 4 e 5 (Processamento Assíncrono / Arquitetura Complexa):** Funcionalidades que fogem do fluxo linear de tela, exigindo _background jobs_, operações _offline-first_ ou varreduras massivas no banco de dados. (Exemplo: _RF17 - Emitir alerta de evasão_ recebe nota 4, pois exige que o servidor processe o histórico de todos os alunos diariamente buscando padrões temporais complexos).

---

## 6.2. Regra dos Quadrantes de Ação

- **1º Quadrante (Vitórias Rápidas):** Valor [4-5] e Complexidade [1-2]. Representam funcionalidades de alta prioridade e baixo esforço técnico. Devem ser **executadas imediatamente**, pois entregam alto impacto social e legal com baixo custo de desenvolvimento.
- **2º Quadrante (Projetos Estratégicos):** Valor [4-5] e Complexidade [3-5]. Alta prioridade e alto esforço. São essenciais para o núcleo da instituição (ex: relatórios, alertas), mas exigem **planejamento rigoroso** e estruturado, podendo ser divididos em fases de entrega.
- **3º Quadrante (Apoio Operacional):** Valor [1-3] e Complexidade [1-2]. Baixa prioridade e baixo esforço. Trazem melhorias de usabilidade ou gestão secundária, devendo ser **desenvolvidos conforme a disponibilidade** da equipe de voluntários de TI.
- **4º Quadrante (Reavaliar / Descartar):** Valor [1-3] e Complexidade [3-5]. Baixa prioridade e alto esforço. São candidatos à **despriorização**, pois o esforço técnico exigido não compensa o retorno imediato para a instituição. _(Nota: Atribuído também a itens de valor e complexidade medianos [3] que não são críticos para o lançamento)._

---

## 6.3. Priorização de Requisitos Funcionais (RF)

| ID       | Requisito (Ação)                    | Valor (1-5) | Complexidade (1-5) | Quadrante de Ação |
| :------- | :---------------------------------- | :---------: | :----------------: | :---------------- |
| **RF01** | Autenticar usuário                  |      5      |         2          | **1º Quadrante**  |
| **RF02** | Redefinir senha de acesso           |      4      |         2          | **1º Quadrante**  |
| **RF03** | Encerrar sessão                     |      5      |         1          | **1º Quadrante**  |
| **RF04** | Cadastrar instrutor                 |      4      |         2          | **1º Quadrante**  |
| **RF05** | Editar perfil do instrutor          |      3      |         1          | **3º Quadrante**  |
| **RF06** | Inativar instrutor                  |      4      |         2          | **1º Quadrante**  |
| **RF07** | Cadastrar família assistida         |      5      |         2          | **1º Quadrante**  |
| **RF08** | Editar dados da família             |      4      |         2          | **1º Quadrante**  |
| **RF09** | Inativar cadastro familiar          |      4      |         2          | **1º Quadrante**  |
| **RF10** | Cadastrar beneficiário              |      5      |         2          | **1º Quadrante**  |
| **RF11** | Editar dados do beneficiário        |      3      |         2          | **3º Quadrante**  |
| **RF12** | Cadastrar Turma                     |      4      |         2          | **1º Quadrante**  |
| **RF13** | Matricular beneficiário             |      4      |         3          | **2º Quadrante**  |
| **RF14** | Registrar presença em lote          |      5      |         2          | **1º Quadrante**  |
| **RF15** | Alterar registro de frequência      |      4      |         3          | **2º Quadrante**  |
| **RF16** | Registrar falta justificada         |      4      |         2          | **1º Quadrante**  |
| **RF17** | Emitir alerta de evasão             |      5      |         4          | **2º Quadrante**  |
| **RF18** | Consultar histórico do beneficiário |      4      |         3          | **2º Quadrante**  |
| **RF19** | Registrar intervenção social        |      5      |         2          | **1º Quadrante**  |
| **RF20** | Encerrar alerta de evasão           |      4      |         3          | **2º Quadrante**  |
| **RF21** | Gerar relatório de frequência       |      4      |         3          | **2º Quadrante**  |
| **RF22** | Gerar relatório de impacto social   |      5      |         4          | **2º Quadrante**  |
| **RF23** | Exportar matriz de dados em PDF     |      3      |         3          | **4º Quadrante**  |

---

## 6.4. Priorização de Requisitos Não Funcionais (RNF)

| ID        | Nome do Requisito           | Valor (1-5) | Complexidade (1-5) | Quadrante de Ação |
| :-------- | :-------------------------- | :---------: | :----------------: | :---------------- |
| **RNF01** | Criptografia Sensível       |      5      |         4          | **2º Quadrante**  |
| **RNF02** | Trilha de Auditoria         |      5      |         3          | **2º Quadrante**  |
| **RNF03** | Anonimização em Exportações |      5      |         3          | **2º Quadrante**  |
| **RNF04** | Operação Offline (Chamada)  |      4      |         4          | **2º Quadrante**  |
| **RNF05** | Curva de Aprendizado        |      4      |         2          | **1º Quadrante**  |
| **RNF06** | Processamento de Gatilhos   |      4      |         3          | **2º Quadrante**  |
| **RNF07** | Desempenho Analítico        |      3      |         3          | **4º Quadrante**  |
| **RNF08** | Carga Limite de Formulários |      4      |         2          | **1º Quadrante**  |
| **RNF09** | Concorrência de Matrículas  |      3      |         3          | **4º Quadrante**  |
| **RNF10** | Prevenção de Inatividade    |      5      |         1          | **1º Quadrante**  |
| **RNF11** | Extensibilidade da API      |      4      |         2          | **1º Quadrante**  |
