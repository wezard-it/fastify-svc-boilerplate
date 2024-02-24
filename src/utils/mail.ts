/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Client } from 'node-mailjet'
import sendgrid from '@sendgrid/mail'
import config from '../config/server.config'
import logger from './logger'

const mailJetClient = new Client({
    apiKey: config.mailjet.mailjetApiKey,
    apiSecret: config.mailjet.mailjetApiSecret
})

sendgrid.setApiKey(config.sendgrid.sendgrid_key)

export const EMAIL_TEMPLATES = {
    PASSWORD_RESET: config.mailjet.templateIds.passwordReset
}

export interface EmailDefaultData {
    to: string | string[]
    cc?: string | string[]
    bcc?: string | string[]
    from?: string
    replyTo?: string
    subject: string
}

export interface PasswordResetData {
    resetUrl: string
}

export const sendEmailMailjet = async (
    templateId: number,
    emailInfo: EmailDefaultData,
    templateData?: object
): Promise<void> => {
    await mailJetClient
        .post('send', { version: 'v3.1' })
        .request({
            Messages: [
                {
                    From: {
                        Email: emailInfo.from ?? config.mailjet.defaultEmailSender,
                        Name: 'Hiwo'
                    },
                    To: [
                        {
                            Email: emailInfo.to
                        }
                    ],
                    TemplateID: templateId,
                    TemplateLanguage: true,
                    Subject: emailInfo.subject,
                    Variables: templateData
                }
            ]
        })
        .then(() => {
            logger.info('Email sent', {
                template: templateId,
                emailInfo,
                templateData
            })
        })
        .catch((err: Error) => {
            logger.error(`Error sending email ${templateId}`, {
                err,
                template: templateId,
                emailInfo,
                templateData
            })
            throw err
        })
}

export const sendEmailSendgrid = async (
    templateId: string,
    emailInfo: EmailDefaultData,
    templateData?: object
): Promise<void> => {
    if (templateId === 'NULL')
        await sendgrid.send({
            to: emailInfo.to,
            html: `<a href='${(templateData as { link: string }).link}'>LINK</a>`,
            from: emailInfo.from || config.sendgrid.defaultEmailSender,
            subject: emailInfo.subject
        })
    else
        await sendgrid
            .send({
                to: emailInfo.to,
                cc: emailInfo.cc,
                bcc: emailInfo.bcc,
                from: emailInfo.from || config.sendgrid.defaultEmailSender,
                replyTo: emailInfo.replyTo,
                subject: emailInfo.subject,
                templateId,
                dynamicTemplateData: templateData
            })
            .then(() => {
                logger.info('Email sent', {
                    template: templateId,
                    emailInfo,
                    templateData
                })
                return true
            })
            .catch((error: Error) => {
                logger.error(`Error sending email ${templateId}`, {
                    error,
                    template: templateId,
                    emailInfo,
                    templateData
                })
                throw error
            })
}
