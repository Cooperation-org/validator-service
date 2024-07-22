document.getElementById('statementForm').addEventListener('submit', function (event) {
  event.preventDefault()

  const statement = document.getElementById('statement').value
  console.log(statement)

  fetch('/create-claim', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ statement: statement })
  })
    .then(response => {
      console.log('===== response :', response)
      if (!response.ok) {
        throw new Error('Network response was not ok')
      }
      return response.json()
    })
    .then(data => {
      console.log('======== data:', data)
      const messageDiv = document.getElementById('message')
      messageDiv.innerText = 'Statement submitted successfully!'
      messageDiv.classList.add('success')
      messageDiv.classList.remove('error')
      messageDiv.style.display = 'block'

      setTimeout(() => {
        messageDiv.style.display = 'none'
      }, 3000)

      document.getElementById('statementForm').reset()
    })
    .catch(error => {
      console.error('======== err:', error)
      const messageDiv = document.getElementById('message')
      messageDiv.innerText = 'Error submitting statement.'
      messageDiv.classList.add('error')
      messageDiv.classList.remove('success')
      messageDiv.style.display = 'block'

      setTimeout(() => {
        messageDiv.style.display = 'none'
      }, 3000)
    })
})
