# **VÍDEO DE APRESENTAÇÃO DO MVP – CONSTRUÇÃO ITERAÇÃO 1**

> **Rastreabilidade:** Esta validação comprova o marco da **Construção - Iteração 1** do projeto. Marco correspondente na [Tabela de Planejamento de Fases e Iterações](cronograma_e_entregas.md#tabela-de-planejamento-de-fases-e-iteracoes).

---

## **VÍDEO DE APRESENTAÇÃO**

<video controls width="100%">
  <source src="../videos/Apresentacao_MVP.mp4" type="video/mp4">
  Seu navegador não suporta a reprodução de vídeos em HTML5.
</video>

---

## **Descrição do Vídeo e Evolução do Projeto**

### **Sobre o Vídeo**
Este vídeo apresenta o progresso do **SGES (Sistema de Gestão Educacional e Social)** correspondente à primeira iteração da fase de Construção (Unidade 3). A demonstração prática ilustra o funcionamento básico da interface, as rotinas de acesso seguro e o gerenciamento operacional das turmas, oferecendo uma visão geral da plataforma para os usuários finais e a diretoria.


#### **Interface do Usuário (Frontend)**
* **Segurança e Níveis de Acesso:** Implementação do fluxo de login e restrição de telas conforme o perfil do usuário (administrador, coordenador ou professor).
* **Gestão Operacional:** Desenvolvimento de painéis para o cadastro simplificado de turmas, matrícula de alunos e controle de professores voluntários.
* **Métricas de Acompanhamento:** Integração de gráficos interativos (como funil de conversão) diretamente no painel principal, ajudando os gestores a visualizarem o status e o progresso dos alunos matriculados.
* **Histórico e Formulários:** Criação de telas de consulta histórica de turmas antigas e desenvolvimento de uma ferramenta para a criação e preenchimento de formulários personalizados de avaliação.

#### **Servidor e Banco de Dados (Backend)**
* **APIs de Integração:** Criação dos endpoints para suporte a cadastros complexos, como a associação de turmas com múltiplos dias da semana e vinculação flexível de instrutores.
* **Regras de Ausência e Evasão:** Implementação das diretrizes automáticas de contagem de faltas e detecção precoce de evasão escolar, auxiliando na geração de alertas preventivos.
* **Qualidade e Estabilidade:** Cobertura de testes de unidade focados nas regras de negócio críticas (como lógica de evasão e fluxo de login), garantindo que o sistema funcione de maneira estável e consistente.
