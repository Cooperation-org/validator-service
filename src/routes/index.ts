import { Router } from 'express'
import { UserController } from '../controllers'

const router = Router()
const userController = new UserController()

router.post('/', userController.createClaim)
router.post('/create-claim', userController.createDetailedClaim)
router.post('/send-validation', userController.sendValidationRequests)
router.post('/validate/:validationId', userController.validateClaim)
router.get('/report/:claimId', userController.generateReport)

export default router
