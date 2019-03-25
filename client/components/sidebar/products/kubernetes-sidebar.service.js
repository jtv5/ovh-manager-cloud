class KubernetesSidebar {
  constructor($translate, OvhApiMe, SidebarMenu, URLS) {
    this.$translate = $translate;
    this.User = OvhApiMe;
    this.SidebarMenu = SidebarMenu;
    this.URLS = URLS;

    this.type = 'KUBE';
    this.locale = null;
    this.User.v6().get().$promise
      .then((user) => {
        this.locale = user.ovhSubsidiary;
      });
  }

  addOrder(locale) {
    const orderParams = [{
      productId: 'cloud',
      planCode: 'project.2018',
      configuration: [{
        label: 'description',
        values: ['Kubernetes project'],
      }],
    }, {
      productId: 'kubernetes',
      planCode: 'kubernetes-managed-cluster',
      configuration: [{
        label: 'name',
        values: ['Kubernetes cluster+'],
      }],
    }];

    const orderUrl = `${_.get(this.URLS, `website_order.express_review_base.${locale}`)}?products=${JSURL.stringify(orderParams)}`;

    return {
      id: 'order-kube',
      title: this.$translate.instant('cloud_sidebar_actions_menu_kube'),
      icon: 'ovh-font ovh-font-kubernetes',
      href: orderUrl,
      target: '_blank',
      external: true,
    };
  }

  loadIntoSection(section, services) {
    _.forEach(services, (service) => {
      const menuItem = this.SidebarMenu.addMenuItem({
        id: service.serviceName,
        title: service.displayName || service.serviceName,
        icon: 'ovh-font ovh-font-cloud-public2',
        allowSubItems: false,
        state: 'kube.service',
        stateParams: {
          serviceName: service.serviceName,
        },
        loadOnState: 'kube',
        loadOnStateParams: {
          serviceName: service.serviceName,
        },
      }, section);
      this.addSearchKeys(menuItem);
    });
  }

  addSearchKeys(menuItem) {
    menuItem.addSearchKey('Kubernetes');
    menuItem.addSearchKey('KUBE');
    menuItem.addSearchKey(this.$translate.instant('cloud_sidebar_actions_menu_paas_kube'));
  }
}

angular.module('managerApp')
  .run(($rootScope, SidebarMenu) => {
    $rootScope.$on('sidebar.kubernetes.name.update', (event, { serviceName, title }) => {
      const { parentId } = SidebarMenu.getItemById(serviceName);
      SidebarMenu.updateItemDisplay({
        title,
      }, serviceName, parentId);
    });
  })
  .service('KubernetesSidebar', KubernetesSidebar);
