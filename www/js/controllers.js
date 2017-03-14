angular.module('starter.controllers', ['angular-svg-round-progressbar'])

.controller('DashCtrl', function($scope) {})

.controller('MobileCtrl', function($scope) {})

.controller('RegisteringCtrl', function($scope) {})

.controller('OtpCtrl', function($scope) {})

.controller('TestCtrl', function($scope,$ionicPopup) {
  // $scope.nextSlide = function(val) {
  //     console.log("hi");
  //     console.log($ionicSlideBoxDelegate.$getByHandle(val).slidesCount());
  //     console.log($ionicSlideBoxDelegate.$getByHandle(val).currentIndex());
  //     if ($ionicSlideBoxDelegate.$getByHandle(val).slidesCount() - 2 <= $ionicSlideBoxDelegate.$getByHandle(val).currentIndex()) {
  //       $ionicSlideBoxDelegate.$getByHandle(val).slide(0);
  //     } else {
  //       $ionicSlideBoxDelegate.$getByHandle(val).next();
  //     }
  //   };
    // $scope.disableSwipe = function() {
    //   $ionicSlideBoxDelegate.enableSlide(false);
    // };
      $scope.options = {
  loop: false
}

  $scope.filters = function () {

    $scope.filter = $ionicPopup.show({
      templateUrl: 'templates/modal/time.html',
      scope: $scope,

    });
  }

  $scope.closePopup = function () {
      $scope.filter.close();
    }

  //     $ionicModal.fromTemplateUrl('templates/modal/time.html', {
  //   scope: $scope,
  //   animation: 'slide-in-up',
  //   cssClass: 'timeup-pop'
  // }).then(function(modal) {
  //   $scope.modal = modal;
  // });
  // $scope.openTimeup = function() {
  //   $scope.modal.show();
  // };
  // $scope.closeTimeup = function() {
  //   $scope.modal.hide();
  // };


$scope.hostParty=[{
  data:'text',
 // img: 'img/mike.png',
},
{
    data:'text',
    //  img: 'img/mike.png',
},{
    data:'text',
    //  img: 'img/mike.png',
}]

})

.controller('QuestionareCtrl', function($scope) {})

.controller('ChatsCtrl', function($scope, Chats) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  };
})


.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('AccountsCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
});
