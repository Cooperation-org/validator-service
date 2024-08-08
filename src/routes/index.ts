import { Router } from 'express'
import { UserController } from '../controllers'
import prisma from '../../prisma/prisma-client'

const router = Router()
const userController = new UserController()

// following route for create cliam in DB without statment
//! PUBLIC ROUTES
router.post('/validate', userController.createUserInfo)
router.get('/report/:claimId', userController.generateReport)

router.get('/user/:claimId', userController.getUserInfo)

// following route for adding statement to claim
router.post('/add-statement', userController.addClaimStatement)

// following route for sending validation requests to validators
router.post('/send-validation-requests', userController.sendValidationRequests)

router.post('/validate/:validationId', userController.validateClaim)

router.get('/validation/:validationId', userController.getValidationRequest)

router.get('/claim/:claimId', userController.getClaim)

export default router
