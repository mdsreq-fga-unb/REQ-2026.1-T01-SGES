# MVP e Quadrantes

!!! info "Guia de Nomenclatura"
    Para garantir a rastreabilidade e rigor acadêmico, os Casos de Uso (CSUs) utilizam a seguinte padronização de nomenclatura:
    
    * **RF (Requisito Funcional):** Identifica o requisito funcional correspondente (ex: `RF01`).
    * **RN (Regra de Negócio):** Segue o formato **`RN[caso_de_uso]-[sequencial]`** (ex: `RN02-01` é a primeira regra do CSU02). As regras definem as políticas operacionais do negócio e são especificadas localmente em sua respectiva seção em cada caso de uso.
    * **RNF (Requisito Não Funcional):** Segue o formato global do projeto **`RNF[sequencial]`** (ex: `RNF01`, `RNF02`). São mapeados e referenciados nos fluxos de eventos para rastrear restrições técnicas (segurança, confiabilidade, performance).
    * **FE (Fluxo de Exceção):** Indica desvios e erros no formato **`FE-[passo]-[identificador]`** (ex: `FE-4-A` trata o erro ocorrido no passo 4).
    * **FA (Fluxo Alternativo):** Indica alternativas de fluxo no formato **`FA-[passo]-[identificador]`** (ex: `FA-2-A`).

## MVP

| CSU | Descrição | Já feito | Iteração |
|------|-----------|-----------|----------- |
| [CSU01](../lista_trabalhos/csu01/fluxo.md) | Autenticar usuário | Sim | Construção 1 |
| [CSU02](../lista_trabalhos/csu02/fluxo.md) | Redefinir senha de acesso | Sim | Construção 1 |
| [CSU03](../lista_trabalhos/csu03/fluxo.md) | Encerrar sessão | Sim | Construção 1 |
| [CSU04](../lista_trabalhos/csu04/fluxo.md) | Cadastrar instrutor | Sim | Construção 1 |
| [CSU05](../lista_trabalhos/csu05/fluxo.md) | Editar perfil do instrutor | Sim | Construção 2 |
| [CSU06](../lista_trabalhos/csu06/fluxo.md) | Cadastrar beneficiário | Sim | Construção 1 |
| [CSU07](../lista_trabalhos/csu07/fluxo.md) | Editar dados do beneficiário | Sim | Construção 1 |
| [CSU08](../lista_trabalhos/csu08/fluxo.md) | Cadastrar turma | Sim | Construção 1 |
| [CSU09](../lista_trabalhos/csu09/fluxo.md) | Matricular beneficiário | Sim | Construção 1 |
| [CSU10](../lista_trabalhos/csu10/fluxo.md) | Alterar registro de frequência | Sim | Construção 2 |
| [CSU11](../lista_trabalhos/csu11/fluxo.md) | Registrar falta justificada | Sim | Construção 2 |

## Quadrante 2

| CSU | Descrição | Já feito | Iteração |
|------|-----------|-----------|-----------|
| [CSU12](../lista_trabalhos/csu12/fluxo.md) | Registrar presença em lote | Sim | Construção 2 |
| [CSU13](../lista_trabalhos/csu13/fluxo.md) | Emitir alerta de evasão | Sim | Construção 2 |
| [CSU14](../lista_trabalhos/csu14/fluxo.md) | Consultar histórico do beneficiário | Sim | Construção 2 |
| [CSU15](../lista_trabalhos/csu15/fluxo.md) | Gerar relatório de frequência | Sim | Construção 2 |

## Quadrante 3

| CSU | Descrição | Já feito | Iteração |
|------|-----------|-----------|-----------|
| [CSU16](../lista_trabalhos/csu16/fluxo.md) | Inativar instrutor | Sim | Construção 2 |