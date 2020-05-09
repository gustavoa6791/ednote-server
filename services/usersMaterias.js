const Mongolib = require('../lib/mongo')

class UserMateriasService {

  constructor() {
    this.collection = 'user_materia'
    this.MongoDB = new Mongolib()
  }

  async getUserMaterias(data) {

    const materias = await this.MongoDB.getAll('materias', {})
    const userMaterias = await this.MongoDB.getAllUM(this.collection, data)

    const dataMaterias = []

    for (let i = 0; i < materias.length; i++) {
      for (let j = 0; j < userMaterias.length; j++) {
        if (materias[i]._id == userMaterias[j].id_subject)

          dataMaterias.push({
            id: userMaterias[j]._id,
            name: materias[i].name,
            code: materias[i].code,
            credits: materias[i].credits,
            group: userMaterias[j].group,
            notes: userMaterias[j].notes,
            notesnumber: userMaterias[j].notesnumber,
            notesPheader: userMaterias[j].notesPheader,
            notesPitem: userMaterias[j].notesPitem,
       
          })
      }
    }
    return dataMaterias || []
  }

  async getUserMateriasStudent(data) {


   

    const materias = await this.MongoDB.getAll('materias', {})
    const userMaterias = await this.MongoDB.getAll(this.collection, data)

    const dataMaterias = []
    const dataMateriasEstudiante = []

    for (let i = 0; i < materias.length; i++) {
      for (let j = 0; j < userMaterias.length; j++) {
     
        if (materias[i]._id == userMaterias[j].id_subject)

          dataMaterias.push({
            id: userMaterias[j]._id,
            name: materias[i].name,
            code: materias[i].code,
            credits: materias[i].credits,
            group: userMaterias[j].group,
            notes: userMaterias[j].notes,
            notesnumber: userMaterias[j].notesnumber,
            notesPheader: userMaterias[j].notesPheader,
            notesPitem: userMaterias[j].notesPitem,
       
          })
      }
    }
    for (let i = 0; i < dataMaterias.length; i++) {
      for (let j = 0; j < dataMaterias[i].notesnumber.length; j++) {
        if (dataMaterias[i].notesnumber[j].id== data) {
          dataMateriasEstudiante.push(dataMaterias[i])
        }else{
          delete dataMaterias[i].notesnumber[j]
        }
      }
    }
    
    return  dataMateriasEstudiante || [] 
  }

  async updateUserMaterias( data) {

    await this.MongoDB.update(this.collection, data.id, data)
  }

  async deleteUserMaterias({ userMovieID }) {

  }
}

module.exports = UserMateriasService