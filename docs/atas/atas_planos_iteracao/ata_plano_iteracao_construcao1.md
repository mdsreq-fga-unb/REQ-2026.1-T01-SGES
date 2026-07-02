# **ATA DE PLANEJAMENTO DA ITERAÇÃO – FASE DE CONSTRUÇÃO (ITERACAO 1 - UNIDADE 3)**

> **Rastreabilidade:** Esta ata documenta a execução da cerimônia **Plan Iteration (Planejamento da Iteração)** do processo OpenUP, correspondente ao marco inicial da Unidade 3.

**Data:** 20 de maio de 2026  
**Local:** *Chamada de Áudio e Vídeo via Discord*  
**Pauta Principal:** Início do desenvolvimento de software do MVP, definição do mecanismo de acesso seguro e acompanhamento operacional dos voluntários.

---

### **1. OBJETIVOS DA ITERAÇÃO**
Com a aprovação conceitual do MVP estabelecida na fase anterior, a equipe definiu as metas de desenvolvimento de software para esta iteração:
<br/>
1. **Desenvolvimento do MVP:** Iniciar a codificação das funcionalidades estruturais após a estabilização do escopo.
<br/>
2. **Controle de Acesso Seguro:** Implementar o mecanismo funcional de login e controle de níveis de permissão com base no perfil de cada usuário.
<br/>
3. **Painel Operacional:** Desenvolver a interface e as rotinas de gerenciamento e atualização cadastral dos voluntários da instituição.

---

### **2. GERENCIAMENTO DE RISCOS DA FASE**
O gerenciamento de riscos foi atualizado para mitigar problemas relacionados à integração de código e conformidade de requisitos:

* **Risco 05: Falha na validação de privacidade ou vazamento de dados sensíveis dos utilizadores.**
    * *Ação de Mitigação:* Implementar testes estritos nos níveis de permissão no painel de controle antes da demonstração prática com a diretoria.
* **Risco 06: Desalinhamento entre o comportamento real do usuário e o fluxo codificado.**
    * *Ação de Mitigação:* Mapear cenários reais de comportamento do utilizador durante o detalhamento dos Casos de Uso.

---

### **3. DISTRIBUIÇÃO DOS ITENS DE TRABALHO (WORK ITEMS)**
Os itens de trabalho foram priorizados para cobrir o primeiro bloco de Casos de Uso funcionais (CSU01 a CSU11):

| Item de Trabalho (Tarefa) | Responsável Principal | Artefato Gerado / Destino |
| :--- | :--- | :--- |
| Implementação do módulo de autenticação e perfis | Equipe V | Repositório de Código / Core do Sistema |
| Desenvolvimento das telas de cadastro e painel de voluntários | Vinícius | Interfaces Operacionais do Sistema |
| Detalhamento e documentação dos fluxos de Casos de Uso (CSU01 a CSU11) | Vinícius | Pastas específicas em `docs/lista_trabalhos/` |
| Verificação de conformidade usando o *Definition of Done* (DoD) | Equipe V | Checklist de validação interna |

---

### **4. CRITÉRIOS DE ACEITAÇÃO DA ITERAÇÃO (Marco de Capacidade Operacional Inicial)**
Para concluir este ciclo da Unidade 3 com sucesso, o incremento deve atender às seguintes metas:
<br/>
* [ ] Mecanismo de acesso seguro operando com separação clara de papéis (Diretoria vs. Voluntários).
<br/>
* [ ] Painel operacional de gerenciamento de dados testado internamente e estável.
<br/>
* [ ] Documentação de Engenharia de Requisitos dos fluxos iniciais revisada e publicada no Git Pages.

### **Evidência Visual do Quadro de Desenvolvimento / Sprint Backlog**
![Quadro de Tarefas da Construção 1](images/img_plano_construcao1.png){width="500px"}