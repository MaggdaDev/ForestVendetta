class ErrorInfo {

    static DOCUMENT_ID = "errorInfo";
    showError(errorCode) {   // from website backend - server - access manager
        var text = "Unkown error!";
        switch (errorCode) {
            case "ALREADY_IN_MATCH":
                text = "You can't join a game twice at the same time!";
                break;
            case "LEVEL_TOO_LOW":
                text = "This boss is too strong for you!";
                break;
            case "MATCH_FULL":
                text = "Match already full";
                break;
        }
        document.getElementById(ErrorInfo.DOCUMENT_ID).outerHTML = text;
        document.getElementById(ErrorInfo.DOCUMENT_ID).hidden = false;

    }
}