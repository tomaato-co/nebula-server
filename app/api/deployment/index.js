

//

const createDeployment = require("../../services/deployment/createDeployment")

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
        res.status(200).json({ deployments })
    } catch (err) {
        throw err
    }
}

const getDeployment = async (req, res) => {
    try {
        const { appId, depId } = req.params
        const deployments = await readDeployments(appId, depId)
        res.status(200).json({ deployments })
    } catch (err) {
        throw err
    }
}

// 

const serveDeploymentApi = (router) => {
    router.post('/api/app/:appId/deployment', postDeployment)
    router.get('/api/app/:appId/deployments', getDeployments)
    router.get('/api/app/:appId/deployment/:depId', getDeployment)
}

module.exports = serveDeploymentApi