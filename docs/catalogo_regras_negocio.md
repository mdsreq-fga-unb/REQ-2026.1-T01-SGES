# Catálogo Formal de Regras de Negócio (RN)

## 6. Regras de Negócio

Este documento consolida **todas as regras de negócio** do sistema SGES em um catálogo formal, extraídas dos Casos de Uso do Sistema (CSUs) e dos Requisitos Funcionais (RFs). As regras definem as políticas operacionais que governam o comportamento do sistema, independentemente de tecnologia ou implementação.

### 6.1. Classificação por Domínio

As regras são agrupadas conforme a Característica do Produto (CP) à qual pertencem:

| Sigla   | Domínio                         |
| :------ | :------------------------------ |
| **CP1** | Segurança e Controle de Acessos |
| **CP2** | Gestão de Instrutores           |
| **CP3** | Cadastro de Beneficiários       |
| **CP4** | Frequência e Engajamento        |
| **CP5** | Monitoramento de Evasão         |
| **CP6** | Relatórios e Transparência      |

---

## 6.2. CP1 — Segurança e Controle de Acessos

| ID                             | Nome da Regra                             | Descrição                                                                                                                                                                                     | Origem                              | Tipo       |
| :----------------------------- | :---------------------------------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :---------------------------------- | :--------- |
| **RN01-01**                    | Validação de Credenciais                  | O acesso ao sistema só é concedido mediante a correspondência exata do e-mail cadastrado e da senha criptografada (hash).                                                                     | [CSU01](lista_trabalhos/csu01/fluxo.md) ([RF01](lista_requisitos.md#rf01))                        | Validação  |
| **RN01-02** $\text{implícita}$ | Bloqueio por Tentativas Consecutivas      | Após **5 tentativas falhas consecutivas** de login, a conta do usuário é automaticamente bloqueada e o evento é registrado na trilha de auditoria.                                            | [CSU01](lista_trabalhos/csu01/fluxo.md) ([RF01](lista_requisitos.md#rf01))                        | Segurança  |
| **RN01-03** $\text{implícita}$ | Bloqueio de Contas Inativas               | Contas com status inativo ou sem perfil de permissão válido são impedidas de autenticar no sistema.                                                                                           | [CSU01](lista_trabalhos/csu01/fluxo.md) ([RF01](lista_requisitos.md#rf01))                        | Segurança  |
| **RN02-01**                    | Validação de Conta Ativa para Redefinição | O código de recuperação de senha só é gerado para e-mails associados a contas com status ativo no sistema.                                                                                    | [CSU02](lista_trabalhos/csu02/fluxo.md) ([RF02](lista_requisitos.md#rf02))                        | Validação  |
| **RN02-02**                    | Expiração do Código de Redefinição        | O código temporário de redefinição de senha expira automaticamente após **30 minutos** de sua geração.                                                                                        | [CSU02](lista_trabalhos/csu02/fluxo.md) ([RF02](lista_requisitos.md#rf02))                        | Temporal   |
| **RN02-03**                    | Prazo de Envio de E-mail de Redefinição   | O e-mail contendo o código de redefinição deve ser enviado ao usuário em no **máximo 1 minuto** após a solicitação.                                                                           | [CSU02](lista_trabalhos/csu02/fluxo.md) ([RF02](lista_requisitos.md#rf02))                        | Desempenho |
| **RN02-04**                    | Prevenção de Enumeração de Usuários       | Se o e-mail informado para redefinição não existir na base, o sistema exibe a mesma mensagem de sucesso padrão (sem enviar e-mail), impedindo a descoberta de usuários válidos por varredura. | [CSU02](lista_trabalhos/csu02/fluxo.md) ([RF02](lista_requisitos.md#rf02))                        | Segurança  |
| **RN03-01** $\text{implícita}$ | Expiração por Inatividade                 | A sessão do usuário é invalidada automaticamente após **15 minutos consecutivos de inatividade**, exigindo novo login.                                                                        | [CSU03](lista_trabalhos/csu03/fluxo.md) ([RF03](lista_requisitos.md#rf03) / [RNF06](lista_requisitos.md#rnf06)) | Segurança  |

---

## 6.3. CP2 — Gestão de Instrutores

| ID                             | Nome da Regra                         | Descrição                                                                                                                                                      | Origem               | Tipo        |
| :----------------------------- | :------------------------------------ | :------------------------------------------------------------------------------------------------------------------------------------------------------------- | :------------------- | :---------- |
| **RN04-01**                    | Unicidade de E-mail do Instrutor      | O e-mail do instrutor deve ser único na base de dados, impedindo duplicidades no cadastro.                                                                     | [CSU04](lista_trabalhos/csu04/fluxo.md) ([RF04](lista_requisitos.md#rf04))         | Integridade |
| **RN04-02**                    | Campos Obrigatórios do Instrutor      | É obrigatório o preenchimento de **Nome Completo** e **E-mail**, além da definição do **Perfil de Acesso (RBAC)** no cadastro do instrutor.                    | [CSU04](lista_trabalhos/csu04/fluxo.md) ([RF04](lista_requisitos.md#rf04))         | Validação   |
| **RN05-01**                    | Unicidade de E-mail na Edição         | Se o e-mail do instrutor for alterado, o sistema deve garantir que não existam outros usuários com o mesmo e-mail na base.                                     | [CSU05](lista_trabalhos/csu05/fluxo.md) ([RF05](lista_requisitos.md#rf05))         | Integridade |
| **RN05-02**                    | Atualização Imediata de Permissões    | Alterações no perfil de acesso (RBAC) do instrutor entram em vigor imediatamente após a confirmação da edição, refletindo-se em seu acesso corrente.           | [CSU05](lista_trabalhos/csu05/fluxo.md) ([RF05](lista_requisitos.md#rf05))         | Operacional |
| **RN16-01**                    | Revogação de Acessos na Inativação    | A inativação lógica (_soft delete_) de um instrutor acarreta a invalidação imediata de **todas** as suas sessões ativas e impede novas autenticações.          | [CSU16](lista_trabalhos/csu16/fluxo.md) ([RF06](lista_requisitos.md#rf06))         | Segurança   |
| **RN16-02** $\text{implícita}$ | Integridade Referencial na Inativação | A inativação do instrutor é feita por _soft delete_ (exclusão lógica), preservando o histórico de turmas e registros associados ao instrutor na base de dados. | [CSU16](lista_trabalhos/csu16/fluxo.md) ([RF06](lista_requisitos.md#rf06))         | Integridade |

---

## 6.4. CP3 — Cadastro de Beneficiários

| ID                             | Nome da Regra                                | Descrição                                                                                                           | Origem               | Tipo        |
| :----------------------------- | :------------------------------------------- | :------------------------------------------------------------------------------------------------------------------ | :------------------- | :---------- |
| **RN06-01**                    | Campo Obrigatório do Beneficiário            | É obrigatório o preenchimento do **Nome Completo** no cadastro do beneficiário.                                     | [CSU06](lista_trabalhos/csu06/fluxo.md) ([RF07](lista_requisitos.md#rf07))         | Validação   |
| **RN06-02** $\text{implícita}$ | Unicidade de CPF e E-mail do Beneficiário    | O CPF (se fornecido) e o e-mail do beneficiário devem ser únicos na base de dados, impedindo duplicidades.          | [CSU06](lista_trabalhos/csu06/fluxo.md) ([RF07](lista_requisitos.md#rf07))         | Integridade |
| **RN07-01**                    | Preservação de Campos Obrigatórios na Edição | O sistema impede a remoção ou o salvamento de campos obrigatórios vazios durante a edição de dados do beneficiário. | [CSU07](lista_trabalhos/csu07/fluxo.md) ([RF08](lista_requisitos.md#rf08))         | Validação   |

---

## 6.5. CP4 — Frequência e Engajamento

| ID                             | Nome da Regra                                     | Descrição                                                                                                                                                                   | Origem                      | Tipo        |
| :----------------------------- | :------------------------------------------------ | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :-------------------------- | :---------- |
| **RN08-01**                    | Limite de Vagas como Inteiro Positivo             | O limite máximo de vagas de uma turma deve ser definido como um número inteiro **estritamente positivo** (> 0).                                                             | [CSU08](lista_trabalhos/csu08/fluxo.md) ([RF09](lista_requisitos.md#rf09))                | Validação   |
| **RN08-02**                    | Instrutor Deve Estar Ativo                        | O instrutor designado como responsável pela turma deve estar cadastrado e com status **ativo** no sistema.                                                                  | [CSU08](lista_trabalhos/csu08/fluxo.md) ([RF09](lista_requisitos.md#rf09))                | Validação   |
| **RN08-03**                    | Prevenção de Conflito de Horário do Instrutor     | O sistema deve impedir a alocação de um mesmo instrutor em turmas distintas que ocorram no **mesmo dia e mesma faixa de horário**.                                          | [CSU08](lista_trabalhos/csu08/fluxo.md) ([RF09](lista_requisitos.md#rf09))                | Integridade |
| **RN08-04** $\text{implícita}$ | Prevenção de Duplicidade de Turma                 | O sistema bloqueia a criação de uma turma com o **mesmo nome, horários, dias da semana e semestre letivo** de uma turma já ativa, evitando duplicidade.                     | [CSU08](lista_trabalhos/csu08/fluxo.md) ([RF09](lista_requisitos.md#rf09))                | Integridade |
| **RN09-01**                    | Respeito ao Limite de Vagas na Matrícula          | O sistema impede a matrícula de um beneficiário se a quantidade de vagas disponíveis na turma for **zero**.                                                                 | [CSU09](lista_trabalhos/csu09/fluxo.md) ([RF10](lista_requisitos.md#rf10))                | Operacional |
| **RN09-02**                    | Status Ativo dos Envolvidos na Matrícula          | Tanto o **beneficiário** quanto a **turma** devem estar com status ativo para que a matrícula seja realizada.                                                               | [CSU09](lista_trabalhos/csu09/fluxo.md) ([RF10](lista_requisitos.md#rf10))                | Validação   |
| **RN09-03**                    | Unicidade de Matrícula por Turma                  | Um mesmo beneficiário **não pode** ser matriculado mais de uma vez na mesma turma.                                                                                          | [CSU09](lista_trabalhos/csu09/fluxo.md) ([RF10](lista_requisitos.md#rf10))                | Integridade |
| **RN10-01**                    | Prazo Limite para Edição Retroativa de Frequência | A alteração de presenças ou faltas passadas só é permitida em até **72 horas** após a data de ocorrência da aula. Após esse prazo, a edição é bloqueada.                    | [CSU10](lista_trabalhos/csu10/fluxo.md) ([RF12](lista_requisitos.md#rf12))                | Temporal    |
| **RN10-02**                    | Obrigatoriedade de Justificativa na Retificação   | É obrigatório o registro de uma **justificativa textual** para qualquer alteração retroativa de frequência, a qual é armazenada na trilha de auditoria.                     | [CSU10](lista_trabalhos/csu10/fluxo.md) ([RF12](lista_requisitos.md#rf12))                | Auditoria   |
| **RN11-01**                    | Desconsideração de Falta Justificada na Evasão    | Ausências registradas com justificativa aceita (falta justificada) **não contabilizam** negativamente para os indicadores e alertas de risco de evasão escolar.             | [CSU11](lista_trabalhos/csu11/fluxo.md) ([RF13](lista_requisitos.md#rf13))                | Operacional |
| **RN11-02** $\text{implícita}$ | Restrições de Upload de Comprovante               | O upload de comprovante de falta justificada é limitado a arquivos de **até 5 MB** nos formatos **PDF, JPG ou PNG**.                                                        | [CSU11](lista_trabalhos/csu11/fluxo.md) ([RF13](lista_requisitos.md#rf13))                | Validação   |
| **RN12-01**                    | Registro de Chamada Restrito à Data Atual         | O lançamento direto da chamada (presença em lote) é restrito **estritamente à data atual** do servidor. Datas retroativas ou futuras são bloqueadas para o Instrutor.       | [CSU12](lista_trabalhos/csu12/fluxo.md) ([RF11](lista_requisitos.md#rf11))                | Temporal    |
| **RN12-02**                    | Falta Trabalho (FT) Conta como Presença           | O status **"Falta Trabalho" (FT)** é computado como **presença** no cálculo de engajamento e frequência do aluno.                                                           | [CSU12](lista_trabalhos/csu12/fluxo.md) ([RF11](lista_requisitos.md#rf11))                | Operacional |
| **RN12-03**                    | Envio de E-mail de Aviso de Falta                 | Ao registrar **falta simples (F)** para um beneficiário, o sistema dispara automaticamente um e-mail de aviso. Nenhum e-mail é enviado para o status "Falta Trabalho" (FT). | [CSU12](lista_trabalhos/csu12/fluxo.md) ([RF11](lista_requisitos.md#rf11))                | Operacional |

---

## 6.6. CP5 — Monitoramento de Evasão

| ID          | Nome da Regra                         | Descrição                                                                                                                                                                                                       | Origem       | Tipo         |
| :---------- | :------------------------------------ | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :----------- | :----------- |
| **RN13-01** | Alerta de Atenção por 2 Faltas        | O sistema emite automaticamente um **alerta de atenção** no painel do Gestor e do Instrutor quando o beneficiário atinge **2 faltas não justificadas** na mesma turma.                                          | [CSU13](lista_trabalhos/csu13/fluxo.md) ([RF14](lista_requisitos.md#rf14)) | Operacional  |
| **RN13-02** | Evasão por 3 Faltas                   | O sistema altera automaticamente o status do beneficiário para **"Evadido"** (bloqueio/necessidade de refazer o curso) ao atingir **3 ou mais faltas não justificadas** na mesma turma.                         | [CSU13](lista_trabalhos/csu13/fluxo.md) ([RF14](lista_requisitos.md#rf14)) | Operacional  |
| **RN14-01** | Consolidação Cronológica do Histórico | O histórico do beneficiário deve apresentar, em **ordem cronológica**, todas as turmas das quais participou, as faltas detalhadas (com indicação se foram justificadas ou não) e os alertas de evasão emitidos. | [CSU14](lista_trabalhos/csu14/fluxo.md) ([RF15](lista_requisitos.md#rf15)) | Apresentação |

---

## 6.7. CP6 — Relatórios e Transparência

| ID                             | Nome da Regra                           | Descrição                                                                                                                                                                         | Origem                       | Tipo         |
| :----------------------------- | :-------------------------------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :--------------------------- | :----------- |
| **RN15-01**                    | Métricas do Fluxo de Ciclo              | O relatório visual de ciclo deve computar e exibir graficamente a proporção de alunos **inscritos**, **desistentes** (evadidos) e **aprovados/concluintes** por turma ou período. | [CSU15](lista_trabalhos/csu15/fluxo.md) ([RF16](lista_requisitos.md#rf16))                 | Apresentação |
| **RN15-02** $\text{implícita}$ | Mascaramento de Dados em Exportação CSV | Dados de identificação pessoal (CPF, contatos) devem ser **ofuscados/mascarados** nos relatórios CSV exportados (ex: `***.123.***-##` para CPF), em conformidade com a LGPD.      | [CSU15](lista_trabalhos/csu15/fluxo.md) ([RF16](lista_requisitos.md#rf16) / [RNF03](lista_requisitos.md#rnf03)) | Segurança    |

---

## 6.8. Matriz de Rastreabilidade: Regras de Negócio × Casos de Uso

| Regra de Negócio           | CSU                                         | Requisito Funcional | CP  |
| :------------------------- | :------------------------------------------ | :------------------ | :-- |
| RN01-01                    | [CSU01 — Autenticar usuário](lista_trabalhos/csu01/fluxo.md)                  | [RF01](lista_requisitos.md#rf01)                | CP1 |
| RN01-02 $\text{implícita}$ | [CSU01 — Autenticar usuário](lista_trabalhos/csu01/fluxo.md)                  | [RF01](lista_requisitos.md#rf01)                | CP1 |
| RN01-03 $\text{implícita}$ | [CSU01 — Autenticar usuário](lista_trabalhos/csu01/fluxo.md)                  | [RF01](lista_requisitos.md#rf01)                | CP1 |
| RN02-01                    | [CSU02 — Redefinir senha de acesso](lista_trabalhos/csu02/fluxo.md)           | [RF02](lista_requisitos.md#rf02)                | CP1 |
| RN02-02                    | [CSU02 — Redefinir senha de acesso](lista_trabalhos/csu02/fluxo.md)           | [RF02](lista_requisitos.md#rf02)                | CP1 |
| RN02-03                    | [CSU02 — Redefinir senha de acesso](lista_trabalhos/csu02/fluxo.md)           | [RF02](lista_requisitos.md#rf02)                | CP1 |
| RN02-04                    | [CSU02 — Redefinir senha de acesso](lista_trabalhos/csu02/fluxo.md)           | [RF02](lista_requisitos.md#rf02)                | CP1 |
| RN03-01 $\text{implícita}$ | [CSU03 — Encerrar sessão](lista_trabalhos/csu03/fluxo.md)                     | [RF03](lista_requisitos.md#rf03)                | CP1 |
| RN04-01                    | [CSU04 — Cadastrar instrutor](lista_trabalhos/csu04/fluxo.md)                 | [RF04](lista_requisitos.md#rf04)                | CP2 |
| RN04-02                    | [CSU04 — Cadastrar instrutor](lista_trabalhos/csu04/fluxo.md)                 | [RF04](lista_requisitos.md#rf04)                | CP2 |
| RN05-01                    | [CSU05 — Editar perfil do instrutor](lista_trabalhos/csu05/fluxo.md)          | [RF05](lista_requisitos.md#rf05)                | CP2 |
| RN05-02                    | [CSU05 — Editar perfil do instrutor](lista_trabalhos/csu05/fluxo.md)          | [RF05](lista_requisitos.md#rf05)                | CP2 |
| RN06-01                    | [CSU06 — Cadastrar beneficiário](lista_trabalhos/csu06/fluxo.md)              | [RF07](lista_requisitos.md#rf07)                | CP3 |
| RN06-02 $\text{implícita}$ | [CSU06 — Cadastrar beneficiário](lista_trabalhos/csu06/fluxo.md)              | [RF07](lista_requisitos.md#rf07)                | CP3 |
| RN07-01                    | [CSU07 — Editar dados do beneficiário](lista_trabalhos/csu07/fluxo.md)        | [RF08](lista_requisitos.md#rf08)                | CP3 |
| RN08-01                    | [CSU08 — Cadastrar turma](lista_trabalhos/csu08/fluxo.md)                     | [RF09](lista_requisitos.md#rf09)                | CP4 |
| RN08-02                    | [CSU08 — Cadastrar turma](lista_trabalhos/csu08/fluxo.md)                     | [RF09](lista_requisitos.md#rf09)                | CP4 |
| RN08-03                    | [CSU08 — Cadastrar turma](lista_trabalhos/csu08/fluxo.md)                     | [RF09](lista_requisitos.md#rf09)                | CP4 |
| RN08-04 $\text{implícita}$ | [CSU08 — Cadastrar turma](lista_trabalhos/csu08/fluxo.md)                     | [RF09](lista_requisitos.md#rf09)                | CP4 |
| RN09-01                    | [CSU09 — Matricular beneficiário](lista_trabalhos/csu09/fluxo.md)             | [RF10](lista_requisitos.md#rf10)                | CP4 |
| RN09-02                    | [CSU09 — Matricular beneficiário](lista_trabalhos/csu09/fluxo.md)             | [RF10](lista_requisitos.md#rf10)                | CP4 |
| RN09-03                    | [CSU09 — Matricular beneficiário](lista_trabalhos/csu09/fluxo.md)             | [RF10](lista_requisitos.md#rf10)                | CP4 |
| RN10-01                    | [CSU10 — Alterar registro de frequência](lista_trabalhos/csu10/fluxo.md)      | [RF12](lista_requisitos.md#rf12)                | CP4 |
| RN10-02                    | [CSU10 — Alterar registro de frequência](lista_trabalhos/csu10/fluxo.md)      | [RF12](lista_requisitos.md#rf12)                | CP4 |
| RN11-01                    | [CSU11 — Registrar falta justificada](lista_trabalhos/csu11/fluxo.md)         | [RF13](lista_requisitos.md#rf13)                | CP4 |
| RN11-02 $\text{implícita}$ | [CSU11 — Registrar falta justificada](lista_trabalhos/csu11/fluxo.md)         | [RF13](lista_requisitos.md#rf13)                | CP4 |
| RN12-01                    | [CSU12 — Registrar presença em lote](lista_trabalhos/csu12/fluxo.md)          | [RF11](lista_requisitos.md#rf11)                | CP4 |
| RN12-02                    | [CSU12 — Registrar presença em lote](lista_trabalhos/csu12/fluxo.md)          | [RF11](lista_requisitos.md#rf11)                | CP4 |
| RN12-03                    | [CSU12 — Registrar presença em lote](lista_trabalhos/csu12/fluxo.md)          | [RF11](lista_requisitos.md#rf11)                | CP4 |
| RN13-01                    | [CSU13 — Emitir alerta de evasão](lista_trabalhos/csu13/fluxo.md)             | [RF14](lista_requisitos.md#rf14)                | CP5 |
| RN13-02                    | [CSU13 — Emitir alerta de evasão](lista_trabalhos/csu13/fluxo.md)             | [RF14](lista_requisitos.md#rf14)                | CP5 |
| RN14-01                    | [CSU14 — Consultar histórico do beneficiário](lista_trabalhos/csu14/fluxo.md) | [RF15](lista_requisitos.md#rf15)                | CP5 |
| RN15-01                    | [CSU15 — Gerar relatório de frequência](lista_trabalhos/csu15/fluxo.md)       | [RF16](lista_requisitos.md#rf16)                | CP6 |
| RN15-02 $\text{implícita}$ | [CSU15 — Gerar relatório de frequência](lista_trabalhos/csu15/fluxo.md)       | [RF16](lista_requisitos.md#rf16)                | CP6 |
| RN16-01                    | [CSU16 — Inativar instrutor](lista_trabalhos/csu16/fluxo.md)                  | [RF06](lista_requisitos.md#rf06)                | CP2 |
| RN16-02 $\text{implícita}$ | [CSU16 — Inativar instrutor](lista_trabalhos/csu16/fluxo.md)                  | [RF06](lista_requisitos.md#rf06)                | CP2 |

---

## 6.9. Recomendações

1. **Manter o catálogo como fonte única de verdade:** Toda regra de negócio deve ser referenciada neste catálogo. Os CSUs devem referenciar as RNs aqui definidas, e não o contrário.
2. **Formalizar as regras implícitas:** As 10 regras marcadas como $\text{implícita}$ devem ser promovidas a RNs formais nos respectivos CSUs na próxima iteração de documentação.
3. **Resolver a divergência RN02-02:** Alinhar o tempo de expiração do token de redefinição de senha entre o [RF02](lista_requisitos.md#rf02) e o [CSU02](lista_trabalhos/csu02/fluxo.md).
4. **Versionar o catálogo:** Cada alteração em regras de negócio deve ser registrada com data, autor e justificativa, assim como os demais artefatos de requisitos.
5. **Vincular ao DoR:** Incluir a verificação de que toda RN está catalogada e referenciada como critério adicional no _Definition of Ready_.
