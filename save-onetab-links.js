/*
Program Name:   Console: Scrape OneTab Links
File Name:      ehCode_2018.03.05_JavaScriptES6_ScrapeOneTabLinks_01.js
Date Created:   02/27/18
Date Modified:  04/01/18
Version:        1.02
Programmer:     Eric Hepperle

Purpose: Parses links and information from OneTab.
	Displays categories in console. Uses vanilla JavaScript ES6. 
	
	NOTE: Can't	inject jQuery anymore due to "Content Security Policy",
	 so this version use vanilla JavaScript ES6.

Usage: Open OneTab page in a browser and copy-paste the code below
	into the console.

	To save/archive the links results use code inspector in browser to
    grab the "body" tag and contents, then paste that into a new document
    and save it.	
	
    Sample results: N/A	

Requires: 
	* Browser console

*/

/* global $ */
/*jshint esversion: 6 */

console.clear();

// ********************** GLOBAL VARIABLES
	
	// =========== Output Variables =========
	// Groups array to store all group info (this is the root)
	var objArrGroups = [];
	
	// Output string to generate new page
	var strOut = '';
	// =========== END Output Variables =====

	
	// =========== Row Variables ============
	// Row Link
	var rowLink = '';
	
	// Row Text
	var rowText = '';
	
	// Icon URL
	var rowIconLink = '';
	
	// Row domain (parse from icon url)
	var rowDomain = '';	
	// ========== END Row Variables =========
		

	// =========== Counters =================
	// Blank Title Count
	var blankTitleCount = 1;

	// Group Counter = 1
	var groupCount = 1;

	// Total number of groups counted
	var groupsTotal = 0;
	
	// Row Counter
	var rowCount = 1;
	//============ END Counters =============

	
	// =========== Selector Constants =======
	// skips first 3 children
	var selAllGroups = "#contentAreaDiv > div:nth-child(n+4):not(:nth-last-child(-n+1)";
	
	var selGroupTitle = "div.tabGroupTitleText";
	// =========== END Selector Constants ===
	

	// =========== CSS Style Constants ======
	var aliceblue_dashed = "background:aliceblue; border-bottom: dashed 3px cadetblue";
	var lemonyellow_dashed = "background:#ffffb3; border-bottom: dashed 3px orange";
	var lemyel = "background:#ffffb3";	
	var ltgrn = "background:lightgreen";
	// =========== END CSS Style Constants ==

// ********************** HELPER FUNCTIONS

/*
pad()

Usage:

pad(10, 4);      // 0010
pad(9, 4);       // 0009
pad(123, 4);     // 0123
pad(10, 4, '-'); // --10
pad(10, 4, ' '); //   10
*/
function pad(n, width, z) {
  z = z || '0';
  n = n + '';
  return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}	

// ********************** MAIN
		
// Get All Group And Row Info And Store In Array Of Objects:
function getAllGroups() {

	// Grab list of all link groups and row info
	var groups = [...document.querySelectorAll(selAllGroups)];

	// Store the groups array length
	groupsTotal = groups.length;
	
	// FOREACH GROUP
	groups.forEach(function(el, i, arr) {
				
		// Create empty object to store group data
		var group = {};

		// Create empty group title variable
		var groupTitle = '';
		
		// Which line of group info the groupName is on
		var groupNameStartLineIndex = 2;
		
		// If group title exists, store in a variable. Else,
		//  build group title from blank title counter. NOTE:
		//	testing for "&nbsp;" doesn't work but fromCharCode does.
		if (el.querySelector(selGroupTitle).innerText && 
			el.querySelector(selGroupTitle).innerText !== String.fromCharCode(160)
		) {
			groupTitle = el.querySelector(selGroupTitle).innerText;
		} else {
			groupTitle = "blankGroup_" + blankTitleCount;
				
			// increment blank title counter
			++blankTitleCount;
			groupNameStartLineIndex = 1;
		}	
		
		// Add group title to group object
		group.groupTitle = groupTitle;

		// Grab group details block
		var thisGroupDetails = el.querySelector("div > div > div").innerText
		console.log("%cGroup Info (incl. date):                         ", "background:orange");
		console.log(thisGroupDetails);

		// Parse group details block for 
		var arrGroupDetails = thisGroupDetails.split('\n');
		
		var tempTimeDate = arrGroupDetails[groupNameStartLineIndex];
		
		// Determine what line of group info the date is on:
		if (tempTimeDate.includes("tabs")) {
			
			tempTimeDate = arrGroupDetails[(groupNameStartLineIndex+1)];
			
		} else {
			tempTimeDate = arrGroupDetails[groupNameStartLineIndex];
		}
		
		
		console.log("%ctempTimeDate: %s                                ", "background: lavender; border: solid gold 2px;", tempTimeDate);
		// Parse time date with Regex like: 
		// 	Created 6/21/2016, 1:41:28 PM
		var reg = /^Created\s+(\d{1,2})\/(\d{1,2})\/(\d{4}),\s(\d{1,2}):(\d{1,2}):(\d{1,2})\s([APM]{2})$/;
		var matches = reg.exec(tempTimeDate);
		
		// debugging ... 
		console.log("%c************ MATCHES ************** ", "background:yellow");
		console.log(matches);
		
		var monthNum = matches[1] ? matches[1] : 'no-month';
		var dayNum = matches[2];
		var year4 = matches[3];
		var hourNum = matches[4];
		var minuteNum = matches[5];
		var secondNum = matches[6];
		var ampm = matches[7];
		
		// var date = matches[1] + "/" + matches[2] + "/" + matches[3];
		// var time = matches[4] + ":" + matches[5] + ":" + matches[6] + " " + matches[7];
		var date = monthNum + "/" + dayNum + "/" + year4;
		var time = hourNum + ":" + minuteNum + ":" + secondNum + " " + ampm;
		
		// Grab just date and time
		console.log("%cDate:                         ", "background:bisque");
		console.log(date);
		console.log("%cTime:                         ", "background:bisque");
		console.log(time);
		
		// Add date and time info to group object. This will help with sorting
		group.year = year4;
		group.date = date;
		group.time = time;
		group.monthNum = monthNum;
		group.dayNum = dayNum;
		group.hourNum = hourNum;
		group.minuteNum = minuteNum;
		group.secondNum = secondNum;
		group.ampm = ampm;
		
		// Grab list of all rows in this group
		var rows = Array.from(el.children[1].children);
		// debugging ... child rows
		console.log("%cChild Rows:                        ", lemonyellow_dashed);
		console.log(rows);
		
		// Create rows array
		arrGroupRows = [];
		
		// Reset row counter to 1
		rowCount = 1;
		
		// Foreach Row:
		rows.forEach(function(el, i, arr) {

			// Create row object
			var rowObj = {};
			
			// Grab row link
			// rowLink = el.querySelector('.row_text > a').href;
			rowLink = el.children[1].querySelector('a').href;
			
			// Grab row text
			rowText = el.children[1].querySelector('a').text;
			
			// Grab icon link
			rowIconLink = el.children[1].querySelector('img').src;
			
			// Add all row data to row object
			rowObj.rowText = rowText;
			rowObj.rowLink = rowLink;
			rowObj.rowIconLink = rowIconLink;
			
			// Push this row object onto group rows array
			arrGroupRows.push(rowObj);
									
			// Increment row counter
			++rowCount;
		
		});	
		// END processing rows in this group		
		
		// Add group rows array onto this group as property
		group.rows = arrGroupRows;
		
	// Push this group object onto groups array
	objArrGroups.push(group);
	
	}); 
	// END processing groups

	objArrGroups.blankTitleCount = blankTitleCount;
	
	return objArrGroups;
	
} // END function

var groupInfo = getAllGroups();

// uncomment to output object
// console.log("%c --- GROUP INFO ---                           ", "background:#ffffb3;");
// console.log(groupInfo); 



// --------------------------------------------------------------------
// Create webpage by parsing the groups object and
// 	launch in new window.

// add doctype and header to html output string
strOut += "<!DOCTYPE html>\n";
strOut += "<html lang='en'>\n";
strOut += "\t<head>\n";
strOut += "\t<title>Scraped Links Output Page</title>\n";
strOut += "\t<meta charset='utf-8'>\n";

var testTemplateLiteralStyle = `
<style>
.group-info {
    background-color: orange;
    border: solid black 2px;
    border-radius: 15px;
    padding: 10px;
    max- width: 1024px;
	display: inline-block;
}

.group-title {
	float: left;
    position: relative;
	top: -.6em;
}

.group-table {
    float: left;
    border: solid 3px gold;
    margin-left: 9em;
    background: #ffffb3;
    border-radius: .8em;
    padding: .6em;
    font-family: "courier new";
    font-size: .8em;
}

.clear:after {
  content: "";
  clear: both;
  display: table;
}

.row-icon {
	width: 16px;
	height: 16px;
}

/* Note: clear the div and the table */
</style>
`;

strOut += testTemplateLiteralStyle;
strOut += "<body>\n";

groupInfo.forEach(function(group, groupIndex, groupArr) {

	// begin this group html string
	var htmGroup = '';

	var htmGroupInfo = "<div class='clear group-info'>\n";
	
	// Build formatted group title:
    var htmGroupTitle = "<h2 class='group-title'>" + group.groupTitle + "</h2>\n";

	// Build formatted group table:
	var htmGroupTable = "<table class='clear group-table'>\n";
	htmGroupTable += "\t<tr>\n\t\t<td class='info-label'>Date & Time:</td>\n\t\t<td>" + group.date + ", " + group.time + "</td>\n\t</tr>\n";
	htmGroupTable += "\t<tr>\n\t\t<td class='info-label'>Group #:</td>\n\t\t<td>" + (groupIndex+1) + "</td>\n\t</tr>\n";
	htmGroupTable += "</table>\n";
	
	// Build formatted group header and info:
	htmGroupInfo += htmGroupTitle + htmGroupTable + "</div>\n"
	
	// debugging ...
    console.log(group.groupTitle);
	
	// Begin current link list:
	var htmRowsList = "<ul style='list-style: none'>";
	
	// debugging ...
	//var linksCount = [...document.querySelector('.row_text > a')].length;
	//console.log("linksCount = " + linksCount);

	// Loop through all rows in this group ...        
	group.rows.forEach(function(row, rowIndex, rowArr) {

		// Format row index to 3 padded digits
		var formattedRowNum = pad((rowIndex+1), 3);
		// debugging ... formattedRowNum
		console.log("%cFormatted row number = %s", lemonyellow_dashed, formattedRowNum);

		
		// start row list item
		var htmRow = "<li class='row'>[Row #: " + formattedRowNum + "]: ";

		// add icon image to row
		htmRow += "\t<img alt='favicon for " + rowDomain + "'"
		+ "class='row-icon' src='" + row.rowIconLink + "'\\>";
		
		// add hyperlink to row
		htmRow += "\t<a href='" + row.rowLink + "' target='_blank' >" +
		row.rowText + "</a></li>";
		
		// add row html to the rows string
		htmRowsList += htmRow;

	});        

	// close current link list
	htmRowsList += "</ul><!-- END group -->\n";

	// assemble html parts for this group
	htmGroup += htmGroupInfo + htmRowsList + "<hr />";
	
	// Add this group's html to out page html
	strOut += htmGroup;

});

// Add closing tags to html page string
strOut += "</body>\n</html>\n";

// Launch results in new window:
var win = window.open("", "APPLES");
win.document.body.innerHTML = strOut;


/*

NOTES:

	04/01/18 - Verisoned to 1.02.
			 - Restricts favicon display size to 16x16 px.
		
	03/05/18 - Versioned to 1.01.
			 - Previous version didn't work correctly. #GOTCHA It used to be
			    working code, but all of a sudden it wasn't working. Today,
				I realized the issue was because of how starring a OneTab
				group adds an element to the group info, so when I'm trying to parse a certain index, it fails as null. Instead of a date string, it is an element that says "7 tabs", "12 tabs", etc.
			 - #SOLVED: If tempDate includes "tabs", then look for date in'
				the next index (+1). WORKS now! :)

	02/27/18 - Created file from 11/27/17 version.
			 - Versioned as #1.
			 - Improved global variable organization.
			 - Reorganized 'Notes' section to be descending by date
				#GOTCHA: Realized that my comments are so long now,
				it makes sense to have the latest ones on top so
				I don't have to scroll! :)
			 - NOTE: This doesn't work for some reason. I KNOW that I fixed
				this within the last few months, but I can't find the
				working version. :(
			 - 

	11/27/17 - Parses date and time from group info block
		     - Versioned to 10.0
			 - Refactored time/date parts into better semantic variables
			 - Stores date and time info to groups.
			 - Correctly grabs rows and stores to group! :) WORKS!!!
			 - Generates new page correctly, except misses the last group.
			 - #GOTCHA Figure out this off-by-one error.
			 - Versioned to 11.0.
			 - Removed debugs
			 - Changed selAllGroups to (-n+1) from (-n+2). WORKS! :)
			 - Changed group heading to include some other info
			 - Adds template literal to inject styles into out page
			 - Replaced inline styles with classes including clearfix
			 - Formatted group info divs to be inline-block no float
			 - Adds number padding function from:
			 https://stackoverflow.com/questions/10073699/pad-a-number-with-leading-zeros-in-javascript
			 
			 - Formatted row numbers to pad with leading spaces.
	
	11/26/17 - Versioned to 9.0 - This version we will adapt to work with
				OneTab.
			 - Refactored selectors as constants
			 - Adds color & CSS style constants.
			 - Adds groupsTotal to store total number of groups.
			 - Adds debugs in getAllGroups()
			 - SOLVED for How to exclude children from front and end with:

				var selAllGroups = "#contentAreaDiv > div:nth-child(n+4):not(:nth-last-child(-n+2)";
			 			 
			 - This link explains HOW TO TEST FOR &nbsp (non-breaking space)
				
				if (x == String.fromCharCode(160))
			 
			 - #GOTCHA Those last two wer gotchas.
			 - Adds blankTitleCount as property of objArrGroups.
			 - Grabs and stores group info
			 - We have an "off-by-one" error and are not grabbing the last group for some reason
			 				
	11/25/17 - Versioned file to 5.0.
			 - Removed redundant function.
			 - Created algorithm on paper.
			 - Versioned to 6.0 based on my algorithm.
			 - Troubleshot code --> arrays and objects. This post helped:
			 
			 https://www.sitepoint.com/get-url-parameters-with-javascript/
			 
			 - 10:47 AM (CST) WORKS !!!! :) So far, this version builds a
			 groupInfo object which stores all group data as JSON.
			 
			 - NOTE: This works on sample links list page, but has not been
				converted for OneTab yet.
				
			 - Versioned to 7.0
			 - Started from scratch with algorithm and left out most debugging
				and console logging. This is cleaner code.
			 - WORKS!!! Generates new page! with grouped links! :) Next, test
				in OneTab
			 - Versioned to 8.0
			 - Added HTML header to results page --> sort of works. You will still
				need to copy the inner html of the whole document and move
				to a new file for archiving.
	
	11/24/17 - Duplicated file to make edits. Versioned to 2.0.
			 - Added comments to document code and make it more understandable.
			 - Replaced MS Word apostrophes with single-quotes
			 - Changed arrTabGroups from const to a var and removed square
				brackets.
			 - Changed selector for arrTabGroups to: 
				#contentAreaDiv div.row_text > a');
			 - Adds elCount var as blank and undefines/unsets arrTabGroups
				at start of program.
			 - Removes co-existing 2nd version of top arrTabGroups code. This
				was just for testing if we actually are getting all the links.
				YES!!! It works! :) Now we will make that a function.
			 - Refactored code into getTabGroups() function. Still works! :)
			 - Added the ... with brackets back after learning this is the
				ES6 way to auto convert a nodelist to an array. Still works! :)
			 - Now we are going to see if we can parse more than just url.
			 - Works! I'm getting img icon and link url. NEXT, let's get link text
				and lets make sure to build objects that we can iterate over.
				Here is a great link: https://www.sitepoint.com/dom-manipulation-vanilla-javascript-no-jquery/#modifyingthedom
				
    11/01/17 - Created file, beginning from copy of scrapeLinksFromOneTab3.
			 - Converting from jQuery to vanilla javascript.	
	
-----------------------------


*/

/*

IDEAS & FUTURE IMPROVEMENTS:

- Consider de-duplicating icon urls
- Get domain from icon url
- Grab group date and time
- Sort by date and time
- Can I create a global row object?
- What is the expense of creating a new rowobject variable each iteration?
- Create JavaScript plugin or library from this.

*/
