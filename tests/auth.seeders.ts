import { getSupabaseAdminClient } from '../src/utils/supabase'

async function cleanAuthTests() {
    try {
        const supabase = await getSupabaseAdminClient()
        const { data: users } = await supabase.auth.admin.listUsers()
        for (const user of users.users) {
            if (user.user_metadata.email.includes('test')) {
                console.log('Deleting user: ', user.user_metadata.email)
                await supabase.auth.admin.deleteUser(user.id)
                await new Promise((resolve) => setTimeout(resolve, 200)) // Delay for Supabase
            }
        }
    } catch (error) {
        console.error('Error cleaning auth tests: ', error)
    }
}

cleanAuthTests()
    .then(() => {
        console.log('Auth tests cleaned')
    })
    .catch((error) => {
        console.error('Error cleaning auth tests: ', error)
    })
