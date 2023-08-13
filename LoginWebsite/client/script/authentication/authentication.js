const params = ParamReader.params;
const host = document.location.host;
const httpCommunicator = new HTTPCommunicator(host);

const code = params.code;
const gameID = params.state;
httpCommunicator.requestDiscordAccessAndRedirect(code, gameID);