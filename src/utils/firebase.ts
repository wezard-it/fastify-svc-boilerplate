import admin from 'firebase-admin'

import firebaseServiceAccount from '../config/wezard_bolierplate_service_account.json'

admin.initializeApp({
    credential: admin.credential.cert(firebaseServiceAccount as admin.ServiceAccount)
})

export const auth = admin.auth()
export default admin
