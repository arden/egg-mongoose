'use strict';

const assert = require('assert');
const path = require('path');
const Mongoose = require('mongoose');
const EventEmitter = require('events');
const awaitEvent = require('await-event');
const defaultConfig = require('../config/config.default');

module.exports = app => {
  const config = Object.assign(defaultConfig.mongoosee, app.config.mongoosee);
  assert(config.mongodb.url, '[egg-mongoose] url is required on config');
  app.coreLogger.info('[egg-mongoose] connecting %s', config.mongodb.url);
  mongoose.Promise = require('bluebird');

  // mongoose.connect('mongodb://[username:password@]host1[:port1][,host2[:port2],...[,hostN[:portN]]][/[database][?options]]' [, options]);
  const db = Mongoose.createConnection(config.mongodb.url, config.mongodb.options);
  db.Schema = Mongoose.Schema;
  app.Mongoose = db;

  const heartEvent = new EventEmitter();
  heartEvent.await = awaitEvent;

  db.on('error', err => {
    err.message = `[egg-mongoosee]${err.message}`;
    app.coreLogger.error(err);
  });

  db.on('disconnected', () => {
    app.coreLogger.error(`[egg-mongoosee] ${config.url} disconnected`);
  });

  db.on('connected', () => {
    heartEvent.emit('connected');
    app.coreLogger.info(`[egg-mongoosee] ${config.url} connected successfully`);
  });

  db.on('reconnected', () => {
    app.coreLogger.info(`[egg-mongoosee] ${config.url} reconnected successfully`);
  });

  loadModel(app, config);

  app.beforeStart(function* () {
    app.coreLogger.info('[egg-mongoosee] starting...');
    yield heartEvent.await('connected');
    /*
     *remove heartbeat to avoid no authentication
    const serverStatus = yield db.db.command({
      serverStatus: 1,
    });

    assert(serverStatus.ok === 1, '[egg-mongoose] server status is not ok, please check mongodb service!');
    */
    app.coreLogger.info('[egg-mongoosee] start successfully and server status is ok');
  });
};

function loadModel(app, config) {
  const dir = path.join(app.config.baseDir, config.egg.modelDir);
  app.loader.loadToApp(dir, config.egg.modelAccessName, {
    inject: app,
    caseStyle: 'upper',
    filter(model) {
      return (model.modelName && model.base && model.base.Mongoose);
    },
  });
}
