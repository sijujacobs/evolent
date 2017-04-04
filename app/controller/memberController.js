'use strict';

evoApp.controller('memberController', ['$scope', 'memberFactory', function ($scope, memberFactory) {

console.log("evolent::memberControllerJS-----------");
    $scope.members;
    $scope.selectedMember;
    $scope.loggedMember = {};
    $scope.email;
    $scope.password;
    $scope.token;
    $scope.selectedRowIndex;
    $scope.isMemberViewVisible = false;
    $scope.isConfirmationModalVisible = false;
    $scope.isButtonDisabled = true;
        

    
    $scope.init= function(){
        getMembers();
    }

    function getMembers() {
        memberFactory.getMembers()
            .then(function (response) {
                $scope.members = response.data;
            }, function (error) {
                $scope.status = 'Unable to load member data: ' + error.message;
            });
    }

    $scope.clearMember = function () {
        $scope.selectedMember = {};
    }

    $scope.saveMember = function (member) {
        if(validMemberData(member)){
            if(member.memberId > 0){
                $scope.updateMember(member);
            }else{
                console.log("memberController::saveMember:----" + member.firstName);
                $scope.insertMember(member);
            }
        }else{
            alert("Please enter valid data...");
        }
    }

    $scope.insertMember = function (member) {
        console.log("memberController::insertMember:----" + member.firstName);
        memberFactory.insertMember(member)
        .then(function (response) {
            $scope.status = 'Inserted member! Refreshing member list.';
            $scope.members.push(member);
            $scope.closeModal();
        }, function(error) {
            $scope.status = 'Unable to insert member: ' + error.message;
        });
    };

    $scope.updateMember = function (member) {
        console.log("memberController::updateMember:----");
         memberFactory.updateMember(member)
          .then(function (response) {
                console.log("memberController::updateMember response : " + response);
              $scope.status = 'Updated member! Refreshing member list.';
              $scope.closeModal();
          }, function (error) {
              $scope.status = 'Unable to update member: ' + error.message;
          });
    };

    $scope.insertButtonClicked = function(){
        $scope.selectedMember = {};
        $scope.showMemberViewModal($scope.selectedMember);
    }

    $scope.editButtonClicked = function(){
        if($scope.selectedMember && $scope.selectedMember.memberId > 0){
            $scope.showMemberViewModal($scope.selectedMember);
        }
    }
    
    $scope.deleteButtonClicked = function(){
        if($scope.selectedMember && $scope.selectedMember.memberId  > 0){
            console.log("memberController: deleteButtonClicked--- " +  $scope.selectedMember.firstName);
        
            $scope.showConfirmationModal($scope.selectedMember);
        }
    }

    $scope.deleteMember = function (memberId) {
        console.log("memberController::deleteMember:----" + memberId);
         
        memberFactory.deleteMember(memberId)
        .then(function (response) {
            $scope.status = 'Deleted member! Refreshing member list.';
            
        }, function (error) {
            $scope.status = 'Unable to delete member: ' + error.message;
        });
    };


    $scope.verifyMember = function (email, password) {
        $scope.loggedMember.functionName = "VERIFY_MEMBER";
        $scope.loggedMember.email = email;
        $scope.loggedMember.password = password;

        memberFactory.verifyMember($scope.loggedMember)
        .then(function (response) {
            $scope.token = response.data[1].token;
            if(response.data[0].email == $scope.loggedMember.email){
                $scope.closeModal();
                $scope.isButtonDisabled = false;
                console.log(" $scope.token : " + $scope.token );
            }    
        }, function(error) {
            $scope.status = 'Unable to verify member: ' + error.message;
        });
    };



    $scope.memberSingleClick = function(sMember, sIndex){
        //console.log("memberController: memberSingleClick--- " +  sMember.firstName + ", index : " + sIndex);
        $scope.selectedRowIndex = sIndex;
        $scope.selectedMember = sMember;
        console.log("memberController: memberSingleClick-fff-- " +  $scope.selectedMember.firstName );
        
    }

     $scope.showMemberLoginModal = function( ) {
        $scope.showLoginModal = true;
         console.log("memberController: showMemberLoginModal : " + $scope.showLoginModal);
    };

    $scope.showMemberViewModal = function(member) {
        $scope.selectedMember = member ? member:$scope.clearMember();
        $scope.isMemberViewVisible = true;
        console.log("showMemberViewModal: showMemberViewModal : isMemberViewVisible " + $scope.isMemberViewVisible);
    };

    $scope.showConfirmationModal = function(member) {
        $scope.isConfirmationModalVisible = true;
        console.log("memberController: showConfirmationModal--- " +  $scope.selectedMember.firstName);
        
    };

    $scope.closeModal = function(index){
        $scope.isMemberViewVisible = false;
        $scope.isConfirmationModalVisible = false; 
        $scope.showLoginModal = false;
    }

    
    $scope.$watch('isMemberViewVisible', function(){
        //console.log("memberController::watch:----showMemberViewModal : " + $scope.isMemberViewVisible);
    });


    function validMemberData(member){
        return member.firstName != "" && member.lastName != "";    
    }
}]);


evoApp.directive("selectedMember", [function () {
    return{
        restrict: 'A',
        scope:{
            smember: "=",
            directiveFunction:'&'
        },
        link:function (scope, elem, attrs) {
            elem.bind('click', function(){
                scope.directiveFunction();
               console.log("scope.smember---" + scope.smember.firstName) ;
            });
            elem.bind('mouseenter', function(){
                elem.css('background-color', '#EEE');
                elem.css('color', '#000');
            });
            elem.bind('mouseleave', function(){
                elem.css('background-color', '#fff');
                elem.css('color', '#000');
            });
        }
    }
}]);

evoApp.directive('memberViewModal', function() {
    return {
      restrict: 'E',
      replace: true, // Replace with the template below
      transclude: true, // we want to insert custom content inside the directive
      link: function(scope, element, attrs) {
         console.log("--EVO-----memberViewModal---inside Member view Modal");
        scope.dialogStyle = {};
        if (attrs.width)
          scope.dialogStyle.width = attrs.width;
        if (attrs.height)
          scope.dialogStyle.height = attrs.height;
      },
      templateUrl: '../../evolent/app/views/templates/memberView.html'
    };
});

evoApp.directive('confirmationModal', function() {
    return {
      restrict: 'E',
      replace: true, // Replace with the template below
      transclude: true, // we want to insert custom content inside the directive
      link: function(scope, element, attrs) {
          console.log("-------confirmationModal");
        scope.dialogStyle = {};
        if (attrs.width)
          scope.dialogStyle.width = attrs.width;
        if (attrs.height)
          scope.dialogStyle.height = attrs.height;
      },
      templateUrl: '/app/views/templates/confirmationDialog.html'
    };
});


evoApp.directive('ngConfirmClick', [function(){

    //  priority and terminal   : if same element has multiple directives
    //  priority :1             : Execute according to priority level
    //  terminal:true           : if set to false, Skip all other directives comes after this
    //  replace: true           : Replace with the template below
    //  transclude: true        : we want to insert custom content inside the directive
    return {
        priority: 1,
        terminal: true,
        restrict: 'A',
        link: function (scope, element, attr) {
            var msg = attr.ngConfirmClick || "Are you sure?";
            var clickAction = attr.ngClick;
            element.bind('click',function (event) {
                if ( window.confirm(msg) ) {
                    scope.$eval(clickAction)
                }
            });
        }
    };
}]);

  evoApp.directive('loginModal', function() {
    return {
      restrict: 'E',
      replace: true, // Replace with the template below
      transclude: true, // we want to insert custom content inside the directive
      link: function(scope, element, attrs) {
        scope.dialogStyle = {};
        if (attrs.width)
          scope.dialogStyle.width = attrs.width;
          //console.log("attrs.width: " + attrs.width);
        if (attrs.height)
          scope.dialogStyle.height = attrs.height;
      },
      template: '<div id="memberLoginModal" class="modalWindow" ng-show="showLoginModal">'
                +'<div class="modalContent">'
                +'<div class="modalHeader">'
                +'  <span class="closeButton" ng-click="closeModal()">&times;</span>'
                +'  <span>Sign In </span>'
                +'</div>'
                +'<div class="modalBody">'
                +'  <form>'
                +'    <div class="formRow">'
                +'      <label class="formLabel" for="fname">Usename</label>'
                +'      <input class="formField" type="text" id="fname" ng-model="email">'
                +'    </div>'
                +'    <div class="formRow">'
                +'      <label class="formLabel" for="lname">Password</label>'
                +'      <input class="formField" type="password" id="lname"  ng-model="password">'
                +'    </div>'
                +' <input class="formButton" type="submit" value="Log in" ng-click="verifyMember(email, password)">'
                +' <input class="formButton" value="Cancel" ng-click="closeModal()">'
                +'  </form>'
                +'</div>'
                +'</div>'
                +'</div>'
    };
  });
