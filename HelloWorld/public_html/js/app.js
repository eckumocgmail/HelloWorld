		app = {
				class:		'Application',
				toString: function(){  return '[object ' + this.class + ']';  },
				constructor: function(){  return this;	},
				
				instance: null,
				getInstance: function(){
						if ( app.instance == null ){
							app.instance = new app.constructor();
						}
						return app.instance;
				},

				
				JSONConverter: {	//выполняет преобразование объекта в JSON
						class: 'JSONConverter',

						//функция преобразования JSON в объект
						parse: function( json ){
									 var object = JSON.parse( json );
									 return object;
						},

						//функция преобразования объекта в JSON
						convert: function( object ){
										return JSON.stringify( object );
						}
				},				
				HTMLBuilder: {
								bindEvent:  function ( node, message, js ){
										
										node[message] = function( event ){ 
											with ( node ){
												return eval( js );
											}
										}
 
										node.addEventListener( message, function( event ){ 
											with ( node ){
												return eval( js );
											}
										} );
								},
					
								//функция создания HTMLElement'а
								createElement:  function createElement( tag, attributes, html, classes, style, events ){
										var e = document.createElement( tag );
										if ( attributes != null ){
												for ( var property in attributes ){
														e.setAttribute( property, attributes[ property ] );
												};
										};
										if ( style != null ){
												Object.assign( e.style, style );
										}
										if ( classes != null ){
												this.setClassNames( e, classes );
										}
										
										if ( events != null ){
												var keys = Object.keys(events);
												
												for ( var i=0; i<keys.length; i++ ){
													var event = keys[ i ];
													var js = events[ event ];
													var message = 'on' + event;
													
													app.HTMLBuilder.bindEvent( e, message, js );
												}
										}
										e.innerHTML = html;
										return e;
								},  

								//функция получения классов HTMLElement'а
								getClassNames: function ( node ){
										if ( node instanceof HTMLElement ){
												if ( typeof(node['className']) == 'undefined' ){
													node['className'] = '';
												}
												return app.constructor.StringUtils.split(  node['className'], ' '  );
										} else {
											throw new app.constructor.ParametersException( this,
															 'function getClassNames( ... ) arguments in wrong type' );
										}
								},

								//функция установка классов
								setClassNames: function ( node, classes ){
										var text = app.constructor.StringUtils.build( classes, ' ' );
										console.info( text );
										node.className = text;						
								},   
								
								//функция отчистки HTMLElement'а
								clear: function ( node ){
                              
										while ( node.childNodes.length > 0 ){
												node.removeChild( node.childNodes[ node.childNodes.length-1 ] );
										}
								},
												
								//функция преобразования объекта в HTMLElement
								getHTMLElement: function ( object ){
										return app.HTMLBuilder.createElement(   object.tag,
                                                                                                                        object.attr,
                                                                                                                        object.content,
                                                                                                                        object.classes,
                                                                                                                        object.style,
                                                                                                                        object.events);
								}
				},				


				submitEvent: function( location ){
                  
						app.addObject(  location, this.show  );
				},		
				show: function( message ){
                  console.log( message );
						var element = app.HTMLBuilder.getHTMLElement( message );
						var block = document.getElementById( "response" );
						app.HTMLBuilder.clear( block );
						block.appendChild( element );				
				},
			
			
			
				//log messages
				messages: new Array(),
				log: function( message ){		
						message = new Date().toLocaleTimeString() + '  ' + message;
						this.messages.push( message );
						
						var e = document.createElement( 'p' );					e.innerHTML = message;
						e.id = 'message_'+app.messages.length;
						var block = document.getElementById('console');	block.appendChild( e );
						block.scrollTop = block.scrollHeight;
						return e;
				},
				info	: function( message ){				this.log( 'info: ' + message ).style.color = 'white';		},
				debug	: function( message ){				this.log( 'debug: ' + message ).style.color = 'gray';		},
				warn	: function( message ){				this.log( 'warn: ' + message ).style.color = 'blue';		},
				error	: function( message ){				this.log( 'error: ' + message ).style.color = 'red';		},
				
				//catch exceptions				
				catchMessage: function( target, event ){   
						var message = 'null';
						if ( event != null ){
								if ( (event instanceof Error) ){
										message = event.name + ': ' + event.message;
								} else if ( (event instanceof ErrorEvent) ){
										message = event.error.name + ': ' + event.error.message;
								} else {
										message = event;
								}
						}
						var throwable = target + ' catch throwable object: \n' + message;
						alert( throwable );   
						app.error( throwable );
				},		
				exception: function( code, status ){
						var error = new Object( );
						error.name = code;
						error.message = status;
						error.toString = function(){  return this.name+':'+this.message;  }
						return error;			 
				},	    		
				getErrorDescription: function getErrorDescription( error ){
						if ( error instanceof InternalError )     return 'Внутренняя ошибка JavaScript.';
						if ( error instanceof RangeError )        return 'Выход за пределы допустимого диапазона.';
						if ( error instanceof ReferenceError )    return 'Обращение к недопустимой ссылки.';
						if ( error instanceof SyntaxError )       return 'Синтаксическая ошибка JavaScript.';
						if ( error instanceof TypeError )			return 'Недопустимый тип';
						if ( error instanceof URIError )          return 'Ошибка кодировки.';
						if ( error instanceof NetworkError )      return 'Сетевое подключение не доступно';
						return 'Внешняя ошибка';
				},				
				
				
				AuthException							: 'Authentication should be complete: ',
				ResourceNotFoundException	: 'Resource not found: ',
				ConverterException				: 'Can\'t convert object/JSON: ',
				DataExistsException				: 'Object/JSON already exists: ',
				HeaderException						: 'Request header is incolrrect:  ',
				ParametersException				: 'Wrong request parameters:  ',
				TicketException						: 'No validate persimissions now, try later:  ',
				MessageException					: 'Service internal error:  ',
				TimeoutException					: 'Request header is incolrrect:  ',
				RuntimeException					: 'Request header settings is not correct:  ',				
		 
				//события при выполнении запроса
				output: {},
				input: {},
				onComplete: function(response,success){ 
						try{
							var resource = response.request.url;
							app.info( resource );
							var code = response.getStatus();
							switch ( code ){ //	Status	Message
									case 200:     success(response);	break;
									case 401:			throw app.exception( code,app.AuthException + resource );			
									case 403:			throw app.exception( code,app.DataExistsException + resource );				
									case 404:     throw app.exception( code,app.ResourceNotFoundException + resource );	
									case 405:			throw app.exception( code,app.ConverterException + resource );				
									case 406:			throw app.exception( code,app.HeaderException + resource );			
									case 422:			throw app.exception( code,app.ParametersException + resource );		
									case 429:			throw app.exception( code,app.TicketException + resource );		
									case 500:			throw app.exception( code,app.MessageException + resource );			
									case 504:			throw app.exception( code,app.TimeoutException + resource );			
										default:			throw app.exception( code,app.RuntimeException + resource );	
								 }										
						} catch ( e ){
								app.catchMessage( 'onComplete',  e );
						}
				},
				request: function( resource, callback ){						
								$.get( resource).then( callback );
				},

				addObject: function( url, callback ){
					
						this.request( url, function( response ){
                     
                     this.input = response;
                     callback(   this.input  );
						} );
				},
				Test: {
						events: function(){
								var button = document.createElement( 'button' );
								button.innerHTML = 'alert';
								app.HTMLBuilder.bindEvent(button,'onclick','alert( 2 );');
								document.getElementById('response').appendChild( button );
						},
						json: function (){
								Object.prototype.toString = function(){
									return "{"+Object.values( this )+"}";
								}
								var Element = function Element(tag,attributes,content,classes,style,events){
										this.tag = tag;
										this.attributes = attributes;
										this.content = content;
										this.classes = classes;
										this.style = style;
										this.events = events;
								}
								var attributes = { href: "/app.php?url1", id: "someID" };
								var classes = ["line", "on_black"];
								var style = {width:  "100px", height: "200px"};
								var	events = {    
												click:   "alert (this.href);",
												focus:   "this.className='active'",
												blur:    "app.log(this)"
								};
								var element = new Element( "a",attributes,"\u043f\u0440\u0438\u043c\u0435\u0440",classes,style,events );
								alert(  element  );

								var json = app.JSONConverter.convert( element );
								alert(  json  );

								var object = app.JSONConverter.parse( json );
								alert(  object  );
						},
						html: function (){
								return app.addObject (  'templates/message.json' , app.show );      
						}						
				}
		}


	
	

	
	
	

		
		
		
		
		
		
					
    

		
 

	
	 