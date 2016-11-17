'use strict';

angular.module('myApp.view2', ['ngRoute']).run(['$rootScope', function ($rootScope) {
    $rootScope.authenticated = false;
    $rootScope.current_user_name = '';
    $rootScope.current_user_address = '';
    $rootScope.current_user_email = '';
    $rootScope.current_user_phone = '';
    $rootScope.current_enterpriseId = '';
}])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/view2', {
            templateUrl: 'view2/view2.html',
            controller: 'View2Ctrl'
        })
    }])

    .controller('View2Ctrl', ['$scope', '$http', '$location', '$rootScope', function ($scope, $http, $location, $rootScope) {
        $scope.user = {email: '', password: ''};

        $scope.response = {
            message: '',
            employee: {
                name: '',
                address: '',
                phone: '',
                email: '',
                status: '',
                createTime: '',
                lastModifyTime: ''
            }
        };
        $scope.login = function () {
            var config = {
                params: {
                    userid: $scope.user.username,
                    password: $scope.user.password
                }
            };
            $http.get('http://localhost:3000/login/checkUser', config)
                .success(function (data) {
                    if (data.result === 'flase') {//若返回结果为失败
                        //alert('验证成功');
                        $rootScope.authenticated = true;
                        $http.get('http://localhost:3000/login/login', {params: {userid: $scope.user.username}})
                            .success(function (data) {
                                if (data.result === 'success') {
                                    var ro = [{row: ''}, {row: ''}, {row: ''}];
                                    //alert("data.role.total" + data.role.length);
                                    for (var i = 0; i < data.role.length; i++) {
                                        if (data.role[i].rolename == 'USER' || data.role[i].rolename == 'ENTERPRISEUSER') {
                                            //员工用户
                                            //alert("进入员工用户");
                                            ro[0].row = 'user';
                                            break;
                                        }
                                    }
                                    for (var i = 0; i < data.role.length; i++) {
                                        if (data.role[i].rolename == 'SUPER' || data.role[i].rolename == 'ADMIN') {
                                            //平台管理员
                                            //alert("进入平台管理员");
                                            ro[1].row = 'plateform';
                                            break;
                                        }
                                    }
                                    for (var i = 0; i < data.role.length; i++) {
                                        if (data.role[i].rolename == 'ENTERPRISEADMIN') {
                                            //企业管理员
                                            //alert("进入企业管理员");
                                            ro[2].row = 'enterpriseManager';
                                            break;
                                        }
                                    }
                                    //if (data.role.rolename == 'USER' ||data.role.rolename == 'ENTERPRISEUSER'){
                                    //    //员工用户
                                    //    alert("进入员工用户");
                                    //    ro[0].row= '员工';
                                    //}
                                    //if (data.role.rolename == 'SUPER' ||data.role.rolename == 'ADMIN') {
                                    //    //平台管理员
                                    //    alert("进入平台管理员");
                                    //    ro[1].row = '平台管理员';
                                    //}
                                    //if (data.role.rolename == 'ENTERPRISEADMIN') {
                                    //    //企业管理员
                                    //    alert("进入企业管理员");
                                    //    ro[2].row = '企业管理员';
                                    //}
                                    //alert(ro[0].row);
                                    //alert(ro[1].row);
                                    //alert(ro[2].row);
                                    $rootScope.current_user_role = ro;
                                    $rootScope.current_user_neoid = data.neoid;
                                    $http.get('http://localhost:3000/enterprise_manager/EnterID', {params: {username: $rootScope.current_user_neoid}})
                                        .success(function (data) {
                                            $rootScope.current_enterpriseId = data.enterprise.id;
                                        })
                                        .error(function (data) {
                                            alert('查询企业id失败');
                                        });
                                    $http.get('http://localhost:3000/enterprise_manager', {params: {id: $rootScope.current_user_neoid}})
                                        .success(function (data) {
                                            $rootScope.current_user_name = data.employee.name;
                                            $rootScope.current_user_email = data.employee.email;
                                            $rootScope.current_user_address = data.employee.address;
                                            $rootScope.current_user_phone = data.employee.phone;
                                        })
                                        .error(function (data) {
                                            alert('查询企业id失败');
                                        });

                                    if (ro[0].row === 'user') {
                                        $location.path('/user').replace();
                                    } else if (ro[1].row === 'plateform') {
                                        $location.path('/plateform').replace();
                                    } else if (ro[2].row === 'enterpriseManager') {
                                        $location.path('/enterpriseManager').replace();
                                    }
                                    //$location.path('/user').replace();
                                }
                            }
                        ).error(function (data, status, headers, config) {
                                //  alert('error');
                            })
                    }
                })
                .error(function (data) {
                    alert("用户名或密码错误");
                });
            //  alert($scope.user.email+$scope.user.password);
        };
        //  $http.get('http://localhost:3000/users/login?id=3',user).success(function(data){
        //
        //  })
        //}

    }]);