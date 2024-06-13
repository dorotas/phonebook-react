const express = require('express')
const app = express()
const cors = require('cors')

app.use(express.json())
app.use(express.static('dist'))
app.use(cors())

let phonebook = [
    {
        "name": "Arto Hellas",
        "number": "040-123456",
        id: 1
    },
    {
        "name": "Ada Lovelace",
        "number": "39-44-5323523",
        id: 2
    }
]

const generateId = () => {
    const maxId = phonebook.length > 0
        ? Math.max(...phonebook.map(n => n.id))
        : 0
    return maxId + 1
}

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
    response.json(phonebook)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    console.log(id)
    const contact = phonebook.find(contact => contact.id === id)
    if (contact) {
        response.json(contact)
    } else {
        response.statusMessage = "Contact not found"
        response.status(404).end()
    }
})

app.post('/api/persons', (request, response) => {
    const body = request.body

    console.log("in bed", body)

    if (!body.name || !body.number) {
        return response.status(400).json({
            error: 'Content missing'
        })
    }

    const contact = {
        name: body.name,
        number: body.number,
        id: generateId(),
    }

    phonebook = phonebook.concat(contact)
    response.json(contact)
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    phonebook = phonebook.filter(contact => contact.id !== id)

    response.status(204).end()
})


const PORT = process.env.PORT || 3003
app.listen(PORT)
console.log(`Server running on port ${PORT}`)