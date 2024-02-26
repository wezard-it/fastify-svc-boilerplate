import { Client } from 'node-mailjet'
import config from '../../config/server.config'
import { EmailDefaultData } from '.'

const mailJetClient = new Client({
    apiKey: config.mailjet.mailjetApiKey,
    apiSecret: config.mailjet.mailjetApiSecret
})

const sendWithMailjet = async (templateId: string, emailInfo: EmailDefaultData, templateData?: object) => {
    await mailJetClient.post('send', { version: 'v3.1' }).request({
        Messages: [
            {
                From: {
                    Email: emailInfo.from ?? config.email.defaultSender
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
}

export { sendWithMailjet }
