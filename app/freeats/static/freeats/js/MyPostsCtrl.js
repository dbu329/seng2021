define('MyPostsCtrl', [
  'jquery',
  'app',
  'eventBus',
  'facebookService'
],
function ($, app, eventBus, facebookService) {
  app.controller(
    'MyPostsCtrl',
    function ($rootScope, $scope, $resource, $location, facebookService) {
      console.log('MyPostsCtrl');
      facebookService.init();
      $rootScope.currentView = 'myposts';
      $rootScope.loggedIn = false;

      eventBus.on('mapLoaded', function () {
        $rootScope.mapLoaded = true;
      });

      $rootScope.getFacebookLoginStatus(function () {
        $scope.updatePostList();
        $scope.updateMyStats();
        (function loop() {
          setTimeout(function () {
            $scope.updatePostList();
            $scope.updateMyStats();
            loop();
          }, 5000);
        })();
      });

      eventBus.emit('showMyPostsCtrl');

      var getItemById = function (id) {
        var item = null;
        for (i in $scope.myPosts) {
          var j = $scope.myPosts[i];
          if (j.id == id) {
            item = j;
            break;
          }
        }
        return item;
      }
      var Food = $resource('/food',  null, {
        'update': { method: 'PUT' }
      });
      $scope.createPost = function () {
        $('#newPostModal').modal();
      };
      $scope.submitPost = function () {
        var post = angular.copy($scope.newPost);
        post.user_id = $rootScope.fbUserId;
        post.access_token = $rootScope.fbAccessToken;
        // Need to validate post data still
        Food.save(post, function () {
          console.info('Post saved');
          $('#newPostModal').modal('hide');
          $scope.newPost = {};
          $scope.updatePostList();
        });
      };
      $scope.editPost = function (postId) {
        $scope.post = getItemById(postId);
        $('#editPostModal').modal();
      };
      $scope.updatePost = function () {
        var post = angular.copy($scope.post);
        post.user_id = $rootScope.fbUserId;
        post.access_token = $rootScope.fbAccessToken;
        // Need to validate post data still
        Food.update(post, function () {
          console.info('Post saved');
          $('#editPostModal').modal('hide');
          $scope.post = {};
          $scope.updatePostList();
        });
      };
      $scope.deletePost = function (postId) {
        Food.remove({
          postId: postId,
          user_id: $rootScope.fbUserId,
          access_token: $rootScope.fbAccessToken
        }, function () {
          console.info('Post deleted');
          $scope.updatePostList();
        });
      };
      $scope.finishPost = function (postId) {
        var post = getItemById(postId);
        post.finished = !post.finished;
        var data = {
          user_id: $rootScope.fbUserId,
          access_token: $rootScope.fbAccessToken,
          id: postId,
          finished: post.finished,
          updatingFinished: true
        };
        Food.update(data, function () {
          console.info('Post finish toggled');
          $scope.updatePostList();
        });
      }
      $scope.updatePostList = function () {
        var MyPost = $resource('/myposts');
        var params = {
          user_id: $rootScope.fbUserId,
          access_token: $rootScope.fbAccessToken
        };
        MyPost.query(params, function (results) {
          $scope.myPosts = [];
          for (var i = 0; i < results.length; i++) {
            var post = angular.copy(results[i]);
            $scope.myPosts.push(post);
          }
        });
      };
      $scope.updateMyStats = function () {
        var MyStats = $resource('/mystats');
        var stats = MyStats.get({
          user_id: $rootScope.fbUserId,
          access_token: $rootScope.fbAccessToken
        }, function () {
          $scope.likes = stats.likes;
          $scope.dislikes = stats.dislikes;
          $rootScope.admin_status = stats.admin_status;
        });
      };

      /*$scope.myPosts = [
        {
          id: 1,
          title: 'My post 1223123',
          location: 'Main Walkway',
          description: 'Here is some foodasasdkjhasdkjhasdkjhasdkjh'
        },
        {
          id: 2,
          title: 'My post 2',
          location: 'Main Walkway',
          description: 'Here is some food'
        },
        {
          id: 3,
          title: 'My post 3',
          location: 'Main Walkway',
          description: 'Here is some food'
        },
        {
          id: 4,
          title: 'My post 4',
          location: 'Main Walkway',
          description: 'Here is some food'
        },
        {
          id: 5,
          title: 'My post 5',
          location: 'Main Walkway',
          description: 'Here is some food'
        }
      ];*/

      $($('.map')[0]).fadeTo(400, 0, function () {
        $($('.map')[0]).css({ display: 'none' });
      });

      $('.top-right').fadeTo(400, 1);
      $('.my-posts-header').fadeTo(400, 1);
      $('.my-posts-content').fadeTo(400, 1);
    }
  );
});