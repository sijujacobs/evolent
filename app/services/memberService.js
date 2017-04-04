'use strict';
console.log("evolent::memberFactory----------");

evoApp.factory('memberFactory', ['$http', function($http) {

    var urlBase = '/php/api/memberAPI.php';
    var memberFactory = {};

    memberFactory.getMembers = function () {
        return $http.get(urlBase+ '/?functionName=GET_MEMBERS');
    };

    memberFactory.getMember = function (id) {
        return $http.get(urlBase + '/?functionName=GET_MEMBER&memberId=' + id);
    };

    memberFactory.insertMember = function (member) {
        //console.log("memberFactory::insertMember:----");
        return $http.post(urlBase+ '/?functionName=INSERT_MEMBER', member);
    };

    memberFactory.updateMember = function (member) {
        return $http.put(urlBase + '/?functionName=UPDATE_MEMBER', member)
    };

    memberFactory.deleteMember = function (memberId) {
        console.log("memberFactory::deleteMember:----" + memberId);
        return $http.delete(urlBase + '/?functionName=VERIFY_MEMBER&memberId=' + memberId);
    };

    memberFactory.verifyMember = function (member) {
        console.log("mcm-Web::memberFactory---verifyMember--------");
        return $http.post(urlBase + '/?functionName=VERIFY_MEMBER', member);
    };

    return memberFactory;
}]);
