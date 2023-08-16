

const chooseServerDialogTemplate = document.getElementById("chooseServerDialogTemplate").content;
const chooseEmoteDialogTemplate = document.getElementById("chooseEmoteDialogTemplate").content;
const allDialogOverlays = [];
function removeAllDialogs() {
    allDialogOverlays.forEach(curr => {
        curr.remove();
    });
}

function cloneTemplate(template) {
    const ret = template.children[0].cloneNode(true);
    document.body.appendChild(ret);
    return ret;
}

document.addEventListener("keydown", function(event) {
    if (event.key === "Escape" || event.key === "Esc") {
      removeAllDialogs();
    }
  });

// select server dialog
function showSelectServerDialog(callback, buildContent) {
    removeAllDialogs();
    const d = cloneTemplate(chooseServerDialogTemplate);
    buildContent(d);
    for(option of d.querySelectorAll(".selectServerDiv")) {
        option.addEventListener("click", (e)=> {
            callback(e.currentTarget.getAttribute("data-info"));
            removeAllDialogs();
        });
    }
    allDialogOverlays.push(d);
    _show(d);
}
// select server dialog end

function showSelectEmoteDialog(callback, buildContent) {
    removeAllDialogs();
    const d = cloneTemplate(chooseEmoteDialogTemplate);
    buildContent(d);
    for(option of d.querySelectorAll(".selectServerDiv")) {
        option.addEventListener("click", (e)=> {
            callback(e.currentTarget.getAttribute("data-info"));
            removeAllDialogs();
        });
    }
    allDialogOverlays.push(d);
    _show(d);
}

function _hide(dialog) {
    dialog.style.display = "none";
}

function _show(dialog) {
    dialog.style.display = "block";
}