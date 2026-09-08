import { z } from "zod";

const portugueseErrorMap: z.ZodErrorMap = (issue) => {
  let message: string = issue.message ?? "Valor inválido.";

  switch (issue.code) {
    case z.ZodIssueCode.invalid_type:
      if (issue.input === undefined || issue.input === null) {
        message = "Este campo é obrigatório.";
      } else {
        message = `Tipo esperado: ${issue.expected}.`;
      }
      break;
    case "invalid_format":
      if (issue.format === "email") {
        message = "O formato do e-mail é inválido.";
      } else if (issue.format === "uuid") {
        message = "ID inválido.";
      } else {
        message = "Formato inválido.";
      }
      break;
    case z.ZodIssueCode.too_small:
      if (issue.origin === "array") {
        message = `Selecione pelo menos ${issue.minimum} item(ns).`;
      } else if (issue.origin === "string") {
        message = `O campo deve conter pelo menos ${issue.minimum} caractere(s).`;
      } else if (issue.origin === "number") {
        message = `O valor deve ser maior ou igual a ${issue.minimum}.`;
      }
      break;
    case z.ZodIssueCode.too_big:
      if (issue.origin === "array") {
        message = `Selecione no máximo ${issue.maximum} item(ns).`;
      } else if (issue.origin === "string") {
        message = `O campo deve conter no máximo ${issue.maximum} caractere(s).`;
      } else if (issue.origin === "number") {
        message = `O valor deve ser menor ou igual a ${issue.maximum}.`;
      }
      break;
    case z.ZodIssueCode.custom:
      message = (issue as { message?: string }).message || "Valor inválido.";
      break;
  }

  return { message };
};

z.setErrorMap(portugueseErrorMap);
