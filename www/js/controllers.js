angular.module('starter.controllers', ['angular-svg-round-progressbar'])

  .controller('DashCtrl', function ($scope, Chats, $templateCache, $ionicHistory) {
    $ionicHistory.clearCache()

    Chats.AllTest(function (data) {
      $scope.test = data.data;
    })
  })


  .controller('MobileCtrl', function ($scope, $location) {

    $scope.submitcontact = function (contact) {

      if (contact == null) {
        $scope.msg = "Error: <span>Please enter valid mobile number < having 10 digits / containing only number / starting with 3,7,8 or 9></span>"
      } else {
        $.jStorage.set("contact", contact);
        $location.path("\otp");
      }
    }

  })

  .controller('RegisteringCtrl', function ($scope, $rootScope, $state, $location, $ionicPopup, Chats, $stateParams, $timeout, $ionicModal) {

    $scope.id = $stateParams.id
    Chats.singleTest($scope.id, function (data) {
      $scope.test = data.data;

      $scope.timeing = parseInt($scope.test.duration);

      $.jStorage.set("testdetails", $scope.test);
      $scope.numofquestions = $scope.test.questionSet.length;
    })
    $scope.submit = function (form) { //on form submition
      console.log(form.email)
      if (form.email != null && form.firstname != null && form.lastname) {
        console.log("inside if")
        angular.element(document.getElementById('regbutton'))[0].disabled = true;
        Chats.userReg(form, function (data) { //checking or validation
          $scope.errormsg = null;
          if (data.error) { //if there are errors

            $scope.errormsg = "please fill the details correctly"
            /*$location.path('/testreg/' + $scope.id);*/
          } else { //if no errors
            var userid = data.data._id;
            $.jStorage.set("userid", userid);
            $.jStorage.set("login", true);
            $.jStorage.set("testid", $scope.id);
            $rootScope.resultarr = Array();
            $.jStorage.set("resultset", $rootScope.resultarr);
            /************timer functionality*************/
            var duration = parseInt($scope.timeing);
            t = duration * 60;

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

            /* function to close modal popup */
            $rootScope.closePopup = function () {
              $rootScope.modal.close();
              // $scope.modal.remove();
              $state.go("tab.chats")
            };
            /*closing modal end*/
            /*function to call after timeout*/
            $rootScope.rd = function () {
              $rootScope.modal = $ionicPopup.show({
                templateUrl: 'templates/modals/time.html',
                scope: $rootScope,
                animation: 'fadeInUp',
              })
              $rootScope.hours = 0;
              $rootScope.minutes = 0;
              $rootScope.seconds = 0;
              $timeout.cancel(mytimeout)
              var rs = $rootScope.resultarr;
              var user = $.jStorage.get("userid");
              var obj = {
                user: user,
                testName: $scope.test._id,
                result: rs
              }
              Chats.resultsave(obj, function (data) {

                $.jStorage.set("resultid", data.data._id);
                $.jStorage.set("login", false);
                $.jStorage.deleteKey("testid");
                $.jStorage.deleteKey("testdetails");
                $.jStorage.deleteKey("resultset");
              })

              $rootScope.modal.then(function (modal) {
                $rootScope.modal = modal;
              });
              // $scope.modal.show(); /* modal popup */
            }
            /************timer ends******************** */
            $location.path('/test/' + $scope.id);
          }
        })
      } else {
        $scope.errormsg = "please fill the details correctly"
      }
    }
  })

  .controller('OtpCtrl', function ($scope, $location) {
    $scope.contact = $.jStorage.get("contact")
    var verify = false;
    $scope.onsubmit = function () {
      if (verify == false) {
        $scope.verifymsg = "please verify your number"
      } else {
        $location.path("tab/dash");
      }
    }
    $scope.verifyotp = function (otpcode) {
      console.log(otpcode)
      if (otpcode == 1234) {
        verify = true;
        $scope.verifymsg = null;
        $scope.verifysucess = "otp verified please press submit";
      } else {
        $scope.verifymsg = "please enter correct otp";
      }
    }
  })

  .controller('TestCtrl', function ($scope, $rootScope, $ionicPopup, Chats, $stateParams, $state, $timeout, $location, $ionicModal) {

    $scope.testdetails = $.jStorage.get("testdetails");
    $rootScope.qd = Chats.questiondetails();
    var status = $.jStorage.get("login");
    if ($stateParams.allquest != null) { //question selected from questionarie page
      console.log("if ran");
      $scope.currentquestion = $stateParams.allquest;
      $scope.questionno = $stateParams.id;
    } else {
      console.log("else ran");
      $scope.currentquestion = $scope.testdetails.questionSet[0];
      $scope.questionno = 1
    }
    if (status == true) {
      $scope.chquestions = _.chunk($scope.testdetails.questionSet, 10); //checks for user login
      console.log($scope.chquestions);
      $scope.checkSolvedQuestions = function (question) {
        $scope.check = Chats.checkAttempted(question);
        if ($scope.check != null && $scope.currentquestion == question) {
          return "solved active";
        } else if ($scope.check != null && $scope.currentquestion != question) {
          return "solved";
        } else if ($scope.check == null && $scope.currentquestion == question) {
          return "active";
        }
      }
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
      $scope.checkSolvedQuestions = function (question) {
        $scope.check = Chats.checkAttempted(question);
        if ($scope.check != null && $scope.currentquestion == question) {
          return "solved active";
        } else if ($scope.check != null && $scope.currentquestion != question) {
          return "solved";
        } else if ($scope.check == null && $scope.currentquestion == question) {
          return "active";
        }
      }
    } else {
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
      $scope.checkSolvedQuestions = function (question) {
        $scope.check = Chats.checkAttempted(question);
        if ($scope.check != null) {
          return "solved";
        } else {
          return "notsolved";
        }
      }
    } else {
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
