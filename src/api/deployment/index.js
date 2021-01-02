const createDeployment = require("../../services/deployment/createDeployment")
const readDeployment = require("../../services/deployment/readDeployment")
const readDeployments = require("../../services/deployment/readDeployments")
const updateDeployment = require("../../services/deployment/updateDeployment")

//


const postDeployment = async (req, res) => {
    try {
        const { appId } = req.params
        const depId = await createDeployment(appId)
        res.status(201).json({ depId })
    } catch (err) {
        throw err
    }
}

const getDeployments = async (req, res) => {
    try {
        const { appId } = req.params
        const deployments = (await readDeployments(appId)).toJS()
        res.status(200).json(deployments)
    } catch (err) {
        throw err
    }
}

const getDeployment = async (req, res) => {
    try {
        const { appId, depId } = req.params
        const deployment = await readDeployment(appId, depId)
        res.status(200).json(deployment)
    } catch (err) {
        throw err
    }
}

const putDeployment = async (req, res) => {
    try {
        const { appId, depId } = req.params
        await updateDeployment(appId, depId)
        res.status(200).send()
    } catch (err) {
        throw err
    }
}

// 

const serveDeploymentApi = (router) => {
    router.post('/api/app/:appId/deployment', postDeployment)
    router.get('/api/app/:appId/deployments', getDeployments)
    router.get('/api/app/:appId/deployment/:depId', getDeployment)
    router.put('/api/app/:appId/deployment', putDeployment)
}

module.exports = serveDeploymentApi