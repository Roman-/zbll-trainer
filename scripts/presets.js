var zbllPresets = new Map();
loadPresets();
document.getElementById('presetName').addEventListener("keyup", function(event) { if (event.keyCode === 13) { addNewPreset(); this.blur();} });

function loadPresets() {
    zbllPresets = JSON.parse(loadLocal('zbllPresets', new Map()));
    displayPresets();
}

function savePresets() {
    saveLocal('zbllPresets', JSON.stringify(zbllPresets));
}

function displayPresets() {
    var s = "";
    for (var p in zbllPresets) if (zbllPresets.hasOwnProperty(p)) {
        s += "<div class='prsi'>" + p +
            "<span class='prs-o'><a onclick='loadPreset(\""+p+"\")'>load</a> | <a onclick='deletePreset(\""+p+"\")'>delete</a></span> </div>";
    }
    document.getElementById('prslist').innerHTML = s;
    applystyle();
}

function addNewPreset() {
    var name = document.getElementById('presetName').value;
    if (name.trim() == "")
        return console.warn("savePreset: name is empty");
    if (zbllPresets[name] == null || confirm("Preset '" + name + "' already exist. Replace?")) {
        var s = getSelectionStringFromZBLLMap();
        zbllPresets[name] = s;
    }
    savePresets();
    displayPresets();
}

function deletePreset(name) {
    if (zbllPresets[name] == null)
        return console.warn('can\'t find preset to delete: ' + name);
    if (confirm("Do you want to delete preset '" +name+ "'? This action can not be undone"))
        delete zbllPresets[name];
    savePresets();
    displayPresets();
}

function loadPreset(name) {
    if (zbllPresets[name] == null)
        return alert("Preset '" + name + "' not found");
    setZBLLMapFromSelectionString(zbllPresets[name]);
    renderSelection();
}
