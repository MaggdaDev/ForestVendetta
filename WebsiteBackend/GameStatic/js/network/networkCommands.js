const NetworkCommands = {

    // TO CLIENT
    ADD_PLAYER: 'ADD_PLAYER',                   // data: pos{pos.x, pos.y}, id


    // TO SERVER
    REQUEST_ADD_PLAYER: 'REQUEST_ADD_PLAYER'    // data: {string} data.id
}

if (typeof module !== 'undefined') {
    module.exports = NetworkCommands;
}