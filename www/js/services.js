//var adminurl = "http://eq.wohlig.co.in/api/"
var adminurl = "http://wohlig.io/api/"
angular.module('starter.services', [])

  .factory('Chats', function ($http, $location, $ionicActionSheet, $cordovaCamera, $cordovaFileTransfer, $cordovaImagePicker) {
    // Might use a resource here that returns a JSON array

    return {
      all: function () {
        return chats;
      },
      remove: function (chat) {
        chats.splice(chats.indexOf(chat), 1);
      },
      get: function (chatId) {
        for (var i = 0; i < chats.length; i++) {
          if (chats[i].id === parseInt(chatId)) {
            return chats[i];
          }
        }
        return null;
      },
      /*hangout copy*/
      AllTest: function (callback) {
        $http({
          url: adminurl + 'questions/getAllTest',
          method: 'POST',
        }).success(callback);
      },
      singleTest: function (id, callback) {
        var data = {
          _id: id
        }
        $http({
          url: adminurl + 'questions/findOneTest',
          method: 'POST',
          //withCredentials: false,
          data: data,
        }).success(callback);
      },

      userReg: function (form, callback) {
        $http({
          url: adminurl + 'User/save',
          method: 'POST',
          //withCredentials: false,
          data: form,
        }).success(callback);
      },

      collegeInfo: function (form, callback) {
        $http({
          url: adminurl + 'User/save',
          method: 'POST',
          //withCredentials: false,
          data: form,
        }).success(callback);
      },

      questiondetails: function () {
        var td = $.jStorage.get("testdetails");
        var resultset = $.jStorage.get("resultset")
        var questionanswered = 0;
        var remaining = 0;
        var totalquestions = 0;
        // console.log("resultset", resultset);
        if (resultset == null) {
          questionanswered = 0;
        } else {
          var questionanswered = resultset.length;
        }
        totalquestions = td.questionSet.length;
        remaining = totalquestions - questionanswered;
        // console.log("inservice resultset", resultset);


        var qd = {
          "totalquestions": totalquestions,
          "questionanswered": questionanswered,
          "remaining": remaining
        }
        //console.log("fromservice", qd)
        return qd;
      },

      sessionend: function () {
        //$.jStorage.flush();

        $.jStorage.set("login", false);
        $location.path('/tab/dash');
      },

      resultsave: function (rs, callback) {
        $http({
          url: adminurl + 'Results/save',
          method: 'POST',
          //withCredentials: false,
          data: rs,
        }).success(callback);
      },



      findResult: function (id, callback) {
        var data = {
          _id: id
        }
        $http({
          url: adminurl + 'Results/findOneResults',
          method: 'POST',
          //withCredentials: false,
          data: data,
        }).success(callback);
      },
      searchPhone: function (id, callback) {
        var data = {
          phone: id
        }
        $http({
          url: adminurl + 'User/profileFromPhoneNo',
          method: 'POST',
          //withCredentials: false,
          data: data,
        }).success(callback);
      },
      getNotification: function (id, callback) {
        var data = {
          _id: id
        }
        $http({
          url: adminurl + 'User/getNotificationForUser',
          method: 'POST',
          //withCredentials: false,
          data: data,
        }).success(callback);
      },
      checkAttempted: function (currentquestion) {
        var result = $.jStorage.get("resultset")
        var attempted = _.find(result, {
          question: currentquestion.question
        });

        if (attempted) {
          return attempted.selected;
        } else {
          return null;
        }
      },
      getUser: function (id, callback) {
        var data = {
          _id: id
        }
        $http({
          url: adminurl + 'User/getUser',
          method: 'POST',
          //withCredentials: false,
          data: data,
        }).success(callback);
      },
      //imageupload




      showActionsheet: function (maxImage, callback) {
        var actionsheet = [];
        $ionicActionSheet.show({
          //  titleText: 'choose option',
          buttons: [{
              text: '<i class="icon ion-ios-camera-outline"></i> Choose from gallery'
            }, {
              text: '<i class="icon ion-images"></i> Take from camera'
            },
            // {
            //   text: '<i class="icon ion-document-text"></i> Take from file'
            // }
            // ,{
            //   text: '<i class="icon ion-document-text"></i> <input type="file" value="" accept="application/pdf,application/vnd.ms-excel" class="hw100"> Take from file'
            // }
          ],
          //  destructiveText: 'Delete',
          cancelText: 'Cancel',
          cancel: function () {
            console.log('CANCELLED');
          },
          buttonClicked: function (index) {
            console.log('BUTTON CLICKED', index);
            if (index === 0) {
              var options = {
                maximumImagesCount: maxImage, // Max number of selected images
                width: 800,
                height: 800,
                quality: 80 // Higher is better
              };
              cordova.plugins.diagnostic.isCameraAuthorized({
                successCallback: function (authorized) {
                  if (authorized == false) {
                    cordova.plugins.diagnostic.requestCameraAuthorization({
                      successCallback: function (status) {
                        $cordovaImagePicker.getPictures(options).then(function (results) {
                          var i = 0;
                          $ionicLoading.show({
                            template: 'Loading...',
                            duration: 3000
                          }).then(function () {});
                          _.forEach(results, function (value) {

                            $cordovaFileTransfer.upload(adminurl + 'upload', value)
                              .then(function (result) {
                                $ionicLoading.hide().then(function () {
                                  console.log("The loading indicator is now hidden");
                                });
                                result.response = JSON.parse(result.response);
                                console.log(result.response.data[0]);
                                actionsheet.push(result.response.data[0]);
                                i++;
                                if (results.length == i) {
                                  callback(actionsheet);
                                }
                              }, function (err) {
                                // Error
                              }, function (progress) {
                                // constant progress updates
                              });
                          });

                        }, function (error) {
                          console.log('Error: ' + JSON.stringify(error)); // In case of error
                        });
                      },
                      errorCallback: function (error) {
                        console.error(error);
                      }
                    });

                  } else {
                    $cordovaImagePicker.getPictures(options).then(function (results) {
                      var i = 0;
                      $ionicLoading.show({
                        template: 'Loading...',
                        duration: 3000
                      }).then(function () {});
                      _.forEach(results, function (value) {

                        $cordovaFileTransfer.upload(adminurl + 'upload', value)
                          .then(function (result) {
                            $ionicLoading.hide().then(function () {});
                            result.response = JSON.parse(result.response);
                            actionsheet.push(result.response.data[0]);
                            i++;
                            if (results.length == i) {
                              callback(actionsheet);
                            }
                          }, function (err) {
                            // Error
                          }, function (progress) {
                            // constant progress updates
                          });
                      });

                    }, function (error) {
                      console.log('Error: ' + JSON.stringify(error)); // In case of error
                    });
                  }
                },
                errorCallback: function (error) {
                  console.error("The following error occurred: " + error);
                }
              });
            } else if (index === 1) {
              var cameraOptions = {
                quality: 90,
                destinationType: Camera.DestinationType.DATA_URL,
                sourceType: Camera.PictureSourceType.CAMERA,
                allowEdit: false,
                encodingType: 0,
                targetWidth: 1200,
                popoverOptions: CameraPopoverOptions,
                saveToPhotoAlbum: true,
                correctOrientation: true
              };
              $cordovaCamera.getPicture(cameraOptions).then(function (imageData) {
                var imageSrc = "data:image/jpeg;base64," + imageData;
                // $scope.showLoading('Uploading Image...', 10000);
                $ionicLoading.show({
                  template: 'Loading...',
                  duration: 3000
                }).then(function () {
                  console.log("The loading indicator is now displayed");
                });
                $cordovaFileTransfer.upload(adminurl + 'upload', imageSrc)
                  .then(function (result) {
                    $ionicLoading.hide().then(function () {
                      console.log("The loading indicator is now hidden");
                    });
                    result.response = JSON.parse(result.response);
                    console.log(result.response.data[0]);
                    actionsheet.push(result.response.data[0]);
                    callback(actionsheet);

                  }, function (err) {
                    // Error
                  }, function (progress) {
                    // constant progress updates
                  });
              }, function (err) {
                console.log(err);
              });
            } else {
              console.log("hello pdf");
              var fs = new $fileFactory();
              $ionicPlatform.ready(function () {
                fs.getEntriesAtRoot().then(function (result) {
                  $scope.files = result;
                }, function (error) {
                  console.error(error);
                });
                $scope.getContents = function (path) {
                  fs.getEntries(path).then(function (result) {
                    $scope.files = result;
                    $scope.files.unshift({
                      name: "[parent]"
                    });
                    fs.getParentDirectory(path).then(function (result) {
                      result.name = "[parent]";
                      $scope.files[0] = result;
                    });
                  });
                }
              });
            }
            return true;
          },
          destructiveButtonClicked: function () {
            console.log('DESTRUCT');
            return true;
          }
        });
        console.log("done");
      },

    };





  });
