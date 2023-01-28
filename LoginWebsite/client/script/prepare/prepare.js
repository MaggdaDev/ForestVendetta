
const host = document.location.host;

const params = ParamReader.params;
const code = params.code;
const gameID = params.state;
const userID = params.userID;
console.log("UserID: " + userID);

const httpCommunicator = new HTTPCommunicator(host, userID);
const errorInfoObject = new ErrorInfo();
const joinGameBtnObject = new JoinGameBtn(userID, code, gameID, httpCommunicator, errorInfoObject);
const itemBrowser = new ItemBrowser();

var profileData = null; // waiting to be set in async request profile data




httpCommunicator.requestProfileData(userID, code, (response) => {  // request profile data on window load
    response = JSON.parse(response);
    itemBrowser.setDisplayableInventoryData(response.displayableInventory);
})

httpCommunicator.requestWeaponImages((response) => {
    console.log("Got images!");
    itemBrowser.setImages(response);
});


window.onload = () => {
    // read query params
    const params = new Proxy(new URLSearchParams(window.location.search), {
        get: (searchParams, prop) => searchParams.get(prop),
    });

    // doc el acces
    // initial doc acc
    document.getElementById("joinGameBtn").onclick = () => joinGameBtnObject.onClick();
}