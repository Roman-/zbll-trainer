
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

function setZBLLMapFromSelectionString(string) {
    // Applies the selection in the given string to zbllMap

    var selection = JSON.parse(string);

    for (var oll in selection) if (zbllMap.hasOwnProperty(oll)) {
        for (var coll in selection[oll]) if (zbllMap[oll].hasOwnProperty(coll)) {
            for (var zbll in selection[oll][coll]) if (zbllMap[oll][coll].hasOwnProperty(zbll)) {
                zbllMap[oll][coll][zbll].c = selection[oll][coll][zbll];
            }
        }
    }
}

function saveSelection() {
    // If the platform supports localStorage, then save the selection
    try {
        localStorage.setItem('zbllSelection', getSelectionStringFromZBLLMap());
        return true;
    }
    catch(e) {
        // Most likely cause of errors is a very old browser that doesn't support localStorage (fail silently)
        return false;
    }
}

function loadSelection() {
    // If the platform supports localStorage, then load the selection
    try {
        var selectionString = localStorage.getItem('zbllSelection');
        setZBLLMapFromSelectionString(selectionString);
        renderSelection();
        return true;
    }
    catch(e) {
        // Either no selection in localStorage or browser does not support localStorage (fail silently)
        return false;
    }
}

loadSelection();
