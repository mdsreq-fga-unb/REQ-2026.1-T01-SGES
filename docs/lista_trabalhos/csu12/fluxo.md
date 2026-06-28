# SGES
## Especificação de Caso de Uso: CSU12 (RF11) - Registrar presença em lote

[Matriz de Priorização](../../matriz_de_acao_e_priorizacao.md) <br>
[Andamento](../andamento.md) <br>
[Cronograma e Planejamento](../../cronograma_e_entregas.md#tabela-de-cronograma-e-planejamento)

---

### 1. Breve Descrição
Lançar a frequência (presenças ou faltas) de todos os beneficiários matriculados em uma turma na data atual de realização da aula.

---

### 2. Fluxo Básico de Eventos
1. O Instrutor seleciona a turma e a data atual de ocorrência da aula.
2. O sistema gera a listagem de beneficiários matriculados e exibe opções de marcação de presença e falta.
3. O Instrutor realiza a chamada, selecionando a opção correspondente para cada beneficiário da lista.
4. O Instrutor clica em 'Salvar Presenças'. [[FA-4-A](#fa-4-a-registro-em-modo-offline)]
5. O sistema valida se a data da chamada corresponde à data atual do servidor. [[FE-5-A](#fe-5-a-data-retroativa-ou-futura)]
6. O sistema grava em lote as presenças e faltas da turma e exibe mensagem de sucesso.

---

### 3. Fluxos Alternativos
#### FA-4-A - Registro em Modo Offline
No passo 4, se o dispositivo do instrutor estiver sem conexão com a internet, o sistema intercepta a falha e salva os registros de presença em lote localmente no IndexedDB ou LocalStorage do navegador. O sistema exibe um alerta indicando operação offline e agenda a sincronização dos dados de chamada para quando detectar o reestabelecimento de conexão com o servidor.

---

### 4. Fluxos de Exceção
#### FE-5-A - Data Retroativa ou Futura
No passo 5, se o Instrutor tentar registrar uma chamada para uma data que não seja a atual (data de hoje), o sistema impede o lançamento direto e apresenta um erro, orientando a solicitar modificações retroativas a um Gestor (que possui perfil para correções via outro caso de uso).

---

### 5. Pré-Condições
* O Instrutor está autenticado e existem beneficiários matriculados na turma selecionada.

---

### 6. Pós-Condições
* A frequência de todos os alunos da turma para a data selecionada é salva e registrada no banco de dados.

---

### 7. Pontos de Extensão
Nenhum ponto de extensão identificado.

---

### 8. Requisitos Especiais
* RNF04 - Operação Offline: O sistema web/mobile deve dar suporte a chamadas mesmo sem conexão com a internet e fazer o sync automático quando retornar o sinal.

---

### 9. Informações Adicionais
Não há informações adicionais neste momento.
