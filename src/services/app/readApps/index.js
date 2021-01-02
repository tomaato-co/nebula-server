const readFolders = require('../../../util/ioOps/readFolders')
const appErr = require('../appErr')


const readApps = async () => {
	// Get folder names.
	const getFolders = async () => {
		try {
			const folders = await readFolders('./apps')
			return folders
		} catch (err) {
			console.error(err.message)
			throw appErr({
				name: APP_SERV_ERR.IO_ERROR,
				message: 'Could not read app folders.'
			})
		}
	}
	const folders = await getFolders()

	// Return folder names as app names.
	const appNames = folders
	return appNames
}

module.exports = readApps
