"use strict";
angular.module('GermanZip',[]);
angular.module('GermanZip').controller('viewModelController', ['$rootScope', '$scope', function (rootVm, vm) {
    let socket;
    vm.details;
    vm.greetings = "Wait for data loading";
    vm.newName = "";
    vm.selectedDistrict;
    vm.selectedHero = '';
    vm.collectionSize = 0;
    vm.selectedForm = '';
    vm.selectedSet = '';
    vm.selectedMain = '';
    vm.additionalSpeed = 0;
    vm.stars = 1;
    vm.user;
    vm.needUpgradeMods = [];
    vm.admin = false;
    vm.viewModel = 0;
    vm.bestMods = [];
    // vm.selectedSecondSet;
    // vm.selectedFirstdSet;


    vm.setsProps = [
        {name : "Speed", count : 4, bonus: 5, maxBonus: 10 },
        {name : "Health", count : 2, bonus: 2.5, maxBonus: 5 },
        {name : "Offense", count : 4, bonus: 5, maxBonus: 10 },
        {name : "Tenacity", count : 2, bonus: 2.5, maxBonus: 5 },
        {name : "Defense", count : 2, bonus: 2.5, maxBonus: 5 },
        {name : "Protection", count : 0, bonus: 0, maxBonus: 0 },
        {name : "Crit Chance", count : 2, bonus: 2.5, maxBonus: 5 },
        {name : "Potency", count : 2, bonus: 5, maxBonus: 10 },
        {name : "Crit Damage", count : 4, bonus: 15, maxBonus: 30 },
        {name : "Accuracy", count : 0, bonus: 0, maxBonus: 0 },
        {name : "Crit Avoidance", count : 0, bonus: 0, maxBonus: 0 }
    ];

    const modForma = [
        "Holo-Array",
        "Transmitter",
        "Data-Bus",
        "Receiver",
        "Multiplexer",
        "Processor"
    ];


    let allMods = [];
    let currentUser = localStorage.getItem('currentUser');
    // localStorage.setItem('currentUser', vm.gameId);

    //socket = io.connect('http://93.183.200.136:9021');
    socket = io.connect('http://localhost:9021');

    console.log("CURRENT USER ", currentUser);

    vm.admin = currentUser === "kalko";

    if (currentUser) {
        socket.emit('newUserData', currentUser);
    }


    vm.heroes = [
    ];

    vm.modForms = ["arrow", "square", "rhombus", "triangle", "circle", "cross"];
    vm.modSets = ["health", "defence", "c-damage", "c-chance", "resistance", "offence", "efficient", "speed"];
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

    vm.findNeedUpgradeMods = function () {
        vm.viewModel = 1;
        showNeedUpgradeMods(vm.mods);
        vm.$apply();
    };

    vm.findBestMods = function () {
        vm.viewModel = 2;
        vm.bestMods = [];
        let tempMMods = [].concat(vm.mods);
        for (let i in modForma) {
            let maxSpeed = 0;
            let bestMod = [];
            tempMMods.forEach(mod => {

                if (mod.forma === modForma[i] && mod.addSpeed === maxSpeed) {
                    bestMod.push(mod)
                }

                if (mod.forma === modForma[i] && mod.addSpeed > maxSpeed) {
                    bestMod = bestMod.filter(best => best.forma !== modForma[i]);

                    maxSpeed = mod.addSpeed;
                    bestMod.push(mod);
                }



            });

            console.log(modForma[i], " ", bestMod.length);
            vm.bestMods = vm.bestMods.concat(bestMod);
            console.log(vm.bestMods.length);
        }
        console.log(vm.viewModel, "BestMods ", vm.bestMods);
    };



    vm.modsConstructor = function () {
        console.log("Constructor mode");
        vm.unFrezedHeroes = [].concat(vm.heroes);
        vm.frezedHeroes = [];
        vm.viewModel = 3;
    };


    vm.frezeHero = function (name) {
         console.log("name", name);
         let hero = vm.unFrezedHeroes.find(hero => hero.name === name);
         vm.frezedHeroes.push(hero);
         vm.unFrezedHeroes = vm.unFrezedHeroes.filter(hero => hero.name !== name);

    };

    socket.on('notLogin', function () {
       alert("BAD LOGIN");
    });

    vm.unFrezeHero = function (name) {
        let hero = vm.frezedHeroes.find(fHero => fHero.name === name);
        vm.unFrezedHeroes.push(hero);
        vm.frezedHeroes = vm.frezedHeroes.filter(fHero => fHero.name !== name);

    };


    // socket.on('units', function (data) {
    //     vm.heroes = data.heroes;
    //     vm.mods = data.mods;
    //     vm.heroesCollection = data.heroesCollection;
    //     vm.$apply();
    //     console.log(vm.heroes)
    // });

    socket.on('heroes', function (data) {
            vm.heroes = data.heroes;
            vm.mods = data.mods;
            vm.heroesCollection = data.collection;
            vm.heroes.forEach(hero => hero.name = hero.name.replace(/&quot;/g, '\"'));
            vm.mods.forEach(mod => mod.hero = mod.hero.replace(/&quot;/g, '\"'));
            vm.heroesCollection.forEach(hero => hero.name = hero.name.replace(/&quot;/g, '\"'));

        vm.viewModel = 1;
        vm.$apply();
        console.log("RECEIVED ", vm.heroes);
        console.log("RECEIVED ", vm.mods);
        console.log("RECEIVED ", vm.heroesCollection);


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


    socket.on("errorSWOGH", function () {
       alert("SWGOH site is down");
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
        vm.viewModel  = 0;
        vm.needUpgradeMods = [];
        currentUser = vm.user;
        vm.admin = currentUser === "kalko";
        console.log("user ", currentUser);
        localStorage.setItem('currentUser', currentUser);
        socket.emit('newUserData', currentUser);
    };


    vm.adminTest = function () {
        console.log(vm.selectedFirstdSet, vm.selectedSecondSet, vm.selectedThirdSet, vm.selectedMain);
        socket.emit("admin");
    };

    vm.filterProps = function (item) {
        return item.count > 0;
    };

    function showNeedUpgradeMods(mods) {
      //vm.needUpgradeMods = mods.filter(mod => isSpeedReceiver(mod));
      vm.needUpgradeMods = mods.filter(mod => isSpeedReceiver(mod) || haveAdditionalSpeed(mod));
       console.log("mods for upgrade ", vm.needUpgradeMods);
       // let secondLineMods = mods.filter(mod => (parseInt(mod.level) < 3 ));
       // vm.needUpgradeMods = vm.needUpgradeMods.concat(secondLineMods);
       //  console.log("needUpgradeMods ", vm.needUpgradeMods);

        vm.$apply();
    }

function isSpeedReceiver(mod) {
        return mod.forma === "Receiver" && parseInt(mod.level) < 15 && mod.mainStat === "Speed";
}

function haveAdditionalSpeed(mod) {
    return  (parseInt(mod.level) < 3 && mod.firstStat === "Speed") ||
            (parseInt(mod.level) < 6 && (mod.firstStat === "Speed" || mod.secondStat === "Speed")) ||
            (parseInt(mod.level) < 9 && (mod.firstStat === "Speed" || mod.secondStat === "Speed" || mod.thirdStat === "Speed")) ||
            (parseInt(mod.level) < 12 && (mod.firstStat === "Speed" || mod.secondStat === "Speed"|| mod.thirdStat === "Speed" || mod.forthStat === "Speed"))
}
}]);

//&& mod.firstStat !== ""