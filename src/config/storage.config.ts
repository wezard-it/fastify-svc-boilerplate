import config from './server.config'

const storageConfig = {
    projectId: config.google.googleProjectId,
    bucketName: config.google.googleStorageBucket
}

export default storageConfig
