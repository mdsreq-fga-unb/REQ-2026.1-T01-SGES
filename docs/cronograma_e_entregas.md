# 6. Cronograma e Entregas (Ciclo de Vida OpenUP)

Este cronograma reflete o ciclo de vida iterativo e incremental do framework **OpenUP** adaptado para o projeto SGES. O desenvolvimento de código inicia-se imediatamente após a validação dos requisitos do MVP na Unidade 2.

### Visão Geral dos Marcos (Milestones) do Projeto
* **Concepção (Inception):** Alinhamento de escopo, objetivos do negócio e viabilidade.
* **Elaboração (Elaboration):** Detalhamento de requisitos do MVP, redução de riscos técnicos e definição da linha de base da arquitetura.
* **Construção (Construction):** Desenvolvimento em larga escala dos módulos funcionais e testes integrados.
* **Transição (Transition):** Validação final, ajustes de performance, treinamento de usuários e implantação em produção.

---

## Tabela de Planejamento de Fases e Iterações

| Fase / Iteração | Início | Fim | Objetivo da Iteração e Características do Produto (CP) Alvo | Entregas Esperadas (Artefatos / Código) | Validação com o Cliente e Marcos |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Concepção**<br>Iteração 1 *(Unidade 1)* | 17/03 | 16/04 | **Entendimento do Problema e Viabilidade**<br>• Alinhamento do problema social e mapeamento de partes interessadas.<br>• *CPs Relacionadas:* Mapeamento geral e entendimento do domínio de negócio. | • Documento de Visão preliminar.<br>• Identificação do Contexto e Cenário Atual.<br>• Lista preliminar de Requisitos. | **Marco de Objetivos do Ciclo de Vida:**<br>Aprovação do escopo macro e concordância sobre os problemas a mitigar. |
| **Elaboração**<br>Iteração 1 *(Unidade 2)* | 17/04 | 19/05 | **Definição de Arquitetura e Alinhamento do MVP**<br>• Definição rigorosa do escopo do MVP.<br>• Elicitação profunda de requisitos de infraestrutura e segurança.<br>• *CPs Relacionadas:* Levantamento inicial da **CP1 (Segurança)** e modelagem técnica base. | • Backlog do Produto Priorizado (MoSCoW).<br>• Protótipos de Baixa/Média Fidelidade.<br>• Definição de DoR e DoD.<br>• Setup inicial do repositório (Node.js/PostgreSQL). | **Marco da Linha de Base da Arquitetura:**<br>Entrega da Unidade 2 (19/05). Aprovação do design e concordância com os requisitos técnicos estabilizados. |
| **Construção**<br>Iteração 1 *(Unidade 3)* | 20/05 | 11/06 | **Desenvolvimento do Core e Gestão de Pessoas**<br>• Início da codificação em larga escala pós-MVP.<br>• Aplicação prática de PBB e BDD.<br>• *CPs Alvo:*<br> - **CP1 - Segurança e Controle de Acessos**<br> - **CP2 - Gestão de Instrutores**<br> - **CP3 - Cadastro Sociodemográfico** | • Especificações funcionais em formato BDD (Behavior-Driven Development).<br>• Incremento de Software funcional: Módulos de Autenticação JWT, Gestão de Usuários e Cadastro Base de Famílias.<br>• Trilha de Auditoria (Logs ativos). | **Capacidade Operacional Inicial (UAT Preliminar):**<br>Demonstração funcional de cadastro seguro e permissões aos gestores voluntários. Verificação e Validação automatizada. |
| **Construção**<br>Iteração 2 *(Unidade 4 - Parte 1)* | 12/06 | 02/07 | **Desenvolvimento Operacional e Inteligência de Negócio**<br>• Aplicação de User Story Mapping e Casos de Uso detalhados.<br>• Mapeamento de fluxos alternativos e de exceção.<br>• *CPs Alvo:*<br> - **CP4 - Frequência e Engajamento**<br> - **CP5 - Monitoramento de Evasão** | • Modelos e especificações de Casos de Uso complexos.<br>• Incremento de Software funcional: Chamada digital em lote (com suporte offline), gatilhos automatizados e alertas de risco. | **Validação de Fluxo Crítico:**<br>Homologação com professores e instrutores focada no uso prático em sala de aula (registro rápido de presenças). |
| **Transição**<br>Iteração 1 *(Unidade 4 - Parte 2 / Fim)* | 03/07 | 16/07 | **Estabilização, Relatórios e Implantação**<br>• Encerramento de requisitos e refatoração final de software.<br>• Garantir anonimização e conformidade estrita com LGPD.<br>• *CPs Alvo:*<br> - **CP6 - Relatórios e Transparência**<br> - **CP7 - Arquitetura e Performance** | • Incremento de Software final: Dashboards gerenciais, exportação de dados em CSV e relatórios em PDF státicos.<br>• Documentação OpenAPI/Swagger (100% de cobertura das rotas).<br>• Manuais de utilizador e material de formação.<br>• Deploy final em produção. | **Marco de Liberação do Produto (Product Release):**<br>Aceite final da diretoria da instituição. Entrega do sistema em produção de forma estável. Revisão de notas e encerramento da disciplina. |

---

## Mapeamento de Riscos Técnicos e Mitigações no OpenUP

Diferente do ScrumXP que trata os riscos de forma implícita no backlog de Sprints, o OpenUP orienta a arquitetura para sanar riscos o mais cedo possível. Abaixo está o mapeamento de como os Requisitos Não Funcionais (RNFs) guiam os marcos de engenharia de software das nossas iterações de Construção e Transição:

1.  **Segurança e LGPD (CP1, CP3 - RNF01, RNF02, RNF10):** Mitigados e validados logo na primeira iteração de Construção (fim de maio), garantindo que dados sensíveis nasçam criptografados (AES-256) e com sessões autoexpiráveis de 15 minutos em computadores compartilhados.
2.  **Operação em Ambientes com Conexão Instável (CP4 - RNF04, RNF08):** O desenvolvimento do módulo de chamada da Construção 2 prioriza o uso de persistência no navegador via *IndexedDB* e técnicas de *Background Sync*, garantindo que a usabilidade para os instrutores não dependa de wi-fi constante nas salas de atividades.
3.  **Transparência Sem Vazamento de Dados (CP6 - RNF03, RNF07):** Na Fase de Transição (julho), o motor de relatórios é estabilizado para rodar de maneira assíncrona (evitando *deadlocks* ou travamentos no banco) e aplicando mascaramento estrito de identificadores pessoais (PII) nas exportações de impacto social.