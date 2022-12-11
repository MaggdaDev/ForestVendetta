console.log("Client script started");

const isTestMode = true;            // TODO: SOMETHING BETTER...
const port = 2999;
var host;
if (isTestMode) {
    host = "localhost";
} else {
    host = "minortom.net";
}
var profileData = null;
// real start
window.onload = () => {
    // read query params
    const params = ParamReader.params;

    if(params.error !== undefined) {
        console.log("Coming from error redirect!");
        switch(params.error) {
            case "DISCORD_API_FAIL":
            document.getElementById("discordAPIerror").hidden = false;
            break;

            default:
                document.getElementById("unkownError").hidden = false;

            break;
        }
    }

    // setup login with discord
    if (isTestMode) {
        const form = document.getElementById("loginWithDiscordForm")
        form.action = "https://discord.com/api/oauth2/authorize";//?redirect_uri=http%3A%2F%2Flocalhost%3A2999%2Fredirect.html&response_type=code&scope=identify&prompt=none";

        const redirectUri = "http://" + host + ":" + port + `/redirect.html`;
        form.innerHTML += `\n
        <input type='hidden' name='client_id' value='1014855311259078666' />\n
        <input type='hidden' name='redirect_uri' value='` + redirectUri + `'/>\n
        <input type='hidden' name='response_type' value='code' />\n
        <input type='hidden' name='scope' value='identify' />\n
        <input type='hidden' name='state' value='` + params.game + `' />`;
    } else {

        throw "Only test mode implemented for redirect to oath2 link";
    }
}