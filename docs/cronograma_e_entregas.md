# 7. Cronograma e Entregas (Ciclo de Vida OpenUP)

Este cronograma reflete o ciclo de vida iterativo e incremental do framework **OpenUP** adaptado para o projeto SGES. O desenvolvimento de código inicia-se imediatamente após a validação dos requisitos do MVP na Unidade 2.

### Visão Geral dos Marcos (Milestones) do Projeto
* **Concepção (Inception):** Alinhamento de escopo, objetivos do negócio e viabilidade.
* **Elaboração (Elaboration):** Detalhamento de requisitos do MVP, redução de riscos técnicos e definição da linha de base da arquitetura.
* **Construção (Construction):** Desenvolvimento em larga escala de todas as características funcionais do produto e testes integrados.
* **Transição (Transition):** Validação final com utilizadores, ajustes de performance, documentação de apoio e implantação em produção.

---

## Tabela de Planejamento de Fases e Iterações

| Fase / Iteração | Início | Fim | Objetivo da Iteração | Entregas Esperadas (Foco Funcional) | Validação com o Cliente e Marcos |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Concepção**<br>Iteração 1 *(Unidade 1)* | 17/03 | 16/04 | **Entendimento do Problema e Viabilidade**<br>• Alinhamento do problema social e mapeamento de partes interessadas.<br>• *CPs Relacionadas:* Mapeamento geral e entendimento do domínio de negócio. | • Documento de Visão preliminar.<br>• Identificação do Contexto e Cenário Atual. | **Marco de Objetivos do Ciclo de Vida:**<br>Aprovação do escopo macro e concordância sobre os problemas a mitigar.<br>  **Evidência:** [Ata de Validação do Escopo e Objetivos](reuniao_de_alinhamento.md) |
| **Elaboração**<br>Iteração 1 *(Unidade 2)* | 17/04 | 19/05 | **Definição de Diretrizes do Produto e Alinhamento do MVP**<br>• Definição do escopo do MVP.<br>• Elicitação de requisitos funcionais e não-funcionais.<br> | • Itens de Trabalho Priorizados. <br>• Critérios de qualidade e aceitação de entregas. | **Marco da Linha de Base da Arquitetura:**<br>Entrega da Unidade 2 (19/05). Aprovação da proposta conceitual do MVP e estabilização das metas do produto.<br>  **Evidência:** [Ata de Validação de Requisitos](reuniao_de_requisitos.md) |
| **Construção**<br>Iteração 1 *(Unidade 3)* | 20/05 | 11/06 | **Desenvolvimento do Core e Gestão de Pessoas**<br>• Início do desenvolvimento de software após a aprovação do escopo do MVP.<br>• Mapeamento de cenários reais de comportamento do utilizador.<br> | • Mecanismo funcional de acesso seguro e controle de níveis de permissão conforme o perfil.<br>• Painel operacional para gerenciamento e atualização de dados de voluntários.| **Marco de Capacidade Operacional Inicial:**<br>Demonstração prática das rotinas de acesso seguro e telas de cadastro de beneficiários para a diretoria da instituição. Validação do controle de privacidade por parte dos utilizadores. |
| **Construção**<br>Iteração 2 *(Unidade 4 - Parte 1)* | 12/06 | 25/06 | **Desenvolvimento Operacional e Acompanhamento de Alunos**<br>• Estruturação de fluxos de matrículas.<br>• Mapeamento de exceções e tratativas de faltas. | • Módulo completo de relatórios gerenciais consolidados de frequência.<br>| **Marco de Validação de Fluxo Crítico:**<br>Homologação prática com instrutores voluntários em ambiente de simulação. Avaliação da agilidade, clareza e facilidade de uso do registro de chamadas diárias e tratativa de alertas. |
| **Construção**<br>Iteração 3 *(Unidade 4 - Parte 2)* | 26/06 | 09/07 | **Desenvolvimento de Inteligência de Negócio e Sustentabilidade**<br>• Conclusão de todas as funcionalidades previstas.<br>• Assegurar a integridade e a facilidade de evolução da ferramenta. | • Painel com sinalização visual automática de participantes em situação de risco por ausências.<br>| **Marco de Conclusão de Funcionalidades:**<br>Inspeção final do produto com todos os requisitos implementados e testados internamente pela equipe de desenvolvimento. Sistema pronto para entrar em homologação final com o cliente. |
| **Transição**<br>Iteração 1 *(Unidade 4 - Final)* | 10/07 | 16/07 | **Estabilização, Validação Final e Implantação**<br>• Foco em usabilidade final, infraestrutura de produção e manuais. | • Sistema final implantado em ambiente real e acessível para uso diário da instituição.<br>• Guias de apoio, manuais de utilização e relatórios de validação assinados pelo cliente.<br>• Entrega de documentação do projeto totalmente revisada. | **Marco de Liberação do Produto (Product Release):**<br>Aceite final da diretoria da instituição (homologação oficial em produção). Revisão de notas e encerramento oficial das atividades da disciplina. |

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