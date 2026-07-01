# SGES
## CSU09 (RF10) — Matricular beneficiário

[Matriz de Priorização](../../matriz_de_acao_e_priorizacao.md) <br>
[Andamento](../andamento.md) <br>
[Cronograma e Planejamento](../../planejamento_organizacao/cronograma_e_entregas.md#tabela-de-cronograma-e-planejamento)


---

### Objetivo:
Vincular um beneficiário cadastrado e ativo a uma turma específica, realizando o abatimento das vagas disponíveis.

### Ator principal:
Gestor / Instrutor

### Atores secundários:
Nenhum

### Pré-condições:
O usuário deve estar autenticado; a turma e o beneficiário devem estar ativos.

### Fluxo principal:
1. O usuário seleciona a turma desejada e solicita a realização de matrícula. (FE-1-A)
2. O sistema apresenta um campo de busca para selecionar o beneficiário.
3. O usuário localiza o beneficiário ativo e confirma a operação.
4. O sistema valida se o beneficiário já possui matrícula na turma e se a turma possui vagas em aberto. (RN09-01; RN09-02; RN09-03; FE-4-A; FE-4-B; FE-4-C) 
5. O sistema cria o registro de vínculo da matrícula e subtrai uma vaga disponível no limite da turma. (FE-5-A)
6. O sistema exibe mensagem de confirmação de matrícula efetuada com sucesso.

### Fluxos alternativos:
Não há fluxos alternativos identificados.

### Fluxos de exceção:

#### FE-1-A — Item Inexistente (Turma)

Este fluxo inicia no passo 1 do fluxo principal. Se a turma selecionada para matrícula não constar mais no sistema (ex: removida por outro gestor), a tela é recarregada mostrando mensagem de erro. O caso de uso é encerrado.

#### FE-4-A — Item Inexistente (Beneficiário)

Este fluxo inicia no passo 4 do fluxo principal. Se o beneficiário selecionado não for encontrado na base de dados, a matrícula é cancelada exibindo erro. O fluxo retorna ao passo 2 do fluxo principal.

#### FE-4-B — Limite de Vagas Excedido

Este fluxo inicia no passo 4 do fluxo principal. Se a turma não possuir vagas livres, o sistema bloqueia novas matrículas e emite um alerta informando que a turma está lotada. O caso de uso é encerrado.

#### FE-4-C — Beneficiário já Matriculado

Este fluxo inicia no passo 4 do fluxo principal. Se o beneficiário selecionado já possuir matrícula ativa na turma escolhida, o sistema cancela a operação e informa a duplicidade. O caso de uso é encerrado.

#### FE-5-A — Falha de Persistência

Este fluxo inicia no passo 5 do fluxo principal. Se ocorrer uma falha ao persistir a matrícula no banco de dados, o sistema impede a gravação e restaura o saldo de vagas anterior da turma. O caso de uso é encerrado.

### Regras de negócio:
#### RN09-01 — Respeito ao Limite de Vagas
O sistema deve impedir a matrícula se a quantidade de vagas disponíveis na turma for zero.

#### RN09-02 — Status dos Envolvidos
Beneficiário e Turma devem estar com status ativo para a realização da matrícula.

#### RN09-03 — Unicidade de Matrícula
O beneficiário não pode ser matriculado mais de uma vez na mesma turma.

### Pós-condições:
O vínculo de matrícula é criado no banco de dados e o saldo de vagas da turma é atualizado.
