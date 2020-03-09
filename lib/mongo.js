const { MongoClient, ObjectId } = require('mongodb');
const { config } = require('../config');

const USER = encodeURIComponent(config.dbUser);
const PASSWORD = encodeURIComponent(config.dbPassword);
const DB_NAME = config.dbName;

const MONGO_URI = `mongodb+srv://${USER}:${PASSWORD}@cluster0-8gf6x.mongodb.net/test?retryWrites=true&w=majority`;

class MongoLib {
	constructor() {
		this.client = new MongoClient(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
		this.dbName = DB_NAME;
	}

	connect() {
		if (!MongoLib.connection) {
			MongoLib.connection = new Promise((resolve, reject) => {
				this.client.connect(err => {
					if (err) {
						reject(err);
					}
					console.log('Connected succesfully to mongo');
					resolve(this.client.db(this.dbName));
				});
			});
		}
		return MongoLib.connection;
	}

	getAll(collection, query) {
		return this.connect().then(db => {
			return db
				.collection(collection)
				.find(query)
				.toArray();
		});
	}

	getAllUM(collection, id) {
		console.log("base de datos ", id);
		
		return this.connect().then(db => {
			return db
				.collection(collection)
				.find({ id_teacher: id  })
				.toArray();
		});
	}

	get(collection, id) {
		return this.connect().then(db => {
			return db
				.collection(collection)
				.findOne({ _id: ObjectId(id) });
		});
	}

	getForEmail(collection, email) {
		return this.connect().then(db => {
			return db
				.collection(collection)
				.findOne({ email });
		});
	}

	getForName(collection, query) {
		const { data } = query
		var ExpReg = new RegExp(data);
		console.log(ExpReg)
		return this.connect().then(db => {
			return db
				.collection(collection)
				.find({ name: ExpReg })
				.toArray()
		})
	}

	create(collection, data) {
		return this.connect().then(db => {
			return db
				.collection(collection)
				.insertOne(data);
		})
		.then(result => result.insertedId);
	}

	update(collection, id, data) {
		return this.connect().then(db => {
			return db
				.collection(collection)
				.updateOne({ _id: ObjectId(id) }, { $set: data }, { upsert: true });
		})
			.then(result => result.upsertedId || id);
	}

	updateOne(collection, email, data) {
		return this.connect().then(db => {
			return db
				.collection(collection)
				.updateOne({ email: email }, { $set: data })
		})
	}

	delete(collection, id) {
		return this.connect().then(db => {
			return db
				.collection(collection)
				.deleteOne({ _id: ObjectId(id) });
		})
			.then(() => id);
	}
}

module.exports = MongoLib;
