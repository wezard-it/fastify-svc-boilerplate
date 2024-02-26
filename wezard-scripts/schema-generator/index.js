const tjs = require('typescript-json-schema')

const fs = require('fs')
const path = require('path')

const settings = {
    required: true,
    ref: false
}
const compilerOptions = {
    strictNullChecks: true
}

const findTypeScriptFiles = async (directoryPath, list = []) => {
    const files = await fs.promises.readdir(directoryPath, { withFileTypes: true });
    const typeScriptFiles = files.filter((file) => file.isFile() && file.name.endsWith('.types.ts'));
  
    for (const file of typeScriptFiles) {
      list.push('./' + path.join(directoryPath, file.name));
    }
  
    const subdirectories = files.filter((file) => file.isDirectory());
    for (const subdirectory of subdirectories) {
      await findTypeScriptFiles(path.join(directoryPath, subdirectory.name), list);
    }
    return list;
}
  

(async () => {
    const typescriptFilesArray = await findTypeScriptFiles('src');

    const program = tjs.getProgramFromFiles(
        typescriptFilesArray,
        compilerOptions,
        './'
    )
    
    const schema = tjs.generateSchema(program, '*', settings)
    fs.writeFileSync('_schema.ts', `const schema = ${JSON.stringify(schema)} as const;\nexport default schema.definitions;`)
    
    console.log('Schema generated successfully! 🎉');
    return true;
})();




