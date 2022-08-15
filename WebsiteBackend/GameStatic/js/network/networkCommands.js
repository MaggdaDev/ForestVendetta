const NetworkCommands = {

    // TO CLIENT
    SETUP_WORLD: 'SETUP_WORLD',                 // data: world object
    ADD_PLAYER: 'ADD_PLAYER',                   // data: pos{pos.x, pos.y}, id
    UPDATE: 'UPDATE',                           // data: [world: data, players: data]
    UPDATE_PLAYERS: 'UPDATE_PLAYERS',           // data: [data1, data2, data3] with playerdatas
    UPDATE_WORLD: 'UPDATE_WORLD',               // data: [{id, propsToModify}]
    SHOW_OLD_PLAYERS: 'SHOW_OLD_PLAYERS',       // data: SAME AS ADD_PLAYER! curr: same as update
    SHOW_OLD_MOBS: 'SHOW_OLD_MOBS',             // data: [mob1, mob2,...]
    DISCONNECT_PLAYER: 'DISCONNECT_PLAYER',     // data: id
    CONTROL_DATA: 'CONTROL_DATA',               // data: energy etc
    SPAWN_MOB: 'SPAWN_MOB',                     // data: mob object (with id,type,pos,...)
    DAMAGE_ANIMATION: 'DAMAGE_ANIMATION',       // data: damageAmount, pos
    REMOVE_GAMEOBJECTS: 'REMOVE_GAMEOBJECTS',   // data: type, id
    STRIKE_ANIMATION: 'STRIKE_ANIMATION',       // data: id (player), weaponId, cooldownTime


    // TO SERVER
    REQUEST_ADD_PLAYER: 'REQUEST_ADD_PLAYER',   // data: {string} data.id
    PLAYER_CONTROL: 'PLAYER_CONTROL'            // data: {string} player control !ONLY PlayerControls.X_Y_Z accepted!
}

if (typeof module !== 'undefined') {
    module.exports = NetworkCommands;
}