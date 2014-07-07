angular.module('starter.controllers', ['starter.services','ionic','ngSanitize'])
  
.controller('AppCtrl', function($scope) {
})

.controller('CategoriesCtrl', function($scope, $resource,$ionicLoading,$timeout) {
	
  // Setup the loader
  $ionicLoading.show({
    content: '<i class="icon ion-loading-c"></i>',
    animation: 'fade-in',
    showBackdrop: true,
    maxWidth: 200,
    showDelay: 0
  });
   	
   	var listaFinal = [];
   	
   	listaFinal.push(
   		[
   		{name:"Accesorios de Moda",id:"MLA3114",picture:"http://resources.mlstatic.com/category/images/bbfd35b1-ae02-4d15-8a49-09bf1d0a16a0.png"},
   		{name:"Bermudas y Shorts",id:"MLA109276",picture:"http://resources.mlstatic.com/category/images/7f2d3ff8-e8c9-4c6b-99c9-ee0fdafcba77.png"}
   		]
   	);
   	listaFinal.push(
   		[
   		{name:"Buzos y Hoodies",id:"MLA109085",picture:"http://resources.mlstatic.com/category/images/1e5072a0-769a-46e8-8258-5778eb2b1e95.png"},
   		{name:"Camisas, Chombas y Blusas",id:"MLA109049",picture:"http://resources.mlstatic.com/category/images/339e3693-137c-49c1-99d8-716a6c06c5d8.png"}
   		]
   	);
   	
   	$scope.categories = listaFinal;	
	$ionicLoading.hide();
   	  
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
 	
 		var productIds = ""
		for (var index2 = 0; index2 < res1.results.length; index2++) {
			productIds = productIds+res1.results[index2].id+',' 
		}
 	 	
 		var conexion = 'https://api.mercadolibre.com/items?ids='+productIds+'&attributes=id,price,thumbnail,pictures';
 		
 		var res1 = $resource(conexion);
 		var Result = res1.query({},function(res2) {
 		
 			var pixels = 140
	 		var productos1 = []
	 	
			var index1;
			for (index1 = 0; index1 < res2.length; index1=index1+2) {
			
				var alto0=0
				var ancho0=0
				var alto1=0
				var ancho1=0
				
				var tamanio = res2[index1].pictures[0].size.split("x");
				if (tamanio[0]>tamanio[1]){
					var tamanio2 = pixels*tamanio[1]/tamanio[0]
					alto0 = pixels
					ancho0 = tamanio2
				} else {
					var tamanio2 = pixels*tamanio[0]/tamanio[1]
					alto0 = tamanio2
					ancho0 = pixels
				}

				if ((index1+1) < res2.length){
					var tam2= res2[index1+1].pictures[0].size.split("x");
					if (tam2[0]>tam2[1]){
						var tamanio2 = pixels*tam2[1]/tam2[0]
						alto1 = pixels
						ancho1 = tamanio2
					} else {
						var tamanio2 = pixels*tam2[0]/tam2[1]
						alto1 = tamanio2
						ancho1 = pixels		
					}
				}					
				productos1.push([res2[index1],res2[index1+1],ancho0,alto0,ancho1,alto1])
			}
	 		 		 
			if (res2.length%2==1){
				productos1[productos1.length-1][1] = productos1[0][0]; 
			} 
	 		 		 
			$scope.productos = productos1;
			$scope.marca = $stateParams.brand;
			$ionicLoading.hide();
 		

 		},function(err2){
	 		alert('Error');
	 		$scope.marca = $stateParams.brand;
	 		$ionicLoading.hide();
 		}
 		);
 		
 		
 		/*	
 		var productos1 = []
 	
		var index1;
		for (index1 = 0; index1 < res1.results.length; index1=index1+2) {
			productos1.push([res1.results[index1],res1.results[index1+1]])
		}
 		 		 
		if (res1.results.length%2==1){
			productos1[productos1.length-1][1] = productos1[0][0]; 
		} 
 		 		 
		//$scope.productos = res1.results;
		$scope.productos = productos1;
		$scope.marca = $stateParams.brand;
		$ionicLoading.hide();
		*/
 	},function(err1){
 		alert('Error');
 		$scope.marca = $stateParams.brand;
 		$ionicLoading.hide();
 	}
 	);

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


.controller('ProductCtrl', function($scope, $resource, $stateParams,$ionicLoading, $timeout,$ionicSlideBoxDelegate) {
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
		$scope.variations = res1.variations.length>0;
		$scope.marca = $stateParams.marca
		$scope.abrir = function() {
			navigator.app.loadUrl(res1.permalink, {openExternal : true});
		}
		$ionicLoading.hide();
				 
		$ionicSlideBoxDelegate.update();		 
				 
		/* 
		var cadenaDesc = 'https://api.mercadolibre.com/items/'+$stateParams.prodId+'/description'
		var resDesc = $resource(cadenaDesc);
 		var ResultDesc = resDesc.get({},function(resDesc1) {	 
			$scope.description = resDesc1.text;
			$ionicLoading.hide();
		 });
		 */ 
 	});

})

.controller('MlCtrl', function($scope, $resource, $stateParams,$ionicLoading,$sce) {
    
	$scope.producto = 'https://buyingflow.mercadolibre.com.ar/checkout/start?item_id=MLA505909752&variation=6246284892'
    
    $scope.trustSrc = function(src) {
    	return $sce.trustAsResourceUrl(src);
  	}

})

