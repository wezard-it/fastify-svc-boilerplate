import { type Template } from '@prisma/client'
import db from '../../utils/db'

async function index(): Promise<Template[]> {
    return db.template.findMany()
}

async function store(template: any): Promise<Template> {
    return db.template.create({
        data: template
    })
}

async function show(id: string): Promise<Template | null> {
    return db.template.findUnique({
        where: {
            id
        }
    })
}

async function update(id: string, template: any): Promise<Template> {
    return db.template.update({
        where: {
            id
        },
        data: template
    })
}

async function destroy(id: string): Promise<Template> {
    return db.template.delete({
        where: {
            id
        }
    })
}

export default {
    index,
    store,
    show,
    update,
    destroy
}
