class LogsHomeCappedModalCtrl {
  constructor($scope, $state, $stateParams, ControllerHelper) {
    this.$scope = $scope;
    this.$state = $state;
    this.serviceName = $stateParams.serviceName;
    this.ControllerHelper = ControllerHelper;
    this.openModal();
  }

  openModal() {
    this.ControllerHelper.modal.showModal({
      modalConfig: {
        templateUrl: 'app/dbaas/logs/detail/home/capped/logs-home-capped.html',
        controller: 'LogsHomeCappedCtrl',
        controllerAs: 'ctrl',
        backdrop: 'static',
      },
    })
      .then(() => {
        this.$scope.$parent.$parent.$parent.$$prevSibling.ctrl.runLoaders();
        this.$scope.$parent.ctrl.runLoaders();
      })
      .finally(() => this.onCloseModal());
  }

  onCloseModal() {
    this.$state.go('dbaas.logs.detail.home', {
      serviceName: this.serviceName,
    });
  }
}

angular.module('managerApp').controller('LogsHomeCappedModalCtrl', LogsHomeCappedModalCtrl);
