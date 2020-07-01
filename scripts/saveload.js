/// \value stringified json object or standard type
/// \returns true if succeed
function saveLocal(name, value) {
    // If the platform supports localStorage, then save the value
    try {
        localStorage.setItem(name, value);
        return true;
    }
    catch(e) {
        // Most likely cause of errors is a very old browser that doesn't support localStorage (fail silently)
        console.warn("saving error");
        return false;
    }
}

/// \returns loaded value or specified defaultValue in case of error
function loadLocal(name, defaultValue = null) {
    // If the platform supports localStorage, then load the selection
    try {
        let val = localStorage.getItem(name);
        return (val === null) ? defaultValue : val;
    }
    catch(e) {
        // Either no selection in localStorage or browser does not support localStorage (fail silently)
        console.warn("can\'t load from localstorage");
        return defaultValue;
    }
}

function getSelectionStringFromZBLLMap() {
    // Gets a string that represents the current selection

    var selection = {};

    for (var oll in zbllMap) {
        selection[oll] = {};
        for (var coll in zbllMap[oll]) {
            selection[oll][coll] = {};
            for (var zbll in zbllMap[oll][coll]) {
                selection[oll][coll][zbll] = zbllMap[oll][coll][zbll].c;
            }
        }
    }

    return JSON.stringify(selection);
}

// Applies the selection in the given string to zbllMap
function setZBLLMapFromSelectionString(string) {
    // reset zbllMap first
    for (var oll in zbllMap) {
        for (var coll in zbllMap[oll]) {
            for (var zbll in zbllMap[oll][coll]) {
                zbllMap[oll][coll][zbll].c = false;
            }
        }
    }

    var selection = JSON.parse(string);

    for (var oll in selection) if (zbllMap.hasOwnProperty(oll)) {
        for (var coll in selection[oll]) if (zbllMap[oll].hasOwnProperty(coll)) {
            for (var zbll in selection[oll][coll]) if (zbllMap[oll][coll].hasOwnProperty(zbll)) {
                zbllMap[oll][coll][zbll].c = selection[oll][coll][zbll];
            }
        }
    }
}


