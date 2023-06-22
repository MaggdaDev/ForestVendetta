const Protagonist = require("../../player/protagonist")

test("Protagonist can be constructed", () => {

    const mockedPlayerData = {
        discordAPI: {
            id: "testid"
        },
        hotbar: [

        ],
        armorBar: [

        ]
    };
    const mockedSocket = {
        on() {

        },
        emit() {

        }
    };
    const mockedWorld = {

    };
    const mockedMatchConfig = {

    }
    const mockedMainLoop = {
        getMobManager() {
            return {
                addOnFightReset(handler) {

                },
                addOnMobDeath(handler) {

                },
                getCurrentMatchConfig() {
                    return {graded_match_duration: 20};

                }
            }
        },
        getStopwatchFightDuration() {
            return 10;
        },
        addTimer(timer) {
            
        }
    }
    const constructedProtagonist = new Protagonist(mockedPlayerData, mockedSocket, mockedWorld, mockedMatchConfig, mockedMainLoop);
});