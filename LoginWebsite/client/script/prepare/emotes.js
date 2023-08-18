class Emotes {
    constructor() {
        this.openEmoteSelectionBottn = document.getElementById("openEmoteSelectionBtn");
        this.emoteSelectionOverlay = document.getElementById("emoteSelectionOverlay");
        this.addEmoteBtn = document.getElementById("addEmoteBtn");
        this.removeEmoteBtn = document.getElementById("removeEmoteBtn");
        this.selectedEmoteIDs = [];
        this.joinedFVGuilds;
        this.isRemoveEmoteState = false;

        httpCommunicator.requestJoinedFVGuilds(userID, code, (guilds) => {
            this.joinedFVGuilds = JSON.parse(guilds);
        });

        addEmoteBtn.addEventListener("click", () => {
            const callback = (infoData) => {
                httpCommunicator.requestEmotes(infoData, (res) => {
                    this.onEmotesReceived(JSON.parse(res));
                });
                console.log(infoData);
            }
            const buildContent = (dialog) => {
                const dialogContent = dialog.getElementsByClassName("overlayDialogContent")[0];
                var option;
                for (var currGuild of this.joinedFVGuilds) {
                    option = this.createGuildOption(currGuild);
                    option.setAttribute("data-info", currGuild.id);
                    dialogContent.appendChild(option);
                }
            }
            showSelectServerDialog(callback, buildContent);
        });
        
        removeEmoteBtn.addEventListener("click", () => {
            this.setRemoveEmoteState(!this.isRemoveEmoteState);
        
        });
        document.addEventListener("keydown", function (event) {
            if (event.key === "Escape" || event.key === "Esc") {
                removeAllDialogs();
                this.setRemoveEmoteState(false);
            }
        });
    }

    showSelectedEmotes(emotes) {
        for(var currEmote of emotes) {
            this.addEmoteToScreen(currEmote.id, currEmote.name);
        }
    }

    setRemoveEmoteState(isRemove) {
        this.isRemoveEmoteState = isRemove;
        if (this.isRemoveEmoteState) {
            document.getElementById("selectedEmotesDiv").classList.add("selectedEmotesDivActive");
        } else {
            document.getElementById("selectedEmotesDiv").classList.remove("selectedEmotesDivActive");
        }
    }
    
    onEmotesReceived(emotes) {
        const buildContent = (dialog) => {
            const dialogContent = dialog.getElementsByClassName("overlayDialogContent")[0];
            var emoteOption;
            for (var currEmote of emotes) {
                if (!this.selectedEmoteIDs.includes(currEmote.id)) {
                    emoteOption = this.createEmoteOption(currEmote.id, currEmote.name);
                    emoteOption.setAttribute("data-info", currEmote.id + "|" + currEmote.name);
                    dialogContent.appendChild(emoteOption);
                }
            }
        }
        showSelectEmoteDialog((data) => {
            const args = data.split("|");
            const id = args[0];
            const name = args[1];
            this.addEmoteToDatabase(id, name);
            this.addEmoteToScreen(id, name);
            console.log("Added emote: " + id);
        },  buildContent);
    }

    addEmoteToDatabase(id, name) {
        httpCommunicator.addEmote(userID, code, id, name);
    }
    
    addEmoteToScreen(id, name) {
        const emoteIcon = this.createEmoteOption(id, name);
        document.getElementById("selectedEmotesDiv").appendChild(emoteIcon);
        emoteIcon.addEventListener("click", (e) => {
            this.removeEmote(e.currentTarget, id, name);
        });
        this.setRemoveEmoteState(false);
        this.selectedEmoteIDs.push(id);
    }
    
    removeEmote(htmlEmoteObject, id, name) {
        document.getElementById("selectedEmotesDiv").removeChild(htmlEmoteObject);
        this.setRemoveEmoteState(false);
        if (this.selectedEmoteIDs.includes(id)) {
            console.log("Deleting emote id from clientside selected ids");
            this.selectedEmoteIDs.splice(this.selectedEmoteIDs.indexOf(id), 1);
            console.log("Selected emotes are now: " + this.selectedEmoteIDs);
    
            httpCommunicator.removeEmote(userID, code, id);
        } else {
            console.error("Trying to remove emote that wasnt even added");
        }
    }
    
    createGuildOption(guild) {
        const option = document.getElementById("selectServerOptionTemplate").content.cloneNode(true).querySelector("div");
        const label = option.querySelector(".selectServerOptionLabel");
        const img = option.querySelector(".selectServerOptionImg");
        label.textContent = guild.name;
        img.src = this._createGuildIconUri(guild.id, guild.icon);
        return option;
    }
    
    /**
     * 
     * @param {number} emoteId
     * @param {string} emoteName
     * @returns 
     */
    createEmoteOption(emoteId, emoteName) {
        const option = document.getElementById("chooseEmoteOptionTemplate").content.cloneNode(true).querySelector("div");
        const img = option.querySelector(".emoteImg");
        img.src = this._createEmoteSrcUri(emoteId);
        option.title = emoteName;
        return option;
    }
    
    
    _createGuildIconUri(guildId, icon) {
        return "https://cdn.discordapp.com/icons/" + guildId + "/" + icon + ".png";
    }
    
    _createEmoteSrcUri(emoteID) {
        return "https://cdn.discordapp.com/emojis/" + emoteID + ".png?size=32";
    }
}



