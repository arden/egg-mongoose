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
    user: "test",
    password: "test",
    dbName: "test",
    options: {},
  },
  egg: {
    modelDir: 'app/model', // specify model dir path
    modelAccessName: 'model', // custom model access path, default `app.model`
  },
};
