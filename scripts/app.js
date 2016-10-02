(function () {
	'use strict';

	angular.module('NarrowItDownApp', [])
    .service('MenuSearchService', MenuSearchService)
	  .controller('NarrowItDownController', NarrowItDownController)
    .directive('foundItems', foundItemsDirective)
    .constant('ApiBasePath', "https://davids-restaurant.herokuapp.com/");

  function foundItemsDirective() {
    var ddo = {
      templateUrl: 'templates/menu_items.html',
      scope: {
        items: '<',
        onRemove: '&'
      }
    };

    return ddo;
  } 
     
  
  NarrowItDownController.$inject = ['MenuSearchService'];
  function NarrowItDownController(MenuSearchService) {
    var menu = this;
    menu.found = [];
    menu.flag = false

    menu.logMenuItems = function (shortName) {
      console.log(shortName);
      if (shortName == undefined || shortName == "") {
        menu.flag = true
        menu.found = []
      } else {
        var promise = MenuSearchService.getMatchedMenuItems(shortName);

        promise.then(function (response) {
          menu.found = response;
          if (menu.found.length == 0) {
            menu.flag = true
          } else {
            menu.flag = false
          }
        })
        .catch(function (error) {
          console.log(error);
        })
      }
    };

    menu.removeItem = function (itemIndex) {
      console.log("'this' is: ", this);
      this.lastRemoved = "Last item removed was " + this.found[itemIndex].name;
      this.found.splice(itemIndex, 1);
    };
    
  }

  MenuSearchService.$inject = ['$http', 'ApiBasePath']
  function MenuSearchService($http, ApiBasePath) {
    var service = this;

    service.getMatchedMenuItems = function (searchTerm) {
      return $http({
        method: "GET",
        url: (ApiBasePath + "/menu_items.json")
      }).then(function (result) {
        var foundItems = [];

        var tmpArray = result.data.menu_items;
        var regxSearch = new RegExp(searchTerm); 

        for (var i = 0, len = tmpArray.length; i < len; i++) {
          if (regxSearch.test(tmpArray[i].description)) {
            foundItems.push(tmpArray[i]);
          }
        }

        return foundItems;
      });
    };

  }  

})();
