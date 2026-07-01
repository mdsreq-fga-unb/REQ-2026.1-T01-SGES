# SGES
## CSU10 (RF12) — Alterar registro de frequência

[Matriz de Priorização](../../matriz_de_acao_e_priorizacao.md) <br>
[Andamento](../andamento.md) <br>
[Cronograma e Planejamento](../../planejamento_organizacao/cronograma_e_entregas.md#tabela-de-cronograma-e-planejamento)


---

### Objetivo:
Permitir ao Gestor a correção retroativa de faltas ou presenças já salvas, respeitando o limite temporal de 72 horas após a ocorrência da aula.

### Ator principal:
Gestor

### Atores secundários:
Nenhum

### Pré-condições:
O Gestor está autenticado e o registro de chamada original deve existir.

### Fluxo principal:
1. O Gestor acessa o diário de classe de uma turma e seleciona uma aula passada para edição. (FE-1-A)
2. O sistema valida se o prazo regulamentar ainda está válido. (RN10-01; FE-2-A)
3. O Gestor altera o registro de presença/falta de um ou mais beneficiários. (FE-3-A)
4. O Gestor digita obrigatoriamente a justificativa para a alteração retroativa. (RN10-02)
5. O Gestor confirma a operação.
6. O sistema persiste a alteração de frequência e a justificativa para auditoria no banco de dados. (RNF02; FE-6-A; FE-6-B)
7. O sistema exibe uma mensagem de confirmação de alteração efetuada.

### Fluxos alternativos:
Não há fluxos alternativos identificados.

### Fluxos de exceção:

#### FE-1-A — Item Inexistente (Aula/Chamada)

Este fluxo inicia no passo 1 do fluxo principal. Se a aula ou o diário de frequência selecionado não existirem no sistema, a ação é interrompida com erro. O caso de uso é encerrado.

#### FE-2-A — Prazo de 72 Horas Excedido

Este fluxo inicia no passo 2 do fluxo principal. Se a aula selecionada ocorreu há mais de 72 horas, o sistema bloqueia automaticamente a edição dos campos de frequência e exibe um aviso informando que o prazo para alteração foi expirado. O caso de uso é encerrado.

#### FE-3-A — Item Inexistente (Beneficiário)

Este fluxo inicia no passo 3 do fluxo principal. Se o beneficiário cuja frequência se tenta alterar não estiver mais matriculado na turma, o sistema bloqueia a alteração com erro. O fluxo retorna ao passo 3 do fluxo principal.

#### FE-6-A — Justificativa Não Informada

Este fluxo inicia no passo 6 do fluxo principal. Se o Gestor tentar salvar a modificação sem preencher a justificativa da alteração, o sistema impede a gravação e exige o preenchimento do campo. O fluxo retorna ao passo 4 do fluxo principal.

#### FE-6-B — Falha de Persistência

Este fluxo inicia no passo 6 do fluxo principal. Se houver falha de banco de dados ao salvar a retificação, o sistema cancela a atualização e mantém o diário de classe original. O caso de uso é encerrado.

### Regras de negócio:
#### RN10-01 — Prazo Limite para Edição Retroativa
A alteração de presenças ou faltas passadas só é permitida em até 72 horas após a ocorrência da aula.

#### RN10-02 — Obrigatoriedade de Justificativa
É obrigatório o registro de uma justificativa textual para qualquer alteração retroativa de frequência.

### Requisitos não funcionais:
#### RNF02 — Trilha de Auditoria
Toda retificação de chamada deve registrar logs históricos contendo o valor anterior, o novo valor, a justificativa e o ID do Gestor.

### Pós-condições:
A chamada é retificada no banco de dados e a justificativa inserida é salva na trilha de auditoria.
