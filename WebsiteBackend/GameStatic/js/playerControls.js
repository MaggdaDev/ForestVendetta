const PlayerControls = {
    START_WALK_RIGHT :  'START_WALK_RIGHT',         // D down
    STOP_WALK_RIGHT :   'STOP_WALK_RIGHT',          // D up
    START_WALK_LEFT :   'START_WALK_LEFT',          // A down
    STOP_WALK_LEFT :    'STOP_WALK_LEFT',           // A up
    START_JUMP:         'START_JUMP',               // SPACE down
    STOP_JUMP:          'STOP_JUMP',                // SPACE up
    STRIKE:             'STRIKE'                    // LEFT CLICK
}




if (typeof module !== 'undefined') {
    module.exports = PlayerControls;
}