const fs = require('fs-extra')
const path = require('path')
const genId = require('../../../util/genId')

const createDeployment = async (appId) => {    
    // Get all deployments.
    const allDeps = await readDeployments(appId)
    
    // If any deployment has 'dateDeployed' property of 'null',
    // this means there is an active deployment and new one 
    // cannot be created.
    allDeps.forEach((dep) => {
        if (dep.dateDeployed === null) {
            throw new Error(
                'Active deployment already exists.'
            )
        }
    })

    // Generate new deployment id (avoid conflict).
    const existingIds = allDeps.map(({id}) => id)
    const genDepId = () => {
        const id = genId()
        if (existingIds.includes(id))
            return genDepId()
        return id
    }
    const newDepId = genDepId()

    // Copy files from /public
    const publicDir = path.join(
        './apps', appId, 'public'
    )
    const filesDir = path.join(
        './apps', appId, 
        'deployments', newDepId,
        'files'
    )
    await fs.copy(publicDir, filesDir)

    // Write into deployment.json
    const depInfo = {
        date: null
    }
    const depJson = JSON.stringify(depInfo)
    const depJsonPath = path.join(newDepDir, 'deployment.json')
    await fs.writeFile(depJsonPath, depJson)

    // Return id.
    return newDepId
}

module.exports = createDeployment
