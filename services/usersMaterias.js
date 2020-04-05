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

  async createUserMaterias({ userMovie }) {

  }

  async deleteUserMaterias({ userMovieID }) {

  }
}

module.exports = UserMateriasService