import nodemailer from 'nodemailer'
import type { IEmailService } from '@/application/services/email-service'
import type { QueueJobData, QueueNames } from '@/application/services/queue-producer'
import logger from '@/infra/logger'

export class NodemailerEmailService implements IEmailService {
  private transporter: nodemailer.Transporter

  constructor(
    private readonly config: {
      host: string
      port: number
      user: string
      pass: string
      from: string
    },
  ) {
    this.transporter = nodemailer.createTransport({
      host: config.host,
      port: config.port,
      auth: { user: config.user, pass: config.pass },
    })
    logger.info(
      { host: config.host, port: config.port, user: config.user },
      '[NodemailerEmail] Transporter configurado',
    )
  }

  async sendCredentials(data: QueueJobData[typeof QueueNames.SEND_CREDENTIALS]): Promise<void> {
    logger.debug({ to: data.email }, '[NodemailerEmail] Enviando credenciais')
    try {
      const info = await this.transporter.sendMail({
        from: this.config.from,
        to: data.email,
        subject: 'Suas credenciais de acesso — SGES',
        html: `
          <h2>Bem-vindo(a) ao SGES, ${data.name}!</h2>
          <p>Suas credenciais de acesso:</p>
          <ul>
            <li><strong>Email:</strong> ${data.email}</li>
            <li><strong>Senha:</strong> ${data.password}</li>
          </ul>
          <p>Por segurança, altere sua senha após o primeiro acesso.</p>
        `,
      })
      logger.info({ to: data.email, messageId: info.messageId }, '[NodemailerEmail] Credenciais enviadas')
    } catch (err) {
      logger.error(err, '[NodemailerEmail] Falha ao enviar credenciais', 'MSG')
      throw err
    }
  }

  async sendResetCode(data: QueueJobData[typeof QueueNames.SEND_RESET_CODE]): Promise<void> {
    logger.debug({ to: data.email }, '[NodemailerEmail] Enviando código de reset')
    try {
      const info = await this.transporter.sendMail({
        from: this.config.from,
        to: data.email,
        subject: 'Código de verificação — SGES',
        html: `
          <h2>Redefinição de senha — SGES</h2>
          <p>Seu código de verificação é:</p>
          <h1 style="letter-spacing: 8px">${data.code}</h1>
          <p>Este código expira em 30 minutos. Não compartilhe com ninguém.</p>
        `,
      })
      logger.info({ to: data.email, messageId: info.messageId }, '[NodemailerEmail] Código de reset enviado')
    } catch (err) {
      logger.error(err, '[NodemailerEmail] Falha ao enviar código de reset', 'MSG')
      throw err
    }
  }
}
