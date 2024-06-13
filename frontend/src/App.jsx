import {useEffect, useState} from 'react'
import phoneService from './services/phones.js'
import Notification from './components/Notification.jsx'

const App = () => {
    const [persons, setPersons] = useState([])
    const [newName, setNewName] = useState('')
    const [newNumber, setNewNumber] = useState('')
    const [filteredName, setFilteredName] = useState('')
    const [notification, setNotification] = useState(null)
    const [error, setError] = useState(null)

    const handleNameChange = event => {
        setNewName(event.target.value)
    }

    const handleNumberChange = event => {
        setNewNumber(event.target.value)
    }

    const handleFilter = event => {
        setFilteredName(event.target.value)
    }

    const handleDelete = id => {
        if (window.confirm('Are you sure you want to delete?')) {
            phoneService.deleteContact(id)
                .then(response => setPersons(persons.filter(person => person.id !== response.id)))
                .catch(error => {
                    setError('This person was already removed from phonebook')
                    setTimeout(() => {
                        setError(null)
                    }, 5000)
                })
        }
    }

    const alertMsg = `${newName} is already added to phonebook`

    const addNewPerson = event => {
        event.preventDefault()
        const newPerson = {
            name: newName,
            number: newNumber
        }
        phoneService.addContact(newPerson).then(addedResponse => {
            if (addedResponse === null) {
                if(window.confirm('Are you sure you want to replace?')) {
                    phoneService.addContact(newPerson, true).then( addedResponse => {
                        setPersons(persons.filter(contact => contact.name !== addedResponse.name).concat(addedResponse))
                        setNewName('')
                        setNewNumber('')
                        setNotification(`${addedResponse.name} was updated successfully`)
                        setTimeout(() => {
                            setNotification(null)
                        }, 5000)
                    })
                }
            } else {
                setPersons(persons.concat(addedResponse))
                setNewName('')
                setNewNumber('')
                setNotification(`${addedResponse.name} was added successfully`)
                setTimeout(() => {
                    setNotification(null)
                }, 5000)
            }
        })
    }

    useEffect(() => {
        phoneService.getContacts(filteredName).then(returnedContacts => setPersons(returnedContacts))
    }, [filteredName]);

    return (
        <div>
            <h1>Phonebook</h1>
            <Notification message={notification} className='notification' />
            <Notification message={error} className='error' />
            Filter: <input value={filteredName} onChange={handleFilter}/>
            <h2>Add new</h2>
            <form onSubmit={addNewPerson}>
                <div>
                    name: <input value={newName} onChange={handleNameChange}/>
                </div>
                <div>
                    number: <input value={newNumber} onChange={handleNumberChange}/>
                </div>
                <div>
                    <button type="submit">add</button>
                </div>
            </form>
            <h2>Numbers</h2>
            <div>
                <ul>
                    {persons.map((person) => (
                        <li className='note' key={person.id}>
                            {person.id} {person.name} {person.number}
                            {/*<button onClick={() => handleDelete(person.id)}>delete</button>*/}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    )
}

export default App