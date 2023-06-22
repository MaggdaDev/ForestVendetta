const FileLoader = require("../../util/fileLoader");

test("Testing if recursive file loader works correctly", () => {
    const map = FileLoader.loadFilesRecursive("WebsiteBackend/GameServer/_tests/util/fileLoaderTestLoading");
    console.log(map);
    expect(map.size).toEqual(4);
    expect(map.get("a").a).toEqual("Spaten");
});