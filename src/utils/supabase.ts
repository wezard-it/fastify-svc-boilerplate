import { createClient, SupabaseClient } from '@supabase/supabase-js'
import config from '../config/server.config'
import logger from './logger'

let supabaseClient: SupabaseClient | null = null
let supabaseAdminClient: SupabaseClient | null = null

// Initialize Supabase client using environment variables from config
const initializeSupabase = () => {
    try {
        const supabaseUrl = config.supabase.supabaseUrl
        const supabaseAnonKey = config.supabase.supabaseAnonKey
        if (supabaseUrl && supabaseAnonKey) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
            supabaseClient = createClient(supabaseUrl, supabaseAnonKey)
            logger.info('Supabase client initialized successfully')
        } else {
            logger.warn(
                'Supabase configuration not found. Please set SUPABASE_URL and SUPABASE_ANON_KEY environment variables.'
            )
        }

        const supabaseServiceRoleKey = config.supabase.supabaseServiceRoleKey
        if (supabaseUrl && supabaseServiceRoleKey) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
            supabaseAdminClient = createClient(supabaseUrl, supabaseServiceRoleKey, {
                auth: {
                    autoRefreshToken: false,
                    persistSession: false
                }
            })
            logger.info('Supabase admin client initialized successfully')
        } else {
            logger.warn(
                'Supabase admin configuration not found. Please set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY environment variables.'
            )
        }
    } catch (error) {
        logger.error('Failed to initialize Supabase client:', error)
    }
}

initializeSupabase()

export const getSupabaseClient = (): SupabaseClient => {
    if (!supabaseClient) {
        throw new Error('Supabase client not initialized. Please check your configuration.')
    }
    return supabaseClient
}

export const getSupabaseAdminClient = (): SupabaseClient => {
    if (!supabaseAdminClient) {
        throw new Error('Supabase admin client not initialized. Please check your configuration.')
    }
    return supabaseAdminClient
}

export default supabaseAdminClient
