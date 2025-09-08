import admin from 'firebase-admin'
import config from '../config/server.config'
import logger from './logger'

// Initialize Firebase Admin SDK using environment variables from config
const initializeFirebase = () => {
    try {
        if (config.firebase.projectId && config.firebase.privateKey && config.firebase.clientEmail) {
            const serviceAccount = {
                type: 'service_account',
                project_id: config.firebase.projectId,
                private_key_id: config.firebase.privateKeyId,
                private_key: config.firebase.privateKey?.replace(/\\n/g, '\n'),
                client_email: config.firebase.clientEmail,
                client_id: config.firebase.clientId,
                auth_uri: 'https://accounts.google.com/o/oauth2/auth',
                token_uri: 'https://oauth2.googleapis.com/token',
                auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
                client_x509_cert_url: `https://www.googleapis.com/robot/v1/metadata/x509/${encodeURIComponent(config.firebase.clientEmail)}`,
                universe_domain: 'googleapis.com'
            }

            admin.initializeApp({
                credential: admin.credential.cert(serviceAccount as admin.ServiceAccount)
            })
        } else {
            logger.warn(
                'Firebase configuration not found. Please set FIREBASE_PROJECT_ID, FIREBASE_PRIVATE_KEY, and FIREBASE_CLIENT_EMAIL environment variables.'
            )
        }
    } catch (error) {
        logger.error('Failed to initialize Firebase Admin SDK:', error)
    }
}

initializeFirebase()

export const auth = admin.auth()
export default admin
