		Object.keys = function( target ){						 
			var keys = new Array();      
			for ( var property in target ){          
				keys.push(property);   
			}    
			return keys;  
		};
		
		Object.values = function( target ){	
			var values = new Array();      
			for ( var property in target ){          
				values.push( target[property] );   
			}    
			return values;  			
		}			
		
//		//объединяет 2 функции
//		app.constructor.prototype.merge = function ( f1, f2 ){
//			return function(){
//				f1(  );
//				f2(  );
//			}
//		}	
//		app.constructor.prototype.init = function(){
//				var _debug = console.debug;     console.debug = this.merge( _debug, this.info )
//				var _info  = console.info;      console.info = this.merge( _info, this.info )
//				var _warn  = console.warn;      console.warn = this.merge( _warn, this.warn )
//				var _error = console.error;     console.error = this.merge( _error, this.error )
//				this.getKeys( this ).each(function(item){
//					if ( Object.isFunction(this[item])  ){
//						this['_'+item] = this[item];
//						this[item] = this.merge( _info, this['_'+item] )
//					}
//				})
//		}