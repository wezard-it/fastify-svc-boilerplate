const fs = require('fs')
const path = require('path')
const folderName = process.argv[2]

if (!folderName) {
    console.error('You must provide a folder name')
    process.exit(1)
}

// Check if the folder already exists
if (fs.existsSync(path.join(__dirname, '../../src', 'plugins', folderName))) {
    console.error(`🤦🏻 The folder ${folderName} already exists in the plugins folder. Please choose another name.`)
    process.exit(1)
}

console.log(`🏗️   Creating plugin ${folderName}...`)

const pluginFolderPath = path.join(__dirname, '../../src', 'plugins', folderName + 's')

// Create the new folder
fs.mkdirSync(pluginFolderPath)

const templatePath = path.join(__dirname, 'templates')

fs.readdirSync(templatePath).forEach((file) => {
    const content = fs.readFileSync(path.join(templatePath, file), 'utf8')
    fs.writeFileSync(path.join(pluginFolderPath, file), content)
})

// edit content of the files, replace the word template with the folder name
for (const file of fs.readdirSync(pluginFolderPath)) {
    const filePath = path.join(pluginFolderPath, file)
    const content = fs.readFileSync(filePath, 'utf8')

    const newContent = content.replace(/template/g, folderName)
    fs.writeFileSync(filePath, newContent)

    const newerContent = newContent.replace(/Template/g, folderName.charAt(0).toUpperCase() + folderName.slice(1))
    fs.writeFileSync(filePath, newerContent)
}

for (const file of fs.readdirSync(pluginFolderPath)) {
    const filePath = path.join(pluginFolderPath, file)
    const newFilePath = path.join(pluginFolderPath, file.replace('template', folderName + 's'))
    fs.renameSync(filePath, newFilePath)
}

console.log(`🚀  Plugin ${folderName} created successfully! You can start coding... `)
