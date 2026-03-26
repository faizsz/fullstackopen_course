const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

const url = `mongodb://fullstack:${password}@ac-kijun9f-shard-00-00.hl7wgtf.mongodb.net:27017,ac-kijun9f-shard-00-01.hl7wgtf.mongodb.net:27017,ac-kijun9f-shard-00-02.hl7wgtf.mongodb.net:27017/phonebook?ssl=true&replicaSet=atlas-rnq7hp-shard-0&authSource=admin&appName=phonebook`

mongoose.set('strictQuery', false)

mongoose.connect(url)
  .then(() => console.log('Connected to MongoDB!'))
  .catch(err => console.log('Error:', err.message))

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

// node mongo.js <password> <name> <number>  → add entry
// node mongo.js <password>                  → list all
if (process.argv.length === 3) {
  // List all persons
  Person.find({}).then(persons => {
    console.log('phonebook:')
    persons.forEach(p => console.log(p.name, p.number))
    mongoose.connection.close()
  })
} else if (process.argv.length === 5) {
  // Add new person
  const person = new Person({
    name: process.argv[3],
    number: process.argv[4],
  })

  person.save().then(() => {
    console.log(`added ${person.name} number ${person.number} to phonebook`)
    mongoose.connection.close()
  })
} else {
  console.log('Usage:')
  console.log('  node mongo.js <password>                   → list all')
  console.log('  node mongo.js <password> <name> <number>  → add entry')
  mongoose.connection.close()
}