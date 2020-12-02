
const mapInSequence = async (array, func) => {
    const mapIter = async (remainingArray = array, index = 0) => {
        if (remainingArray.length === 0) return []
        const entry = remainingArray[0]
        const processedEntry = await func(entry, index)
        return [
            processedEntry,
            ...(await mapIter(
                remainingArray.slice(1),
                func,
                index + 1
            ))
        ]
    }
    return mapIter()
}

module.exports = {
    mapInSequence
}
