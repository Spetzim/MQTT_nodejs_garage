const mqtt = require('mqtt')
const client = mqtt.connect('mqtt://broker.hivemq.com')

let garageState = '';
let connected = false;

client.on('connect', () => {
    client.subscribe('garage/connected')
    client.subscribe('garage/state')
})

client.on('message', (topic, message) => {
    switch (topic) {
        case 'garage/connected':
            return handleGarageConnected(message)
        case 'garage/state':
            return handleGarageState(message)
    }
    console.log('No handler for topic %s', topic);
})

function handleGarageConnected(message) {
    console.log('garage connected status %s', message);
    connected = (message.toString() === 'true')
}

function handleGarageState(message) {
    garageState = message
    console.log('garage state update to %s', message);
}

function openGarageDoor() {
    if (connected && garageState !== 'open') {
        client.publish('garage/open', 'true')
    }
}

function closeGarageDoor() {
    if (connected && garageState !== 'closed') {
        client.publish('garage/close', 'true')
    }
}


// simulate opening garage door
setTimeout(() => {
    console.log('open door');
    openGarageDoor()
}, 5000)

// simulate closing garage door
setTimeout(() => {
    console.log('close door');
    closeGarageDoor();
}, 20000);