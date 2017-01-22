/*
#################################################
### TRACKING : Google Analytics Tracking Code ###
#################################################
*/

// Standard Google Universal Analytics code

(function(i, s, o, g, r, a, m) {
	i['GoogleAnalyticsObject'] = r;
	i[r] = i[r] || function() {

		(i[r].q = i[r].q || []).push(arguments)
	}, i[r].l = 1 * new Date();
	a = s.createElement(o),

		m = s.getElementsByTagName(o)[0];
	a.async = 1;
	a.src = g;
	m.parentNode.insertBefore(a, m)

})(window, document, 'script', 'https://www.google-analytics.com/analytics.js', 'ga'); // Note: https protocol here

ga('create', 'UA-90569841-1', 'auto');

ga('set', 'checkProtocolTask', function() {}); // Removes failing protocol check. @see: http://stackoverflow.com/a/22152353/1958200

ga('require', 'displayfeatures');

ga('send', 'pageview', '/viewing_bluekai_debugger_extension_tab');

/*
#####################################################
### FUNCTIONS : All major functions declared here ###
#####################################################
*/

// FUNCTION : Date Generator
function dateGen() {
	
	var date = new Date();
	var day = date.getDate();
	var month = date.getMonth() +1; //offset
	var year = date.getFullYear();
	var hours = date.getHours();
	var minutes = date.getMinutes();
	var seconds = date.getSeconds();

	//add 0 if needed
	function addZero(inputvar) {

		if (inputvar.toString().length === 1) {
			return "0" + inputvar;
		} else {
			return inputvar
		}

	}

	day = addZero(day);
	hours = addZero(hours);	
	month = addZero(month);
	minutes = addZero(minutes);
	seconds = addZero(seconds);

	return year + "-" + month + "-" + day + "_" + hours + "-" + minutes + "-" + seconds;

}

// FUNCTION : Log Filter

/*
Filters Logs by text value
*/

function log_filter(filter_element) {

	// Pull filter value
	var filter_value = jQuery(filter_element).val();

	if (filter_value) {
		filter_value = filter_value.toLowerCase();
	}

	// Loop through each panel and check for value

	jQuery('.log-panel').each(function() {

		// Check if filter attribute available				
		if (jQuery(this).attr('data-bkurl') || jQuery(this).attr('data-bkurl-decode')) {

			var found = false;

			// Check if filter value found			
			if (jQuery(this).attr('data-bkurl')) {

				if (jQuery(this).attr('data-bkurl').toLowerCase().indexOf(filter_value) > -1) {

					var found = true;

				}

			}

			if (jQuery(this).attr('data-bkurl-decode')) {

				if (jQuery(this).attr('data-bkurl-decode').toLowerCase().indexOf(filter_value) > -1) {

					var found = true;

				}

			}

			if (found) {

				// If found then keep
				jQuery(this).css('display', ''); // show this one

				jQuery(this).children().each(function() {
					this.style.display = ""; // show children next					
				})

			} else {

				// If not found hide
				jQuery(this).css('display', 'none'); // hide this one

				jQuery(this).children().each(function() {
					this.style.display = "none"; // hide children next					
				})


			}


		} else {

			// If not found hide
			jQuery(this).css('display', 'none'); // hide this one

			jQuery(this).children().each(function() {
				this.style.display = "none"; // hide children
			})

		}

	})

}

// FUNCTION : Log Clear

/*
Clear all logs
*/

function clear_logs() {

	// Kill HTML table
	jQuery("#request-table").empty();
	window.request_number = 0;

	// Kill CSV data for export
	window.csv.rows = [];
	window.csv.headers = window.csv.default_headers.slice(0);

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

// FUNCTION : CSV EXPORTER

function downloadCSV() {

	// config
	var name = "BlueKai_debugger_log_" + dateGen();
	var filename = name + ".csv";
	var number_of_columns = window.csv.headers.length;

	window.csv.export = [];
	window.csv.export.push(window.csv.headers); // Push in headers

	// Push in rows
	for (var i = 0; i < window.csv.rows.length; i++) {

		// row columns
		var row_columns = window.csv.rows[i].length;

		// Add missing items in array (to ensure equal length)
		if(row_columns < number_of_columns){

			var row = window.csv.rows[i];			

			for (var j = row_columns; j < number_of_columns; j++) {
				
				row[j] = ""; // add in missing elements
				
			}
			

		} else {

			var row = window.csv.rows[i]
		}

		window.csv.export.push(row); // Push in row

	}

	var csv = "";
	window.csv.export.forEach(function(row) {

		csv += '"' + row.join('","') + '"';
		csv += "\n";
	});


	link = document.createElement('a');
	link.setAttribute('href', 'data:text/csv;charset=utf-8,' + encodeURI(csv));
	link.setAttribute('target', '_blank,');
	link.setAttribute('download', filename);
	link.click();
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

// LOG FILTER : ADD EVENT LISTENER TO ALLOW FILTER
jQuery('#log-clear').mousedown(function() {
	clear_logs();
})

// CSV DOWNLOADER : ADD EVENT LISTENER TO ALLOW CSV DOWNLOAD
jQuery('#csv_download').mousedown(function() {
	downloadCSV();
})


// LOG PRESERVER : Clear HTML on page change
chrome.devtools.network.onNavigated.addListener(function(event_data) {

	var checked_status = jQuery('#logging_toggle').prop('checked'); // Check toggle status

	if (!checked_status) {

		clear_logs(); // Clear logs

	}


});

// CONFIG

// List all possible URLs bluekai requests can begin with
var bk_whitelist = [];
bk_whitelist.push("http://tags.bluekai.com");
bk_whitelist.push("https://tags.bluekai.com");
bk_whitelist.push("http://ptags.bluekai.com");
bk_whitelist.push("https://ptags.bluekai.com");
bk_whitelist.push("https://stags.bluekai.com");
bk_whitelist.push("https://pstags.bluekai.com");

// CSV EXPORT VARS

// config
window.csv = {};
window.csv.rows = [];
window.csv.default_headers = ["Request Number", "Site ID", "BlueKai Cookie ID", "Request Type", "Limit", "Request URL", "Phint Count : Default", "Phint Count : Custom"];
window.csv.headers = window.csv.default_headers.slice(0);



// LOG EACH NETWORK REQUEST TO THE WINDOW
chrome.devtools.network.onRequestFinished.addListener(function(request) {

	var request_url = request.request.url;
	var query_string_params = request.request.queryString;

	// Calculate if BlueKai call
	var bluekai_call = false;

	for (var i = 0; i < bk_whitelist.length; i++) {

		if (typeof request_url !== "undefined") {

			if (request_url.indexOf(bk_whitelist[i]) === 0) {

				var bluekai_call = true;

			}

		}

	}


	// If BlueKai call
	if (bluekai_call) {

		console.log('LOG : BlueKai network request found');

		// CALCULATE BK DATA

		// CALCULATE BK DATA : Declare required vars
		var row = {};
		var phints_custom = [];
		var phints_reserved = [];
		var phint_count_reserved = 0;
		var phint_count_custom = 0;
		var ret_type = "not set";
		var limit_number = "not set";
		var site_id = "not set";
		var bkurl = request_url;
		var bluekai_cookie = "NO COOKIE (request may be cached image)";
		window.request_number = window.request_number || 0;
		request_number++;

		// CALCULATE BK DATA : Get bluekai cookie value

		for (var i = 0; i < request.request.cookies.length; i++) {

			if (request.request.cookies[i].name === "bku") {

				var bluekai_cookie = request.request.cookies[i].value;

			}

		}

		// CALCULATE BK DATA : Pull Site ID
		if (request_url.indexOf('/site/') > -1) {
			t_site_id = request_url.split('/site/')[1];
			t_site_id = t_site_id.split('/')[0];
			site_id = t_site_id.split('?')[0];
		}

		// CALCULATE BK DATA : Pull vars from query-string
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

					// Add useful hints to reserved vars
					if (phint_object.name === "__bk_l") {
						phint_object.name = "__bk_l (URL)"
					} else if (phint_object.name === "__bk_pr") {
						phint_object.name = "__bk_pr (Page Referrer)"
					} else if (phint_object.name === "__bk_t") {
						phint_object.name = "__bk_t (Page Title)"
					} else if (phint_object.name === "__bk_k") {
						phint_object.name = "__bk_k (Meta Keywords)"
					}



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

		// MAP DATA VARS
		var bkurl = (bkurl) ? bkurl : "Not Set";
		var log_id = (request_number) ? request_number : "Not Set";
		var site_id = (site_id) ? site_id : "Not Set";
		var request_type = (ret_type) ? ret_type.toUpperCase() : "Not Set";
		var limit = (limit_number) ? limit_number : "Not Set";
		var phints_default_count = phints_reserved.length;
		var phints_custom_count = phints_custom.length;
		var phints_default = phints_reserved;
		var phints_custom = phints_custom;

		// CSV BUILD
		//"Request Number","Site ID","BlueKai Cookie ID","Request Type","Limit","Request URL","Phint Count : Default","Phint Count : Custom"
		var row = [];

		// Push in standard data
		row.push(log_id);
		row.push(site_id);
		row.push(bluekai_cookie);
		row.push(request_type);
		row.push(limit);
		row.push(bkurl);
		row.push(phints_default_count);
		row.push(phints_custom_count);

		// Push in phints

		// Loop through phints : default
		for (var i = 0; i < phints_default.length; i++) {

			var phint_name = phints_default[i].name;
			var phint_value = phints_default[i].value;

			// Find column number (push name to header row if not there)
			if (phint_name) {

				for (var j = 0; j < csv.headers.length; j++) {

					if (phint_name === csv.headers[j]) {

						var column_found = true;
						var column_id = j; // note column ID
						break;						

					}

				}

				if (typeof column_found === "undefined") {

					window.csv.headers.push(phint_name); // push in column
					column_id = csv.headers.length - 1; // note column ID		

				}

				// Push in phint var
				row[column_id] = phint_value;
				var column_found = undefined; // reset to undefined for next loop

			}
		}

		// Loop through phints : custom
		for (var i = 0; i < phints_custom.length; i++) {

			var phint_name = phints_custom[i].name;
			var phint_value = phints_custom[i].value;

			// Find column number (push name to header row if not there)
			if (phint_name) {

				for (var j = 0; j < csv.headers.length; j++) {

					if (phint_name === csv.headers[j]) {

						var column_found = true;
						var column_id = j; // note column ID						
						break;

					}

				}

				if (typeof column_found === "undefined") {

					window.csv.headers.push(phint_name); // push in column
					column_id = csv.headers.length - 1; // note column ID		

				}

				// Push in phint var
				row[column_id] = phint_value;
				var column_found = undefined; // reset to undefined for next loop

			}
		}

		// Loop through rows and replace "undefined" with ""
		for (var i = 0; i < row.length; i++) {

			if (typeof row[i] === "undefined") {
			
				row[i] = "";

			}

		}

		window.csv.rows.push(row); // push data into CSV rows

		// BUILD HTML TABLE

		// BUILD HTML TABLE : CALCULATIONS

		// Calculate if phint table required
		if (phints_default_count || phints_custom_count) {
			var phint_table_required = true;
		} else {
			var phint_table_required = false;
		}

		// BUILD HTML TABLE : CREATE HTML

		// Create Parent Div
		parent_div = document.createElement('div');
		jQuery(parent_div).addClass("panel panel-default log-panel");
		jQuery(parent_div).attr("data-bkurl", bkurl);
		jQuery(parent_div).attr("data-bkurl-decode", decodeURI(decodeURI(bkurl)));
		jQuery("#request-table").append(parent_div); // add to above


		// BUILD HTML TABLE : CREATE HTML : TOP-PANEL
		panel_heading = document.createElement('div');
		jQuery(panel_heading).addClass("panel-heading");
		jQuery(parent_div).append(panel_heading); // add to above

		panel_title = document.createElement('p');
		jQuery(panel_title).addClass("panel-title");
		jQuery(panel_title).attr("data-toggle", "collapse");
		jQuery(panel_title).attr("data-parent", "#request-table");
		jQuery(panel_title).attr("href", "#collapse" + log_id);
		jQuery(panel_heading).append(panel_title); // add to above

		// Create Panel Heading info

		// FUNCTION : divider creator
		var divider_creator = function(divider_name, append_to_object) {
			divider_obj = {};
			divider_obj[divider_name] = document.createElement("span"); // Add Divider
			jQuery(divider_obj[divider_name]).html("&nbsp;&nbsp;&nbsp;&nbsp;");
			jQuery(append_to_object).append(divider_obj[divider_name]);

		}

		span_request_id = document.createElement("span"); // Request ID
		jQuery(span_request_id).html("Request <span class='label label-default'>" + log_id + "</span>")
		jQuery(panel_title).append(span_request_id); // 
		divider_creator("span_divider", panel_title);

		span_site_id = document.createElement("span"); // Site ID
		jQuery(span_site_id).html("Site ID <span class='label label-default'>" + site_id + "</span>")
		jQuery(panel_title).append(span_site_id);
		divider_creator("span_divider", panel_title);

		span_request_type = document.createElement("span"); // Request Type
		if (request_type.toLowerCase() === "html") {
			var button_type = "label-primary"; // blue
		} else if (request_type.toLowerCase() === "js") {
			var button_type = "label-warning"; // yellow
		} else {
			var button_type = "label-default"; // grey
		}
		jQuery(span_request_type).html("Request Type <span class='label " + button_type + "'>" + request_type.toUpperCase() + "</span>")
		jQuery(panel_title).append(span_request_type);
		divider_creator("span_divider", panel_title);

		span_limit = document.createElement("span"); // Site ID
		jQuery(span_limit).html("Limit <span class='label label-default'>" + limit + "</span>")
		jQuery(panel_title).append(span_limit);
		divider_creator("span_divider", panel_title);

		span_phints_default = document.createElement("span"); // Phints : Default

		if (phints_default_count) {

			jQuery(span_phints_default).html("Phints (Default) <span class='badge btn-success'>" + phints_default_count + "</span>");

		} else {
			jQuery(span_phints_default).html("Phints (Default) <span class='badge'>" + phints_default_count + "</span>");
		}

		jQuery(panel_title).append(span_phints_default);
		divider_creator("span_divider", panel_title);

		span_phints_custom = document.createElement("span"); // Phints : Custom
		if (phints_custom_count) {

			jQuery(span_phints_custom).html("Phints (Custom) <span class='badge btn-success'>" + phints_custom_count + "</span>");

		} else {
			jQuery(span_phints_custom).html("Phints (Custom) <span class='badge'>" + phints_custom_count + "</span>");
		}

		jQuery(panel_title).append(span_phints_custom);
		divider_creator("span_divider", panel_title);

		// BUILD HTML TABLE : CREATE HTML : BOTTOM-PANEL

		// Create div to add things to (bottom-half)
		panel_bottom = document.createElement('div');
		jQuery(panel_bottom).addClass("panel-collapse collapse");
		jQuery(panel_bottom).attr("id", "collapse" + log_id);
		jQuery(parent_div).append(panel_bottom); // add to above

		// Add request URL
		default_table = document.createElement('table'); // Create default Table
		jQuery(default_table).addClass("table table-striped table-bordered");
		jQuery(default_table).attr("cellspacing", "0");
		jQuery(default_table).attr("width", "100%");
		jQuery(panel_bottom).append(default_table); // add to above

		default_table_head = document.createElement('thead'); // Create table head
		jQuery(default_table).append(default_table_head); // add to above

		default_table_head_row = document.createElement('tr'); // Create table column row
		jQuery(default_table_head).append(default_table_head_row); // add to above

		default_table_head_default_name = document.createElement('th'); // Create table columns
		jQuery(default_table_head_default_name).html("What?");
		jQuery(default_table_head_row).append(default_table_head_default_name); // add to above

		default_table_head_default_value = document.createElement('th'); // Create table columns
		jQuery(default_table_head_default_value).html("Value");
		jQuery(default_table_head_row).append(default_table_head_default_value); // add to above

		default_table_body = document.createElement('tbody'); // Create table body
		jQuery(default_table).append(default_table_body); // add to above

		// FUNCTION : Generate standard var table
		var default_generator = function(default_name, default_value, append_to_object, link_flag) {

			var row = document.createElement('tr'); // Create row

			jQuery(append_to_object).append(row); // add to above

			var name = document.createElement('td'); // Create phint name cell
			jQuery(name).html(default_name);
			jQuery(row).append(name); // add to above

			var value = document.createElement('td'); // Create phint value cell

			if (link_flag) {

				jQuery(value).html("<a target='_blank' href='" + default_value + "'>" + default_value + "</a>");

			} else {
				jQuery(value).html(default_value);
			}

			jQuery(row).append(value); // add to above

		}

		default_generator("Request URL", bkurl, default_table_body, true);
		default_generator("BlueKai Cookie ID", bluekai_cookie, default_table_body, true);
		//}


		// Add phint table (if required)
		if (phint_table_required) {

			phint_table = document.createElement('table'); // Create Phint Table
			jQuery(phint_table).addClass("table table-striped table-bordered");
			jQuery(phint_table).attr("cellspacing", "0");
			jQuery(phint_table).attr("width", "100%");
			jQuery(panel_bottom).append(phint_table); // add to above

			phint_table_head = document.createElement('thead'); // Create table head
			jQuery(phint_table).append(phint_table_head); // add to above

			phint_table_head_row = document.createElement('tr'); // Create table column row
			jQuery(phint_table_head).append(phint_table_head_row); // add to above

			phint_table_head_phint_name = document.createElement('th'); // Create table columns
			jQuery(phint_table_head_phint_name).html("Phint Name");
			jQuery(phint_table_head_row).append(phint_table_head_phint_name); // add to above

			phint_table_head_phint_value = document.createElement('th'); // Create table columns
			jQuery(phint_table_head_phint_value).html("Phint Value");
			jQuery(phint_table_head_row).append(phint_table_head_phint_value); // add to above

			phint_table_body = document.createElement('tbody'); // Create table body
			jQuery(phint_table).append(phint_table_body); // add to above

			// FUNCTION : Phint generator	

			// Loop through default phints and create rows
			var phint_generator = function(phint_data, append_to_object, phint_type) {

				for (var i = 0; i < phint_data.length; i++) {

					var phint_name = phint_data[i].name;
					var phint_value = phint_data[i].value;

					var row = document.createElement('tr'); // Create row
					if (phint_type === "default") {
						jQuery(row).addClass("warning");
					}
					jQuery(append_to_object).append(row); // add to above

					var name = document.createElement('td'); // Create phint name cell
					jQuery(name).html(phint_name);
					jQuery(row).append(name); // add to above

					var value = document.createElement('td'); // Create phint value cell
					jQuery(value).html(phint_value);
					jQuery(row).append(value); // add to above

				}
			}

			// Add phint rows
			phint_generator(phints_default, phint_table_body, "default");
			phint_generator(phints_custom, phint_table_body, "custom");

		}

	}

});