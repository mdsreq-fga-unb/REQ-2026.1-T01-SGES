# Engenharia de Requisitos: Especificação de Casos de Uso e Rastreabilidade

Seguindo as diretrizes metodológicas do framework OpenUP, o escopo funcional do SGES foi completamente modelado por meio de **Casos de Uso (CSU)**. A matriz abaixo estabelece a rastreabilidade estrita entre os blocos de entrega, os atores, o gerenciamento de prioridades Quadrantes de Valor e o detalhamento dos fluxos de eventos.

# Tabela Geral de Especificação de Casos de Uso e Rastreabilidade (OpenUP)

## Engenharia de Requisitos: Especificação de Casos de Uso e Rastreabilidade

Seguindo as diretrizes metodológicas do framework OpenUP, o escopo funcional do SGES foi completamente modelado por meio de **Casos de Uso (CSU)**. A matriz abaixo estabelece a rastreabilidade estrita entre as capacidades do sistema, os atores principais, os módulos correspondentes e o detalhamento dos fluxos de eventos e exceções.

## Tabela Geral de Especificação de Casos de Uso e Rastreabilidade (OpenUP)

| ID (CSU) | Caso de Uso | Ator Principal | Módulo do Sistema (Característica do Produto) | Fluxo Principal (Caminho Feliz) | Fluxos Alternativos e de Exceção | MVP? |
| :--- | :--- | :--- | :--- | :--- | :--- | :---: |
| **CSU01** | Autenticar Usuário | Usuário do Sistema | Segurança e Controle de Acessos | 1. O usuário acessa a página de login.<br>2. Insere e-mail e senha e solicita autenticação.<br>3. O sistema valida as credenciais no banco de dados.<br>4. O sistema gera um Token JWT válido.<br>5. O acesso é concedido e o usuário é redirecionado ao painel principal. | **FE01 – Credenciais Inválidas:** Se as credenciais estiverem incorretas no passo 3, o sistema emite erro, contabiliza 1 tentativa inválida e retorna ao passo 2.<br>**FE02 – Bloqueio de Conta:** Atingindo 5 tentativas inválidas consecutivas, o sistema bloqueia a conta, inviabiliza novas tentativas e registra no log. | **X** |
| **CSU02** | Redefinir Senha de Acesso | Usuário do Sistema | Segurança e Controle de Acessos | 1. O usuário informa seu e-mail cadastrado na tela de recuperação.<br>2. O sistema valida a existência do e-mail no banco.<br>3. O sistema gera um token de redefinição seguro e único.<br>4. O sistema envia um e-mail com o link de recuperação (até 1 min).<br>5. O usuário acessa o link, insere a nova senha e confirma.<br>6. O sistema atualiza a senha criptografada e invalida o token. | **FE01 – Token Expirado:** Se o usuário tentar utilizar o link após 15 minutos de sua geração no passo 5, o sistema identifica a expiração, exibe erro e aborta a operação. | **X** |
| **CSU03** | Encerrar Sessão (Logout) | Usuário do Sistema | Segurança e Controle de Acessos | 1. O usuário clica na opção de encerrar sessão (Logout).<br>2. O sistema recebe a requisição de encerramento.<br>3. O sistema invalida e destrói o Token JWT ativo no backend.<br>4. O sistema limpa as credenciais locais e redireciona para o login. | **FE01 – Requisição Inválida:** Qualquer tentativa de requisição feita após o passo 3 utilizando as credenciais antigas é bloqueada pelo mecanismo de segurança e retorna HTTP 401. | **X** |
| **CSU04** | Cadastrar Instrutor | Gestor | Gestão de Instrutores | 1. O Gestor solicita a inclusão de um novo cadastro.<br>2. O sistema exibe o formulário e a seleção de permissões.<br>3. O Gestor preenche os dados e define o papel de acesso (RBAC).<br>4. O Gestor confirma a operação.<br>5. O sistema valida os campos, gera um ID único e persiste no banco. | **FA01 – Instrutor Já Cadastrado:** Se o CPF ou e-mail informado já pertencer a um registro ativo no passo 5, a operação é bloqueada e uma mensagem de alerta é exibida. | **X** |
| **CSU05** | Editar Perfil do Instrutor | Gestor | Gestão de Instrutores | 1. O Gestor busca e seleciona o instrutor desejado.<br>2. O sistema exibe os dados atuais do perfil.<br>3. O Gestor altera as informações ou updates as permissões.<br>4. O Gestor confirma as alterações.<br>5. O sistema valida e persiste as modificações com sucesso no banco.<br>6. As novas permissões são refletidas imediatamente no acesso. | *Não se aplicam fluxos alternativos críticos mapeados nesta capacidade.* | **X** |
| **CSU06** | Cadastrar Beneficiário | Gestor ou Instrutor | Cadastro Sociodemográfico | 1. O usuário acessa o módulo de beneficiários e clica em novo.<br>2. O sistema abre o formulário de identificação.<br>3. O usuário insere as informações e faz a associação obrigatória a um núcleo familiar válido.<br>4. O usuário confirma a operação.<br>5. O sistema valida as informações e cria o registro no banco. | **FE01 – Vínculo Familiar Ausente:** Se no passo 3 o usuário tentar salvar o cadastro sem associar o beneficiário a um núcleo familiar válido, o sistema impede o salvamento. | **X** |
| **CSU07** | Editar Dados do Beneficiário | Gestor ou Instrutor | Cadastro Sociodemográfico | 1. O usuário busca o beneficiário (Nome/ID) e abre a edição.<br>2. O sistema exibe o cadastro atualizado.<br>3. O usuário realiza as modificações necessárias nas informações.<br>4. O usuário confirma a alteração.<br>5. O sistema grava as mudanças e atualiza a interface imediatamente. | *Não se aplicam fluxos alternativos críticos mapeados nesta capacidade.* | **X** |
| **CSU08** | Cadastrar Turma | Gestor | Frequência e Engajamento | 1. O Gestor solicita a criação de uma nova turma.<br>2. O sistema disponibiliza os campos de preenchimento.<br>3. O Gestor insere nome, define datas/horários e o limite de vagas.<br>4. O Gestor confirma a inclusão.<br>5. O sistema grava os dados e disponibiliza a turma no catálogo. | *Não se aplicam fluxos alternativos críticos mapeados nesta capacidade.* | **X** |
| **CSU09** | Matricular Beneficiário | Gestor ou Instrutor | Frequência e Engajamento | 1. O usuário seleciona o beneficiário e escolhe a turma.<br>2. O sistema verifica a quantidade de vagas restantes na turma.<br>3. O sistema cria o vínculo de matrícula com sucesso.<br>4. A vaga é contabilizada e o nome é inserido na lista de chamada. | **FE01 – Limite de Vagas Excedido:** Se no passo 2 o sistema identificar que a turma atingiu o limite máximo de vagas, a matrícula é bloqueada automaticamente. | **X** |
| **CSU10** | Alterar Registro de Frequência | Gestor | Frequência e Engajamento | 1. O Gestor localiza o diário de classe e solicita a edição de chamada.<br>2. O sistema valida se a aula ocorreu dentro do limite de 72 horas.<br>3. O Gestor altera a frequência e insere a justificativa textual.<br>4. O Gestor confirma a operação.<br>5. O sistema atualiza o registro de presença no banco de dados. | **FE01 – Janela de Tempo Expirada:** Se a aula ocorreu há mais de 72 horas no passo 2, a edição é bloqueada de forma automática na interface e o fluxo encerra.<br>**FE02 – Justificativa Ausente:** Se no passo 3 a justificativa não for preenchida, o sistema barra o salvamento. | **X** |
| **CSU11** | Registrar Falta Justificada | Instrutor | Frequência e Engajamento | 1. Na tela de chamada, o Instrutor altera a falta para "Justificada".<br>2. O sistema exige a anotação do motivo da justificativa.<br>3. O Instrutor insere os dados e confirma.<br>4. O sistema salva a falta com o marcador específico no banco.<br>5. A ausência não conta negativamente para a evasão escolar. | *Não se aplicam fluxos alternativos críticos mapeados nesta capacidade.* | **X** |
| **CSU12** | Registrar Presença em Lote | Instrutor | Frequência e Engajamento | 1. O Instrutor seleciona a turma e abre a chamada do dia.<br>2. O sistema lista todos os beneficiários matriculados na turma.<br>3. O Instrutor assinala a situação (presença/falta) de todos em lote.<br>4. O Instrutor confirma o envio da chamada.<br>5. O sistema salva os registros simultaneamente no banco de dados. | **FE01 – Bloqueio de Data Inválida:** Se tentar abrir a chamada em uma data retroativa ou futura no passo 1, o sistema barra o lançamento por regra de negócio. | |
| **CSU13** | Emitir Alertas de Evasão | Sistema (Automático) | Monitoramento de Evasão | 1. O Sistema executa de forma automática a rotina de varredura.<br>2. Identifica beneficiários com 3 faltas seguidas ou 5 alternadas.<br>3. O Sistema gera internamente um alerta de risco de evasão.<br>4. Renderiza e exibe o alerta visual nos painéis gerenciais. | *Não se aplicam fluxos alternativos críticos mapeados nesta capacidade.* | |
| **CSU14** | Consultar Histórico do Beneficiário | Usuário do Sistema | Monitoramento de Evasão | 1. O usuário busca um beneficiário e solicita o histórico consolidado.<br>2. O sistema realiza a busca cruzada de dados no banco.<br>3. Exibe uma linha do tempo cronológica com presenças acumuladas, alertas de risco emitidos e matrículas atuais/anteriores. | *Não se aplicam fluxos alternativos críticos mapeados nesta capacidade.* | |
| **CSU15** | Gerar Relatório de Frequência | Gestor | Relatórios e Transparência | 1. O Gestor acessa o módulo e define os filtros (turma, período).<br>2. O Gestor solicita a exportação de dados.<br>3. O sistema processa aplicando estritamente as restrições.<br>4. Gera o arquivo em formato CSV com delimitadores externos.<br>5. O download do arquivo é iniciado de forma automática. | *Não se aplicam fluxos alternativos críticos mapeados nesta capacidade.* | |
| **CSU16** | Inativar Instrutor | Gestor | Gestão de Instrutores | 1. O Gestor localiza o perfil do instrutor e aciona a opção de inativação.<br>2. O sistema solicita a confirmação da operação.<br>3. O Gestor confirma o procedimento.<br>4. O sistema altera o status do usuário para "Inativo" no banco de dados.<br>5. O sistema revoga e bloqueia imediatamente qualquer tentativa de autenticação ou sessão activa pertencente ao instrutor inativado. | **FE01 – Restrição de Login:** Tentativas de acesso à plataforma de usuários inativados devem ser recusadas na barreira de segurança de forma imediata. | |
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
