# SGES
## Especificação de Caso de Uso: CSU14 (RF15) - Consultar histórico do beneficiário

---

### 1. Breve Descrição
Visualizar a ficha cadastral do beneficiário com a linha do tempo consolidada contendo matrículas, frequência detalhada e histórico de alertas.

---

### 2. Fluxo Básico de Eventos
1. O usuário pesquisa um beneficiário por nome ou CPF no sistema.
2. O sistema apresenta a lista de beneficiários correspondentes à pesquisa.
3. O usuário seleciona o beneficiário correspondente.
4. O sistema consolida e exibe a ficha completa do beneficiário organizada em linha do tempo:
5.   - Relação de oficinas atuais e turmas concluídas.
6.   - Percentual global e mensal de presença.
7.   - Detalhamento de faltas, presenças e faltas justificadas.
8.   - Histórico de alertas de risco de evasão emitidos para o beneficiário.

---

### 3. Fluxos Alternativos
Não há fluxos alternativos identificados.

---

### 4. Fluxos de Exceção
#### FE1 - Beneficiário não Encontrado
No passo 2, se não existirem registros compatíveis com os termos pesquisados, o sistema exibe a mensagem 'Nenhum beneficiário encontrado com estes dados' e permite refazer a busca.

---

### 5. Pré-Condições
* O usuário deve estar autenticado no sistema.

---

### 6. Pós-Condições
* Os dados consolidados e a linha do tempo do beneficiário são apresentados de forma clara na tela do usuário.

---

### 7. Pontos de Extensão
Nenhum ponto de extensão identificado.

---

### 8. Requisitos Especiais
* Otimização de consultas ao banco de dados para consolidação rápida do histórico de presença.

---

### 9. Informações Adicionais
Não há informações adicionais neste momento.
