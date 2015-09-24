define('MainCtrl', [
  'jquery',
  'app'
],
function ($, app) {
  // Create main controller and attach it to the angular app
  app.controller(
    'MainCtrl',
    function ($scope) {
      var getItemById = function (id) {
        var item = null;
        for (i in $scope.foodCollection) {
          var j = $scope.foodCollection[i];
          if (j.id == id) {
            item = j;
            break;
          }
        }
        return item;
      }
      $scope.showFoodDetail = function ($event, id) {
        $scope.currentItem = getItemById(id);
        $('#foodDetailModal').modal();
      };
      $scope.upvote = function ($event, itemId) {
        $event.stopImmediatePropagation();
        getItemById(itemId).vote = 'up';
      };
      $scope.downvote = function ($event, itemId) {
        $event.stopImmediatePropagation();
        getItemById(itemId).vote = 'down';
      };
      $scope.createPost = function () {
        $('#newPostModal').modal();
      };

      $scope.foodCollection = [
        {
          id: 1,
          title: 'Pizza',
          location: 'Main Walkway',
          letter: 'A',
          upvotes: '75%',
          downvotes: '25%',
          vote: 'up',
          post: "There's some free pizza on main walkway.\
                Diabetes Australia is raising awareness for type 2 diabetes...\
                Come get it while it's hot!",
          fromFacebook: true,
          pic: true
        },
        {
          id: 2,
          title: 'Cereal',
          location: 'Library lawn',
          letter: 'B',
          upvotes: '95%',
          downvotes: '5%',
          vote: 'down',
          post: "Get you're daily breakfast at the library lawn.\
                Wide variety of cereal to choose from"
        },
        {
          id: 3,
          title: 'CSESoc BBQ',
          location: 'Physics lawn',
          letter: 'C',
          upvotes: '40%',
          downvotes: '60%'
        },
        {
          id: 4,
          title: 'Pizza',
          location: 'Main Walkway',
          letter: 'D',
          upvotes: '40%',
          downvotes: '60%',
          vote: 'down'
        }
      ];
    }
  );

  return {
    show: function () {
      $('.left .item').hide();
      $('.left').fadeTo(400, 1);
      var items = $('.left .item');
      items.each(function (index, element) {
        $(element).slideDown(500);
      });
    }
  };
});