console.log("Client script started");

const isTestMode = false;            // TODO: SOMETHING BETTER...
const port = 2999;
var host;
var protocoll;
if (isTestMode) {
    host = "localhost";
    protocoll = "http";
} else {
    host = "forestvendetta.minortom.net/login";
    protocoll = "https";
}
var profileData = null;
// real start
window.onload = () => {
    // read query params
    const params = ParamReader.params;
    const test = params.error;
    if (params.error !== undefined && params.error !== null) {
        console.log("Coming from error redirect!");
        switch (params.error) {
            case "DISCORD_API_FAIL":
                document.getElementById("discordAPIerror").hidden = false;
                break;

            default:
                document.getElementById("unkownError").hidden = false;

                break;
        }
    }

    // setup login with discord
    const redirectUri = protocoll + "://" + host + ":" + port + "/authentication.html";
    
    const formObject = new FormObject("loginWithDiscordForm",       // form document ID
        "https://discord.com/api/oauth2/authorize",                 // action
        [{ name: 'client_id', value: '1014855311259078666' },       // hidden params
        { name: 'redirect_uri', value: redirectUri },
        { name: 'response_type', value: "code" },
        { name: 'scope', value: 'identify' },
        { name: 'state', value: params.game }]);
    formObject.register();
}