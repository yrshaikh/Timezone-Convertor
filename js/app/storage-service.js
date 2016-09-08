angular.module('timezoneApp').service('storageService', function ($q) {
    var that = this;
    this.data = [];
    this.deferred = $q.defer();
    this.set = function(value) {
        this.get()
            .then(function(data){
                var timeZoneListToSet = [];
                if(_.isEmpty(data))
                    data = { timezoneData:{} };
                if(data.timezoneData.timezone && Array.isArray(data.timezoneData.timezone)){
                    timeZoneListToSet = data.timezoneData.timezone;
                }
                timeZoneListToSet.push(value);

                data.timezoneData.timezone = timeZoneListToSet;
                chrome.storage.local.set({ "timezoneData" : data.timezoneData }, function() {
                    that.deferred.resolve({});
                });
                return that.deferred.promise;
            });
        
    };

    this.setTimeFormat = function (value) {
        this.get()
            .then(function(data){
                if(_.isEmpty(data))
                    data = { timezoneData:{} };
                data.timezoneData.timeformat = value;
                chrome.storage.local.set({ "timezoneData" : data.timezoneData }, function() {
                    that.deferred.resolve({});
                });
                return that.deferred.promise;
            })
    };

    this.get = function() {
        chrome.storage.local.get( "timezoneData" , function(data) {
            that.deferred.resolve(data);
        });
        return this.deferred.promise;
    };

    this.remove = function(timezone){
        this.get()
            .then(function(data){
                if(data && data.timezoneData && data.timezoneData.timezone && Array.isArray(data.timezoneData.timezone)){
                    data.timezoneData.timezone = _.reject(data.timezoneData.timezone, function(item) {
                        return item.Id === timezone.Id;
                    });
                }
                chrome.storage.local.set({ "timezoneData" : data.timezoneData }, function() {
                    that.deferred.resolve({});
                });
                return that.deferred.promise;
            });
    };
});