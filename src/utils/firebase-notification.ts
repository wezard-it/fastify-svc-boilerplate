import firebaseAdminConfig from './firebase'
import logger from './logger'

export const sendMulticastNotifications = (
    tokens: (string | null)[],
    notificationMessage: { title: string; body: string }
) => {
    tokens.forEach((t) => {
        if (t)
            firebaseAdminConfig
                .messaging()
                .send({
                    token: t,
                    notification: notificationMessage,
                    android: {
                        ttl: 86400,
                        notification: {
                            sound: 'default'
                        }
                    },
                    apns: {
                        headers: {
                            'apns-priority': '5'
                        },
                        payload: {
                            aps: {
                                'sound': 'default',
                                'content-available': 1
                            }
                        }
                    }
                })
                .then((res) =>
                    logger.info('NOTIFICATION_SUCCESS', { extra: { notification: notificationMessage, res } })
                )
                .catch((e) => logger.error(e))
    })
}
