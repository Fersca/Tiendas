angular.module('starter', ['starter.services','ionic','ngSanitize'])

.config(function($stateProvider, $urlRouterProvider) {
 
  $stateProvider
 
    .state('app', {
      url: "/app",
      abstract: true,
      templateUrl: "tabs.html"
    })

    .state('app.search', {
      url: "/search",
      views: {
        'menuContent' :{
          templateUrl: "templates/search.html"
        }
      }
    })

    .state('app.browse', {
      url: "/browse",
      views: {
        'menuContent' :{
          templateUrl: "templates/browse.html"
        }
      }
    })
    .state('app.playlists', {
      url: "/playlists",
      views: {
        'menuContent' :{
          templateUrl: "home.html",
          controller: 'PlaylistsCtrl'
        }
      }
    })

    .state('app.product', {
      url: "/product/:prodId",
      views: {
        'menuContent' :{
          templateUrl: "templates/product.html",
          controller: 'ProductCtrl'
        }
      }
    })

    .state('app.ml', {
      url: "/ml",
      views: {
        'menuContent' :{
          templateUrl: "templates/ml.html",
          controller: 'MlCtrl'
        }
      }
    })

    .state('app.single', {
      url: "/playlists/:brand/:playlistId",
      views: {
        'menuContent' :{
          templateUrl: "templates/playlist.html",
          controller: 'PlaylistCtrl'
        }
      }
    });

  $urlRouterProvider.otherwise('/app/playlists');
  
})


.controller('AppCtrl', function($scope) {
})

.controller('PlaylistsCtrl', function($scope, $resource,$ionicLoading,$timeout) {
	
	
  // Setup the loader
  $ionicLoading.show({
    content: '<i class="icon ion-loading-c"></i>',
    animation: 'fade-in',
    showBackdrop: true,
    maxWidth: 200,
    showDelay: 0
  });
   	
	var res = $resource('https://api.mercadolibre.com/sites/MLA/apparel/brands');
 	var Result = res.query({},function(res1) {	 
	
		//Suplanta logo small por comun si no lo hay
		var index1;
		for (index1 = 0; index1 < res1.length; index1++) {
			if (res1[index1].brands[0].small_logo.length==0){
				res1[index1].brands[0].small_logo=res1[index1].brands[0].logo;
			}
		}
 		
 		//carga los logos en un array de a 3
 		var index;
 		var listaFinal = [];
		for (index = 0; index < res1.length; index=index+3) {
			var lista = [res1[index],res1[index+1],res1[index+2]];
		    listaFinal.push(lista);
		}

		//completa la lista con los primeros si no es multiplo de 3
		if (res1.length%3==2){
			listaFinal[listaFinal.length-1][2] = listaFinal[0][0]; 
		} 
		if (res1.length%3==1){
			listaFinal[listaFinal.length-1][2] = listaFinal[0][0];
			listaFinal[listaFinal.length-1][1] = listaFinal[0][1]; 
		} 

		
		$scope.playlists = listaFinal;
		
		$ionicLoading.hide();
 	});

  // Set a timeout to clear loader, however you would actually call the $ionicLoading.hide(); method whenever everything is ready or loaded.
  //$timeout(function () {
  //  $ionicLoading.hide();
  //}, 700);
  
})

.controller('PlaylistCtrl', function($scope, $resource, $stateParams,$ionicLoading, $timeout) {
  // Setup the loader
  $ionicLoading.show({
    content: '<i class="icon ion-loading-c"></i>',
    animation: 'fade-in',
    showBackdrop: true,
    maxWidth: 200,
    showDelay: 0
  });
	
	var cadena = 'https://api.mercadolibre.com/sites/MLA/search?seller_id='+$stateParams.playlistId
	var res = $resource(cadena);
 	var Result = res.get({},function(res1) {	 
		$scope.productos = res1.results;
		$scope.marca = $stateParams.brand;
		$ionicLoading.hide();
 	});

  // Set a timeout to clear loader, however you would actually call the $ionicLoading.hide(); method whenever everything is ready or loaded.

  // Set a timeout to clear loader, however you would actually call the $ionicLoading.hide(); method whenever everything is ready or loaded.
  //$timeout(function () {
  //  $ionicLoading.hide();
  //}, 700);

})

.controller('MarcasCtrl', function($scope, $resource) {
	  	
	var res = $resource('https://api.mercadolibre.com/sites/MLA/apparel/brands');
 	var Result = res.query({},function(res1) {	 
	
		//Suplanta logo small por comun si no lo hay
		var index1;
		for (index1 = 0; index1 < res1.length; index1++) {
			if (res1[index1].brands[0].small_logo.length==0){
				res1[index1].brands[0].small_logo=res1[index1].brands[0].logo;
			}
		}
 		
 		//carga los logos en un array de a 3
 		var index;
 		var listaFinal = [];
		for (index = 0; index < res1.length; index=index+3) {
			var lista = [res1[index],res1[index+1],res1[index+2]];
		    listaFinal.push(lista);
		}

		//completa la lista con los primeros si no es multiplo de 3
		if (res1.length%3==2){
			listaFinal[listaFinal.length-1][2] = listaFinal[0][0]; 
		} 
		if (res1.length%3==1){
			listaFinal[listaFinal.length-1][2] = listaFinal[0][0];
			listaFinal[listaFinal.length-1][1] = listaFinal[0][1]; 
		} 

		$scope.playlists = listaFinal;		
 	});
  
})


.controller('ProductCtrl', function($scope, $resource, $stateParams,$ionicLoading, $timeout) {
  // Setup the loader
  $ionicLoading.show({
    content: '<i class="icon ion-loading-c"></i>',
    animation: 'fade-in',
    showBackdrop: true,
    maxWidth: 200,
    showDelay: 0
  });
	
	var cadena = 'https://api.mercadolibre.com/items/'+$stateParams.prodId
	var res = $resource(cadena);
 	var Result = res.get({},function(res1) {	 
		$scope.producto = res1;
		$scope.abrir = function() {
			navigator.app.loadUrl(res1.permalink, {openExternal : true});
		 };
		$ionicLoading.hide();
 	});

})

.controller('MlCtrl', function($scope, $resource, $stateParams,$ionicLoading,$sce) {
    
	$scope.producto = 'https://buyingflow.mercadolibre.com.ar/checkout/start?item_id=MLA505909752&variation=6246284892'
    
    $scope.trustSrc = function(src) {
    	return $sce.trustAsResourceUrl(src);
  	}

});



