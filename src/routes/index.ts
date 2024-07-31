import { Router } from 'express'
import { UserController } from '../controllers'
import prisma from '../../prisma/prisma-client'

const router = Router()
const userController = new UserController()

// following route for create cliam in DB without statment
router.post('/', userController.createUserInfo)

router.get('/:claimId', userController.getUserInfo)

// following route for adding statement to claim
router.post('/add-statement', userController.addClaimStatement)

// following route for sending validation requests to validators
router.post('/send-validation-requests', userController.sendValidationRequests)

router.post('/validate/:validationId', userController.validateClaim)

router.get('/report/:claimId', userController.generateReport)

// helper route to get candidUSerInfo by claimId
router.get('/claim/:claimId', async (req, res) => {
  try {
    const claimId = req.params.claimId
    const result = await prisma.candidUserInfo.findUnique({
      where: { claimId: +claimId }
    })

    res.status(200).json(result)
  } catch (error: any) {
    res.status(500).json({ message: 'Error getting claim: ' + error.message })
  }
})

export default router
