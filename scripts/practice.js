var selCases = [];
var recaps = [];
var currentNum;
var currentMode = 0; // 0 = selection, 1 = practicing, 2 = recap

/// \param m = mode: 0 = selection, 1 = practicing, 2 = recap
function changeMode(m)
{
    currentMode = m;
    var pr = document.getElementsByClassName("practice_layout");
    for (var i = 0; i < pr.length; i++)
        pr[i].style.display = (m == 0) ? 'none' : 'initial';

    var se = document.getElementsByClassName("selection_layout");
    for (var i = 0; i < se.length; i++)
        se[i].style.display = (m == 0) ? 'initial' : 'none';

    if (m == 0) {
        // selection layout
        renderSelection();
        adjustInfo();
        return;
    }

    // switch to practising layout
    fillSelected();
    recaps = (m == 2) ? selCases.slice() : [];
    // practice
    fillSelected();
    displayPracticeInfo();
    showScramble();
    adjustInfo();
    displayStats();
}

/// after selecting cases, this func fills selCases array with selected cases from map
function fillSelected()
{
    selCases = [];
    for (var oll in zbllMap) if (zbllMap.hasOwnProperty(oll)) {
        var ollMap = zbllMap[oll];
        for (var coll in ollMap) if (ollMap.hasOwnProperty(coll)) {
            collMap = ollMap[coll];
            for (var zbll in collMap) if (collMap.hasOwnProperty(zbll)) {
                if (collMap[zbll]["c"])
                {
                    var zbllName = oll+"-"+coll+"-"+zbll;
                    window.selCases.push(
                        {
                            name: zbllName + ".svg",
                            algs: collMap[zbll]["algs"],
                            desc: oll+"-"+coll+", "+zbll.replace("s", "/"),
                            oll: oll,
                            coll: coll,
                            zbll: zbll,
                        }
                    );
                }
            }
        }
    }
}

/// \returns random integer from 0 to h
function randomNum(h) {
    return Math.floor(Math.random() * h);
}

String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.split(search).join(replacement);
};

function inverse_scramble(s) {
    // deleting parantheses and double spaces
    s = s.replaceAll('[', " ");
    s = s.replaceAll(']', " ");
    s = s.replaceAll('(', " ");
    s = s.replaceAll(')', " ");
    while(s.indexOf("  ") != -1)
        s = s.replaceAll("  ", " ");

    // replacing apostrophes with primes
    var apostrophesChars = "ʼ᾿ߴ՚’`";
    for (var i = 0; i < apostrophesChars.length; i++)
        s = s.replaceAll(apostrophesChars[i], "'");

    var arr = s.split(" ");
    var result = "";
    for (var i = 0; i < arr.length; i++) {
        var it = arr[i];
        if (it.length == 0)
            continue;
        if (it[it.length - 1] == '2')
            result = it + " " + result;
        else if (it[it.length - 1] == '\'')
            result = it.substr(0, it.length - 1) + " " + result;
        else
            result = it + "' " + result;
    }

    return result;
}
