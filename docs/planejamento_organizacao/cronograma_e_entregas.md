# Cronograma e Entregas (Ciclo de Vida OpenUP)

Este cronograma reflete o ciclo de vida iterativo e incremental do framework **OpenUP** adaptado para o projeto SGES. O desenvolvimento de código inicia-se imediatamente após a validação dos requisitos do MVP na Unidade 2.

### Visão Geral dos Marcos (Milestones) do Projeto
* **Concepção (Inception):** Alinhamento de escopo, objetivos do negócio e viabilidade.
* **Elaboração (Elaboration):** Detalhamento de requisitos do MVP, redução de riscos técnicos e definição da linha de base da arquitetura.
* **Construção (Construction):** Desenvolvimento em larga escala de todas as características funcionais do produto e testes integrados.
* **Transição (Transition):** Validação final com utilizadores, ajustes de performance, documentação de apoio e implantação em produção.

---

## Tabela de Planejamento de Fases e Iterações

## Tabela de Cronograma e Planejamento

| Fase / Iteração | Período | Escopo (Casos de Uso / Entregas) | Engenharia de Requisitos | Status |
| :--- | :---: | :--- | :--- | :---: |
| **Concepção**<br>Iteração 1 *(Unidade 1)* | 17/03 a 16/04 | • [Solução Proposta](solucao_proposta.md)<br>• [Contexto e Cenário Atual](cenario_atual_e_negocio.md) | [Técnicas Utilizadas](../paginas_de_evidencia/evidencias_concepcao.md) | Concluída |
| **Elaboração**<br>Iteração 1 *(Unidade 2)* | 17/04 a 19/05 | • [Itens de Trabalho Priorizados](matriz_de_acao_e_priorizacao.md)<br>• [Documentação de Arquitetura](arquitetura_do_produto.md) | [Técnicas Utilizadas](../paginas_de_evidencia/evidencias_elaboracao.md) | Concluída |
| **Construção**<br>Iteração 1 *(Unidade 3)* | 20/05 a 11/06 | • Mapeamento do Core (Casos de Uso):<br>  [CSU01](lista_trabalhos/csu01/fluxo.md) \| [CSU02](lista_trabalhos/csu02/fluxo.md) \| [CSU03](lista_trabalhos/csu03/fluxo.md) \| [CSU04](lista_trabalhos/csu04/fluxo.md)<br>  [CSU05](lista_trabalhos/csu05/fluxo.md) \| [CSU06](lista_trabalhos/csu06/fluxo.md) \| [CSU07](lista_trabalhos/csu07/fluxo.md) \| [CSU08](lista_trabalhos/csu08/fluxo.md)<br>  [CSU09](lista_trabalhos/csu09/fluxo.md) \| [CSU10](lista_trabalhos/csu10/fluxo.md) \| [CSU11](lista_trabalhos/csu11/fluxo.md) | [Técnicas Utilizadas](../paginas_de_evidencia/evidencias_construcao_iteracao1.md) | Concluída |
| **Construção**<br>Iteração 2 *(Unidade 4)* | 12/06 a 01/07 | • Mapeamento Operacional (Casos de Uso):<br>  [CSU12](lista_trabalhos/csu12/fluxo.md) \| [CSU13](lista_trabalhos/csu13/fluxo.md) \| [CSU14](lista_trabalhos/csu14/fluxo.md) \| [CSU15](lista_trabalhos/csu15/fluxo.md)<br>  [CSU16](lista_trabalhos/csu16/fluxo.md) | [Técnicas Utilizadas](../paginas_de_evidencia/evidencias_construcao_iteracao2.md) | Em andamento |
| **Transição**<br>Iteração 1 *(Unidade 4 - Final)* | 02/07 a 09/07 | • [Sistema Implantado em Produção](link)<br>• [Guias e Manuais de Utilização](link)<br>• [Documentação Revisada do Projeto](link) | [Técnicas Utilizadas](../paginas_de_evidencia/evidencias_transicao.md) | Não iniciado |

---

## Plano de Iteração — Construção Iteração 2 *(Unidade 4 — Parte 1)*

---

### Objetivos da Iteração

Implementar os módulos de controle de frequência e acompanhamento de alunos, entregando ao final do ciclo as seguintes capacidades funcionais:

- Registro de presença em lote na data de ocorrência da aula (CSU12 / RF11)
- Registro de falta justificada com impacto nos indicadores de evasão (CSU11 / RF13)
- Correção retroativa de registros de presença com justificativa, dentro do prazo de 72 horas (CSU10 / RF12)
- Consulta do histórico consolidado de presenças, alertas e matrículas do aluno (CSU14 / RF15)
- Geração e exportação de relatório de frequência em formato CSV (CSU15 / RF16)

---

### Itens de Trabalho

| ID    | Caso de Uso                               | Ator         | Descrição                                                                                         | Critérios de Aceitação                                                                                                                                                                           |
|-------|-------------------------------------------|--------------|---------------------------------------------------------------------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| CSU12 | Registrar Presença em Lote                | Instrutor    | Lançar a presença ou falta de todos os matriculados de forma massiva, exclusivamente na data da aula. | CA11-01: Presença/falta salva simultaneamente para todos os alunos da lista.<br>CA11-02: Lançamento bloqueado fora da data de ocorrência da aula.                                               |
| CSU10 | Alterar Registro de Frequência            | Gestor       | Corrigir um registro de presença retroativamente com justificativa, dentro do prazo de 72 horas.  | CA12-01: Edição permitida em até 72h após a aula.<br>CA12-02: Bloqueio automático após o prazo.<br>CA12-03: Justificativa obrigatória para qualquer alteração.                                 |
| CSU11 | Registrar Falta Justificada               | Instrutor    | Lançar uma ausência como justificada (ex.: atestado) para preservar a precisão dos indicadores.   | CA13-01: Status da falta registrado como "justificada".<br>CA13-02: Falta justificada não contabiliza negativamente para os indicadores de evasão.                                              |
| CSU14 | Consultar Histórico do Aluno              | Todos        | Exibir a linha do tempo centralizada de presenças, alertas e matrículas vinculadas ao aluno.      | CA15-01: Exibição clara e consolidada de todas as presenças.<br>CA15-02: Histórico de alertas de risco emitidos.<br>CA15-03: Matrículas anteriores e atuais listadas em ordem cronológica.     |
| CSU15 | Gerar Relatório de Frequência             | Gestor       | Consolidar e exportar em CSV os percentuais de engajamento segmentados por oficina ou mês.        | CA16-01: Exportação em formato CSV.<br>CA16-02: Dados correspondem estritamente aos filtros aplicados.<br>CA16-03: Colunas e delimitadores formatados adequadamente para leitura externa.       |

---

### Critérios de Avaliação da Iteração

A iteração será considerada concluída com sucesso quando:

- Todos os critérios de aceitação dos casos de uso CSU12, CSU10, CSU11, CSU14 e CSU15 puderem ser demonstrados em ambiente de simulação com instrutores voluntários.
- O mecanismo de bloqueio de edição após 72 horas estiver funcionando e validado.
- O relatório de frequência exportado em CSV estiver com os dados filtrados e formatados corretamente.
- Todos os Pull Requests tiverem sido revisados e aprovados por ao menos um integrante da equipe.