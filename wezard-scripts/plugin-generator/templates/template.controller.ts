import { FastifyReply, FastifyRequest } from 'fastify'
import templateService from './templates.service'
import WezardError from '../../utils/WezardError'

async function list(req: FastifyRequest, res: FastifyReply): Promise<void> {
    try {
        const templates = await templateService.list()
        await res.wezardSuccess(res, { templates })
    } catch (error) {
        await res.wezardError(res, error as WezardError)
    }
}

async function show(req: FastifyRequest<{ Params: { templateId: string } }>, res: FastifyReply): Promise<void> {
    try {
        const template = await templateService.show(req.params.templateId)
        await res.wezardSuccess(res, { template })
    } catch (error) {
        await res.wezardError(res, error as WezardError)
    }
}

async function store(req: FastifyRequest<{ Body: any }>, res: FastifyReply): Promise<void> {
    try {
        const template = await templateService.store(req.body)
        await res.wezardSuccess(res, { template })
    } catch (error) {
        await res.wezardError(res, error as WezardError)
    }
}

async function update(
    req: FastifyRequest<{ Params: { templateId: string }; Body: any }>,
    res: FastifyReply
): Promise<void> {
    try {
        const template = await templateService.update(req.params.templateId, req.body)
        await res.wezardSuccess(res, { template })
    } catch (error) {
        await res.wezardError(res, error as WezardError)
    }
}

async function destroy(req: FastifyRequest<{ Params: { templateId: string } }>, res: FastifyReply): Promise<void> {
    try {
        await templateService.destroy(req.params.templateId)
        await res.wezardSuccess(res, {})
    } catch (error) {
        await res.wezardError(res, error as WezardError)
    }
}

export default {
    list,
    show,
    store,
    update,
    destroy
}
