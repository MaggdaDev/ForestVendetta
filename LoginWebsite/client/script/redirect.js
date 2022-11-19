const host = document.location.host;
const httpCommunicator = new HTTPCommunicator(host);
const params = ParamReader.params;
const code = params.code;
httpCommunicator.requestProfileDataAsync(code, (response) => {
    document.getElementById("response").innerHTML = response;
})

window.onload = () => {
    // read query params
    const params = new Proxy(new URLSearchParams(window.location.search), {
        get: (searchParams, prop) => searchParams.get(prop),
    });
}