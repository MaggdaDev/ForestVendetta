class ClientWorld {

    constructor(data, mainScene) {
        this.mainScene = mainScene;
        this.worldObjects = new Map();
        
        var instance = this;
        console.log('World object: ' + JSON.stringify(data));
        data.worldObjects.forEach((currObj)=> {
            if(currObj.type == 'platform') {
                instance.worldObjects.set(currObj.id, new ClientPlatform(instance.mainScene, currObj));
            }
        });
    }

    /**
     * 
     * @param {Object[]} data - array of update data objects: {id, propsToUpdate,...} 
     */
    update(data) {
        var instance = this;
        data.forEach((currData)=>{
            instance.worldObjects.get(currData.id).update(currData);
        });
    }
}