define('facebookService', [
  'app',
  'facebook'
],
function (app, FB) {
  app.factory(
    'facebookService',
    function ($rootScope, $location) {
      var facebookService = {};
      var prodId = '1633260020259993';
      var devId = '1648532882066040';
      var domains = ['freeats.info', 'freeats.herokuapp.com'];
      facebookService.init = function () {
        FB.init({
          appId: $location.host() in domains ? prodId : devId,
          version: 'v2.4'
        });
      };
      $rootScope.getFacebookLoginStatus = function (cb) {
        FB.getLoginStatus(function (res) {
          // Force angular to re-evaluate
          setTimeout(function () {
            $rootScope.$apply(function () {
              if (res.status == 'connected') {
                // Logged into Freeats and Facebook
                $rootScope.loggedIn = true;
                $rootScope.fbAccessToken = res.authResponse.accessToken;
                $rootScope.fbUserId = res.authResponse.userID;
              } else if (res.status == 'not_authorized') {
                // Not logged into Freeats, but is logged into Facebook
                $rootScope.loggedIn = false;
              } else {
                // Not logged into Freeats nor Facebook
              }
              if (typeof cb == 'function') cb();
            });
          });
        });
      };
      $rootScope.loginFacebook = function () {
        FB.getLoginStatus(function (res) {
          if (res.status == 'connected') {
            // Logged into Freeats and Facebook
            $rootScope.loggedIn = true;
            $rootScope.fbAccessToken = res.authResponse.accessToken;
            $rootScope.fbUserId = res.authResponse.userID;
          } else {
            // Not logged into Freeats nor Facebook
            FB.login(function (res) {
              setTimeout(function () {
                $rootScope.$apply(function () {
                  if (res.status == 'connected') {
                    $rootScope.loggedIn = true;
                    $rootScope.fbAccessToken = res.authResponse.accessToken;
                    $rootScope.fbUserId = res.authResponse.userID;
                  }
                });
              });
            });
          }
        });
      };
      $rootScope.logoutFacebook = function () {
        FB.getLoginStatus(function (res) {
          if (res.status == 'connected') {
            // Logged into Freeats and Facebook
            $rootScope.loggedIn = false;
            FB.logout(function (res) {
            });
          }
        });
      };
      return facebookService;
    }
  );
});