# 8. Interação Equipe e Cliente

## 8.1. Composição da Equipe

| Papel                  | Descrição                                                                                                                         | Responsável     | Participantes           |
| ---------------------- | --------------------------------------------------------------------------------------------------------------------------------- | --------------- | ----------------------- |
| Gerente de Projeto     | Responsável pelo planejamento estratégico das entregas e alinhar expectativas entre os times                                      | Gabriel Pereira | Matheus Eiki            |
| Desenvolvedor Backend  | Responsável pelo desenvolvimento da lógica e integrações com serviços e provedores                                                | Gabriel Magioli | Vinicius, Gabriel P     |
| Desenvolvedor Frontend | Responsável pelo desenvolvimento de telas e integrações com o backend                                                             | Lucca Medeiros  | Matheus Eiki, Gabriel P |
| Analista de QA         | Responsável por validar as regras de negócio e assegurar o correto funcionamento da aplicação                                     | Matheus Eiki    | Guilherme               |
| Prototipação           | Definições das interfaces que servem como base para o desenvolvimento e identificação dos problemas dos clientes de forma visual. | Matheus Eiki    | Guilherme               |
| Analista de Requisitos | Define os requisitos funcionais e não funcionais do sistema e garante que eles sejam atendidos                                    | Guilherme       | Gabriel P               |

## 8.2. Comunicação e Reuniões

### Ferramentas de Comunicação

- **Discord:** Será utilizado como principal canal de comunicação interna da equipe. A plataforma permitirá a criação de canais temáticos separados por funcionalidades, bugs e tarefas, além de centralizar o controle de fluxo das documentações e códigos desenvolvidos ao longo do projeto. Sua organização em servidores facilitará o acompanhamento do histórico de decisões técnicas e garantirá que todas as informações relevantes estejam acessíveis aos membros da equipe.

- **WhatsApp:** Será utilizado para comunicação pontual e direta entre os integrantes da equipe e o cliente. Por sua praticidade e agilidade, o WhatsApp servirá como canal para interações rápidas e informais ao longo do desenvolvimento, especialmente em situações que demandem respostas imediatas, esclarecimentos de dúvidas ou necessidade de ajustes emergenciais fora dos ciclos formais de reunião.

- **Email:** Será utilizado como canal formal de comunicação com o cliente para registrar decisões, alinhamentos, aprovações e histórico de discussões do projeto. Sempre que houver definições relevantes ou encaminhamentos que precisem de rastreabilidade, o registro será consolidado por e-mail.

- **Jira:** Será a ferramenta central de gerenciamento do backlog, controle de tarefas e acompanhamento do progresso de cada sprint. Através do Jira, tanto a equipe quanto o cliente poderão visualizar em tempo real o andamento do projeto, participar ativamente do processo de priorização das funcionalidades e garantir que as entregas estejam alinhadas com os objetivos definidos em cada ciclo.

- **TLDraw:** Será utilizado como quadro colaborativo para diagramações e planejamento visual de funcionalidades. A ferramenta possibilitará a criação de fluxos, protótipos de interface, mapas de arquitetura e demais documentações visuais necessárias durante as etapas de planejamento e refinamento do projeto, facilitando o alinhamento visual entre os membros da equipe.

### Métodos e Frequência de Reuniões

- **Reuniões Diárias (Daily Scrum):** A equipe de desenvolvimento realizará reuniões diárias de curta duração para discutir o progresso de cada membro, os obstáculos encontrados e as prioridades do dia. Conduzidas de forma objetiva via Discord, essas reuniões garantirão que todos estejam cientes do andamento do projeto e que eventuais impedimentos sejam identificados e resolvidos com agilidade.

- **Reunião de Revisão de Sprint (Review):** Ao final de cada sprint, a equipe realizará uma reunião de revisão com o cliente. Nesse momento, as funcionalidades desenvolvidas serão apresentadas e demonstradas, permitindo que o cliente as valide, teste e forneça feedback direto. As informações coletadas nessa reunião serão utilizadas para ajustar o backlog e orientar as prioridades do próximo ciclo de desenvolvimento.

- **Reunião de Planejamento de Sprint:** Após a reunião de revisão, a equipe e o cliente se reunirão para planejar o próximo sprint. Nessa etapa, o backlog será revisado em conjunto e as funcionalidades serão priorizadas de acordo com o feedback recebido, assegurando que o desenvolvimento permaneça alinhado às expectativas e necessidades do cliente.

- **Reunião de Retrospectiva:** Também ao final de cada sprint, a equipe realizará uma reunião interna de retrospectiva. O objetivo é refletir sobre o ciclo encerrado, identificando o que funcionou bem, os pontos de melhoria e as lições aprendidas. Essa prática garante a melhoria contínua dos processos, da comunicação e da qualidade das entregas ao longo de todo o projeto.

### Frequência de Interações com o Cliente

- **Revisões de Sprint:** Pelo menos um representante da organização estará diretamente envolvido nas revisões de sprint, realizadas ao término de cada ciclo de desenvolvimento, onde cada um desses ciclos possui a duração de 10 dias úteis. Nessas reuniões, poderá validar as entregas, testar as funcionalidades implementadas e fornecer feedback para orientar os próximos passos do projeto.

- **Planejamento da Sprint:** Após o planejamento de cada sprint, será enviado via email para o cliente, um informativo indicando um conjunto de funcionalidades que serão desenvolvidas ao longo da sprint seguinte, com o intuito de validar e alinhar expectativas.

## 8.3. Processo de Validação

O processo de validação da solução será realizado em três etapas principais:

Para iniciar o desenvolvimento de uma funcionalidade, será utilizado o **Definition of Ready (DoR)**, no qual será verificado se os requisitos estão claramente definidos, se há entendimento do problema, se os critérios de aceitação estão estabelecidos e se a funcionalidade está adequada às necessidades dos stakeholders.

Durante o desenvolvimento, será aplicado o **Definition of Done (DoD)**, no qual a funcionalidade será considerada pronta apenas após passar por validações técnicas e funcionais, incluindo testes básicos, verificação de funcionamento e avaliação de usabilidade, garantindo que a solução seja adequada ao contexto dos usuários.

Após a validação interna, o incremento será apresentado aos stakeholders ao final de cada sprint, para **validação por meio de feedback contínuo**. Nessa etapa, os usuários irão verificar se as funcionalidades atendem às suas necessidades, permitindo ajustes e refinamentos antes das próximas iterações.