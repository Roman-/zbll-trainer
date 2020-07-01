// map: "name" -> "JSON string"
var zbllPresets = new Map();
var bookmarksPresets = {};
const mbPresetName = "starred";

document.getElementById('presetName').addEventListener("keyup", function(event) { if (event.keyCode === 13) { addNewPreset(); this.blur();} });

function loadPresets() {
    zbllPresets = JSON.parse(loadLocal('zbllPresets'));
    if (zbllPresets == null)
        zbllPresets = new Map();
    if (zbllPresets.hasOwnProperty(mbPresetName)) {
        bookmarksPresets = JSON.parse(zbllPresets[mbPresetName]);
    } else {
        bookmarksPresets = {};
    }
    displayPresets();
}

function savePresets() {
    saveLocal('zbllPresets', JSON.stringify(zbllPresets));
}

function displayPresets() {
    function presetDivHtml(pName, pNameToDisplay = pName) {
        return "<div class='prsi'>" + pNameToDisplay +
            "<span class='prs-o'><a onclick='loadPreset(\""+pName+"\")'>load</a> | <a onclick='deletePreset(\""+pName+"\")'>delete</a></span> </div>";
    }
    var s = "";
    if (zbllPresets.hasOwnProperty(mbPresetName))
        s += presetDivHtml(mbPresetName, "&#9733; " + mbPresetName);
    for (var p in zbllPresets) if (zbllPresets.hasOwnProperty(p) && p != mbPresetName) {
        s += presetDivHtml(p);
    }
    document.getElementById('prslist').innerHTML = s;
    applystyle();
}

function addNewPreset() {
    var name = document.getElementById('presetName').value;
    if (name.trim() == "")
        return console.warn("savePreset: name is empty");
    if (zbllPresets[name] == null || confirm("Preset '" + name + "' already exists. Replace?")) {
        var s = getSelectionStringFromZBLLMap();
        zbllPresets[name] = s;
        if (name == mbPresetName) {
            bookmarksPresets = JSON.parse(s);
        }
    }
    savePresets();
    displayPresets();
}

function deletePreset(name) {
    if (zbllPresets[name] == null)
        return console.warn('can\'t find preset to delete: ' + name);
    if (confirm("Do you want to delete preset '" +name+ "'? This action can not be undone")) {
        delete zbllPresets[name];
        if (name == mbPresetName)
            bookmarksPresets = {};
    }
    savePresets();
    displayPresets();
}

function loadPreset(name) {
    if (zbllPresets[name] == null)
        return alert("Preset '" + name + "' not found");
    setZBLLMapFromSelectionString(zbllPresets[name]);
    renderSelection();
}

// returns true if specified case is in bookmarks preset
function isInBookmarks(oll, coll, zbll) {
    var result = bookmarksPresets.hasOwnProperty(oll)
        && bookmarksPresets[oll].hasOwnProperty(coll)
        && bookmarksPresets[oll][coll].hasOwnProperty(zbll.replace("/", "s"))
        && bookmarksPresets[oll][coll][zbll.replace("/", "s")] == true;
    return result;
}

// add case to bookmarks and save locally
function addToBookmark(oll, coll, zbll) {
    if (!bookmarksPresets.hasOwnProperty(oll))
        bookmarksPresets[oll] = new Map();
    if (!bookmarksPresets[oll].hasOwnProperty(coll))
        bookmarksPresets[oll][coll] = new Map();
    bookmarksPresets[oll][coll][zbll.replace("/", "s")] = true;
    zbllPresets[mbPresetName] = JSON.stringify(bookmarksPresets);
    savePresets();
    displayPresets();
}

// remove case from bookmarks and save locally
function removeBookmark(oll, coll, zbll) {
    if (!isInBookmarks(oll, coll, zbll))
        return;
    delete bookmarksPresets[oll][coll][zbll.replace("/", "s")];
    zbllPresets[mbPresetName] = JSON.stringify(bookmarksPresets);
    savePresets();
    displayPresets();
}

// case bookmark button clicked -> add or remove from bookmarks
function onBookmarkClicked(oll, coll, zbll) {
    // add "starred" preset upon first use
    if (!zbllPresets.hasOwnProperty(mbPresetName)) {
        zbllPresets[mbPresetName] = "{}";
    }
    var needToRemove = isInBookmarks(oll, coll, zbll);
    if (needToRemove) {
        removeBookmark(oll, coll, zbll);
        document.getElementById("bookmarkBtn").innerHTML = "&#9734;";
        document.getElementById("bookmarkBtn").title = "save case";
    } else {
        addToBookmark(oll, coll, zbll);
        document.getElementById("bookmarkBtn").innerHTML = "&#9733;";
        document.getElementById("bookmarkBtn").title = "saved";
    }
}
