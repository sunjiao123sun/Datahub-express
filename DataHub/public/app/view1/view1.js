'use strict';

angular.module('myApp.view1', ['ngRoute'])


    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/view1', {
            templateUrl: 'view1/view1.html',
            controller: 'View1Ctrl'
        });
    }])

    .controller('View1Ctrl', ['$scope', '$http', '$location', function ($scope, $http, $location) {
        $scope.user = {username: current_user_name, password: '', phone: '', email: '', address: ''};
        $scope.register = function () {
            alert($scope.user.username + $scope.user.address + $scope.user.password + $scope.user.phone + $scope.user.email);
            var config = {
                params: {
                    username: $scope.user.username,
                    phone: $scope.user.phone,
                    email: $scope.user.email,
                    address: $scope.user.address,
                }
            };
            $http.get('http://localhost:3000/users/register', config).success(function (data, status, headers, config) {
                if (data.message == '注册成功') {
                    alert('注册成功');
                    $location.path('/view2');
                }
                else
                    alert('注册失败');
            }).error(function (data, status, headers, config) {
                alert("error");
            })
        };
    }]);