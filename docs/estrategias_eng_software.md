# 3. Estratégias de Eng. de Software

## 3.1. Estratégia Priorizada

**Abordagem:** Abordagem ágil, baseada em desenvolvimento iterativo e incremental, com forte interação com o cliente e adaptação contínua aos requisitos ao longo do projeto.

**Ciclo de Vida:** Ciclo de vida iterativo e incremental.

**Processo:** Processo de desenvolvimento ágil baseado no OpenUP.

## 3.2. Quadro Comparativo

O quadro a seguir apresenta características comparativas entre o RAD e OPENUP, visando auxiliar no entendimento e justificativa da escolha do processo mais adequado para o desenvolvimento da plataforma de gestão de beneficiários da instituição.

| Características | OPENUP | RAD |
| :--- | :--- | :--- |
| **Abordagem Geral** | Iterativo, incremental e ágil, representando uma versão leve do Unified Process | Iterativo e incremental, com foco em prototipação rápida, validação contínua e desenvolvimento orientado a tempo. |
| **Foco em Arquitetura** | Centrado na arquitetura, mantendo a visão estrutural que guia a construção do sistema para mitigar riscos técnicos | Menos foco em arquitetura nas iterações iniciais ganhando forma conforme o desenvolvimento do protótipo. |
| **Estrutura de Processos** | Organizado em quatro fases sequenciais (Concepção, Elaboração, Construção e Transição) e estruturado em três camadas temporais: micro-incrementos (diários), ciclo de vida da iteração (semanal) e ciclo de vida do projeto (mensal) | Estrutura flexível, baseada em ciclos de prototipação, workshops e validação direta com o cliente. |
| **Flexibilidade de Requisitos** | Evolutivo e progressivo, utilizando casos de uso leves ou itens de trabalho (work items) que são detalhados conforme necessário para a implementação, evitando especificação excessiva antecipada | Muito flexível, tratando requisitos como variáveis a serem ajustadas a cada ciclo. Com isso, o sistema final pode ser muito diferente do inicial. |
| **Colaboração com Cliente** | Próxima e regular, promovendo transparência e o balanceamento de prioridades concorrentes por meio de revisões contínuas | Colaboração constante, priorizando o feedback rápido por meio da experiência do usuário com o protótipo. |
| **Práticas de desenvolvimento** | Desenvolvimento baseado em casos de uso e itens de trabalho (work items), gerenciamento de riscos e foco na entrega de uma versão testada e integrada do sistema ao final de cada iteração | Foco em prototipação rápida para permitir feedback rápido a cada entrega no fim de um ciclo. |
| **Qualidade Técnica** | Baseia-se em práticas comprovadas de engenharia, como arquitetura baseada em componentes e verificação contínua da integridade do sistema | Depende da habilidade e coordenação da equipe. Pois, como prioriza velocidade, o desenvolvimento pode se tornar desordenado. |
| **Controle de Qualidade** | Validação contínua por meio de demonstrações e testes frequentes, com feedback dos stakeholders incorporado nas iterações subsequentes | Foco em prototipação rápida para permitir feedback rápido a cada entrega no fim de um ciclo. |
| **Complexidade do processo** | Baixa complexidade, oferecendo um framework mínimo e completo que reduz a sobrecarga burocrática do RUP tradicional | Mais leve em termos técnicos, mas demanda alto engajamento do cliente. |
| **Documentação** | Enxuta e voltada para o essencial, com artefatos (como Visão e Lista de Requisitos) criados apenas quando agregam valor tangível ao projeto | Documentação mínima, priorizando protótipos e artefatos visuais. |
| **Escalabilidade** | Escalável e adaptável, podendo ser estendido de um framework mínimo para abordar necessidades específicas conforme a complexidade do projeto | Baixa escalabilidade, ideal para projetos menores e menos complexos. |
| **Suporte a equipe de desenvolvimento** | Ideal para equipes pequenas (3 a 10 pessoas) e co-localizadas; pode ser desafiador para equipes inexperientes que necessitem de orientação mais prescritiva | Ideal para equipes menores com contato próximo do usuário final. |

## 3.3. Justificativa
Fases do Processo 	Atividades ER 	Prática 	Técnica 	Resultado Esperado
Concepção (Inception) 	• Elicitação e Descoberta
• Declaração 	• Reuniões com stakeholders e Observação dos processos atuais
• Definição do escopo inicial 	• Entrevistas e Observação
• Documento de Visão 	• Levantamento inicial das necessidades e problemas da instituição
• Definição dos objetivos e escopo
Elaboração 	• Análise e Consenso
• Elicitação de requisitos
• Representação de Requisitos
• Organização de Requisitos 	• Refinamento de Requisitos
• Análise de Dependências
• Modelagem de Casos de Uso
• Priorização dos Itens de Trabalho 	• Análise de domínio
• Discussões em Equipe e Análise de Tarefas
• Detalhamento de Requisitos
• MoSCoW 	• Redução de ambiguidades e inconsistências, Requisitos mais consistentes
• Definição técnica da centralização dos dados e foco na usabilidade para voluntários.
• Validação conceitual das funcionalidades e regras de negócio do 
O OpenUP se apresenta como a alternativa mais adequada ao projeto da SEAS quando comparado ao RAD, principalmente por oferecer maior equilíbrio entre organização, documentação e flexibilidade. Embora ambos sejam processos iterativos e incrementais, o OpenUP possui uma estrutura mais definida, permitindo melhor controle do projeto e maior estabilidade durante o desenvolvimento e melhor conexão com a disciplina.
Objetivos da Iteração¶

Implementar os módulos de controle de frequência e acompanhamento de alunos, entregando ao final do ciclo as seguintes capacidades funcionais:

    Registro de presença em lote na data de ocorrência da aula (CSU12 / RF11)
    Registro de falta justificada com impacto nos indicadores de evasão (CSU11 / RF13)
    Correção retroativa de registros de presença com justificativa, dentro do prazo de 72 horas (CSU10 / RF12)
    Consulta do histórico consolidado de presenças, alertas e matrículas do aluno (CSU14 / RF15)
    Geração e exportação de relatório de frequência em formato CSV (CSU15 / RF16)

Itens de Trabalho¶
ID 	Caso de Uso 	Ator 	Descrição 	Critérios de Aceitação
CSU12 	Registrar Presença em Lote 	Instrutor 	Lançar a presença ou falta de todos os matriculados de forma massiva, exclusivamente na data da aula. 	CA11-01: Presença/falta salva simultaneamente para todos os alunos da lista.
CA11-02: Lançamento bloqueado fora da data de ocorrência da aula.
CSU10 	Alterar Registro de Frequência 	Gestor 	Corrigir um registro de presença retroativamente com justificativa, dentro do prazo de 72 horas. 	CA12-01: Edição permitida em até 72h após a aula.
CA12-02: Bloqueio automático após o prazo.
CA12-03: Justificativa obrigatória para qualquer alteração.
CSU11 	Registrar Falta Justificada 	Instrutor 	Lançar uma ausência como justificada (ex.: atestado) 
Diferentemente do RAD, que possui forte dependência de prototipação rápida e feedback constante do cliente, o OpenUP permite uma evolução mais controlada dos requisitos e da solução. Isso é especialmente importante no contexto da SEAS, já que a disponibilidade dos stakeholders pode variar devido à atuação voluntária da instituição, dificultando ciclos muito curtos e dependentes de validação contínua imediata.

Além disso, o OpenUP mantém maior preocupação com arquitetura e organização técnica desde as fases iniciais do projeto. Considerando que o SGES envolve centralização de informações, gerenciamento de usuários, controle de frequência e geração de relatórios, torna-se importante possuir uma base estrutural mais consistente para evitar problemas futuros de manutenção e crescimento do sistema.
Outro fator relevante é a documentação. Enquanto o RAD prioriza documentação mínima e foco quase exclusivo em protótipos, o OpenUP mantém uma documentação enxuta, mas suficiente para registrar requisitos, regras de negócio e decisões importantes. Isso contribui para reduzir ambiguidades, facilitar o alinhamento da equipe e garantir maior rastreabilidade dos requisitos e explorar e desenvolver melhor a disciplina de requisitos.

O OpenUP também apresenta melhor adaptação ao contexto acadêmico do projeto, pois oferece uma organização mais clara das atividades e das fases do processo, auxiliando no planejamento, acompanhamento e gerenciamento das entregas. Dessa forma, o processo contribui para reduzir riscos relacionados à falta de padronização e à evolução descontrolada dos requisitos.
Portanto, o OpenUP foi considerado mais adequado ao projeto da SEAS por equilibrar agilidade, organização e documentação, permitindo maior estabilidade no desenvolvimento sem exigir uma dependência excessiva de feedback contínuo e imediato do cliente, como ocorre no RAD.

