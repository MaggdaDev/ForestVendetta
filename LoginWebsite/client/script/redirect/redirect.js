
const host = document.location.host;
const httpCommunicator = new HTTPCommunicator(host);
const params = ParamReader.params;
const code = params.code;
const gameID = params.state;
var profileData = null; // waiting to be set in async request profile data
var userID = null;

const errorInfoObject = new ErrorInfo();
const joinGameBtnObject = new JoinGameBtn(code, gameID, httpCommunicator, errorInfoObject);



httpCommunicator.requestProfileDataAsync(code, (response) => {
    response = JSON.parse(response);
    if (response.error !== undefined && response.error !== null) {
        console.log("Error: " + response.error);
        window.location.replace(response.redirect);
    } else {
        userID = response.discordAPI.id;
        httpCommunicator.setUserID(userID);
        joinGameBtnObject.resolvePromise(userID);       // notify in case user has already clicked button before data arives
    }
})

window.onload = () => {
    // read query params
    const params = new Proxy(new URLSearchParams(window.location.search), {
        get: (searchParams, prop) => searchParams.get(prop),
    });

    // doc el acces
    // initial doc acc
    document.getElementById("joinGameBtn").onclick = () => joinGameBtnObject.onClick();
}