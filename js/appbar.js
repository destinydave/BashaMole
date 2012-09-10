(function () {
    "use strict";
    var page = WinJS.UI.Pages.define("main.html", {
        ready: function (element, options) {
            document.getElementById("cmdDelete")
                .addEventListener("click", doClickDelete, false);
        },
    });

    // Command button functions
    function doClickDelete() {
        window.open("default.html", "_self");
    }
})();