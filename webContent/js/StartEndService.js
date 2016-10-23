function StartEndService ()
{
	this.interfaceName = this._getInterfaceName() || "";

	this._waas = null;

	this.seMethods = [];
}

StartEndService.prototype = {

	init: function()
	{
		// Extending class must override this method
		this.implementMethods();

		// Once methods defined, events can be connected
		this._connectEvents();
	},

	_connectEvents: function()
	{
		if ( this._waas ) return;

		var _that = this;

		// Tetra js: Weblet As A Service implementation
		this._waas = tetra.waas ( 'ingenico.transaction.StartEnd' )

			.on ( 'getSEImplementedMethods', {},
			function ( e ) {

				//console.log ( "Tetra: getSEImplementedMethods event", e );

				_that._onGetSEImplementedMethodsRequestEventCallback ( e );

			})
			.on ( 'executeSE',
			{
				formats: {
					'Request.input': 'tlv',
					'Response.output': 'tlv'
				}
			},
			function ( e ) {

				//console.log ( "Tetra: executeSE event", e );

				_that._onExecuteSERequestEventCallback ( e );
			});

		this._waas.start();
	},

	_getInterfaceName: function()
	{
		return "ingenico.transaction.StartEnd";
	},

	_getSEImplementedMethods: function()
	{
		var id_values = [ "SE_START", "SE_CHECK_PREPARE", "SE_END" ];

		return this.seMethods.map ( function ( method ) {

			var id = id_values.indexOf ( method.on ) + 1;
			id = ( id != 0 ) ? id : null;

			return {
				id: id,
				priority: method.priority
			}
		});
	},

	/**
	 *******************************************************************
	 Callback for "ingenico.transaction.ExecuteSERequest" server event,
	 wrapping service processing.

	 As interfaced, service processing method _executeSERequestCallback ( data )
	 has to be overridden
	 *******************************************************************
	 */
	_onExecuteSERequestEventCallback: function ( e )
	{
		var data = JSON.parse ( e.data );

		//console.log ( "StartEndService->_executeSERequestCallback received", e.data );

		// PROCESSING ---------------------------------------------------------

		this._executeSERequestCallback ( data );

		// PROCESSING END -----------------------------------------------------
	},

	/**
	 *******************************************************************
	 Callback for "ingenico.transaction.GetSEImplementedMethodsRequest" server event,
	 wrapping service processing.

	 As interfaced, service processing method getSEImplementedMethodsRequestCallback ( data )
	 has to be overridden
	 *******************************************************************
	 */

	_onGetSEImplementedMethodsRequestEventCallback: function ( e )
	{
		//console.log ( "StartEndService->onGetSEImplementedMethodsRequestEvent received", e.data );

		// PROCESSING ---------------------------------------------------------

		var result = {
			"return": 1,
			"supportedMethods": this._getSEImplementedMethods()
		};

		// PROCESSING END -----------------------------------------------------

		//console.log ( "StartEndService->onGetSEImplementedMethodsRequestEvent result", result );

		var feedbackUrl = "http://terminal.ingenico.com/waas/" + this._getInterfaceName() + "/getSEImplementedMethods";

		var req = new XMLHttpRequest();

		req.open ( 'POST', feedbackUrl, true );

		req.onreadystatechange = function (e) {
			if (req.readyState == 4) {
				if(req.status == 200)
				{
					//console.log ( "Feedback:", req.responseText );
				}
				else
				{
					//console.log ( "Error.\n" );
				}
			}
		};

		req.send ( JSON.stringify ( result ) );
	},

	sendProcessedResult: function ( tlv, callback )
	{
		var feedbackUrl = "http://terminal.ingenico.com/waas/" + this._getInterfaceName() + "/executeSE";

		var req = new XMLHttpRequest();

		req.open ( 'POST', feedbackUrl, true );

		var processedResult = {
			"return":   0,
			"output":   tlv
		};

		//console.log ( "StartEndService->sendProcessedResult", processedResult );

		req.onreadystatechange = function ( e ) {
			if (req.readyState == 4) {
				if(req.status == 200)
				{
					//console.log ( "executeSE Feedback:", req.responseText );
					if ( callback ) callback();
				}
				else
				{
					//console.log ( "executeSE Error.\n" );
				}
			}
		};

		req.send ( JSON.stringify ( processedResult ) );
	},

	_executeSERequestCallback: function ( data ){

		//console.log ( "StartEndService.prototype._executeSERequestCallback", data, data.serviceId );

		var callbacks = this.seMethods.filter ( function ( cb ){
			return ( cb.on === data.serviceId );
		});

		if ( callbacks.length == 0 )
		{
			//console.log ( "StartEndService->_executeSERequestCallback: callback not found, return data as is" );
			return data;
		}

		//console.log ( "StartEndService->_executeSERequestCallback: callback OK", callbacks );

		return ( callbacks [ 0 ].processing ( data.input ) );
	},

	// Interface: To be overridden
	implementMethods: function() { return []; }

};
