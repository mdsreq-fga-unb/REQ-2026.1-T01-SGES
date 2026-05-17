# Documentação de Requisitos de Software

## 1. Características do Produto (CP)

Para garantir a rastreabilidade estrutural do sistema, os requisitos funcionais e não funcionais foram mapeados de acordo com os seguintes módulos ou Características do Produto (CP):

- **CP1 - Segurança e Controle de Acessos:** Autenticação, perfis, logs e adequação à LGPD.
- **CP2 - Gestão de Instrutores:** Cadastro e controle da equipe de instrução e trabalho da ONG.
- **CP3 - Cadastro Sociodemográfico:** Informações demográficas de famílias e beneficiários.
- **CP4 - Frequência e Engajamento:** Gestão de oficinas, matrículas e chamadas.
- **CP5 - Monitoramento de Evasão:** Gatilhos, alertas e registro de intervenções sociais.
- **CP6 - Relatórios e Transparência:** Extração de dados, impacto social e prestação de contas.
- **CP7 - Arquitetura e Performance:** Requisitos de infraestrutura, usabilidade e disponibilidade.

---

## 2. Requisitos Funcionais (RF)

| ID       | Requisito (Verbo + Objeto)          | Ator          | Descrição do Requisito                                                                                                                                         | Característica do Produto (CP)        |
| :------- | :---------------------------------- | :------------ | :------------------------------------------------------------------------------------------------------------------------------------------------------------- | :------------------------------------ |
| **RF01** | Autenticar usuário                  | Todos         | Validar credenciais para o controle de acesso primário ao sistema, bloqueando a conta após 5 tentativas falhas consecutivas.                                   | CP1 - Segurança e Controle de Acessos |
| **RF02** | Redefinir senha de acesso           | Todos         | Enviar link seguro com token temporário que expira em 15 minutos para recuperação de senha, garantindo autonomia e segurança ao usuário.                       | CP1 - Segurança e Controle de Acessos |
| **RF03** | Encerrar sessão                     | Todos         | Invalidar o token JWT do usuário ativo para prevenir o uso não autorizado em terminais compartilhados.                                                         | CP1 - Segurança e Controle de Acessos |
| **RF04** | Cadastrar instrutor                 | Gestor        | Inserir os dados do membro da equipe para a gestão do corpo de instrutores, sendo obrigatória a definição do perfil de acesso (RBAC).                          | CP2 - Gestão de Instrutores           |
| **RF05** | Editar perfil do instrutor          | Gestor        | Atualizar os dados cadastrais e as permissões do instrutor para manter a base de dados atualizada.                                                             | CP2 - Gestão de Instrutores           |
| **RF06** | Inativar instrutor                  | Gestor        | Realizar a inativação lógica (_soft delete_) do instrutor para revogar acessos, mantendo a integridade referencial e o histórico de autoria.                   | CP2 - Gestão de Instrutores           |
| **RF07** | Registrar termo de consentimento    | Gestor/Instr. | Anexar o consentimento formal dos responsáveis para atender às exigências da LGPD, bloqueando o cadastro familiar em caso de ausência.                         | CP3 - Cadastro Sociodemográfico       |
| **RF08** | Cadastrar família assistida         | Gestor/Instr. | Registrar os dados do núcleo familiar para centralizar as informações demográficas, exigindo a prévia validação do termo de consentimento.                     | CP3 - Cadastro Sociodemográfico       |
| **RF09** | Editar dados da família             | Gestor/Instr. | Atualizar as informações habitacionais ou de contato da família para manter a comunicação ativa e ajudar na mitigação de evasões.                              | CP3 - Cadastro Sociodemográfico       |
| **RF10** | Inativar cadastro familiar          | Gestor        | Arquivar logicamente (_soft delete_) o histórico de famílias que deixaram o programa, prevenindo a exclusão física de dados auditáveis.                        | CP3 - Cadastro Sociodemográfico       |
| **RF11** | Cadastrar beneficiário              | Gestor/Instr. | Registrar o indivíduo associando-o obrigatoriamente ao ID de uma família cadastrada, permitindo o rastreio individualizado.                                    | CP3 - Cadastro Sociodemográfico       |
| **RF12** | Editar dados do beneficiário        | Gestor/Instr. | Atualizar o perfil individual do assistido para permitir um acompanhamento longitudinal adequado da sua situação socioeducativa.                               | CP3 - Cadastro Sociodemográfico       |
| **RF13** | Cadastrar oficina/atividade         | Gestor        | Registrar uma nova atividade com cronograma contendo obrigatoriamente data de início e término, limite de vagas e instrutor responsável.                       | CP4 - Frequência e Engajamento        |
| **RF14** | Matricular beneficiário             | Gestor/Instr. | Vincular um beneficiário ativo a uma oficina, validando automaticamente a disponibilidade de vagas e impedindo choques de horários.                            | CP4 - Frequência e Engajamento        |
| **RF15** | Registrar presença em lote          | Instrutor     | Lançar de forma massiva a presença ou falta dos matriculados exclusivamente na data da ocorrência da aula, visando eliminar o uso de papel.                    | CP4 - Frequência e Engajamento        |
| **RF16** | Alterar registro de frequência      | Gestor        | Permitir a correção de presenças retroativamente, com limite sistêmico de 72 horas após a aula e exigência de preenchimento de justificativa.                  | CP4 - Frequência e Engajamento        |
| **RF17** | Registrar falta justificada         | Instrutor     | Lançar faltas abonadas (ex: atestados) para garantir a precisão estatística, assegurando que estas não contabilizem no gatilho de alerta de evasão.            | CP4 - Frequência e Engajamento        |
| **RF18** | Emitir alerta de evasão             | Sistema       | Sinalizar automaticamente no painel de controle os beneficiários em risco sempre que atingirem 3 faltas consecutivas ou 5 alternadas no mês.                   | CP5 - Monitoramento de Evasão         |
| **RF19** | Consultar histórico do beneficiário | Todos         | Exibir a linha do tempo centralizada de presenças, alertas recebidos e oficinas vinculadas ao indivíduo para embasar decisões da equipe.                       | CP5 - Monitoramento de Evasão         |
| **RF20** | Registrar intervenção social        | Gestor/Instr. | Documentar de forma textual os contatos e as providências tomadas junto à família após o acionamento de um alerta de evasão.                                   | CP5 - Monitoramento de Evasão         |
| **RF21** | Encerrar alerta de evasão           | Gestor        | Marcar um alerta de evasão como tratado para limpar a fila da gestão, exigindo validação sistêmica do registro prévio da intervenção realizada.                | CP5 - Monitoramento de Evasão         |
| **RF22** | Gerar relatório de frequência       | Gestor        | Consolidar e exportar em formato CSV os percentuais de engajamento segmentados por oficina ou mês para avaliar a assiduidade do público.                       | CP6 - Relatórios e Transparência      |
| **RF23** | Gerar relatório de impacto social   | Gestor        | Extrair a volumetria total de atendimentos de forma 100% anonimizada (ocultando PII) para auxiliar na prestação de contas da ONG aos financiadores.            | CP6 - Relatórios e Transparência      |
| **RF24** | Exportar matriz de dados em PDF     | Gestor        | Gerar um documento estático e não editável em formato PDF com os consolidados gerenciais para arquivo e documentação formal da diretoria.                      | CP6 - Relatórios e Transparência      |
| **RF25** | Configurar parâmetros do sistema    | Gestor        | Ajustar limites numéricos e parâmetros sistêmicos (como o gatilho exato de faltas para alertas), garantindo flexibilidade operacional sem alteração de código. | CP1 - Segurança e Controle de Acessos |

---

## 3. Requisitos Não Funcionais (RNF)

| ID        | Nome do Requisito           | Descrição Técnica e Métrica de Validação                                                                                                                                                        | Categoria (FURPS+) | Característica do Produto (CP)        |
| :-------- | :-------------------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :----------------- | :------------------------------------ |
| **RNF01** | Criptografia em Repouso     | Todos os dados pessoais sensíveis devem ser armazenados criptografados, garantindo que 100% das colunas PII no banco de dados utilizem o padrão AES-256.                                        | Segurança          | CP1 - Segurança e Controle de Acessos |
| **RNF02** | Trilha de Auditoria (Logs)  | Toda operação de escrita (POST, PUT, DELETE lógico) deve registrar timestamp e ID do usuário, garantindo auditoria de 100% dos endpoints via logs inalteráveis.                                 | Segurança          | CP1 - Segurança e Controle de Acessos |
| **RNF03** | Expiração de Sessão         | O sistema deve invalidar o token JWT de acesso automaticamente após 15 minutos de inatividade do usuário, prevenindo exposições indesejadas de telas abertas.                                   | Segurança          | CP1 - Segurança e Controle de Acessos |
| **RNF04** | Mascaramento de Dados       | O sistema deve anonimizar dados para proteção dos vulneráveis, garantindo que relatórios exportados não contenham CPF, RGs ou nomes completos rastreáveis.                                      | Segurança          | CP1 - Segurança e Controle de Acessos |
| **RNF05** | Responsividade (PWA)        | A interface de operação deve ser fluida como um PWA, garantindo renderização adaptada para instrutores em dispositivos móveis com resoluções mínimas de 320x568px.                              | Usabilidade        | CP7 - Arquitetura e Performance       |
| **RNF06** | Acessibilidade Digital      | O sistema deve permitir leitura facilitada para todos os perfis de instrutores, atingindo nota maior ou igual a 90 na auditoria de contraste do Google Lighthouse.                              | Usabilidade        | CP7 - Arquitetura e Performance       |
| **RNF07** | Desempenho de Carga Inicial | A tela de registro de presenças deve abrir rapidamente em redes 3G intermitentes, atingindo um FCP (_First Contentful Paint_) inferior a 2.5s no percentil 95.                                  | Desempenho         | CP7 - Arquitetura e Performance       |
| **RNF08** | Desempenho de Gravação      | O salvamento de chamadas em lote deve ser otimizado para não travar a interface, mantendo o tempo de resposta da API para _batch insert_ de 50 registros abaixo de 800ms.                       | Desempenho         | CP7 - Arquitetura e Performance       |
| **RNF09** | Concorrência de Acessos     | A infraestrutura deve suportar a carga no início e fim de expedientes, tolerando picos de 100 requisições simultâneas por segundo mantendo latência abaixo de 1s.                               | Desempenho         | CP7 - Arquitetura e Performance       |
| **RNF10** | Disponibilidade (SLA)       | O sistema deve assegurar alta disponibilidade durante os dias úteis, garantindo um uptime mensal aferido de 99.5% (limitado a cerca de 3.6 horas de inatividade no mês).                        | Confiabilidade     | CP7 - Arquitetura e Performance       |
| **RNF11** | Rotina de Backup            | O banco de dados deve possuir rotina de salvaguarda automatizada, gerando dumps diários estruturados com retenção segura em nuvem (Cloud Storage) por um período de 30 dias.                    | Confiabilidade     | CP7 - Arquitetura e Performance       |
| **RNF12** | Documentação de APIs        | A API de backend deve ser auto-documentada para viabilizar transferências de conhecimento para a equipe técnica, possuindo 100% de seus endpoints mapeados segundo a especificação OpenAPI 3.0. | Manutenibilidade   | CP7 - Arquitetura e Performance       |
