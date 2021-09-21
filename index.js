const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()

app.use(cors())
app.use(express.json())

morgan.token('post', (req) => {
    return JSON.stringify(req.body)
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :post'))


let persons = [
    {
        id: 1,
        name: "Arto Hellas",
        number: "040-123456"
    },
    {
        id: 2,
        name: "Ada Lovelace",
        number: "39-44-5323523"
    },
    {
        id: 3,
        name: "Dan Abramov",
        number: "12-43-234345"
    },
    {
        id: 4,
        name: "Mary Poppendick",
        number: "39-23-6423122"
    },
]

const generatedId = () => {
    const id = Math.floor(Math.random() * 100000)
    return id
}

app.post('/api/persons', (req, res) => {
    const body = req.body
    const nameUniqueTest = persons.find(p => p.name.toLocaleLowerCase() === body.name.toLocaleLowerCase())

    if (!body.number || !body.name) {
        return res.status(400).json({
            error: 'content missing'
        })
    }

    if (nameUniqueTest) {
        return res.status(400).json({
            error: 'name must be unique'
        })
    }

    const person = {
        id: generatedId(),
        name: body.name,
        number: body.number
    }

    persons = persons.concat(person)
    res.json(person)
})

app.get('/api/persons', (req, res) => {
    res.json(persons)
})

app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    const person = persons.find(p => p.id === id)
    
    if (person) {
        res.json(person)
    } else {
        res.status(404).end()
    }
})

app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    persons = persons.filter(person => person.id !== id)

    res.status(204).end()


})

app.get('/info', (req, res) => {
    console.log('/info working')
    const date = new Date()
    res.send(
        `<div>
            <p>Phonebook has info for ${persons.length} people</p>
            <p>${date}</p>
        </div>`
    )
})



const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`)
})