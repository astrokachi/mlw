import {Router} from  'express';
import {getAllClients, getAllTherapists, getClientByEmail, getTherapistByEmail} from '../controllers/userController';  

const router = Router();
router.get('/clients/:email', getClientByEmail)
router.get('/therapists/:email', getTherapistByEmail)

router.get('/clients', getAllClients)
router.get('/therapists', getAllTherapists)


export default router;