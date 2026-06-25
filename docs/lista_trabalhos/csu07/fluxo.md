# SGES
## Especificação de Caso de Uso: CSU07 (RF08) - Editar dados do beneficiário

---

### 1. Breve Descrição
Atualizar os dados cadastrais e as informações sociodemográficas do beneficiário no sistema.

---

### 2. Fluxo Básico de Eventos
1. O usuário busca pelo beneficiário desejado no sistema e abre sua ficha cadastral.
2. O usuário edita os campos sociodemográficos necessários no formulário.
3. O usuário clica em 'Salvar'.
4. O sistema valida a conformidade das informações atualizadas.
5. O sistema persiste os novos dados na base de dados.
6. O sistema exibe mensagem de sucesso e atualiza a exibição com os dados modificados.

---

### 3. Fluxos Alternativos
Não há fluxos alternativos identificados.

---

### 4. Fluxos de Exceção
#### FE1 - Validação de Dados Inválidos
No passo 4, se alguma informação obrigatória for removida ou se forem adicionados dados em formatos incorretos, o sistema impede o salvamento e solicita correções.

---

### 5. Pré-Condições
* O usuário está autenticado e o beneficiário a ser editado já se encontra registrado no sistema.

---

### 6. Pós-Condições
* Os novos dados cadastrais e sociodemográficos do beneficiário são consolidados e atualizados na base de dados.

---

### 7. Pontos de Extensão
Nenhum ponto de extensão identificado.

---

### 8. Requisitos Especiais
* RNF01 - Criptografia Sensível: Manter a criptografia e a segurança no armazenamento das informações após a alteração.

---

### 9. Informações Adicionais
Não há informações adicionais neste momento.
