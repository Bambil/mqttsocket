/**
 * Created by Sandro Kock<sandro.kock@gmail.com> on 04.03.16.
 */
const { MqttClient } = require('../lib')

let client = new MqttClient('ws://iot.eclipse.org:80/ws')
client.connect()

client.on('connect', () => {
  console.log('MQTT.js is connected')
  client.subscribe('presence')
  client.publish('presence', 'Hello mqtt!')
})

client.on('error', (err) => {
  console.log(`MQTT.js: ${err}`)
})

client.on('message', (topic, message, packet) => {
  console.log(message)
})
