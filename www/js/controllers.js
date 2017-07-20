angular.module('starter.controllers', ['angular-svg-round-progressbar', ])

  .controller('DashCtrl', function ($scope, $state, $ionicPlatform, Chats, $templateCache, $ionicHistory, $ionicPopover) {
$ionicPopover.fromTemplateUrl('templates/modals/menupopover.html', {
            scope: $scope,
            cssClass: 'menupop',

        }).then(function(popover) {
            $scope.popover = popover;
        });

        $scope.closePopover = function() {
            $scope.popover.hide();
        };
    $ionicPlatform.registerBackButtonAction(function (e) {
      if ($state.current.name == 'tab.dash') {
        ionic.Platform.exitApp();
      } else if ($state.current.name == 'tab.chats') {
        $state.go("tab.dash");
      } else {
        event.preventDefault();
      }
    }, 401);
    Chats.AllTest(function (data) {
      $scope.test = data.data;
    })
  })


  .controller('MobileCtrl', function ($scope, $state, $ionicPopover) {
$ionicPopover.fromTemplateUrl('templates/modals/menupopover.html', {
            scope: $scope,
            cssClass: 'menupop',

        }).then(function(popover) {
            $scope.popover = popover;
        });

        $scope.closePopover = function() {
            $scope.popover.hide();
        };

    $scope.submitcontact = function (contact) {

      if (contact == null) {
        $scope.msg = "Error: <span>Please enter valid mobile number < having 10 digits / containing only number / starting with 3,7,8 or 9></span>"
      } else {
        $.jStorage.set("contact", contact);
        $state.go("otp");
      }
    }

  })

  .controller('RegisteringCtrl', function ($scope, $window, $ionicPlatform, $rootScope, $state, $location, $ionicPopup, Chats, $stateParams, $timeout, $ionicModal) {
    var flag = 0;
    $scope.id = $stateParams.id
    Chats.singleTest($scope.id, function (data) {
      $scope.test = data.data;

      $scope.timeing = parseInt($scope.test.duration);

      $.jStorage.set("testdetails", $scope.test);
      $scope.numofquestions = $scope.test.questionSet.length;
    })
    $scope.submit = function (form) { //on form submition

      if (form.email != null && form.firstname != null && form.lastname) {
        angular.element(document.getElementById('regbutton'))[0].disabled = true;
        Chats.userReg(form, function (data) { //checking or validation
          $scope.errormsg = null;
          if (data.error) { //if there are errors

            $scope.errormsg = "please fill the details correctly"
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
                flag = 1
                $rootScope.rd();
              }
            }
            var mytimeout = $timeout($rootScope.onTimeout, 1000);
            /************* timer function ends************** */
            /************confirm popup************ */
            $rootScope.showconfirmbox = function () {
              if ($window.confirm("Do you want to continue?"))
                $rootScope.rd();
              else
                $scope.result = "No";
            }
            /************* function to close modal popup************* */
            $rootScope.closePopup = function () {
              $rootScope.modal.close();
              $state.go("laststep")
            };
            /*closing modal end*/
            /************function to call after timeout**************/
            $rootScope.rd = function () {
              $rootScope.hours = 0;
              $rootScope.minutes = 0;
              $rootScope.seconds = 0;
              $timeout.cancel(mytimeout)
              var user = $.jStorage.get("userid");
              var obj = {
                user: user,
                testName: $scope.test._id,
                result: $.jStorage.get("resultset")
              }
              Chats.resultsave(obj, function (data) {
                $.jStorage.set("resultid", data.data._id);
                $.jStorage.set("login", false);

              })
              if (flag == 1) {
                // $rootScope.modal = $ionicPopup.show({
                //   templateUrl: 'templates/modals/time.html',
                //   scope: $rootScope,
                //   animation: 'fadeInUp',

                // })
                // $rootScope.modal.then(function (modal) {
                //   $rootScope.modal = modal;
                // });

              } else {
                $rootScope.modal = $ionicPopup.show({
                  templateUrl: 'templates/modals/onsubmit.html',
                  scope: $rootScope,
                  animation: 'fadeInUp',

                })
                $rootScope.modal.then(function (modal) {
                  $rootScope.modal = modal;
                });
              }
            }

            /**********************timer ends*********************/
            $location.path('/test/' + $scope.id);
          }
        })
      } else {
        $scope.errormsg = "please fill the details correctly"
      }
    }
  })

  .controller('OtpCtrl', function ($scope, $location, $ionicPopover) {
    $ionicPopover.fromTemplateUrl('templates/modals/menupopover.html', {
            scope: $scope,
            cssClass: 'menupop',

        }).then(function(popover) {
            $scope.popover = popover;
        });

        $scope.closePopover = function() {
            $scope.popover.hide();
        };

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
      if (otpcode == 1234) {
        verify = true;
        $scope.verifymsg = null;
        $scope.verifymsg = "otp verified please press submit";
        $scope.onsubmit();
      } else {
        verify = false;
        $scope.verifymsg = "please enter correct otp";

      }
    }
  })

  .controller('TestCtrl', function ($scope, $rootScope, $ionicPlatform, $ionicPopup, Chats, $stateParams, $state, $timeout, $location, $ionicModal) {

    $scope.testdetails = $.jStorage.get("testdetails");


    $scope.qd = Chats.questiondetails();
    var status = $.jStorage.get("login");
    if ($stateParams.allquest != null) { //question selected from questionarie page
      $scope.currentquestion = $stateParams.allquest;
      $scope.questionno = $stateParams.id;
    } else {
      $scope.currentquestion = $scope.testdetails.questionSet[0];
      $scope.questionno = 1
    }
    if (status == true) {

      $scope.questions = $scope.testdetails.questionSet;
      /********selecting question from test page***********/
      $scope.questionchange = function (question, ind1) {
        $scope.currentquestion = question;

        $scope.questionno = ind1 + 1
        $scope.activeButton = Chats.checkAttempted($scope.currentquestion);
      }
      $scope.activeButton = Chats.checkAttempted($scope.currentquestion);
      /**************function for swipe right*****************/
      $scope.previous = function (ind) {
        if (ind > 1) {
          $scope.questionno = ind - 1;
          $scope.currentquestion = $scope.testdetails.questionSet[ind - 2];


        } else {
          $scope.currentquestion = $scope.testdetails.questionSet[0];
          $scope.questionno = 1;
        }
        $scope.activeButton = Chats.checkAttempted($scope.currentquestion);

      }
      /**************function for swipe left**************/
      $scope.next = function (ind) {
        var len = $scope.testdetails.questionSet.length;
        if (ind < len) {
          $scope.questionno = ind + 1;
          $scope.currentquestion = $scope.testdetails.questionSet[ind];

        } else {
          $scope.currentquestion = $scope.testdetails.questionSet[len - 1];
          $scope.questionno = len;
        }

        $scope.activeButton = Chats.checkAttempted($scope.currentquestion);

      }
      /************function for entering selection to result array***************/
      $scope.selection = function (selected, qust, marks, opt) {
        var result = _.find($rootScope.resultarr, {
          question: qust
        });
        $scope.activeButton = selected;

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
        $scope.qd = Chats.questiondetails();

      }
      /**************function for checking solved and active question***************/
      $scope.checkSolvedQuestions = function (question) {
        $scope.check = Chats.checkAttempted(question);
        if ($scope.check != null && $scope.currentquestion.question == question.question) {
          return "solved actived";
        } else if ($scope.check != null && $scope.currentquestion.question != question.question) {
          return "solved";
        } else if ($scope.check == null && $scope.currentquestion.question == question.question) {
          return "actived";
        }
      }
    } else {
      Chats.sessionend();
    }
  })

  .controller('QuestionareCtrl', function ($scope, Chats, $ionicPlatform, $stateParams, $location, $rootScope, $timeout, $state, $ionicModal) {
    $rootScope.qd = Chats.questiondetails();
    var status = $.jStorage.get("login");
    $scope.td = $.jStorage.get("testdetails");
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

  .controller('ChatsCtrl', function ($scope, $ionicPlatform, $state, Chats, $timeout, $templateCache, $ionicHistory, $ionicPopover) {
    $ionicPopover.fromTemplateUrl('templates/modals/menupopover.html', {
            scope: $scope,
            cssClass: 'menupop',

        }).then(function(popover) {
            $scope.popover = popover;
        });

        $scope.closePopover = function() {
            $scope.popover.hide();
        };
    $scope.resultid = $.jStorage.get("resultid");
    /*$scope.username1 = "Bhargav";
    $scope.username2 = "Purohit"*/
    Chats.findResult($scope.resultid, function (data) {
      $scope.resultdetails = data.data;
      $scope.testid = data.data.testName;
      if ($scope.testid != null) {
        Chats.getUser($scope.resultdetails.user, function (data) {
          $scope.username1 = data.data.firstname;
          $scope.username2 = data.data.lastname;
        })
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
        })
      }
      $.jStorage.flush();
    })
  })
  .controller('ChatDetailCtrl', function ($scope, $stateParams, Chats) {
    $scope.chat = Chats.get($stateParams.chatId);

  })

  .controller('LastStepCtrl', function ($scope, $stateParams, Chats, $ionicPopover) {
    
$ionicPopover.fromTemplateUrl('templates/modals/menupopover.html', {
            scope: $scope,
            cssClass: 'menupop',

        }).then(function(popover) {
            $scope.popover = popover;
        });

        $scope.closePopover = function() {
            $scope.popover.hide();
        };

  })

  .controller('ProfileCtrl', function ($scope, $stateParams, Chats, $ionicPopover) {
    $ionicPopover.fromTemplateUrl('templates/modals/menupopover.html', {
            scope: $scope,
            cssClass: 'menupop',

        }).then(function(popover) {
            $scope.popover = popover;
        });

        $scope.closePopover = function() {
            $scope.popover.hide();
        };


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
