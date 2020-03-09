const Mongolib = require('../lib/mongo')

class UserMateriasService{
  constructor(){
    this.collection = 'user_materia'
    this.MongoDB = new Mongolib()
  }

  async getUserMaterias({userID}){
    const query = userID && {userID}
    const userMovies = await this.MongoDB.getAll(this.collection,query)
  
    return userMovies || []

  }

  async createUserMovie({userMovie}){

  }

  async deleteUserMovie({userMovieID}){

  }
}