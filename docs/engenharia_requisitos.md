# 4. Engenharia de Requisitos

## 4.1. Atividades e Técnicas da ER

## Processo de Engenharia de Requisitos

### Elicitação e Descoberta

A etapa de elicitação e descoberta tem como objetivo compreender o contexto da instituição, identificar problemas, necessidades, restrições e expectativas dos stakeholders.

### Entrevistas

Serão utilizadas entrevistas com gestores e voluntários da instituição para compreender os processos atuais, dificuldades operacionais e necessidades relacionadas ao gerenciamento das informações.

### Observação

A equipe realizará observação dos processos utilizados pela instituição, analisando como ocorre atualmente o registro de frequência, organização de turmas e acompanhamento dos alunos.

---

## Análise e Consenso

Essa etapa busca refinar os requisitos elicitados, reduzir ambiguidades e alinhar diferentes perspectivas dos stakeholders.

### Entrevistas de Refinamento

Reuniões com os stakeholders serão realizadas para esclarecer dúvidas, validar necessidades e alinhar expectativas sobre a solução.

### Análise de Domínio

Será utilizada para compreender regras de negócio, identificar inconsistências e estruturar melhor os requisitos do sistema.

### Priorização de Requisitos

Os requisitos serão analisados e priorizados conforme impacto, viabilidade e valor para a instituição.

### Feedback Contínuo

O feedback dos stakeholders será utilizado constantemente para validar decisões e ajustar requisitos ao longo do projeto.

---

## Declaração de Requisitos

A declaração de requisitos tem como objetivo documentar os requisitos de forma clara, organizada e rastreável.

### Documento de Visão

Será utilizado para consolidar os objetivos do projeto, stakeholders, oportunidades, desafios e visão geral da solução.

### Itens de Trabalho

Os requisitos serão organizados em Itens de Trabalho priorizados, permitindo gerenciamento contínuo das funcionalidades.

---

## Representação de Requisitos

A representação auxilia na comunicação e validação das funcionalidades junto aos stakeholders.

### Interfaces da Aplicação (MVP)

A validação de layout, usabilidade e fluxos de navegação foi realizada diretamente por meio de demonstrações das telas da própria aplicação (MVP) em reuniões de alinhamento com os stakeholders. Os requisitos visuais (como a paleta de cores e o estilo simplificado) foram definidos em reuniões de requisitos e validados diretamente com o software em funcionamento.

### Diagramas

Diagramas de processos, arquitetura e modelagem auxiliarão na compreensão técnica e organizacional da solução.

### Fluxos de Navegação

Representarão como os usuários irão interagir com o sistema.

---

# Verificação e Validação de Requisitos

Essa etapa busca garantir que os requisitos estejam corretos, completos, consistentes e alinhados às necessidades da instituição.


## Definition of Ready (DoR)

O DoR delimita quando um requisito está preparado para ser trabalhado, permitindo que a equipe avalie o trabalho antes do início do desenvolvimento.

Para que um requisito seja considerado **Ready**, os seguintes critérios devem ser atendidos:

* O requisito está representado por um **Caso de Uso**?

* O requisito possui **Critérios de Aceitação** definidos?

* O requisito está no mesmo grau de abstração dos demais requisitos?

* O requisito foi estimado (uso de valores objetivos)?

* O requisito agrega valor e está associado a algum dos objetivos específicos da solução?

* As dependências do requisito estão devidamente mapeadas(caso existam)?

## Definition of Done (DoD)

O DoD define os critérios necessários para que uma funcionalidade seja considerada completa, demonstrando a **qualidade do requisito produzido**.

Para que uma tarefa ou **Caso de Uso** seja considerado **Done**, todas as perguntas a seguir devem ser respondidas afirmativamente.

### Entrega de Valor

* O trabalho realizado entrega um incremento funcional e observável ao produto?

* A entrega está claramente rastreada à sua origem, contendo referência ao Caso de Uso, requisito ou objetivo específico correspondente?

### Cobertura dos Requisitos

* Todos os cenários descritos nos critérios de aceite foram implementados e podem ser demonstrados?

* Os cenários contemplam fluxos de sucesso, falha e alternativas de execução?

### Qualidade de Testes

* Foram criados os testes unitários necessários para a funcionalidade desenvolvida?

* Os fluxos principais foram validados **manualmente** em um ambiente de teste, confirmando o comportamento esperado?

### Revisão por Pares (Code Review)

* O Pull Request (PR) foi revisado e aprovado por pelo menos um outro integrante da equipe?

* A revisão de código validou os seguintes critérios essenciais:

    * **Conformidade:** o código segue os padrões estabelecidos pela equipe?

    * **Lógica:** a implementação atende corretamente aos requisitos definidos?

    * **Legibilidade:** o código está claro, bem nomeado e de fácil manutenção?

    * **Segurança:** não há exposição de dados sensíveis, como senhas ou tokens?

### Documentação

* A **documentação técnica** foi atualizada de acordo com as alterações realizadas no sistema.

---

## Práticas de Qualidade e Alinhamento

### Revisão em Pares

Os requisitos e implementações serão revisados entre os membros da equipe para garantir maior qualidade e consistência.

### Feedback com Stakeholders

As entregas serão apresentadas ao cliente ao final das iterações para validação contínua da solução.

### Análise de Viabilidade

Será realizada para garantir que os requisitos sejam compatíveis com a realidade técnica e operacional da instituição.

---

# Organização e Atualização dos Requisitos

Essa etapa busca manter os requisitos organizados, atualizados e priorizados ao longo do projeto.


### Itens de Trabalho

Será continuamente atualizado conforme feedbacks e evolução do projeto.

---

## 4.2. OpenUP e Tabela

| Fases do Processo         | Atividades ER                                                                                                      | Prática                                                                                                                                                          | Técnica                                                                                           | Resultado Esperado                                                                                                                                                                                                                                                                 |
| :------------------------ | :----------------------------------------------------------------------------------------------------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------ | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Concepção (Inception)** | • Elicitação e Descoberta<br>• Declaração                                                                          | • Reuniões com stakeholders e Observação dos processos atuais<br>• Definição do escopo inicial                                                                   | • Entrevistas e Observação<br>• Documento de Visão                                                | • Levantamento inicial das necessidades e problemas da instituição<br>• Definição dos objetivos e escopo                                                                                                                                                                           |
| **Elaboração**            | • Análise e Consenso<br>• Elicitação de requisitos<br>• Representação de Requisitos<br>• Organização de Requisitos | • Refinamento de Requisitos<br>• Análise de Dependências<br>• Modelagem de Casos de Uso<br>• Priorização dos Itens de Trabalho                                               | • Análise de domínio<br>• Discussões em Equipe e Análise de Tarefas<br>• Detalhamento de Requisitos<br>• MoSCoW | • Redução de ambiguidades e inconsistências, Requisitos mais consistentes<br>• Definição técnica da centralização dos dados e foco na usabilidade para voluntários.<br>• Validação conceitual das funcionalidades e regras de negócio do MVP<br>• Definição das funcionalidades prioritárias do MVP |
| **Construção**            | • Refinamento<br>• Verificação e Validação<br>• Organização e Atualização                                          | • Desenvolvimento incremental<br>• Revisão de requisitos implementados<br>• Atualização contínua dos Itens de Trabalho e Ajuste dos requisitos conforme evolução do projeto | • Definition of Done (DoD)<br>• Feedback contínuo                               | • Implementação contínua das funcionalidades<br>• Funcionalidades validadas e prontas para entrega                                                                                                                                                                                 |
| **Transição**             | • Validação final                                                                                                  | • Demonstração para stakeholders                                                                                                                                 | • Feedback                                                                                        | • Aprovação e validação da solução                                                                                                                                                                                                                                                 |
