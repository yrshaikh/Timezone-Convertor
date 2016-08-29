angular.module('timezoneApp').controller('mainController', [
    "$scope", "storageService", "searchService", function ($scope, storageService, searchService) {
    constructor  = function(){
        $scope.timeformat='ampm';
        storageService.get()
            .then(function(data){
                var previouslyAddedTimezones = data.timezone;
                $scope.selectedTimezones = [];
                var utcDate = moment().utc().format('MMMM Do YYYY, h:mm:ss a');
                var utcDisplay = moment().utc().format('h:mm A');
                $scope.utc = { Id: "utc", Abbreviation: "UTC", Name: "Universal Time Coordinated", Offset: 0, Date: utcDate, Display:  utcDisplay};
                $scope.selectedTimezones.push($scope.utc);
                if(previouslyAddedTimezones){
                    _.each(previouslyAddedTimezones, function(item){
                        if(item.Id){
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
    $scope.$watch('selected', function(newValue, oldValue) {
        if(newValue && newValue["Abbreviation"]){
            newValue.Date = moment().utc().add('hours', newValue.Offset).format('MMMM Do YYYY, h:mm:ss a');
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
            hour:  moment(timezone.Date, 'MMMM Do YYYY, h:mm:ss a').format('h'),
            minute:  moment(timezone.Date, 'MMMM Do YYYY, h:mm:ss a').format('mm'),
            a:  moment(timezone.Date, 'MMMM Do YYYY, h:mm:ss a').format('A')
        }
    }
    $scope.save = function(timezone){
        timezone.edit = false;         
    }
    constructor();
}]);