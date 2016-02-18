/**
 * Created by Stepan_Litvinov on 2/8/2016.
 */
'use strict';

angular.module('indigoeln')
    .constant('Components', [
        {name: 'Concept Details', id: "concept-details", tab: 'Concept', desc: "Fake description"},
        {name: 'Reaction Details', id: "reaction-details", tab: 'Experiments', desc: "Fake description"},
        {name: 'Product Batch Details', id: "product-batch-details", tab: 'Batches', desc: "Fake description"},
        {name: 'Reaction Scheme', id: "reaction-scheme", tab: 'Experiments', desc: "Fake description"},
        {name: 'Batch Structure', id: "batch-structure", tab: 'Batches', desc: "Fake description"}
    ])
    .directive('myComponent', function () {
        return {
            restrict: 'A',
            replace: true,
            scope: {
                myModel: '=',
                myExperiment: '=',
                myExperimentForm: '='
            },
            link: function (scope, iElement, iAttrs, controller) {
                scope.myComponent = iAttrs.myComponent;
                scope.model = scope.myModel; //for capability
                scope.experimentForm = scope.myExperimentForm; //for capability
                scope.experiment = _.extend({}, scope.myExperiment); //for readonly
            },
            template: '<div ng-switch="myComponent">' +
            '<div ng-switch-when="concept-details"><concept-details /></div>' +
            '<div ng-switch-when="reaction-details"><reaction-details /></div>' +
            '<div ng-switch-when="product-batch-details"><product-batch-details /></div>' +
            '<div ng-switch-when="product-batch-summary"><product-batch-summary /></div>' +
            '<div ng-switch-when="reaction-scheme"><reaction-scheme /></div>' +
            '<div ng-switch-when="batch-structure"><batch-structure /></div>' +
            '</div>'
        }
    }).directive('myComponents', function () {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            myTemplate: '=',
            myDisabled: '=',
            myModel: '=',
            myExperiment: '=',
            myExperimentForm: '='
        },
        template: '<fieldset ng-disabled="myDisabled"><uib-tabset justified="true">' +
        '<uib-tab heading="{{tab.name}}" ng-repeat="tab in myTemplate track by tab.name">' +
        '<div ng-repeat="component in tab.components" my-component={{component.id}} my-model="myModel" my-experiment="myExperiment" my-experiment-form="myExperimentForm"></div>' +
        '</uib-tab>' +
        '</uib-tabset></fieldset>'
    }
});