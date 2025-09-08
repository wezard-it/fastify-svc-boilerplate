import logger from '../logger'
import googleCloudStorage from './googleCloudStorage'

export interface StorageInterface {
    getPublicUrl: (fileName: string) => string
    getSignedUrl?: (fileName: string) => Promise<string>
    uploadLocalFile?: (filePath: string, destination: string) => Promise<void>
    deleteFile: (fileName: string) => Promise<void>
    uploadBuffer: (buffer: Buffer, destination: string) => Promise<string>
}

// CHANGE IT FOR NEW IMPLEMENTATION
const storage: StorageInterface = googleCloudStorage

function getPublicUrl(fileName: string): string {
    try {
        return storage.getPublicUrl(fileName)
    } catch (e) {
        logger.error('Error in getting file public url', {
            extra: {
                error: e
            }
        })
        throw e
    }
}

async function getSignedUrl(fileName: string): Promise<string> {
    try {
        if (storage.getSignedUrl) return await storage.getSignedUrl(fileName)
        else {
            throw new Error('Get signed url function is not defined')
        }
    } catch (e) {
        logger.error('Error in uploading local file', {
            extra: {
                error: e
            }
        })
        throw e
    }
}

async function uploadLocalFile(filePath: string, destination: string): Promise<void> {
    try {
        if (storage.uploadLocalFile) return await storage.uploadLocalFile(filePath, destination)
        else {
            throw new Error('Upload local file function is not defined')
        }
    } catch (e) {
        logger.error('Error in uploading local file', {
            extra: {
                error: e
            }
        })
        throw e
    }
}

async function deleteFile(fileName: string) {
    try {
        return await storage.deleteFile(fileName)
    } catch (e) {
        logger.error('Error in deleting file', {
            extra: {
                error: e
            }
        })
        throw e
    }
}

async function uploadBuffer(buffer: Buffer, destination: string): Promise<string> {
    try {
        return await storage.uploadBuffer(buffer, destination)
    } catch (e) {
        logger.error('Error in uploading buffer', {
            extra: {
                error: e
            }
        })
        throw e
    }
}

export default { uploadLocalFile, deleteFile, getPublicUrl, uploadBuffer, getSignedUrl }
