# 4. Engenharia de Requisitos

## 4.1. Atividades e Técnicas da ER e ScrumXP

### Planejamento da Release

#### Elicitação e Descoberta

Entrevistas: Realizadas com a Vice-presidente e diretores da instituição para compreender os gargalos causados pela gestão manual em cadernos e planilhas, focando na necessidade de centralização de dados das famílias e alunos.

Brainstorming: Sessões e mensagens com a diretoria para discutir funcionalidades necessárias e o grau de prioridade.

#### Análise e Consenso

Análise de Custo / Benefício: Avaliação da viabilidade financeira e a busca por tecnologias de baixo custo (como nuvem gratuita) para garantir que o sistema seja sustentável para a instituição a longo prazo.

#### Declaração

Temas, Épicos e User Stories: Organização dos requisitos em grandes blocos, como "Gestão de Alunos" e "Controle de Frequência", facilitando a visão macro do impacto social que o SGES trará.

#### Verificação e Validação

Prototipação de Baixa Fidelidade: Validar com a diretoria se a visão macro dos Épicos atende às expectativas de negócio antes de iniciar as sprints.

#### Organização e Atualização

Priorização MoSCoW: Utilizada para definir o MVP por exemplo: o cadastro de beneficiários e a chamada digital são fundamentais (Must have), enquanto dashboards avançados podem ser desenvolvidos em etapas posteriores (Should/Could have).

---

### Planejamento da Sprint

Realizado pela Equipe de Desenvolvimento e o Cliente que define as prioridades.

#### Elicitação e Descoberta

Entrevistas: Conversas e mensagens com os professores voluntários para entender como eles realizam as atividades hoje e quais são as maiores dificuldades.

Análise Documental: Revisão dos modelos de cadernos e planilhas atuais para garantir que todos os campos necessários sejam migrados para o digital.

#### Análise e Consenso

Discussões em Equipe: Reuniões técnicas para definir como centralizar dados dispersos em um único banco de dados sem perder a integridade das informações históricas.

Análise de Tarefas: Detalhamento das atividades necessárias para criar interfaces simples, focando na usabilidade para voluntários com pouca familiaridade tecnológica.

#### Declaração

Critérios de Aceitação: Regras que determinam quando uma história está concluída.

#### Verificação e Validação

Definição de Preparado (DoR): Garante que o requisito está claro, testável e sem ambiguidades antes de entrar no desenvolvimento.

#### Organização e Atualização

Grooming do Backlog: Refinamento contínuo das prioridades junto à Vice-presidente para garantir que o desenvolvimento esteja alinhado às urgências da instituição.

---

### Execução da Sprint

#### Representação

Protótipos e Wireframes: Criação de telas simples e intuitivas para a chamada digital, permitindo que a equipe visualize a facilidade de uso antes de implementar o código final.

#### Verificação e Validação

Critérios de INVEST: Verificação se as histórias de usuário são valiosas e testáveis.

Revisão do Backlog (DEEP): Constante para garantir que o Backlog está detalhado, estimado, emergente e priorizado.

#### Organização e Atualização

Atualização do Quadro de Tarefas: Gestão do progresso dos requisitos durante a execução.

---

### Revisão da Sprint

#### Verificação e Validação

Coleta de Feedback: Demonstração das funcionalidades prontas para os diretores e professores, coletando percepções reais sobre a usabilidade do sistema no dia a dia.

#### Análise e Consenso

Negociação: Planejamento de mudanças baseadas no feedback.

#### Declaração

Ajuste das User Stories: Ajuste das User Stories com base no que foi testado pelos voluntários, priorizando correções que facilitem a adoção do sistema.

---

### Retrospectiva da Sprint

#### Verificação e Validação

Feedback: Avaliação interna da equipe de desenvolvimento sobre o que funcionou na comunicação com a instituição filantrópica e onde houve falhas de entendimento.

## 4.2. ScrumXP e Tabela

| Fases do Processo           | Atividades ER             | Prática                    | Técnica                                         | Resultado Esperado                                                                              |
| :-------------------------- | :------------------------ | :------------------------- | :---------------------------------------------- | :---------------------------------------------------------------------------------------------- |
| **Planejamento da Release** | Elicitação e Descoberta   | Levantamento de Requisitos | Entrevistas (VP e Diretores) e Brainstorming    | Identificação de gargalos (gestão manual) e necessidade de centralização de dados.              |
|                             | Análise e Consenso        | Priorização e Viabilidade  | Priorização MoSCoW e Análise de Custo/Benefício | Definição do MVP e busca por tecnologias que garantam a sustentabilidade financeira do projeto. |
|                             | Declaração                | Registro de Requisitos     | Temas, Épicos e User Stories                    | Organização do backlog em grandes blocos (ex: Gestão de Alunos).                                |
|                             | Verificação e Validação   | Validação de Negócio       | Prototipação de Baixa Fidelidade                | Confirmação de que a visão macro dos Épicos atende às expectativas da diretoria.                |
|                             | Organização e Atualização | Estruturação Temporal      | Mapa da Release                                 | Backlog da release visível, categorizado e cronograma estruturado.                              |
| **Planejamento da Sprint**  | Elicitação e Descoberta   | Refinamento Operacional    | Entrevistas (Professores) e Análise Documental  | Mapeamento de campos dos cadernos/planilhas para migração digital.                              |
|                             | Análise e Consenso        | Análise Técnica e de Uso   | Discussões em Equipe e Análise de Tarefas       | Definição da integridade do banco de dados e foco na usabilidade para voluntários.              |
|                             | Declaração                | Definição de Regras        | Critérios de Aceitação                          | Regras claras para determinar quando uma história está concluída.                               |
|                             | Verificação e Validação   | Garantia de Prontidão      | Definition of Ready (DoR)                       | Requisitos claros, testáveis e sem ambiguidades antes do desenvolvimento.                       |
|                             | Organização e Atualização | Alinhamento de Urgências   | Refinamento Contínuo do Backlog                 | Backlog detalhado e priorizado conforme as necessidades imediatas da instituição.               |
| **Execução da Sprint**      | Representação             | Modelagem de Interface     | Protótipos e Esboços Simples                    | Visualização da facilidade de uso da chamada digital através de desenhos simplificados.         |
|                             | Verificação e Validação   | Qualidade dos Requisitos   | Critérios INVEST e Revisão DEEP                 | Garantia de que as histórias são valiosas, pequenas, estimadas e testáveis.                     |
|                             | Organização e Atualização | Gestão de Progresso        | Atualização do Quadro de Tarefas                | Monitoramento em tempo real do progresso dos requisitos em execução.                            |
| **Revisão da Sprint**       | Verificação e Validação   | Homologação com Usuário    | Coleta de Feedback e Demonstração               | Validação da usabilidade real com diretores e professores voluntários.                          |
|                             | Declaração                | Refinamento Pós-Teste      | Ajuste de User Stories                          | Histórias corrigidas e priorizadas para facilitar a adoção do sistema.                          |
| **Retrospectiva da Sprint** | Análise e Organização     | Avaliação Interna          | Discussões em Grupo                             | Identificação de falhas de comunicação e pontos positivos na interação.                         |
|                             | Atualização do Processo   | Melhoria Contínua          | Atualização do Workflow                         | Ajuste no processo de trabalho para superar dificuldades técnicas.                              |
| **Próxima Release**         | Elicitação e Descoberta   | Expansão de Escopo         | Análise de Domínio e Workshops                  | Identificação de novas necessidades (ex: relatórios para doadores).                             |
|                             | Análise e Consenso        | Priorização Estratégica    | MoSCoW e Mapeamento de Valor                    | Definição de funcionalidades de alto impacto (ex: Dashboards analíticos).                       |
|                             | Verificação e Validação   | Refinamento de Maturidade  | Critérios DEEP e INVEST                         | Garantia de que novos itens estão prontos para as futuras sprints.                              |
|                             | Organização e Atualização | Manutenção de Ativos       | Roadmap e Estruturação de Diretórios            | Cronograma atualizado e documentação versionada (GitHub Pages).                                 |
