const express = require('express')
const app = express()
const port = 8080

app.listen(port, () => {
    console.log(`Whist server listening on port ${port}`)
})

app.get('/', (req, res) => {
    res.send('Hello World!')
})

// app.get('/api')

