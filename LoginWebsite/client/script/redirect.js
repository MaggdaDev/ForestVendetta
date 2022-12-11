
const host = document.location.host;
const httpCommunicator = new HTTPCommunicator(host);
const params = ParamReader.params;
const code = params.code;
var profileData = null; // waiting to be set in async request profile data
var userID = null;
httpCommunicator.requestProfileDataAsync(code, (response) => {
    response = JSON.parse(response);
    if (response.error !== undefined) {
        console.log("Error: " + response.error);
        window.location.replace(response.redirect);
    } else {
        userID = response.discordAPI.id;
        httpCommunicator.setUserID(userID);
    }
})

window.onload = () => {
    // read query params
    const params = new Proxy(new URLSearchParams(window.location.search), {
        get: (searchParams, prop) => searchParams.get(prop),
    });
}