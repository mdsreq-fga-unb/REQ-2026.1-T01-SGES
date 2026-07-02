import { z } from 'zod'

const portugueseErrorMap: z.ZodErrorMap = (issue, ctx) => {
  let message = ctx.defaultError

  switch (issue.code) {
    case z.ZodIssueCode.invalid_type:
      if (issue.received === 'undefined') {
        message = 'Este campo é obrigatório.'
      } else {
        message = `Tipo esperado: ${issue.expected}, recebido: ${issue.received}.`
      }
      break
    case z.ZodIssueCode.invalid_string:
      if (issue.validation === 'email') {
        message = 'O formato do e-mail é inválido.'
      } else if (issue.validation === 'uuid') {
        message = 'ID inválido.'
      } else {
        message = 'Formato inválido.'
      }
      break
    case z.ZodIssueCode.too_small:
      if (issue.type === 'array') {
        message = `Selecione pelo menos ${issue.minimum} item(ns).`
      } else if (issue.type === 'string') {
        message = `O campo deve conter pelo menos ${issue.minimum} caractere(s).`
      } else if (issue.type === 'number') {
        message = `O valor deve ser maior ou igual a ${issue.minimum}.`
      }
      break
    case z.ZodIssueCode.too_big:
      if (issue.type === 'array') {
        message = `Selecione no máximo ${issue.maximum} item(ns).`
      } else if (issue.type === 'string') {
        message = `O campo deve conter no máximo ${issue.maximum} caractere(s).`
      } else if (issue.type === 'number') {
        message = `O valor deve ser menor ou igual a ${issue.maximum}.`
      }
      break
    case z.ZodIssueCode.custom:
      message = issue.message || 'Valor inválido.'
      break
  }

  return { message }
}

z.setErrorMap(portugueseErrorMap)
