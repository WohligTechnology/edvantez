angular.module('starter.controllers', ['angular-svg-round-progressbar'])

  .controller('DashCtrl', function ($scope, Chats, $templateCache, $ionicHistory) {
    $ionicHistory.clearCache()
    Chats.AllTest(function (data) {
      $scope.test = data.data;

    })
  })


  .controller('MobileCtrl', function ($scope) {})

  .controller('RegisteringCtrl', function ($scope, $rootScope, $location, Chats, $stateParams) {
    $rootScope.resultarr = Array();

    $.jStorage.set("resultset", $rootScope.resultarr);
    $scope.id = $stateParams.id;
    Chats.singleTest($scope.id, function (data) {
      $scope.test = data.data;

      $scope.timeing = parseInt($scope.test.duration);

      $.jStorage.set("testdetails", $scope.test);
      $scope.numofquestions = $scope.test.questionSet.length;
    })
    $scope.submit = function (form) { //on form submition
      Chats.userReg(form, function (data) { //checking or validation
        $scope.errormsg = null;
        if (data.error) { //if there are errors

          $scope.errormsg = "please fill the details correctly"
          $location.path('/testreg/' + $scope.id);
        } else { //if no errors
          var userid = data.data._id;
          $.jStorage.set("userid", userid);
          $.jStorage.set("login", true);
          $.jStorage.set("testid", $scope.id);
          $location.path('/questionare/' + $scope.id);
        }
      })
    }
  })

  .controller('OtpCtrl', function ($scope) {})

  .controller('TestCtrl', function ($scope, $rootScope, $ionicPopup, Chats, $stateParams, $timeout, $location) {

    $scope.testdetails = $.jStorage.get("testdetails");
    $rootScope.qd = Chats.questiondetails();
    var status = $.jStorage.get("login");
    if ($stateParams != null) { //question selected from questionarie page
      $scope.currentquestion = $stateParams.allquest;
      $scope.questionno = $stateParams.id;
    }
    if (status == true) {
      $scope.chquestions = _.chunk($scope.testdetails.questionSet, 10); //checks for user login

      $scope.questionchange = function (question, ind1, ind2) { //selecting question from test page
        $scope.currentquestion = question;
        $scope.questionno = ind1 * 10 + ind2 + 1;
        $scope.activeButton = Chats.checkAttempted($scope.currentquestion);
      }
      $scope.activeButton = Chats.checkAttempted($scope.currentquestion);
      $scope.selection = function (selected, qust, marks, opt) { //reultarray creation
        var result = _.find($rootScope.resultarr, {
          question: qust
        });
        $scope.activeButton = selected;
        console.log("rs", result)
        if (!result) {
          $rootScope.resultarr.push({
            question: qust,
            marks: marks,
            option: opt,
            selected: selected
          })
        } else {
          _.remove($rootScope.resultarr, {
            question: qust
          });
          $rootScope.resultarr.push({
            question: qust,
            marks: marks,
            option: opt,
            selected: selected
          });
        }

        $.jStorage.set("resultset", $rootScope.resultarr);
        $rootScope.qd = Chats.questiondetails();

      }
      //endof reultarray creation
    } else {
      Chats.sessionend();
    }
    $scope.sessiondestroyer = function () {
      Chats.sessionend();
    }

  })

  .controller('QuestionareCtrl', function ($scope, Chats, $stateParams, $location, $rootScope, $timeout, $state, $ionicModal) {
    $rootScope.qd = Chats.questiondetails();
    var status = $.jStorage.get("login");
    $scope.td = $.jStorage.get("testdetails");
    console.log($scope.series);
    if (status) {
      $scope.chquestions = _.chunk($scope.td.questionSet, 10);

      /* function for timer*/
      var duration = parseInt($scope.td.duration);
      // t = duration * 60;
      t = 10;
      $rootScope.hours;
      $rootScope.minutes;
      $rootScope.seconds;
      $rootScope.hours = Math.floor(t / 3600) % 24;
      t -= $rootScope.hours * 3600;
      $rootScope.minutes = Math.floor(t / 60) % 60;
      t -= $rootScope.minutes * 60;
      $rootScope.seconds = t % 60;
      $rootScope.onTimeout = function () {
        mytimeout = $timeout($rootScope.onTimeout, 1000);
        if ($rootScope.minutes != 0 && $rootScope.seconds == 0) {
          $rootScope.minutes -= 1;
          $rootScope.seconds = 60;
        }
        if ($rootScope.hours != 0 && $rootScope.minutes == 0 && $rootScope.seconds == 0) {
          $rootScope.hours -= 1;
          $rootScope.minutes = 59;
          $rootScope.seconds = 60;
        }
        $rootScope.seconds--;
        if ($rootScope.seconds == 0 && $rootScope.minutes == 0 && $rootScope.hours == 0) {
          $timeout.cancel(mytimeout)
          $rootScope.rd();
        }
      }
      var mytimeout = $timeout($rootScope.onTimeout, 1000);
      /* timer function ends */
      /* initialising modal */
      $ionicModal.fromTemplateUrl('templates/modals/time.html', {
        scope: $rootScope,
        animation: 'slide-in-up',
      }).then(function (modal) {
        $rootScope.modal = modal;
      });
      /* function to close modal popup */
      $rootScope.closePopup = function () {
        $rootScope.modal.hide();
        $state.go("tab.chats")
      };
      /*closing modal end*/
      /*function to call after timeout*/
      $rootScope.rd = function () {
        $rootScope.hours = 0;
        $rootScope.minutes = 0;
        $rootScope.seconds = 0;
        $timeout.cancel(mytimeout)
        var rs = $rootScope.resultarr;
        var user = $.jStorage.get("userid");
        var obj = {
          user: user,
          testName: $scope.td._id,
          result: rs
        }
        Chats.resultsave(obj, function (data) {

          $.jStorage.set("resultid", data.data._id);
          $.jStorage.set("login", false);
          $.jStorage.deleteKey("testid");
          $.jStorage.deleteKey("testdetails");
          $.jStorage.deleteKey("resultset");
        })
        $scope.modal.show(); /* modal popup */
      }
    } else {
      Chats.sessionend();
    }
    $scope.sessiondestroyer = function () {
      Chats.sessionend();
    }
  })

  .controller('ChatsCtrl', function ($scope, Chats, $timeout, $templateCache, $ionicHistory) {


    $scope.resultid = $.jStorage.get("resultid");

    Chats.findResult($scope.resultid, function (data) {
      $scope.resultdetails = data.data;

      $scope.testid = data.data.testName;

      $timeout(function () {
        Chats.singleTest($scope.testid, function (td) {

          var testdetails = td.data;
          var totalmarks = parseInt(testdetails.totalmarks);

          $scope.testname = testdetails.name;
          $scope.totalquestions = td.data.questionSet.length;
          $scope.questionsolved = $scope.resultdetails.result.length;
          /* for calculating percentage */
          var answerset = $scope.resultdetails.result;
          var total = 0;

          $scope.marks = _.map(answerset, 'marks');

          for (var i = 0; i < $scope.marks.length; i++) {
            total = total + parseInt($scope.marks[i]);
          }
          total *= parseInt($scope.marks.length);
          totalmarks *= parseInt(td.data.questionSet.length);

          $scope.percentage = (total * 100) / totalmarks;
          $.jStorage.flush();
          $ionicHistory.clearCache()

        })
      }, 800)
    })

  })


  .controller('ChatDetailCtrl', function ($scope, $stateParams, Chats) {
    $scope.chat = Chats.get($stateParams.chatId);

  })

  .controller('AccountsCtrl', function ($scope) {
    $scope.settings = {
      enableFriends: true
    };
  })

  .controller('AccountCtrl', function ($scope) {
    $scope.settings = {
      enableFriends: true
    };
  });
