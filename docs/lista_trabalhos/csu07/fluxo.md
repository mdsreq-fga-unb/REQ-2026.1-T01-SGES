# SGES
## CSU07 (RF08) — Editar dados do beneficiário

[Matriz de Priorização](../../matriz_de_acao_e_priorizacao.md) <br>
[Andamento](../andamento.md) <br>
[Cronograma e Planejamento](../../cronograma_e_entregas.md#tabela-de-cronograma-e-planejamento)


---

### Objetivo:
Atualizar os dados cadastrais e as informações de contato do beneficiário no sistema.

### Ator principal:
Gestor / Instrutor

### Atores secundários:
Nenhum

### Pré-condições:
O usuário está autenticado e o beneficiário a ser editado já se encontra registrado no sistema.

### Fluxo principal:
1. O usuário busca pelo beneficiário desejado no sistema e abre sua ficha cadastral. (FE-1-A)
2. O usuário edita os campos necessários no formulário.
3. O usuário confirma a operação.
4. O sistema valida a conformidade das informações atualizadas. (RN07-01; FE-4-A; FE-4-B)
5. O sistema persiste os novos dados na base de dados aplicando as devidas proteções. (RNF01; FE-5-A)
6. O sistema exibe mensagem de sucesso e atualiza a exibição com os dados modificados.

### Fluxos alternativos:
Não há fluxos alternativos identificados.

### Fluxos de exceção:

#### FE-1-A — Item Inexistente

Este fluxo inicia no passo 1 do fluxo principal. Se o beneficiário selecionado não for encontrado na base de dados, o sistema interrompe a edição e exibe um erro de registro inexistente. O caso de uso é encerrado.

#### FE-4-A — Remoção de Informação Obrigatória

Este fluxo inicia no passo 4 do fluxo principal. Se alguma informação obrigatória for removida deixando o campo em branco, o sistema impede o salvamento e solicita o preenchimento. O fluxo retorna ao passo 2 do fluxo principal.

#### FE-4-B — Formato de Dados Incorreto

Este fluxo inicia no passo 4 do fluxo principal. Se o e-mail estiver em formato inválido, o sistema impede o salvamento e solicita a correção. O fluxo retorna ao passo 2 do fluxo principal.

#### FE-5-A — Falha de Persistência

Este fluxo inicia no passo 5 do fluxo principal. Se ocorrer uma falha ao persistir a ficha editada no banco de dados, o sistema cancela a edição e exibe uma mensagem de erro. O caso de uso é encerrado.

### Regras de negócio:
#### RN07-01 — Preservação de Campos Obrigatórios
O sistema impede a remoção ou salvamento de campos obrigatórios vazios na edição de beneficiários.

### Requisitos não funcionais:
#### RNF01 — Criptografia Sensível
Atualizações de dados pessoais devem manter os padrões de segurança e proteção de dados.

### Pós-condições:
Os novos dados cadastrais e de contato do beneficiário são consolidados e atualizados na base de dados.
