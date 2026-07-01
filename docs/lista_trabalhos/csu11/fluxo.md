# SGES
## CSU11 (RF13) — Registrar falta justificada

[Matriz de Priorização](../../matriz_de_acao_e_priorizacao.md) <br>
[Andamento](../andamento.md) <br>
[Cronograma e Planejamento](../../cronograma_e_entregas.md#tabela-de-cronograma-e-planejamento)


---

### Objetivo:
Lançar e registrar o abono de ausências de beneficiários no diário de classe mediante justificativas aceitas.

### Ator principal:
Instrutor

### Atores secundários:
Nenhum

### Pré-condições:
O Instrutor está autenticado e o beneficiário possui uma falta registrada na data do abono.

### Fluxo principal:
1. O Instrutor seleciona o beneficiário que faltou a uma aula específica. (FE-1-A)
2. O Instrutor solicita o registrar uma justificativa de falta. (FE-2-A)
3. O sistema solicita a justificativa de falta.
4. O Instrutor preenche a justificativa e confirma a operação. (FE-4-A)
5. O sistema altera o status da falta daquele dia no banco de dados. (RN11-01; FE-5-A)
6. O sistema exibe uma mensagem de confirmação de sucesso.

### Fluxos alternativos:
Não há fluxos alternativos identificados.

### Fluxos de exceção:

#### FE-1-A — Item Inexistente (Beneficiário)

Este fluxo inicia no passo 1 do fluxo principal. Se o beneficiário não for encontrado no cadastro do sistema, a operação é encerrada com erro. O caso de uso é encerrado.

#### FE-2-A — Item Inexistente (Registro de Ausência)

Este fluxo inicia no passo 2 do fluxo principal. Se o aluno não tiver falta registrada no diário para a data informada, o sistema impede a inserção do abono indicando que não há ausência cadastrada. O caso de uso é encerrado.

#### FE-4-A — Justificativa Vazia

Este fluxo inicia no passo 4 do fluxo principal. Se a justificativa informada for vazia ou inválida, o sistema impede a gravação, exibe mensagem de erro e solicita o preenchimento. O fluxo retorna ao passo 3 do fluxo principal.

#### FE-5-A — Falha de Persistência

Este fluxo inicia no passo 5 do fluxo principal. Se ocorrer uma falha ao gravar o status ou a justificativa no banco de dados, a operação é revertida e exibe mensagem de erro. O caso de uso é encerrado.

### Regras de negócio:
#### RN11-01 — Desconsideração em Evasão
Ausências registradas com justificativa aceita não contabilizam negativamente para a geração dos alertas de risco de evasão escolar.

### Pós-condições:
A falta do beneficiário é marcada como Justificada e não será contabilizada nos indicadores de risco de evasão.
