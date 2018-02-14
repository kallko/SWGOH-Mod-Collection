const express = require('express'),
    app = express(),
    server = require('http').Server(app),
    request = require("request"),
    io = require('socket.io')(server);


app.use(express.static(__dirname + '/public'));

const router = require('./server/serverRouter'),
      port = 9021,
      CreateViewModels = require('./server/createViewModels');


const url = "http://www.fa-technik.adfc.de/code/opengeodb/PLZ.tab";

console.log(new Date());

app.use('/', router);
server.listen(port);

console.info('Listening on port ' + (port) + '...\n');
const cvm = new CreateViewModels();

let generalData,
    parsedData;

//receive data from url
request(url, function (error, response, body) {
    if (!error) {
        parsedData = customParser(body);
        generalData = cvm.createGeneralModel(parsedData);
        //generalData.data.length = 70; //for development
    } else {
        console.log("ERROR " + error);
    }
});


io.on('connection', function (socket) {

           console.log("New connection");

           if (generalData) {
               //send to client info about size of collection
               socket.emit("size", generalData.data.length - 1);

               let firstSendData = {};
               firstSendData.data = [];
               for (let i = 0; i < 5; i++){
                   firstSendData.data.push(generalData.data[i]);
               }
               socket.emit('generalData', firstSendData);

           } else {
               console.log("General Data NOT ready");
           }

    //we send information in parts
    socket.on('partReceived', function(size){

        let partData = {};
        partData.data = [];
        let last = size + 5;
        let isAllSent  = false;

        for (let i = size; i < last; i++){
            if (generalData.data[i] && generalData.data[i].cityName &&  generalData.data[i].cityName.length > 0) {
                partData.data.push(generalData.data[i])
            } else {
                isAllSent = true;
                break;
            }
        }
        socket.emit('partData', partData);

        if (!isAllSent){

        } else {
            socket.emit('finished', partData);
        }
    });

    socket.on('needDetails', function(zip){

        let dataForSend = {};
        const selectedDistrict = parsedData.data.find(district => district.zip === zip);
        socket.emit('selectedDistrict' , selectedDistrict);
        dataForSend = cvm.findNearestDistricts(parsedData.data, selectedDistrict, 10);

        //send nearest districts
        socket.emit('details', dataForSend);
    });

    console.log("USER CONNECTED");

});

//create data obj from body
function customParser(body) {
    let result = {data:[]};

    let lastCharAtString = 0;
    let lastCharAtSingleString = 0;

    body = body.substring(body.indexOf("\n") + 1);

    while ( lastCharAtString !== -1 ) {
         lastCharAtString = body.indexOf("\n");
         let singleString = body.substring(0, lastCharAtString);
         body = body.substring(lastCharAtString + 1);
         let obj = {};
         lastCharAtSingleString = findNextObjectStartChar(singleString);
         singleString = singleString.substring(lastCharAtSingleString + 1);
         lastCharAtSingleString = findNextObjectStartChar(singleString);
         obj.zip = singleString.substring(0, lastCharAtSingleString);
         singleString = singleString.substring(lastCharAtSingleString + 1);
         lastCharAtSingleString = findNextObjectStartChar(singleString);
         obj.lon = singleString.substring(0, lastCharAtSingleString);
         singleString = singleString.substring(lastCharAtSingleString + 1);
         lastCharAtSingleString = findNextObjectStartChar(singleString);
         obj.lat = singleString.substring(0, lastCharAtSingleString);
         singleString = singleString.substring(lastCharAtSingleString + 1);
         lastCharAtSingleString = findNextObjectStartChar(singleString);
         obj.city = singleString;

         result.data.push(obj);

    }

    console.log("Create data finished");
    return result;
}

//find in string needed char
function findNextObjectStartChar (simpleString){
    for (let i = 0; i < simpleString.length; i++) {
        if (simpleString.charCodeAt(i) === 9) {
            return i;
        }
    }
    return -1;
}





