/**
 <console></console>

 <div>
   <div ng-repeat="message in messages"> {{ message }} </div>
 </div>
 */
(function( angular ){
   
   angular.module( $('*[ng-app]').attr('ng-app'),[] ).component('$console',{
      template: 
         '<div> console <div ng-repeat="message in messages"> {{ message }} </div></div>',  
 
      controller: function( $scope,$element,$attrs,$compile ){

         const ctrl = angular.extend( this, {
               $onInit: function(){
                  $scope.messages = [1];

                  
   
               },
               $postLink: function(){
                  
                  const link = $compile( $scope );
                  link( $scope );
                  
                  $scope.println = function( message ){
                     const text = new Date().toLocaleTimeString() + '  ' + message;
                     $scope.messages.push( text );
                     link( $scope );
                  };  
                  $scope.$apply(function(){ $scope.println(1); });
                  
               }
         });
      }
   });
   
   
})( window.angular ); 