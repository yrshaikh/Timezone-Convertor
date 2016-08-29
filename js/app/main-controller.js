angular.module('timezoneApp').controller('mainController', [
    "$scope", "storageService", "searchService", function ($scope, storageService, searchService) {
    constructor  = function(){
        $scope.timeformat='ampm';
        storageService.get()
            .then(function(data){
                var previouslyAddedTimezones = data.timezone;
                $scope.selectedTimezones = [];
                var utcDate = moment().utc();
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
            newValue.Date = moment($scope.utc.Date).add('hours', newValue.Offset);
            newValue.Display = moment(newValue.Date).format('h:mm A');
            storageService.set(newValue);
            $scope.selectedTimezones.push(newValue);
            $scope.selected = null;
        }
    });
    $scope.remove = function(timezone) {
        $scope.selectedTimezones = _.reject($scope.selectedTimezones, function(item) {
            console.log(timezone.Id, item.Id);
            return item.Id === timezone.Id;
        });
        storageService.remove(timezone);
    }
    $scope.getTimeZone = function(searchTerm) {
        return searchService.dataSearch(searchTerm);
    }
    $scope.edit = function(timezone){
        timezone.edit = true;
    }

    constructor();
}]);