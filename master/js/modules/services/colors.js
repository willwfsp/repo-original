/**=========================================================
 * Module: colors.js
 * Services to retrieve global colors
 =========================================================*/

function pickRandomProperty(obj) {
    var result;
    var count = 0;
    for (var prop in obj)
        if (Math.random() < 1/++count)
           result = prop;
    return result;
}

App.factory('colors', ['APP_COLORS', function(colors) {

  return {
    byName: function(name) {
        if(name == "random"){
            var randomColor = pickRandomProperty(colors);
            return colors[randomColor];
        }else{
            return (colors[name] || '#fff');
        }

    }
  };

}]);
