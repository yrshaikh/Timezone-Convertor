angular.module('timezoneApp').service('storageService', function ($q) {
    var that = this;
    this.data = [];
    this.deferred = $q.defer();
    this.set = function(value) {
        this.get()
            .then(function(data){
                var timeZoneListToSet = [];
                if(data && data.timezone && Array.isArray(data.timezone)){
                    timeZoneListToSet = data.timezone;
                }
                timeZoneListToSet.push(value);
                chrome.storage.local.set({ "timezone" : timeZoneListToSet }, function() {
                    that.deferred.resolve({});
                });
                return that.deferred.promise;
            });
        
    },
    this.get = function() {
        chrome.storage.local.get("timezone", function(data) {
            that.deferred.resolve(data);
        });
        return this.deferred.promise;
    },
    this.remove = function(timezone){
        this.get()
            .then(function(data){
                if(data && data.timezone && Array.isArray(data.timezone)){
                    data.timezone = _.reject(data.timezone, function(item) {            
                        return item.Id === timezone.Id;
                    });
                }
                chrome.storage.local.set({ "timezone" : data.timezone }, function() {
                    that.deferred.resolve({});
                });
                return that.deferred.promise;
            });
    }
});