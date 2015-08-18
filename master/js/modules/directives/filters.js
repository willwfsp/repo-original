App.filter('emailFilter', function() {
    return function(input, all) {
        var inputAux = "";
        if(input){
          if(input.constructor === Array){
              input.forEach(function(name){
                  inputAux = inputAux + ' , ' + name;
              });
              return inputAux.substring(3);
          }else{
              return input;
          }
        }
    };
  }
);

App.filter('ageFilter', function() {
     function calculateAge(birthdayString) { // birthday is a date
         birthday = new Date(birthdayString);
         var ageDifMs = Date.now() - birthday.getTime();
         var ageDate = new Date(ageDifMs); // miliseconds from epoch
         return Math.abs(ageDate.getUTCFullYear() - 1970);
     }

     return function(birthdate) {
           return calculateAge(birthdate);
     };
});

App.filter('statusDesc', function() {
    return function(input, attribute) {
        return input[attribute].DESC;
    }
});


App.filter('orderObjectBy', function(){
 return function(input, attribute) {
    if (!angular.isObject(input)) return input;

    var array = [];
    for(var objectKey in input) {
        array.push(input[objectKey]);
    }

    array.sort(function(a, b){
        a = parseInt(a[attribute]);
        b = parseInt(b[attribute]);
        return b - a;
    });
    return array;
 }
});

App.filter('houseFullName', function() {
    return function(input, all) {
        switch(input){
            case "CD": return "Câmara dos Deputados";   break;
            case "SF": return "Senado Federal";         break;
            case "MG": return "ALMG";                   break;
            case "SP": return "ALESP";                  break;
            default: return "";
        }
        return ;
    }
});

App.filter('legislature', function() {
    return function(input, all) {
        if (typeof input === 'string'){
            return input;
        }
        else if(input instanceof Array &&  input.length > 1){
            return input[0] + ', ' + input[1];
        }
        else {
            return input[0];
        };
        return;
    }
});

App.filter('capitalize', function() {
    return function(input, all) {
        var inputAux = "";
        if(input.constructor === Array){
            input.forEach(function(name){
                inputAux = inputAux + ' - ' + name;
            });
            inputAux = inputAux.substring(3);
        }else{
            inputAux = input;
        }

      return (!!inputAux) ? inputAux.replace(/([^\W_]+[^\s-]*) */g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();}) : '';
    };
  }
);

App.filter('tel', function () {
    return function (tel) {
        if (!tel) { return ''; }

        var value = tel.toString().trim().replace(/^\+/, '');

        if (value.match(/[^0-9]/)) {
            return tel;
        }

        var country, city, number;

        switch (value.length) {
            case 10: // +1PPP####### -> C (PPP) ###-####
                country = 1;
                city = value.slice(0, 3);
                number = value.slice(3);
                break;

            case 11: // +CPPP####### -> CCC (PP) ###-####
                country = value[0];
                city = value.slice(1, 4);
                number = value.slice(4);
                break;

            case 12: // +CCCPP####### -> CCC (PP) ###-####
                country = value.slice(0, 3);
                city = value.slice(3, 5);
                number = value.slice(5);
                break;

            default:
                return tel;
        }

        if (country == 1) {
            country = "";
        }

        number = number.slice(0, 3) + '-' + number.slice(3);

        return (country + " (" + city + ") " + number).trim();
    };
});