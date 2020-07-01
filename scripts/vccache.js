// returns visualcube picture URL for scramble
function scrambleToVcUrl(scramble) {
    let viewOption = (Glob.topOr3D == '3D') ? "r=y35x-30" : "view=plan";
    return "https://bestsiteever.ru/visualcube/visualcube.php?fmt=svg&bg=t&stage=ll&"+viewOption+"&alg=" +
        encodeURI(scramble).replace(/\'/g, "%27");
}

// add image for this scramble to browser cache
function preloadImage(scramble) {
    if (scramble != "") {
        (new Image()).src = scrambleToVcUrl(scramble);
    }
}

