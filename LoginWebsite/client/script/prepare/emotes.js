const openEmoteSelectionBottn = document.getElementById("openEmoteSelectionBtn");
const emoteSelectionOverlay = document.getElementById("emoteSelectionOverlay");
const addEmoteBtn = document.getElementById("addEmoteBtn");
var joinedFVGuilds;
httpCommunicator.requestJoinedFVGuilds(userID, code, (guilds) => {
    joinedFVGuilds = JSON.parse(guilds);
})

addEmoteBtn.addEventListener("click", ()=> {
    const callback = (infoData) => {
        httpCommunicator.requestEmotes(infoData, (res) => {
            onEmotesReceived(JSON.parse(res));
        });
        console.log(infoData);
    }
    const buildContent = (dialog) => {
        const dialogContent = dialog.getElementsByClassName("overlayDialogContent")[0];
        var option;
        for(currGuild of joinedFVGuilds) {
            option = createGuildOption(currGuild);
            option.setAttribute("data-info", currGuild.id);
            dialogContent.appendChild(option);
        }
    }
    showSelectServerDialog(callback, buildContent);
});

function onEmotesReceived(emotes) {
    console.log("I HAVE EMOTES!!!");
    const buildContent = (dialog) => {
        const dialogContent = dialog.getElementsByClassName("overlayDialogContent")[0];
        var option;
        for(var currEmote of emotes) {
            option = createEmoteOption(currEmote);
            option.setAttribute("data-info", currEmote.id);
            dialogContent.appendChild(option);
        }
    }
    const callback = (emoteId) => {

    }
    showSelectEmoteDialog(callback, buildContent);
}

function createGuildOption(guild) {
    const option = document.getElementById("selectServerOptionTemplate").content.cloneNode(true).querySelector("div");
    const label = option.querySelector(".selectServerOptionLabel");
    const img = option.querySelector(".selectServerOptionImg");
    label.textContent = guild.name;
    img.src = _createGuildIconUri(guild.id, guild.icon);
    return option;
}

function createEmoteOption(emote) {
    const option = document.getElementById("chooseEmoteOptionTemplate").content.cloneNode(true).querySelector("div");
    const img = option.querySelector(".emoteImg");
    img.src = _createEmoteSrcUri(emote.id);
    option.title = emote.name;
    return option;
}


function _createGuildIconUri(guildId, icon) {
    return "https://cdn.discordapp.com/icons/" + guildId + "/" + icon + ".png";
}

function _createEmoteSrcUri(emoteID) {
    return "https://cdn.discordapp.com/emojis/" + emoteID + ".png?size=32";
}