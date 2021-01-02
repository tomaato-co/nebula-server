

const readDeployment = async (appId, depId) => {
    // Read deployment.json
    const depPath = path.join(
        '/apps', appId, 
        'deployments', depId,
        'deployment.json'
    )
    const deploymentJson = (await fs.readFile(depPath)).toString()
    const {
        date
    } = JSON.parse(deploymentJson)
    const deploymentInfo = {
        id: depId,
        date
    }
    return deploymentInfo
}