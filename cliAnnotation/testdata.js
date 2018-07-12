"use strict";

/**
 * @memberof CLI
 * @desc
 * Calls to repository to query for Objects are done through this sub-command
 */

//
// Imports
//
var log = require("../lib/util/log");
var cmdCore = require("./core");
var fs = require("fs");

//
// Action
//
module.exports = function(params, options) {
    var testParams = params || {},
        includeDetails = true;

    // eg: count=1,appId="210",type="Pin",start-date='11121212212', end-date='12213313'
    if (typeof testParams === "string") {
        var matchMultiParam = testParams.match(/(.*,.*|=)/g);

        if (matchMultiParam && matchMultiParam.length > 1) {
            testParams = testParams.split(",");
        }
    }
    
    cmdCore.init(options);
    createAnnotationJSON(testParams, options);  
};

function createAnnotationJSON(testParams, options) {

    // log.info("test params " + testParams);
    testParams = testParams.split(",");
    var annotationObject = {};
    log.info("test params array = " + testParams);  
    var count = 1;
    for (var data = 0; data < testParams.length; data++) {
        var item = testParams[data].split("=");
        if (item[0] == "count")
            count = item[1]; 
    }
  
    for (var index = 0; index < count; index++) {
        annotationObject = generateRandomData(testParams);
        create(options,annotationObject, count, index);
    }
}

function generateRandomData(testParams) {

    var annotationObject = {};
    var typeArray = ["USER_ENTERED", "MP_ALERT","DIMENSION_EXPLOSION"];
    var titleArray = ["AURIBUS TENEO LUPUM", 
                      "Ex Nihilo Nihil Fi",
                      "CASTIGAT RIDENDO MORES"];
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
   
    annotationObject ["type"] = typeArray[Math.floor(Math.random() * typeArray.length)];
    annotationObject ["title"] = titleArray[Math.floor(Math.random() * titleArray.length)];;
    annotationObject ["text"] = textArray[Math.floor(Math.random() * textArray.length)];;
    annotationObject ["start"] = "";
    annotationObject ["end"] = "";
    annotationObject ["domainIds"] = 1;

    // set up the cmd line data
    for (var data = 0; data < testParams.length; data++) {
        var item = testParams[data].split("=");
        switch (item[0]) {
        case "start": annotationObject ["start"] = item[1]; break;
        case "end": annotationObject ["end"] = item[1]; break;
        case "domainIds": annotationObject ["domainIds"] = item[1];  break; 
        } 
    }
    
    // generate dates between start and end
    var dates;
    dates = getRandomStartEndDates((Number)(annotationObject ["start"]), (Number)(annotationObject ["end"]));
    annotationObject ["start"] = dates[0];
    annotationObject ["end"] = dates[1];
  
    return annotationObject;
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
    cmdCore.connectToRepository(options, function(err, annotation) {
        cmdCore.handleError(err);

        annotation.createAnnotationObject(data, function(err, id) {
            cmdCore.handleError(err);

            log.log("info", "New Annotation Object ID is: " + id, { id: id });
//          if(times == index+1)
//            process.exit(0);
        });
    });
}

