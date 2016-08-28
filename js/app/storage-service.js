angular.module('timezoneApp').service('storageService', function ($q) {
    var _this = this;
    this.data = [];
    this.key = "timezoneList";
    this.deferred = $q.defer();
    this.findAll = function(callback) {
        chrome.storage.sync.get('todo', function(keys) {
            if (keys.todo != null) {
                _this.data = keys.todo;
                for (var i=0; i<_this.data.length; i++) {
                    _this.data[i]['id'] = i + 1;
                }
                console.log("findall", _this.data);
                callback(_this.data);
            }
        });
    }
    this.sync = function() {
        chrome.storage.sync.set({'timezoneList': this.data}, function() {
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
        this.get(this.key)
            .then(function(data){
                data = data.timezoneList;
                var finalData = [];
                console.log(data.length);
                if(data.length){
                    finalData = data;
                }
                else{
                    finalData.push(data);
                }
                finalData.push(value);
                var data = {};
                data[_this.key] = finalData;
                console.log("set", data);
                chrome.storage.local.set(data, function() {
                    _this.deferred.resolve({});
                });
                return _this.deferred.promise;
            });
        
    },
    this.get = function(key) {
        chrome.storage.local.get(key, function(data) {
            console.log("get",data);
            _this.deferred.resolve(data);
        });
        return this.deferred.promise;
    }
});