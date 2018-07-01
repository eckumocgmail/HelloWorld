(function( window ){
   
   var p = {
      xri: 'eckumoc@localhost' ,
      notify: function( text ){
         alert( text );
      }
   };
   p.__proto__ = {
      show: function( text ){
         alert( text );
      }
   }
   console.log(  $json.to( p )  );
   console.log(  $json.pafromrse($json.to( p )).notify(1)  );
   
})( window ); 