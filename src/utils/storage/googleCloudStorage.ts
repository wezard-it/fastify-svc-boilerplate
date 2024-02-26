import { Storage } from '@google-cloud/storage'
import storageConfig from '../../config/storage.config'
import logger from '../logger'

const storage = new Storage(storageConfig)

function getPublicUrl(fileName: string): string {
    return `https://storage.googleapis.com/${storageConfig.bucketName}/${fileName}`
}

async function uploadLocalFile(filePath: string, destination: string): Promise<void> {
    await storage.bucket(storageConfig.bucketName).upload(filePath, {
        destination
    })
}

async function deleteFile(fileName: string): Promise<void> {
    await storage.bucket(storageConfig.bucketName).file(fileName).delete()
}

async function uploadBuffer(buffer: Buffer, destination: string): Promise<string> {
    const file = storage.bucket(storageConfig.bucketName).file(destination)

    return file
        .save(buffer)
        .then(() => getPublicUrl(destination))
        .catch((err) => {
            logger.error(err)
            throw err
        })
}

export default { uploadLocalFile, deleteFile, getPublicUrl, uploadBuffer }
