import axios from 'axios'
const baseUrl = '/api/persons'

const addContact = (contact, replace= false) => {
    return getContacts('').then(contacts => {
        const existingContact = contacts.find(c => c.name === contact.name)
        if (!existingContact) {
            console.log("Create new", contact)
            return axios.post(baseUrl, contact).then(res => res.data)
        } else if (replace) {
            return axios.put(`${baseUrl}/${existingContact.id}`, contact).then(res => {
                console.log(res)
                return res.data
            })
        }
        return null
    })
}


const updateContact = (contact) => {
    return axios.put(`${baseUrl}/${contact.id}`, contact).then(response => response.data)
}

const getContacts = (filter) => {
    return axios.get(baseUrl).then(res => {
        return res.data.filter(contact => contact.name.toLowerCase().includes(filter.toLowerCase()))
    })
}

const deleteContact = (id) => {
    return axios.delete(`${baseUrl}/${id}`).then(response => {
        return response.data
    })
}

export default {addContact, getContacts, deleteContact}