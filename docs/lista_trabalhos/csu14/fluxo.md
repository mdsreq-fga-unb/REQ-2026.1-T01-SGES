# SGES
## CSU14 (RF15) — Consultar histórico do beneficiário

[Matriz de Priorização](../../matriz_de_acao_e_priorizacao.md) <br>
[Andamento](../andamento.md) <br>
[Cronograma e Planejamento](../../planejamento_organizacao/cronograma_e_entregas.md#tabela-de-cronograma-e-planejamento)


---

### Objetivo:
Visualizar a ficha cadastral do beneficiário com a linha do tempo consolidada contendo matrículas, frequência detalhada e histórico de alertas.

### Ator principal:
Usuário autenticado

### Atores secundários:
Nenhum

### Pré-condições:
O usuário deve estar autenticado no sistema.

### Fluxo principal:
1. O usuário pesquisa um beneficiário por nome ou CPF no sistema.
2. O sistema apresenta a lista de beneficiários correspondentes à pesquisa. (FE-2-A)
3. O usuário seleciona o beneficiário correspondente. (FE-3-A)
4. O sistema consolida e exibe a ficha completa do beneficiário organizada em linha do tempo. (RN14-01; FA-4-A)

### Fluxos alternativos:
#### FA-4-A — Histórico Vazio (Sem Aulas/Matrículas)

Este fluxo inicia no passo 4 do fluxo principal. Se o beneficiário selecionado estiver ativo mas não possuir nenhum registro de matrícula ou chamadas associadas, o sistema exibe os dados cadastrais normais, mas apresenta um aviso de 'Sem registros de frequência para o aluno' na linha do tempo. O caso de uso é encerrado.

### Fluxos de exceção:

#### FE-2-A — Beneficiário não Encontrado

Este fluxo inicia no passo 2 do fluxo principal. Se não existirem registros compatíveis com os termos pesquisados, o sistema exibe a mensagem 'Nenhum beneficiário encontrado com estes dados' e permite refazer a busca. O fluxo retorna ao passo 1 do fluxo principal.

#### FE-3-A — Item Inexistente (Beneficiário Deletado)

Este fluxo inicia no passo 3 do fluxo principal. Se o registro do beneficiário for deletado da base simultaneamente por outro usuário, a consulta falha e o sistema retorna ao formulário de busca com aviso de erro. O fluxo retorna ao passo 1 do fluxo principal.

### Regras de negócio:
#### RN14-01 — Consolidação Cronológica
O histórico deve apresentar em ordem cronológica todas as turmas, faltas detalhadas (e se foram justificadas ou não), e alertas de evasão emitidos para o beneficiário.

### Pós-condições:
Os dados consolidados e a linha do tempo do beneficiário são apresentados de forma clara na tela do usuário.
