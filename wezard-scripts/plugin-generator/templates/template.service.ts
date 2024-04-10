import templateRepository from './templates.repository'
import { type Template } from '@prisma/client'
import WezardError from '../../utils/WezardError'
import { APIErrors } from '../../utils/consts'

async function list(): Promise<Template[]> {
    return await templateRepository.list()
}

async function store(template: any): Promise<Template> {
    return templateRepository.store(template)
}

async function get(id: string): Promise<Template | null> {
    const template = await templateRepository.show(id)

    if (!template) {
        throw WezardError.fromDef(APIErrors.TemplateNotFound)
    }

    return template
}

async function update(id: string, template: any): Promise<Template> {
    return await templateRepository.update(id, template)
}

async function destroy(id: string): Promise<Template> {
    return await templateRepository.destroy(id)
}

export default {
    list,
    store,
    get,
    update,
    destroy
}
