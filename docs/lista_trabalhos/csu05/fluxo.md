# SGES
## CSU05 (RF05) — Editar perfil do instrutor

[Matriz de Priorização](../../matriz_de_acao_e_priorizacao.md) <br>
[Andamento](../andamento.md) <br>
[Cronograma e Planejamento](../../planejamento_organizacao/cronograma_e_entregas.md#tabela-de-cronograma-e-planejamento)


---

### Objetivo:
Permitir a edição das informações de contato e a atualização das permissões de acesso associadas ao instrutor.

### Ator principal:
Gestor

### Atores secundários:
Nenhum

### Pré-condições:
O Gestor está autenticado e o instrutor a ser editado já existe no sistema.

### Fluxo principal:
1. O Gestor acessa a lista de instrutores e seleciona o instrutor que deseja editar. (FE-1-A; FE-1-B)
2. O sistema exibe os dados atuais do instrutor no formulário.
3. O Gestor edita os campos necessários e confirma a operação.
4. O sistema valida a conformidade dos dados e a unicidade do E-mail (se alterado). (RN05-01; FE-4-A; FE-4-B)
5. O sistema salva as atualizações no banco de dados, aplicando-as de forma imediata e gerando o log. (RN05-02; RNF02; FE-5-A)
6. O sistema exibe uma mensagem de sucesso e atualiza imediatamente as permissões ativas do instrutor.

### Fluxos alternativos:
Não há fluxos alternativos identificados.

### Fluxos de exceção:
#### FE-1-A — Permissão Insuficiente

Este fluxo inicia no passo 1 do fluxo principal. Se o usuário conectado não tiver privilégios de Gestor, o sistema exibe mensagem de erro e bloqueia o acesso à funcionalidade. O caso de uso é encerrado.

#### FE-1-B — Item Inexistente

Este fluxo inicia no passo 1 do fluxo principal. Se o instrutor selecionado não for encontrado na base de dados (ex: excluído por outro gestor concomitantemente), o sistema exibe um aviso de erro e recarrega a listagem. O caso de uso é encerrado.

#### FE-4-A — Formato de Dados Inválido

Este fluxo inicia no passo 4 do fluxo principal. Se os dados inseridos violarem as regras de formato do sistema, o sistema exibe mensagens de erro de validação e mantém as informações anteriores. O fluxo retorna ao passo 3 do fluxo principal.

#### FE-4-B — E-mail já em Uso

Este fluxo inicia no passo 4 do fluxo principal. Se o e-mail informado já estiver cadastrado para outro usuário, o sistema impede o salvamento, exibe mensagem de erro de duplicidade e mantém as informações anteriores. O fluxo retorna ao passo 3 do fluxo principal.

#### FE-5-A — Falha de Persistência

Este fluxo inicia no passo 5 do fluxo principal. Se houver falha na persistência com a base de dados, a operação de edição é cancelada e os dados anteriores são mantidos. O caso de uso é encerrado.

### Regras de negócio:
#### RN05-01 — Unicidade de E-mail
Se o E-mail for alterado, o sistema deve garantir que não existam outros usuários cadastrados com as mesmas credenciais.

#### RN05-02 — Atualização Imediata de Permissões
Alterações no perfil de acesso (RBAC) do instrutor devem ser refletidas e entrar em vigor imediatamente.

### Requisitos não funcionais:
#### RNF02 — Trilha de Auditoria
Modificações cadastrais e de permissões de instrutores devem registrar logs automáticos para fins de auditoria.

### Pós-condições:
As alterações cadastrais e as novas permissões do instrutor são salvas no banco de dados e entram em vigor imediatamente.
