const express = require('express')
const bodyParser = require('body-parser')
const genApi = require('./api')

const run = async () => {	
	const app = express()
	const port = 3000	

	const api = genApi()

	app.use(bodyParser.json())
	app.get('/', (req, res) => res.send('Hello World!'))
	app.use(api)
	
	app.listen(port, () => console.log(
		`nebula-server listening on port ${port}!`
	))
}

run()

