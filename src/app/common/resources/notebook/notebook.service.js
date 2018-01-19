/* @ngInject */
function notebookService($resource, permissionService, entityTreeService, apiUrl) {
    return $resource(apiUrl + 'projects/:projectId/notebooks/:notebookId', {}, {
        query: {
            method: 'GET', isArray: true
        },
        get: {
            method: 'GET',
            transformResponse: function(data) {
                var project = angular.fromJson(data);
                project.accessList = _.sortBy(project.accessList, function(value) {
                    return value.user.id;
                });

                return project;
            }
        },
        save: {
            method: 'POST',
            transformRequest: transformRequest,
            interceptor: {
                response: function(response) {
                    entityTreeService.addNotebook(response.data);

                    return response.data;
                }
            }
        },
        update: {
            method: 'PUT',
            url: apiUrl + 'projects/:projectId/notebooks',
            transformRequest: transformRequest,
            interceptor: {
                response: function(response) {
                    entityTreeService.updateNotebook(response.data);

                    return response.data;
                }
            }
        },
        delete: {
            method: 'DELETE'
        },
        print: {
            method: 'GET',
            url: apiUrl + 'print/project/:projectId/notebook/:notebookId'
        },
        isNew: {
            method: 'GET',
            url: apiUrl + 'notebooks/new'
        }
    });

    function transformRequest(data) {
        var newData = angular.copy(data);
        newData.accessList = permissionService.expandPermission(newData.accessList);

        return angular.toJson(newData);
    }
}

module.exports = notebookService;
