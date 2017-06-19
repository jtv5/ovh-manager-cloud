(() => {
    class MetricsTokenPreviewCtrl {
        constructor ($translate, $uibModalInstance, serviceName, tokenID, MetricService) {
            this.$translate = $translate;
            this.$uibModalInstance = $uibModalInstance;
            this.serviceName = serviceName;
            this.tokenID = tokenID;
            this.MetricService = MetricService;

            this.token = {};
            this.loading;
        }

        $onInit () {
            this.loading = true;
            this.MetricService.getToken(this.serviceName, this.tokenID)
                .then(data => this.token = data)
                .finally(() => this.loading = false);
        }

        close () {
            this.$uibModalInstance.dismiss();
        }

        displayDate (date) {
            return moment(date).format("LLL");
        }

        getTokenState (token) {
            if (token) {
                if (token.isRevoked) {
                    return this.$translate.instant("metrics_token_state_inactive");
                } else {
                    return this.$translate.instant("metrics_token_state_active");
                }
            }
        }
    }

    angular.module("managerApp").controller("MetricsTokenPreviewCtrl", MetricsTokenPreviewCtrl);
})();
