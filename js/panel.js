// LOG EACH NETWORK REQUEST TO THE WINDOW
chrome.devtools.network.onRequestFinished.addListener(function(request) {

	var request_url = request.request.url;	
	var query_string_params = request.request.queryString;
	
	// If BlueKai call
	if(typeof request_url !== "undefined" && request_url.indexOf('tags.bluekai.com') > -1){

		console.log('LOG : BlueKai network request found');				
		
		// DECLARE REQUIRED ARRAYS
		var row = {};
		var phints_custom = [];
		var phints_reserved = [];
		var phint_count_reserved = 0;
		var phint_count_custom = 0;
		var ret_type = "not set";
		var limit_number = "not set";
		var site_id = "not set";
		window.request_number = window.request_number || 0;
		request_number++;		
		
		// Pull Site ID
		if(request_url.indexOf('/site/') > -1){
			t_site_id = request_url.split('/site/')[1];
			site_id = t_site_id.split('?')[0];	
		}
				
		for (var i = 0; i < query_string_params.length; i++) {

			// PHINT HANDLER
			if(query_string_params[i].name === "phint"){

				// Set values
				var phint_object = {};
				
				phint = decodeURIComponent(query_string_params[i].value);
				phint_split = phint.split('=');				
				phint_object.name = phint_split[0]; // Store name
				phint_split.shift(); // remove first item
				phint_object.value = phint_split.join('='); // Phint name
				
				if(phint_object.name.indexOf("__bk_") > -1){

					if(phint_object.value){
						phints_reserved.push(phint_object); // push into custom array
					}
				}

				else {phints_custom.push(phint_object);} // push into custom array
			
				// Phint count

			}

			// RET TYPE HANDLER
			if(query_string_params[i].name === "ret"){

				var ret_type = query_string_params[i].value;

			}

			// LIMIT TYPE HANDLER			
			if(query_string_params[i].name === "limit"){

				var limit_number = query_string_params[i].value;

			}

		}		
				
		// FUNCTION : Add row
		var cell_adder = function(cell_value,type){

			// Create if not existing
			if(typeof row.row === "undefined"){
				row.row = document.createElement("tr");
			}

			var cell = document.createElement("td");
			if(type === "badge"){

				cell.innerHTML = '<span><a href="javascript: void(0)">Show Phints</a> <span class="badge">' + cell_value + '</span></span>';

			} else {

				cell.innerHTML = cell_value;		
			}
			
			
			row.row.appendChild(cell);

		}

		// Add cells
		cell_adder(request_number);
		cell_adder(site_id);
		cell_adder(ret_type);
		cell_adder(limit_number);
		cell_adder(phints_reserved.length,"badge");
		cell_adder(phints_custom.length,"badge");
		
					
		// Add row to table							
		ElementToAdd = window.document.getElementById('table_rows').appendChild(row.row);				

	}
	

});
