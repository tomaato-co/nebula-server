

const readDeployment = async (appId, deploymentId) => {
    // Read deployment.json
    const dir = path.join(
        '/apps', appId, 
        'deployments', deploymentId,
        'deployment.json'
    )
    const deploymentJson = (await fs.readFile(dir)).toString()
    const {
        id,
        files,
        dateDeployed
    } = JSON.parse(deploymentJson)
    const deploymentInfo = {
        id, 
        files,
        dateDeployed
    }
    return deploymentInfo
}