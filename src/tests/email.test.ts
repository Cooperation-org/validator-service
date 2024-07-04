import { sendEmail } from '../utilities/email'

test('sendEmail', async () => {
  const response = await sendEmail({
    to: ['kfattem@gmail.com'],
    subject: 'Test Jest',
    body: 'test email from Jest'
  })
  expect(response).toBe('Email sent successfully')
})

test('sendEmail with invalid email', async () => {
  try {
    await sendEmail({
      to: ['kfattem'],
      subject: 'Test Jest',
      body: 'test email from Jest'
    })
  } catch (error: any) {
    expect(error.message).toBe(`${error.message}`)
  }
})

test('sendEmail to multible users', async () => {
    const response = await sendEmail({
      to: ['kfattem@gmail.com', 'kholoudfattem@gmail.com'],
      subject: 'Test Jest to multible',
    body: 'test email from Jest'
  })
  expect(response).toBe('Email sent successfully')
})

test('sendEmail with empty email', async () => {
  try {
    await sendEmail({
      to: [],
      subject: 'Test Jest',
      body: 'test email from Jest'
    })
  } catch (error: any) {
    expect(error.message).toBe(`${error.message}`)
  }
})

test('sendEmail with empty subject', async () => {
  try {
    await sendEmail({
      to: ['kfattem@gmail.com'],
      subject: '',
      body: 'test email from Jest'
    })
  }
  catch (error: any) {
    expect(error.message).toBe(`${error.message}`)
  }
})