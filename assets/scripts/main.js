// TODO: ADD MORE COMMENTS

window.onload = function () {
    // hide holiday hours by default
    document.getElementById("holiday-hours").style.display = "none";
    
    mainNav = Array.from(document.getElementById("main-nav").getElementsByTagName("ul")[0].getElementsByTagName("li"));
    
    mainNav.filter(elt => elt.className != "home").forEach(function (otherBtn) {
        otherBtn.getElementsByTagName("a")[0].removeAttribute("class");
        document.getElementById("content-" + otherBtn.className).style.display = "none";
    });
    
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
    
    // display section specified by id in url
    try {
        url = window.location.href;
        var urlId = url.substring(url.lastIndexOf('#') + 1);
        var contentId = urlId.substring(urlId.lastIndexOf('-') + 1);
        $("#btn_" + contentId).find("a").click();
    } catch (err) {
        ;
    }
    
    // TODO: load hours data
    $("#hours-table").find("table").append("<tr><td>TUE</td><td>9:00</td><td>TO</td> <td>7:00</td></tr>");
}