angular.module('timezoneApp').controller('mainController', [
    "$scope", "storageService", "searchService", function ($scope, storageService, searchService) {
    var timeFormat = 'MMMM Do YYYY, h:mm:ss a';
    constructor  = function(){
        $scope.timeformat='ampm';
        storageService.get()
            .then(function(data){
                var previouslyAddedTimezones = data.timezone;
                $scope.selectedTimezones = [];
                var utcDate = moment().utc().format(timeFormat);
                var utcDisplay = moment().utc().format('h:mm A');
                $scope.utc = { Id: "utc", Abbreviation: "UTC", Name: "Universal Time Coordinated", Offset: 0, Date: utcDate, Display:  utcDisplay};
                $scope.selectedTimezones.push($scope.utc);
                if(previouslyAddedTimezones){
                    _.each(previouslyAddedTimezones, function(item){
                        if(item.Id){
                            item.Date = moment().utc().add('hours', item.Offset).format(timeFormat);
                            item.Display = moment().utc().add('hours', item.Offset).format('h:mm A');
                            $scope.selectedTimezones.push(item);
                        }
                    });                    
                }
                $scope.selected = null;
            });
    },

    $scope.storage = storageService;
    $scope.$watch('storage.data', function() {
        $scope.timezoneList = $scope.storage.data;
    });
    $scope.$watch('timeformat', function() {
        timeFormatChanged();
    });
    $scope.$watch('selected', function(newValue, oldValue) {
        if(newValue && newValue["Abbreviation"]){
            newValue.Date = moment().utc().add('hours', newValue.Offset).format(timeFormat);
            newValue.Display = moment().utc().add('hours', newValue.Offset).format('h:mm A');
            storageService.set(newValue);
            $scope.selectedTimezones.push(newValue);
            $scope.selected = null;
        }
    });
    $scope.remove = function(timezone) {
        $scope.selectedTimezones = _.reject($scope.selectedTimezones, function(item) {            
            return item.Id === timezone.Id;
        });
        storageService.remove(timezone);
    }
    $scope.getTimeZone = function(searchTerm) {
        return searchService.dataSearch(searchTerm);
    }
    $scope.edit = function(timezone){
        _.each($scope.selectedTimezones, function(item){
            item.edit = false;
        });
        timezone.edit = true;
        timezone.editObject = {};
        timezone.editObject = {
            hour:  moment(timezone.Date, timeFormat).format('h'),
            minute:  moment(timezone.Date, timeFormat).format('mm'),
            a:  moment(timezone.Date, timeFormat).format('A')
        }
    }
    $scope.save = function(timezone){
        timezone.edit = false;
        timeChanged(timezone);         
    }
    constructor();

    var timeChanged = function(timezone){
        var hour = timezone.editObject.hour - moment(timezone.Date, timeFormat).format('h');
        var minute = timezone.editObject.minute - moment(timezone.Date, timeFormat).format('mm');
        var timeformat = timezone.editObject.a;

        var utcWithUpdatedHourAndMinutes = moment().utc().add('hours', hour).add('minutes', minute);
        if(moment(timezone.Date, timeFormat).format('A').toLocaleLowerCase() != timezone.editObject.a.toLocaleLowerCase()){
            utcWithUpdatedHourAndMinutes = utcWithUpdatedHourAndMinutes.add('hours', 12);
        }

        _.each($scope.selectedTimezones, function(item, index){
            item.Date = moment(utcWithUpdatedHourAndMinutes).add('hours', item.Offset).format(timeFormat);
            item.Display = moment(item.Date, timeFormat).format('h:mm A');
        })
        timeFormatChanged();
    };

    var timeFormatChanged = function(){
        if($scope.timeformat === 'ampm')
            var newTimeFormat = 'h:mm A';
        else
            var newTimeFormat = 'H:mm';

        _.each($scope.selectedTimezones, function(item, index){
            item.Display = moment(item.Date, timeFormat).format(newTimeFormat);
        })
    }
}]);