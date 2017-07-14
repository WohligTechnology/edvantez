var adminurl = "http://eq.wohlig.co.in/api/"
angular.module('starter.services', [])

  .factory('Chats', function ($http, $location) {
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
        $.jStorage.flush();

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

    }
  });
