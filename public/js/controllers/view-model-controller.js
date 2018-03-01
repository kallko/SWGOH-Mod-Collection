"use strict";
angular.module('GermanZip',[]);
angular.module('GermanZip').controller('viewModelController', ['$rootScope', '$scope', function (rootVm, vm) {
    let socket;
    vm.details;
    vm.greetings = "Wait for data loading";
    vm.newName = "";
    vm.selectedDistrict;
    vm.selectedHero;
    vm.collectionSize = 0;
    vm.selectedForm = '';
    vm.selectedSet = '';
    vm.selectedMain = '';
    vm.additionalSpeed = 0;
    vm.stars = 1;
    vm.user;

    let allMods = [];
    let currentUser = localStorage.getItem('currentUser');
    // localStorage.setItem('currentUser', vm.gameId);

    socket = io.connect('http://localhost:9021');

    console.log("CURRENT USER ", currentUser);
    if (currentUser) {
        socket.emit('newUserData', currentUser);
    }


    vm.heroes = [
    ];

    vm.modForms = ["arrow", "square", "rhombus", "triangle", "circle", "cross"];
    vm.modSets = ["health", "defence", "k-damage", "k-chance", "resistance", "offence", "efficient", "speed"];
    vm.myMods = [];


    vm.createNewUnit = function () {

        if (!vm.heroes.some(hero => hero.name === vm.newName)) {
            vm.heroes.push({"name": vm.newName, "class": []});
            socket.emit('newHero', {"name": vm.newName, "class": []});
        } else {
            alert("Hero already created!");
        }

    };


    vm.deleteOldUnit = function () {
        vm.heroes = vm.heroes.filter(hero => hero.name !== vm.selectedHero);
    };

    vm.createNewMod = function () {
        let newMod = {
            "form": vm.selectedForm,
            "set": vm.selectedSet,
            "main": vm.selectedMain,
            "speed": vm.additionalSpeed,
            "star" : vm.star
        };

        if (newMod.form === "arrow" && newMod.set === "speed") {
            newMod.speed
        }
        vm.myMods.push(newMod);
        console.log(newMod);
        socket.emit('newMod', newMod);
    };

    socket.on('notLogin', function () {
       alert("BAD LOGIN");
    });

    socket.on('units', function (data) {
        vm.heroes = data;
        vm.$apply();
        console.log(vm.heroes)
    });

    socket.on('heroes', function (data) {
        vm.heroes = data;
        vm.$apply();
        console.log("RECEIVED ", vm.heroes);
    });


    socket.on('mods', function (data) {
        allMods = data;
        vm.$apply();
        console.log(allMods)
    });


    vm.changeModFilter = function () {
        //alert("GOOD " + vm.selectedForm);
        vm.myMods = allMods.filter(mod => mod.form === vm.selectedForm);
        //console.log(vm.myMods);
    };






    socket.on('size', function (data) {
        vm.collectionSize = data;
    });


    socket.on('generalData', function (data) {

        let storedData = localStorage.getItem('zipData'); //todo find better way
        if (storedData) {
            vm.greetings = "Data loaded. Now You can request details";
            vm.generalData = JSON.parse(storedData);
        } else {
            vm.generalData = data.data;
            socket.emit('partReceived', vm.generalData.length);
        }
    });

    socket.on('partData', function (data) {
        vm.generalData = vm.generalData.concat(data.data);
        socket.emit('partReceived', vm.generalData.length);
        //refresh info about loading process for user
        if (vm.generalData.length % 500 === 0){
            vm.$apply();
        }
    });


    socket.on('details', function (data) {
        console.log("DETAILS ", data);
        vm.details = data;
        vm.$apply();
    });

    socket.on('selectedDistrict', function (data) {
        vm.districtDetail = data;
        vm.$apply();
    });

    socket.on('finished' , function(data){
        vm.greetings = "Data loaded. Now You can request details";
        vm.$apply();
        //localStorage.setItem('zipData', JSON.stringify(vm.generalData)); //todo find faster way
    });

    vm.selectDistrictForDetails = function (zip){
        socket.emit('needDetails', zip);
    };

    vm.loadNewData = function () {
        currentUser = vm.user;
        localStorage.setItem('currentUser', currentUser);
        socket.emit('newUserData', currentUser);
    }

}]);