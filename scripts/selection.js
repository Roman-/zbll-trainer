/* colors correspond to selection state */

var colorAll = "#5f5";
var colorSome = "#ff5";
var colorNone = "#fff";

prepareMap();
generateSelectionTable();
renderSelection();
adjustInfo();

document.getElementById("bodyid").addEventListener("keydown", function(event) {
    if (event.keyCode == 27) // esc
        closeZW();		
});

// allocate help;
function adjustInfo()
{
    var rect = document.getElementById( "cases_selection" ).getBoundingClientRect();
    
    document.getElementById( "select_info" ).style.left = 
        rect.right + "px";
    
    document.getElementById( "select_info" ).style.width = 
        (document.body.clientWidth - rect.right - 20) + "px";
        
    document.getElementById( "dbutton" ).style.width = 
        (document.body.clientWidth - rect.right - 30) + "px";
            
}


/* ids */
function idTdOll(oll) {return "td-"+oll;}
function idTdColl(oll,coll) {return "td-"+oll+"-"+coll;}
function idItemOll(oll) {return "item-"+oll;}
function idItemColl(oll,coll) {return "item-"+oll+"-"+coll;}
function idItemZbll(oll,coll, zbll) {return "item-"+oll+"-"+coll+"-"+zbll;}
function idHeaderOll(oll) {return "ollHead-"+oll;}
function idHeaderColl(oll,coll) {return "collHead-"+oll+"-"+coll;}
function zbllSvg(oll,coll, zbll) {return "svg/"+oll+"-"+coll+"-"+zbll.replace("/", "s")+".svg";}


function prepareMap()
{
    for (var oll in zbllMap) if (zbllMap.hasOwnProperty(oll)) {
        var ollMap = zbllMap[oll];
        for (var coll in ollMap) if (ollMap.hasOwnProperty(coll)) {
            collMap = ollMap[coll];
            for (var zbll in collMap) if (collMap.hasOwnProperty(zbll)) {
                var zbllAlgs = collMap[zbll];
                collMap[zbll] = {"algs":zbllAlgs, "c":false};
            }
        }
    }
}

function colorBySelection(all, none)
{
    if ( !all && !none ) // some selected: yellow
        return colorSome;
    if (all)
        return colorAll;
    return colorNone;
}

/// iterates the zbllMap and highlights HTML elements according to the selection
function renderSelection()
{
    var totalZbllSel = 0;
    for (var oll in zbllMap) if (zbllMap.hasOwnProperty(oll)) {
        var ollNoneSel = true, ollAllSel = true; // ollNoneSel = 0 selected, ollAllSel = all cases selected
        var zbllsInOll = 0;
        var ollMap = zbllMap[oll];
        for (var coll in ollMap) if (ollMap.hasOwnProperty(coll)) {
            var collNoneSel = true, collAllSel = true; // ollNoneSel = 0 selected, ollAllSel = all cases selected	
            var zbllsInColl = 0;
            collMap = ollMap[coll];
            for (var zbll in collMap) if (collMap.hasOwnProperty(zbll)) {
                var zbllAlg = collMap[zbll];
                if (collMap[zbll]["c"])
                {
                    // case selected
                    ollNoneSel = false;
                    collNoneSel = false;
                    zbllsInColl++; zbllsInOll++; totalZbllSel++;
                }
                else {
                    // case not selected
                    ollAllSel = false;
                    collAllSel = false;
                }
            }
            // render coll item background
            document.getElementById( idTdColl(oll, coll) ).style.backgroundColor = colorBySelection(collAllSel, collNoneSel);
            document.getElementById( idHeaderColl(oll, coll) ).innerHTML = collHeaderContent(oll, coll, zbllsInColl);
        }
        document.getElementById( idTdOll(oll) ).style.backgroundColor = colorBySelection(ollAllSel, ollNoneSel);
        document.getElementById( idHeaderOll(oll) ).innerHTML = ollHeaderContent(oll, zbllsInOll);
    }
}

/* items generator */
function generateSelectionTable()
{
    var s = "";
    var maxColls = 6;
    s += "<table class='casesTable'>";
    
    // generate table header with OLL cases
    s += "<tr>";
    for (var oll in zbllMap) {
        if (zbllMap.hasOwnProperty(oll)) {
            s += "<td id='" + idTdOll(oll) + "' style='background-color:" +colorNone+";'>" + ollItem(oll) + "</td>";
            // .style.backgroundColor
        }
    }
    s += "</tr>";
    
    // generating the rest of the table with coll cases
    for (var row = 0; row < maxColls; row++)
    {
        s += "<tr>";
        
        for (var oll in zbllMap) {
            if (zbllMap.hasOwnProperty(oll)) {
                if (oll == "H" && row > 3)
                {
                    s += "<td class='collTd' id='td-empty'>(none)</td>";
                }
                else
                {
                    var collName = getCollByNum(oll, row);
                    s += "<td class='collTd' id='" + idTdColl(oll,collName) + "'>" + collItem(oll, collName) + "</td>";
                }
            }
        }
        
        s += "</tr>";
    }
    s += "</table>";
    document.getElementById("cases_selection").innerHTML = s;
}

function zbllItem(oll, coll, zbll) // div with img
{
    var s = "";
    var col = colorNone;
    if (zbllMap[oll][coll][zbll]["c"])
        col = colorAll;
    s += "<div ";
    s += "id='" + idItemZbll(oll, coll, zbll) + "' ";
    s += "style='background-color:" + col + ";' ";
    s += " onmousedown='zbllClicked(\"" + oll + "\",\"" + coll + "\",\"" + zbll + "\")' class='zbllItem'>";
    s += "<img src='" + zbllSvg(oll, coll, zbll) + "' width='100px'/>";
    s += "<br>" + zbll.replace("s", "/");
    return s + "</div>";
}

function ollItem(oll) // div
{
    var s = "";
    s += ollHeader(oll);
    s += "<div onmousedown='ollClicked(\"" + oll + "\")' class='ollItem'><img src='svg/" + oll + ".svg' width='100px'/></div>";
    return s;
}

function collItem(oll, coll) // div
{
    var s = "";
    s += collHeader(oll, coll);
    s += "<div onmousedown='collClicked(\"" + oll + "\",\"" + coll + "\")' class='ollItem'><img src='svg/" 
            + oll+"-"+coll + ".svg' width='100px'/></div>";
    return s;
}

function ollHeader(oll) // div
{
    return "<div class='ollHeader' id='" +idHeaderOll(oll)+"' onclick='expandOll(\""+oll+"\")'>"+
            ollHeaderContent(oll,0) +"</div>"; // ▲
}

function ollHeaderContent(oll, n) // text
{
    var total = (oll == "H" ? 48 : 72);
    if (n == 0)
            return oll + " (0/" + total + ") ▼";
    return oll + " (<b>" + n + "</b>/" + total + ") ▼";
}

/// \param n number of cases selected
function collHeader(oll, coll) // div
{
    return "<div class='collHeader' id='" +idHeaderColl(oll, coll)+
            "'onclick='expandColl(\""+oll + "\",\"" + coll +"\")'>" +collHeaderContent(oll, coll, 0) +"</div>";
}

function collHeaderContent(oll, coll, n) // text
{
    if (n == 0)
        return coll + " (0/12)";
    return coll + " (<b>" + n + "</b>/12)";
}

/// returns COLL name of \param oll by number n (0 to 5)
function getCollByNum(oll, n)
{
    var ollMap = zbllMap[oll];
    var i = -1;
    for (var key in ollMap) {
        if (ollMap.hasOwnProperty(key)) {
            i++;
            if (i == n)
                return key;
        }
    }
    console.error("getCollByNum: number is too high. Oll = " + oll + ", n = " + n);
    return "";
}

function changeVisib(el)
{
    if (el.style.visibility == "hidden" || el.style.visibility == "")
        el.style.visibility = "initial";
    else
        el.style.visibility = "hidden";
}

/* expand / collapse */
function expandOll(oll)
{
    // "td-" + oll + "-" + collName
    var ollMap = zbllMap[oll];
    for (var coll in ollMap) {
        if (ollMap.hasOwnProperty(coll)) {
            // expland or collapse
            changeVisib(document.getElementById("td-" + oll + "-" + coll));
        }
    }
}

function expandColl(oll, coll)
{
    // pop-up zbll cases selection area for this coll
    displayZW(oll, coll);
}

/* cases selection */
// cliks on div, change style of <td>
function ollClicked(oll)
{
    selectAllOll(oll, !ollHasSelected(oll));
    renderSelection();
}

function collClicked(oll, coll)
{
    selectAllColl(oll, coll, !collHasSelected(oll, coll));
    renderSelection();
}

function zbllClicked(oll, coll, zbll)
{
    // change its color; do not render anything else
    var newVal = !(zbllMap[oll][coll][zbll]["c"]);
    // change color
    if (newVal)
        document.getElementById( idItemZbll(oll, coll, zbll) ).style.backgroundColor = colorAll;
    else
        document.getElementById( idItemZbll(oll, coll, zbll) ).style.backgroundColor = colorNone;
    
    zbllMap[oll][coll][zbll]["c"] = newVal;
    
    updateZwHeader(oll, coll);
}

/// \param c assign this boolean value to all zbll of \param oll (true=select all, false=unmark all)
function selectAllOll(oll, c)
{
    var ollMap = zbllMap[oll];
    for (var coll in ollMap) if (ollMap.hasOwnProperty(coll)) {
        collMap = ollMap[coll];
        for (var zbll in collMap) if (collMap.hasOwnProperty(zbll))
            collMap[zbll]["c"] = c;
    }
}

/// \param c assign this boolean value to all zbll of \param oll (true=select all, false=unmark all)
function selectAllColl(oll, coll, c)
{
    var collMap = zbllMap[oll][coll];
    for (var zbll in collMap) if (collMap.hasOwnProperty(zbll))
        collMap[zbll]["c"] = c;
}

/// func is intended to be used in zw when clickced All or None. Elements are redrawed, no renderSelection() call needed
/// \param c assign this boolean value to all zbll of \param oll (true=select all, false=unmark all)
function selectAllZw(oll, coll, c)
{
    var collMap = zbllMap[oll][coll];
    for (var zbll in collMap) if (collMap.hasOwnProperty(zbll))
    {
        collMap[zbll]["c"] = c;
        // change color
        if (c)
            document.getElementById( idItemZbll(oll, coll, zbll) ).style.backgroundColor = colorAll;
        else
            document.getElementById( idItemZbll(oll, coll, zbll) ).style.backgroundColor = colorNone;		
    }
    updateZwHeader(oll, coll);
}

/// \returns true if oll has some selected cases
function ollHasSelected(oll)
{
    var ollMap = zbllMap[oll];
    for (var coll in ollMap) if (ollMap.hasOwnProperty(coll)) {
        collMap = ollMap[coll];
        for (var zbll in collMap) if (collMap.hasOwnProperty(zbll))
            if (collMap[zbll]["c"])
                return true;
    }
    return false;
}

/// \returns true if coll has some selected cases
function collHasSelected(oll, coll)
{
    var collMap = zbllMap[oll][coll];
    for (var zbll in collMap) if (collMap.hasOwnProperty(zbll))
        if (collMap[zbll]["c"])
            return true;
    return false;
}

/// short for howManyZbllsInCollSelected
function nZbllsInColl(oll, coll)
{
    var collMap = zbllMap[oll][coll];
    var n = 0;
    for (var zbll in collMap) if (collMap.hasOwnProperty(zbll))
        if (collMap[zbll]["c"])
            ++n;
    return n;
}


/* zbll selection popup window */
function displayZW(oll, coll)
{
    document.getElementById( "zbllWindowBack" ).style.display = 'initial';
    document.getElementById( "zbllWindow" ).style.display = 'initial';

    // fill the pictures
    var collMap = zbllMap[oll][coll];
    var s = "<span class='nw'>";
    var n = 0;
    for (var zbll in collMap) if (collMap.hasOwnProperty(zbll)) {
        s += zbllItem(oll, coll, zbll);
        if (!(++n%4))
            s += "</span><br><span class='nw'>";
    }
    document.getElementById( "zwPics" ).innerHTML = s; // this also deletes previous pics
    
    // header
    updateZwHeader(oll, coll);
    
    // assign selectAllZw() to buttons 
    document.getElementById( "noneZwButton" ).onclick = function(){selectAllZw(oll, coll, false);};
    document.getElementById( "allZwButton" ).onclick = function(){selectAllZw(oll, coll, true);};
}

function updateZwHeader(oll, coll)
{
    document.getElementById( "zwHeaderMessage" ).innerHTML = coll + "(" + nZbllsInColl(oll, coll) + "/12)";
}

function closeZW()
{
    if (document.getElementById( "zbllWindowBack" ).style.display != 'none')
    {
        document.getElementById( "zbllWindowBack" ).style.display = 'none';
        document.getElementById( "zbllWindow" ).style.display = 'none';
        renderSelection();
    }
}

/* cookies */

function bake_cookie(name, obj) {
    var cookie = [name, '=', JSON.stringify(obj), '; domain=.', window.location.host.toString(), '; path=/;'].join('');
    document.cookie = cookie;
}

// reading js object from cookie
function read_cookie(name) {
    var result = document.cookie.match(new RegExp(name + '=([^;]+)'));
    console.log("read_c string: ");
    console.log(result);

    return result && (result = JSON.parse(result[1]));
}
