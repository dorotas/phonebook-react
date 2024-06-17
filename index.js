require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')
const Contact = require('./models/contact')


app.use(express.json())
app.use(express.static('dist'))
app.use(cors())

const requestLogger = (request, response, next) => {
    console.log('Method:', request.method)
    console.log('Path:  ', request.path)
    console.log('Body:  ', request.body)
    console.log('---')
    next()
}
const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

app.use(requestLogger)

app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>')
})

app.get('/api/persons', (request, response) => {
    Contact.find({}).then(contacts => response.json(contacts))
})

app.get('/api/persons/:id', (request, response) => {
    Contact.findById(request.params.id).then(contact => response.json(contact))
})

app.post('/api/persons', (request, response) => {
    const body = request.body

    if (!body.name || !body.number) {
        return response.status(400).json({
            error: 'Content missing'
        })
    }

    const contact = new Contact({
        name: body.name,
        phoneNumber: body.number
    })

    contact.save().then(savedContact => response.json(savedContact))
})

app.delete('/api/persons/:id', (request, response) => {
    response.status(204).end()
})


const PORT = process.env.PORT
app.listen(PORT)
console.log(`Server running on port ${PORT}`)