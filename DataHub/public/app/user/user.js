/**
 * Created by dell on 2015/7/13.
 */
"use strict";
angular.module('myApp.user', ['ngRoute'])
    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider
            .when('/user', {
                templateUrl: 'user/user.html',
                controller: 'userCtrl'
            })

    }])
    .controller('userCtrl', ['$scope', '$http', '$rootScope','Paginator', function ($scope, $http, $rootScope, Paginator) {
        var p = $http(
            {
                method: 'GET',
                url: 'http://localhost:3000/users/getPersonalInfo',
                params: {id: $rootScope.current_user_neoid}
            }
        );
        p.success(function (data, status, headers, config) {
            $scope.user = {
                username: data.employee.name,
                address: data.employee.address,
                phone: data.employee.phone,
                email: data.employee.email

            };
        });
        p.error(function (data, status, headers, cpnfig) {
            alert("错误");
        });

        //
        //$scope.user = {
        //    username: $rootScope.current_user_name,
        //    phone: $rootScope.current_user_address,
        //    email: $rootScope.current_user_email,
        //    address: $rootScope.current_user_phone
        //};
        $scope.roles = $rootScope.current_user_role;
        $scope.modifyUser = function () {

            var config = {
                params: {
                    id: $rootScope.current_user_neoid,
                    username: $scope.user.username, phone: $scope.user.phone,
                    email: $scope.user.email,
                    address: $scope.user.address,
                    status: 'NORMAL'
                }
            };
            $http.get('http://localhost:3000/users/modifyUser', config).success(function (data, status, headers, config) {
                if (data.message == 'ok')
                    alert("修改成功");
                else
                    alert("修改失败");
            }).error(function (data, status, headers, cpnfig) {
                alert("修改失败");
            });

            alert($scope.user.username + $scope.user.address);

        };
        $scope.ShowMode = '';
        $scope.changeShow = function (ShowMode) {

            $scope.ShowMode = ShowMode;
            if (ShowMode == 'list')
                this.getAssignEnterprise();
        }
        $scope.getAssignEnterprise = function () {
            var config = {
                params: {
                    employeeId: $rootScope.current_user_neoid
                }
            };
            $http.get('http://localhost:3000/plateform_manager/getAssignEnter', config)
                .success(function (data) {
                    $scope.rows0 = data.data;
                })
                .error(function (data) {
                    alert("失败");
                });
        }
        //分页
        $scope.currentPage = 0;
        $scope.totalPage = 0;
        $scope.pageSize = 10;
        $scope.goToPage = 0;
        $scope.total = 0;
        $scope.p = {};
        $scope.test = {
            name: '',
            product: '',
            address: '',
            Status: ''
        }
        //载入
        $scope.load = function () {
            var config = {
                params: {
                    currentPage: $scope.currentPage,
                    name: $scope.test.name,
                    product: $scope.test.product,
                    address: $scope.test.address,
                    Status: $scope.test.Status
                }
            };
            $http.get('http://localhost:3000/plateform_manager/enterpriseselect', config)
                .success(function (data) {
                    $scope.rows = data.data;
                })
                .error(function (data) {
                    alert("失败");
                });
        };
        //下一页
        $scope.next = function () {
            $scope.currentPage = Paginator($scope.currentPage, $scope.totalPage, $scope.goToPage).next();
            $scope.load();
        };
        //上一页
        $scope.prev = function () {
            $scope.currentPage = Paginator($scope.currentPage, $scope.totalPage, $scope.goToPage).prev();
            $scope.load();
        };
        //首页
        $scope.first = function () {
            $scope.currentPage = Paginator($scope.currentPage, $scope.totalPage, $scope.goToPage).first();
            $scope.load();
        };
        //末页
        $scope.end = function () {
            $scope.currentPage = Paginator($scope.currentPage, $scope.totalPage, $scope.goToPage).end();
            $scope.load();
        };
        //转到第几页
        $scope.go = function () {
            if ($scope.p.goToPage <= 73) {
                $scope.currentPage = Paginator($scope.currentPage, $scope.totalPage, $scope.p.goToPage).go();
                $scope.load();
            }
            else
                alert("页数超过限制");
        };

        //查询
        $scope.select = function () {
            //alert($scope.test.name);
            $scope.currentPage = 1;
            var config = {
                params: {
                    currentPage: $scope.currentPage,
                    name: $scope.test.name,
                    product: $scope.test.product,
                    address: $scope.test.address,
                    Status: $scope.test.Status
                }
            };
            $http.get('http://localhost:3000/plateform_manager/enterpriseselect', config)
                .success(function (data) {
                    $scope.rows = data.data;
                    $scope.total = data.total;
                    $scope.totalPage = Math.ceil($scope.total / 10);
                    $scope.endPage = $scope.totalPage;
                })
                .error(function (data) {
                    alert("失败");
                });
        }
        //申请加入
        $scope.add = function (id) {
            //alert(id);
            $scope.status = 'WAITAPPROVE';
            var config = {
                params: {
                    employeeId: $rootScope.current_user_neoid,
                    enterpriseId: id,
                    status: $scope.status
                }
            };
            $http.get('http://localhost:3000/plateform_manager/addEmployeeApply', config)
                .success(function (data) {
                    alert("申请成功！");
                })
                .error(function (data) {
                    alert("失败");
                });
        }
    }])
