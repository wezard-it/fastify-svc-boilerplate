import config from './server.config'

const storageConfig = {
    projectId: config.google.googleProjectId as string,
    bucketName: config.google.googleStorageBucket as string
}

export default storageConfig
