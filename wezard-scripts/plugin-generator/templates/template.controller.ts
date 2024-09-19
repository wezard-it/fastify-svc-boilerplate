import { FastifyReply, FastifyRequest } from 'fastify'
import templateService from './templates.service'
import WezardError from '../../utils/WezardError'

const NA = undefined

async function list(req: FastifyRequest, res: FastifyReply): Promise<void> {
    try {
        const templates = await templateService.list()
        await res.wezardSuccess(res, { templates })
    } catch (e) {
        throw new WezardError('Error in getting templates', 500, NA, NA, e as WezardError, true)
    }
}

async function show(req: FastifyRequest<{ Params: { templateId: string } }>, res: FastifyReply): Promise<void> {
    try {
        const template = await templateService.show(req.params.templateId)
        await res.wezardSuccess(res, { template })
    } catch (e) {
        throw new WezardError('Error in getting template', 500, NA, NA, e as WezardError, true)
    }
}

async function store(req: FastifyRequest<{ Body: any }>, res: FastifyReply): Promise<void> {
    try {
        const template = await templateService.store(req.body)
        await res.wezardSuccess(res, { template })
    } catch (e) {
        throw new WezardError('Error in storing template', 500, NA, NA, e as WezardError, true)
    }
}

async function update(
    req: FastifyRequest<{ Params: { templateId: string }; Body: any }>,
    res: FastifyReply
): Promise<void> {
    try {
        const template = await templateService.update(req.params.templateId, req.body)
        await res.wezardSuccess(res, { template })
    } catch (e) {
        throw new WezardError('Error in updating template', 500, NA, NA, e as WezardError, true)
    }
}

async function destroy(req: FastifyRequest<{ Params: { templateId: string } }>, res: FastifyReply): Promise<void> {
    try {
        await templateService.destroy(req.params.templateId)
        await res.wezardSuccess(res, {})
    } catch (e) {
        throw new WezardError('Error in deleting template', 500, NA, NA, e as WezardError, true)
    }
}

export default {
    list,
    show,
    store,
    update,
    destroy
}
