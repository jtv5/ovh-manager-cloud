class NashaCtrl {
    constructor ($q, $state, $stateParams, $translate, CloudMessage, OvhApiDedicatedNasha,
                 ovhDocUrl, REDIRECT_URLS, URLS) {
        this.$q = $q;
        this.$state = $state;
        this.$stateParams = $stateParams;
        this.$translate = $translate;
        this.CloudMessage = CloudMessage;
        this.OvhApiDedicatedNasha = OvhApiDedicatedNasha;
        this.ovhDocUrl = ovhDocUrl;
        this.REDIRECT_URLS = REDIRECT_URLS;
        this.URLS = URLS;

        this.loading = false;
        this.urlRenew = null;
        this.data = {};
        this.monitoring = {};
        this.guides = {};
        this.messages = [];
        this.stateName = "paas.nasha";
    }

    $onInit () {
        this.data = {
            information: null,
            nasha: null,
            bars: []
        };

        this.monitoring = {
            enabled: false,
            loading: false
        };

        this.initGuides();
        this.loadNasha();
        this.loadMessages();
    }

    loadNasha () {
        this.loading = true;
        this.$q.all({
            nasha: this.OvhApiDedicatedNasha.Aapi().get({ serviceName: this.$stateParams.nashaId }).$promise,
            nashaInfo: this.OvhApiDedicatedNasha.v6().getServiceInfos({ serviceName: this.$stateParams.nashaId }).$promise
        })
            .then(data => {
                this.data.nasha = data.nasha;

                _.forEach(this.data.nasha.use, (part, key) => part.name = this.$translate.instant("nasha_storage_usage_type_" + key));

                this.monitoring.enabled = data.nasha.monitored;
                this.data.information = data.nashaInfo;
                this.urlRenew = this.REDIRECT_URLS.renew
                    .replace("{serviceType}", "DEDICATED_NASHA")
                    .replace("{serviceName}", this.data.nasha.serviceName);

                if (this.data.information.status === "expired") {
                    this.CloudMessage.error(this.$translate.instant("nasha_expired"));
                }
            })
            .catch(() => this.CloudMessage.error(this.$translate.instant("nasha_dashboard_loading_error")))
            .finally(() => {
                this.loading = false;
            });
    }

    initGuides () {
        this.guides.title = this.$translate.instant("nasha_guide_title");
        this.guides.footer = {
            name: this.$translate.instant("nash_guide_footer"),
            url: this.URLS.guides.home.FR,
            external: true
        };
        this.guides.list = [];
        this.guides.list.push({
            name: this.$translate.instant("nash_guide_name"),
            url: this.ovhDocUrl.getDocUrl("cloud/storage/nas"),
            external: true
        });
    }

    updateMonitoringState (state) {
        if (!this.monitoring.loading) {
            this.monitoring.enabled = state;
            this.monitoring.loading = true;
            this.OvhApiDedicatedNasha.v6().updateDetail({
                serviceName: this.data.nasha.serviceName,
                customName: this.data.nasha.customName,
                monitored: state
            }).$promise
                .then(() => {
                    this.monitoring.loading = false;
                    this.CloudMessage.success(this.$translate.instant("nasha_dashboard_update_success_" + (state ? "enabled" : "disabled")));
                })
                .catch(error => {
                    this.monitoring.loading = false;
                    this.monitoring.enabled = !state;
                    this.CloudMessage.error(this.$translate.instant("nasha_dashboard_update_error") + " " + error.message);
                });
        }
    }

    loadMessages () {
        this.CloudMessage.unSubscribe(this.stateName);
        this.messageHandler = this.CloudMessage.subscribe(this.stateName, {
            onMessage: () => this.refreshMessage()
        });
    }

    refreshMessage () {
        this.messages = this.messageHandler.getMessages();
    }
}


angular.module("managerApp").controller("NashaCtrl", NashaCtrl);
