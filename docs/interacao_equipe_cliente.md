# 8. Interação Equipe e Cliente

## 8.1. Composição da Equipe

| Papel                  | Descrição                                                                                                                         | Responsável     | Participantes           |
| ---------------------- | --------------------------------------------------------------------------------------------------------------------------------- | --------------- | ----------------------- |
| Gerente de Projeto     | Responsável pelo planejamento estratégico das entregas e alinhar expectativas entre os times                                      | Gabriel Pereira | Vinicius            |
| Desenvolvedor Backend  | Responsável pelo desenvolvimento da lógica e integrações com serviços e provedores                                                | Gabriel Magioli | Vinicius, Gabriel P     |
| Desenvolvedor Frontend | Responsável pelo desenvolvimento de telas e integrações com o backend                                                             | Lucca Medeiros  | Gabriel P |
| Analista de QA         | Responsável por validar as regras de negócio e assegurar o correto funcionamento da aplicação                                     | Guilherme     | Lucca Medeiros |
| Analista de Requisitos | Define os requisitos funcionais e não funcionais do sistema e garante que eles sejam atendidos                                    | Guilherme       | Gabriel P               |

## 8.2. Comunicação e Reuniões

### Ferramentas de Comunicação

- **Discord:** Será utilizado como principal canal de comunicação interna da equipe. A plataforma permitirá a criação de canais temáticos separados por funcionalidades, bugs e tarefas, além de centralizar o controle de fluxo das documentações e códigos desenvolvidos ao longo do projeto. Sua organização em servidores facilitará o acompanhamento do histórico de decisões técnicas e garantirá que todas as informações relevantes estejam acessíveis aos membros da equipe.

- **WhatsApp:** Será utilizado para comunicação pontual e direta entre os integrantes da equipe e o cliente. Por sua praticidade e agilidade, o WhatsApp servirá como canal para interações rápidas e informais ao longo do desenvolvimento, especialmente em situações que demandem respostas imediatas, esclarecimentos de dúvidas ou necessidade de ajustes emergenciais fora dos ciclos formais de reunião.

- **Email:** Será utilizado como canal formal de comunicação com o cliente para registrar decisões, alinhamentos, aprovações e histórico de discussões do projeto. Sempre que houver definições relevantes ou encaminhamentos que precisem de rastreabilidade, o registro será consolidado por e-mail.

### Métodos e Frequência de Reuniões (Abordagem OpenUP)

#### Reuniões Diárias de Status
A equipe de desenvolvimento realizará comunicação assíncrona semanalmente para alinhar o andamento dos micro-incrementos técnicos e sincronizar o progresso individual. Conduzidas de forma objetiva via WhatsApp, essas mensagens servem para atualizar a Lista de Itens de Trabalho (Work Item List), identificar impedimentos com agilidade e, se necessário, ajustar o horário para acomodar a rotina de todos os membros (como pendências de horários).

#### Avaliação de Fim de Iteração
Ao final de cada iteração, a equipe realizará uma reunião formal de avaliação de resultados. Nesse momento, as funcionalidades desenvolvidas no ciclo são analisadas para verificar se cumprem os critérios de aceite estabelecidos. O resultado dessa avaliação mede o progresso real em relação aos objetivos de alto nível da fase e ajuda a calibrar o escopo para a iteração seguinte.

#### Planejamento de Iteração
No início de cada novo ciclo, a equipe se reúne para estruturar o próximo Plano de Iteração. Nessa etapa, o escopo macro definido no Plano de Projeto é revisado e os Casos de Uso prioritários da Lista de Itens de Trabalho são subdivididos em tarefas de desenvolvimento menores e distribuídos entre os membros da equipe de acordo com suas capacidades e estimativas de esforço.

#### Retrospectiva e Lições Aprendidas
Também integrada ao encerramento da iteração, a equipe realiza uma sessão de retrospectiva com o objetivo de refletir sobre o processo de Engenharia de Software adotado. São identificados os pontos fortes, os gargalos técnicos e organizacionais e os desvios de planejamento. Os aprendizados são registrados diretamente como Lições Aprendidas no Plano de Projeto para garantir a evolução contínua da qualidade e dos processos da equipe.

---

### Frequência de Interações com o Cliente

#### Demonstração de Resultados e Checkpoints
Pelo menos um representante da organização cliente (Stakeholder) estará diretamente envolvido nos checkpoints de encerramento de cada iteração, realizados ao término de cada ciclo de desenvolvimento. Nessas sessões, o cliente poderá validar os micro-incrementos entregues, testar as capacidades funcionais dos Casos de Uso implementados e fornecer o feedback necessário para orientar a priorização das próximas iterações.

#### Alinhamento de Escopo e Informativos
Após a consolidação do planejamento de cada ciclo, a gerência de projeto enviará via WhatsApp para o cliente um informativo detalhado contendo o conjunto de Casos de Uso e capacidades técnicas que serão abordados ao longo da iteração seguinte. Essa prática garante a transparência contínua e o alinhamento estrito de expectativas entre a equipe de desenvolvimento e as necessidades do negócio do cliente.

## 8.3. Processo de Validação

O processo de validação da solução será realizado em três etapas principais:

Para iniciar o desenvolvimento de uma funcionalidade, será utilizado o **Definition of Ready (DoR)**, no qual será verificado se os requisitos estão claramente definidos, se há entendimento do problema, se os critérios de aceitação estão estabelecidos e se a funcionalidade está adequada às necessidades dos stakeholders.

Durante o desenvolvimento, será aplicado o **Definition of Done (DoD)**, no qual a funcionalidade será considerada pronta apenas após passar por validações técnicas e funcionais, incluindo testes básicos, verificação de funcionamento e avaliação de usabilidade, garantindo que a solução seja adequada ao contexto dos usuários.

Após a validação interna, o incremento será apresentado aos stakeholders ao final de cada iteração, para **validação por meio de feedback contínuo**. Nessa etapa, os usuários irão verificar se as funcionalidades atendem às suas necessidades, permitindo ajustes e refinamentos antes das próximas iterações.