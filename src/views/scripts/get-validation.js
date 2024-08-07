const SERVER_URL = 'http://localhost:3000'

document.addEventListener('DOMContentLoaded', async () => {
  let selectedRating = 0

  const showMessage = (message, isError = true) => {
    const messageDiv = document.getElementById('error-message')
    messageDiv.textContent = message
    messageDiv.classList.add('visible')
    if (isError) {
      messageDiv.style.color = '#ff4d4d'
    } else {
      messageDiv.style.color = '#26a69a'
    }
    setTimeout(() => {
      messageDiv.classList.remove('visible')
    }, 3000)
  }

  const showContent = data => {
    document.getElementById(
      'welcome-message'
    ).textContent = `Welcome ${data.validatorName}! We value your input, thank you for helping keep it real`
    document.getElementById(
      'user-help'
    ).textContent = `${data.userFirstName} needs your help`
    document.getElementById('user-statement').textContent = data.userStatement
    document.getElementById('issued-date').textContent = `Issued date: ${data.issuedDate}`
    document.querySelector('.content').style.display = 'flex'
    document.getElementById('loading').style.display = 'none'
  }
  const getReqData = async () => {
    try {
      const validationRequestId = document.body.getAttribute('data-validation-request-id')

      const validationRequestResponse = await fetch(
        `${SERVER_URL}/api/v0/validation/${validationRequestId}`
      )
      if (!validationRequestResponse.ok) {
        throw new Error(`HTTP error! status: ${validationRequestResponse.status}`)
      }
      const validationRequest = await validationRequestResponse.json()

      const candidUserResponse = await fetch(
        `${SERVER_URL}/api/v0/user/${validationRequest.claimId}`
      )
      if (!candidUserResponse.ok) {
        throw new Error(`HTTP error! status: ${candidUserResponse.status}`)
      }
      const candidUser = await candidUserResponse.json()

      const claimResponse = await fetch(
        `${SERVER_URL}/api/v0/claim/${validationRequest.claimId}`
      )
      if (!claimResponse.ok) {
        throw new Error(`HTTP error! status: ${claimResponse.status}`)
      }
      const claim = await claimResponse.json()
      return {
        validatorName: validationRequest.validatorName,
        userFirstName: candidUser.firstName,
        userStatement: claim.statement,
        issuedDate: new Date(validationRequest.createdAt).toDateString()
      }
    } catch (error) {
      console.error('Error:', error)
      return null
    }
  }

  const data = await getReqData()

  if (data) {
    showContent(data)
  } else {
    showMessage('Error loading data', true)
  }

  document.querySelectorAll('.star').forEach(star => {
    star.addEventListener('click', function () {
      selectedRating = this.getAttribute('data-value')
      document.querySelectorAll('.star').forEach(s => {
        if (s.getAttribute('data-value') <= selectedRating) {
          s.classList.add('selected')
        } else {
          s.classList.remove('selected')
        }
      })
      console.log(`Rating selected: ${selectedRating}`)
    })
  })

  document.getElementById('submit').addEventListener('click', function () {
    const statement = document.getElementById('statement').value.trim()
    if (statement === '') {
      showMessage('Please provide an explanation.')
    } else if (selectedRating === 0) {
      showMessage('Please provide a rating.')
    } else {
      const data = {
        validationRequestId: document.body.getAttribute('data-validation-request-id'),
        rating: selectedRating,
        statement: statement
      }
      handleSubmit(data)
      showMessage('Thank you for your input!', false)
      document.getElementById('statement').value = ''
      document.querySelectorAll('.star').forEach(s => s.classList.remove('selected'))
      selectedRating = 0
    }
  })

  const handleSubmit = async data => {
    try {
      const response = await fetch(
        `${SERVER_URL}/api/v0/validate/${data.validationRequestId}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            rating: +data.rating,
            statement: data.statement
          })
        }
      )

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const result = await response.json()
      return result
    } catch (error) {
      console.error('Error:', error)
    }
  }
})
