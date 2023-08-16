const DiscordAPIAccessor = require("./dicordApiAccessor");
const DiscordAuthenticator = require("./discordAuthenticator");
const RequestHandler = require("./requestHandler");
class DiscordEmoteImporter {
    /**
     * 
     * @param {DiscordAPIAccessor} discordApiAccessor 
     * @param {DiscordAuthenticator} discordAuthenticator 
     */
    constructor(discordApiAccessor, discordAuthenticator) {
        this.discordApiAccessor = discordApiAccessor;
        this.discordAuthenticator = discordAuthenticator;
        this.fvGuildIDs = [];
        this.fetchFVGuilds();
    }

    fetchFVGuilds() {
        this.discordApiAccessor.fetchFVGuilds().then((res) => {
            if(res.length >= 200) {
                throw "200 SERVER COUNT REACHED! PLS IMPLEMENT LOAD MORE WITH 'AFTER' QUERY STRING"
            }
            res.forEach((curr)=> {
                this.fvGuildIDs.push(curr.id);
            });
            console.log("Fetching FV guilds successfull. Forest Scout currently in " + this.fvGuildIDs.length + " guilds.")
        });
    }

    isFvGuild(guildObject) {
        if(this.fvGuildIDs.length == 0) {
            throw "FV guilds not fetched yet.";
        };
        for(var currId of this.fvGuildIDs) {
            if(currId === guildObject.id) {
                return true;
            }
        }
        return false;
    }

    getFVGuildList(query) {
        return new Promise((resolve, reject) => {
            const userID = query.userID;
            const code = query.code;
            if(!this.discordAuthenticator.isAuthenticated(userID, code)) {
                throw RequestHandler.ERRORS.NOT_AUTHENTICATED;
            }
            this.discordApiAccessor.requestJoinedFVGuilds(userID, code, this.discordAuthenticator.getAccessToken(userID, code)).then((res) => {
                const onlyFVGuilds = res.filter((currGuildObject) => this.isFvGuild(currGuildObject));
                resolve(onlyFVGuilds);
            }).catch(error => reject(error));
        })
        
    }
    getGuildEmotes(query) {/*
        return new Promise((resolve, reject) => {
            const guildID = query.guildID;
            this.discordApiAccessor.getEmoteDataObjects(guildID).then((emoteList) => {
                const loadEmotesPromises = [];
                for(var currEmote of emoteList) {
                    loadEmotesPromises.push(new Promise((resolve, reject) => {
                        this.discordApiAccessor.getEmote(currEmote.id, 32).then((emoteImg) => {
                            resolve({
                                name: currEmote.name,
                                img: emoteImg
                            });
                        }).catch(error => {
                            console.error("Error on loading emote: " + error + ". Sending just name to client: " + currEmote.name);
                            resolve({
                                name: currEmote.name
                            });
                        });
                    }));
                }
                Promise.all(loadEmotesPromises).then((values) => {
                    resolve(values);
                }).catch(error => reject(error));
            }).catch((error) => reject(error));
        });*/
        return this.discordApiAccessor.getEmoteDataObjects(query.guildID);
    }

}

module.exports = DiscordEmoteImporter;