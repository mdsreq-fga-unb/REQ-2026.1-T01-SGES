# Engenharia de Requisitos: Especificação de Casos de Uso e Rastreabilidade

Seguindo as diretrizes metodológicas do framework OpenUP, o escopo funcional do SGES foi completamente modelado por meio de **Casos de Uso (CSU)**. A matriz abaixo estabelece a rastreabilidade estrita entre as capacidades do sistema, os atores principais, os módulos correspondentes e o detalhamento dos fluxos de eventos, exceções e validações do cliente.

## Tabela Geral de Rastreabilidade de Casos de Uso (OpenUP)

| CSU | Caso de Uso | RF | CP | OE | RNF | Prioridade | MVP? | Status | Evidência | PR / Teste | Validação |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :---: | :--- | :--- | :--- | :--- |
| **CSU01** | [Autenticar Usuário](./lista_trabalhos/csu01/fluxo.md) | RF01 | CP1 | OE1, OE3 | RNF02, RNF06 | Prioridade 1 (Q1) | **Sim** | Implementado | [Vídeo](./validacao_unidade_3.md) | [Testes](https://github.com/mdsreq-fga-unb/REQ-2026.1-T01-SGES/pull/71) | Homologado |
| **CSU02** | [Redefinir Senha de Acesso](./lista_trabalhos/csu02/fluxo.md) | RF02 | CP1 | OE1 | RNF01 | Prioridade 1 (Q1) | **Sim** | Implementado | [Vídeo](./validacao_unidade_3.md) | [Testes](https://github.com/mdsreq-fga-unb/REQ-2026.1-T01-SGES/pull/71) | Homologado |
| **CSU03** | [Encerrar Sessão (Logout)](./lista_trabalhos/csu03/fluxo.md) | RF03 | CP1 | OE1 | RNF06 | Prioridade 1 (Q1) | **Sim** | Implementado | [Vídeo](./validacao_unidade_3.md) | [Testes](https://github.com/mdsreq-fga-unb/REQ-2026.1-T01-SGES/pull/71) | Homologado |
| **CSU04** | [Cadastrar Instrutor](./lista_trabalhos/csu04/fluxo.md) | RF04 | CP2 | OE1, OE2 | RNF02 | Prioridade 1 (Q1) | **Sim** | Implementado | [Vídeo](./validacao_unidade_3.md) | [Testes](https://github.com/mdsreq-fga-unb/REQ-2026.1-T01-SGES/pull/71) | Homologado |
| **CSU05** | [Editar Perfil do Instrutor](./lista_trabalhos/csu05/fluxo.md) | RF05 | CP2 | OE1 | RNF02 | Prioridade 1 (Q1) | **Sim** | Em progresso | Pendente | Pendente | Pendente |
| **CSU06** | [Cadastrar Beneficiário](./lista_trabalhos/csu06/fluxo.md) | RF07 | CP3 | OE1, OE4 | RNF01 | Prioridade 1 (Q1) | **Sim** | Implementado | [Vídeo](./validacao_unidade_3.md) | [PR #70](https://github.com/mdsreq-fga-unb/REQ-2026.1-T01-SGES/pull/70) | Homologado |
| **CSU07** | [Editar Dados do Beneficiário](./lista_trabalhos/csu07/fluxo.md) | RF08 | CP3 | OE1 | RNF01 | Prioridade 1 (Q1) | **Sim** | Implementado | [Vídeo](./validacao_unidade_3.md) | [PR #70](https://github.com/mdsreq-fga-unb/REQ-2026.1-T01-SGES/pull/70) | Homologado |
| **CSU08** | [Cadastrar Turma](./lista_trabalhos/csu08/fluxo.md) | RF09 | CP4 | OE2, OE4 | - | Prioridade 1 (Q1) | **Sim** | Implementado | [Vídeo](./validacao_unidade_3.md) | [PR #70](https://github.com/mdsreq-fga-unb/REQ-2026.1-T01-SGES/pull/70) | Homologado |
| **CSU09** | [Matricular Beneficiário](./lista_trabalhos/csu09/fluxo.md) | RF10 | CP4 | OE2, OE4 | - | Prioridade 1 (Q1) | **Sim** | Implementado | [Vídeo](./validacao_unidade_3.md) | [PR #69](https://github.com/mdsreq-fga-unb/REQ-2026.1-T01-SGES/pull/69) | Homologado |
| **CSU10** | [Alterar Registro de Frequência](./lista_trabalhos/csu10/fluxo.md) | RF12 | CP4 | OE2 | - | Prioridade 1 (Q1) | **Sim** | Em progresso | Pendente | Pendente | Pendente |
| **CSU11** | [Registrar Falta Justificada](./lista_trabalhos/csu11/fluxo.md) | RF13 | CP4 | OE2 | - | Prioridade 1 (Q1) | **Sim** | Em progresso | Pendente | Pendente | Pendente |
| **CSU12** | [Registrar Presença em Lote](./lista_trabalhos/csu12/fluxo.md) | RF11 | CP4 | OE2 | RNF04 | Prioridade 2 (Q2) | Não | Em progresso | Pendente | Pendente | Pendente |
| **CSU13** | [Emitir Alertas de Evasão](./lista_trabalhos/csu13/fluxo.md) | RF14 | CP5 | OE2, OE4 | RNF05 | Prioridade 2 (Q2) | Não | Em progresso | Pendente | Pendente | Pendente |
| **CSU14** | [Consultar Histórico do Beneficiário](./lista_trabalhos/csu14/fluxo.md) | RF15 | CP5 | OE2, OE4 | - | Prioridade 2 (Q2) | Não | Em progresso | Pendente | Pendente | Pendente |
| **CSU15** | [Gerar Relatório de Frequência](./lista_trabalhos/csu15/fluxo.md) | RF16 | CP6 | OE3 | RNF03 | Prioridade 2 (Q2) | Não | Em progresso | Pendente | Pendente | Pendente |
| **CSU16** | [Inativar Instrutor](./lista_trabalhos/csu16/fluxo.md) | RF06 | CP2 | OE1 | RNF02 | Prioridade 3 (Q3) | Não | Em progresso | Pendente | Pendente | Pendente |

---

# Matriz de Ação e Priorização

Esta seção consolida a avaliação de todos os Casos de Uso (CSU) mapeados no escopo funcional do SGES, cruzando o **Valor de Negócio** com o **Custo Técnico** para definir a ordem de priorização e o escopo do MVP (Produto Mínimo Viável).

---

## 6.1 Critérios de Priorização

Para a priorização dos itens de trabalho, foram utilizados os seguintes critérios:

*   **VN = Valor de Negócio (1 a 5):** Mede a importância da funcionalidade para o negócio e para os usuários finais da instituição.
*   **CT = Complexidade Técnica (1 a 5):** Mede a dificuldade técnica esperada na implementação da funcionalidade.
*   **EF = Esforço de Implementação (1 a 5):** Mede o tempo e recursos estimados para desenvolver a funcionalidade.

### 1. Pontuação Técnica (PT)
Para representar o "custo técnico" do Caso de Uso, calcula-se a média aritmética entre a complexidade e o esforço de implementação:

$$PT = \frac{CT + EF}{2}$$

Dessa forma, a pontuação técnica continua na mesma escala de 1 a 5.

### 2. Índice de Prioridade (IP)
Para comparar de forma objetiva o valor de negócio contra o custo técnico, calcula-se o Índice de Prioridade:

$$IP = \frac{VN}{PT}$$

Quanto maior o IP, maior a prioridade do Caso de Uso.

*   **IP alto (IP ≥ 1,50):** Muito valor de negócio para baixo/médio custo técnico.
*   **IP médio (1,00 ≤ IP < 1,49):** Equilíbrio razoável entre valor e custo técnico.
*   **IP baixo (IP < 1,00):** Pouco valor de negócio para alto custo técnico.

---

## 6.2 Matriz de Priorização

A partir do cruzamento entre Valor de Negócio (VN) e Pontuação Técnica (PT), os CSUs são classificadas em quatro quadrantes de decisão:

*   **Q1 – Alto valor / Baixa carga técnica:** CSUs com alto valor de negócio (VN ≥ 4) e baixo custo técnico (PT ≤ 2,5). Devem ser desenvolvidos primeiro (Prioridade 1) e compõem o escopo básico do **MVP**.
*   **Q2 – Alto valor / Alta carga técnica:** CSUs com alto valor de negócio (VN ≥ 4) e alto custo técnico (PT ≥ 3). Exigem planejamento cuidadoso (Prioridade 2).
*   **Q3 – Baixo valor / Baixa carga técnica:** CSUs com baixo valor de negócio (VN ≤ 3) e baixo custo técnico (PT ≤ 2,5). São secundários e podem ser feitos após os prioritários (Prioridade 3).
*   **Q4 – Baixo valor / Alta carga técnica:** CSUs com baixo valor de negócio (VN ≤ 3) e alto custo técnico (PT ≥ 3). Devem ser reconsiderados ou postergados.

---

## 6.3 Priorização dos Itens de Trabalho e MVP

A tabela a seguir apresenta todos os Casos de Uso priorizados com base nos critérios estabelecidos, ordenada pelo identificador do Caso de Uso (CSU):

| CSU | Descrição | VN | CT | EF | PT | IP | Quadrante | Prioridade sugerida |
| :---: | :--- | :---: | :---: | :---: | :---: | :---: | :--- | :--- |
| **CSU01** | Autenticar usuário | 5 | 2 | 2 | 2 | 2,5 | Q1 Alto valor / Baixa carga técnica | Prioridade 1 |
| **CSU02** | Redefinir senha de acesso | 4 | 2 | 2 | 2 | 2 | Q1 Alto valor / Baixa carga técnica | Prioridade 1 |
| **CSU03** | Encerrar sessão | 5 | 1 | 1 | 1 | 5 | Q1 Alto valor / Baixa carga técnica | Prioridade 1 |
| **CSU04** | Cadastrar instrutor | 5 | 2 | 2 | 2 | 2,5 | Q1 Alto valor / Baixa carga técnica | Prioridade 1 |
| **CSU05** | Editar perfil do instrutor | 4 | 2 | 2 | 2 | 2 | Q1 Alto valor / Baixa carga técnica | Prioridade 1 |
| **CSU06** | Cadastrar beneficiário | 5 | 2 | 2 | 2 | 2,5 | Q1 Alto valor / Baixa carga técnica | Prioridade 1 |
| **CSU07** | Editar dados do beneficiário | 4 | 2 | 2 | 2 | 2 | Q1 Alto valor / Baixa carga técnica | Prioridade 1 |
| **CSU08** | Cadastrar turma | 5 | 2 | 2 | 2 | 2,5 | Q1 Alto valor / Baixa carga técnica | Prioridade 1 |
| **CSU09** | Matricular beneficiário | 5 | 2 | 2 | 2 | 2,5 | Q1 Alto valor / Baixa carga técnica | Prioridade 1 |
| **CSU10** | Alterar registro de frequência | 4 | 2 | 2 | 2 | 2 | Q1 Alto valor / Baixa carga técnica | Prioridade 1 |
| **CSU11** | Registrar falta justificada | 4 | 2 | 2 | 2 | 2 | Q1 Alto valor / Baixa carga técnica | Prioridade 1 |
| **CSU12** | Registrar presença em lote | 5 | 3 | 3 | 3 | 1,67 | Q2 Alto valor / Alta carga técnica | Prioridade 2 |
| **CSU13** | Emitir alerta de evasão | 5 | 4 | 4 | 4 | 1,25 | Q2 Alto valor / Alta carga técnica | Prioridade 2 |
| **CSU14** | Consultar histórico do beneficiário | 4 | 3 | 3 | 3 | 1,33 | Q2 Alto valor / Alta carga técnica | Prioridade 2 |
| **CSU15** | Gerar relatório de frequência | 4 | 3 | 3 | 3 | 1,33 | Q2 Alto valor / Alta carga técnica | Prioridade 2 |
| **CSU16** | Inativar instrutor | 3 | 1 | 2 | 1,5 | 2 | Q3 Baixo valor / Baixa carga técnica | Prioridade 3 |

> **Nota:** Definimos como escopo do **MVP (Produto Mínimo Viável)** todas os Casos de Uso classificados como **Prioridade 1** (Q1), garantindo a entrega do core funcional do sistema com menor complexidade de desenvolvimento. As demais funcionalidades (Prioridade 2 e 3) serão implementadas em Iterações subsequentes.
