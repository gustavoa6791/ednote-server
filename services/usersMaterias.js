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
            group: userMaterias[j].group
          })
      }
    }
    return dataMaterias || []
  }

  async createUserMovie({ userMovie }) {

  }

  async deleteUserMovie({ userMovieID }) {

  }
}

module.exports = UserMateriasService