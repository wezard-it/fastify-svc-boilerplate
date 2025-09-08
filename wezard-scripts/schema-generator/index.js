/* eslint-env node */
const tjs = require('typescript-json-schema')

const fs = require('fs')
const path = require('path')

const settings = {
    required: true,
    ref: false
}
const compilerOptions = {
    strictNullChecks: true,
    target: 'ES2020',
    module: 'commonjs',
    moduleResolution: 'node',
    esModuleInterop: true,
    allowSyntheticDefaultImports: true,
    skipLibCheck: true
}

const findTypeScriptFiles = async (directoryPath, list = []) => {
    const files = await fs.promises.readdir(directoryPath, { withFileTypes: true })
    const typeScriptFiles = files.filter((file) => file.isFile() && file.name.endsWith('.types.ts'))

    for (const file of typeScriptFiles) {
        list.push('./' + path.join(directoryPath, file.name))
    }

    const subdirectories = files.filter((file) => file.isDirectory())
    for (const subdirectory of subdirectories) {
        await findTypeScriptFiles(path.join(directoryPath, subdirectory.name), list)
    }
    return list
}

;(async () => {
    try {
        const typescriptFilesArray = await findTypeScriptFiles('src')

        if (typescriptFilesArray.length === 0) {
            console.log('No .types.ts files found in src directory')
            fs.writeFileSync('_schema.ts', `const schema = {} as const;\nexport default schema;`)
            return
        }

        console.log(`Found ${typescriptFilesArray.length} type files:`, typescriptFilesArray)

        const program = tjs.getProgramFromFiles(typescriptFilesArray, compilerOptions, './')

        const schema = tjs.generateSchema(program, '*', settings)

        if (!schema || !schema.definitions || Object.keys(schema.definitions).length === 0) {
            console.log('No type definitions found to generate schema from')
            fs.writeFileSync('_schema.ts', `const schema = {} as const;\nexport default schema;`)
            return
        }

        fs.writeFileSync(
            '_schema.ts',
            `const schema = ${JSON.stringify(schema)} as const;\nexport default schema.definitions;`
        )

        console.log('Schema generated successfully! 🎉')
        console.log(`Generated ${Object.keys(schema.definitions).length} type definitions`)
        return true
    } catch (error) {
        console.error('Error generating schema:', error)
        fs.writeFileSync('_schema.ts', `const schema = {} as const;\nexport default schema;`)
        process.exit(1)
    }
})()
