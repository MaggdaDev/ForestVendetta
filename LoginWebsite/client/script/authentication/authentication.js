const params = ParamReader.params;
var host = document.location.host;
if(document.URL.includes("/login/")) {
    host += "/login";
    console.log("Detected server is running reverse proxy; appended /login to host");
}
const httpCommunicator = new HTTPCommunicator(host);

const code = params.code;
const gameID = params.state;
httpCommunicator.requestDiscordAccessAndRedirect(code, gameID);