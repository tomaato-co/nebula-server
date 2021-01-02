const fs = require('fs-extra')
const path = require('path')
const {mapInSequence} = require('../../asyncOps')

const readFolders = async (dir) => {
	// Read filenames under apps folder.
	const getFilenames = async () => {
		try {
			return await fs.readdir(dir)
		} catch (err) {
            throw err
		}	
	}
    const filenames = await getFilenames()
    
	// Filter filenames to only those that are folders.
	const getFolders = async () => {
		try {
			const allFilesInfo = await mapInSequence(
				filenames, 
				async (filename) => {
					const filepath = path.join(dir, filename)
					const stat = await fs.stat(filepath)
					return { filename, stat }
				}
			)
			const foldersInfo = allFilesInfo.filter(
				({ stat }) => stat.isDirectory()
			)
			const folders = foldersInfo.map(
				({ filename }) => filename
			)
			return folders
		} catch (err) {
			throw err
		}
	}
    const folders = await getFolders()
    return folders
}

module.exports = readFolders