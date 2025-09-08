import sendgrid from '@sendgrid/mail'
import config from '../../config/server.config'
import { EmailDefaultData } from '.'
import logger from '../logger'

if (config.sendgrid.sendgrid_key) {
    sendgrid.setApiKey(config.sendgrid.sendgrid_key)
} else {
    logger.warn('Sendgrid API key not found. Please set SENDGRID_API_KEY environment variable.')
}

const sendWithSendgrid = async (templateId: string, emailInfo: EmailDefaultData, templateData?: object) => {
    if (templateId === 'NULL')
        await sendgrid.send({
            to: emailInfo.to,
            html: `<a href='${(templateData as { link: string }).link}'>LINK</a>`,
            from: emailInfo.from || config.email.defaultSender,
            subject: emailInfo.subject
        })
    else
        await sendgrid.send({
            to: emailInfo.to,
            cc: emailInfo.cc,
            bcc: emailInfo.bcc,
            from: emailInfo.from || config.email.defaultSender,
            replyTo: emailInfo.replyTo,
            subject: emailInfo.subject,
            templateId,
            dynamicTemplateData: templateData
        })
}

export { sendWithSendgrid }
