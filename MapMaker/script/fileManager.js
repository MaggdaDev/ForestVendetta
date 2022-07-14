class FileManager {
    constructor(world) {
        this.world = world;
    }

    async saveWorld() {
        var fileHandle = await window.showSaveFilePicker({suggestedName: 'myworld', types: [{
            description: 'Map file',
            accept: {'application/map': ['.ahm']},
        }]});
        const writable = await fileHandle.createWritable();
        await writable.write(this.worldAsText);
        await writable.close();

    }

    get worldAsText() {
        return JSON.stringify(this.world);
    }


}