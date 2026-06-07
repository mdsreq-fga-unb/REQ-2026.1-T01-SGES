import nodemailer from 'nodemailer'
import type { IEmailService } from '@/application/services/email-service'
import type { QueueJobData, QueueNames } from '@/application/services/queue-producer'

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
  }

  async sendCredentials(data: QueueJobData[typeof QueueNames.SEND_CREDENTIALS]): Promise<void> {
    await this.transporter.sendMail({
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
  }

  async sendResetCode(data: QueueJobData[typeof QueueNames.SEND_RESET_CODE]): Promise<void> {
    await this.transporter.sendMail({
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
  }
}
