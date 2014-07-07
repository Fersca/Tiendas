angular.module('ionicApp', ['ionic', 'starter.controllers'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {

  $stateProvider
  
    .state('tab', {
      url: "/tab",
      abstract: true,
      templateUrl: "tabs.html"
    })
    .state('tab.home', {
      url: "/home",
      views: {
        'home-tab': {
          templateUrl: "home.html",
          controller: 'PlaylistsCtrl'
        }
      }
    })
    .state('tab.categories', {
      url: "/categories",
      views: {
        'home-tab': {
          templateUrl: "categories.html",
          controller: 'CategoriesCtrl'
        }
      }
    })    
    .state('tab.product', {
      url: "/product/:prodId/:marca",
      views: {
        'home-tab' :{
          templateUrl: "templates/product.html",
          controller: 'ProductCtrl'
        }
      }
    })

    .state('tab.ml', {
      url: "/ml",
      views: {
        'home-tab' :{
          templateUrl: "templates/ml.html",
          controller: 'MlCtrl'
        }
      }
    })

    .state('tab.single', {
      url: "/playlists/:brand/:playlistId",
      views: {
        'home-tab' :{
          templateUrl: "templates/playlist.html",
          controller: 'PlaylistCtrl'
        }
      }
    });

   $urlRouterProvider.otherwise("/tab/home");

});