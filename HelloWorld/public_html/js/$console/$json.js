   //выполняет преобразование объекта в JSON
   const $json = new Object({	

      //функция преобразования JSON в объект
      from: function( json,f ){
         var object = angular.fromJson( json );
         for( let k in object ){
            if(  typeof( object[k] ) === 'string' ){
               if( object[k].startsWith('function') ){
                  object[k] = eval('(function(){return '+object[k]+'; })()')
               };
            };
         };
         return object;
      },

      //функция преобразования объекта в JSON
      to: function( object ){
         var p = {};
         for( let k in object ){
            p[k] = object[k].toString();
         };
         return angular.toJson( p );
      }
   });  
   
   
   
//   var p = {
//      xri: 'eckumoc@localhost' ,
//      notify: function( text ){
//         alert( text );
//      }
//   };
//   p.__proto__ = {
//      show: function( text ){
//         alert( text );
//      }
//   }
//   console.log(  $json.to( p )  );
//   console.log(  $json.pafromrse($json.to( p )).notify(1)  );
//   