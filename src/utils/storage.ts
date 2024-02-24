import { Storage, type UploadResponse } from '@google-cloud/storage'
import storageConfig from '../config/storage.config'
import logger from './logger'

const storage = new Storage(storageConfig)

function getPublicUrl(fileName: string): string {
    return `https://storage.googleapis.com/${storageConfig.bucketName}/${fileName}`
}

async function uploadFile(filePath: string, destination: string): Promise<UploadResponse> {
    return storage.bucket(storageConfig.bucketName).upload(filePath, {
        destination
    })
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
async function deleteFile(fileName: string) {
    return storage.bucket(storageConfig.bucketName).file(fileName).delete()
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

export default storage
export { uploadFile, deleteFile, getPublicUrl, uploadBuffer }
