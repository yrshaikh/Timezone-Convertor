angular.module('timezoneApp').service('storageService', function () {
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
        chrome.storage.sync.set({timeZone: this.data}, function() {
            console.log('Data is stored in Chrome storage');
        });
    }
    this.add = function (newtimezone) {
        var id = this.data.length + 1;
        var timeZone = {
            id: id,
            zone: newtimezone
        };
        this.data.push(timeZone);
        this.sync();
    }
    this.remove = function(timeZone) {
        this.data.splice(this.data.indexOf(timeZone), 1);
        this.sync();
    }
    this.removeAll = function() {
        this.data = [];
        this.sync();
    }
});