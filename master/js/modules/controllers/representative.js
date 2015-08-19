/**=========================================================
 * Module: representative.js
 * Representative details
 =========================================================*/

App.controller('RepresentativeDataController',
  ['$scope','$rootScope', '$stateParams', '$log', '$http', 'DataFetcher', 'colors', '$filter', 'ngTableParams', 'Auth',
    function($scope, $rootScope, $stateParams, $log, $http, DataFetcher, colors, $filter, ngTableParams, Auth){
    $scope.dados = {};
    $scope.dados._id = $stateParams.id;
    $scope.pieData =[];
    $scope.themeData = [];
    $scope.billsRepresentative = [];
    $scope.committeesRepresentative = [];

    $scope.pieOptions = {
        segmentShowStroke : true,
        segmentStrokeColor : '#fff',
        segmentStrokeWidth : 2,
        percentageInnerCutout : 0, // Setting this to zero convert a doughnut into a Pie
        animationSteps : 100,
        animationEasing : 'easeOutBounce',
        animateRotate : true,
        animateScale : false
    };

    $scope.committeesTableParams = new ngTableParams({
        page: 1,
        count: 10,
        sorting: {SLP_DATA_APRESENTACAO: 'des'}
    }, {
        total: $scope.committeesRepresentative,
        counts: [],
        getData: function($defer, params){

            var filteredData = $scope.committeesRepresentative;
            if (params.filter() ){
                filteredData = $filter('filter')($scope.committeesRepresentative, params.filter());
            }

            var orderedData = params.sorting() ?
                $filter('orderBy')(filteredData, params.orderBy()) :
                filteredData;

            params.total(orderedData.length); // set total for recalc pagination
            $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
        }
    });

    $scope.billsTableParams = new ngTableParams({
        page: 1,
        count: 10,
        sorting: {SLP_DATA_APRESENTACAO: 'des'}
    }, {
        total: $scope.billsRepresentative,
        counts: [],
        getData: function($defer, params){

            var filteredData = $scope.billsRepresentative;
            if (params.filter() ){
                filteredData = $filter('filter')($scope.billsRepresentative, params.filter());
            }

            var orderedData = params.sorting() ?
                $filter('orderBy')(filteredData, params.orderBy()) :
                filteredData;

            params.total(orderedData.length); // set total for recalc pagination
            $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
        }
    });

    DataFetcher.fetchDataRepresentative($stateParams.id, Auth.user.token).then(function(data) {
        console.log(data);
        $scope.dados = data[0].data;
        $scope.themeData = data[1].data;
        $scope.terms = data[2].data;
        //$scope.billsRepresentative = data[3].data;
        //$scope.committeesRepresentative = data[4].data;

        //insert representative's bills into variable
        for(var a = 0; a < data[3].data.length; a++){
          $scope.billsRepresentative.push(data[3].data[a].doc);
        }
        $scope.billsTableParams.reload();

        //insert committees the representative participate into variable
        for(var b = 0; b < data[4].data.length; b++){
          $scope.committeesRepresentative.push(data[4].data[b].doc);
        }
        $scope.committeesTableParams.reload();

        $scope.themeData.forEach(function(item){
            var colorAux = colors.byName('random');
            var aux = {
                value: item.value,
                color: colorAux,
                highlight: colorAux,
                label: item.key
            };
            $scope.pieData.push(aux);
        });
        var arr = new Uint8Array(data[5].data);

        var raw = '';
        var i, j, subArray, chunk = 5000;
        for (i = 0, j = arr.length; i < j; i += chunk) {
            subArray = arr.subarray(i, i + chunk);
            raw += String.fromCharCode.apply(null, subArray);
        }

        var b64 = btoa(raw);
        $scope.RepresentativePhoto = b64;
    });
}]);
