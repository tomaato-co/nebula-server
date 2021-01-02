const readFolders = require("../../../util/ioOps/readFolders")
const { mapInSequence } = require("../../../util/asyncOps")
const readDeployment = require("../readDeployment")
const { List } = require('immutable')

const readDeployments = async (appId) => {
    // Read deployments folders
    const dir = path.join('./apps', appId, 'deployments')
	const getFolders = async () => {
		try {
			const folders = await readFolders(dir)
			return folders
		} catch (err) {
			console.error(err.message)
			throw new Error('Could not read deployment folders.')
		}
    }
    const folders = await getFolders()

    // Read each individual deployment from folders.
    const deployments = List(
        await mapInSequence(
            folders, (deploymentId) => (
                await readDeployment(appId, deploymentId)
            )
        )
    )
    return deployments
}

module.exports = readDeployments