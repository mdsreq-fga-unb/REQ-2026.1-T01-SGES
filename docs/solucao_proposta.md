# 2. Solução Proposta

## 2.1. Objetivo Geral do Produto

O objetivo geral do produto é focado em uma **visão orientada ao usuário**. A plataforma entregará valor ao focar em "o quê" precisa ser resolvido (centralizar informações e prover rastreabilidade), sem impor restrições de como a solução técnica será implementada prematuramente, permitindo futura evolução tecnológica.

## 2.2. Objetivos Específicos do Produto

- **OE1**: Centralizar e estruturar os dados cadastrais das famílias atendidas, alunos, voluntários (instrutores) e diretoria.
- **OE2**: Monitorar a assiduidade e gerenciar a taxa de evasão dos alunos nos cursos e oficinas, permitindo intervenções rápidas.
- **OE3**: Apoiar a tomada de decisão estratégica da diretoria por meio de dados consolidados das ações da instituição.
- **OE4**: Fortalecer os vínculos institucionais, humanizando o relacionamento e o atendimento.

## 2.3. Características de Produto

Esta seção descreve as capacidades do sistema focadas no valor de negócio e nas necessidades dos usuários, evitando definições tecnológicas prematuras de implementação.

| OE Principal | Contribuição Secundária | ID   | Característica                   | Descrição Resumida                                                                                          | Valor de Negócio Principal                        |
| :----------- | :---------------------- | :--- | :------------------------------- | :---------------------------------------------------------------------------------------------------------- | :------------------------------------------------ |
| OE1          | OE3, OE4                | CP1  | **Gestão de Cadastros**          | Centralizar, atualizar e consultar informações de participantes, voluntários e corpo diretivo.              | Centralização e confiabilidade das informações.   |
| OE1          | OE2                     | CP2  | **Controle de Grupos**           | Estruturar e gerenciar grupos de atividades vinculando instrutores e participantes.                         | Organização da oferta de cursos e atividades.     |
| OE2          | OE3                     | CP3  | **Monitoramento de Assiduidade** | Mecanismo para registro e acompanhamento da frequência com foco em agilidade operacional.                   | Monitoramento contínuo da participação.           |
| OE4          | OE1                     | CP4  | **Módulo de Relacionamento**     | Manutenção do histórico de interação e mecanismos para fortalecimento do vínculo com participantes.         | Engajamento e retenção de alunos.                 |
| OE3          | OE2                     | CP5  | **Visão Analítica**              | Disponibilizar indicadores visuais sobre o desempenho e status das turmas e alunos.                         | Apoio à tomada de decisão estratégica.            |
| OE1          | OE2                     | CP6  | **Integração de Dados Legados**  | Capacidade de absorver informações provenientes de registros ou sistemas anteriores.                        | Facilita a migração para o ambiente digital.      |
| OE2          | OE4                     | CP7  | **Histórico de Trajetória**      | Registro consolidado da evolução e participação dos alunos ao longo do tempo.                               | Acompanhamento contínuo dos participantes.        |
| OE3          | OE2                     | CP8  | **Consolidação de Informações**  | Disponibilizar visões agrupadas de dados para fins de prestação de contas e análise gerencial.              | Transparência e prestação de contas.              |
| OE2          | OE3                     | CP9  | **Identificação de Evasão**      | Detecção automática de padrões de baixa frequência para intervenção preventiva.                             | Redução da evasão escolar/social.                 |
| OE4          | OE2                     | CP10 | **Comunicação Ativa**            | Canal para envio de informativos, lembretes e avisos aos envolvidos.                                        | Engajamento e comunicação eficiente.              |
| OE1          | OE3                     | CP11 | **Gestão de Permissões**         | Controle de níveis de acesso às funcionalidades conforme o perfil do usuário.                               | Segurança e integridade do sistema.               |
| OE3          | OE1                     | CP12 | **Portabilidade de Dados**       | Permitir a extração de informações do sistema para uso em ferramentas externas ou compartilhamento offline. | Facilidade de compartilhamento e análise externa. |

## 2.4. Tecnologias a Serem Utilizadas

A stack tecnológica foi selecionada para garantir alta produtividade, segurança de tipos e baixo custo de manutenção, atendendo aos desafios de usabilidade e restrição financeira da instituição.

- **Frontend:** React.js (Vite)
  - _Motivação:_ Criação de uma interface modular e reativa, garantindo simplicidade para voluntários e agilidade no carregamento em diferentes dispositivos.

- **Backend:** Node.js
  - _Motivação:_ Ambiente escalável que permite compartilhamento de lógica com o frontend, acelerando o desenvolvimento de funcionalidades críticas como importação de dados legados.

- **Linguagem:** TypeScript
  - _Motivação:_ Tipagem estática para reduzir erros em tempo de execução e garantir integridade dos dados sensíveis das famílias atendidas.

- **Banco de Dados:** PostgreSQL
  - _Motivação:_ SGBD relacional robusto para centralizar informações antes dispersas em planilhas, permitindo rastreabilidade e geração de relatórios complexos para a diretoria.

## 2.5. Pesquisa de Mercado e Análise Competitiva

Existem softwares no mercado que podem ajudar a resolver os problemas do cliente. Contudo, não se alinham totalmente aos interesses ou apresentam empecilhos específicos.

- **Salesforce Nonprofit:**  
  Plataforma em nuvem para organizações sem fins lucrativos. Oferece personalização e integração com ferramentas de comunicação e captação.  
  _Limitações:_ Alto custo total, implementação longa, dependência técnica e risco de subutilização devido à rotatividade de voluntários.

- **Odoo:**  
  Software de gestão empresarial que integra áreas em uma única plataforma.  
  _Limitações:_ Custo elevado, implementação longa e necessidade de suporte técnico para funcionar bem com voluntários.

- **SurveyCTO:**  
  Plataforma de coleta de dados com ferramentas de monitoramento e visualização.  
  _Limitações:_ Bom para pesquisa, mas caro para uso contínuo e não é sistema de gestão de beneficiários.

➡️ O **SGES** se mostra financeiramente mais viável, centralizando dados que hoje estão dispersos em cadernos e planilhas, o que dificulta o acompanhamento de frequência, evasão e histórico de participantes e voluntários. Já os exemplos citados não satisfazem totalmente os interesses do cliente.

## 2.6. Viabilidade da Proposta

A viabilidade técnica do projeto é **média**.

- A maior parte dos membros domina as tecnologias escolhidas.
- Foram criadas funções e alocados responsáveis para auxiliar em dúvidas e evitar falhas de comunicação.
- Prazo estimado: **3 meses** para o desenvolvimento do MVP (Produto Mínimo Viável).
- Possibilidade de ajustes no cronograma devido a imprevistos ou necessidades de qualidade.
- Mão de obra no período da disciplina: custo R$ 0,00 para o cliente, pois o desenvolvimento será realizado por estudantes voluntários até a entrega do MVP.
- Continuidade pós-disciplina: antes do encerramento do projeto, deverá ser alinhado junto ao cliente um plano de continuidade com escopo de manutenção, como hospedagem e evolução da plataforma, além de opções de expansão para decisão formal, esta etapa envolverá custos ao cliente.
- Custos recorrentes mínimos de operação: restritos a registro de domínio e hospedagem e manutenção básica do site após fim da disciplina, a depender da disponibilidade de continuação dos integrantes do grupo.

## 2.7. Benefícios Esperados

- **Para alunos e participantes:**  
  Acompanhamento de registros de frequência, histórico de participação e atendimento.

- **Para instrutores:**  
  Maior praticidade e agilidade no uso das ferramentas de gestão.

- **Para gestores:**  
  Acesso a informações consolidadas para tomada de decisão, incluindo relatórios de participação e evasão.
