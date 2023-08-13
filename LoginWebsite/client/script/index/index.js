console.log("Client script started");
// real start
window.onload = () => {
    // read query params
    const params = ParamReader.params;
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

    fetch(document.location.protocol + "//" + document.location.host + "/API/getadressconfig").then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.text();
    })
    .then(responseString => {
        const adressConfig = JSON.parse(responseString);
        const redirectUri = adressConfig["redirect-to-authentication-adress"] + adressConfig["authentication-sub"];
        console.log("Got adress config successfully, forming redirect uri from it: " + redirectUri);
        const formObject = new FormObject("loginWithDiscordForm",       // form document ID
        "https://discord.com/api/oauth2/authorize",                 // action
        [{ name: 'client_id', value: '1014855311259078666' },       // hidden params
        { name: 'redirect_uri', value: redirectUri },
        { name: 'response_type', value: "code" },
        { name: 'scope', value: 'identify' },
        { name: 'state', value: params.game }]);
    formObject.register();
    })
    .catch(error => {
        console.error("Fetch error:", error);
    });

    // setup login with discord
    
}