import template from './cloud-project-billing-vouchers.html';

angular.module('managerApp').config(($stateProvider) => {
  $stateProvider.state('iaas.pci-project.billing.vouchers', {
    url: '/vouchers',
    resolve: {
      isProjectUsingAgora: ($transition$, OvhApiCloudProject) => OvhApiCloudProject
        .v6().get({ serviceName: $transition$.params().projectId }).$promise
        .then(({ planCode }) => planCode !== 'project.legacy'),
    },
    redirectTo: transition => transition.injector().getAsync('isProjectUsingAgora')
      .then(isProjectUsingAgora => (isProjectUsingAgora ? 'iaas.pci-project.billing.vouchers.agora' : 'iaas.pci-project.billing.vouchers.legacy')),
    views: {
      cloudProjectBilling: {
        template,
      },
    },
    translations: {
      value: ['.'],
      format: 'json',
    },
  });
});
