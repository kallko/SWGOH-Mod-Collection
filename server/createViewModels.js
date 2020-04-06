module.exports = CreateViewModels;

function CreateViewModels (firstData) {
    }

CreateViewModels.prototype.createGeneralModel = function (firstData) {
    let result = {"data": []};
    for (let i = 0; i < firstData.data.length; i++) {
        if (!result.data.some(newCity => newCity.cityName === firstData.data[i].city)) {
           result.data.push({
                "cityName" : firstData.data[i].city
            });
           result.data[result.data.length - 1].districts = [];
           result.data[result.data.length - 1].districts.push({
               "zip" : firstData.data[i].zip,
               "lat" : parseFloat(firstData.data[i].lat),
               "lon" : parseFloat(firstData.data[i].lon)
           });
        } else {
            const city = result.data.find(oldCity => oldCity.cityName === firstData.data[i].city);
            city.districts.push({
                "zip" : firstData.data[i].zip,
                "lat" : parseFloat(firstData.data[i].lat),
                "lon" : parseFloat(firstData.data[i].lon)
            });
        }
    }

    return result;
};


//todo on my opinion best way  - create big matrix with distance each to each, sort it and store in database
CreateViewModels.prototype.findNearestDistricts = function (data, district, length) {
    let result = [];
    let lat = district.lat;
    let lon = district.lon;

    for (let i = 0; i < data.length; i++) {
        let obj;
        let distance = getDistance(data[i].lat, data[i].lon, lat, lon);
        //first 10 district will be nearest except the point
        if (result.length < length && distance > 0) {
            obj  = JSON.parse(JSON.stringify(data[i]));
            obj.distance = distance;
            result.push(obj);

            if (result.length === length - 1) {
                result.sort(compareDistance);
            }
        } else {
            //the distance have to be less than 10s element distance
            if (distance > 0 && result[length - 1] && distance < result[length - 1].distance) {
                obj  = JSON.parse(JSON.stringify(data[i]));
                obj.distance = distance;
                result.push(obj);
                result.sort(compareDistance);
                result.length = length;
            }
        }
    }

    //for mor readable result
    result.forEach(city => city.distance = parseInt(city.distance));
    return result;
};

//find function in internet
function getDistance(lat1, lon1, lat2, lon2) {

    let R = 6372795;
    lat1 *= parseFloat(Math.PI / 180);
    lat2 *= parseFloat(Math.PI / 180);
    lon1 *= parseFloat(Math.PI / 180);
    lon2 *= parseFloat(Math.PI / 180);

    let cl1 = Math.cos(lat1);
    let cl2 = Math.cos(lat2);
    let sl1 = Math.sin(lat1);
    let sl2 = Math.sin(lat2);
    let delta = lon2 - lon1;
    let cdelta = Math.cos(delta);
    let sdelta = Math.sin(delta);

    let y = Math.sqrt(Math.pow(cl2 * sdelta, 2) + Math.pow(cl1 * sl2 - sl1 * cl2 * cdelta, 2));
    let x = sl1 * sl2 + cl1 * cl2 * cdelta;
    let ad = Math.atan2(y, x);
    return ad * R;
}

//compare Array by distance
function compareDistance(first, second) {
    return first.distance - second.distance;
}
