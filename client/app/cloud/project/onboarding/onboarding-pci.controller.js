class pciSlideshowCtrl {
  constructor($scope, $state, $stateParams, $uibModalInstance, $window, atInternet, ovhUserPref) {
    this.$state = $state;
    this.$scope = $scope;
    this.$uibModalInstance = $uibModalInstance;
    this.$window = $window;
    this.atInternet = atInternet;
    this.projectId = $stateParams.projectId;
    this.ovhUserPref = ovhUserPref;
  }

  $onInit() {
    this.$scope.$on('$locationChangeStart', (event) => {
      event.preventDefault();
    });
  }

  dismiss(discover) {
    if (discover) {
      this.atInternet.trackClick({
        name: 'notification_new_menu_pci_5',
        type: 'action',
      });
    }
    this.$uibModalInstance.close();
    this.$state.go('iaas.pci-project.compute.infrastructure.diagram', {
      projectId: this.projectId,
    });
    this.ovhUserPref.assign('SHOW_PCI_ONBOARDING', { value: false });
  }
}

angular.module('managerApp').controller('pciSlideshowCtrl', pciSlideshowCtrl);
