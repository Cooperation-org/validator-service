const BACKEND_URL = 'http://localhost:3000/api/v0'

document.addEventListener('DOMContentLoaded', async () => {
  const contactsContainer = document.getElementById('contactsContainer')
  const addContactButton = document.getElementById('addContactButton')
  const submitButton = document.getElementById('submitButton')
  const errorContainer = document.getElementById('errorContainer')

  const urlParams = new URLSearchParams(window.location.search)
  const claimId = urlParams.get('claimId')
  let candidUserInfo

  try {
    const response = await fetch(BACKEND_URL + `/${claimId}`)
    if (!response.ok) {
      throw new Error('Failed to fetch userInfoId')
    }
    const data = await response.json()
    candidUserInfo = data
  } catch (error) {
    console.error('Error fetching userInfoId:', error)
    errorContainer.textContent = 'Error! Please try again later.'
  }

  function addContactRow() {
    const contactRow = document.createElement('div')
    contactRow.className = 'contactRow'

    const nameInput = document.createElement('input')
    nameInput.type = 'text'
    nameInput.placeholder = 'Name'
    nameInput.className = 'contactInput'

    const emailInput = document.createElement('input')
    emailInput.type = 'email'
    emailInput.placeholder = 'Email'
    emailInput.className = 'contactInput'

    const deleteButton = document.createElement('button')
    deleteButton.type = 'button'
    deleteButton.className = 'deleteButton'
    deleteButton.textContent = 'Delete'
    deleteButton.addEventListener('click', () => {
      contactsContainer.removeChild(contactRow)
    })

    contactRow.appendChild(nameInput)
    contactRow.appendChild(emailInput)
    contactRow.appendChild(deleteButton)
    contactsContainer.appendChild(contactRow)
  }

  addContactRow()
  addContactRow()

  addContactButton.addEventListener('click', addContactRow)

  submitButton.addEventListener('click', async () => {
    const contactRows = document.querySelectorAll('.contactRow')
    const contacts = []
    let hasError = false,
      hasOwnEmail = false

    contactRows.forEach(row => {
      const emailInput = row.querySelector('input[type="email"]')
      const nameInput = row.querySelector('input[type="text"]')
      const email = emailInput.value.trim()
      const name = nameInput.value.trim()

      if ((email && !name) || (!email && name)) {
        hasError = true
        emailInput.classList.add('error')
        nameInput.classList.add('error')
      } else {
        emailInput.classList.remove('error')
        nameInput.classList.remove('error')
      }

      if (email && name) {
        if (email.toLowerCase() === candidUserInfo.email.toLowerCase()) {
          hasOwnEmail = true
          emailInput.classList.add('error')
        }
        contacts.push({ email, name })
      }
    })

    if (hasError) {
      errorContainer.textContent =
        errorContainer.textContent ||
        'Please fill out both the name and email for all contacts.'
    } else if (hasOwnEmail) {
      errorContainer.textContent = 'You cannot add your own email as a contact.'
    } else {
      errorContainer.textContent = ''

      try {
        const response = await fetch(BACKEND_URL + `/claim/${claimId}`)
        if (!response.ok) {
          throw new Error('Failed to fetch userInfoId')
        }
        const data = await response.json()
        const userInfoId = data.id

        const formData = {
          userInfoId,
          contacts
        }

        const response2 = await fetch(BACKEND_URL + '/send-validation-requests', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            claimId: claimId,
            validators: formData.contacts
          })
        })
        console.log('Response:', response2)
      } catch (error) {
        console.error('Error fetching userInfoId:', error)
        errorContainer.textContent =
          'Error! Please try again later.'
      }
    }
  })
})

//  {email: 'kfattem@gmail.com'}
