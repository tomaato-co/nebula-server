//

const updateDeployment = async (appId, depId) => {
    // Get deployment directory.
    const depDir = path.join(
        './apps', appId, 
        'deployments', depId
    )

    // Read deployment info.
    const depJsonPath = path.join(depDir, 'deployment.json')
    const depJson = (await fs.readFile(depJsonPath)).toString()
    const depInfo = JSON.parse(depJson)

    // Error if already deployed.
    const { date } = depInfo
    if (date !== null) {
        throw new Error(`Deployment already deployed.`)
    }

    // Clear /public.
    const publicDir = path.join(
        './apps', appId, 'public'
    )
    await fs.rmdir(publicDir, { recursive: true })

    // Copy new files into /public.
    const filesDir = path.join(depDir, 'files')
    await fs.copy(filesDir, publicDir)

    // Set deployment date.
    const updatedDepInfo = {
        ...depInfo,
        date: Date.now()
    }
    const updatedDepJson = JSON.stringify(updatedDepInfo)
    await fs.writeFile(depJs, updatedDepJson)
}