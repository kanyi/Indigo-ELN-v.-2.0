(function() {
    angular
        .module('indigoeln')
        .directive('indigoComponents', indigoComponents);

    /* @ngInject */
    function indigoComponents($timeout) {
        var scrollCache = {};

        return {
            restrict: 'E',
            replace: true,
            scope: {
                template: '=',
                readonly: '=',
                model: '=',
                experiment: '=',
                experimentForm: '=',
                saveExperimentFn: '&'
            },
            link: link,
            templateUrl: 'scripts/components/entities/template/components/components-templete/components.html',
            bindToController: true,
            controllerAs: 'vm',
            controller: indigoComponentsController
        };

        /* @ngInject */
        function link(scope, element) {
            if (!scope.experiment) {
                return;
            }
            var id = scope.experiment.fullId;
            var tc;
            var preventFirstScroll;
            $timeout(function() {
                tc = element.find('.tab-content');
                if (scrollCache[id]) {
                    setTimeout(function() {
                        nostore = true;
                        tc[0].scrollTop = scrollCache[id];
                    }, 100);
                }
                var stimeout,
                    nostore;
                tc.on('scroll', function(e) {
                    // will close some dropdowns EPMLSOPELN-437
                    element.trigger('click');
                    if (nostore) {
                        nostore = false;

                        return;
                    }
                    if (!preventFirstScroll) {
                        scrollCache[id] = this.scrollTop;
                    } else {
                        nostore = true;
                        tc[0].scrollTop = scrollCache[id] || 0;
                    }
                    clearTimeout(stimeout);
                    stimeout = setTimeout(function() {
                        preventFirstScroll = true;
                    }, 300);
                    preventFirstScroll = false;
                    nostore = false;
                });
            }, 100);
        }

        /* @ngInject */
        function indigoComponentsController($scope, ProductBatchSummaryOperations) {
            var vm = this;

            init();

            function init() {
                vm.batches = null;
                vm.batchesTrigger = 0;
                vm.selectedBatch = null;
                vm.selectedBatchTrigger = 0;
                vm.reactants = null;
                vm.reactantsTrigger = 0;

                vm.onAddedBatch = onAddedBatch;
                vm.onSelectBatch = onSelectBatch;
                vm.onRemoveBatches = onRemoveBatches;

                bindEvents();
            }

            function updateModel() {
                vm.batches = _.get(vm.model, 'productBatchSummary.batches') || [];
                vm.compounds = _.get(vm.model, 'preferredCompoundSummary.compounds') || [];

                updateSelections();
            }

            function updateSelections() {
                if ((vm.batches.length && !vm.selectedBatch) || (vm.compounds.length && !vm.selectedCompound)) {
                    updateSelectedBatch();
                }
            }

            function bindEvents() {
                $scope.$watch('vm.model', updateModel);
            }

            function updateSelectedBatch() {
                var selectedBatch = vm.model && vm.model.productBatchDetails ?
                    _.find(vm.batches, {nbkBatch: _.get(vm.model, 'productBatchDetails.nbkBatch')}) :
                    _.first(vm.batches);

                onSelectBatch(selectedBatch || null);
            }

            function onRemoveBatches() {
                var length = vm.batches.length;

                ProductBatchSummaryOperations.deleteBatches(vm.batches);

                if (vm.batches.length - length) {
                    vm.experimentForm.$setDirty();
                    vm.batchesTrigger++;
                }

                if (vm.selectedBatch && !_.includes(vm.batches, vm.selectedBatch)) {
                    onSelectBatch(_.first(vm.batches));
                }
            }

            function onAddedBatch(batch) {
                // TODO: uncomment it when form requestNbkBatchNumberAndAddToTable will be removed push to batches
                // vm.batches.push(batch);
                vm.batchesTrigger++;
            }

            function onSelectBatch(batch) {
                vm.selectedBatch = batch;
                vm.selectedBatchTrigger++;
            }
        }
    }
})();
