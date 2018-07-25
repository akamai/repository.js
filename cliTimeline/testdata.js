"use strict";

/**
 * @memberof CLI
 * @desc
 * Calls to repository to create TimelineObject are done through this sub-command
 */

//
// Imports
//
var log = require("../lib/util/log");
var cmdCore = require("./core");
var fs = require("fs");
var path = require("path");
//
// Action
//
module.exports = function(params, options) {
    var testParams = params || {},
        includeDetails = true;

    // eg: count=1,appId="210",start='11121212212',end='12213313'
    if (typeof testParams === "string") {
        var matchMultiParam = testParams.match(/(.*,.*|=)/g);

        if (matchMultiParam && matchMultiParam.length > 1) {
            testParams = testParams.split(",");
        }
    }
    cmdCore.init(options);
    createTimelineJSON(testParams, options);

};

function createTimelineJSON(testParams, options) {

    // log.info("test params " + testParams);
    testParams = testParams.split(",");
    var timelineObject = {};
    var count = 1;
    for (var data = 0; data < testParams.length; data++) {
        var item = testParams[data].split("=");
        if (item[0] == "count")
            count = item[1];
    }

    for (var index = 0; index < count; index++) {
        timelineObject = generateRandomData(testParams);
        create(options,timelineObject, count, index);
    }
}

function generateRandomData(testParams) {
    var timelineItemContent = {};
    var timelineItem = {};
    var timelineObject = {};

    // to generate Pin events add "Pin" to the typeArray
    var typeArray = ["Insights", "Badge"];
    var titleArray = ["AURIBUS TENEO LUPUM", "Ex Nihilo Nihil Fi", "CASTIGAT RIDENDO MORES"];
    var categoryArray = ["Pulvis et umbra sumus", "Fiat Lux", "Dum vivimus, vivamus"];
    var textArray = [
        "Lorem ipsum dolor sit amet, eos ne odio mediocrem, eum commune definitiones at, " +
        "cu pro veniam essent antiopam. " +
        "Ut possim invenire has, et vix iusto altera adolescens. Ei per solum movet. " +
        "Offendit sensibus vulputate eum an, " +
        "te iusto temporibus eam, pro no fastidii consectetuer",
        "Melius salutatus ullamcorper nec id, consul scripserit pri ad, no commodo tritani definiebas vis. " +
        "An magna dicit timeam vix, munere audire per ad. No sit elit commune forensibus, mea ad magna essent. " +
        "An elit liber pro. Quo an ridens meliore.  ",
        "Id nec graeco suavitate intellegam, cum offendit euripidis similique te. " +
        "No meliore argumentum duo, ad euismod convenire mea. Id vim iusto invenire. " +
        "Qui an sumo mucius elaboraret. In tempor volumus duo, unum reque omittam duo ut. " +
        "Vix magna accumsan te, in stet eligendi pri.s"];

    timelineItemContent ["title"] = titleArray[Math.floor(Math.random() * titleArray.length)];;
    timelineItemContent ["text"] = textArray[Math.floor(Math.random() * textArray.length)];;
    timelineObject ["TimelineItemType"] = typeArray[Math.floor(Math.random() * typeArray.length)];
    timelineObject ["start"] = "";
    timelineObject ["end"] = "";
    // mPulseDemo id=1 (default) 
    timelineObject ["appIds"] = 1; 
    timelineItemContent ["category"] = categoryArray[Math.floor(Math.random() * categoryArray.length)];;
        
    // set up the cmd line data
    for (var data = 0; data < testParams.length; data++) {
        var item = testParams[data].split("=");
        switch (item[0]) {
        case "start": timelineObject ["start"] = item[1]; break;
        case "end": timelineObject ["end"] = item[1]; break;
        case "appIds": timelineObject ["appIds"] = item[1]; break;
        }
    }

    // generate dates between start and end
    var dates;
    dates = getRandomStartEndDates((Number)(timelineObject ["start"]),(Number)(timelineObject ["end"]));
    timelineObject ["start"] = dates[0];
    timelineObject ["end"] = dates[1];

    // generate content by type
    switch (timelineObject ["TimelineItemType"]) {
    case "Pin":
        timelineItemContent ["category"] = "";
        timelineItemContent ["content"] = {};
        break;
    case "Badge":
        timelineItemContent = createBadgesContent(timelineItemContent ["title"], 
            timelineItemContent ["category"], timelineObject ["start"]);
        break;
    case "Insights":
        timelineItemContent = createInsightsContent(timelineItemContent ["title"], 
            timelineItemContent ["category"], timelineItemContent ["text"]);
        break;
    }
    
    timelineObject ["timelineItem"] = { timelineItemContent };
    return timelineObject;
}

function createBadgesContent(title, category, start) {
    console.log("category=" + category);
    var iconIDBadgeArray = [
        "eventTransferTimeIncreased",
        "eventNewAppError",
        "eventNewCodePush",
        "eventFirstBeacon",
        "eventAppleUpdate",
        "eventLastYearThisDate",
        "eventCalendar",
        "eventBeaconMilestone",
        "eventMpulseUpdate"];

    var backgroundBadgeArray = [
        "badgeYellow",
        "badgeBlueUpdate",
        "badgePurpleConfetti",
        "badgeGreenConfetti",
        "badgeGreenDots",
        "badgeRedLines",
        "badgeBlue",
        "badgeOrangeLines",
        "badgeGears"];

    var textCol2Row1BadgeArray = [
        "Lorem ipsum dolor sit amet",
        "eos ne odio mediocrem",
        "eum commune definitiones at"];

    var twoColumnsLayout = [true,false];
    
    var textCol3BadgeArray = [
        "No meliore",
        "ad euismod",
        "Id vim"];
          
    var timelineItemContent = {};
    timelineItemContent ["title"] = title;
    timelineItemContent ["text"] = new Date(start).toString();
    timelineItemContent ["category"] = category;
    timelineItemContent ["content"] = {};
 
    timelineItemContent ["content"] = {
        "iconID": iconIDBadgeArray[Math.floor(Math.random() * iconIDBadgeArray.length)],
        "background"   : backgroundBadgeArray[Math.floor(Math.random() * backgroundBadgeArray.length)],
        "textCol2Row1" : textCol2Row1BadgeArray[Math.floor(Math.random() * textCol2Row1BadgeArray.length)],
        "textCol2Row2" : (new Date(new Date().getTime())).toString(),
        "twoColumnsLayout" : twoColumnsLayout[Math.floor(Math.random() * twoColumnsLayout.length)],
        "textCol3": textCol3BadgeArray[Math.floor(Math.random() * textCol3BadgeArray.length)]  
    };

    return timelineItemContent;
}
function createInsightsContent(title, text) {

    var timelineItemContent = {};
    timelineItemContent ["title"] = title;
    timelineItemContent ["text"] = text;

    var insightsCategory = ["eventGeoWidget","eventWeeklySummary","eventDesktopUser","eventMobileUser"];
    var insightsEventWidgetType = ["MASSACHUSATES","CALIFORNIA","USA"];

    timelineItemContent ["category"] = insightsCategory[Math.floor(Math.random() * insightsCategory.length)];       
    if (timelineItemContent ["category"] == "eventGeoWidget") {
        var beaconData = "";
        var region = {};
        var regionType = insightsEventWidgetType[Math.floor(Math.random() * 
                         insightsEventWidgetType.length)];             
        timelineItemContent ["title"] = "POPULAR IN " + regionType;
        var filePath = path.resolve("cliTimeline/" + regionType + ".json");
        fs.stat(filePath, function(err, stat) {
            cmdCore.handleError(err);
         
            fs.readFileSync(filePath, "utf8").toString().split("\n").forEach(function(line, index, arr) {
                if (index === arr.length - 1 && line === "") { 
                    log.info("finished");
                }
           
                var randomBeaconCount = Number(Math.floor(Math.random() * (50 - 1 + 1))) + Number(50);
                var randomMedLoadTime = (Number((Math.random() * (4567 - 1234 + 1))) + 
                                                   Number(4567)).toFixed(4);
                region ["beaconCount"] = randomBeaconCount;
                region ["medLoadTime"] = randomMedLoadTime;
                
                var jsonRegion = JSON.stringify(region).replace("{",""); 
       
                line = line.replace("}", "," + jsonRegion);         
                beaconData += line;
          
            });  
            timelineItemContent ["content"] = {
                "location": {
                    "countryCode": "US", 
                    "regionCode": regionType.indexOf("USA") > -1 ? null : regionType.substring(0, 2)
                },
                "beaconData": JSON.parse(beaconData)
            };
        });
    } else if (timelineItemContent ["category"] == "eventDesktopUser" || 
        timelineItemContent ["category"] == "eventMobileUser") {
        var increaseDropArray = [true,false];
        var increaseDrop = increaseDropArray[Math.floor(Math.random() * increaseDropArray.length)];  
        var dropOrIncreasePercentage = Number(Math.floor(Math.random() * (100 - 1 + 1))) + Number(1);
        var dropOrIncreaseNumber = (Number((Math.random() * (50 - 1 + 1))) + Number(1)).toFixed(1);
        var dropOrIncreaseAvgRate = Math.floor(Math.random() * Math.floor(60));
        var dropOrIncreaseAvgNumber = (Number((Math.random() * (50 - 1 + 1))) + Number(1)).toFixed(1);
        var widgetType = ["Drop","Increase"];
        var dropOrIncreaseWidget = widgetType[Math.floor(Math.random() * widgetType.length)];  
        var type;
        timelineItemContent ["category"].indexOf("Desktop") > -1 ? type = "desktop" : type = "mobile";
        log.info("increaseDrop " + increaseDrop + "dropOrIncreasePercentage " 
            + dropOrIncreasePercentage +" dropOrIncreaseNumber " 
            + dropOrIncreaseNumber + " dropOrIncreaseAvgRate " + dropOrIncreaseAvgRate
            + " dropOrIncreaseAvgNumber " + dropOrIncreaseAvgNumber);
        
        timelineItemContent ["content"] = {};
        var timelineContentKeyValues = [type + "UserIncrease",
            type + "UserPercentage", 
            type + "UserNumber", 
            type + "UserAvgRate", 
            type + "UserAvgNumber"];
        var timelineContentDataValues = [increaseDrop, dropOrIncreasePercentage + "%",
            dropOrIncreaseNumber + "k visitors","Avg for last " + dropOrIncreaseAvgRate + " days",
            dropOrIncreaseAvgNumber + "k visitors/day"];
        
        for (var i = 0; i < timelineContentDataValues.length; i++) {
            timelineItemContent ["content"][timelineContentKeyValues[i]] = timelineContentDataValues[i];        
        }
        // eventWeeklySummary    
    } else {
        var loadTime = Number(Math.floor(Math.random() * (100 - 1 + 1))) + Number(1);
        var complementaryLoadTime = 100 - loadTime;
        var beacons = (Number((Math.random() * (50 - 1 + 1))) + Number(1)).toFixed(1);
        log.info("loadTime " + loadTime +" complementaryLoadTime " + complementaryLoadTime + " beacons " + beacons);
        timelineItemContent ["content"] = {
            "beaconNumber": beacons +"m",
            "beaconLabel":"Beacons",
            "upperRightLoadTime": loadTime + "%",
            "upperRightLoadTimeLabel": "0-3 sec Load time",
            "upperRightLoadTimePerformance": "+ 4% vs last week",
            "lowerRightLoadTime": complementaryLoadTime + "%",
            "lowerRightLoadTimeLabel": "4+ sec Load time"
        };
    }      
    return  timelineItemContent;
}

function getRandomStartEndDates(start, end) {
    var tenDaysMs = 864000000;
    var dates;
    if (start != "" && end != "") {
        dates = generateRandomDates (start, end);
    } else if (start != "" && end == "") {
        end = start + tenDaysMs;
        dates = generateRandomDates (start, end);
    } else if (start == "" && end != "") {
        start = end - tenDaysMs;
        dates = generateRandomDates (start, end);
    } else if (start == "" && end == "") {
        var today = new Date();
        end = today.getTime();
        start = end - tenDaysMs;
        dates = generateRandomDates (start, end);   
    }
    return dates;
}
  
function generateRandomDates(start,end) {  
    var dates = [];
    var date1 = Number(Math.floor(Math.random() * (end - start + 1))) + Number(start);
    var date2 = Number(Math.floor(Math.random() * (end - start + 1))) + Number(start);
    if (date1 < date2) {
        dates.push(date1); 
        dates.push(date2); 
    } else {
        dates.push(date2); 
        dates.push(date1); 
    }
    return dates;
}
    
function create(options, data, times, index) {
    cmdCore.connectToRepository(options, function(err, timeline) {
        cmdCore.handleError(err);

        timeline.createTimelineObject(data, function(err, id) {
            cmdCore.handleError(err);

            log.log("info", "New Timeline Object ID is: " + id, { id: id });
            if (times == index+1)
                process.exit(0);
        });
    });
}