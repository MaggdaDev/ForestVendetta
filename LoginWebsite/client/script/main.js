console.log("Client script started");

const isTestMode = true;            // TODO: SOMETHING BETTER...
const port = 2999;
var host;
if (isTestMode) {
    host = "localhost";
} else {
    host = "minortom.net";
}

// real start
window.onload = () => {
    if (isTestMode) {
        const form = document.getElementById("loginWithDiscordForm")
        form.action = "https://discord.com/api/oauth2/authorize";//?redirect_uri=http%3A%2F%2Flocalhost%3A2999%2Fredirect.html&response_type=token&scope=identify";
        form.innerHTML += `\n
        <input type='hidden' name='client_id' value='1014855311259078666' />\n
        <input type='hidden' name='redirect_uri' value='` + "http://" + host + ":" + port + `/redirect.html' />\n
        <input type='hidden' name='response_type' value='token' />\n
        <input type='hidden' name='scope' value='identify' />\n`;
    } else {

        throw "Only test mode implemented for redirect to oath2 link";
    }
}