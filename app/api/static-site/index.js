const express = require('express')
const { createStaticSite } = require('../../services/static-site')

//

const postStaticSite = async (req, res, next) => {
	const id = req.params.id
	//
	try {
		await createStaticSite(id)
		res.status(201).send()
	} catch (err) {
		console.error(err)
		res.status(500).json({
			err: err.message
		})
	}
}

//

const serveStaticSiteApi = (router) => {
	router.post('api/static-site/:id', postStaticSite)
}

module.exports = serveStaticSiteApi

