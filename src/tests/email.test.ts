import { sendEmail } from '../utils/email'

jest.mock('../utilities/email', () => ({
  sendEmail: jest.fn()
}))

describe('sendEmail tests', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('sendEmail', async () => {
    ;(sendEmail as jest.Mock).mockResolvedValue('Email sent successfully')

    const response = await sendEmail({
      to: ['kfattem@gmail.com'],
      subject: 'Test Jest',
      body: 'test email from Jest'
    })
    expect(response).toBe('Email sent successfully')
  })

  test('sendEmail with invalid email', async () => {
    ;(sendEmail as jest.Mock).mockRejectedValue(new Error('Invalid email address'))

    try {
      await sendEmail({
        to: ['kfattem'],
        subject: 'Test Jest',
        body: 'test email from Jest'
      })
    } catch (error: any) {
      expect(error.message).toBe('Invalid email address')
    }
  })

  test('sendEmail to multiple users', async () => {
    ;(sendEmail as jest.Mock).mockResolvedValue('Email sent successfully')

    const response = await sendEmail({
      to: ['kfattem@gmail.com', 'kholoudfattem@gmail.com'],
      subject: 'Test Jest to multiple',
      body: 'test email from Jest'
    })
    expect(response).toBe('Email sent successfully')
  })

  test('sendEmail with empty email', async () => {
    ;(sendEmail as jest.Mock).mockRejectedValue(new Error('Email address list is empty'))

    try {
      await sendEmail({
        to: [],
        subject: 'Test Jest',
        body: 'test email from Jest'
      })
    } catch (error: any) {
      expect(error.message).toBe('Email address list is empty')
    }
  })

  test('sendEmail with empty subject', async () => {
    ;(sendEmail as jest.Mock).mockRejectedValue(new Error('Subject is empty'))

    try {
      await sendEmail({
        to: ['kfattem@gmail.com'],
        subject: '',
        body: 'test email from Jest'
      })
    } catch (error: any) {
      expect(error.message).toBe('Subject is empty')
    }
  })
})
