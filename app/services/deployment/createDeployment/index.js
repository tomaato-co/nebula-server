const genId = require('../../../util]/genId')

const createDeployment = (appId) => {    
    // Get all deployments.
    const allDeployments = await readDeployments(appId)
    
    // If any deployment has 'dateDeployed' property of 'null',
    // this means there is an active deployment and new one 
    // cannot be created.
    allDeployments.forEach((deployment) => {
        if (deployment.dateDeployed === null) {
            throw new Error(
                'Active deployment already exists.'
            )
        }
    })

    // Sort deployments by date.
    const sortedDeployments = allDeployments.sort(
        (a, b) => (a.dateDeployed > b.dateDeployed)
    )

    // Generate new deployment id (avoid conflict).
    const existingIds = allDeployments.map(({id}) => id)
    const genDepId = () => {
        const id = genId()
        if (existingIds.includes(id))
            return genDepId()
        return id
    }
    const newDeploymentId = genDepId()

    // Copy most recent deployment folder.
    const previousDeployment = sortedDeployments.first()
    const previousDepDir = path.join(
        './apps', appId, 'deployments', previousDeployment.id
    )
    const newDepDir = path.join(
        './apps', appId, 'deployments', newDeploymentId
    )
    await fs.copy(previousDepDir, newDepDir)

    // Write into deployment.json
    const deploymentInfo = {
        ...previousDeployment,
        id: newDeploymentId,
        dateDeployed: null
    }
    const deploymentJson = JSON.stringify(deploymentInfo)
    const depJsonPath = path.join(newDepDir, 'deployment.json')
    await fs.writeFile(depJsonPath, deploymentJson)

    // Return id.
    return newDeploymentId
}

module.exports = createDeployment
