'use strict';

angular.module('groups').controller('ServicesGroupsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Groups', 'Services', 'Daemons',
    function ($scope, $stateParams, $location, Authentication, Groups, Services, Daemons) {
        $scope.authentication = Authentication;

        $scope.findOne = function () {
            $scope.group = Groups.get({
                groupId: $stateParams.groupId
            });

            $scope.services = {};
            $scope.services.all = Services.query();

            $scope.daemons = {};
            $scope.daemons.all = Daemons.query();
        };

        $scope.changeImage = function () {
            if ($scope.services.selectImage) {
                // Hostname
                var parameter = {};
                parameter.name = 'Hostname';
                parameter.value = $scope.group.title + '-' + $scope.services.select.title + '-' + $scope.daemons.select.name;
                // default external volume
                $scope.services.selectImage.parameters.push(parameter);
                $scope.services.selectImage.volumes.forEach(function (volume) {
                   volume.external = $scope.daemons.select.volume + '/' + $scope.group.title + '/' + $scope.services.select.title + '/' +  volume.internal;
                });
            }
        };

        $scope.addImageToGroup = function (daemon, image) {
            var group = $scope.group;
            var containerName = image.name.replace('/', '-');
            if (containerName.indexOf(':') > 1) {
                containerName = containerName.substring(0, image.name.indexOf(':'));
            }

            var parameters = [];
            image.parameters.forEach(function (parameter) {
                if (!_.isEmpty(parameter.name) && !_.isEmpty(parameter.value)) {
                    parameters.push(parameter);
                }
            });

            var variables = [];
            image.variables.forEach(function (variable) {
                if (_.isString(variable.name) && _.isString(variable.value) && !_.isEmpty(variable.name) && !_.isEmpty(variable.value)) {
                    variables.push(variable);
                }
            });

            var volumes = [];
            image.volumes.forEach(function (volume) {
                if (_.isString(volume.internal) && _.isString(volume.external) && !_.isEmpty(volume.internal) && !_.isEmpty(volume.external)) {
                    volumes.push(volume);
                }
            });

            var ports = [];
            image.ports.forEach(function (port) {
                if (_.isNumber(port.internal) && _.isNumber(port.external)) {
                    ports.push(port);
                }
            });

            group.containers.push({
                name: containerName,
                hostname: containerName,
                image: image.name,
                parameters: parameters,
                variables: variables,
                ports: ports,
                volumes: volumes,
                daemonId: daemon._id,
                active: true
            });

            group.$update(function () {
                $location.path('groups/' + group._id);
            }, function (errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };
    }
]);
