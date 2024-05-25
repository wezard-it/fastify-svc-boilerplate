const fs = require('fs')
const path = require('path')
const enviorment = process.argv[2]

if (!enviorment) {
    console.error('You must provide an enviorment')
    process.exit(1)
}

// check if seeders/enviorment.seeder.ts exists
const seederPath = path.join(__dirname, '../../src', 'seeders', `${enviorment}.seeder.ts`)

if (!fs.existsSync(seederPath)) {
    console.error(`🤦🏻 The seeder ${enviorment} does not exist. Please choose another name.`)
    process.exit(1)
}

// change the enviorment in the .env file and save the old one
const envPath = path.join(__dirname, '../../.env')
const env = fs.readFileSync(envPath, 'utf-8')

const allCaps = enviorment.toUpperCase()

const newEnv = env.replace(/NODE_ENV=\w+/, `NODE_ENV=${allCaps}`)
fs.writeFileSync(envPath, newEnv)

if (process.argv[3] === '--clean') {
    console.log('🧹  Cleaning the database...')
    // run the seeder
    require('ts-node').register()
    require(seederPath).clean().then(() => {
        console.log('🗑️  Database cleaned successfully')
    }).catch((error) => {
        console.error('🤦🏻 An error occured while cleaning the database')
        console.error(error)
        process.exit(1)
    })
}else{
    console.log(`🏗️   Seeding database with ${allCaps}...`)

    // run the seeder
    require('ts-node').register()
    require(seederPath).seed().then(() => {
        console.log('🌱  Database seeded successfully')
        process.exit(0)
    }).catch((error) => {
        console.error('🤦🏻 An error occured while seeding the database')
        console.error(error)
        process.exit(1)
    })
}       

