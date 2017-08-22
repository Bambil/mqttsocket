/**
 * Created by Sandro Kock <sandro.kock@gmail.com> on 08.03.16.
 */

const EventEmitter = require('events')
const Connection = require('mqtt-connection')
const websocket = require('websocket-stream')

class MqttClient extends EventEmitter {
  /**
   * Creates a new instance of MqttWorker object, that wraps all calls to the MqttClient to a Worker or SharedWorker
   * @param {String} workerUri the Uri where the worker script is located, probably something like "bower_component/mqttsw/mqttsw.js"
   * @param {String} documentUrl
   * @param {Boolean} useSharedWorker flag whether or not to use a SharedWorker===false or Worker===true
   * @returns {MqttWorker} A wrapper object around the MqttClient object that maps all calls to the Worker
   */
  constructor (uri) {
    super()

    this.uri = uri
    this.connection = null

    this.VERSION = '0.0.1'
  }

  connect () {
    let ws = websocket(this.uri)
    this.connection = Connection(ws)

    this.connection.on('publish', (packet) => {
      this.emit('publish', packet.topic, packet)
    })

    this.connection.on('connack', () => {
      this.emit('connect')
    })
  }

  /**
   * unsubscribe - unsubscribe from topic(s)
   *
   * @param {String} topic - topics to unsubscribe from
   * @param {Function} [callback] - callback fired on unsuback
   * @returns {Promise}
   * @api public
   * @example client.unsubscribe('topic');
   * @example client.unsubscribe('topic', console.log);
   */
  unsubscribe (topic, callback) {
    return new Promise((resolve, reject) => {
      this.connection.unsubscriptions({
        subscriptions: [
          topic
        ]
      }, () => {
        if (callback && typeof callback === 'function') {
          callback()
        }
        resolve()
      })
    })
  }

  /**
   * publish - publish <message> to <topic>
   *
   * @param {String} topic - topic to publish to
   * @param {String, Buffer} payload - message to publish
   * @param {Object} [opts] - publish options, includes:
   *    {Number} qos - qos level to publish on
   *    {Boolean} retain - whether or not to retain the message
   * @param {Function} [callback] - function(err){}
   *    called when publish succeeds or fails
   * @returns {MqttWorker} this - for chaining
   * @api public
   *
   * @example client.publish('topic', 'message');
   * @example
   *     client.publish('topic', 'message', {qos: 1, retain: true});
   * @example client.publish('topic', 'message', console.log);
   */
  publish (topic, payload, opts, callback) {
    if (opts && typeof opts === 'function') {
      callback = opts
      opts = {}
    }

    return new Promise((resolve, reject) => {
      this.connection.publish({
        topic,
        payload,
        qos: opts.qos,
        retain: opts.retain
      }, (err) => {
        if (callback && typeof callback === 'function') {
          callback(err)
        }
        if (err) {
          reject(err)
        } else {
          resolve()
        }
      })
    })
  }
}

/**
 * subscribe - subscribe to <topic>
 *
 * @param {String, Array, Object} topic - topic(s) to subscribe to, supports objects in the form {'topic': qos}
 * @param {Object} [opts] - optional subscription options, includes:
 *    {Number} qos - subscribe qos level
 * @param {Function} [callback] - function(err, granted){} where:
 *    {Error} err - subscription error (none at the moment!)
 *    {Array} granted - array of {topic: 't', qos: 0}
 * @returns {MqttWorker} this - for chaining
 * @api public
 * @example client.subscribe('topic');
 * @example client.subscribe('topic', {qos: 1});
 * @example client.subscribe({'topic': 0, 'topic2': 1}, console.log);
 * @example client.subscribe('topic', console.log);
 */
MqttWorker.prototype.subscribe = function (topic, opts, callback) {
  var args = {0: topic};

  if(opts && typeof opts === 'function') {
    args[1] = {qos: 0};
    args[2] = this.callbacks.addCallback(opts);
  }

  if(callback && typeof callback === 'function') {
    args[1] = opts;
    args[2] = this.callbacks.addCallback(callback);
  }

  this._postMessage('subscribe', args);
  return this;
};

/**
 * end - close connection
 *
 * @param {Boolean} force - do not wait for all in-flight messages to be acked
 * @param {Function} callback - called when the client has been closed
 * @returns {MqttWorker} this - for chaining
 *
 * @api public
 */
MqttWorker.prototype.end = function (force, callback) {
  this.disconnecting = true;
  var args = {0: force};

  if(callback && typeof callback === 'function') {
    args[1] = this.callbacks.addCallback(callback);
  }

  this._postMessage('end', args);
  // todo sandro-k call terminate on the Web Worker after end
  return this;
};

module.exports = MqttClient
