// const SERVER_URL = 'http://localhost:3000'
const SERVER_URL = 'https://validator-service-c7m2.onrender.com'

document.getElementById('statementForm').addEventListener('submit', function (event) {
  event.preventDefault()

  const statement = document.getElementById('statement').value
  console.log(statement)

  let claimId

  const urlParams = new URLSearchParams(window.location.search)
  const id = urlParams.get('id')

  fetch('/api/v0/add-statement', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ statement: statement, id })
  })
    .then(response => {
      console.log('===== response :', response)
      if (!response.ok) {
        throw new Error('Network response was not ok')
      }
      return response.json()
    })
    .then(result => {
      claimId = result.data.claim.id

      const messageDiv = document.getElementById('message')
      messageDiv.innerText = 'Statement submitted successfully!'
      messageDiv.classList.add('success')
      messageDiv.classList.remove('error')
      messageDiv.style.display = 'block'
      setTimeout(() => {
        messageDiv.style.display = 'none'
        // Redirect to the desired URL after successful submission
        window.location.href = `${SERVER_URL}/recommend?claimId=${claimId}`
      }, 1000)

      document.getElementById('statementForm').reset()
    })
    .catch(error => {
      console.error('======== err:', error)
      const messageDiv = document.getElementById('message')
      if (
        error.message === 'Claim already exists' ||
        error.message === 'Network response was not ok'
      ) {
        messageDiv.innerText = 'You already submitted your statement for this claim.'
      } else {
        messageDiv.innerText = 'Error submitting statement.'
      }
      messageDiv.classList.add('error')
      messageDiv.classList.remove('success')
      messageDiv.style.display = 'block'

      setTimeout(() => {
        messageDiv.style.display = 'none'
      }, 3000)
    })
})
