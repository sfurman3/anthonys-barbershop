// TODO: ADD MORE COMMENTS
window.onload = function () {
    // hide holiday hours by default
    document.getElementById("holiday-hours").style.display = "none";
    
    mainNav = Array.from(document.getElementById("main-nav").getElementsByTagName("ul")[0].getElementsByTagName("li"));
    
    mainNav.forEach(function (navBtn) {
        link = navBtn.getElementsByTagName("a")[0];
        link.onclick = function () {
            
            // TODO: why do I need to reassign link?
            
            link = navBtn.getElementsByTagName("a")[0];
            link.setAttribute("class", "active");
            mainNav.filter(elt => elt.id != navBtn.id).forEach(function (otherBtn) {
                otherBtn.getElementsByTagName("a")[0].removeAttribute("class");
                document.getElementById("content-" + otherBtn.className).style.display = "none";
            });
            
            document.getElementById("content-" + navBtn.className).style.display = "";
            
            // Don't scroll to ...#content-... element
            // Credit: https://stackoverflow.com/questions/1255726/href-dont-scroll
//            return false;
        }
    });
    
    // TODO: load hours data
    
    // TODO: refactor into function addRowToTable or similar...
//    var tableId = "hours-table";
//    var day = "TUE";
//    var startTime = "9:00";
//    var endTime = "7:00";
//    $("#" + tableId).find("table").append(
//        "<tr><td>" + day + "</td><td>" + startTime + "</td><td>TO</td><td>" + endTime + "</td></tr>"
//    );
}