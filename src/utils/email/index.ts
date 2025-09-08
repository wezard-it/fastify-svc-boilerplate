import logger from '../logger'
import { sendWithSendgrid } from './sendgrid'

export interface EmailDefaultData {
    to: string | string[]
    cc?: string | string[]
    bcc?: string | string[]
    from?: string
    replyTo?: string
    subject: string
}

// CHANGE IT FOR NEW IMPLEMENTATION
const emailSender: (templateId: string, emailData: EmailDefaultData, templateData?: object) => Promise<void> =
    sendWithSendgrid

export const sendEmail = async (
    templateId: string,
    emailInfo: EmailDefaultData,
    templateData?: object
): Promise<void> => {
    try {
        await emailSender(templateId, emailInfo, templateData)
        logger.info('Email sent', {
            extra: {
                emailInfo,
                templateId,
                templateData
            }
        })
    } catch (_e) {
        logger.error('Error in sending email', {
            extra: {
                emailInfo,
                templateId,
                templateData
            }
        })
    }
}
