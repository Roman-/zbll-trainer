// global variables storage
function Glob() {}
Glob.topOr3D = loadLocal("topOr3D", "top"); // "top" = top view, "3D" = 3D view
Glob.indexViewing = 0; // index of time instance currently viewing in timer

function onBodyLoaded() {
    loadPresets();
}
