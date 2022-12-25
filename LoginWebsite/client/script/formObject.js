class FormObject {
    /**
     * 
     * @param {string} formDocId 
     * @param {string} action 
     * @param {Object[]} hiddenParams - [{name, value}, {name, value}, ...]
     */
    constructor(formDocId, action, hiddenParams) {
        this.formDocId = formDocId;
        this.action = action;
        this.hiddenParams = hiddenParams;
    }

    register() {
        const form = document.getElementById(this.formDocId);
        form.action = this.action;
        var innerHTML = "";
        this.hiddenParams.forEach((curr) => {
            innerHTML += "\n<input type='hidden' name='" + curr.name + "' value='" + curr.value + "' />";
        });
        form.innerHTML += innerHTML;
        console.log("Registered form: " + this.formDocId);
    }

    
}