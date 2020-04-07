const express = require('express')

const UserMateriasService = require('../services/usersMaterias')


function userMateriasApi(app) {

  const router = express.Router()
  app.use('/api/user-materias', router)

  const userMateriasService = new UserMateriasService()

  router.post('/all', async function (req, res, next){

    
    
    const {data} = req.body
   
    try {
      const usersMaterias = await userMateriasService.getUserMaterias( data )
      res.status(200).json({
        data: usersMaterias,
        message: "materias listadas"
      })

    } catch (error) {
      next(error)
    }
  })

  router.post('/student', async function (req, res, next){
    
    const {data} = req.body
    try {
      const usersMaterias = await userMateriasService.getUserMateriasStudent( data )
      res.status(200).json({
        data: usersMaterias,
        message: "materias listadas"
      })

    } catch (error) {
      next(error)
    }
  })
}

module.exports = userMateriasApi;
