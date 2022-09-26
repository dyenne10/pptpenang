(function () {
	'use strict';

	//app adalah object
	var app = {

		//semua ni adalah variable dlm app
		registration: null,
		visibleEl: null,
		state: null, 


		pushAppName: "ppt-png",


	};

	/*****************************************************************************
	 *
	 * Functions
	 *
	 ****************************************************************************/
   
    /*****************************************************************************
	 *
	 * Event Listener
	 *
	 ****************************************************************************/

	document.getElementById('btnOpen').addEventListener('click', function () {
	//	alert("test");
	  window.open("borang_ppt.html");
	});


})();