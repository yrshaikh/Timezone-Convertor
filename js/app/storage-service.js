angular.module('timezoneApp').service('storageService', function ($q) {
    var _this = this;
    this.data = [];
    this.findAll = function(callback) {
        chrome.storage.sync.get('todo', function(keys) {
            if (keys.todo != null) {
                _this.data = keys.todo;
                for (var i=0; i<_this.data.length; i++) {
                    _this.data[i]['id'] = i + 1;
                }
                console.log(_this.data);
                callback(_this.data);
            }
        });
    }
    this.sync = function() {
        chrome.storage.sync.set({'timezone': this.data}, function() {
            console.log('syn callback');
        });
    }
    this.add = function (item) {
        this.data.push(item);
        this.sync();
    }
    this.remove = function(item) {
        this.data.splice(this.data.indexOf(item), 1);
        this.sync();
    }
    this.removeAll = function() {
        this.data = [];
        this.sync();
    },
    this.set = function(value) {
        var key = 'timezone';
        this.get(key)
            .then(function(data){
                var finalData = [];
                console.log(data.length);
                if(data.length){
                    finalData = data;
                }
                else{
                    finalData.push(data);
                }
                finalData.push(value);
                var deferred = $q.defer();
                var data = {};
                data[key] = value;
                chrome.storage.local.set(data, function() {
                    deferred.resolve({});
                });
                return deferred.promise;
            });
        
    },
    this.get = function() {
        var key = 'timezone';
        var deferred = $q.defer();
        chrome.storage.local.get(key, function(data) {
            deferred.resolve(data);
        });
        return deferred.promise;
    }
});