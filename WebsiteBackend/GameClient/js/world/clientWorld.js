class ClientWorld {

    constructor(data, mainScene) {
        this.mainScene = mainScene;
        this.worldObjects = [];
        
        var instance = this;
        console.log('World object: ' + JSON.stringify(data));
        data.worldObjects.forEach((currObj)=> {
            if(currObj.type == 'platform') {
                instance.worldObjects.push(new ClientPlatform(instance.mainScene, currObj));
            }
        });
    }
}