const NetworkCommands = {

    // TO CLIENT
    SETUP_WORLD: 'SETUP_WORLD',                 // data: world object
    ADD_PLAYER: 'ADD_PLAYER',                   // data: pos{pos.x, pos.y}, id
    UPDATE_PLAYERS: 'UPDATE_PLAYERS',           // data: [data1, data2, data3] with playerdatas
    SHOW_OLD_PLAYERS: 'SHOW_OLD_PLAYERS',       // data: SAME AS ADD_PLAYER! curr: same as update
    DISCONNECT_PLAYER: 'DISCONNECT_PLAYER',     // data: id

    // TO SERVER
    REQUEST_ADD_PLAYER: 'REQUEST_ADD_PLAYER',   // data: {string} data.id
    PLAYER_CONTROL: 'PLAYER_CONTROL'            // data: {string} player control !ONLY PlayerControls.X_Y_Z accepted!
}

if (typeof module !== 'undefined') {
    module.exports = NetworkCommands;
}