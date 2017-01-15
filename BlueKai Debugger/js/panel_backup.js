/*
#####################################################
### FUNCTIONS : All major functions declared here ###
#####################################################
*/

// FUNCTION : Log Filter

/*
Filters Logs by text value
*/

function log_filter(filter_element) {

	// Pull filter value
	var filter_value = jQuery(filter_element).val();

	if(filter_value){filter_value = filter_value.toLowerCase();}

	// Loop through each panel and check for value
	jQuery('.log-panel').each(function() {

		// Check if filter attribute available				
		if (jQuery(this).attr('data-bkurl')) {

			// Check if filter value found
			if (jQuery(this).attr('data-bkurl').toLowerCase().indexOf(filter_value) === -1) {

				// If not found hide
				jQuery(this).css('display','none'); // hide this one

				jQuery(this).children().each(function() { 
					this.style.display = "none"; // hide children next					
				})

			} else {

				// If found then keep

				jQuery(this).css('display',''); // show this one

				jQuery(this).children().each(function() {					
					this.style.display = ""; // show children next					
				})
			}


		} else {

			// If not found hide
			jQuery(this).css('display','none'); // hide this one

			jQuery(this).children().each(function() {
				this.style.display = "none"; // hide children
			})

		}

	})
}



// FUNCTION : Insert After
function insertAfter(newElement, targetElement) {
	//target is what you want it to go after. Look for this elements parent.
	var parent = targetElement.parentNode;

	//if the parents lastchild is the targetElement...
	if (parent.lastchild == targetElement) {
		//add the newElement after the target element.
		parent.appendChild(newElement);
	} else {
		// else the target has siblings, insert the new element between the target and it's next sibling.
		parent.insertBefore(newElement, targetElement.nextSibling);
	}
}

/*
############################################
### CODE : All running code defined here ###
############################################
*/

// LOG FILTER : ADD EVENT LISTENER TO ALLOW FILTER
jQuery('#log_filter').keyup(function() {
	log_filter(this);
})

// LOG EACH NETWORK REQUEST TO THE WINDOW
chrome.devtools.network.onRequestFinished.addListener(function(request) {

	var request_url = request.request.url;
	var query_string_params = request.request.queryString;

	// If BlueKai call
	if (typeof request_url !== "undefined" && request_url.indexOf('tags.bluekai.com') > -1) {

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
		if (request_url.indexOf('/site/') > -1) {
			t_site_id = request_url.split('/site/')[1];
			site_id = t_site_id.split('?')[0];
		}

		for (var i = 0; i < query_string_params.length; i++) {

			// PHINT HANDLER
			if (query_string_params[i].name === "phint") {

				// Set values
				var phint_object = {};

				phint = decodeURIComponent(query_string_params[i].value);
				phint_split = phint.split('=');
				phint_object.name = phint_split[0]; // Store name
				phint_split.shift(); // remove first item
				phint_object.value = phint_split.join('='); // Phint name

				if (phint_object.name.indexOf("__bk_") > -1) {

					if (phint_object.value) {
						phints_reserved.push(phint_object); // push into custom array
					}
				} else {
					phints_custom.push(phint_object);
				} // push into custom array

				// Phint count

			}

			// RET TYPE HANDLER
			if (query_string_params[i].name === "ret") {

				var ret_type = query_string_params[i].value;

			}

			// LIMIT TYPE HANDLER			
			if (query_string_params[i].name === "limit") {

				var limit_number = query_string_params[i].value;

			}

		}

		// FUNCTION : Add row
		var cell_adder = function(cell_value, type) {

			// Create if not existing
			if (typeof row.row === "undefined") {
				row.row = document.createElement("tr");
			}

			var cell = document.createElement("td");
			if (type === "phints") {

				// Create cell (panel)
				var panel_default = document.createElement("div");
				panel_default.setAttribute("class", "panel panel-default");

				var panel_heading = document.createElement("div");
				panel_heading.setAttribute("class", "panel-heading");

				var panel_h4 = document.createElement("h4");
				panel_h4.setAttribute("class", "panel-title");

				var panel_a_title = document.createElement("a");
				panel_a_title.setAttribute("data-toggle", "collapse");
				panel_a_title.setAttribute("href", "#phint_row" + request_number);
				panel_a_title.innerHTML = "Toggle <span class='badge'>" + cell_value.length + "</span>";

				var panel_collapsable = document.createElement("div");
				panel_collapsable.setAttribute("class", "panel-collapse collapse");
				panel_collapsable.setAttribute("id", "phint_row" + request_number);

				var panel_contents = document.createElement("div");
				panel_contents.setAttribute("class", "panel-body");

				// Make Phint Table
				var phint_table = document.createElement("table");
				phint_table.setAttribute("class", "table");

				var phint_table_rows_section = document.createElement("tbody");
				//phint_table_rows_section.setAttribute("class","phint_table_rows");

				// Loop through phints and add to table
				for (var i = 0; i < cell_value.length; i++) {

					// Create row				
					var phint_table_row = document.createElement("tr");

					// Create name cell
					var phint_name = document.createElement("td");
					phint_name.innerHTML = cell_value[i].name;
					phint_table_row.appendChild(phint_name);

					// Create value cell
					var phint_value = document.createElement("td");
					phint_value.innerHTML = cell_value[i].value;
					phint_table_row.appendChild(phint_value);

					// Add row to rows section
					phint_table_rows_section.appendChild(phint_table_row);

				}

				// Add header and rows sections to table
				//phint_table.appendChild(phint_table_header_section);
				phint_table.appendChild(phint_table_rows_section);

				// Construct panel header (in reverse order)				
				panel_h4.appendChild(panel_a_title); // panel_a_title --> panel_h4
				panel_heading.appendChild(panel_h4); // panel_h4 --> panel_heading

				// Construct panel contents (in reverse order)
				panel_contents.appendChild(phint_table); // phint_table --> panel_contents										
				panel_collapsable.appendChild(panel_contents); // panel_contents --> panel_collapsable

				// Add to panel
				panel_default.appendChild(panel_heading); // panel_heading --> panel_default
				panel_default.appendChild(panel_collapsable); // phint_table --> panel_default

				//cell.appendChild(minimised_phint);
				cell.appendChild(panel_default);

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
		cell_adder(phints_reserved, "phints");
		cell_adder(phints_custom, "phints");


		// Add row to table							
		ElementToAdd = window.document.getElementById('table_rows').appendChild(row.row);

	}


});