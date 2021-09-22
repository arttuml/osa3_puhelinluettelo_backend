require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')
const app = express()

app.use(express.static('build'))
app.use(cors())
app.use(express.json())


morgan.token('post', (req) => {
    return JSON.stringify(req.body)
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :post'))

const generatedId = () => {
    const id = Math.floor(Math.random() * 100000)
    return id
}

app.post('/api/persons', (req, res) => {
    const body = req.body
    // const nameUniqueTest = Person.find(p => p.name.toLocaleLowerCase() === body.name.toLocaleLowerCase())

    // if (!body.number || !body.name) {
    //     return res.status(400).json({
    //         error: 'content missing'
    //     })
    // }

    // if (nameUniqueTest) {
    //     return res.status(400).json({
    //         error: 'name must be unique'
    //     })
    // }

    const person = new Person({
        name: body.name,
        number: body.number
    })

    person.save().then(savedNote => {
        res.json(savedNote)
    })
})

app.get('/api/persons', (req, res) => {
    Person.find({}).then(persons => {
        res.json(persons)
    })
})

app.get('/api/persons/:id', (req, res) => {
    Person.findById(req.params.id)
    .then(person => {
        res.json(person)
    })
    .catch((error) => {
        res.status(404).send({ error: 'unknown id'})
    })
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