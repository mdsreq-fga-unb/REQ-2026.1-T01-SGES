# SGES
## CSU12 (RF11) — Registrar presença em lote

[Matriz de Priorização](../../matriz_de_acao_e_priorizacao.md) <br>
[Andamento](../andamento.md) <br>
[Cronograma e Planejamento](../../planejamento_organizacao/cronograma_e_entregas.md#tabela-de-cronograma-e-planejamento)


---

### Objetivo:
Lançar a frequência (presenças ou faltas) de todos os beneficiários matriculados em uma turma na data atual de realização da aula.

### Ator principal:
Instrutor

### Atores secundários:
Nenhum

### Pré-condições:
O Instrutor está autenticado e existem beneficiários matriculados na turma selecionada.

### Fluxo principal:
1. O Instrutor seleciona a turma e a data atual de ocorrência da aula. (FE-1-A)
2. O sistema gera a listagem de beneficiários matriculados, exibe opções de marcação com legenda correspondente (P, FT, F) e disponibiliza um campo de observações ao final da chamada. (RN12-02; FE-2-A)
3. O Instrutor realiza a chamada, selecionando a opção para cada aluno e insere observações sobre a aula (opcional).
4. O Instrutor confirma a chamada realizada. (FA-4-A)
5. O sistema valida se a data selecionada corresponde à data atual. (RN12-01; FE-5-A; FE-5-B)
6. O sistema grava em lote a chamada da turma, registra a observação (se fornecida) e envia um e-mail de aviso automático para cada aluno com falta (F) registrada. (RN12-03; FE-6-A)
7. O sistema exibe mensagem de sucesso.

### Fluxos alternativos:

#### FA-4-A — Registro em Modo Offline

Este fluxo inicia no passo 4 do fluxo principal. Se o dispositivo do instrutor estiver sem conexão com a internet, o sistema intercepta a falha e salva os registros de presença em lote localmente no IndexedDB ou LocalStorage do navegador. O sistema exibe um alerta de operação offline e agenda a sincronização automática dos dados de chamada para quando detectar o reestabelecimento de conexão. O caso de uso é encerrado. (RNF04)

### Fluxos de exceção:

#### FE-1-A — Item Inexistente (Turma)

Este fluxo inicia no passo 1 do fluxo principal. Se a turma selecionada for excluída ou inativada concomitantemente no sistema, a ação é suspensa exibindo erro. O caso de uso é encerrado.

#### FE-2-A — Turma sem Alunos Matriculados (Lista Vazia)

Este fluxo inicia no passo 2 do fluxo principal. Se a listagem gerada não contiver nenhum beneficiário matriculado ativo, o sistema apresenta uma tela em branco com aviso indicando que a turma não possui alunos cadastrados e a chamada não pode ser efetuada. O caso de uso é encerrado.

#### FE-5-A — Data Retroativa

Este fluxo inicia no passo 5 do fluxo principal. Se o Instrutor tentar registrar uma chamada para uma data retroativa (passada), o sistema impede o lançamento direto e apresenta um erro, orientando a solicitar modificações retroativas a um Gestor. O fluxo retorna ao passo 1 do fluxo principal.

#### FE-5-B — Data Futura

Este fluxo inicia no passo 5 do fluxo principal. Se o Instrutor tentar registrar uma chamada para uma data futura, o sistema impede o lançamento direto e apresenta um erro, orientando a realizar o registro na data correta. O fluxo retorna ao passo 1 do fluxo principal.

#### FE-6-A — Falha de Persistência

Este fluxo inicia no passo 6 do fluxo principal. Se ocorrer erro de rede ou de persistência no momento de gravar os registros no banco de dados e o usuário estiver online, os dados são descartados no servidor e mantidos localmente no navegador (sinalizando a falha). O caso de uso é encerrado.

### Regras de negócio:
#### RN12-01 — Restrição de Data para Registro de Chamada
O lançamento direto da chamada em lote é restrito estritamente à data atual do servidor.

#### RN12-02 — Contabilidade de Falta Trabalho (FT)
O status 'Falta Trabalho' (FT) é computado como presença no cálculo de engajamento do aluno.

#### RN12-03 — Aviso de Ausência por E-mail
Ao registrar falta simples (F), o sistema dispara automaticamente um e-mail de aviso para o beneficiário. Nenhum e-mail é enviado para 'Falta Trabalho' (FT).

### Requisitos não funcionais:
#### RNF04 — Operação Offline (Chamada)
Em caso de perda de conexão, as chamadas são salvas no IndexedDB/LocalStorage do navegador e sincronizadas automaticamente no retorno da conexão.

### Pós-condições:
A frequência de todos os alunos da turma para a data selecionada é salva e registrada no banco de dados.
