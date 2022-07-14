class ClientWorld {

    constructor(data, mainScene) {
        this.mainScene = mainScene;
        this.worldObjects = new Map();
        
        var instance = this;
        console.log('World object: ' + JSON.stringify(data));
        data.worldObjects.forEach((currObj)=> {
            switch(currObj.type) {
                case 'platform':
                    instance.worldObjects.set(currObj.id, new ClientPlatform(instance.mainScene, currObj));
                break;
                case 'POLYGON':
                    instance.worldObjects.set(currObj.id, new ClientPolygonObject(instance.mainScene, currObj));
                break;
                default:
                    console.log("Error at world loading: Unknown object type received: " + JSON.stringify(currObj));
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