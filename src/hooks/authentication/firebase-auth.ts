import firebaseAdmin from '../../utils/firebase'

const verifyFirebaseToken = async (token: string) => {
    const tokenDecoded = await firebaseAdmin.auth().verifyIdToken(token)
    return {
        id: tokenDecoded.uid,
        email: tokenDecoded.email,
        phone_number: tokenDecoded.phone_number
    }
}

export default verifyFirebaseToken
