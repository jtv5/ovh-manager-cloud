angular.module('managerApp')
  .service('CloudProjectBillingAgoraService',
    class {
      /* @ngInject */
      constructor(
        OvhApiCloudProjectServiceInfos,
        OvhApiMeConsumption,
        OvhApiServiceRenewForecast,
      ) {
        this.OvhApiCloudProjectServiceInfos = OvhApiCloudProjectServiceInfos;
        this.OvhApiMeConsumption = OvhApiMeConsumption;
        this.OvhApiServiceRenewForecast = OvhApiServiceRenewForecast;
      }

      getProjectServiceInfos(serviceName) {
        return this.OvhApiCloudProjectServiceInfos.v6().get({ serviceName }).$promise;
      }

      getCurrentForecast(serviceId) {
        return this.OvhApiMeConsumption.Usage().Forecast().v6().get().$promise
          .then(forecast => _.find(forecast, { serviceId }));
      }

      getCurrentConsumption(serviceId) {
        return this.OvhApiMeConsumption.Usage().Current().v6().get().$promise
          .then(consumption => _.find(consumption, { serviceId }));
      }

      getBillForecast(serviceId) {
        return this.OvhApiServiceRenewForecast.v6()
          .get({ serviceId, includeOptions: true }).$promise;
      }

      static formatPrice(value, currencyCode) {
        return ({
          value,
          text: `${value} ${currencyCode}`,
        });
      }

      formatEmptyPrice(currencyCode) {
        return this.constructor.formatPrice(0, currencyCode);
      }
    });
