# SGES
## Especificação de Caso de Uso: CSU13 (RF14) - Emitir alerta de evasão

---

### 1. Breve Descrição
Monitorar de forma autônoma a frequência dos alunos e sinalizar no painel os beneficiários que apresentam risco de evasão escolar/social.

---

### 2. Fluxo Básico de Eventos
1. O Sistema dispara um job programado de verificação de faltas (processamento em segundo plano).
2. O Sistema analisa o diário de frequência de todas as turmas ativas buscando por:
3.   - Caso A: Beneficiários com 3 faltas consecutivas não justificadas na mesma oficina.
4.   - Caso B: Beneficiários com 5 faltas alternadas não justificadas na mesma oficina dentro do mês corrente.
5. O Sistema cria um Alerta de Evasão na base de dados vinculando o beneficiário em risco.
6. O Sistema atualiza os Dashboards de Gestores e Instrutores, exibindo alertas visuais de risco para esses beneficiários.

---

### 3. Fluxos Alternativos
Não há fluxos alternativos identificados.

---

### 4. Fluxos de Exceção
Não há fluxos de exceção identificados.

---

### 5. Pré-Condições
* O sistema deve possuir registros de chamadas anteriores processados.

---

### 6. Pós-Condições
* O alerta de evasão é gerado de forma ativa e as notificações correspondentes são exibidas nos painéis de controle do sistema.

---

### 7. Pontos de Extensão
Nenhum ponto de extensão identificado.

---

### 8. Requisitos Especiais
* RNF05 - Processamento Assíncrono: O cálculo de padrões de evasão e geração de alertas deve rodar em segundo plano, evitando bloquear as requisições principais de uso dos usuários do sistema.

---

### 9. Informações Adicionais
Não há informações adicionais neste momento.
