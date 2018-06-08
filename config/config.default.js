'use strict';

/**
  * mongoose default config
  * http://mongoosejs.com/docs/api.html#index_Mongoose-createConnection
  * @member Config#mongoose
  * @property {String} url - connect url
  * @property {Object} options - options to pass to the driver and mongoose-specific
  */
exports.mongoosee = {
  mongodb: {
    url: 'mongodb://localhost:27017',
    options: {
      auth: {
        user: "test",
        password: "test",
        dbName: "test",
      },
      poolSize: 20,
      ssl: false,
      autoReconnect: true,
      noDelay: true,
      keepAlive: 30000,
      connectTimeoutMS: 30000,
      socketTimeoutMS: 360000,
      reconnectTries: 30,
      reconnectInterval: 1000,
    },
  },
  egg: {
    modelDir: 'app/model', // specify model dir path
    modelAccessName: 'model', // custom model access path, default `app.model`
  },
};
