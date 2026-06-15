# Especificação de Histórias de Usuário e Requisitos (SGES)

Este documento apresenta o mapeamento completo dos Itens de Trabalho, estabelecendo a rastreabilidade direta entre as Características de Produto (Épicos), Histórias de Usuário (US), Critérios de Aceitação (CA), Requisitos Funcionais (RF) e Requisitos Não Funcionais (RNF).

---

## Tabela de Histórias de Usuário e Rastreabilidade

| Épico / Característica              | ID       | História de Usuário (User Story)                                                                                             | Critérios de Aceitação                                                                                                                                                                                                                             | Requisito Funcional                        | RNF Relacionados |
| :---------------------------------- | :------- | :--------------------------------------------------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :----------------------------------------- | :--------------- |
| **Segurança e Controle de Acessos** | **US01** | Como usuário do sistema, quero autenticar meu acesso para garantir que apenas pessoas autorizadas utilizem a plataforma.     | • **CA01-01:** Login válido gera token de acesso.<br>• **CA01-02:** Após 5 tentativas inválidas, a conta é bloqueada e a tentativa é registrada no log de segurança.                                                                               | RF01 - Autenticar usuário                  | RNF10, RNF02     |
| **Segurança e Controle de Acessos** | **US02** | Como usuário, quero redefinir minha senha de forma segura para recuperar o acesso ao sistema quando necessário.              | • **CA02-01:** E-mail enviado em até 1 minuto.<br>• **CA02-02:** Token de redefinição expira após 15 minutos.<br>• **CA02-03:** Token expirado retorna erro no sistema.                                                                            | RF02 - Redefinir senha de acesso           | RNF01, RNF02     |
| **Segurança e Controle de Acessos** | **US03** | Como usuário, quero encerrar minha sessão para evitar acessos indevidos em dispositivos compartilhados.                      | • **CA03-01:** Token de sessão invalidado após o logout.<br>• **CA03-02:** Requisições com credenciais antigas retornam erro de não autorizado (401).                                                                                              | RF03 - Encerrar sessão                     | RNF10            |
| **Gestão de Instrutores**           | **US04** | Como gestor, quero cadastrar instrutores para organizar e controlar quem pode atuar nas atividades da instituição.           | • **CA04-01:** Instrutor salvo com identificador único (ID).<br>• **CA04-02:** Perfil de acesso definido com base em papéis (RBAC).                                                                                                                | RF04 - Cadastrar instrutor                 | RNF05, RNF11     |
| **Gestão de Instrutores**           | **US05** | Como gestor, quero editar o perfil dos instrutores para manter os dados e permissões atualizados.                            | • **CA05-01:** Alterações persistidas com sucesso no banco de dados.<br>• **CA05-02:** Novas permissões refletidas imediatamente no acesso.                                                                                                        | RF05 - Editar perfil do instrutor          | RNF05, RNF02     |
| **Gestão de Instrutores**           | **US06** | Como gestor, quero inativar instrutores para revogar acessos sem perder o histórico dos dados.                               | • **CA06-01:** Status do usuário alterado para "inativo".<br>• **CA06-02:** Autenticação bloqueada imediatamente para instrutores inativos.                                                                                                        | RF06 - Inativar instrutor                  | RNF02            |
| **Cadastro Sociodemográfico**       | **US07** | Como gestor ou instrutor, quero cadastrar beneficiários para organizar melhor o acompanhamento social. | • **CA07-01:** Beneficiário criado com sucesso no sistema. | RF07 - Cadastrar beneficiário              | RNF01, RNF08     |
| **Cadastro Sociodemográfico**       | **US08** | Como gestor ou instrutor, quero editar os dados dos beneficiários para manter as informações atualizadas ao longo do tempo.  | • **CA08-01:** Alterações salvas com sucesso no banco de dados.<br>• **CA08-02:** Dados atualizados exibidos corretamente na interface de usuário.                                                                                                 | RF08 - Editar dados do beneficiário        | RNF01, RNF08     |
| **Frequência e Engajamento**        | **US09** | Como gestor, quero cadastrar turmas com datas e vagas para organizar as atividades oferecidas pela instituição.              | • **CA09-01:** Turma criada com datas e horários válidos.<br>• **CA09-02:** Limite máximo de vagas definido no cadastro.<br>• **CA09-03:** Exibição correta da turma no catálogo institucional.                                                    | RF09 - Cadastrar Turma                     | RNF09, RNF11     |
| **Frequência e Engajamento**        | **US10** | Como gestor ou instrutor, quero matricular beneficiários em turmas para controlar a participação nas atividades.             | • **CA10-01:** Vínculo de matrícula criado com sucesso.<br>• **CA10-02:** Sistema bloqueia novas matrículas caso o limite de vagas seja excedido.                                                                                                  | RF10 - Matricular beneficiário             | RNF09            |
| **Frequência e Engajamento**        | **US11** | Como instrutor, quero registrar presença em lote para agilizar o controle de frequência dos alunos.                          | • **CA11-01:** Registro de presença/falta salvo simultaneamente para todos os alunos da lista.<br>• **CA11-02:** Lançamento permitido apenas na data em que a aula ocorre.                                                                         | RF11 - Registrar presença em lote          | RNF04, RNF05     |
| **Frequência e Engajamento**        | **US12** | Como gestor, quero alterar registros de frequência dentro de um prazo para corrigir possíveis erros.                         | • **CA12-01:** Alteração de registros permitida em até 72 horas após a aula.<br>• **CA12-02:** Bloqueio automático de edições após o encerramento do prazo.<br>• **CA12-03:** Obrigatoriedade de preenchimento de justificativa de alteração.      | RF12 - Alterar registro de frequência      | RNF02            |
| **Frequência e Engajamento**        | **US13** | Como instrutor, quero registrar faltas justificadas para garantir precisão nos dados de frequência.                          | • **CA13-01:** Status da falta registrado como "justificada".<br>• **CA13-02:** Ausência justificada não contabiliza negativamente para os indicadores de evasão.                                                                                  | RF13 - Registrar falta justificada         | RNF02            |
| **Monitoramento de Evasão**         | **US14** | Como sistema, quero emitir alertas de evasão automaticamente para apoiar a identificação de alunos em risco.                 | • **CA14-01:** Identificação automática de 3 faltas consecutivas.<br>• **CA14-02:** Identificação automática de 5 faltas alternadas dentro do período.<br>• **CA14-03:** Alerta visual gerado e exibido nos painéis do sistema.                    | RF14 - Emitir alerta de evasão             | RNF06            |
| **Monitoramento de Evasão**         | **US15** | Como usuário, quero consultar o histórico do beneficiário para acompanhar sua participação e evolução.                       | • **CA15-01:** Exibição clara e consolidada de todas as presenças.<br>• **CA15-02:** Histórico de alertas de risco emitidos.<br>• **CA15-03:** Matrículas anteriores e atuais listadas em ordem cronológica.                                       | RF15 - Consultar histórico do beneficiário | RNF01, RNF02     |
| **Relatórios e Transparência**      | **US16** | Como gestor, quero gerar relatórios de frequência para apoiar a tomada de decisão e prestação de contas.                     | • **CA16-01:** Exportação de dados estruturada em formato CSV.<br>• **CA16-02:** Dados do arquivo gerado correspondem estritamente aos filtros aplicados.<br>• **CA16-03:** Colunas e delimitadores formatados adequadamente para leitura externa. | RF16 - Gerar relatório de frequência       | RNF03, RNF07     |

---

# Matriz de Ação e Priorização

Esta seção consolida a avaliação de todas as Histórias de Usuário (US) mapeadas no Backlog do Produto, cruzando o **Valor de Negócio** com o **Custo Técnico** para definir a ordem de priorização e o escopo do MVP (Produto Mínimo Viável).

---

## 6.1 Critérios de Priorização

Para a priorização do backlog, foram utilizados os seguintes critérios:

*   **VN = Valor de Negócio (1 a 5):** Mede a importância da funcionalidade para o negócio e para os usuários finais da instituição.
*   **CT = Complexidade Técnica (1 a 5):** Mede a dificuldade técnica esperada na implementação da funcionalidade.
*   **EF = Esforço de Implementação (1 a 5):** Mede o tempo e recursos estimados para desenvolver a funcionalidade.

### 1. Pontuação Técnica (PT)
Para representar o "custo técnico" da US, calcula-se a média aritmética entre a complexidade e o esforço de implementação:

$$PT = \frac{CT + EF}{2}$$

Dessa forma, a pontuação técnica continua na mesma escala de 1 a 5.

### 2. Índice de Prioridade (IP)
Para comparar de forma objetiva o valor de negócio contra o custo técnico, calcula-se o Índice de Prioridade:

$$IP = \frac{VN}{PT}$$

Quanto maior o IP, maior a prioridade da História de Usuário.

*   **IP alto (IP ≥ 1,50):** Muito valor de negócio para baixo/médio custo técnico.
*   **IP médio (1,00 ≤ IP < 1,49):** Equilíbrio razoável entre valor e custo técnico.
*   **IP baixo (IP < 1,00):** Pouco valor de negócio para alto custo técnico.

---

## 6.2 Matriz de Priorização

A partir do cruzamento entre Valor de Negócio (VN) e Pontuação Técnica (PT), as USs são classificadas em quatro quadrantes de decisão:

*   **Q1 – Alto valor / Baixa carga técnica:** USs com alto valor de negócio (VN ≥ 4) e baixo custo técnico (PT ≤ 2,5). Devem ser desenvolvidas primeiro (Prioridade 1) e compõem o escopo básico do **MVP**.
*   **Q2 – Alto valor / Alta carga técnica:** USs com alto valor de negócio (VN ≥ 4) e alto custo técnico (PT ≥ 3). Exigem planejamento cuidadoso (Prioridade 2).
*   **Q3 – Baixo valor / Baixa carga técnica:** USs com baixo valor de negócio (VN ≤ 3) e baixo custo técnico (PT ≤ 2,5). São secundárias e podem ser feitas após as prioritárias (Prioridade 3).
*   **Q4 – Baixo valor / Alta carga técnica:** USs com baixo valor de negócio (VN ≤ 3) e alto custo técnico (PT ≥ 3). Devem ser reconsideradas ou postergadas.

---

## 6.3 Priorização dos Itens de Trabalho e MVP

A tabela a seguir apresenta todas as Histórias de Usuário priorizadas com base nos critérios estabelecidos, ordenada pelo identificador da História de Usuário (US):

| US | Descrição | VN | CT | EF | PT | IP | Quadrante | Prioridade sugerida |
| :---: | :--- | :---: | :---: | :---: | :---: | :---: | :--- | :--- |
| **US01** | Autenticar usuário | 5 | 2 | 2 | 2 | 2,5 | Q1 Alto valor / Baixa carga técnica | Prioridade 1 |
| **US02** | Redefinir senha de acesso | 4 | 2 | 2 | 2 | 2 | Q1 Alto valor / Baixa carga técnica | Prioridade 1 |
| **US03** | Encerrar sessão | 5 | 1 | 1 | 1 | 5 | Q1 Alto valor / Baixa carga técnica | Prioridade 1 |
| **US04** | Cadastrar instrutor | 5 | 2 | 2 | 2 | 2,5 | Q1 Alto valor / Baixa carga técnica | Prioridade 1 |
| **US05** | Editar perfil do instrutor | 4 | 2 | 2 | 2 | 2 | Q1 Alto valor / Baixa carga técnica | Prioridade 1 |
| **US06** | Inativar instrutor | 3 | 1 | 2 | 1,5 | 2 | Q3 Baixo valor / Baixa carga técnica | Prioridade 3 |
| **US07** | Cadastrar beneficiário | 5 | 2 | 2 | 2 | 2,5 | Q1 Alto valor / Baixa carga técnica | Prioridade 1 |
| **US08** | Editar dados do beneficiário | 4 | 2 | 2 | 2 | 2 | Q1 Alto valor / Baixa carga técnica | Prioridade 1 |
| **US09** | Cadastrar Turma | 5 | 2 | 2 | 2 | 2,5 | Q1 Alto valor / Baixa carga técnica | Prioridade 1 |
| **US10** | Matricular beneficiário | 5 | 2 | 2 | 2 | 2,5 | Q1 Alto valor / Baixa carga técnica | Prioridade 1 |
| **US11** | Registrar presença em lote | 5 | 3 | 3 | 3 | 1,67 | Q2 Alto valor / Alta carga técnica | Prioridade 2 |
| **US12** | Alterar registro de frequência | 4 | 2 | 2 | 2 | 2 | Q1 Alto valor / Baixa carga técnica | Prioridade 1 |
| **US13** | Registrar falta justificada | 4 | 2 | 2 | 2 | 2 | Q1 Alto valor / Baixa carga técnica | Prioridade 1 |
| **US14** | Emitir alerta de evasão | 5 | 4 | 4 | 4 | 1,25 | Q2 Alto valor / Alta carga técnica | Prioridade 2 |
| **US15** | Consultar histórico do beneficiário | 4 | 3 | 3 | 3 | 1,33 | Q2 Alto valor / Alta carga técnica | Prioridade 2 |
| **US16** | Gerar relatório de frequência | 4 | 3 | 3 | 3 | 1,33 | Q2 Alto valor / Alta carga técnica | Prioridade 2 |

> **Nota:** Definimos como escopo do **MVP (Produto Mínimo Viável)** todas as Histórias de Usuário classificadas como **Prioridade 1** (Q1), garantindo a entrega do core funcional do sistema com menor complexidade de desenvolvimento. As demais funcionalidades (Prioridade 2 e 3) serão implementadas em sprints subsequentes.
