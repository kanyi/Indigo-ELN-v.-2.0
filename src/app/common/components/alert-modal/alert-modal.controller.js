AlertModalController.$inject = ['$uibModalInstance', 'title', 'message', 'okText', 'noText', 'cancelVisible',
    'okCallback', 'noCallback'];

function AlertModalController($uibModalInstance, title, message, okText, noText, cancelVisible, okCallback,
                              noCallback) {
    var vm = this;

    $onInit();

    function $onInit() {
        vm.cancelVisible = cancelVisible;
        vm.okText = okText || 'Ok';
        vm.noText = noText || 'No';
        vm.title = title;
        vm.message = message;
        vm.hasOkCallback = !!okCallback;
        vm.hasNoCallback = !!noCallback;

        vm.cancel = cancel;
        vm.ok = ok;
        vm.no = no;
    }

    function cancel() {
        $uibModalInstance.dismiss('cancel');
        if (noCallback) {
            noCallback();
        }
    }

    function ok() {
        $uibModalInstance.close();
        if (okCallback) {
            okCallback();
        }
    }

    function no() {
        $uibModalInstance.dismiss('cancel');
        if (noCallback) {
            noCallback();
        }
    }
}

module.exports = AlertModalController;
