const express = require('express')

const UserMateriasService = require('../services/usersMaterias')


function userMateriasApi(app) {
  const router = express.Router()
  app.use('/api/user-materias', router)

  const userMateriasService = new UserMateriasService()

  router.get('/', async function (req, res, next)){
    const { userID } = req.query

    try {

      const usersMaterias = await userMateriasService.getUserMaterias({ userID })

      res.status(200).json({
        data: usersMaterias,
        message: "materias listadas"
      })

    } catch (error) {
      next(error)
    }
  }
}