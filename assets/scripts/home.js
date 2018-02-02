// note: see the barbershop hours API for more information on types
(function () {
    // constants
    var apiBaseUrl = "https://bigturtle.me";
    var weekdays = ['SUN','MON','TUE','WED','THU','FRI','SAT'];

    ////////////////////////////////////////////
    // business hours fetching and population //
    ////////////////////////////////////////////

    // table name (i.e. element id) of a given hours set
    function tableName(name) {
        return name + "-hours";
    }

    // (hours : Number, minutes : Number) -> "[h]h:mm"
    function timeStringOfHoursAndMinutes(hours, minutes) {
            if (hours > 12) {
                hours = (hours - 12).toString();
            }

            var minutesString = minutes.toString();
            if (minutesString.length == 1) {
                minutesString = "0" + minutesString;
            }

            return hours + ":" + minutesString;
    }

    // (hours : Object) -> <tr>...</tr>
    function tableRowOfGenericHours(hours) {
        var tableRow = $(document.createElement("tr"));
        var weekdayCell = $(document.createElement("td"));
        var startTimeCell = $(document.createElement("td"));
        var toCell = $(document.createElement("td"));
        var endTimeCell = $(document.createElement("td"));

        weekdayCell.text(weekdays[hours.weekday]);
        if (!hours.is_closed) {
            toCell.text("TO");
            startTimeCell.text(timeStringOfHoursAndMinutes(
                    hours.start_time.hours, hours.start_time.minutes));
            endTimeCell.text(timeStringOfHoursAndMinutes(
                    hours.end_time.hours, hours.end_time.minutes));
        } else {
            endTimeCell.text("CLOSED");
        }

        tableRow.append(weekdayCell, startTimeCell, toCell, endTimeCell);
        return tableRow;
    }

    // (date : Date) -> e.g. "MON (12/1)"
    function weekdayDateStringOfDate(date) {
        var weekday = weekdays[date.getDay()];
        var month = (date.getMonth() + 1).toString();
        var day = (date.getDate()).toString();

        return weekday + " (" + month + "/" + day + ")";
    }

    // (start_time : Object) -> <tr>...<td>CLOSED</td></tr>
    function closedTableRowOfDate(start_time) {
        var tableRow = $(document.createElement("tr"));
        var weekdayCell = $(document.createElement("td"));
        var startTimeCell = $(document.createElement("td"));
        var toCell = $(document.createElement("td"));
        var endTimeCell = $(document.createElement("td"));

        weekdayCell.text(weekdayDateStringOfDate(start_time));
        endTimeCell.text("CLOSED");
        tableRow.append(weekdayCell, startTimeCell, toCell, endTimeCell);

        return tableRow;
    }

    // (start_time : Object, end_time : Object) -> <tr>...</tr>
    function regularTableRowOfStartTimeAndEndTime(start_time, end_time) {
        var tableRow = $(document.createElement("tr"));
        var weekdayCell = $(document.createElement("td"));
        var startTimeCell = $(document.createElement("td"));
        var toCell = $(document.createElement("td"));
        var endTimeCell = $(document.createElement("td"));

        weekdayCell.text(weekdayDateStringOfDate(start_time));
        toCell.text("TO");
        startTimeCell.text(timeStringOfHoursAndMinutes(
                start_time.getHours(), start_time.getMinutes()));
        endTimeCell.text(timeStringOfHoursAndMinutes(
                end_time.getHours(), end_time.getMinutes()));
        tableRow.append(weekdayCell, startTimeCell, toCell, endTimeCell);

        return tableRow;
    }

    // (hours : Object) -> [<tr>...</tr>, ...]
    function tableRowsOfSpecificHours(hours) {
        var newTableRows = [];

        var start_time = new Date(hours.start_time);
        var end_time = new Date(hours.end_time);

        if (hours.is_closed) {
            while (start_time <= end_time) {
                newTableRows.push(
                    closedTableRowOfDate(start_time));
                start_time.setDate(start_time.getDate() + 1);
            }
        } else {
            while (start_time <= end_time) {
                newTableRows.push(
                    regularTableRowOfStartTimeAndEndTime(start_time, end_time));
                start_time.setDate(start_time.getDate() + 1);
            }
        }

        return newTableRows;
    }

    // (name : string, json : Object) -> <div>...</div>
    function hoursTableOfJSON(name, json) {
        var newTableDiv = $(document.createElement("div"));
        newTableDiv.attr("align", "center");
        newTableDiv.attr("id", tableName(name));
        newTableDiv.attr("class", "hours-table");

        var newTableTitle = $(document.createElement("div"));
        newTableTitle.attr("class", "marquee-title");
        newTableTitle.text(json.title.toUpperCase());

        var newTableBackground = $(document.createElement("img"));
        newTableBackground.attr("src", "assets/images/marquee-sign.png");
        newTableBackground.attr("style", "width: 95%");

        var newTable = $(document.createElement("table"));
        newTable.attr("class", "marquee-table");
        newTable.attr("style", "width: 95%");

        // populate table with any generic hours
        $.each(json.generic_hours, function (i, hours) {
            newTable.append(tableRowOfGenericHours(hours));
        });

        // populate table with any specific hours
        $.each(json.specific_hours, function (i, hours) {
            $(tableRowsOfSpecificHours(hours)).each(function(i, newRow) {
                newTable.append(newRow);
            });
        });

        newTableDiv.append(newTableTitle, newTableBackground, newTable);
        return newTableDiv;
    }

    // (i : Number, name : string) -> ()
    function populateHoursByName(i, name) {
        var httpRequest = new XMLHttpRequest();
        httpRequest.onreadystatechange = function() {
            if (httpRequest.readyState === XMLHttpRequest.DONE) {
                if (httpRequest.status === 200) {
                    var resp = JSON.parse(httpRequest.responseText);
                    $("#hours-tables").append(hoursTableOfJSON(name, resp));
                }
            }
        };
        httpRequest.open('GET', apiBaseUrl + '/hours/findByName/' + name, true);
        httpRequest.send();
    }

    /////////////////////////////////////////////
    // busines hours creation and modification //
    /////////////////////////////////////////////
    // TODO: i.e. POST ...

    window.onload = function () {
        // load hours data from the server
        var httpRequest = new XMLHttpRequest();
        httpRequest.onreadystatechange = function() {
            if (httpRequest.readyState === XMLHttpRequest.DONE) {
                if (httpRequest.status === 200) {
                    var resp = JSON.parse(httpRequest.responseText);
                    $("#" + tableName("regular")).first().remove();
                    $.each(resp.hours_names, populateHoursByName);
                }
            }
        };
        httpRequest.open('GET', apiBaseUrl + '/hours/findActive', true);
        httpRequest.send();
    };
})();
