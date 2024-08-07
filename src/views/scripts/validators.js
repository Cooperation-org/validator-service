const SERVER_URL = 'http://localhost:3000/api/v0'

document.addEventListener('DOMContentLoaded', async () => {
  const contactsContainer = document.getElementById('contactsContainer')
  const addContactButton = document.getElementById('addContactButton')
  const submitButton = document.getElementById('submitButton')
  const errorContainer = document.getElementById('errorContainer')

  const urlParams = new URLSearchParams(window.location.search)
  const claimId = urlParams.get('claimId')

  console.log('claimId: ', claimId)

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

  function createModal(message) {
    const modal = document.createElement('div')
    modal.className = 'modal'
    modal.innerHTML = `
      <div class="modal-content">
        <p>${message}</p>
      </div>
    `
    document.body.appendChild(modal)
    return modal
  }

  function showModal(modal) {
    modal.style.display = 'flex'
    setTimeout(() => {
      modal.style.opacity = '1'
    }, 10)
  }

  function hideModal(modal) {
    modal.style.opacity = '0'
    setTimeout(() => {
      modal.style.display = 'none'
      document.body.removeChild(modal)
    }, 300)
  }

  addContactRow()
  addContactRow()

  addContactButton.addEventListener('click', addContactRow)

  submitButton.addEventListener('click', async () => {
    let candidUserInfo

    try {
      const response = await fetch(`${SERVER_URL}/user/${claimId}`)
      const data = await response.json()
      console.log('data:', data)
      if (!response.ok) {
        throw new Error('Failed to fetch userInfoId')
      }
      candidUserInfo = data
    } catch (error) {
      console.error('Error fetching userInfoId:', error)
      errorContainer.textContent = 'Error! Please try again later.'
      return
    }

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
        const formData = {
          userInfoId: candidUserInfo.id,
          contacts
        }

        const response2 = await fetch(`${SERVER_URL}/send-validation-requests`, {
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

        if (response2.ok) {
          const successModal = createModal('Contacts submitted successfully!')
          showModal(successModal)

          setTimeout(() => {
            hideModal(successModal)
            contactRows.forEach(row => {
              const emailInput = row.querySelector('input[type="email"]')
              const nameInput = row.querySelector('input[type="text"]')
              emailInput.value = ''
              nameInput.value = ''
            })
          }, 5000)
        } else {
          errorContainer.textContent = 'Error submitting contacts. Please try again.'
        }
      } catch (error) {
        console.error('Error submitting contacts:', error)
        errorContainer.textContent = 'Error! Please try again later.'
      }
    }
  })
})
