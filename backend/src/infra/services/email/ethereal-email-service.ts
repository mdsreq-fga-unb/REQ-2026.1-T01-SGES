import nodemailer from 'nodemailer'
import type { IEmailService } from '@/application/services/email-service'
import type { QueueJobData, QueueNames } from '@/application/services/queue-producer'
import logger from '@/infra/logger'

export class EtherealEmailService implements IEmailService {
  private transporter?: nodemailer.Transporter

  private async getTransporter(): Promise<nodemailer.Transporter> {
    if (!this.transporter) {
      const account = await nodemailer.createTestAccount()
      this.transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        auth: { user: account.user, pass: account.pass },
      })
      logger.info(`[EtherealEmail] Test account: ${account.user}`)
    }
    return this.transporter
  }

  async sendCredentials(data: QueueJobData[typeof QueueNames.SEND_CREDENTIALS]): Promise<void> {
    const transporter = await this.getTransporter()
    const info = await transporter.sendMail({
      from: '"SGES" <noreply@sges.dev>',
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
    logger.info(`[EtherealEmail] Credenciais enviadas → ${nodemailer.getTestMessageUrl(info)}`)
  }

  async sendResetCode(data: QueueJobData[typeof QueueNames.SEND_RESET_CODE]): Promise<void> {
    const transporter = await this.getTransporter()
    const info = await transporter.sendMail({
      from: '"SGES" <noreply@sges.dev>',
      to: data.email,
      subject: 'Código de verificação — SGES',
      html: `
        <h2>Redefinição de senha — SGES</h2>
        <p>Seu código de verificação é:</p>
        <h1 style="letter-spacing: 8px">${data.code}</h1>
        <p>Este código expira em 30 minutos. Não compartilhe com ninguém.</p>
      `,
    })
    logger.info(`[EtherealEmail] Código de reset enviado → ${nodemailer.getTestMessageUrl(info)}`)
  }
}
