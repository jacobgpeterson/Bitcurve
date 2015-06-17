(function() {

	angular.module('bitcurve.directives', [])

	.directive('bitcoinData', [function (){  
		return {
			scope: {
				selectedData: '='
			}, 	// end scope
			restrict: "A",
			templateUrl: "../templates/test.html",
			link: function(scope, element, attrs) {


				scope.$watch('selectedData', function(){
					// console.log("I'm changing", scope.selectedData);
<<<<<<< HEAD
					custom_chart(scope.selectedData);
=======
					// custom_chart(scope.selectedData);
					var data = scope.selectedData;
					console.log("help", data);
					update(data);
>>>>>>> 1fb77899587084a4bdc39e08d7f8e89c77c5087d
				});	// end scope.$watch

// *********** BEGIN D3 ***********

<<<<<<< HEAD
				var custom_chart;
				// var CustomTooltip;

				var custom_bubble_chart = (function(d3) {

				//DATA 
				var dataSelection = scope.selectedData;

				//DEFINGING the VARIABLES
				var width = 1260,
					height = 820,
					tooltip = CustomTooltip("bitcurve_tooltip", 240),
					layout_gravity = -0.01,
					damper = 0.1,
					nodes = [],
					chart, 
					force, 
					circles, 
					radius_scale, 
					min_data, 
					max_data, 
					dataRange, 
					lowdataRange, 
					avedataRange;

				//DEFINING the CENTER for the CANVAS
				var center = {x: width / 2, y: height / 2}; 

				//DEFINING the AREA for YEARS DISPLAY
				var year_centers = {
					"2009": {x: width / 8, y: height / 2},
					"2010": {x: (width / 8) * 2, y: height / 2},
					"2011": {x: (width / 8) * 3, y: height / 2},
					"2012": {x: (width / 8) * 4, y: height / 2},
					"2013": {x: (width / 8) * 5, y: height / 2},
					"2014": {x: (width / 8) * 6, y: height / 2},
					"2015": {x: (width / 8) * 7, y: height / 2}
				};

				//DEIFINING THE COLORS
				var fill_color = d3.scale.ordinal()
					.domain(["low", "median", "high"])
					.range(["#ea7070", "#ad9d9d", "#6de09d"]);
				 
				//CUSTOM CHART THAT TAKES in all DATA
				//DEFINE MAX & MIN for DATA 
				custom_chart = function(dataSelection) { //start function custom_chart
					console.log('check data', dataSelection);

					max_data = d3.max(dataSelection, function(d) { return parseFloat(d.data, 10); } ); //function for the max data and parsing it into #
					console.log("max_data", max_data);
					min_data = d3.min(dataSelection, function(d) { return parseFloat(d.data, 10); } );
					console.log("min_data", min_data);
					radius_scale = d3.scale.pow().exponent(0.5) //pow.exponent takes in an exponent value
						.domain([0, max_data])
						.range([2, 50]);

				//DEFINING the RANGES for DATA
				var groupLevel = function(){
					// console.log("the low is 0");
					dataRange = parseFloat(max_data - min_data).toFixed(5);
					console.log("dataRange", dataRange);
					lowdataRange = parseFloat(min_data + (dataRange / 3)).toFixed(5);
					console.log("lowdataRange", lowdataRange);
					avedataRange = parseFloat(min_data + ((dataRange / 3) * 2)).toFixed(5);
					console.log("avePriceRange", avedataRange);
					// console.log("the high", max_price);
				};
				groupLevel();
				 
				//create node objects from original data that will serve as the data behind each bubble in the chart, then add each node to nodes to be used later
				dataSelection.forEach(function(d){ //The forEach() method executes a provided function once per array element.
					// console.log("d", d);

					//RANGE CONDITIONALS for GROUPING the DATA
					if (d.data >= min_data && d.data <= lowdataRange) {
						d.group = "low";
					}
					else if (d.data > lowdataRange && d.data <= avedataRange) {
						d.group = "median";
					}
					else if (d.data > avedataRange && d.data <= max_data) {
						d.group = "high";
					}

					//DEFINING NODE
					var node = { //referring to data
						year: parseInt(d.year),
						id: parseInt(d.id),
						group: d.group, 
						value: d.data,
						radius: radius_scale(parseFloat(d.data, 10)),
						x: Math.random() * 900, //defining x & y for the node to be placed anywhere on the canvas
						y: Math.random() * 800
					};
					if (d.id) {
						nodes.push(node); //push node into nodes
					}

				});	// end dataSelection.forEach

				console.log("nodes", nodes);

				// nodes.sort(function(a, b) { return b.value - a.value; }); 

				//DRAWING D3 CHART 
				//APPEND SVG
				chart = d3.select("#vis").append("svg") //this "#chart" is in index
		            .attr("width", width)
		            .attr("height", height);
		            // .attr("id", "svg_chart"); // Applies an id of 'svg_chart' to the actual svg div 

				//CREATE & APPEND CIRCLES
				circles = chart.selectAll("circle")
					.data(nodes, function(d) { return d.id ;});

						
				circles.enter().append("circle")
					.attr("r", 0)
					.attr("fill", function(d) { return fill_color(d.group) ;})
					.attr("stroke-width", 2)
					.attr("stroke", function(d) {return d3.rgb(fill_color(d.group)).darker();})
					.attr("id", function(d) { return "bubble_" + d.id; })
					.on("mouseover", function(d, i) {show_details(d, i, this);} )
					.on("mouseout", function(d, i) {hide_details(d, i, this);} );

				//D3 TRANISITON
				circles.transition().duration(2000).attr("r", function(d) { return d.radius; });
		 
			};	

			// END function CUSTOM_CHART
		 		
		 		//FORCE
		 		//D3 GLOBAL FUNCTION FOR GROUPING the DATA (below)
				//start the simulation 
				function start() {
					force = d3.layout.force()
				        .nodes(nodes)
				        .size([width, height]);
				}
				//charge strength to the specified value.
				function charge(d) {
					return -Math.pow(d.radius, 2.0) / 8;
				}

				//GROUPING THE DATA 
				//I. grouping all the data points
				function display_group_all() {
					force.gravity(layout_gravity)
						.charge(charge)
						.friction(0.9)
						.on("tick", function(e) {
							circles.each(move_towards_center(e.alpha))
								.attr("cx", function(d) {return d.x;})
								.attr("cy", function(d) {return d.y;});
							});
					force.start();
					hide_years();
				}

				//moving the data to the center
				function move_towards_center(alpha) {
					return function(d) {
						d.x = d.x + (center.x - d.x) * (damper + 0.02) * alpha;
						d.y = d.y + (center.y - d.y) * (damper + 0.02) * alpha;
					};
				}

				//II. grouping all the data by PRICE (by year)
				function displayPriceByYear() {
					force.gravity(layout_gravity)
						.charge(charge)
						.friction(0.9)
						.on("tick", function(e) {
							circles.each(move_towards_year(e.alpha))
								.attr("cx", function(d) {return d.x;})
								.attr("cy", function(d) {return d.y;});
							});
					force.start();
					display_years();
				}

				//moving the PRICE data to its respective year
				function move_towards_year(alpha) {
					return function(d) {
						var target = year_centers[d.year];
						d.x = d.x + (target.x - d.x) * (damper + 0.02) * alpha * 1.1;
						d.y = d.y + (target.y - d.y) * (damper + 0.02) * alpha * 1.1;
					};
				}
				 
				//setting up area for split years
				function display_years() {
					var years_x = {"2009": width / 8, "2010": (width / 8) * 2, "2011": (width / 8) * 3, "2012": (width / 8) * 4, "2013": (width / 8) * 5, "2014": (width / 8) * 6, "2015": (width / 8) * 7};
					var years_data = d3.keys(years_x);
					var years = chart.selectAll(".years")
						.data(years_data);
					years.enter().append("text")
						.attr("class", "years")
						.attr("x", function(d) { return years_x[d]; }  )
						.attr("y", 40)
						.attr("text-anchor", "middle")
						.text(function(d) { return d;});
				}
				//hide till its clicked
				function hide_years() {
					var years = chart.selectAll(".years").remove();
				}

				//TOOLTIP
				//tooltip to show data details for each element
				function show_details(data, i, element) {
					d3.select(element).attr("stroke", "black");
					var content = "<span class=\"name\">Price:</span><span class=\"value\"> $" + addCommas(data.price) + "</span><br/>";
					content +="<span class=\"name\">Total Circulation:</span><span class=\"value\"> " + addCommas(data.volume) + "</span><br/>";
					content +="<span class=\"name\">Date:</span><span class=\"value\"> " + data.month + "/" + data.day + "/" + data.year + "</span>";
					tooltip.showTooltip(content, d3.event);
				}

				//tooltip to hide data details till executred
				function hide_details(data, i, element) {
					d3.select(element).attr("stroke", function(d) { return d3.rgb(fill_color(d.group)).darker();} );
					tooltip.hideTooltip();
				}

				//CREATE AN EMPTY OBJECT MOD
				//collects display_all and display_year in an object and returns that object
				var my_mod = {};
				my_mod.init = function (_data) { 
					custom_chart(_data);
					start();
					//console.log(my_mod);
				};
				 
				my_mod.display_all = display_group_all; //display all charts
				my_mod.display_year = displayPriceByYear; //display year
				// my_mod.display_volume = displayCirculationByMonth; // display volume by year
				my_mod.toggle_view = function(view_type) { 
				  // console.log("view_type", view_type);
				  if (view_type == 'year') {
				    displayPriceByYear();
				  }
				  // else if (view_type == 'circulation') {
				  //   displayCirculationByMonth();
				  // } 
				  else {
				    display_group_all();
				    }
				  };

				return my_mod;
				
				})(d3, CustomTooltip); // end custom_bubble_chart //pass d3 and CustomTooltip 	

				//*********CUSTOM TOOLTIP******** 
				function CustomTooltip(tooltipId, width){
				  var tooltipId = tooltipId;
				  $("body").append("<div class='tooltip' id='"+tooltipId+"'></div>");
				  
				  if(width){
				    $("#"+tooltipId).css("w-th", width);
				  }
				  
				  hideTooltip();
				  
				  function showTooltip(content, event){
				    $("#"+tooltipId).html(content);
				    $("#"+tooltipId).show();
				    
				    updatePosition(event);
				  }
				  
				  function hideTooltip(){
				    $("#"+tooltipId).hide();
				  }
				  
				  function updatePosition(event){
				    var ttid = "#"+tooltipId;
				    var xOffset = 20;
				    var yOffset = 10;
				    
				     var ttw = $(ttid).width();
				     var tth = $(ttid).height();
				     var wscrY = $(window).scrollTop();
				     var wscrX = $(window).scrollLeft();
				     var curX = (document.all) ? event.clientX + wscrX : event.pageX;
				     var curY = (document.all) ? event.clientY + wscrY : event.pageY;
				     var ttleft = ((curX - wscrX + xOffset*2 + ttw) > $(window).width()) ? curX - ttw - xOffset*2 : curX + xOffset;
				     if (ttleft < wscrX + xOffset){
				      ttleft = wscrX + xOffset;
				     } 
				     var tttop = ((curY - wscrY + yOffset*2 + tth) > $(window).height()) ? curY - tth - yOffset*2 : curY + yOffset;
				     if (tttop < wscrY + yOffset){
				      tttop = curY + yOffset;
				     } 
				     $(ttid).css('top', tttop + 'px').css('left', ttleft + 'px');
				  }
				  
				  return {
				    showTooltip: showTooltip,
				    hideTooltip: hideTooltip,
				    updatePosition: updatePosition
				  };
				}

				//part of tooltip, adding commas
				function addCommas(nStr)
				{
				 nStr += '';
				 x = nStr.split('.');
				 x1 = x[0];
				 x2 = x.length > 1 ? '.' + x[1] : '';
				 var rgx = /(\d+)(\d{3})/;
				 while (rgx.test(x1)) {
				   x1 = x1.replace(rgx, '$1' + ',' + '$2');
				 }
				 return x1 + x2;
				}

				//*********DATA*********
				// d3.json("data/csvtojson2.json", function(data) {
				  // d3.json("data/bitcurve.json", function(data) {
				    
			    custom_bubble_chart.init(dataSelection);

				    // custom_bubble_chart.toggle_view('all');
				// });

				//jQuery stuff
				// $(document).ready(function() {
				//   $('#view_selection a').click(function() { //bind it to html element with class #view_selection
				//     var view_type = $(this).attr('id');
				//     $('#view_selection a').removeClass('active');
				//     $(this).toggleClass('active');
				//     custom_bubble_chart.toggle_view(view_type);
				//     return false;
				//   });
				// });
=======
				//http://vallandingham.me/bubble_charts_in_d3.html

//to instantiate D3
var custom_bubble_chart = (function(d3, CustomTooltip) {
  "use strict";
 
 //defining the parameters for custom_bubble_chart
  var width = 1200, //width
      height = 600, //height
      tooltip = new CustomTooltip("bitcurve_tooltip", 240), //tooltip
      layout_gravity = -0.01, //gravity
      damper = 0.1, //moving around nodes
      nodes = [], //empty nodes
      //these will be set in create_nodes and create_vis
      vis = null, 
      force = null, 
      circles = null, 
      radius_scale = null,
      min_price, 
      max_price,
      priceRange,
      lowPriceRange,
      avePriceRange,
      highPriceRange;
 //defining the center based on width and height
  var center = {x: width / 2, y: height / 2}; 
 
 //defining the area for all the years when split
  var year_centers = {
      "2009": {x: (width / 8), y: height / 2},
      "2010": {x: (width / 8) * 2, y: height / 2},
      "2011": {x: (width / 8) * 3, y: height / 2},
      "2012": {x: (width / 8) * 4, y: height / 2},
      "2013": {x: (width / 8) * 5, y: height / 2},
      "2014": {x: (width / 8) * 6, y: height / 2},
      "2015": {x: (width / 8) * 7, y: height / 2}
    };

  var month_centers = {
    "1": {x: width / 13, y: height / 2},
    "2": {x: (width / 13) * 2, y: height / 2},
    "3": {x: (width / 13) * 3, y: height / 2},
    "4": {x: (width / 13) * 4, y: height / 2},
    "5": {x: (width / 13) * 5, y: height / 2},
    "6": {x: (width / 13) * 6, y: height / 2},
    "7": {x: (width / 13) * 7, y: height / 2},
    "8": {x: (width / 13) * 8, y: height / 2},
    "9": {x: (width / 13) * 9, y: height / 2},
    "10": {x: (width / 13) * 10, y: height / 2},
    "11": {x: (width / 13) * 11, y: height / 2},
    "12": {x: (width / 13) * 12, y: height / 2}
  };
 
 //color definition 
  var fill_color = d3.scale.ordinal()
    .domain(["low", "median", "high"])
    .range(["#ea7070", "#ad9d9d", "#6de09d"]);

 
 //custom chart that takes in data 
 var custom_chart = function(data) {
  // console.log("data", data);
    //use the max total_amount in the data as the max in the scale's domain
    max_price = d3.max(data, function(d) { return parseFloat(d.price, 10); }); //function for the max data and parsing it into #
    // console.log("max_price", max_price);
    min_price = d3.min(data, function(d) { return parseFloat(d.price, 10); }); //function for the max data and parsing it into #
    // console.log("min_price", min_price);
    radius_scale = d3.scale.pow().exponent(0.5) //pow.exponent takes in an exponent value
    .domain([0, max_price])
    .range([2, 12]);


 var groupLevel = function(){
    // console.log("the low is 0");
    priceRange = parseFloat(max_price - min_price).toFixed(5);
    // console.log("priceRange", priceRange);
    lowPriceRange = parseFloat(min_price + (priceRange / 3)).toFixed(5);
    // console.log("lowPriceRange", lowPriceRange);
    avePriceRange = parseFloat(min_price + ((priceRange / 3) * 2)).toFixed(5);
    // console.log("avePriceRange", avePriceRange);
    // // highPriceRange = lowPriceRange * 3;
    // // console.log("highPriceRange", highRange);
    // console.log("the high", priceRange);
  };
  groupLevel();

      console.log("data", data);
    //create node objects from original data that will serve as the data behind each bubble in the vis, then add each node to nodes to be used later
    data.forEach(function(d){//The forEach() method executes a provided function once per array element.

      // ***PRICE RANGE CONDITIONALS***
      if (d.price >= min_price && d.price <= lowPriceRange) {
        // console.log("low price range", d.price);
        d.group = "low";
      }
      else if (d.price > lowPriceRange && d.price <= avePriceRange) {
        // console.log("median price range", d.price);
        d.group = "median";
      }
      else if (d.price > avePriceRange && d.price <= max_price) {
        // console.log("high price range", d.price);
        d.group = "high";
      }
      else if (!d.data || !d.id || !d.year) {
      	d.data = 0;
      	d.id = 0;
      	d.year = 0;
      }

  var node = { //refer data json
    month: +(d.month),
    day: +(d.day),
    year: +(d.year),
    id: +(d.month + d.day + d.year),
    price: parseFloat(d.price),
    volume: +(d.totalCirculation),
    group: d.group, 
    radius: radius_scale(parseFloat(d.price, 10)),
    // value: d.price,
    x: Math.random() * 900, //defining x & y for the node to be placed anywhere on the canvas
    y: Math.random() * 800
  };
  // console.log("node", node);
  // if (!d.data) {
  // 	return d.
  // }
  	nodes.push(node); //push node into nodes	
});
    
    //https://github.com/mbostock/d3/wiki/Selections#sort
    nodes.sort(function(a, b) {return b.value - a.value; }); 
    
    //create svg at #vis and then create circle representation for each node
    vis = d3.select("#vis").append("svg") //this "#vis" is in index
                .attr("width", width)
                .attr("height", height)
                .attr("id", "svg_vis"); 

    //creating circles and binding data
    circles = vis.selectAll("circle")
                 .data(nodes, function(d) { return +(d.id) ;});
 

    //appending circle with attributes
    circles.enter().append("circle")
      .attr("r", 0)
      .attr("fill", function(d) { return fill_color(d.group) ;})
      .attr("stroke-width", 2)
      .attr("stroke", function(d) {return d3.rgb(fill_color(d.group)).darker();})
      .attr("id", function(d) { return  "bubble_" + +(d.id); })
      .on("mouseover", function(d, i) {show_details(d, i, this);} ) //used because we need 'this' in the mouse callbacks
      .on("mouseout", function(d, i) {hide_details(d, i, this);} );
 
    //d3 transition; Fancy transition to make bubbles appear, ending with the correct radius
    circles.transition().duration(2000).attr("r", function(d) { return d.radius; });
    circles.exit().remove();
 
  };
 
//charge strength to the specified value. // refers to how nodes in the environment push away from one another or attract one another. Kind of like magnets, nodes have a charge that can be positive (attraction force) or negative (repelling force). 
//The charge of a force layout specifies node-node repulsions, so it could be used to push nodes away from one another, creating this effect. But how can this work with different sizes if charge is just a single parameter?

//The trick is that along with a static value, charge can also take a function, which is evaluated for each node in the layout, passing in that node’s data. Here is the charge function for this visualization: math.pow

//Charge function that is called for each node.
//Charge is proportional to the diameter of the  circle (which is stored in the radius attribute of the circle's associated data.
//This is done to allow for accurate collision detection with nodes of different sizes.
//Charge is negative because we want nodes to repel.
//Dividing by 8 scales down the charge to be appropriate for the visualization dimensions.
  function charge(d) { 
    return -Math.pow(d.radius, 2.0) / 8; //
  }
 
//start the simulation; Starts up the force layout with the default values
  function start() {
    force = d3.layout.force()
            .nodes(nodes)
            .size([width, height]);
  }
 
//GROUPING THE DATA 

  //I. Sets up force layout to display all nodes in one circle; used to configure and startup the force directed simulation:
  function display_group_all() {
    force.gravity(layout_gravity) //force is an instance variable of BubbleChart holding the force layout for the visualization.
         .charge(charge)
         .friction(0.9)
         //The original graphic has some nice transitions between views of the data, where bubbles are pulled apart into separate groups. I’ve replicated this somewhat by having a view that divides up Gate’s grants by year.
        //How is this done? Well, lets start with the all-together view first. The position of each node is determined by the function called for each tick of the simulation. This function gets passed in the tick event, which includes the alpha for this iteration of the simulation.

        //So what this code does is for every tick event, for each circle in @circles, the move_towards_center method is called, with the current alpha value passed in. Then, The cx and cy of each circle is set based on it’s data’s x and y values.
         .on("tick", function(e) {
            circles.each(move_towards_center(e.alpha)) //The circles instance variable holds the svg circles that represent each node.
                   .attr("cx", function(d) {return d.x;})
                   .attr("cy", function(d) {return d.y;});
         });
    force.start();
    hide_years();
  }
 
  //moving the data to the center, alpha starts at 0.1. After a few hundred ticks, alpha is decreased some amount. This continues until alpha is really small (for example 0.005), and then the simulation ends. What this means is that alpha can be used to scale the movement of nodes in the simulation. So at the start, nodes will move relatively quickly. When the simulation is almost over, the nodes will just barely be tweaking their positions

  //So, move_towards_center must be doing something with the data’s x and y values to get things to move.

  //So move_towards_center returns a function that is called for each circle, passing in its data. Inside this function, the x and y values of the data are pushed towards the @center point (which is set to the center of the visualization). This push towards the center is dampened by a constant, 0.02 + @damper and alpha.

  //The alpha dampening allows the push towards the center to be reduced over the course of the simulation, giving other forces like gravity and charge the opportunity to push back. Moves all circles towards the @center of the visualization
  function move_towards_center(alpha) { 
    return function(d) {
      d.x = d.x + (center.x - d.x) * (damper + 0.02) * alpha;
      d.y = d.y + (center.y - d.y) * (damper + 0.02) * alpha;
    };
  }

 //II. grouping all the data by year; Ok, we’ve now seen how the nodes in the simulation move towards one point, what about multiple locations? The code is just about the same:

 //The switch to displaying by year is done by restarting the force simulation. This time the tick function calls move_towards_year. Otherwise it’s about the same as display_group_all.
 //sets the display of bubbles to be separated into each year. Does this by calling move_towards_year
  function displayPriceByYear() {
    force.gravity(layout_gravity) 
         .charge(charge)
         .friction(0.9)
        .on("tick", function(e) {
          circles.each(move_towards_year(e.alpha))
                 .attr("cx", function(d) {return d.x;})
                 .attr("cy", function(d) {return d.y;});
        });
    force.start();
    display_years();
    hide_months();
  }
 
  //moving the data to its respective year; move_towards_year is almost the same as move_towards_center. The difference being that first the correct year point is extracted from @year_centers. Here’s what that variable looks like:
  function move_towards_year(alpha) {
    return function(d) {
      var target = year_centers[d.year];
      d.x = d.x + (target.x - d.x) * (damper + 0.02) * alpha * 1.1; //move_towards_year also multiplies by 1.1 to speed up the transition a bit.
      d.y = d.y + (target.y - d.y) * (damper + 0.02) * alpha * 1.1;
    };
  }

 
  //Method to display year titles, setting up area for split years; this is just an associative array where each year has its own location to move towards.
  function display_years() {
      // var years_x = {"2013": 160, "2014": width / 2, "2015": width - 160};
      var years_x = {"2009": width / 8, "2010": (width / 8) * 2, "2011": (width / 8) * 3,"2012": (width / 8) * 4,"2013": (width / 8) * 5,"2014": (width / 8) * 6,"2015": (width / 8) * 7};
      var years_data = d3.keys(years_x);
      var years = vis.selectAll(".years")
                 .data(years_data);
 
      years.enter().append("text")
                   .attr("class", "years")
                   .attr("x", function(d) { return years_x[d]; }  )
                   .attr("y", 40)
                   .attr("text-anchor", "middle")
                   .text(function(d) { return d;});
 
  }
 //Method to hide year titiles
  function hide_years() {
      var years = vis.selectAll(".years").remove();
  }

 // III. grouping all the data by CIRCULATION (by year)
  function displayCirculationByMonth() {
    force.gravity(layout_gravity)
         .charge(charge)
         .friction(0.9)
        .on("tick", function(e) {
          // console.log("e", e);
          circles.each(moveCirculationTowardsMonth(e.alpha))
                 .attr("cx", function(d) { return d.x;})
                 .attr("cy", function(d) { return d.y;});
        });
    force.start();
    display_months();
    hide_years();
  }
 
  // moving the CIRCULATION data to its respective year
  function moveCirculationTowardsMonth(alpha) {
    return function(d) {
      // console.log("d", d);
      var target = month_centers[d.month];
      // console.log("target", target);
      d.x = d.x + (target.x - d.x) * (damper + 0.02) * alpha * 1.1;
      d.y = d.y + (target.y - d.y) * (damper + 0.02) * alpha * 1.1;
    };
  }
 
  function display_months() {
      var months_x = {"1": width / 13, "2": (width / 13) * 2, "3": (width / 13) * 3, "4": (width / 13) * 4, "5": (width / 13) * 5, "6": (width / 13) * 6, "7": (width / 13) * 7, "8": (width / 13) * 8, "9": (width / 13) * 9, "10": (width / 13) * 10, "11": (width / 13) * 11, "12": (width / 13) * 12};
      var months_data = d3.keys(months_x);
      var months = vis.selectAll(".months")
                 .data(months_data);
 
      months.enter().append("text")
                   .attr("class", "months")
                   .attr("x", function(d) { return months_x[d]; }  )
                   .attr("y", 40)
                   .attr("text-anchor", "middle")
                   .text(function(d) { return d;});
 
  }
  function hide_months() {
      var months = vis.selectAll(".months").remove();
  }


 
 //tooltip to show data details for each element
 //this cannot be moved to 
  function show_details(data, i, element) {
    d3.select(element).attr("stroke", "#fff");
    var content = "<span class=\"name\">Price:</span><span class=\"value\"> $ " + addCommas(data.price) + "</span><br/>";
    content +="<span class=\"name\">Year:</span><span class=\"value\"> " + data.year + "</span>";
    content +="<span class=\"name\">Date:</span><span class=\"value\"> " + data.month + "/" + data.day + "/" + data.year + "</span>";
    tooltip.showTooltip(content, d3.event);
  }
 //tooltip to hide data details till executred
  function hide_details(data, i, element) {
    d3.select(element).attr("stroke", function(d) { return d3.rgb(fill_color(d.group)).darker();} );
    tooltip.hideTooltip();
  }

  //collects display_all and display_year in an object and returns that object, initializing D3
  var my_mod = {};
  my_mod.init = function (_data) { //what is _data? .init is initializing 
    custom_chart(_data);
    start();
    //console.log(my_mod);
  };
 
  my_mod.display_all = display_group_all; //display all charts
  my_mod.display_year = displayPriceByYear; //display year
  my_mod.display_volume = displayCirculationByMonth; // display volume by year
  my_mod.toggle_view = function(view_type) { 
    if (view_type == 'year') {
      displayPriceByYear();
    } 
    else if (view_type == 'circulation') {
      displayCirculationByMonth();
    } 
    else {
      display_group_all();
      }
    };
 
  return my_mod;
})(d3, CustomTooltip); //pass d3 and customToolTip

//*********CUSTOM TOOLTIP******** 
function CustomTooltip(tooltipId, width){
  var tooltipId = tooltipId;
  $("body").append("<div class='tooltip' id='"+tooltipId+"'></div>");
  
  if(width){
    $("#"+tooltipId).css("w-th", width);
  }
  
  hideTooltip();
  
  function showTooltip(content, event){
    $("#"+tooltipId).html(content);
    $("#"+tooltipId).show();
    
    updatePosition(event);
  }
  
  function hideTooltip(){
    $("#"+tooltipId).hide();
  }
  
  function updatePosition(event){
    var ttid = "#"+tooltipId;
    var xOffset = 20;
    var yOffset = 10;
    
     var ttw = $(ttid).width();
     var tth = $(ttid).height();
     var wscrY = $(window).scrollTop();
     var wscrX = $(window).scrollLeft();
     var curX = (document.all) ? event.clientX + wscrX : event.pageX;
     var curY = (document.all) ? event.clientY + wscrY : event.pageY;
     var ttleft = ((curX - wscrX + xOffset*2 + ttw) > $(window).width()) ? curX - ttw - xOffset*2 : curX + xOffset;
     if (ttleft < wscrX + xOffset){
      ttleft = wscrX + xOffset;
     } 
     var tttop = ((curY - wscrY + yOffset*2 + tth) > $(window).height()) ? curY - tth - yOffset*2 : curY + yOffset;
     if (tttop < wscrY + yOffset){
      tttop = curY + yOffset;
     } 
     $(ttid).css('top', tttop + 'px').css('left', ttleft + 'px');
  }
  
  return {
    showTooltip: showTooltip,
    hideTooltip: hideTooltip,
    updatePosition: updatePosition
  };
}

//part of tooltip, adding commas
function addCommas(nStr)
{
 nStr += '';
 x = nStr.split('.');
 x1 = x[0];
 x2 = x.length > 1 ? '.' + x[1] : '';
 var rgx = /(\d+)(\d{3})/;
 while (rgx.test(x1)) {
   x1 = x1.replace(rgx, '$1' + ',' + '$2');
 }
 return x1 + x2;
}

//*********DATA*********
var bitcurveData = [
    {
        "month": "1",
        "day": "3",
        "year": "2009",
        "price": "0",
        "totalCirculation": "50",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "1",
        "totalOutputVolumeValue": "50",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "1",
        "day": "4",
        "year": "2009",
        "price": "0",
        "totalCirculation": "50",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "0",
        "totalOutputVolumeValue": "0",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "1",
        "day": "5",
        "year": "2009",
        "price": "0",
        "totalCirculation": "50",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "0",
        "totalOutputVolumeValue": "0",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "1",
        "day": "6",
        "year": "2009",
        "price": "0",
        "totalCirculation": "50",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "0",
        "totalOutputVolumeValue": "0",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "1",
        "day": "7",
        "year": "2009",
        "price": "0",
        "totalCirculation": "50",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "0",
        "totalOutputVolumeValue": "0",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "1",
        "day": "8",
        "year": "2009",
        "price": "0",
        "totalCirculation": "50",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "0",
        "totalOutputVolumeValue": "0",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "1",
        "day": "9",
        "year": "2009",
        "price": "0",
        "totalCirculation": "750",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "14",
        "totalOutputVolumeValue": "700",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "1",
        "day": "10",
        "year": "2009",
        "price": "0",
        "totalCirculation": "2300",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "31",
        "totalOutputVolumeValue": "1550",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "1",
        "day": "11",
        "year": "2009",
        "price": "0",
        "totalCirculation": "7600",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "106",
        "totalOutputVolumeValue": "5300",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "1",
        "day": "12",
        "year": "2009",
        "price": "0",
        "totalCirculation": "12050",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "96",
        "totalOutputVolumeValue": "4601",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "1",
        "day": "13",
        "year": "2009",
        "price": "0",
        "totalCirculation": "17800",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "117",
        "totalOutputVolumeValue": "5778",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "1",
        "day": "14",
        "year": "2009",
        "price": "0",
        "totalCirculation": "24100",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "126",
        "totalOutputVolumeValue": "6300",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "1",
        "day": "15",
        "year": "2009",
        "price": "0",
        "totalCirculation": "30450",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "136",
        "totalOutputVolumeValue": "6911",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "1",
        "day": "16",
        "year": "2009",
        "price": "0",
        "totalCirculation": "36250",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "117",
        "totalOutputVolumeValue": "5900",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "1",
        "day": "17",
        "year": "2009",
        "price": "0",
        "totalCirculation": "41650",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "109",
        "totalOutputVolumeValue": "5500",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "1",
        "day": "18",
        "year": "2009",
        "price": "0",
        "totalCirculation": "46700",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "101",
        "totalOutputVolumeValue": "5050",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "1",
        "day": "19",
        "year": "2009",
        "price": "0",
        "totalCirculation": "52650",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "120",
        "totalOutputVolumeValue": "6100",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "1",
        "day": "20",
        "year": "2009",
        "price": "0",
        "totalCirculation": "58450",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "118",
        "totalOutputVolumeValue": "6575",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "1",
        "day": "21",
        "year": "2009",
        "price": "0",
        "totalCirculation": "64100",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "115",
        "totalOutputVolumeValue": "6150",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "1",
        "day": "22",
        "year": "2009",
        "price": "0",
        "totalCirculation": "67850",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "76",
        "totalOutputVolumeValue": "4250",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "1",
        "day": "23",
        "year": "2009",
        "price": "0",
        "totalCirculation": "71200",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "68",
        "totalOutputVolumeValue": "3500",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "1",
        "day": "24",
        "year": "2009",
        "price": "0",
        "totalCirculation": "81150",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "201",
        "totalOutputVolumeValue": "10750",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "1",
        "day": "25",
        "year": "2009",
        "price": "0",
        "totalCirculation": "90850",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "195",
        "totalOutputVolumeValue": "9750",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "1",
        "day": "26",
        "year": "2009",
        "price": "0",
        "totalCirculation": "96650",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "116",
        "totalOutputVolumeValue": "5800",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "1",
        "day": "27",
        "year": "2009",
        "price": "0",
        "totalCirculation": "101800",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "105",
        "totalOutputVolumeValue": "6300",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "1",
        "day": "28",
        "year": "2009",
        "price": "0",
        "totalCirculation": "106950",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "103",
        "totalOutputVolumeValue": "5150",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "1",
        "day": "29",
        "year": "2009",
        "price": "0",
        "totalCirculation": "113050",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "122",
        "totalOutputVolumeValue": "6100",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "1",
        "day": "30",
        "year": "2009",
        "price": "0",
        "totalCirculation": "119100",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "122",
        "totalOutputVolumeValue": "6650",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "1",
        "day": "31",
        "year": "2009",
        "price": "0",
        "totalCirculation": "125550",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "129",
        "totalOutputVolumeValue": "6450",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "2",
        "day": "1",
        "year": "2009",
        "price": "0",
        "totalCirculation": "131350",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "118",
        "totalOutputVolumeValue": "6900",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "2",
        "day": "2",
        "year": "2009",
        "price": "0",
        "totalCirculation": "137700",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "127",
        "totalOutputVolumeValue": "6350",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "2",
        "day": "3",
        "year": "2009",
        "price": "0",
        "totalCirculation": "144500",
        "totalTransactionFees": "2.01",
        "numberOfUniqueBitcoinAddressesUsed": "145",
        "totalOutputVolumeValue": "7436.52",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "2",
        "day": "4",
        "year": "2009",
        "price": "0",
        "totalCirculation": "150650",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "129",
        "totalOutputVolumeValue": "6300",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "2",
        "day": "5",
        "year": "2009",
        "price": "0",
        "totalCirculation": "156700",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "121",
        "totalOutputVolumeValue": "6050",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "2",
        "day": "6",
        "year": "2009",
        "price": "0",
        "totalCirculation": "163150",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "129",
        "totalOutputVolumeValue": "6450",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "2",
        "day": "7",
        "year": "2009",
        "price": "0",
        "totalCirculation": "169450",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "131",
        "totalOutputVolumeValue": "7498",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "2",
        "day": "8",
        "year": "2009",
        "price": "0",
        "totalCirculation": "176150",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "135",
        "totalOutputVolumeValue": "7700",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "2",
        "day": "9",
        "year": "2009",
        "price": "0",
        "totalCirculation": "182550",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "129",
        "totalOutputVolumeValue": "8600",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "2",
        "day": "10",
        "year": "2009",
        "price": "0",
        "totalCirculation": "188900",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "127",
        "totalOutputVolumeValue": "6350",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "2",
        "day": "11",
        "year": "2009",
        "price": "0",
        "totalCirculation": "195450",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "132",
        "totalOutputVolumeValue": "6900.04",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "2",
        "day": "12",
        "year": "2009",
        "price": "0",
        "totalCirculation": "201350",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "119",
        "totalOutputVolumeValue": "6100",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "2",
        "day": "13",
        "year": "2009",
        "price": "0",
        "totalCirculation": "207550",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "124",
        "totalOutputVolumeValue": "6200",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "2",
        "day": "14",
        "year": "2009",
        "price": "0",
        "totalCirculation": "214600",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "141",
        "totalOutputVolumeValue": "7050",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "2",
        "day": "15",
        "year": "2009",
        "price": "0",
        "totalCirculation": "220700",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "125",
        "totalOutputVolumeValue": "7000",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "2",
        "day": "16",
        "year": "2009",
        "price": "0",
        "totalCirculation": "226850",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "123",
        "totalOutputVolumeValue": "6150",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "2",
        "day": "17",
        "year": "2009",
        "price": "0",
        "totalCirculation": "232750",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "119",
        "totalOutputVolumeValue": "7400",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "2",
        "day": "18",
        "year": "2009",
        "price": "0",
        "totalCirculation": "238950",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "124",
        "totalOutputVolumeValue": "6200",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "2",
        "day": "19",
        "year": "2009",
        "price": "0",
        "totalCirculation": "244800",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "117",
        "totalOutputVolumeValue": "5850",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "2",
        "day": "20",
        "year": "2009",
        "price": "0",
        "totalCirculation": "251200",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "129",
        "totalOutputVolumeValue": "7200",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "2",
        "day": "21",
        "year": "2009",
        "price": "0",
        "totalCirculation": "256700",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "110",
        "totalOutputVolumeValue": "5500",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "2",
        "day": "22",
        "year": "2009",
        "price": "0",
        "totalCirculation": "262750",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "125",
        "totalOutputVolumeValue": "7100",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "2",
        "day": "23",
        "year": "2009",
        "price": "0",
        "totalCirculation": "268100",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "107",
        "totalOutputVolumeValue": "5350",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "2",
        "day": "24",
        "year": "2009",
        "price": "0",
        "totalCirculation": "273650",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "111",
        "totalOutputVolumeValue": "5550",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "2",
        "day": "25",
        "year": "2009",
        "price": "0",
        "totalCirculation": "279000",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "107",
        "totalOutputVolumeValue": "5350",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "2",
        "day": "26",
        "year": "2009",
        "price": "0",
        "totalCirculation": "283800",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "96",
        "totalOutputVolumeValue": "4800",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "2",
        "day": "27",
        "year": "2009",
        "price": "0",
        "totalCirculation": "289950",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "123",
        "totalOutputVolumeValue": "6150",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "2",
        "day": "28",
        "year": "2009",
        "price": "0",
        "totalCirculation": "295050",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "103",
        "totalOutputVolumeValue": "6900",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "3",
        "day": "1",
        "year": "2009",
        "price": "0",
        "totalCirculation": "300350",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "107",
        "totalOutputVolumeValue": "5650",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "3",
        "day": "2",
        "year": "2009",
        "price": "0",
        "totalCirculation": "305550",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "104",
        "totalOutputVolumeValue": "5200",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "3",
        "day": "3",
        "year": "2009",
        "price": "0",
        "totalCirculation": "310850",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "107",
        "totalOutputVolumeValue": "5700",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "3",
        "day": "4",
        "year": "2009",
        "price": "0",
        "totalCirculation": "316150",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "106",
        "totalOutputVolumeValue": "5300",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "3",
        "day": "5",
        "year": "2009",
        "price": "0",
        "totalCirculation": "321450",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "108",
        "totalOutputVolumeValue": "6550",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "3",
        "day": "6",
        "year": "2009",
        "price": "0",
        "totalCirculation": "327350",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "119",
        "totalOutputVolumeValue": "6300",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "3",
        "day": "7",
        "year": "2009",
        "price": "0",
        "totalCirculation": "332900",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "111",
        "totalOutputVolumeValue": "5550",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "3",
        "day": "8",
        "year": "2009",
        "price": "0",
        "totalCirculation": "338500",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "115",
        "totalOutputVolumeValue": "7150",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "3",
        "day": "9",
        "year": "2009",
        "price": "0",
        "totalCirculation": "344150",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "113",
        "totalOutputVolumeValue": "5650",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "3",
        "day": "10",
        "year": "2009",
        "price": "0",
        "totalCirculation": "349400",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "105",
        "totalOutputVolumeValue": "5250",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "3",
        "day": "11",
        "year": "2009",
        "price": "0",
        "totalCirculation": "354800",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "108",
        "totalOutputVolumeValue": "5400",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "3",
        "day": "12",
        "year": "2009",
        "price": "0",
        "totalCirculation": "360700",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "119",
        "totalOutputVolumeValue": "6050",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "3",
        "day": "13",
        "year": "2009",
        "price": "0",
        "totalCirculation": "366400",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "115",
        "totalOutputVolumeValue": "6450",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "3",
        "day": "14",
        "year": "2009",
        "price": "0",
        "totalCirculation": "372200",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "116",
        "totalOutputVolumeValue": "5800",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "3",
        "day": "15",
        "year": "2009",
        "price": "0",
        "totalCirculation": "377750",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "111",
        "totalOutputVolumeValue": "5550",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "3",
        "day": "16",
        "year": "2009",
        "price": "0",
        "totalCirculation": "384250",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "131",
        "totalOutputVolumeValue": "8900",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "3",
        "day": "17",
        "year": "2009",
        "price": "0",
        "totalCirculation": "390000",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "115",
        "totalOutputVolumeValue": "5750",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "3",
        "day": "18",
        "year": "2009",
        "price": "0",
        "totalCirculation": "395500",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "110",
        "totalOutputVolumeValue": "5500",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "3",
        "day": "19",
        "year": "2009",
        "price": "0",
        "totalCirculation": "401600",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "123",
        "totalOutputVolumeValue": "6800",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "3",
        "day": "20",
        "year": "2009",
        "price": "0",
        "totalCirculation": "407500",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "119",
        "totalOutputVolumeValue": "6500",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "3",
        "day": "21",
        "year": "2009",
        "price": "0",
        "totalCirculation": "411350",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "77",
        "totalOutputVolumeValue": "3850",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "3",
        "day": "22",
        "year": "2009",
        "price": "0",
        "totalCirculation": "416100",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "96",
        "totalOutputVolumeValue": "5300",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "3",
        "day": "23",
        "year": "2009",
        "price": "0",
        "totalCirculation": "422700",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "132",
        "totalOutputVolumeValue": "6600",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "3",
        "day": "24",
        "year": "2009",
        "price": "0",
        "totalCirculation": "427950",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "105",
        "totalOutputVolumeValue": "5250",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "3",
        "day": "25",
        "year": "2009",
        "price": "0",
        "totalCirculation": "433750",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "116",
        "totalOutputVolumeValue": "5800",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "3",
        "day": "26",
        "year": "2009",
        "price": "0",
        "totalCirculation": "439400",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "114",
        "totalOutputVolumeValue": "7050",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "3",
        "day": "27",
        "year": "2009",
        "price": "0",
        "totalCirculation": "444900",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "110",
        "totalOutputVolumeValue": "5500",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "3",
        "day": "28",
        "year": "2009",
        "price": "0",
        "totalCirculation": "450850",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "120",
        "totalOutputVolumeValue": "6950",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "3",
        "day": "29",
        "year": "2009",
        "price": "0",
        "totalCirculation": "456450",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "112",
        "totalOutputVolumeValue": "5600",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "3",
        "day": "30",
        "year": "2009",
        "price": "0",
        "totalCirculation": "462700",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "125",
        "totalOutputVolumeValue": "6250",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "3",
        "day": "31",
        "year": "2009",
        "price": "0",
        "totalCirculation": "468350",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "114",
        "totalOutputVolumeValue": "7250",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "4",
        "day": "1",
        "year": "2009",
        "price": "0",
        "totalCirculation": "473700",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "107",
        "totalOutputVolumeValue": "5350",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "4",
        "day": "2",
        "year": "2009",
        "price": "0",
        "totalCirculation": "479700",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "120",
        "totalOutputVolumeValue": "6000",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "4",
        "day": "3",
        "year": "2009",
        "price": "0",
        "totalCirculation": "485350",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "113",
        "totalOutputVolumeValue": "5650",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "4",
        "day": "4",
        "year": "2009",
        "price": "0",
        "totalCirculation": "491000",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "113",
        "totalOutputVolumeValue": "5650",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "4",
        "day": "5",
        "year": "2009",
        "price": "0",
        "totalCirculation": "497450",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "129",
        "totalOutputVolumeValue": "6450",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "4",
        "day": "6",
        "year": "2009",
        "price": "0",
        "totalCirculation": "503200",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "116",
        "totalOutputVolumeValue": "6600",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "4",
        "day": "7",
        "year": "2009",
        "price": "0",
        "totalCirculation": "508150",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "99",
        "totalOutputVolumeValue": "4950",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "4",
        "day": "8",
        "year": "2009",
        "price": "0",
        "totalCirculation": "513350",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "104",
        "totalOutputVolumeValue": "5200",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "4",
        "day": "9",
        "year": "2009",
        "price": "0",
        "totalCirculation": "518300",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "99",
        "totalOutputVolumeValue": "4950",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "4",
        "day": "10",
        "year": "2009",
        "price": "0",
        "totalCirculation": "523450",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "103",
        "totalOutputVolumeValue": "5150",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "4",
        "day": "11",
        "year": "2009",
        "price": "0",
        "totalCirculation": "529550",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "123",
        "totalOutputVolumeValue": "6450",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "4",
        "day": "12",
        "year": "2009",
        "price": "0",
        "totalCirculation": "535300",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "115",
        "totalOutputVolumeValue": "5750",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "4",
        "day": "13",
        "year": "2009",
        "price": "0",
        "totalCirculation": "541050",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "119",
        "totalOutputVolumeValue": "6750",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "4",
        "day": "14",
        "year": "2009",
        "price": "0",
        "totalCirculation": "547400",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "127",
        "totalOutputVolumeValue": "6350",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "4",
        "day": "15",
        "year": "2009",
        "price": "0",
        "totalCirculation": "553000",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "112",
        "totalOutputVolumeValue": "5600",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "4",
        "day": "16",
        "year": "2009",
        "price": "0",
        "totalCirculation": "559150",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "123",
        "totalOutputVolumeValue": "6150",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "4",
        "day": "17",
        "year": "2009",
        "price": "0",
        "totalCirculation": "564900",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "115",
        "totalOutputVolumeValue": "5750",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "4",
        "day": "18",
        "year": "2009",
        "price": "0",
        "totalCirculation": "571000",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "125",
        "totalOutputVolumeValue": "6232.51",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "4",
        "day": "19",
        "year": "2009",
        "price": "0",
        "totalCirculation": "576950",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "121",
        "totalOutputVolumeValue": "6400",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "4",
        "day": "20",
        "year": "2009",
        "price": "0",
        "totalCirculation": "582800",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "118",
        "totalOutputVolumeValue": "8100",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "4",
        "day": "21",
        "year": "2009",
        "price": "0",
        "totalCirculation": "588950",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "126",
        "totalOutputVolumeValue": "9700",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "4",
        "day": "22",
        "year": "2009",
        "price": "0",
        "totalCirculation": "595000",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "121",
        "totalOutputVolumeValue": "6050",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "4",
        "day": "23",
        "year": "2009",
        "price": "0",
        "totalCirculation": "599000",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "80",
        "totalOutputVolumeValue": "4000",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "4",
        "day": "24",
        "year": "2009",
        "price": "0",
        "totalCirculation": "604650",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "113",
        "totalOutputVolumeValue": "5650",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "4",
        "day": "25",
        "year": "2009",
        "price": "0",
        "totalCirculation": "610750",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "122",
        "totalOutputVolumeValue": "6100",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "4",
        "day": "26",
        "year": "2009",
        "price": "0",
        "totalCirculation": "616200",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "110",
        "totalOutputVolumeValue": "6200",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "4",
        "day": "27",
        "year": "2009",
        "price": "0",
        "totalCirculation": "621450",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "105",
        "totalOutputVolumeValue": "5250",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "4",
        "day": "28",
        "year": "2009",
        "price": "0",
        "totalCirculation": "627300",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "117",
        "totalOutputVolumeValue": "5850",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "4",
        "day": "29",
        "year": "2009",
        "price": "0",
        "totalCirculation": "633450",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "123",
        "totalOutputVolumeValue": "6150",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "4",
        "day": "30",
        "year": "2009",
        "price": "0",
        "totalCirculation": "640050",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "133",
        "totalOutputVolumeValue": "7600",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "5",
        "day": "1",
        "year": "2009",
        "price": "0",
        "totalCirculation": "646200",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "123",
        "totalOutputVolumeValue": "6150",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "5",
        "day": "2",
        "year": "2009",
        "price": "0",
        "totalCirculation": "652350",
        "totalTransactionFees": "0.03",
        "numberOfUniqueBitcoinAddressesUsed": "125",
        "totalOutputVolumeValue": "6200",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "5",
        "day": "3",
        "year": "2009",
        "price": "0",
        "totalCirculation": "658050",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "116",
        "totalOutputVolumeValue": "6399.94",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "5",
        "day": "4",
        "year": "2009",
        "price": "0",
        "totalCirculation": "664150",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "126",
        "totalOutputVolumeValue": "6210",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "5",
        "day": "5",
        "year": "2009",
        "price": "0",
        "totalCirculation": "670750",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "133",
        "totalOutputVolumeValue": "8100",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "5",
        "day": "6",
        "year": "2009",
        "price": "0",
        "totalCirculation": "677600",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "138",
        "totalOutputVolumeValue": "7350",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "5",
        "day": "7",
        "year": "2009",
        "price": "0",
        "totalCirculation": "683650",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "121",
        "totalOutputVolumeValue": "6050",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "5",
        "day": "8",
        "year": "2009",
        "price": "0",
        "totalCirculation": "689750",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "122",
        "totalOutputVolumeValue": "6100",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "5",
        "day": "9",
        "year": "2009",
        "price": "0",
        "totalCirculation": "694300",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "91",
        "totalOutputVolumeValue": "4550",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "5",
        "day": "10",
        "year": "2009",
        "price": "0",
        "totalCirculation": "697400",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "62",
        "totalOutputVolumeValue": "3100",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "5",
        "day": "11",
        "year": "2009",
        "price": "0",
        "totalCirculation": "703350",
        "totalTransactionFees": "0.1",
        "numberOfUniqueBitcoinAddressesUsed": "121",
        "totalOutputVolumeValue": "6050",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "5",
        "day": "12",
        "year": "2009",
        "price": "0",
        "totalCirculation": "709700",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "127",
        "totalOutputVolumeValue": "6350",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "5",
        "day": "13",
        "year": "2009",
        "price": "0",
        "totalCirculation": "715450",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "118",
        "totalOutputVolumeValue": "5850",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "5",
        "day": "14",
        "year": "2009",
        "price": "0",
        "totalCirculation": "722100",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "138",
        "totalOutputVolumeValue": "6800.01",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "5",
        "day": "15",
        "year": "2009",
        "price": "0",
        "totalCirculation": "729250",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "146",
        "totalOutputVolumeValue": "7249.99",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "5",
        "day": "16",
        "year": "2009",
        "price": "0",
        "totalCirculation": "734950",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "115",
        "totalOutputVolumeValue": "6200",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "5",
        "day": "17",
        "year": "2009",
        "price": "0",
        "totalCirculation": "741200",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "125",
        "totalOutputVolumeValue": "6250",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "5",
        "day": "18",
        "year": "2009",
        "price": "0",
        "totalCirculation": "747400",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "124",
        "totalOutputVolumeValue": "6200",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "5",
        "day": "19",
        "year": "2009",
        "price": "0",
        "totalCirculation": "752400",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "100",
        "totalOutputVolumeValue": "5000",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "5",
        "day": "20",
        "year": "2009",
        "price": "0",
        "totalCirculation": "757600",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "104",
        "totalOutputVolumeValue": "5200",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "5",
        "day": "21",
        "year": "2009",
        "price": "0",
        "totalCirculation": "762050",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "89",
        "totalOutputVolumeValue": "4450",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "5",
        "day": "22",
        "year": "2009",
        "price": "0",
        "totalCirculation": "766200",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "83",
        "totalOutputVolumeValue": "4150",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "5",
        "day": "23",
        "year": "2009",
        "price": "0",
        "totalCirculation": "766550",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "7",
        "totalOutputVolumeValue": "350",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "5",
        "day": "24",
        "year": "2009",
        "price": "0",
        "totalCirculation": "771350",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "96",
        "totalOutputVolumeValue": "4800",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "5",
        "day": "25",
        "year": "2009",
        "price": "0",
        "totalCirculation": "776950",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "112",
        "totalOutputVolumeValue": "5600",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "5",
        "day": "26",
        "year": "2009",
        "price": "0",
        "totalCirculation": "782600",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "113",
        "totalOutputVolumeValue": "5650",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "5",
        "day": "27",
        "year": "2009",
        "price": "0",
        "totalCirculation": "788850",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "125",
        "totalOutputVolumeValue": "6250",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "5",
        "day": "28",
        "year": "2009",
        "price": "0",
        "totalCirculation": "794000",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "103",
        "totalOutputVolumeValue": "5150",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "5",
        "day": "29",
        "year": "2009",
        "price": "0",
        "totalCirculation": "799350",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "108",
        "totalOutputVolumeValue": "8350",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "5",
        "day": "30",
        "year": "2009",
        "price": "0",
        "totalCirculation": "804500",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "103",
        "totalOutputVolumeValue": "5150",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "5",
        "day": "31",
        "year": "2009",
        "price": "0",
        "totalCirculation": "810400",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "118",
        "totalOutputVolumeValue": "5900",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "6",
        "day": "1",
        "year": "2009",
        "price": "0",
        "totalCirculation": "814050",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "75",
        "totalOutputVolumeValue": "3700",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "6",
        "day": "2",
        "year": "2009",
        "price": "0",
        "totalCirculation": "818500",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "89",
        "totalOutputVolumeValue": "4450",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "6",
        "day": "3",
        "year": "2009",
        "price": "0",
        "totalCirculation": "823400",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "98",
        "totalOutputVolumeValue": "4900",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "6",
        "day": "4",
        "year": "2009",
        "price": "0",
        "totalCirculation": "825350",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "39",
        "totalOutputVolumeValue": "1950",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "6",
        "day": "5",
        "year": "2009",
        "price": "0",
        "totalCirculation": "828200",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "57",
        "totalOutputVolumeValue": "2850",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "6",
        "day": "6",
        "year": "2009",
        "price": "0",
        "totalCirculation": "829400",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "24",
        "totalOutputVolumeValue": "1200",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "6",
        "day": "7",
        "year": "2009",
        "price": "0",
        "totalCirculation": "829600",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "4",
        "totalOutputVolumeValue": "200",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "6",
        "day": "8",
        "year": "2009",
        "price": "0",
        "totalCirculation": "833200",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "72",
        "totalOutputVolumeValue": "3600",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "6",
        "day": "9",
        "year": "2009",
        "price": "0",
        "totalCirculation": "837900",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "94",
        "totalOutputVolumeValue": "4700",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "6",
        "day": "10",
        "year": "2009",
        "price": "0",
        "totalCirculation": "842050",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "83",
        "totalOutputVolumeValue": "4150",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "6",
        "day": "11",
        "year": "2009",
        "price": "0",
        "totalCirculation": "846700",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "93",
        "totalOutputVolumeValue": "4650",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "6",
        "day": "12",
        "year": "2009",
        "price": "0",
        "totalCirculation": "851250",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "91",
        "totalOutputVolumeValue": "4550",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "6",
        "day": "13",
        "year": "2009",
        "price": "0",
        "totalCirculation": "854950",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "74",
        "totalOutputVolumeValue": "3700",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "6",
        "day": "14",
        "year": "2009",
        "price": "0",
        "totalCirculation": "858450",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "70",
        "totalOutputVolumeValue": "3500",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "6",
        "day": "15",
        "year": "2009",
        "price": "0",
        "totalCirculation": "862550",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "82",
        "totalOutputVolumeValue": "4100",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "6",
        "day": "16",
        "year": "2009",
        "price": "0",
        "totalCirculation": "866200",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "73",
        "totalOutputVolumeValue": "3650",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "6",
        "day": "17",
        "year": "2009",
        "price": "0",
        "totalCirculation": "870050",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "77",
        "totalOutputVolumeValue": "3850",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "6",
        "day": "18",
        "year": "2009",
        "price": "0",
        "totalCirculation": "874100",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "81",
        "totalOutputVolumeValue": "4050",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "6",
        "day": "19",
        "year": "2009",
        "price": "0",
        "totalCirculation": "878450",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "87",
        "totalOutputVolumeValue": "4350",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "6",
        "day": "20",
        "year": "2009",
        "price": "0",
        "totalCirculation": "882650",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "84",
        "totalOutputVolumeValue": "4200",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "6",
        "day": "21",
        "year": "2009",
        "price": "0",
        "totalCirculation": "886400",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "75",
        "totalOutputVolumeValue": "3750",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "6",
        "day": "22",
        "year": "2009",
        "price": "0",
        "totalCirculation": "890400",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "81",
        "totalOutputVolumeValue": "7000",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "6",
        "day": "23",
        "year": "2009",
        "price": "0",
        "totalCirculation": "894200",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "76",
        "totalOutputVolumeValue": "3800",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "6",
        "day": "24",
        "year": "2009",
        "price": "0",
        "totalCirculation": "898450",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "88",
        "totalOutputVolumeValue": "4398.98",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "6",
        "day": "25",
        "year": "2009",
        "price": "0",
        "totalCirculation": "902150",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "74",
        "totalOutputVolumeValue": "3700",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "6",
        "day": "26",
        "year": "2009",
        "price": "0",
        "totalCirculation": "906600",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "90",
        "totalOutputVolumeValue": "5450",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "6",
        "day": "27",
        "year": "2009",
        "price": "0",
        "totalCirculation": "910850",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "85",
        "totalOutputVolumeValue": "4250",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "6",
        "day": "28",
        "year": "2009",
        "price": "0",
        "totalCirculation": "913400",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "53",
        "totalOutputVolumeValue": "2600",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "6",
        "day": "29",
        "year": "2009",
        "price": "0",
        "totalCirculation": "917200",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "76",
        "totalOutputVolumeValue": "3800",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "6",
        "day": "30",
        "year": "2009",
        "price": "0",
        "totalCirculation": "921550",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "89",
        "totalOutputVolumeValue": "4495",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "7",
        "day": "1",
        "year": "2009",
        "price": "0",
        "totalCirculation": "925700",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "84",
        "totalOutputVolumeValue": "4250",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "7",
        "day": "2",
        "year": "2009",
        "price": "0",
        "totalCirculation": "929300",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "72",
        "totalOutputVolumeValue": "3600",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "7",
        "day": "3",
        "year": "2009",
        "price": "0",
        "totalCirculation": "933450",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "85",
        "totalOutputVolumeValue": "4200",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "7",
        "day": "4",
        "year": "2009",
        "price": "0",
        "totalCirculation": "937900",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "89",
        "totalOutputVolumeValue": "4450",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "7",
        "day": "5",
        "year": "2009",
        "price": "0",
        "totalCirculation": "941900",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "80",
        "totalOutputVolumeValue": "4000",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "7",
        "day": "6",
        "year": "2009",
        "price": "0",
        "totalCirculation": "946450",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "91",
        "totalOutputVolumeValue": "4550",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "7",
        "day": "7",
        "year": "2009",
        "price": "0",
        "totalCirculation": "949600",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "63",
        "totalOutputVolumeValue": "3150",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "7",
        "day": "8",
        "year": "2009",
        "price": "0",
        "totalCirculation": "953550",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "79",
        "totalOutputVolumeValue": "3950",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "7",
        "day": "9",
        "year": "2009",
        "price": "0",
        "totalCirculation": "957600",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "81",
        "totalOutputVolumeValue": "4050",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "7",
        "day": "10",
        "year": "2009",
        "price": "0",
        "totalCirculation": "961700",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "82",
        "totalOutputVolumeValue": "4100",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "7",
        "day": "11",
        "year": "2009",
        "price": "0",
        "totalCirculation": "965900",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "84",
        "totalOutputVolumeValue": "4200",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "7",
        "day": "12",
        "year": "2009",
        "price": "0",
        "totalCirculation": "969700",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "76",
        "totalOutputVolumeValue": "3800",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "7",
        "day": "13",
        "year": "2009",
        "price": "0",
        "totalCirculation": "973500",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "76",
        "totalOutputVolumeValue": "3800",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "7",
        "day": "14",
        "year": "2009",
        "price": "0",
        "totalCirculation": "977100",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "72",
        "totalOutputVolumeValue": "3600",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "7",
        "day": "15",
        "year": "2009",
        "price": "0",
        "totalCirculation": "979400",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "46",
        "totalOutputVolumeValue": "2300",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "7",
        "day": "16",
        "year": "2009",
        "price": "0",
        "totalCirculation": "982850",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "69",
        "totalOutputVolumeValue": "3450",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "7",
        "day": "17",
        "year": "2009",
        "price": "0",
        "totalCirculation": "986100",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "65",
        "totalOutputVolumeValue": "3250",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "7",
        "day": "18",
        "year": "2009",
        "price": "0",
        "totalCirculation": "986250",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "3",
        "totalOutputVolumeValue": "150",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "7",
        "day": "19",
        "year": "2009",
        "price": "0",
        "totalCirculation": "988850",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "52",
        "totalOutputVolumeValue": "2600",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "7",
        "day": "20",
        "year": "2009",
        "price": "0",
        "totalCirculation": "992600",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "75",
        "totalOutputVolumeValue": "3750",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "7",
        "day": "21",
        "year": "2009",
        "price": "0",
        "totalCirculation": "996300",
        "totalTransactionFees": "0.14",
        "numberOfUniqueBitcoinAddressesUsed": "76",
        "totalOutputVolumeValue": "9749.67",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "7",
        "day": "22",
        "year": "2009",
        "price": "0",
        "totalCirculation": "999750",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "69",
        "totalOutputVolumeValue": "3450",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "7",
        "day": "23",
        "year": "2009",
        "price": "0",
        "totalCirculation": "1003050",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "66",
        "totalOutputVolumeValue": "3300",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "7",
        "day": "24",
        "year": "2009",
        "price": "0",
        "totalCirculation": "1006800",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "75",
        "totalOutputVolumeValue": "3750",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "7",
        "day": "25",
        "year": "2009",
        "price": "0",
        "totalCirculation": "1009450",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "53",
        "totalOutputVolumeValue": "2650",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "7",
        "day": "26",
        "year": "2009",
        "price": "0",
        "totalCirculation": "1010100",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "13",
        "totalOutputVolumeValue": "650",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "7",
        "day": "27",
        "year": "2009",
        "price": "0",
        "totalCirculation": "1013300",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "64",
        "totalOutputVolumeValue": "3200",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "7",
        "day": "28",
        "year": "2009",
        "price": "0",
        "totalCirculation": "1015500",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "44",
        "totalOutputVolumeValue": "2200",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "7",
        "day": "29",
        "year": "2009",
        "price": "0",
        "totalCirculation": "1017100",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "32",
        "totalOutputVolumeValue": "1600",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "7",
        "day": "30",
        "year": "2009",
        "price": "0",
        "totalCirculation": "1017800",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "17",
        "totalOutputVolumeValue": "850",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "7",
        "day": "31",
        "year": "2009",
        "price": "0",
        "totalCirculation": "1018400",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "12",
        "totalOutputVolumeValue": "600",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "8",
        "day": "1",
        "year": "2009",
        "price": "0",
        "totalCirculation": "1019550",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "23",
        "totalOutputVolumeValue": "1150",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "8",
        "day": "2",
        "year": "2009",
        "price": "0",
        "totalCirculation": "1021050",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "30",
        "totalOutputVolumeValue": "1500",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "8",
        "day": "3",
        "year": "2009",
        "price": "0",
        "totalCirculation": "1021800",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "15",
        "totalOutputVolumeValue": "750",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "8",
        "day": "4",
        "year": "2009",
        "price": "0",
        "totalCirculation": "1024700",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "58",
        "totalOutputVolumeValue": "2900",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "8",
        "day": "5",
        "year": "2009",
        "price": "0",
        "totalCirculation": "1029250",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "91",
        "totalOutputVolumeValue": "4550",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "8",
        "day": "6",
        "year": "2009",
        "price": "0",
        "totalCirculation": "1034050",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "96",
        "totalOutputVolumeValue": "4800",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "8",
        "day": "7",
        "year": "2009",
        "price": "0",
        "totalCirculation": "1037750",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "74",
        "totalOutputVolumeValue": "3700",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "8",
        "day": "8",
        "year": "2009",
        "price": "0",
        "totalCirculation": "1041850",
        "totalTransactionFees": "0.13",
        "numberOfUniqueBitcoinAddressesUsed": "84",
        "totalOutputVolumeValue": "9649.53",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "8",
        "day": "9",
        "year": "2009",
        "price": "0",
        "totalCirculation": "1046750",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "98",
        "totalOutputVolumeValue": "4900",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "8",
        "day": "10",
        "year": "2009",
        "price": "0",
        "totalCirculation": "1050850",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "82",
        "totalOutputVolumeValue": "4100",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "8",
        "day": "11",
        "year": "2009",
        "price": "0",
        "totalCirculation": "1054200",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "67",
        "totalOutputVolumeValue": "3350",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "8",
        "day": "12",
        "year": "2009",
        "price": "0",
        "totalCirculation": "1057600",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "68",
        "totalOutputVolumeValue": "3400",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "8",
        "day": "13",
        "year": "2009",
        "price": "0",
        "totalCirculation": "1061650",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "81",
        "totalOutputVolumeValue": "4050",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "8",
        "day": "14",
        "year": "2009",
        "price": "0",
        "totalCirculation": "1064900",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "65",
        "totalOutputVolumeValue": "3250",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "8",
        "day": "15",
        "year": "2009",
        "price": "0",
        "totalCirculation": "1066600",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "34",
        "totalOutputVolumeValue": "1700",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "8",
        "day": "16",
        "year": "2009",
        "price": "0",
        "totalCirculation": "1067850",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "25",
        "totalOutputVolumeValue": "1250",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "8",
        "day": "17",
        "year": "2009",
        "price": "0",
        "totalCirculation": "1068700",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "17",
        "totalOutputVolumeValue": "850",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "8",
        "day": "18",
        "year": "2009",
        "price": "0",
        "totalCirculation": "1069150",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "9",
        "totalOutputVolumeValue": "450",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "8",
        "day": "19",
        "year": "2009",
        "price": "0",
        "totalCirculation": "1069900",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "15",
        "totalOutputVolumeValue": "750",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "8",
        "day": "20",
        "year": "2009",
        "price": "0",
        "totalCirculation": "1071100",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "24",
        "totalOutputVolumeValue": "1200",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "8",
        "day": "21",
        "year": "2009",
        "price": "0",
        "totalCirculation": "1071900",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "16",
        "totalOutputVolumeValue": "800",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "8",
        "day": "22",
        "year": "2009",
        "price": "0",
        "totalCirculation": "1072300",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "8",
        "totalOutputVolumeValue": "400",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "8",
        "day": "23",
        "year": "2009",
        "price": "0",
        "totalCirculation": "1072900",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "12",
        "totalOutputVolumeValue": "600",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "8",
        "day": "24",
        "year": "2009",
        "price": "0",
        "totalCirculation": "1073300",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "8",
        "totalOutputVolumeValue": "400",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "8",
        "day": "25",
        "year": "2009",
        "price": "0",
        "totalCirculation": "1076050",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "55",
        "totalOutputVolumeValue": "2750",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "8",
        "day": "26",
        "year": "2009",
        "price": "0",
        "totalCirculation": "1078150",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "42",
        "totalOutputVolumeValue": "2100",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "8",
        "day": "27",
        "year": "2009",
        "price": "0",
        "totalCirculation": "1079650",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "34",
        "totalOutputVolumeValue": "3848.06",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "8",
        "day": "28",
        "year": "2009",
        "price": "0",
        "totalCirculation": "1082850",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "64",
        "totalOutputVolumeValue": "3200",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "8",
        "day": "29",
        "year": "2009",
        "price": "0",
        "totalCirculation": "1087000",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "83",
        "totalOutputVolumeValue": "4150",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "8",
        "day": "30",
        "year": "2009",
        "price": "0",
        "totalCirculation": "1091500",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "91",
        "totalOutputVolumeValue": "4550",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "8",
        "day": "31",
        "year": "2009",
        "price": "0",
        "totalCirculation": "1096200",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "95",
        "totalOutputVolumeValue": "5000",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "9",
        "day": "1",
        "year": "2009",
        "price": "0",
        "totalCirculation": "1100150",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "79",
        "totalOutputVolumeValue": "3950",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "9",
        "day": "2",
        "year": "2009",
        "price": "0",
        "totalCirculation": "1103550",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "68",
        "totalOutputVolumeValue": "3400",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "9",
        "day": "3",
        "year": "2009",
        "price": "0",
        "totalCirculation": "1106550",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "61",
        "totalOutputVolumeValue": "3700",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "9",
        "day": "4",
        "year": "2009",
        "price": "0",
        "totalCirculation": "1109700",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "63",
        "totalOutputVolumeValue": "3150",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "9",
        "day": "5",
        "year": "2009",
        "price": "0",
        "totalCirculation": "1113250",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "71",
        "totalOutputVolumeValue": "3550",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "9",
        "day": "6",
        "year": "2009",
        "price": "0",
        "totalCirculation": "1116850",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "72",
        "totalOutputVolumeValue": "3600",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "9",
        "day": "7",
        "year": "2009",
        "price": "0",
        "totalCirculation": "1120750",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "79",
        "totalOutputVolumeValue": "4550",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "9",
        "day": "8",
        "year": "2009",
        "price": "0",
        "totalCirculation": "1124050",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "66",
        "totalOutputVolumeValue": "3300",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "9",
        "day": "9",
        "year": "2009",
        "price": "0",
        "totalCirculation": "1126950",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "58",
        "totalOutputVolumeValue": "2900",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "9",
        "day": "10",
        "year": "2009",
        "price": "0",
        "totalCirculation": "1130000",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "61",
        "totalOutputVolumeValue": "3050",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "9",
        "day": "11",
        "year": "2009",
        "price": "0",
        "totalCirculation": "1133400",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "68",
        "totalOutputVolumeValue": "3400",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "9",
        "day": "12",
        "year": "2009",
        "price": "0",
        "totalCirculation": "1136950",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "71",
        "totalOutputVolumeValue": "3550",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "9",
        "day": "13",
        "year": "2009",
        "price": "0",
        "totalCirculation": "1140450",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "70",
        "totalOutputVolumeValue": "3500",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "9",
        "day": "14",
        "year": "2009",
        "price": "0",
        "totalCirculation": "1144500",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "81",
        "totalOutputVolumeValue": "4050",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "9",
        "day": "15",
        "year": "2009",
        "price": "0",
        "totalCirculation": "1147300",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "56",
        "totalOutputVolumeValue": "2800",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "9",
        "day": "16",
        "year": "2009",
        "price": "0",
        "totalCirculation": "1150200",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "59",
        "totalOutputVolumeValue": "2901",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "9",
        "day": "17",
        "year": "2009",
        "price": "0",
        "totalCirculation": "1154350",
        "totalTransactionFees": "0.12",
        "numberOfUniqueBitcoinAddressesUsed": "85",
        "totalOutputVolumeValue": "9200",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "9",
        "day": "18",
        "year": "2009",
        "price": "0",
        "totalCirculation": "1158400",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "81",
        "totalOutputVolumeValue": "4050",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "9",
        "day": "19",
        "year": "2009",
        "price": "0",
        "totalCirculation": "1161950",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "71",
        "totalOutputVolumeValue": "3550",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "9",
        "day": "20",
        "year": "2009",
        "price": "0",
        "totalCirculation": "1165900",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "79",
        "totalOutputVolumeValue": "3950",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "9",
        "day": "21",
        "year": "2009",
        "price": "0",
        "totalCirculation": "1169600",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "74",
        "totalOutputVolumeValue": "3700",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "9",
        "day": "22",
        "year": "2009",
        "price": "0",
        "totalCirculation": "1171300",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "35",
        "totalOutputVolumeValue": "2100",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "9",
        "day": "23",
        "year": "2009",
        "price": "0",
        "totalCirculation": "1172650",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "28",
        "totalOutputVolumeValue": "3350",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "9",
        "day": "24",
        "year": "2009",
        "price": "0",
        "totalCirculation": "1176750",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "82",
        "totalOutputVolumeValue": "4100",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "9",
        "day": "25",
        "year": "2009",
        "price": "0",
        "totalCirculation": "1181750",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "102",
        "totalOutputVolumeValue": "6300",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "9",
        "day": "26",
        "year": "2009",
        "price": "0",
        "totalCirculation": "1186450",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "94",
        "totalOutputVolumeValue": "4700",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "9",
        "day": "27",
        "year": "2009",
        "price": "0",
        "totalCirculation": "1190900",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "90",
        "totalOutputVolumeValue": "5250",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "9",
        "day": "28",
        "year": "2009",
        "price": "0",
        "totalCirculation": "1195300",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "88",
        "totalOutputVolumeValue": "4400",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "9",
        "day": "29",
        "year": "2009",
        "price": "0",
        "totalCirculation": "1199450",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "85",
        "totalOutputVolumeValue": "6300",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "9",
        "day": "30",
        "year": "2009",
        "price": "0",
        "totalCirculation": "1203800",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "87",
        "totalOutputVolumeValue": "4350",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "10",
        "day": "1",
        "year": "2009",
        "price": "0",
        "totalCirculation": "1208050",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "85",
        "totalOutputVolumeValue": "4250",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "10",
        "day": "2",
        "year": "2009",
        "price": "0",
        "totalCirculation": "1211800",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "76",
        "totalOutputVolumeValue": "4250",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "10",
        "day": "3",
        "year": "2009",
        "price": "0",
        "totalCirculation": "1214700",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "58",
        "totalOutputVolumeValue": "2900",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "10",
        "day": "4",
        "year": "2009",
        "price": "0",
        "totalCirculation": "1217750",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "61",
        "totalOutputVolumeValue": "3050",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "10",
        "day": "5",
        "year": "2009",
        "price": "0",
        "totalCirculation": "1220650",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "58",
        "totalOutputVolumeValue": "2900",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "10",
        "day": "6",
        "year": "2009",
        "price": "0",
        "totalCirculation": "1222700",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "42",
        "totalOutputVolumeValue": "2950",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "10",
        "day": "7",
        "year": "2009",
        "price": "0",
        "totalCirculation": "1225250",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "51",
        "totalOutputVolumeValue": "2550",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "10",
        "day": "8",
        "year": "2009",
        "price": "0",
        "totalCirculation": "1228750",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "70",
        "totalOutputVolumeValue": "3500",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "10",
        "day": "9",
        "year": "2009",
        "price": "0",
        "totalCirculation": "1232650",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "78",
        "totalOutputVolumeValue": "3900",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "10",
        "day": "10",
        "year": "2009",
        "price": "0",
        "totalCirculation": "1236500",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "77",
        "totalOutputVolumeValue": "3850",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "10",
        "day": "11",
        "year": "2009",
        "price": "0",
        "totalCirculation": "1240450",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "79",
        "totalOutputVolumeValue": "3950",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "10",
        "day": "12",
        "year": "2009",
        "price": "0",
        "totalCirculation": "1243550",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "63",
        "totalOutputVolumeValue": "8150",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "10",
        "day": "13",
        "year": "2009",
        "price": "0",
        "totalCirculation": "1246100",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "51",
        "totalOutputVolumeValue": "2550",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "10",
        "day": "14",
        "year": "2009",
        "price": "0",
        "totalCirculation": "1248900",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "56",
        "totalOutputVolumeValue": "2800",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "10",
        "day": "15",
        "year": "2009",
        "price": "0",
        "totalCirculation": "1253150",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "85",
        "totalOutputVolumeValue": "4250",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "10",
        "day": "16",
        "year": "2009",
        "price": "0",
        "totalCirculation": "1256400",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "66",
        "totalOutputVolumeValue": "12950",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "10",
        "day": "17",
        "year": "2009",
        "price": "0",
        "totalCirculation": "1259150",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "55",
        "totalOutputVolumeValue": "2750",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "10",
        "day": "18",
        "year": "2009",
        "price": "0",
        "totalCirculation": "1262350",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "65",
        "totalOutputVolumeValue": "3550",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "10",
        "day": "19",
        "year": "2009",
        "price": "0",
        "totalCirculation": "1267300",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "99",
        "totalOutputVolumeValue": "4950",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "10",
        "day": "20",
        "year": "2009",
        "price": "0",
        "totalCirculation": "1272850",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "111",
        "totalOutputVolumeValue": "5550",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "10",
        "day": "21",
        "year": "2009",
        "price": "0",
        "totalCirculation": "1277000",
        "totalTransactionFees": "0.12",
        "numberOfUniqueBitcoinAddressesUsed": "85",
        "totalOutputVolumeValue": "9199.88",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "10",
        "day": "22",
        "year": "2009",
        "price": "0",
        "totalCirculation": "1281300",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "88",
        "totalOutputVolumeValue": "17149.76",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "10",
        "day": "23",
        "year": "2009",
        "price": "0",
        "totalCirculation": "1285650",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "87",
        "totalOutputVolumeValue": "4350",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "10",
        "day": "24",
        "year": "2009",
        "price": "0",
        "totalCirculation": "1289400",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "75",
        "totalOutputVolumeValue": "3750",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "10",
        "day": "25",
        "year": "2009",
        "price": "0",
        "totalCirculation": "1293050",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "74",
        "totalOutputVolumeValue": "15900",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "10",
        "day": "26",
        "year": "2009",
        "price": "0",
        "totalCirculation": "1296300",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "65",
        "totalOutputVolumeValue": "3250",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "10",
        "day": "27",
        "year": "2009",
        "price": "0",
        "totalCirculation": "1299600",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "67",
        "totalOutputVolumeValue": "16300",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "10",
        "day": "28",
        "year": "2009",
        "price": "0",
        "totalCirculation": "1302800",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "64",
        "totalOutputVolumeValue": "3200",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "10",
        "day": "29",
        "year": "2009",
        "price": "0",
        "totalCirculation": "1305300",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "51",
        "totalOutputVolumeValue": "3000",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "10",
        "day": "30",
        "year": "2009",
        "price": "0",
        "totalCirculation": "1308350",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "62",
        "totalOutputVolumeValue": "4600",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "10",
        "day": "31",
        "year": "2009",
        "price": "0",
        "totalCirculation": "1310600",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "45",
        "totalOutputVolumeValue": "2250",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "11",
        "day": "1",
        "year": "2009",
        "price": "0",
        "totalCirculation": "1312100",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "30",
        "totalOutputVolumeValue": "1500",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "11",
        "day": "2",
        "year": "2009",
        "price": "0",
        "totalCirculation": "1313750",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "33",
        "totalOutputVolumeValue": "1650",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "11",
        "day": "3",
        "year": "2009",
        "price": "0",
        "totalCirculation": "1316600",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "57",
        "totalOutputVolumeValue": "2850",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "11",
        "day": "4",
        "year": "2009",
        "price": "0",
        "totalCirculation": "1319700",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "62",
        "totalOutputVolumeValue": "3100",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "11",
        "day": "5",
        "year": "2009",
        "price": "0",
        "totalCirculation": "1322900",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "65",
        "totalOutputVolumeValue": "18700",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "11",
        "day": "6",
        "year": "2009",
        "price": "0",
        "totalCirculation": "1325350",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "49",
        "totalOutputVolumeValue": "2450",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "11",
        "day": "7",
        "year": "2009",
        "price": "0",
        "totalCirculation": "1329150",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "76",
        "totalOutputVolumeValue": "3800",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "11",
        "day": "8",
        "year": "2009",
        "price": "0",
        "totalCirculation": "1332650",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "70",
        "totalOutputVolumeValue": "3500",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "11",
        "day": "9",
        "year": "2009",
        "price": "0",
        "totalCirculation": "1335900",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "65",
        "totalOutputVolumeValue": "3250",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "11",
        "day": "10",
        "year": "2009",
        "price": "0",
        "totalCirculation": "1339450",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "71",
        "totalOutputVolumeValue": "3550",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "11",
        "day": "11",
        "year": "2009",
        "price": "0",
        "totalCirculation": "1342900",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "71",
        "totalOutputVolumeValue": "93450",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "11",
        "day": "12",
        "year": "2009",
        "price": "0",
        "totalCirculation": "1346400",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "70",
        "totalOutputVolumeValue": "3500",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "11",
        "day": "13",
        "year": "2009",
        "price": "0",
        "totalCirculation": "1349900",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "73",
        "totalOutputVolumeValue": "4100",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "11",
        "day": "14",
        "year": "2009",
        "price": "0",
        "totalCirculation": "1354050",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "83",
        "totalOutputVolumeValue": "4150",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "11",
        "day": "15",
        "year": "2009",
        "price": "0",
        "totalCirculation": "1358850",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "96",
        "totalOutputVolumeValue": "4800",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "11",
        "day": "16",
        "year": "2009",
        "price": "0",
        "totalCirculation": "1363850",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "100",
        "totalOutputVolumeValue": "5000",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "11",
        "day": "17",
        "year": "2009",
        "price": "0",
        "totalCirculation": "1368400",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "91",
        "totalOutputVolumeValue": "4550",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "11",
        "day": "18",
        "year": "2009",
        "price": "0",
        "totalCirculation": "1372350",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "79",
        "totalOutputVolumeValue": "3950",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "11",
        "day": "19",
        "year": "2009",
        "price": "0",
        "totalCirculation": "1376000",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "73",
        "totalOutputVolumeValue": "3650",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "11",
        "day": "20",
        "year": "2009",
        "price": "0",
        "totalCirculation": "1380100",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "84",
        "totalOutputVolumeValue": "48450",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "11",
        "day": "21",
        "year": "2009",
        "price": "0",
        "totalCirculation": "1383950",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "77",
        "totalOutputVolumeValue": "3850",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "11",
        "day": "22",
        "year": "2009",
        "price": "0",
        "totalCirculation": "1388950",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "100",
        "totalOutputVolumeValue": "5000",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "11",
        "day": "23",
        "year": "2009",
        "price": "0",
        "totalCirculation": "1393750",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "96",
        "totalOutputVolumeValue": "4800",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "11",
        "day": "24",
        "year": "2009",
        "price": "0",
        "totalCirculation": "1398850",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "102",
        "totalOutputVolumeValue": "5100",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "11",
        "day": "25",
        "year": "2009",
        "price": "0",
        "totalCirculation": "1403100",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "85",
        "totalOutputVolumeValue": "4250",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "11",
        "day": "26",
        "year": "2009",
        "price": "0",
        "totalCirculation": "1407000",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "78",
        "totalOutputVolumeValue": "3900",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "11",
        "day": "27",
        "year": "2009",
        "price": "0",
        "totalCirculation": "1410750",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "75",
        "totalOutputVolumeValue": "3750",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "11",
        "day": "28",
        "year": "2009",
        "price": "0",
        "totalCirculation": "1414650",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "78",
        "totalOutputVolumeValue": "3900",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "11",
        "day": "29",
        "year": "2009",
        "price": "0",
        "totalCirculation": "1417550",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "58",
        "totalOutputVolumeValue": "2900",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "11",
        "day": "30",
        "year": "2009",
        "price": "0",
        "totalCirculation": "1421250",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "74",
        "totalOutputVolumeValue": "3700",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "12",
        "day": "1",
        "year": "2009",
        "price": "0",
        "totalCirculation": "1424550",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "66",
        "totalOutputVolumeValue": "3300",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "12",
        "day": "2",
        "year": "2009",
        "price": "0",
        "totalCirculation": "1429450",
        "totalTransactionFees": "0.22",
        "numberOfUniqueBitcoinAddressesUsed": "100",
        "totalOutputVolumeValue": "14950",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "12",
        "day": "3",
        "year": "2009",
        "price": "0",
        "totalCirculation": "1433700",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "85",
        "totalOutputVolumeValue": "4250",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "12",
        "day": "4",
        "year": "2009",
        "price": "0",
        "totalCirculation": "1436150",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "49",
        "totalOutputVolumeValue": "2450",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "12",
        "day": "5",
        "year": "2009",
        "price": "0",
        "totalCirculation": "1438750",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "52",
        "totalOutputVolumeValue": "2600",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "12",
        "day": "6",
        "year": "2009",
        "price": "0",
        "totalCirculation": "1444000",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "109",
        "totalOutputVolumeValue": "6290",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "12",
        "day": "7",
        "year": "2009",
        "price": "0",
        "totalCirculation": "1448700",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "94",
        "totalOutputVolumeValue": "4700",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "12",
        "day": "8",
        "year": "2009",
        "price": "0",
        "totalCirculation": "1454650",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "120",
        "totalOutputVolumeValue": "7450",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "12",
        "day": "9",
        "year": "2009",
        "price": "0",
        "totalCirculation": "1459350",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "104",
        "totalOutputVolumeValue": "6985",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "12",
        "day": "10",
        "year": "2009",
        "price": "0",
        "totalCirculation": "1464500",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "108",
        "totalOutputVolumeValue": "5220",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "12",
        "day": "11",
        "year": "2009",
        "price": "0",
        "totalCirculation": "1470750",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "125",
        "totalOutputVolumeValue": "6250",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "12",
        "day": "12",
        "year": "2009",
        "price": "0",
        "totalCirculation": "1475800",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "102",
        "totalOutputVolumeValue": "10250",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "12",
        "day": "13",
        "year": "2009",
        "price": "0",
        "totalCirculation": "1481000",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "104",
        "totalOutputVolumeValue": "5200",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "12",
        "day": "14",
        "year": "2009",
        "price": "0",
        "totalCirculation": "1486400",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "114",
        "totalOutputVolumeValue": "37945.7",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "12",
        "day": "15",
        "year": "2009",
        "price": "0",
        "totalCirculation": "1492200",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "117",
        "totalOutputVolumeValue": "11250",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "12",
        "day": "16",
        "year": "2009",
        "price": "0",
        "totalCirculation": "1498150",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "122",
        "totalOutputVolumeValue": "6809",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "12",
        "day": "17",
        "year": "2009",
        "price": "0",
        "totalCirculation": "1506200",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "164",
        "totalOutputVolumeValue": "8300",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "12",
        "day": "18",
        "year": "2009",
        "price": "0",
        "totalCirculation": "1516200",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "202",
        "totalOutputVolumeValue": "10049.5",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "12",
        "day": "19",
        "year": "2009",
        "price": "0",
        "totalCirculation": "1527400",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "225",
        "totalOutputVolumeValue": "11250",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "12",
        "day": "20",
        "year": "2009",
        "price": "0",
        "totalCirculation": "1536150",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "175",
        "totalOutputVolumeValue": "8750",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "12",
        "day": "21",
        "year": "2009",
        "price": "0",
        "totalCirculation": "1545500",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "188",
        "totalOutputVolumeValue": "9400",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "12",
        "day": "22",
        "year": "2009",
        "price": "0",
        "totalCirculation": "1553100",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "152",
        "totalOutputVolumeValue": "7600",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "12",
        "day": "23",
        "year": "2009",
        "price": "0",
        "totalCirculation": "1561550",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "169",
        "totalOutputVolumeValue": "8450",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "12",
        "day": "24",
        "year": "2009",
        "price": "0",
        "totalCirculation": "1568750",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "144",
        "totalOutputVolumeValue": "7200",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "12",
        "day": "25",
        "year": "2009",
        "price": "0",
        "totalCirculation": "1576600",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "159",
        "totalOutputVolumeValue": "7900",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "12",
        "day": "26",
        "year": "2009",
        "price": "0",
        "totalCirculation": "1584550",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "159",
        "totalOutputVolumeValue": "7950",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "12",
        "day": "27",
        "year": "2009",
        "price": "0",
        "totalCirculation": "1593000",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "170",
        "totalOutputVolumeValue": "8700",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "12",
        "day": "28",
        "year": "2009",
        "price": "0",
        "totalCirculation": "1599900",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "138",
        "totalOutputVolumeValue": "6900",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "12",
        "day": "29",
        "year": "2009",
        "price": "0",
        "totalCirculation": "1608100",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "164",
        "totalOutputVolumeValue": "8200",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "12",
        "day": "30",
        "year": "2009",
        "price": "0",
        "totalCirculation": "1615900",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "156",
        "totalOutputVolumeValue": "7800",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "12",
        "day": "31",
        "year": "2009",
        "price": "0",
        "totalCirculation": "1623400",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "150",
        "totalOutputVolumeValue": "7500",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "1",
        "day": "1",
        "year": "2010",
        "price": "0",
        "totalCirculation": "1629350",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "119",
        "totalOutputVolumeValue": "5950",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "1",
        "day": "2",
        "year": "2010",
        "price": "0",
        "totalCirculation": "1635850",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "132",
        "totalOutputVolumeValue": "6600",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "1",
        "day": "3",
        "year": "2010",
        "price": "0",
        "totalCirculation": "1644000",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "163",
        "totalOutputVolumeValue": "8150",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "1",
        "day": "4",
        "year": "2010",
        "price": "0",
        "totalCirculation": "1653500",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "193",
        "totalOutputVolumeValue": "30304.35",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "1",
        "day": "5",
        "year": "2010",
        "price": "0",
        "totalCirculation": "1663900",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "208",
        "totalOutputVolumeValue": "10400",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "1",
        "day": "6",
        "year": "2010",
        "price": "0",
        "totalCirculation": "1671800",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "158",
        "totalOutputVolumeValue": "7900",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "1",
        "day": "7",
        "year": "2010",
        "price": "0",
        "totalCirculation": "1679750",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "159",
        "totalOutputVolumeValue": "7950",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "1",
        "day": "8",
        "year": "2010",
        "price": "0",
        "totalCirculation": "1687250",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "150",
        "totalOutputVolumeValue": "7500",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "1",
        "day": "9",
        "year": "2010",
        "price": "0",
        "totalCirculation": "1694650",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "148",
        "totalOutputVolumeValue": "7400",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "1",
        "day": "10",
        "year": "2010",
        "price": "0",
        "totalCirculation": "1704200",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "191",
        "totalOutputVolumeValue": "9550",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "1",
        "day": "11",
        "year": "2010",
        "price": "0",
        "totalCirculation": "1711900",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "154",
        "totalOutputVolumeValue": "7700",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "1",
        "day": "12",
        "year": "2010",
        "price": "0",
        "totalCirculation": "1720200",
        "totalTransactionFees": "0.26",
        "numberOfUniqueBitcoinAddressesUsed": "169",
        "totalOutputVolumeValue": "19099.88",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "1",
        "day": "13",
        "year": "2010",
        "price": "0",
        "totalCirculation": "1728100",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "162",
        "totalOutputVolumeValue": "7958",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "1",
        "day": "14",
        "year": "2010",
        "price": "0",
        "totalCirculation": "1736000",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "160",
        "totalOutputVolumeValue": "7905",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "1",
        "day": "15",
        "year": "2010",
        "price": "0",
        "totalCirculation": "1742800",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "137",
        "totalOutputVolumeValue": "7200",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "1",
        "day": "16",
        "year": "2010",
        "price": "0",
        "totalCirculation": "1749500",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "135",
        "totalOutputVolumeValue": "6900.74",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "1",
        "day": "17",
        "year": "2010",
        "price": "0",
        "totalCirculation": "1755650",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "124",
        "totalOutputVolumeValue": "6401",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "1",
        "day": "18",
        "year": "2010",
        "price": "0",
        "totalCirculation": "1762150",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "130",
        "totalOutputVolumeValue": "6500",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "1",
        "day": "19",
        "year": "2010",
        "price": "0",
        "totalCirculation": "1768100",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "121",
        "totalOutputVolumeValue": "6000",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "1",
        "day": "20",
        "year": "2010",
        "price": "0",
        "totalCirculation": "1775100",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "140",
        "totalOutputVolumeValue": "7000",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "1",
        "day": "21",
        "year": "2010",
        "price": "0",
        "totalCirculation": "1784000",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "186",
        "totalOutputVolumeValue": "9588.29",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "1",
        "day": "22",
        "year": "2010",
        "price": "0",
        "totalCirculation": "1791500",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "151",
        "totalOutputVolumeValue": "7700",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "1",
        "day": "23",
        "year": "2010",
        "price": "0",
        "totalCirculation": "1799050",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "153",
        "totalOutputVolumeValue": "7600",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "1",
        "day": "24",
        "year": "2010",
        "price": "0",
        "totalCirculation": "1806300",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "148",
        "totalOutputVolumeValue": "7351",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "1",
        "day": "25",
        "year": "2010",
        "price": "0",
        "totalCirculation": "1816450",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "207",
        "totalOutputVolumeValue": "13450",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "1",
        "day": "26",
        "year": "2010",
        "price": "0",
        "totalCirculation": "1826550",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "208",
        "totalOutputVolumeValue": "10973",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "1",
        "day": "27",
        "year": "2010",
        "price": "0",
        "totalCirculation": "1835400",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "178",
        "totalOutputVolumeValue": "9050",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "1",
        "day": "28",
        "year": "2010",
        "price": "0",
        "totalCirculation": "1844050",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "174",
        "totalOutputVolumeValue": "10500",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "1",
        "day": "29",
        "year": "2010",
        "price": "0",
        "totalCirculation": "1853700",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "195",
        "totalOutputVolumeValue": "10200",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "1",
        "day": "30",
        "year": "2010",
        "price": "0",
        "totalCirculation": "1862700",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "181",
        "totalOutputVolumeValue": "9800",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "1",
        "day": "31",
        "year": "2010",
        "price": "0",
        "totalCirculation": "1873000",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "210",
        "totalOutputVolumeValue": "11950",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "2",
        "day": "1",
        "year": "2010",
        "price": "0",
        "totalCirculation": "1881950",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "188",
        "totalOutputVolumeValue": "12300",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "2",
        "day": "2",
        "year": "2010",
        "price": "0",
        "totalCirculation": "1889050",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "142",
        "totalOutputVolumeValue": "7100",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "2",
        "day": "3",
        "year": "2010",
        "price": "0",
        "totalCirculation": "1901200",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "244",
        "totalOutputVolumeValue": "13500",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "2",
        "day": "4",
        "year": "2010",
        "price": "0",
        "totalCirculation": "1912750",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "236",
        "totalOutputVolumeValue": "11999.99",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "2",
        "day": "5",
        "year": "2010",
        "price": "0",
        "totalCirculation": "1925000",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "250",
        "totalOutputVolumeValue": "26099",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "2",
        "day": "6",
        "year": "2010",
        "price": "0",
        "totalCirculation": "1934550",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "193",
        "totalOutputVolumeValue": "10850",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "2",
        "day": "7",
        "year": "2010",
        "price": "0",
        "totalCirculation": "1944900",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "212",
        "totalOutputVolumeValue": "11249",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "2",
        "day": "8",
        "year": "2010",
        "price": "0",
        "totalCirculation": "1955450",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "221",
        "totalOutputVolumeValue": "17603",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "2",
        "day": "9",
        "year": "2010",
        "price": "0",
        "totalCirculation": "1965900",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "211",
        "totalOutputVolumeValue": "10650",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "2",
        "day": "10",
        "year": "2010",
        "price": "0",
        "totalCirculation": "1973850",
        "totalTransactionFees": "0.44",
        "numberOfUniqueBitcoinAddressesUsed": "165",
        "totalOutputVolumeValue": "59000",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "2",
        "day": "11",
        "year": "2010",
        "price": "0",
        "totalCirculation": "1982750",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "180",
        "totalOutputVolumeValue": "9700",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "2",
        "day": "12",
        "year": "2010",
        "price": "0",
        "totalCirculation": "1992100",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "194",
        "totalOutputVolumeValue": "18200",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "2",
        "day": "13",
        "year": "2010",
        "price": "0",
        "totalCirculation": "2003300",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "226",
        "totalOutputVolumeValue": "13399",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "2",
        "day": "14",
        "year": "2010",
        "price": "0",
        "totalCirculation": "2013600",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "214",
        "totalOutputVolumeValue": "35474.51",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "2",
        "day": "15",
        "year": "2010",
        "price": "0",
        "totalCirculation": "2022850",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "194",
        "totalOutputVolumeValue": "12450",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "2",
        "day": "16",
        "year": "2010",
        "price": "0",
        "totalCirculation": "2031600",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "185",
        "totalOutputVolumeValue": "10899.98",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "2",
        "day": "17",
        "year": "2010",
        "price": "0",
        "totalCirculation": "2043200",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "241",
        "totalOutputVolumeValue": "65173.13",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "2",
        "day": "18",
        "year": "2010",
        "price": "0",
        "totalCirculation": "2054650",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "234",
        "totalOutputVolumeValue": "18911.74",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "2",
        "day": "19",
        "year": "2010",
        "price": "0",
        "totalCirculation": "2063600",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "185",
        "totalOutputVolumeValue": "9749.98",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "2",
        "day": "20",
        "year": "2010",
        "price": "0",
        "totalCirculation": "2074700",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "224",
        "totalOutputVolumeValue": "11150.03",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "2",
        "day": "21",
        "year": "2010",
        "price": "0",
        "totalCirculation": "2085400",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "218",
        "totalOutputVolumeValue": "12266.83",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "2",
        "day": "22",
        "year": "2010",
        "price": "0",
        "totalCirculation": "2098150",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "262",
        "totalOutputVolumeValue": "32350",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "2",
        "day": "23",
        "year": "2010",
        "price": "0",
        "totalCirculation": "2110700",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "252",
        "totalOutputVolumeValue": "12600",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "2",
        "day": "24",
        "year": "2010",
        "price": "0",
        "totalCirculation": "2120200",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "195",
        "totalOutputVolumeValue": "14800",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "2",
        "day": "25",
        "year": "2010",
        "price": "0",
        "totalCirculation": "2127600",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "150",
        "totalOutputVolumeValue": "8100",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "2",
        "day": "26",
        "year": "2010",
        "price": "0",
        "totalCirculation": "2136100",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "176",
        "totalOutputVolumeValue": "29349",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "2",
        "day": "27",
        "year": "2010",
        "price": "0",
        "totalCirculation": "2144750",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "176",
        "totalOutputVolumeValue": "9101",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "2",
        "day": "28",
        "year": "2010",
        "price": "0",
        "totalCirculation": "2152850",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "165",
        "totalOutputVolumeValue": "13399",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "3",
        "day": "1",
        "year": "2010",
        "price": "0",
        "totalCirculation": "2162150",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "187",
        "totalOutputVolumeValue": "10300",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "3",
        "day": "2",
        "year": "2010",
        "price": "0",
        "totalCirculation": "2171950",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "203",
        "totalOutputVolumeValue": "12400",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "3",
        "day": "3",
        "year": "2010",
        "price": "0",
        "totalCirculation": "2179350",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "150",
        "totalOutputVolumeValue": "7650",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "3",
        "day": "4",
        "year": "2010",
        "price": "0",
        "totalCirculation": "2188450",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "187",
        "totalOutputVolumeValue": "19400",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "3",
        "day": "5",
        "year": "2010",
        "price": "0",
        "totalCirculation": "2197200",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "178",
        "totalOutputVolumeValue": "27900",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "3",
        "day": "6",
        "year": "2010",
        "price": "0",
        "totalCirculation": "2206350",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "187",
        "totalOutputVolumeValue": "32797.39",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "3",
        "day": "7",
        "year": "2010",
        "price": "0",
        "totalCirculation": "2215000",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "177",
        "totalOutputVolumeValue": "16250",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "3",
        "day": "8",
        "year": "2010",
        "price": "0",
        "totalCirculation": "2221800",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "143",
        "totalOutputVolumeValue": "15845.18",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "3",
        "day": "9",
        "year": "2010",
        "price": "0",
        "totalCirculation": "2229200",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "149",
        "totalOutputVolumeValue": "11400",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "3",
        "day": "10",
        "year": "2010",
        "price": "0",
        "totalCirculation": "2236650",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "153",
        "totalOutputVolumeValue": "8850",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "3",
        "day": "11",
        "year": "2010",
        "price": "0",
        "totalCirculation": "2243950",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "155",
        "totalOutputVolumeValue": "11749.99",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "3",
        "day": "12",
        "year": "2010",
        "price": "0",
        "totalCirculation": "2249850",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "119",
        "totalOutputVolumeValue": "6150",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "3",
        "day": "13",
        "year": "2010",
        "price": "0",
        "totalCirculation": "2257750",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "160",
        "totalOutputVolumeValue": "9800",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "3",
        "day": "14",
        "year": "2010",
        "price": "0",
        "totalCirculation": "2264000",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "127",
        "totalOutputVolumeValue": "7800",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "3",
        "day": "15",
        "year": "2010",
        "price": "0",
        "totalCirculation": "2270200",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "131",
        "totalOutputVolumeValue": "6302",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "3",
        "day": "16",
        "year": "2010",
        "price": "0",
        "totalCirculation": "2277000",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "138",
        "totalOutputVolumeValue": "6950",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "3",
        "day": "17",
        "year": "2010",
        "price": "0",
        "totalCirculation": "2283150",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "127",
        "totalOutputVolumeValue": "8301",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "3",
        "day": "18",
        "year": "2010",
        "price": "0",
        "totalCirculation": "2290950",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "163",
        "totalOutputVolumeValue": "8130",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "3",
        "day": "19",
        "year": "2010",
        "price": "0",
        "totalCirculation": "2297600",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "140",
        "totalOutputVolumeValue": "15470",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "3",
        "day": "20",
        "year": "2010",
        "price": "0",
        "totalCirculation": "2307250",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "204",
        "totalOutputVolumeValue": "13696",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "3",
        "day": "21",
        "year": "2010",
        "price": "0",
        "totalCirculation": "2316300",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "191",
        "totalOutputVolumeValue": "11552",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "3",
        "day": "22",
        "year": "2010",
        "price": "0",
        "totalCirculation": "2325150",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "184",
        "totalOutputVolumeValue": "11500",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "3",
        "day": "23",
        "year": "2010",
        "price": "0",
        "totalCirculation": "2335400",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "212",
        "totalOutputVolumeValue": "13960.59",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "3",
        "day": "24",
        "year": "2010",
        "price": "0",
        "totalCirculation": "2344100",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "183",
        "totalOutputVolumeValue": "10076.34",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "3",
        "day": "25",
        "year": "2010",
        "price": "0",
        "totalCirculation": "2353400",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "196",
        "totalOutputVolumeValue": "33800",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "3",
        "day": "26",
        "year": "2010",
        "price": "0",
        "totalCirculation": "2363150",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "204",
        "totalOutputVolumeValue": "12351",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "3",
        "day": "27",
        "year": "2010",
        "price": "0",
        "totalCirculation": "2371850",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "183",
        "totalOutputVolumeValue": "12950",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "3",
        "day": "28",
        "year": "2010",
        "price": "0",
        "totalCirculation": "2381550",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "197",
        "totalOutputVolumeValue": "11600",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "3",
        "day": "29",
        "year": "2010",
        "price": "0",
        "totalCirculation": "2391150",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "199",
        "totalOutputVolumeValue": "13250",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "3",
        "day": "30",
        "year": "2010",
        "price": "0",
        "totalCirculation": "2401700",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "214",
        "totalOutputVolumeValue": "11100",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "3",
        "day": "31",
        "year": "2010",
        "price": "0",
        "totalCirculation": "2412050",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "209",
        "totalOutputVolumeValue": "11400",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "4",
        "day": "1",
        "year": "2010",
        "price": "0",
        "totalCirculation": "2421500",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "195",
        "totalOutputVolumeValue": "10924.2",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "4",
        "day": "2",
        "year": "2010",
        "price": "0",
        "totalCirculation": "2428900",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "152",
        "totalOutputVolumeValue": "8800",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "4",
        "day": "3",
        "year": "2010",
        "price": "0",
        "totalCirculation": "2437200",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "173",
        "totalOutputVolumeValue": "10023.48",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "4",
        "day": "4",
        "year": "2010",
        "price": "0",
        "totalCirculation": "2445500",
        "totalTransactionFees": "0.26",
        "numberOfUniqueBitcoinAddressesUsed": "172",
        "totalOutputVolumeValue": "10500",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "4",
        "day": "5",
        "year": "2010",
        "price": "0",
        "totalCirculation": "2453800",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "176",
        "totalOutputVolumeValue": "12594.74",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "4",
        "day": "6",
        "year": "2010",
        "price": "0",
        "totalCirculation": "2461050",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "175",
        "totalOutputVolumeValue": "19633.45",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "4",
        "day": "7",
        "year": "2010",
        "price": "0",
        "totalCirculation": "2470700",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "203",
        "totalOutputVolumeValue": "15153.14",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "4",
        "day": "8",
        "year": "2010",
        "price": "0",
        "totalCirculation": "2480450",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "209",
        "totalOutputVolumeValue": "13238.74",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "4",
        "day": "9",
        "year": "2010",
        "price": "0",
        "totalCirculation": "2489300",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "190",
        "totalOutputVolumeValue": "11424.01",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "4",
        "day": "10",
        "year": "2010",
        "price": "0",
        "totalCirculation": "2501300",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "302",
        "totalOutputVolumeValue": "53193",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "4",
        "day": "11",
        "year": "2010",
        "price": "0",
        "totalCirculation": "2513250",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "269",
        "totalOutputVolumeValue": "22677.31",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "4",
        "day": "12",
        "year": "2010",
        "price": "0",
        "totalCirculation": "2524100",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "259",
        "totalOutputVolumeValue": "43764.61",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "4",
        "day": "13",
        "year": "2010",
        "price": "0",
        "totalCirculation": "2532350",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "182",
        "totalOutputVolumeValue": "11577",
        "averageNumberOfTransactionsPerBlock": "5"
    },
    {
        "month": "4",
        "day": "14",
        "year": "2010",
        "price": "0",
        "totalCirculation": "2542350",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "233",
        "totalOutputVolumeValue": "15257.29",
        "averageNumberOfTransactionsPerBlock": "10"
    },
    {
        "month": "4",
        "day": "15",
        "year": "2010",
        "price": "0",
        "totalCirculation": "2552650",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "277",
        "totalOutputVolumeValue": "114696.12",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "4",
        "day": "16",
        "year": "2010",
        "price": "0",
        "totalCirculation": "2562750",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "231",
        "totalOutputVolumeValue": "27931.63",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "4",
        "day": "17",
        "year": "2010",
        "price": "0",
        "totalCirculation": "2573250",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "236",
        "totalOutputVolumeValue": "18391.58",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "4",
        "day": "18",
        "year": "2010",
        "price": "0",
        "totalCirculation": "2586500",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "1346",
        "totalOutputVolumeValue": "25304.6",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "4",
        "day": "19",
        "year": "2010",
        "price": "0",
        "totalCirculation": "2597350",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "2286",
        "totalOutputVolumeValue": "43832.61",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "4",
        "day": "20",
        "year": "2010",
        "price": "0",
        "totalCirculation": "2607600",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "234",
        "totalOutputVolumeValue": "42263.8",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "4",
        "day": "21",
        "year": "2010",
        "price": "0",
        "totalCirculation": "2618650",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "241",
        "totalOutputVolumeValue": "15308.81",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "4",
        "day": "22",
        "year": "2010",
        "price": "0",
        "totalCirculation": "2627500",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "207",
        "totalOutputVolumeValue": "31902.85",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "4",
        "day": "23",
        "year": "2010",
        "price": "0",
        "totalCirculation": "2635000",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "192",
        "totalOutputVolumeValue": "13790.99",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "4",
        "day": "24",
        "year": "2010",
        "price": "0",
        "totalCirculation": "2642350",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "184",
        "totalOutputVolumeValue": "19781.1",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "4",
        "day": "25",
        "year": "2010",
        "price": "0",
        "totalCirculation": "2650800",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "196",
        "totalOutputVolumeValue": "21180.8",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "4",
        "day": "26",
        "year": "2010",
        "price": "0",
        "totalCirculation": "2659300",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "211",
        "totalOutputVolumeValue": "17815.5",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "4",
        "day": "27",
        "year": "2010",
        "price": "0",
        "totalCirculation": "2667800",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "216",
        "totalOutputVolumeValue": "22343.93",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "4",
        "day": "28",
        "year": "2010",
        "price": "0",
        "totalCirculation": "2676550",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "212",
        "totalOutputVolumeValue": "16271.87",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "4",
        "day": "29",
        "year": "2010",
        "price": "0",
        "totalCirculation": "2684500",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "188",
        "totalOutputVolumeValue": "13386.03",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "4",
        "day": "30",
        "year": "2010",
        "price": "0",
        "totalCirculation": "2692150",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "179",
        "totalOutputVolumeValue": "40960.32",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "5",
        "day": "1",
        "year": "2010",
        "price": "0",
        "totalCirculation": "2700300",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "181",
        "totalOutputVolumeValue": "41344.6",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "5",
        "day": "2",
        "year": "2010",
        "price": "0",
        "totalCirculation": "2708800",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "190",
        "totalOutputVolumeValue": "12403",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "5",
        "day": "3",
        "year": "2010",
        "price": "0",
        "totalCirculation": "2716800",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "178",
        "totalOutputVolumeValue": "15751",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "5",
        "day": "4",
        "year": "2010",
        "price": "0",
        "totalCirculation": "2723300",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "148",
        "totalOutputVolumeValue": "12603.99",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "5",
        "day": "5",
        "year": "2010",
        "price": "0",
        "totalCirculation": "2730600",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "171",
        "totalOutputVolumeValue": "36805.82",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "5",
        "day": "6",
        "year": "2010",
        "price": "0",
        "totalCirculation": "2738150",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "166",
        "totalOutputVolumeValue": "17099.97",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "5",
        "day": "7",
        "year": "2010",
        "price": "0",
        "totalCirculation": "2744700",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "153",
        "totalOutputVolumeValue": "49545.01",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "5",
        "day": "8",
        "year": "2010",
        "price": "0",
        "totalCirculation": "2752100",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "163",
        "totalOutputVolumeValue": "10660",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "5",
        "day": "9",
        "year": "2010",
        "price": "0",
        "totalCirculation": "2759200",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "186",
        "totalOutputVolumeValue": "31698.66",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "5",
        "day": "10",
        "year": "2010",
        "price": "0",
        "totalCirculation": "2766050",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "154",
        "totalOutputVolumeValue": "12842.67",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "5",
        "day": "11",
        "year": "2010",
        "price": "0",
        "totalCirculation": "2771800",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "134",
        "totalOutputVolumeValue": "10621.26",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "5",
        "day": "12",
        "year": "2010",
        "price": "0",
        "totalCirculation": "2777850",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "133",
        "totalOutputVolumeValue": "15700",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "5",
        "day": "13",
        "year": "2010",
        "price": "0",
        "totalCirculation": "2784350",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "152",
        "totalOutputVolumeValue": "26670.11",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "5",
        "day": "14",
        "year": "2010",
        "price": "0",
        "totalCirculation": "2790350",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "146",
        "totalOutputVolumeValue": "23275.33",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "5",
        "day": "15",
        "year": "2010",
        "price": "0",
        "totalCirculation": "2795650",
        "totalTransactionFees": "9.35",
        "numberOfUniqueBitcoinAddressesUsed": "131",
        "totalOutputVolumeValue": "9270.03",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "5",
        "day": "16",
        "year": "2010",
        "price": "0",
        "totalCirculation": "2800450",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "110",
        "totalOutputVolumeValue": "7488.64",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "5",
        "day": "17",
        "year": "2010",
        "price": "0",
        "totalCirculation": "2807650",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "158",
        "totalOutputVolumeValue": "16847.48",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "5",
        "day": "18",
        "year": "2010",
        "price": "0",
        "totalCirculation": "2816050",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "204",
        "totalOutputVolumeValue": "16526",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "5",
        "day": "19",
        "year": "2010",
        "price": "0",
        "totalCirculation": "2824150",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "208",
        "totalOutputVolumeValue": "25418.51",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "5",
        "day": "20",
        "year": "2010",
        "price": "0",
        "totalCirculation": "2833300",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "213",
        "totalOutputVolumeValue": "13394.97",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "5",
        "day": "21",
        "year": "2010",
        "price": "0",
        "totalCirculation": "2842550",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "217",
        "totalOutputVolumeValue": "15512.96",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "5",
        "day": "22",
        "year": "2010",
        "price": "0",
        "totalCirculation": "2852150",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "217",
        "totalOutputVolumeValue": "56336.75",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "5",
        "day": "23",
        "year": "2010",
        "price": "0",
        "totalCirculation": "2862900",
        "totalTransactionFees": "0.99",
        "numberOfUniqueBitcoinAddressesUsed": "299",
        "totalOutputVolumeValue": "61392.14",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "5",
        "day": "24",
        "year": "2010",
        "price": "0",
        "totalCirculation": "2872400",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "250",
        "totalOutputVolumeValue": "17456",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "5",
        "day": "25",
        "year": "2010",
        "price": "0",
        "totalCirculation": "2883150",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "258",
        "totalOutputVolumeValue": "19050",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "5",
        "day": "26",
        "year": "2010",
        "price": "0",
        "totalCirculation": "2893750",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "255",
        "totalOutputVolumeValue": "24062",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "5",
        "day": "27",
        "year": "2010",
        "price": "0",
        "totalCirculation": "2903500",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "253",
        "totalOutputVolumeValue": "21040.48",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "5",
        "day": "28",
        "year": "2010",
        "price": "0",
        "totalCirculation": "2914450",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "258",
        "totalOutputVolumeValue": "42555.58",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "5",
        "day": "29",
        "year": "2010",
        "price": "0",
        "totalCirculation": "2924300",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "258",
        "totalOutputVolumeValue": "40875.12",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "5",
        "day": "30",
        "year": "2010",
        "price": "0",
        "totalCirculation": "2931850",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "197",
        "totalOutputVolumeValue": "30539.71",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "5",
        "day": "31",
        "year": "2010",
        "price": "0",
        "totalCirculation": "2939450",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "205",
        "totalOutputVolumeValue": "12111",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "6",
        "day": "1",
        "year": "2010",
        "price": "0",
        "totalCirculation": "2946100",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "165",
        "totalOutputVolumeValue": "14142.01",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "6",
        "day": "2",
        "year": "2010",
        "price": "0",
        "totalCirculation": "2952750",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "178",
        "totalOutputVolumeValue": "16201.97",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "6",
        "day": "3",
        "year": "2010",
        "price": "0",
        "totalCirculation": "2960600",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "218",
        "totalOutputVolumeValue": "16514.24",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "6",
        "day": "4",
        "year": "2010",
        "price": "0",
        "totalCirculation": "2967250",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "190",
        "totalOutputVolumeValue": "39744.49",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "6",
        "day": "5",
        "year": "2010",
        "price": "0",
        "totalCirculation": "2974200",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "177",
        "totalOutputVolumeValue": "11400",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "6",
        "day": "6",
        "year": "2010",
        "price": "0",
        "totalCirculation": "2981750",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "192",
        "totalOutputVolumeValue": "14650",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "6",
        "day": "7",
        "year": "2010",
        "price": "0",
        "totalCirculation": "2989550",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "201",
        "totalOutputVolumeValue": "28453.31",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "6",
        "day": "8",
        "year": "2010",
        "price": "0",
        "totalCirculation": "2997450",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "219",
        "totalOutputVolumeValue": "27900.8",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "6",
        "day": "9",
        "year": "2010",
        "price": "0",
        "totalCirculation": "3005550",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "205",
        "totalOutputVolumeValue": "54760.96",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "6",
        "day": "10",
        "year": "2010",
        "price": "0",
        "totalCirculation": "3013900",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "218",
        "totalOutputVolumeValue": "53895.02",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "6",
        "day": "11",
        "year": "2010",
        "price": "0",
        "totalCirculation": "3022300",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "252",
        "totalOutputVolumeValue": "28105",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "6",
        "day": "12",
        "year": "2010",
        "price": "0",
        "totalCirculation": "3029150",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "218",
        "totalOutputVolumeValue": "21898.01",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "6",
        "day": "13",
        "year": "2010",
        "price": "0",
        "totalCirculation": "3037200",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "216",
        "totalOutputVolumeValue": "15143.46",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "6",
        "day": "14",
        "year": "2010",
        "price": "0",
        "totalCirculation": "3044800",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "244",
        "totalOutputVolumeValue": "49237.65",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "6",
        "day": "15",
        "year": "2010",
        "price": "0",
        "totalCirculation": "3054600",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "298",
        "totalOutputVolumeValue": "55578",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "6",
        "day": "16",
        "year": "2010",
        "price": "0",
        "totalCirculation": "3061950",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "196",
        "totalOutputVolumeValue": "17190.08",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "6",
        "day": "17",
        "year": "2010",
        "price": "0",
        "totalCirculation": "3069100",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "210",
        "totalOutputVolumeValue": "43867.51",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "6",
        "day": "18",
        "year": "2010",
        "price": "0",
        "totalCirculation": "3076500",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "187",
        "totalOutputVolumeValue": "14211.62",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "6",
        "day": "19",
        "year": "2010",
        "price": "0",
        "totalCirculation": "3084400",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "214",
        "totalOutputVolumeValue": "63472.79",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "6",
        "day": "20",
        "year": "2010",
        "price": "0",
        "totalCirculation": "3093050",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "219",
        "totalOutputVolumeValue": "33103.01",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "6",
        "day": "21",
        "year": "2010",
        "price": "0",
        "totalCirculation": "3101150",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "254",
        "totalOutputVolumeValue": "45623.09",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "6",
        "day": "22",
        "year": "2010",
        "price": "0",
        "totalCirculation": "3109050",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "250",
        "totalOutputVolumeValue": "39649.42",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "6",
        "day": "23",
        "year": "2010",
        "price": "0",
        "totalCirculation": "3117600",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "256",
        "totalOutputVolumeValue": "43859.22",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "6",
        "day": "24",
        "year": "2010",
        "price": "0",
        "totalCirculation": "3126700",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "251",
        "totalOutputVolumeValue": "45664.37",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "6",
        "day": "25",
        "year": "2010",
        "price": "0",
        "totalCirculation": "3134300",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "227",
        "totalOutputVolumeValue": "40130",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "6",
        "day": "26",
        "year": "2010",
        "price": "0",
        "totalCirculation": "3142450",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "198",
        "totalOutputVolumeValue": "52315",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "6",
        "day": "27",
        "year": "2010",
        "price": "0",
        "totalCirculation": "3150400",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "197",
        "totalOutputVolumeValue": "33347.74",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "6",
        "day": "28",
        "year": "2010",
        "price": "0",
        "totalCirculation": "3158550",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "217",
        "totalOutputVolumeValue": "43325.05",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "6",
        "day": "29",
        "year": "2010",
        "price": "0",
        "totalCirculation": "3166600",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "235",
        "totalOutputVolumeValue": "59574.05",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "6",
        "day": "30",
        "year": "2010",
        "price": "0",
        "totalCirculation": "3175800",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "274",
        "totalOutputVolumeValue": "42443.12",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "7",
        "day": "1",
        "year": "2010",
        "price": "0",
        "totalCirculation": "3186200",
        "totalTransactionFees": "1.37",
        "numberOfUniqueBitcoinAddressesUsed": "257",
        "totalOutputVolumeValue": "47384.78",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "7",
        "day": "2",
        "year": "2010",
        "price": "0",
        "totalCirculation": "3194950",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "223",
        "totalOutputVolumeValue": "39069.81",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "7",
        "day": "3",
        "year": "2010",
        "price": "0",
        "totalCirculation": "3204950",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "256",
        "totalOutputVolumeValue": "129295.4",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "7",
        "day": "4",
        "year": "2010",
        "price": "0",
        "totalCirculation": "3214250",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "223",
        "totalOutputVolumeValue": "21766.5",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "7",
        "day": "5",
        "year": "2010",
        "price": "0",
        "totalCirculation": "3223050",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "215",
        "totalOutputVolumeValue": "59620",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "7",
        "day": "6",
        "year": "2010",
        "price": "0",
        "totalCirculation": "3231450",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "209",
        "totalOutputVolumeValue": "37157.51",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "7",
        "day": "7",
        "year": "2010",
        "price": "0",
        "totalCirculation": "3239150",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "215",
        "totalOutputVolumeValue": "61310.31",
        "averageNumberOfTransactionsPerBlock": "3"
    },
    {
        "month": "7",
        "day": "8",
        "year": "2010",
        "price": "0",
        "totalCirculation": "3247050",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "236",
        "totalOutputVolumeValue": "21542.94",
        "averageNumberOfTransactionsPerBlock": "2"
    },
    {
        "month": "7",
        "day": "9",
        "year": "2010",
        "price": "0",
        "totalCirculation": "3256500",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "262",
        "totalOutputVolumeValue": "25316",
        "averageNumberOfTransactionsPerBlock": "9"
    },
    {
        "month": "7",
        "day": "10",
        "year": "2010",
        "price": "0",
        "totalCirculation": "3266250",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "237",
        "totalOutputVolumeValue": "30853.74",
        "averageNumberOfTransactionsPerBlock": "2"
    },
    {
        "month": "7",
        "day": "11",
        "year": "2010",
        "price": "0",
        "totalCirculation": "3275100",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "240",
        "totalOutputVolumeValue": "33656.99",
        "averageNumberOfTransactionsPerBlock": "2"
    },
    {
        "month": "7",
        "day": "12",
        "year": "2010",
        "price": "0",
        "totalCirculation": "3300750",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "2822",
        "totalOutputVolumeValue": "2490710.99",
        "averageNumberOfTransactionsPerBlock": "2"
    },
    {
        "month": "7",
        "day": "13",
        "year": "2010",
        "price": "0",
        "totalCirculation": "3337950",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "2122",
        "totalOutputVolumeValue": "375367.98",
        "averageNumberOfTransactionsPerBlock": "2"
    },
    {
        "month": "7",
        "day": "14",
        "year": "2010",
        "price": "0",
        "totalCirculation": "3366650",
        "totalTransactionFees": "0.01",
        "numberOfUniqueBitcoinAddressesUsed": "6109",
        "totalOutputVolumeValue": "457056.19",
        "averageNumberOfTransactionsPerBlock": "2"
    },
    {
        "month": "7",
        "day": "15",
        "year": "2010",
        "price": "0",
        "totalCirculation": "3397850",
        "totalTransactionFees": "0.61",
        "numberOfUniqueBitcoinAddressesUsed": "2015",
        "totalOutputVolumeValue": "108133.06",
        "averageNumberOfTransactionsPerBlock": "3"
    },
    {
        "month": "7",
        "day": "16",
        "year": "2010",
        "price": "0",
        "totalCirculation": "3427750",
        "totalTransactionFees": "0.23",
        "numberOfUniqueBitcoinAddressesUsed": "1683",
        "totalOutputVolumeValue": "99601.75",
        "averageNumberOfTransactionsPerBlock": "2"
    },
    {
        "month": "7",
        "day": "17",
        "year": "2010",
        "price": "0",
        "totalCirculation": "3436900",
        "totalTransactionFees": "0.09",
        "numberOfUniqueBitcoinAddressesUsed": "548",
        "totalOutputVolumeValue": "44761.64",
        "averageNumberOfTransactionsPerBlock": "2"
    },
    {
        "month": "7",
        "day": "18",
        "year": "2010",
        "price": "0",
        "totalCirculation": "3445850",
        "totalTransactionFees": "0.66",
        "numberOfUniqueBitcoinAddressesUsed": "549",
        "totalOutputVolumeValue": "42807.91",
        "averageNumberOfTransactionsPerBlock": "2"
    },
    {
        "month": "7",
        "day": "19",
        "year": "2010",
        "price": "0",
        "totalCirculation": "3454050",
        "totalTransactionFees": "0.31",
        "numberOfUniqueBitcoinAddressesUsed": "606",
        "totalOutputVolumeValue": "56879.76",
        "averageNumberOfTransactionsPerBlock": "2"
    },
    {
        "month": "7",
        "day": "20",
        "year": "2010",
        "price": "0",
        "totalCirculation": "3462950",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "757",
        "totalOutputVolumeValue": "38158.85",
        "averageNumberOfTransactionsPerBlock": "10"
    },
    {
        "month": "7",
        "day": "21",
        "year": "2010",
        "price": "0",
        "totalCirculation": "3473050",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "536",
        "totalOutputVolumeValue": "36352.93",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "7",
        "day": "22",
        "year": "2010",
        "price": "0",
        "totalCirculation": "3482400",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "498",
        "totalOutputVolumeValue": "43947.49",
        "averageNumberOfTransactionsPerBlock": "2"
    },
    {
        "month": "7",
        "day": "23",
        "year": "2010",
        "price": "0",
        "totalCirculation": "3492100",
        "totalTransactionFees": "0.01",
        "numberOfUniqueBitcoinAddressesUsed": "464",
        "totalOutputVolumeValue": "40387.12",
        "averageNumberOfTransactionsPerBlock": "2"
    },
    {
        "month": "7",
        "day": "24",
        "year": "2010",
        "price": "0",
        "totalCirculation": "3501350",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "450",
        "totalOutputVolumeValue": "41380.86",
        "averageNumberOfTransactionsPerBlock": "19"
    },
    {
        "month": "7",
        "day": "25",
        "year": "2010",
        "price": "0",
        "totalCirculation": "3512050",
        "totalTransactionFees": "2.87",
        "numberOfUniqueBitcoinAddressesUsed": "2173",
        "totalOutputVolumeValue": "61276.82",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "7",
        "day": "26",
        "year": "2010",
        "price": "0",
        "totalCirculation": "3525050",
        "totalTransactionFees": "0.24",
        "numberOfUniqueBitcoinAddressesUsed": "522",
        "totalOutputVolumeValue": "54379.25",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "7",
        "day": "27",
        "year": "2010",
        "price": "0",
        "totalCirculation": "3533800",
        "totalTransactionFees": "1.9",
        "numberOfUniqueBitcoinAddressesUsed": "551",
        "totalOutputVolumeValue": "83431.72",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "7",
        "day": "28",
        "year": "2010",
        "price": "0",
        "totalCirculation": "3541900",
        "totalTransactionFees": "0.17",
        "numberOfUniqueBitcoinAddressesUsed": "413",
        "totalOutputVolumeValue": "34422.77",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "7",
        "day": "29",
        "year": "2010",
        "price": "0",
        "totalCirculation": "3550650",
        "totalTransactionFees": "0.95",
        "numberOfUniqueBitcoinAddressesUsed": "393",
        "totalOutputVolumeValue": "67470.65",
        "averageNumberOfTransactionsPerBlock": "2"
    },
    {
        "month": "7",
        "day": "30",
        "year": "2010",
        "price": "0",
        "totalCirculation": "3559750",
        "totalTransactionFees": "1.04",
        "numberOfUniqueBitcoinAddressesUsed": "420",
        "totalOutputVolumeValue": "38727.83",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "7",
        "day": "31",
        "year": "2010",
        "price": "0",
        "totalCirculation": "3569200",
        "totalTransactionFees": "0.41",
        "numberOfUniqueBitcoinAddressesUsed": "348",
        "totalOutputVolumeValue": "26849.89",
        "averageNumberOfTransactionsPerBlock": "2"
    },
    {
        "month": "8",
        "day": "1",
        "year": "2010",
        "price": "0",
        "totalCirculation": "3580250",
        "totalTransactionFees": "0.19",
        "numberOfUniqueBitcoinAddressesUsed": "373",
        "totalOutputVolumeValue": "275826.17",
        "averageNumberOfTransactionsPerBlock": "2"
    },
    {
        "month": "8",
        "day": "2",
        "year": "2010",
        "price": "0",
        "totalCirculation": "3592950",
        "totalTransactionFees": "0.36",
        "numberOfUniqueBitcoinAddressesUsed": "456",
        "totalOutputVolumeValue": "80756.88",
        "averageNumberOfTransactionsPerBlock": "2"
    },
    {
        "month": "8",
        "day": "3",
        "year": "2010",
        "price": "0",
        "totalCirculation": "3604350",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "668",
        "totalOutputVolumeValue": "35410.38",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "8",
        "day": "4",
        "year": "2010",
        "price": "0",
        "totalCirculation": "3615750",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "421",
        "totalOutputVolumeValue": "43476.55",
        "averageNumberOfTransactionsPerBlock": "2"
    },
    {
        "month": "8",
        "day": "5",
        "year": "2010",
        "price": "0",
        "totalCirculation": "3627950",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "787",
        "totalOutputVolumeValue": "63196.35",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "8",
        "day": "6",
        "year": "2010",
        "price": "0",
        "totalCirculation": "3636000",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "418",
        "totalOutputVolumeValue": "27828.86",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "8",
        "day": "7",
        "year": "2010",
        "price": "0",
        "totalCirculation": "3643100",
        "totalTransactionFees": "2.31",
        "numberOfUniqueBitcoinAddressesUsed": "334",
        "totalOutputVolumeValue": "34545.32",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "8",
        "day": "8",
        "year": "2010",
        "price": "0",
        "totalCirculation": "3652700",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "365",
        "totalOutputVolumeValue": "24398.03",
        "averageNumberOfTransactionsPerBlock": "2"
    },
    {
        "month": "8",
        "day": "9",
        "year": "2010",
        "price": "0",
        "totalCirculation": "3662150",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "461",
        "totalOutputVolumeValue": "42164.61",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "8",
        "day": "10",
        "year": "2010",
        "price": "0",
        "totalCirculation": "3672500",
        "totalTransactionFees": "4.32",
        "numberOfUniqueBitcoinAddressesUsed": "467",
        "totalOutputVolumeValue": "79568.17",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "8",
        "day": "11",
        "year": "2010",
        "price": "0",
        "totalCirculation": "3683350",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "425",
        "totalOutputVolumeValue": "64335.31",
        "averageNumberOfTransactionsPerBlock": "2"
    },
    {
        "month": "8",
        "day": "12",
        "year": "2010",
        "price": "0",
        "totalCirculation": "3694250",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "462",
        "totalOutputVolumeValue": "37502.57",
        "averageNumberOfTransactionsPerBlock": "2"
    },
    {
        "month": "8",
        "day": "13",
        "year": "2010",
        "price": "0",
        "totalCirculation": "3705100",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "600",
        "totalOutputVolumeValue": "45207.98",
        "averageNumberOfTransactionsPerBlock": "2"
    },
    {
        "month": "8",
        "day": "14",
        "year": "2010",
        "price": "0",
        "totalCirculation": "3718150",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "450",
        "totalOutputVolumeValue": "32041.73",
        "averageNumberOfTransactionsPerBlock": "2"
    },
    {
        "month": "8",
        "day": "15",
        "year": "2010",
        "price": "0",
        "totalCirculation": "3731900",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "402",
        "totalOutputVolumeValue": "32624.12",
        "averageNumberOfTransactionsPerBlock": "2"
    },
    {
        "month": "8",
        "day": "16",
        "year": "2010",
        "price": "0",
        "totalCirculation": "3737700",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "387",
        "totalOutputVolumeValue": "41918.88",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "8",
        "day": "17",
        "year": "2010",
        "price": "0.0769",
        "totalCirculation": "3744250",
        "totalTransactionFees": "0.67",
        "numberOfUniqueBitcoinAddressesUsed": "393",
        "totalOutputVolumeValue": "72855.15",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "8",
        "day": "18",
        "year": "2010",
        "price": "0.074",
        "totalCirculation": "3750900",
        "totalTransactionFees": "1.56",
        "numberOfUniqueBitcoinAddressesUsed": "449",
        "totalOutputVolumeValue": "52829.65",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "8",
        "day": "19",
        "year": "2010",
        "price": "0.0688",
        "totalCirculation": "3757900",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "395",
        "totalOutputVolumeValue": "32027.42",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "8",
        "day": "20",
        "year": "2010",
        "price": "0.0667",
        "totalCirculation": "3766250",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "433",
        "totalOutputVolumeValue": "36647.52",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "8",
        "day": "21",
        "year": "2010",
        "price": "0.066899",
        "totalCirculation": "3775450",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "396",
        "totalOutputVolumeValue": "33790.41",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "8",
        "day": "22",
        "year": "2010",
        "price": "0.0664",
        "totalCirculation": "3785400",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "358",
        "totalOutputVolumeValue": "45810.46",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "8",
        "day": "23",
        "year": "2010",
        "price": "0.066",
        "totalCirculation": "3796250",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "431",
        "totalOutputVolumeValue": "29274.46",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "8",
        "day": "24",
        "year": "2010",
        "price": "0.066889",
        "totalCirculation": "3806500",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "393",
        "totalOutputVolumeValue": "28624.03",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "8",
        "day": "25",
        "year": "2010",
        "price": "0.0665",
        "totalCirculation": "3817850",
        "totalTransactionFees": "0.8",
        "numberOfUniqueBitcoinAddressesUsed": "414",
        "totalOutputVolumeValue": "24234.76",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "8",
        "day": "26",
        "year": "2010",
        "price": "0.066499",
        "totalCirculation": "3828250",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "391",
        "totalOutputVolumeValue": "30534.45",
        "averageNumberOfTransactionsPerBlock": "2"
    },
    {
        "month": "8",
        "day": "27",
        "year": "2010",
        "price": "0.065",
        "totalCirculation": "3837150",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "316",
        "totalOutputVolumeValue": "21534.39",
        "averageNumberOfTransactionsPerBlock": "2"
    },
    {
        "month": "8",
        "day": "28",
        "year": "2010",
        "price": "0.065",
        "totalCirculation": "3846100",
        "totalTransactionFees": "0.0000005",
        "numberOfUniqueBitcoinAddressesUsed": "393",
        "totalOutputVolumeValue": "39471.26",
        "averageNumberOfTransactionsPerBlock": "2"
    },
    {
        "month": "8",
        "day": "29",
        "year": "2010",
        "price": "0.0648",
        "totalCirculation": "3854000",
        "totalTransactionFees": "0.1400006",
        "numberOfUniqueBitcoinAddressesUsed": "300",
        "totalOutputVolumeValue": "18946.77999",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "8",
        "day": "30",
        "year": "2010",
        "price": "0.069",
        "totalCirculation": "3861450",
        "totalTransactionFees": "0.4",
        "numberOfUniqueBitcoinAddressesUsed": "335",
        "totalOutputVolumeValue": "20544.6",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "8",
        "day": "31",
        "year": "2010",
        "price": "0.06497",
        "totalCirculation": "3870200",
        "totalTransactionFees": "0.2000003",
        "numberOfUniqueBitcoinAddressesUsed": "462",
        "totalOutputVolumeValue": "50604.25",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "9",
        "day": "1",
        "year": "2010",
        "price": "0.0649",
        "totalCirculation": "3879000",
        "totalTransactionFees": "0.1300001",
        "numberOfUniqueBitcoinAddressesUsed": "459",
        "totalOutputVolumeValue": "25273.89",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "9",
        "day": "2",
        "year": "2010",
        "price": "0.0629",
        "totalCirculation": "3886550",
        "totalTransactionFees": "0.0000001",
        "numberOfUniqueBitcoinAddressesUsed": "340",
        "totalOutputVolumeValue": "37692.37",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "9",
        "day": "3",
        "year": "2010",
        "price": "0.0634",
        "totalCirculation": "3894550",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "363",
        "totalOutputVolumeValue": "45194.31",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "9",
        "day": "4",
        "year": "2010",
        "price": "0.0613",
        "totalCirculation": "3903500",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "313",
        "totalOutputVolumeValue": "45032.56",
        "averageNumberOfTransactionsPerBlock": "2"
    },
    {
        "month": "9",
        "day": "5",
        "year": "2010",
        "price": "0.0629",
        "totalCirculation": "3911600",
        "totalTransactionFees": "0.01",
        "numberOfUniqueBitcoinAddressesUsed": "351",
        "totalOutputVolumeValue": "128716.02",
        "averageNumberOfTransactionsPerBlock": "2"
    },
    {
        "month": "9",
        "day": "6",
        "year": "2010",
        "price": "0.064",
        "totalCirculation": "3920050",
        "totalTransactionFees": "0.0000001",
        "numberOfUniqueBitcoinAddressesUsed": "326",
        "totalOutputVolumeValue": "94878.79",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "9",
        "day": "7",
        "year": "2010",
        "price": "0.06185",
        "totalCirculation": "3927600",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "284",
        "totalOutputVolumeValue": "34840.22",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "9",
        "day": "8",
        "year": "2010",
        "price": "0.06201",
        "totalCirculation": "3935200",
        "totalTransactionFees": "0.0000002",
        "numberOfUniqueBitcoinAddressesUsed": "332",
        "totalOutputVolumeValue": "24540.79",
        "averageNumberOfTransactionsPerBlock": "2"
    },
    {
        "month": "9",
        "day": "9",
        "year": "2010",
        "price": "0.0624",
        "totalCirculation": "3942750",
        "totalTransactionFees": "0.11",
        "numberOfUniqueBitcoinAddressesUsed": "383",
        "totalOutputVolumeValue": "40414.58",
        "averageNumberOfTransactionsPerBlock": "2"
    },
    {
        "month": "9",
        "day": "10",
        "year": "2010",
        "price": "0.06201",
        "totalCirculation": "3951300",
        "totalTransactionFees": "0.0000002",
        "numberOfUniqueBitcoinAddressesUsed": "410",
        "totalOutputVolumeValue": "25097.62",
        "averageNumberOfTransactionsPerBlock": "2"
    },
    {
        "month": "9",
        "day": "11",
        "year": "2010",
        "price": "0.062",
        "totalCirculation": "3959400",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "328",
        "totalOutputVolumeValue": "17622.84",
        "averageNumberOfTransactionsPerBlock": "2"
    },
    {
        "month": "9",
        "day": "12",
        "year": "2010",
        "price": "0.064999",
        "totalCirculation": "3968550",
        "totalTransactionFees": "0.15",
        "numberOfUniqueBitcoinAddressesUsed": "392",
        "totalOutputVolumeValue": "26765.48",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "9",
        "day": "13",
        "year": "2010",
        "price": "0.06201",
        "totalCirculation": "3976750",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "489",
        "totalOutputVolumeValue": "114883.92",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "9",
        "day": "14",
        "year": "2010",
        "price": "0.0641",
        "totalCirculation": "3986500",
        "totalTransactionFees": "0.00960362",
        "numberOfUniqueBitcoinAddressesUsed": "492",
        "totalOutputVolumeValue": "46151.35441",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "9",
        "day": "15",
        "year": "2010",
        "price": "0.175",
        "totalCirculation": "3995900",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "491",
        "totalOutputVolumeValue": "46988.2304",
        "averageNumberOfTransactionsPerBlock": "2"
    },
    {
        "month": "9",
        "day": "16",
        "year": "2010",
        "price": "0.0619",
        "totalCirculation": "4005400",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "385",
        "totalOutputVolumeValue": "39173.55",
        "averageNumberOfTransactionsPerBlock": "3"
    },
    {
        "month": "9",
        "day": "17",
        "year": "2010",
        "price": "0.0609",
        "totalCirculation": "4016200",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "382",
        "totalOutputVolumeValue": "44589.06",
        "averageNumberOfTransactionsPerBlock": "4"
    },
    {
        "month": "9",
        "day": "18",
        "year": "2010",
        "price": "0.0609",
        "totalCirculation": "4028050",
        "totalTransactionFees": "0.18",
        "numberOfUniqueBitcoinAddressesUsed": "445",
        "totalOutputVolumeValue": "81783",
        "averageNumberOfTransactionsPerBlock": "3"
    },
    {
        "month": "9",
        "day": "19",
        "year": "2010",
        "price": "0.062599",
        "totalCirculation": "4038550",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "379",
        "totalOutputVolumeValue": "63683.9096",
        "averageNumberOfTransactionsPerBlock": "2"
    },
    {
        "month": "9",
        "day": "20",
        "year": "2010",
        "price": "0.0634",
        "totalCirculation": "4049100",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "469",
        "totalOutputVolumeValue": "71345.62",
        "averageNumberOfTransactionsPerBlock": "2"
    },
    {
        "month": "9",
        "day": "21",
        "year": "2010",
        "price": "0.0633",
        "totalCirculation": "4057950",
        "totalTransactionFees": "0.0000001",
        "numberOfUniqueBitcoinAddressesUsed": "743",
        "totalOutputVolumeValue": "39944.08",
        "averageNumberOfTransactionsPerBlock": "2"
    },
    {
        "month": "9",
        "day": "22",
        "year": "2010",
        "price": "0.0628",
        "totalCirculation": "4066600",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "999",
        "totalOutputVolumeValue": "51528.04",
        "averageNumberOfTransactionsPerBlock": "2"
    },
    {
        "month": "9",
        "day": "23",
        "year": "2010",
        "price": "0.063",
        "totalCirculation": "4077200",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "801",
        "totalOutputVolumeValue": "123082.78",
        "averageNumberOfTransactionsPerBlock": "2"
    },
    {
        "month": "9",
        "day": "24",
        "year": "2010",
        "price": "0.06281",
        "totalCirculation": "4089500",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "631",
        "totalOutputVolumeValue": "48867.6",
        "averageNumberOfTransactionsPerBlock": "5"
    },
    {
        "month": "9",
        "day": "25",
        "year": "2010",
        "price": "0.0624",
        "totalCirculation": "4099600",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "499",
        "totalOutputVolumeValue": "32462.93",
        "averageNumberOfTransactionsPerBlock": "2"
    },
    {
        "month": "9",
        "day": "26",
        "year": "2010",
        "price": "0.062279",
        "totalCirculation": "4109450",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "493",
        "totalOutputVolumeValue": "30732.86",
        "averageNumberOfTransactionsPerBlock": "3"
    },
    {
        "month": "9",
        "day": "27",
        "year": "2010",
        "price": "0.062206",
        "totalCirculation": "4121350",
        "totalTransactionFees": "0.02",
        "numberOfUniqueBitcoinAddressesUsed": "753",
        "totalOutputVolumeValue": "39222.8",
        "averageNumberOfTransactionsPerBlock": "4"
    },
    {
        "month": "9",
        "day": "28",
        "year": "2010",
        "price": "0.06271",
        "totalCirculation": "4132150",
        "totalTransactionFees": "0.41",
        "numberOfUniqueBitcoinAddressesUsed": "453",
        "totalOutputVolumeValue": "55063.23503",
        "averageNumberOfTransactionsPerBlock": "3"
    },
    {
        "month": "9",
        "day": "29",
        "year": "2010",
        "price": "0.06219",
        "totalCirculation": "4141000",
        "totalTransactionFees": "1.03",
        "numberOfUniqueBitcoinAddressesUsed": "1000",
        "totalOutputVolumeValue": "152303.87",
        "averageNumberOfTransactionsPerBlock": "2"
    },
    {
        "month": "9",
        "day": "30",
        "year": "2010",
        "price": "0.06192",
        "totalCirculation": "4148050",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "427",
        "totalOutputVolumeValue": "36006.74",
        "averageNumberOfTransactionsPerBlock": "2"
    },
    {
        "month": "10",
        "day": "1",
        "year": "2010",
        "price": "0.061999",
        "totalCirculation": "4155850",
        "totalTransactionFees": "0.56",
        "numberOfUniqueBitcoinAddressesUsed": "664",
        "totalOutputVolumeValue": "74309.81812",
        "averageNumberOfTransactionsPerBlock": "2"
    },
    {
        "month": "10",
        "day": "2",
        "year": "2010",
        "price": "0.061999",
        "totalCirculation": "4161300",
        "totalTransactionFees": "0.00776615",
        "numberOfUniqueBitcoinAddressesUsed": "609",
        "totalOutputVolumeValue": "46316.14777",
        "averageNumberOfTransactionsPerBlock": "2"
    },
    {
        "month": "10",
        "day": "3",
        "year": "2010",
        "price": "0.0614",
        "totalCirculation": "4167350",
        "totalTransactionFees": "0.00776813",
        "numberOfUniqueBitcoinAddressesUsed": "501",
        "totalOutputVolumeValue": "403512.3778",
        "averageNumberOfTransactionsPerBlock": "2"
    },
    {
        "month": "10",
        "day": "4",
        "year": "2010",
        "price": "0.062",
        "totalCirculation": "4175050",
        "totalTransactionFees": "0.00000109",
        "numberOfUniqueBitcoinAddressesUsed": "525",
        "totalOutputVolumeValue": "539563.53",
        "averageNumberOfTransactionsPerBlock": "2"
    },
    {
        "month": "10",
        "day": "5",
        "year": "2010",
        "price": "0.06301",
        "totalCirculation": "4181200",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "471",
        "totalOutputVolumeValue": "189281.43",
        "averageNumberOfTransactionsPerBlock": "2"
    },
    {
        "month": "10",
        "day": "6",
        "year": "2010",
        "price": "0.0633",
        "totalCirculation": "4188800",
        "totalTransactionFees": "0.00000109",
        "numberOfUniqueBitcoinAddressesUsed": "493",
        "totalOutputVolumeValue": "99404.95",
        "averageNumberOfTransactionsPerBlock": "2"
    },
    {
        "month": "10",
        "day": "7",
        "year": "2010",
        "price": "0.0638",
        "totalCirculation": "4197450",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "443",
        "totalOutputVolumeValue": "175824",
        "averageNumberOfTransactionsPerBlock": "2"
    },
    {
        "month": "10",
        "day": "8",
        "year": "2010",
        "price": "0.088",
        "totalCirculation": "4205200",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "421",
        "totalOutputVolumeValue": "181045.43",
        "averageNumberOfTransactionsPerBlock": "2"
    },
    {
        "month": "10",
        "day": "9",
        "year": "2010",
        "price": "0.12001",
        "totalCirculation": "4212850",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "468",
        "totalOutputVolumeValue": "164092.5",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "10",
        "day": "10",
        "year": "2010",
        "price": "0.12",
        "totalCirculation": "4221450",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "460",
        "totalOutputVolumeValue": "135145.64",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "10",
        "day": "11",
        "year": "2010",
        "price": "0.1301",
        "totalCirculation": "4229700",
        "totalTransactionFees": "0.00000109",
        "numberOfUniqueBitcoinAddressesUsed": "443",
        "totalOutputVolumeValue": "71405.12",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "10",
        "day": "12",
        "year": "2010",
        "price": "0.099",
        "totalCirculation": "4237700",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "439",
        "totalOutputVolumeValue": "108997.45",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "10",
        "day": "13",
        "year": "2010",
        "price": "0.095",
        "totalCirculation": "4246150",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "446",
        "totalOutputVolumeValue": "95713.93",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "10",
        "day": "14",
        "year": "2010",
        "price": "0.105",
        "totalCirculation": "4255750",
        "totalTransactionFees": "0.35",
        "numberOfUniqueBitcoinAddressesUsed": "459",
        "totalOutputVolumeValue": "157733.04",
        "averageNumberOfTransactionsPerBlock": "3"
    },
    {
        "month": "10",
        "day": "15",
        "year": "2010",
        "price": "0.119",
        "totalCirculation": "4265000",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "407",
        "totalOutputVolumeValue": "145488.96",
        "averageNumberOfTransactionsPerBlock": "2"
    },
    {
        "month": "10",
        "day": "16",
        "year": "2010",
        "price": "0.109",
        "totalCirculation": "4276950",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "493",
        "totalOutputVolumeValue": "228684.56",
        "averageNumberOfTransactionsPerBlock": "2"
    },
    {
        "month": "10",
        "day": "17",
        "year": "2010",
        "price": "0.1045",
        "totalCirculation": "4291050",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "579",
        "totalOutputVolumeValue": "165836.54",
        "averageNumberOfTransactionsPerBlock": "3"
    },
    {
        "month": "10",
        "day": "18",
        "year": "2010",
        "price": "0.103",
        "totalCirculation": "4304100",
        "totalTransactionFees": "0.02",
        "numberOfUniqueBitcoinAddressesUsed": "623",
        "totalOutputVolumeValue": "204295.32",
        "averageNumberOfTransactionsPerBlock": "3"
    },
    {
        "month": "10",
        "day": "19",
        "year": "2010",
        "price": "0.1024",
        "totalCirculation": "4316250",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "1240",
        "totalOutputVolumeValue": "269644.67",
        "averageNumberOfTransactionsPerBlock": "2"
    },
    {
        "month": "10",
        "day": "20",
        "year": "2010",
        "price": "0.103",
        "totalCirculation": "4327950",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "914",
        "totalOutputVolumeValue": "243234.45",
        "averageNumberOfTransactionsPerBlock": "2"
    },
    {
        "month": "10",
        "day": "21",
        "year": "2010",
        "price": "0.109",
        "totalCirculation": "4339600",
        "totalTransactionFees": "0.00776615",
        "numberOfUniqueBitcoinAddressesUsed": "745",
        "totalOutputVolumeValue": "200194.2378",
        "averageNumberOfTransactionsPerBlock": "2"
    },
    {
        "month": "10",
        "day": "22",
        "year": "2010",
        "price": "0.107",
        "totalCirculation": "4347250",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "645",
        "totalOutputVolumeValue": "138906.02",
        "averageNumberOfTransactionsPerBlock": "2"
    },
    {
        "month": "10",
        "day": "23",
        "year": "2010",
        "price": "0.10901",
        "totalCirculation": "4355950",
        "totalTransactionFees": "0.05",
        "numberOfUniqueBitcoinAddressesUsed": "776",
        "totalOutputVolumeValue": "49203.8",
        "averageNumberOfTransactionsPerBlock": "2"
    },
    {
        "month": "10",
        "day": "24",
        "year": "2010",
        "price": "0.19",
        "totalCirculation": "4365400",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "592",
        "totalOutputVolumeValue": "88862.99",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "10",
        "day": "25",
        "year": "2010",
        "price": "0.15",
        "totalCirculation": "4375900",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "601",
        "totalOutputVolumeValue": "154213.65",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "10",
        "day": "26",
        "year": "2010",
        "price": "0.19",
        "totalCirculation": "4388000",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "620",
        "totalOutputVolumeValue": "194450",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "10",
        "day": "27",
        "year": "2010",
        "price": "0.19",
        "totalCirculation": "4398600",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "778",
        "totalOutputVolumeValue": "231666.64",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "10",
        "day": "28",
        "year": "2010",
        "price": "0.19001",
        "totalCirculation": "4409350",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "677",
        "totalOutputVolumeValue": "154286.85",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "10",
        "day": "29",
        "year": "2010",
        "price": "0.191",
        "totalCirculation": "4421100",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "537",
        "totalOutputVolumeValue": "136452.55",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "10",
        "day": "30",
        "year": "2010",
        "price": "0.1919",
        "totalCirculation": "4433100",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "495",
        "totalOutputVolumeValue": "93681.81",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "10",
        "day": "31",
        "year": "2010",
        "price": "0.199",
        "totalCirculation": "4442200",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "345",
        "totalOutputVolumeValue": "61979.37",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "11",
        "day": "1",
        "year": "2010",
        "price": "0.1975",
        "totalCirculation": "4451600",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "416",
        "totalOutputVolumeValue": "61627.41",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "11",
        "day": "2",
        "year": "2010",
        "price": "0.1955",
        "totalCirculation": "4460000",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "321",
        "totalOutputVolumeValue": "65171.14",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "11",
        "day": "3",
        "year": "2010",
        "price": "0.275",
        "totalCirculation": "4470050",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "388",
        "totalOutputVolumeValue": "65403.99",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "11",
        "day": "4",
        "year": "2010",
        "price": "0.23601",
        "totalCirculation": "4479600",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "378",
        "totalOutputVolumeValue": "162239.24",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "11",
        "day": "5",
        "year": "2010",
        "price": "0.2399",
        "totalCirculation": "4490550",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "458",
        "totalOutputVolumeValue": "56243.79109",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "11",
        "day": "6",
        "year": "2010",
        "price": "0.29",
        "totalCirculation": "4500650",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "453",
        "totalOutputVolumeValue": "121427.3",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "11",
        "day": "7",
        "year": "2010",
        "price": "0.499999",
        "totalCirculation": "4513050",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "487",
        "totalOutputVolumeValue": "124630.78",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "11",
        "day": "8",
        "year": "2010",
        "price": "0.37",
        "totalCirculation": "4526100",
        "totalTransactionFees": "0.83",
        "numberOfUniqueBitcoinAddressesUsed": "544",
        "totalOutputVolumeValue": "455084.71",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "11",
        "day": "9",
        "year": "2010",
        "price": "0.3368",
        "totalCirculation": "4538100",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "509",
        "totalOutputVolumeValue": "121502.89",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "11",
        "day": "10",
        "year": "2010",
        "price": "0.2667",
        "totalCirculation": "4547750",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "416",
        "totalOutputVolumeValue": "59232.5",
        "averageNumberOfTransactionsPerBlock": "8"
    },
    {
        "month": "11",
        "day": "11",
        "year": "2010",
        "price": "0.24",
        "totalCirculation": "4559350",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "477",
        "totalOutputVolumeValue": "59839.1",
        "averageNumberOfTransactionsPerBlock": "66"
    },
    {
        "month": "11",
        "day": "12",
        "year": "2010",
        "price": "0.251",
        "totalCirculation": "4567900",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "333",
        "totalOutputVolumeValue": "43331.06",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "11",
        "day": "13",
        "year": "2010",
        "price": "0.3",
        "totalCirculation": "4578850",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "358",
        "totalOutputVolumeValue": "53430.2",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "11",
        "day": "14",
        "year": "2010",
        "price": "0.299",
        "totalCirculation": "4590750",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "442",
        "totalOutputVolumeValue": "36107",
        "averageNumberOfTransactionsPerBlock": "46"
    },
    {
        "month": "11",
        "day": "15",
        "year": "2010",
        "price": "0.2828",
        "totalCirculation": "4601800",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "1882",
        "totalOutputVolumeValue": "173010.71",
        "averageNumberOfTransactionsPerBlock": "107"
    },
    {
        "month": "11",
        "day": "16",
        "year": "2010",
        "price": "0.2827",
        "totalCirculation": "4610850",
        "totalTransactionFees": "0.48",
        "numberOfUniqueBitcoinAddressesUsed": "5349",
        "totalOutputVolumeValue": "478994.38",
        "averageNumberOfTransactionsPerBlock": "76"
    },
    {
        "month": "11",
        "day": "17",
        "year": "2010",
        "price": "0.28",
        "totalCirculation": "4623350",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "540",
        "totalOutputVolumeValue": "86941.96",
        "averageNumberOfTransactionsPerBlock": "2"
    },
    {
        "month": "11",
        "day": "18",
        "year": "2010",
        "price": "0.289999",
        "totalCirculation": "4636500",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "486",
        "totalOutputVolumeValue": "64061.66",
        "averageNumberOfTransactionsPerBlock": "2"
    },
    {
        "month": "11",
        "day": "19",
        "year": "2010",
        "price": "0.283",
        "totalCirculation": "4644800",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "404",
        "totalOutputVolumeValue": "63583.91109",
        "averageNumberOfTransactionsPerBlock": "14"
    },
    {
        "month": "11",
        "day": "20",
        "year": "2010",
        "price": "0.289",
        "totalCirculation": "4650550",
        "totalTransactionFees": "0.73",
        "numberOfUniqueBitcoinAddressesUsed": "610",
        "totalOutputVolumeValue": "171110.34",
        "averageNumberOfTransactionsPerBlock": "38"
    },
    {
        "month": "11",
        "day": "21",
        "year": "2010",
        "price": "0.29",
        "totalCirculation": "4657300",
        "totalTransactionFees": "1.17",
        "numberOfUniqueBitcoinAddressesUsed": "520",
        "totalOutputVolumeValue": "138363.57",
        "averageNumberOfTransactionsPerBlock": "7"
    },
    {
        "month": "11",
        "day": "22",
        "year": "2010",
        "price": "0.282",
        "totalCirculation": "4665300",
        "totalTransactionFees": "0.6",
        "numberOfUniqueBitcoinAddressesUsed": "499",
        "totalOutputVolumeValue": "37773.97",
        "averageNumberOfTransactionsPerBlock": "2"
    },
    {
        "month": "11",
        "day": "23",
        "year": "2010",
        "price": "0.2879",
        "totalCirculation": "4672500",
        "totalTransactionFees": "0.54",
        "numberOfUniqueBitcoinAddressesUsed": "408",
        "totalOutputVolumeValue": "44876.14",
        "averageNumberOfTransactionsPerBlock": "2"
    },
    {
        "month": "11",
        "day": "24",
        "year": "2010",
        "price": "0.28299",
        "totalCirculation": "4681750",
        "totalTransactionFees": "0.31",
        "numberOfUniqueBitcoinAddressesUsed": "610",
        "totalOutputVolumeValue": "52383.97",
        "averageNumberOfTransactionsPerBlock": "2"
    },
    {
        "month": "11",
        "day": "25",
        "year": "2010",
        "price": "0.28299",
        "totalCirculation": "4689350",
        "totalTransactionFees": "0",
        "numberOfUniqueBitcoinAddressesUsed": "641",
        "totalOutputVolumeValue": "56769.8",
        "averageNumberOfTransactionsPerBlock": "2"
    },
    {
        "month": "11",
        "day": "26",
        "year": "2010",
        "price": "0.289",
        "totalCirculation": "4699500",
        "totalTransactionFees": "0.37",
        "numberOfUniqueBitcoinAddressesUsed": "889",
        "totalOutputVolumeValue": "104730.61",
        "averageNumberOfTransactionsPerBlock": "2"
    },
    {
        "month": "11",
        "day": "27",
        "year": "2010",
        "price": "0.284399",
        "totalCirculation": "4708650",
        "totalTransactionFees": "0.01",
        "numberOfUniqueBitcoinAddressesUsed": "630",
        "totalOutputVolumeValue": "31891.1",
        "averageNumberOfTransactionsPerBlock": "2"
    },
    {
        "month": "11",
        "day": "28",
        "year": "2010",
        "price": "0.28461",
        "totalCirculation": "4716950",
        "totalTransactionFees": "0.01",
        "numberOfUniqueBitcoinAddressesUsed": "553",
        "totalOutputVolumeValue": "33924.38",
        "averageNumberOfTransactionsPerBlock": "2"
    },
    {
        "month": "11",
        "day": "29",
        "year": "2010",
        "price": "0.279",
        "totalCirculation": "4727550",
        "totalTransactionFees": "0.03",
        "numberOfUniqueBitcoinAddressesUsed": "514",
        "totalOutputVolumeValue": "33563.41",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "11",
        "day": "30",
        "year": "2010",
        "price": "0.275",
        "totalCirculation": "4738050",
        "totalTransactionFees": "0.01",
        "numberOfUniqueBitcoinAddressesUsed": "565",
        "totalOutputVolumeValue": "51951.56",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "12",
        "day": "1",
        "year": "2010",
        "price": "0.225",
        "totalCirculation": "4746900",
        "totalTransactionFees": "0.02",
        "numberOfUniqueBitcoinAddressesUsed": "700",
        "totalOutputVolumeValue": "84893.23",
        "averageNumberOfTransactionsPerBlock": "1"
    },
    {
        "month": "12",
        "day": "2",
        "year": "2010",
        "price": "0.25",
        "totalCirculation": "4756550",
        "totalTransactionFees": "0.07",
        "numberOfUniqueBitcoinAddressesUsed": "586",
        "totalOutputVolumeValue": "80412.8",
        "averageNumberOfTransactionsPerBlock": "2"
    },
    {
        "month": "12",
        "day": "3",
        "year": "2010",
        "price": "0.2553",
        "totalCirculation": "4766150",
        "totalTransactionFees": "0.02",
        "numberOfUniqueBitcoinAddressesUsed": "510",
        "totalOutputVolumeValue": "40131.16",
        "averageNumberOfTransactionsPerBlock": "2"
    },
    {
        "month": "12",
        "day": "4",
        "year": "2010",
        "price": "0.2589",
        "totalCirculation": "4777100",
        "totalTransactionFees": "0.01",
        "numberOfUniqueBitcoinAddressesUsed": "515",
        "totalOutputVolumeValue": "62846.94793",
        "averageNumberOfTransactionsPerBlock": "2"
    },
    {
        "month": "12",
        "day": "5",
        "year": "2010",
        "price": "0.235",
        "totalCirculation": "4789000",
        "totalTransactionFees": "0.02090727",
        "numberOfUniqueBitcoinAddressesUsed": "546",
        "totalOutputVolumeValue": "46592.15405",
        "averageNumberOfTransactionsPerBlock": "2"
    },
    {
        "month": "12",
        "day": "6",
        "year": "2010",
        "price": "0.225",
        "totalCirculation": "4801000",
        "totalTransactionFees": "0.05518713",
        "numberOfUniqueBitcoinAddressesUsed": "540",
        "totalOutputVolumeValue": "109183.7461",
        "averageNumberOfTransactionsPerBlock": "2"
    },
    {
        "month": "12",
        "day": "7",
        "year": "2010",
        "price": "0.226",
        "totalCirculation": "4812650",
        "totalTransactionFees": "0.03214637",
        "numberOfUniqueBitcoinAddressesUsed": "709",
        "totalOutputVolumeValue": "69114.75344",
        "averageNumberOfTransactionsPerBlock": "3"
    },
    {
        "month": "12",
        "day": "8",
        "year": "2010",
        "price": "0.2477",
        "totalCirculation": "4824200",
        "totalTransactionFees": "0.08",
        "numberOfUniqueBitcoinAddressesUsed": "686",
        "totalOutputVolumeValue": "64972.24655",
        "averageNumberOfTransactionsPerBlock": "4"
    },
    {
        "month": "12",
        "day": "9",
        "year": "2010",
        "price": "0.2388",
        "totalCirculation": "4836700",
        "totalTransactionFees": "0.04727152",
        "numberOfUniqueBitcoinAddressesUsed": "639",
        "totalOutputVolumeValue": "52106.58691",
        "averageNumberOfTransactionsPerBlock": "4"
    },
    {
        "month": "12",
        "day": "10",
        "year": "2010",
        "price": "0.204",
        "totalCirculation": "4844200",
        "totalTransactionFees": "0.06000109",
        "numberOfUniqueBitcoinAddressesUsed": "514",
        "totalOutputVolumeValue": "40043.89",
        "averageNumberOfTransactionsPerBlock": "3"
    },
    {
        "month": "12",
        "day": "11",
        "year": "2010",
        "price": "0.2275",
        "totalCirculation": "4852800",
        "totalTransactionFees": "0.07724798",
        "numberOfUniqueBitcoinAddressesUsed": "773",
        "totalOutputVolumeValue": "83411.69703",
        "averageNumberOfTransactionsPerBlock": "2"
    },
    {
        "month": "12",
        "day": "12",
        "year": "2010",
        "price": "0.228",
        "totalCirculation": "4861500",
        "totalTransactionFees": "0.16893365",
        "numberOfUniqueBitcoinAddressesUsed": "832",
        "totalOutputVolumeValue": "51986.97893",
        "averageNumberOfTransactionsPerBlock": "2"
    },
    {
        "month": "12",
        "day": "13",
        "year": "2010",
        "price": "0.22748",
        "totalCirculation": "4869100",
        "totalTransactionFees": "0.34111695",
        "numberOfUniqueBitcoinAddressesUsed": "1116",
        "totalOutputVolumeValue": "145857.1287",
        "averageNumberOfTransactionsPerBlock": "2"
    },
    {
        "month": "12",
        "day": "14",
        "year": "2010",
        "price": "0.23",
        "totalCirculation": "4877250",
        "totalTransactionFees": "0.03395871",
        "numberOfUniqueBitcoinAddressesUsed": "978",
        "totalOutputVolumeValue": "159576.2925",
        "averageNumberOfTransactionsPerBlock": "2"
    },
    {
        "month": "12",
        "day": "15",
        "year": "2010",
        "price": "0.2468",
        "totalCirculation": "4886200",
        "totalTransactionFees": "0.0723952",
        "numberOfUniqueBitcoinAddressesUsed": "841",
        "totalOutputVolumeValue": "121157.0697",
        "averageNumberOfTransactionsPerBlock": "5"
    },
    {
        "month": "12",
        "day": "16",
        "year": "2010",
        "price": "0.2459",
        "totalCirculation": "4895500",
        "totalTransactionFees": "0.10473581",
        "numberOfUniqueBitcoinAddressesUsed": "700",
        "totalOutputVolumeValue": "94420.28754",
        "averageNumberOfTransactionsPerBlock": "3"
    },
    {
        "month": "12",
        "day": "17",
        "year": "2010",
        "price": "0.255",
        "totalCirculation": "4904150",
        "totalTransactionFees": "0.05382187",
        "numberOfUniqueBitcoinAddressesUsed": "654",
        "totalOutputVolumeValue": "74686.69058",
        "averageNumberOfTransactionsPerBlock": "4"
    },
    {
        "month": "12",
        "day": "18",
        "year": "2010",
        "price": "0.249",
        "totalCirculation": "4912050",
        "totalTransactionFees": "0.21944472",
        "numberOfUniqueBitcoinAddressesUsed": "603",
        "totalOutputVolumeValue": "86309.052",
        "averageNumberOfTransactionsPerBlock": "3"
    },
    {
        "month": "12",
        "day": "19",
        "year": "2010",
        "price": "0.2499",
        "totalCirculation": "4921250",
        "totalTransactionFees": "0.11218083",
        "numberOfUniqueBitcoinAddressesUsed": "775",
        "totalOutputVolumeValue": "112871.8011",
        "averageNumberOfTransactionsPerBlock": "3"
    },
    {
        "month": "12",
        "day": "20",
        "year": "2010",
        "price": "0.275",
        "totalCirculation": "4929200",
        "totalTransactionFees": "0.07883365",
        "numberOfUniqueBitcoinAddressesUsed": "1100",
        "totalOutputVolumeValue": "69753.33884",
        "averageNumberOfTransactionsPerBlock": "3"
    },
    {
        "month": "12",
        "day": "21",
        "year": "2010",
        "price": "0.26909",
        "totalCirculation": "4939050",
        "totalTransactionFees": "0.12815952",
        "numberOfUniqueBitcoinAddressesUsed": "828",
        "totalOutputVolumeValue": "94510.82485",
        "averageNumberOfTransactionsPerBlock": "4"
    },
    {
        "month": "12",
        "day": "22",
        "year": "2010",
        "price": "0.267",
        "totalCirculation": "4946950",
        "totalTransactionFees": "0.17743052",
        "numberOfUniqueBitcoinAddressesUsed": "875",
        "totalOutputVolumeValue": "122101.3124",
        "averageNumberOfTransactionsPerBlock": "3"
    },
    {
        "month": "12",
        "day": "23",
        "year": "2010",
        "price": "0.25",
        "totalCirculation": "4954100",
        "totalTransactionFees": "0.06",
        "numberOfUniqueBitcoinAddressesUsed": "860",
        "totalOutputVolumeValue": "75604.72",
        "averageNumberOfTransactionsPerBlock": "3"
    },
    {
        "month": "12",
        "day": "24",
        "year": "2010",
        "price": "0.25",
        "totalCirculation": "4961600",
        "totalTransactionFees": "0.08829328",
        "numberOfUniqueBitcoinAddressesUsed": "788",
        "totalOutputVolumeValue": "73279.39774",
        "averageNumberOfTransactionsPerBlock": "3"
    },
    {
        "month": "12",
        "day": "25",
        "year": "2010",
        "price": "0.25",
        "totalCirculation": "4969700",
        "totalTransactionFees": "0.04743052",
        "numberOfUniqueBitcoinAddressesUsed": "793",
        "totalOutputVolumeValue": "106564.9772",
        "averageNumberOfTransactionsPerBlock": "3"
    },
    {
        "month": "12",
        "day": "26",
        "year": "2010",
        "price": "0.269999",
        "totalCirculation": "4977050",
        "totalTransactionFees": "0.07",
        "numberOfUniqueBitcoinAddressesUsed": "946",
        "totalOutputVolumeValue": "93879.60339",
        "averageNumberOfTransactionsPerBlock": "3"
    },
    {
        "month": "12",
        "day": "27",
        "year": "2010",
        "price": "0.265",
        "totalCirculation": "4985100",
        "totalTransactionFees": "0.10834879",
        "numberOfUniqueBitcoinAddressesUsed": "678",
        "totalOutputVolumeValue": "72783.89344",
        "averageNumberOfTransactionsPerBlock": "3"
    },
    {
        "month": "12",
        "day": "28",
        "year": "2010",
        "price": "0.28",
        "totalCirculation": "4993550",
        "totalTransactionFees": "0.09056339",
        "numberOfUniqueBitcoinAddressesUsed": "772",
        "totalOutputVolumeValue": "81651.99113",
        "averageNumberOfTransactionsPerBlock": "3"
    },
    {
        "month": "12",
        "day": "29",
        "year": "2010",
        "price": "0.301",
        "totalCirculation": "5002150",
        "totalTransactionFees": "0.12251652",
        "numberOfUniqueBitcoinAddressesUsed": "848",
        "totalOutputVolumeValue": "127133.5325",
        "averageNumberOfTransactionsPerBlock": "5"
    },
    {
        "month": "12",
        "day": "30",
        "year": "2010",
        "price": "0.299999",
        "totalCirculation": "5010150",
        "totalTransactionFees": "0.13238552",
        "numberOfUniqueBitcoinAddressesUsed": "730",
        "totalOutputVolumeValue": "66672.77922",
        "averageNumberOfTransactionsPerBlock": "8"
    },
    {
        "month": "12",
        "day": "31",
        "year": "2010",
        "price": "0.299999",
        "totalCirculation": "5018350",
        "totalTransactionFees": "0.02335061",
        "numberOfUniqueBitcoinAddressesUsed": "768",
        "totalOutputVolumeValue": "66441.89335",
        "averageNumberOfTransactionsPerBlock": "7"
    },
    {
        "month": "1",
        "day": "1",
        "year": "2011",
        "price": "0.299998",
        "totalCirculation": "5027250",
        "totalTransactionFees": "0.06915258",
        "numberOfUniqueBitcoinAddressesUsed": "775",
        "totalOutputVolumeValue": "73186.62915",
        "averageNumberOfTransactionsPerBlock": "5"
    },
    {
        "month": "1",
        "day": "2",
        "year": "2011",
        "price": "0.299996",
        "totalCirculation": "5036250",
        "totalTransactionFees": "0.09129091",
        "numberOfUniqueBitcoinAddressesUsed": "779",
        "totalOutputVolumeValue": "47462.47129",
        "averageNumberOfTransactionsPerBlock": "6"
    },
    {
        "month": "1",
        "day": "3",
        "year": "2011",
        "price": "0.299998",
        "totalCirculation": "5044450",
        "totalTransactionFees": "0.69638641",
        "numberOfUniqueBitcoinAddressesUsed": "956",
        "totalOutputVolumeValue": "64231.71771",
        "averageNumberOfTransactionsPerBlock": "7"
    },
    {
        "month": "1",
        "day": "4",
        "year": "2011",
        "price": "0.299899",
        "totalCirculation": "5051550",
        "totalTransactionFees": "0.07954493",
        "numberOfUniqueBitcoinAddressesUsed": "943",
        "totalOutputVolumeValue": "70985.12955",
        "averageNumberOfTransactionsPerBlock": "7"
    },
    {
        "month": "1",
        "day": "5",
        "year": "2011",
        "price": "0.298998",
        "totalCirculation": "5059050",
        "totalTransactionFees": "0.05838636",
        "numberOfUniqueBitcoinAddressesUsed": "1064",
        "totalOutputVolumeValue": "55566.7204",
        "averageNumberOfTransactionsPerBlock": "8"
    },
    {
        "month": "1",
        "day": "6",
        "year": "2011",
        "price": "0.299",
        "totalCirculation": "5066400",
        "totalTransactionFees": "0.08757579",
        "numberOfUniqueBitcoinAddressesUsed": "950",
        "totalOutputVolumeValue": "42145.09676",
        "averageNumberOfTransactionsPerBlock": "7"
    },
    {
        "month": "1",
        "day": "7",
        "year": "2011",
        "price": "0.322",
        "totalCirculation": "5073600",
        "totalTransactionFees": "0.07352512",
        "numberOfUniqueBitcoinAddressesUsed": "887",
        "totalOutputVolumeValue": "54915.81689",
        "averageNumberOfTransactionsPerBlock": "7"
    },
    {
        "month": "1",
        "day": "8",
        "year": "2011",
        "price": "0.322898",
        "totalCirculation": "5083200",
        "totalTransactionFees": "0.02",
        "numberOfUniqueBitcoinAddressesUsed": "1267",
        "totalOutputVolumeValue": "72498.49",
        "averageNumberOfTransactionsPerBlock": "6"
    },
    {
        "month": "1",
        "day": "9",
        "year": "2011",
        "price": "0.322998",
        "totalCirculation": "5090800",
        "totalTransactionFees": "0.13765433",
        "numberOfUniqueBitcoinAddressesUsed": "1110",
        "totalOutputVolumeValue": "46365.63235",
        "averageNumberOfTransactionsPerBlock": "7"
    },
    {
        "month": "1",
        "day": "10",
        "year": "2011",
        "price": "0.329",
        "totalCirculation": "5099150",
        "totalTransactionFees": "0.07884469",
        "numberOfUniqueBitcoinAddressesUsed": "1209",
        "totalOutputVolumeValue": "75912.06856",
        "averageNumberOfTransactionsPerBlock": "5"
    },
    {
        "month": "1",
        "day": "11",
        "year": "2011",
        "price": "0.329",
        "totalCirculation": "5107250",
        "totalTransactionFees": "0.03",
        "numberOfUniqueBitcoinAddressesUsed": "1185",
        "totalOutputVolumeValue": "85878.09849",
        "averageNumberOfTransactionsPerBlock": "5"
    },
    {
        "month": "1",
        "day": "12",
        "year": "2011",
        "price": "0.35",
        "totalCirculation": "5115600",
        "totalTransactionFees": "0.24212907",
        "numberOfUniqueBitcoinAddressesUsed": "1084",
        "totalOutputVolumeValue": "105022.8082",
        "averageNumberOfTransactionsPerBlock": "4"
    },
    {
        "month": "1",
        "day": "13",
        "year": "2011",
        "price": "0.405",
        "totalCirculation": "5124850",
        "totalTransactionFees": "0.08",
        "numberOfUniqueBitcoinAddressesUsed": "1150",
        "totalOutputVolumeValue": "74079.13534",
        "averageNumberOfTransactionsPerBlock": "5"
    },
    {
        "month": "1",
        "day": "14",
        "year": "2011",
        "price": "0.45",
        "totalCirculation": "5133550",
        "totalTransactionFees": "0.05493887",
        "numberOfUniqueBitcoinAddressesUsed": "1134",
        "totalOutputVolumeValue": "117634.0768",
        "averageNumberOfTransactionsPerBlock": "5"
    },
    {
        "month": "1",
        "day": "15",
        "year": "2011",
        "price": "0.4",
        "totalCirculation": "5142150",
        "totalTransactionFees": "0.10987774",
        "numberOfUniqueBitcoinAddressesUsed": "1094",
        "totalOutputVolumeValue": "99128.74572",
        "averageNumberOfTransactionsPerBlock": "5"
    },
    {
        "month": "1",
        "day": "16",
        "year": "2011",
        "price": "0.4",
        "totalCirculation": "5150800",
        "totalTransactionFees": "0.07835008",
        "numberOfUniqueBitcoinAddressesUsed": "1250",
        "totalOutputVolumeValue": "49341.45847",
        "averageNumberOfTransactionsPerBlock": "5"
    },
    {
        "month": "1",
        "day": "17",
        "year": "2011",
        "price": "0.4",
        "totalCirculation": "5159450",
        "totalTransactionFees": "0.15276428",
        "numberOfUniqueBitcoinAddressesUsed": "1080",
        "totalOutputVolumeValue": "91444.8494",
        "averageNumberOfTransactionsPerBlock": "8"
    },
    {
        "month": "1",
        "day": "18",
        "year": "2011",
        "price": "0.38679",
        "totalCirculation": "5167250",
        "totalTransactionFees": "0.03768351",
        "numberOfUniqueBitcoinAddressesUsed": "1200",
        "totalOutputVolumeValue": "77342.27768",
        "averageNumberOfTransactionsPerBlock": "6"
    },
    {
        "month": "1",
        "day": "19",
        "year": "2011",
        "price": "0.3401",
        "totalCirculation": "5176100",
        "totalTransactionFees": "0.06323904",
        "numberOfUniqueBitcoinAddressesUsed": "1281",
        "totalOutputVolumeValue": "93918.80255",
        "averageNumberOfTransactionsPerBlock": "7"
    },
    {
        "month": "1",
        "day": "20",
        "year": "2011",
        "price": "0.3675",
        "totalCirculation": "5184500",
        "totalTransactionFees": "0.12736667",
        "numberOfUniqueBitcoinAddressesUsed": "1125",
        "totalOutputVolumeValue": "75968.89447",
        "averageNumberOfTransactionsPerBlock": "6"
    },
    {
        "month": "1",
        "day": "21",
        "year": "2011",
        "price": "0.44",
        "totalCirculation": "5193400",
        "totalTransactionFees": "0.02048576",
        "numberOfUniqueBitcoinAddressesUsed": "1354",
        "totalOutputVolumeValue": "60052.79392",
        "averageNumberOfTransactionsPerBlock": "5"
    },
    {
        "month": "1",
        "day": "22",
        "year": "2011",
        "price": "0.4299",
        "totalCirculation": "5201600",
        "totalTransactionFees": "0.45874839",
        "numberOfUniqueBitcoinAddressesUsed": "1742",
        "totalOutputVolumeValue": "79499.30688",
        "averageNumberOfTransactionsPerBlock": "5"
    },
    {
        "month": "1",
        "day": "23",
        "year": "2011",
        "price": "0.4443",
        "totalCirculation": "5210100",
        "totalTransactionFees": "0.29048576",
        "numberOfUniqueBitcoinAddressesUsed": "1397",
        "totalOutputVolumeValue": "82264.66234",
        "averageNumberOfTransactionsPerBlock": "6"
    },
    {
        "month": "1",
        "day": "24",
        "year": "2011",
        "price": "0.443",
        "totalCirculation": "5219100",
        "totalTransactionFees": "0.30905919",
        "numberOfUniqueBitcoinAddressesUsed": "1682",
        "totalOutputVolumeValue": "71524.41976",
        "averageNumberOfTransactionsPerBlock": "8"
    },
    {
        "month": "1",
        "day": "25",
        "year": "2011",
        "price": "0.425",
        "totalCirculation": "5226900",
        "totalTransactionFees": "0.14",
        "numberOfUniqueBitcoinAddressesUsed": "1282",
        "totalOutputVolumeValue": "76827.20777",
        "averageNumberOfTransactionsPerBlock": "13"
    },
    {
        "month": "1",
        "day": "26",
        "year": "2011",
        "price": "0.425",
        "totalCirculation": "5236650",
        "totalTransactionFees": "0.12905919",
        "numberOfUniqueBitcoinAddressesUsed": "1192",
        "totalOutputVolumeValue": "61868.48247",
        "averageNumberOfTransactionsPerBlock": "12"
    },
    {
        "month": "1",
        "day": "27",
        "year": "2011",
        "price": "0.4174",
        "totalCirculation": "5244650",
        "totalTransactionFees": "0.49",
        "numberOfUniqueBitcoinAddressesUsed": "1184",
        "totalOutputVolumeValue": "907174.35",
        "averageNumberOfTransactionsPerBlock": "5"
    },
    {
        "month": "1",
        "day": "28",
        "year": "2011",
        "price": "0.45",
        "totalCirculation": "5252800",
        "totalTransactionFees": "0.13",
        "numberOfUniqueBitcoinAddressesUsed": "1329",
        "totalOutputVolumeValue": "203259.1191",
        "averageNumberOfTransactionsPerBlock": "6"
    },
    {
        "month": "1",
        "day": "29",
        "year": "2011",
        "price": "0.446",
        "totalCirculation": "5260300",
        "totalTransactionFees": "0.31195608",
        "numberOfUniqueBitcoinAddressesUsed": "1642",
        "totalOutputVolumeValue": "64724.60196",
        "averageNumberOfTransactionsPerBlock": "5"
    },
    {
        "month": "1",
        "day": "30",
        "year": "2011",
        "price": "0.48",
        "totalCirculation": "5268500",
        "totalTransactionFees": "0.22108788",
        "numberOfUniqueBitcoinAddressesUsed": "2494",
        "totalOutputVolumeValue": "290621.7287",
        "averageNumberOfTransactionsPerBlock": "4"
    },
    {
        "month": "1",
        "day": "31",
        "year": "2011",
        "price": "0.5",
        "totalCirculation": "5276000",
        "totalTransactionFees": "3.39",
        "numberOfUniqueBitcoinAddressesUsed": "2162",
        "totalOutputVolumeValue": "256095.7798",
        "averageNumberOfTransactionsPerBlock": "4"
    },
    {
        "month": "2",
        "day": "1",
        "year": "2011",
        "price": "0.95",
        "totalCirculation": "5284950",
        "totalTransactionFees": "0.68108788",
        "numberOfUniqueBitcoinAddressesUsed": "1311",
        "totalOutputVolumeValue": "151647.5409",
        "averageNumberOfTransactionsPerBlock": "4"
    },
    {
        "month": "2",
        "day": "2",
        "year": "2011",
        "price": "0.840099",
        "totalCirculation": "5293050",
        "totalTransactionFees": "0.28",
        "numberOfUniqueBitcoinAddressesUsed": "1283",
        "totalOutputVolumeValue": "157297.492",
        "averageNumberOfTransactionsPerBlock": "4"
    },
    {
        "month": "2",
        "day": "3",
        "year": "2011",
        "price": "0.75",
        "totalCirculation": "5300500",
        "totalTransactionFees": "0.11818974",
        "numberOfUniqueBitcoinAddressesUsed": "975",
        "totalOutputVolumeValue": "78511.48801",
        "averageNumberOfTransactionsPerBlock": "4"
    },
    {
        "month": "2",
        "day": "4",
        "year": "2011",
        "price": "0.88",
        "totalCirculation": "5310000",
        "totalTransactionFees": "0.08586535",
        "numberOfUniqueBitcoinAddressesUsed": "1134",
        "totalOutputVolumeValue": "59511.57695",
        "averageNumberOfTransactionsPerBlock": "5"
    },
    {
        "month": "2",
        "day": "5",
        "year": "2011",
        "price": "0.9167",
        "totalCirculation": "5319150",
        "totalTransactionFees": "0.2159958",
        "numberOfUniqueBitcoinAddressesUsed": "1094",
        "totalOutputVolumeValue": "79984.52529",
        "averageNumberOfTransactionsPerBlock": "9"
    },
    {
        "month": "2",
        "day": "6",
        "year": "2011",
        "price": "0.92",
        "totalCirculation": "5327900",
        "totalTransactionFees": "0.13",
        "numberOfUniqueBitcoinAddressesUsed": "1060",
        "totalOutputVolumeValue": "66778.55139",
        "averageNumberOfTransactionsPerBlock": "12"
    },
    {
        "month": "2",
        "day": "7",
        "year": "2011",
        "price": "0.90585",
        "totalCirculation": "5338200",
        "totalTransactionFees": "0.19347709",
        "numberOfUniqueBitcoinAddressesUsed": "1094",
        "totalOutputVolumeValue": "175102.3847",
        "averageNumberOfTransactionsPerBlock": "10"
    },
    {
        "month": "2",
        "day": "8",
        "year": "2011",
        "price": "0.9",
        "totalCirculation": "5346800",
        "totalTransactionFees": "0.32049075",
        "numberOfUniqueBitcoinAddressesUsed": "1053",
        "totalOutputVolumeValue": "73028.91772",
        "averageNumberOfTransactionsPerBlock": "9"
    },
    {
        "month": "2",
        "day": "9",
        "year": "2011",
        "price": "0.935",
        "totalCirculation": "5355950",
        "totalTransactionFees": "0.04541728",
        "numberOfUniqueBitcoinAddressesUsed": "1387",
        "totalOutputVolumeValue": "84880.26913",
        "averageNumberOfTransactionsPerBlock": "10"
    },
    {
        "month": "2",
        "day": "10",
        "year": "2011",
        "price": "1.1",
        "totalCirculation": "5365400",
        "totalTransactionFees": "0.80304408",
        "numberOfUniqueBitcoinAddressesUsed": "2797",
        "totalOutputVolumeValue": "238910.2826",
        "averageNumberOfTransactionsPerBlock": "10"
    },
    {
        "month": "2",
        "day": "11",
        "year": "2011",
        "price": "1.0065",
        "totalCirculation": "5374950",
        "totalTransactionFees": "0.50910687",
        "numberOfUniqueBitcoinAddressesUsed": "3757",
        "totalOutputVolumeValue": "266155.7167",
        "averageNumberOfTransactionsPerBlock": "8"
    },
    {
        "month": "2",
        "day": "12",
        "year": "2011",
        "price": "1.0899",
        "totalCirculation": "5384450",
        "totalTransactionFees": "0.63186934",
        "numberOfUniqueBitcoinAddressesUsed": "2918",
        "totalOutputVolumeValue": "160649.7334",
        "averageNumberOfTransactionsPerBlock": "9"
    },
    {
        "month": "2",
        "day": "13",
        "year": "2011",
        "price": "1.08",
        "totalCirculation": "5394650",
        "totalTransactionFees": "0.32",
        "numberOfUniqueBitcoinAddressesUsed": "2608",
        "totalOutputVolumeValue": "120512.5925",
        "averageNumberOfTransactionsPerBlock": "9"
    },
    {
        "month": "2",
        "day": "14",
        "year": "2011",
        "price": "1.08",
        "totalCirculation": "5403950",
        "totalTransactionFees": "2.13",
        "numberOfUniqueBitcoinAddressesUsed": "2838",
        "totalOutputVolumeValue": "112566.04",
        "averageNumberOfTransactionsPerBlock": "10"
    },
    {
        "month": "2",
        "day": "15",
        "year": "2011",
        "price": "1.085",
        "totalCirculation": "5414550",
        "totalTransactionFees": "0.84",
        "numberOfUniqueBitcoinAddressesUsed": "3046",
        "totalOutputVolumeValue": "134265.1019",
        "averageNumberOfTransactionsPerBlock": "9"
    },
    {
        "month": "2",
        "day": "16",
        "year": "2011",
        "price": "1.05019",
        "totalCirculation": "5426100",
        "totalTransactionFees": "0.22346193",
        "numberOfUniqueBitcoinAddressesUsed": "2466",
        "totalOutputVolumeValue": "79208.8758",
        "averageNumberOfTransactionsPerBlock": "10"
    },
    {
        "month": "2",
        "day": "17",
        "year": "2011",
        "price": "1.05019",
        "totalCirculation": "5438100",
        "totalTransactionFees": "0.62346193",
        "numberOfUniqueBitcoinAddressesUsed": "3096",
        "totalOutputVolumeValue": "98007.54292",
        "averageNumberOfTransactionsPerBlock": "10"
    },
    {
        "month": "2",
        "day": "18",
        "year": "2011",
        "price": "1.05019",
        "totalCirculation": "5448900",
        "totalTransactionFees": "0.46",
        "numberOfUniqueBitcoinAddressesUsed": "3034",
        "totalOutputVolumeValue": "114822.03",
        "averageNumberOfTransactionsPerBlock": "9"
    },
    {
        "month": "2",
        "day": "19",
        "year": "2011",
        "price": "1.02",
        "totalCirculation": "5457700",
        "totalTransactionFees": "0.51",
        "numberOfUniqueBitcoinAddressesUsed": "2542",
        "totalOutputVolumeValue": "185159.2337",
        "averageNumberOfTransactionsPerBlock": "9"
    },
    {
        "month": "2",
        "day": "20",
        "year": "2011",
        "price": "0.954896",
        "totalCirculation": "5467100",
        "totalTransactionFees": "0.18",
        "numberOfUniqueBitcoinAddressesUsed": "2492",
        "totalOutputVolumeValue": "211556.62",
        "averageNumberOfTransactionsPerBlock": "9"
    },
    {
        "month": "2",
        "day": "21",
        "year": "2011",
        "price": "0.8796",
        "totalCirculation": "5476400",
        "totalTransactionFees": "0.5",
        "numberOfUniqueBitcoinAddressesUsed": "2857",
        "totalOutputVolumeValue": "234954.48",
        "averageNumberOfTransactionsPerBlock": "7"
    },
    {
        "month": "2",
        "day": "22",
        "year": "2011",
        "price": "0.869499",
        "totalCirculation": "5487000",
        "totalTransactionFees": "0.19",
        "numberOfUniqueBitcoinAddressesUsed": "3143",
        "totalOutputVolumeValue": "215033.45",
        "averageNumberOfTransactionsPerBlock": "8"
    },
    {
        "month": "2",
        "day": "23",
        "year": "2011",
        "price": "0.95",
        "totalCirculation": "5499150",
        "totalTransactionFees": "0.40332199",
        "numberOfUniqueBitcoinAddressesUsed": "3480",
        "totalOutputVolumeValue": "524405.1333",
        "averageNumberOfTransactionsPerBlock": "11"
    },
    {
        "month": "2",
        "day": "24",
        "year": "2011",
        "price": "0.9499",
        "totalCirculation": "5509850",
        "totalTransactionFees": "0.15769472",
        "numberOfUniqueBitcoinAddressesUsed": "2847",
        "totalOutputVolumeValue": "219771.5677",
        "averageNumberOfTransactionsPerBlock": "12"
    },
    {
        "month": "2",
        "day": "25",
        "year": "2011",
        "price": "1",
        "totalCirculation": "5520950",
        "totalTransactionFees": "0.26097152",
        "numberOfUniqueBitcoinAddressesUsed": "3067",
        "totalOutputVolumeValue": "204983.1092",
        "averageNumberOfTransactionsPerBlock": "17"
    },
    {
        "month": "2",
        "day": "26",
        "year": "2011",
        "price": "0.988567",
        "totalCirculation": "5533500",
        "totalTransactionFees": "0.71049575",
        "numberOfUniqueBitcoinAddressesUsed": "2901",
        "totalOutputVolumeValue": "187552.7905",
        "averageNumberOfTransactionsPerBlock": "16"
    },
    {
        "month": "2",
        "day": "27",
        "year": "2011",
        "price": "0.96",
        "totalCirculation": "5547050",
        "totalTransactionFees": "0.74",
        "numberOfUniqueBitcoinAddressesUsed": "3198",
        "totalOutputVolumeValue": "203856.7486",
        "averageNumberOfTransactionsPerBlock": "10"
    },
    {
        "month": "2",
        "day": "28",
        "year": "2011",
        "price": "0.949231",
        "totalCirculation": "5555400",
        "totalTransactionFees": "0.53785377",
        "numberOfUniqueBitcoinAddressesUsed": "2706",
        "totalOutputVolumeValue": "124226.5379",
        "averageNumberOfTransactionsPerBlock": "7"
    },
    {
        "month": "3",
        "day": "1",
        "year": "2011",
        "price": "0.97",
        "totalCirculation": "5561900",
        "totalTransactionFees": "0.73455377",
        "numberOfUniqueBitcoinAddressesUsed": "2494",
        "totalOutputVolumeValue": "996104.8245",
        "averageNumberOfTransactionsPerBlock": "7"
    },
    {
        "month": "3",
        "day": "2",
        "year": "2011",
        "price": "0.9498",
        "totalCirculation": "5570350",
        "totalTransactionFees": "0.2465",
        "numberOfUniqueBitcoinAddressesUsed": "4755",
        "totalOutputVolumeValue": "1775312.644",
        "averageNumberOfTransactionsPerBlock": "9"
    },
    {
        "month": "3",
        "day": "3",
        "year": "2011",
        "price": "0.94",
        "totalCirculation": "5579500",
        "totalTransactionFees": "6.3913",
        "numberOfUniqueBitcoinAddressesUsed": "4099",
        "totalOutputVolumeValue": "951257.8129",
        "averageNumberOfTransactionsPerBlock": "13"
    },
    {
        "month": "3",
        "day": "4",
        "year": "2011",
        "price": "0.9392",
        "totalCirculation": "5589450",
        "totalTransactionFees": "1.3986",
        "numberOfUniqueBitcoinAddressesUsed": "2996",
        "totalOutputVolumeValue": "255314.9894",
        "averageNumberOfTransactionsPerBlock": "11"
    },
    {
        "month": "3",
        "day": "5",
        "year": "2011",
        "price": "0.918901",
        "totalCirculation": "5602700",
        "totalTransactionFees": "1.21430001",
        "numberOfUniqueBitcoinAddressesUsed": "2839",
        "totalOutputVolumeValue": "198745.6428",
        "averageNumberOfTransactionsPerBlock": "12"
    },
    {
        "month": "3",
        "day": "6",
        "year": "2011",
        "price": "0.910445",
        "totalCirculation": "5616200",
        "totalTransactionFees": "5.13130001",
        "numberOfUniqueBitcoinAddressesUsed": "2750",
        "totalOutputVolumeValue": "199347.4646",
        "averageNumberOfTransactionsPerBlock": "15"
    },
    {
        "month": "3",
        "day": "7",
        "year": "2011",
        "price": "0.909",
        "totalCirculation": "5627950",
        "totalTransactionFees": "5.69913744",
        "numberOfUniqueBitcoinAddressesUsed": "2990",
        "totalOutputVolumeValue": "236085.492",
        "averageNumberOfTransactionsPerBlock": "20"
    },
    {
        "month": "3",
        "day": "8",
        "year": "2011",
        "price": "0.9072",
        "totalCirculation": "5637600",
        "totalTransactionFees": "4.60833744",
        "numberOfUniqueBitcoinAddressesUsed": "3547",
        "totalOutputVolumeValue": "163024.8859",
        "averageNumberOfTransactionsPerBlock": "20"
    },
    {
        "month": "3",
        "day": "9",
        "year": "2011",
        "price": "0.883751",
        "totalCirculation": "5645500",
        "totalTransactionFees": "3.51649299",
        "numberOfUniqueBitcoinAddressesUsed": "2833",
        "totalOutputVolumeValue": "243670.8865",
        "averageNumberOfTransactionsPerBlock": "25"
    },
    {
        "month": "3",
        "day": "10",
        "year": "2011",
        "price": "0.87",
        "totalCirculation": "5651450",
        "totalTransactionFees": "2.47963744",
        "numberOfUniqueBitcoinAddressesUsed": "2388",
        "totalOutputVolumeValue": "267187.8725",
        "averageNumberOfTransactionsPerBlock": "25"
    },
    {
        "month": "3",
        "day": "11",
        "year": "2011",
        "price": "0.9329",
        "totalCirculation": "5658200",
        "totalTransactionFees": "6.63689296",
        "numberOfUniqueBitcoinAddressesUsed": "2834",
        "totalOutputVolumeValue": "370094.6952",
        "averageNumberOfTransactionsPerBlock": "22"
    },
    {
        "month": "3",
        "day": "12",
        "year": "2011",
        "price": "0.9197",
        "totalCirculation": "5665050",
        "totalTransactionFees": "1.48693618",
        "numberOfUniqueBitcoinAddressesUsed": "2600",
        "totalOutputVolumeValue": "150036.5403",
        "averageNumberOfTransactionsPerBlock": "24"
    },
    {
        "month": "3",
        "day": "13",
        "year": "2011",
        "price": "0.9196",
        "totalCirculation": "5671000",
        "totalTransactionFees": "1.51553619",
        "numberOfUniqueBitcoinAddressesUsed": "2494",
        "totalOutputVolumeValue": "211035.1511",
        "averageNumberOfTransactionsPerBlock": "19"
    },
    {
        "month": "3",
        "day": "14",
        "year": "2011",
        "price": "0.9",
        "totalCirculation": "5676850",
        "totalTransactionFees": "2.1816162",
        "numberOfUniqueBitcoinAddressesUsed": "2388",
        "totalOutputVolumeValue": "212568.1084",
        "averageNumberOfTransactionsPerBlock": "28"
    },
    {
        "month": "3",
        "day": "15",
        "year": "2011",
        "price": "0.899885",
        "totalCirculation": "5681700",
        "totalTransactionFees": "1.70019999",
        "numberOfUniqueBitcoinAddressesUsed": "2660",
        "totalOutputVolumeValue": "128279.0082",
        "averageNumberOfTransactionsPerBlock": "21"
    },
    {
        "month": "3",
        "day": "16",
        "year": "2011",
        "price": "0.89",
        "totalCirculation": "5689000",
        "totalTransactionFees": "1.81",
        "numberOfUniqueBitcoinAddressesUsed": "2581",
        "totalOutputVolumeValue": "152458.1539",
        "averageNumberOfTransactionsPerBlock": "47"
    },
    {
        "month": "3",
        "day": "17",
        "year": "2011",
        "price": "0.88",
        "totalCirculation": "5695550",
        "totalTransactionFees": "1.49799295",
        "numberOfUniqueBitcoinAddressesUsed": "2663",
        "totalOutputVolumeValue": "174677.6648",
        "averageNumberOfTransactionsPerBlock": "18"
    },
    {
        "month": "3",
        "day": "18",
        "year": "2011",
        "price": "0.850617",
        "totalCirculation": "5702450",
        "totalTransactionFees": "1.22279998",
        "numberOfUniqueBitcoinAddressesUsed": "2802",
        "totalOutputVolumeValue": "174095.3081",
        "averageNumberOfTransactionsPerBlock": "29"
    },
    {
        "month": "3",
        "day": "19",
        "year": "2011",
        "price": "0.824",
        "totalCirculation": "5707900",
        "totalTransactionFees": "1.35779295",
        "numberOfUniqueBitcoinAddressesUsed": "2697",
        "totalOutputVolumeValue": "140795.1853",
        "averageNumberOfTransactionsPerBlock": "14"
    },
    {
        "month": "3",
        "day": "20",
        "year": "2011",
        "price": "0.79",
        "totalCirculation": "5714150",
        "totalTransactionFees": "1.3370787",
        "numberOfUniqueBitcoinAddressesUsed": "2378",
        "totalOutputVolumeValue": "122537.4135",
        "averageNumberOfTransactionsPerBlock": "12"
    },
    {
        "month": "3",
        "day": "21",
        "year": "2011",
        "price": "0.7883",
        "totalCirculation": "5721900",
        "totalTransactionFees": "6.87779295",
        "numberOfUniqueBitcoinAddressesUsed": "5496",
        "totalOutputVolumeValue": "164254.4508",
        "averageNumberOfTransactionsPerBlock": "21"
    },
    {
        "month": "3",
        "day": "22",
        "year": "2011",
        "price": "0.799646",
        "totalCirculation": "5728200",
        "totalTransactionFees": "11.2703",
        "numberOfUniqueBitcoinAddressesUsed": "3504",
        "totalOutputVolumeValue": "207804.8718",
        "averageNumberOfTransactionsPerBlock": "14"
    },
    {
        "month": "3",
        "day": "23",
        "year": "2011",
        "price": "0.85",
        "totalCirculation": "5735600",
        "totalTransactionFees": "16.58666612",
        "numberOfUniqueBitcoinAddressesUsed": "5598",
        "totalOutputVolumeValue": "222690.2667",
        "averageNumberOfTransactionsPerBlock": "20"
    },
    {
        "month": "3",
        "day": "24",
        "year": "2011",
        "price": "0.9",
        "totalCirculation": "5743200",
        "totalTransactionFees": "9.62159233",
        "numberOfUniqueBitcoinAddressesUsed": "3802",
        "totalOutputVolumeValue": "260657.8151",
        "averageNumberOfTransactionsPerBlock": "18"
    },
    {
        "month": "3",
        "day": "25",
        "year": "2011",
        "price": "0.89",
        "totalCirculation": "5751300",
        "totalTransactionFees": "6.33823619",
        "numberOfUniqueBitcoinAddressesUsed": "3624",
        "totalOutputVolumeValue": "233298.8611",
        "averageNumberOfTransactionsPerBlock": "10"
    },
    {
        "month": "3",
        "day": "26",
        "year": "2011",
        "price": "0.905",
        "totalCirculation": "5758350",
        "totalTransactionFees": "4.7801",
        "numberOfUniqueBitcoinAddressesUsed": "3808",
        "totalOutputVolumeValue": "408306.6653",
        "averageNumberOfTransactionsPerBlock": "10"
    },
    {
        "month": "3",
        "day": "27",
        "year": "2011",
        "price": "0.8958",
        "totalCirculation": "5766000",
        "totalTransactionFees": "5.8772327",
        "numberOfUniqueBitcoinAddressesUsed": "3565",
        "totalOutputVolumeValue": "171128.3661",
        "averageNumberOfTransactionsPerBlock": "8"
    },
    {
        "month": "3",
        "day": "28",
        "year": "2011",
        "price": "0.8575",
        "totalCirculation": "5774150",
        "totalTransactionFees": "4.863",
        "numberOfUniqueBitcoinAddressesUsed": "5102",
        "totalOutputVolumeValue": "157029.0518",
        "averageNumberOfTransactionsPerBlock": "9"
    },
    {
        "month": "3",
        "day": "29",
        "year": "2011",
        "price": "0.8",
        "totalCirculation": "5781850",
        "totalTransactionFees": "3.7901",
        "numberOfUniqueBitcoinAddressesUsed": "4182",
        "totalOutputVolumeValue": "126173.7931",
        "averageNumberOfTransactionsPerBlock": "9"
    },
    {
        "month": "3",
        "day": "30",
        "year": "2011",
        "price": "0.795",
        "totalCirculation": "5789650",
        "totalTransactionFees": "3.93090001",
        "numberOfUniqueBitcoinAddressesUsed": "2870",
        "totalOutputVolumeValue": "116933.2883",
        "averageNumberOfTransactionsPerBlock": "12"
    },
    {
        "month": "3",
        "day": "31",
        "year": "2011",
        "price": "0.80098",
        "totalCirculation": "5799750",
        "totalTransactionFees": "4.16",
        "numberOfUniqueBitcoinAddressesUsed": "3692",
        "totalOutputVolumeValue": "158393.7924",
        "averageNumberOfTransactionsPerBlock": "11"
    },
    {
        "month": "4",
        "day": "1",
        "year": "2011",
        "price": "0.79997",
        "totalCirculation": "5808500",
        "totalTransactionFees": "3.1",
        "numberOfUniqueBitcoinAddressesUsed": "2785",
        "totalOutputVolumeValue": "90372.37297",
        "averageNumberOfTransactionsPerBlock": "12"
    },
    {
        "month": "4",
        "day": "2",
        "year": "2011",
        "price": "0.79697",
        "totalCirculation": "5817950",
        "totalTransactionFees": "2.99040002",
        "numberOfUniqueBitcoinAddressesUsed": "2915",
        "totalOutputVolumeValue": "87625.22594",
        "averageNumberOfTransactionsPerBlock": "11"
    },
    {
        "month": "4",
        "day": "3",
        "year": "2011",
        "price": "0.7998",
        "totalCirculation": "5826300",
        "totalTransactionFees": "3.15010002",
        "numberOfUniqueBitcoinAddressesUsed": "2708",
        "totalOutputVolumeValue": "107196.0013",
        "averageNumberOfTransactionsPerBlock": "10"
    },
    {
        "month": "4",
        "day": "4",
        "year": "2011",
        "price": "0.79",
        "totalCirculation": "5835300",
        "totalTransactionFees": "5.896868",
        "numberOfUniqueBitcoinAddressesUsed": "3887",
        "totalOutputVolumeValue": "127820.0875",
        "averageNumberOfTransactionsPerBlock": "11"
    },
    {
        "month": "4",
        "day": "5",
        "year": "2011",
        "price": "0.71",
        "totalCirculation": "5845400",
        "totalTransactionFees": "5.4307",
        "numberOfUniqueBitcoinAddressesUsed": "3741",
        "totalOutputVolumeValue": "151570.1365",
        "averageNumberOfTransactionsPerBlock": "9"
    },
    {
        "month": "4",
        "day": "6",
        "year": "2011",
        "price": "0.747844",
        "totalCirculation": "5852350",
        "totalTransactionFees": "5.60040001",
        "numberOfUniqueBitcoinAddressesUsed": "3149",
        "totalOutputVolumeValue": "94074.9679",
        "averageNumberOfTransactionsPerBlock": "12"
    },
    {
        "month": "4",
        "day": "7",
        "year": "2011",
        "price": "0.7677",
        "totalCirculation": "5860450",
        "totalTransactionFees": "3.1702",
        "numberOfUniqueBitcoinAddressesUsed": "3057",
        "totalOutputVolumeValue": "122171.9512",
        "averageNumberOfTransactionsPerBlock": "12"
    },
    {
        "month": "4",
        "day": "8",
        "year": "2011",
        "price": "0.799",
        "totalCirculation": "5868250",
        "totalTransactionFees": "3.8001",
        "numberOfUniqueBitcoinAddressesUsed": "2897",
        "totalOutputVolumeValue": "131707.3847",
        "averageNumberOfTransactionsPerBlock": "12"
    },
    {
        "month": "4",
        "day": "9",
        "year": "2011",
        "price": "0.7676",
        "totalCirculation": "5876200",
        "totalTransactionFees": "4.18",
        "numberOfUniqueBitcoinAddressesUsed": "3078",
        "totalOutputVolumeValue": "145607.4084",
        "averageNumberOfTransactionsPerBlock": "18"
    },
    {
        "month": "4",
        "day": "10",
        "year": "2011",
        "price": "0.758899",
        "totalCirculation": "5884600",
        "totalTransactionFees": "5.14",
        "numberOfUniqueBitcoinAddressesUsed": "2843",
        "totalOutputVolumeValue": "103251.128",
        "averageNumberOfTransactionsPerBlock": "14"
    },
    {
        "month": "4",
        "day": "11",
        "year": "2011",
        "price": "0.781",
        "totalCirculation": "5892300",
        "totalTransactionFees": "4.72078885",
        "numberOfUniqueBitcoinAddressesUsed": "3040",
        "totalOutputVolumeValue": "85909.93001",
        "averageNumberOfTransactionsPerBlock": "11"
    },
    {
        "month": "4",
        "day": "12",
        "year": "2011",
        "price": "0.897",
        "totalCirculation": "5900650",
        "totalTransactionFees": "4.46474318",
        "numberOfUniqueBitcoinAddressesUsed": "3398",
        "totalOutputVolumeValue": "137646.1322",
        "averageNumberOfTransactionsPerBlock": "13"
    },
    {
        "month": "4",
        "day": "13",
        "year": "2011",
        "price": "1",
        "totalCirculation": "5910700",
        "totalTransactionFees": "3.67138575",
        "numberOfUniqueBitcoinAddressesUsed": "3759",
        "totalOutputVolumeValue": "191554.5099",
        "averageNumberOfTransactionsPerBlock": "17"
    },
    {
        "month": "4",
        "day": "14",
        "year": "2011",
        "price": "0.94",
        "totalCirculation": "5918850",
        "totalTransactionFees": "15.5231",
        "numberOfUniqueBitcoinAddressesUsed": "5390",
        "totalOutputVolumeValue": "126115.7119",
        "averageNumberOfTransactionsPerBlock": "25"
    },
    {
        "month": "4",
        "day": "15",
        "year": "2011",
        "price": "1.08999",
        "totalCirculation": "5925600",
        "totalTransactionFees": "2.15104348",
        "numberOfUniqueBitcoinAddressesUsed": "3050",
        "totalOutputVolumeValue": "141473.8377",
        "averageNumberOfTransactionsPerBlock": "22"
    },
    {
        "month": "4",
        "day": "16",
        "year": "2011",
        "price": "1.095",
        "totalCirculation": "5933950",
        "totalTransactionFees": "3.80988576",
        "numberOfUniqueBitcoinAddressesUsed": "3115",
        "totalOutputVolumeValue": "287525.9764",
        "averageNumberOfTransactionsPerBlock": "11"
    },
    {
        "month": "4",
        "day": "17",
        "year": "2011",
        "price": "1.085",
        "totalCirculation": "5942850",
        "totalTransactionFees": "1.9425",
        "numberOfUniqueBitcoinAddressesUsed": "3531",
        "totalOutputVolumeValue": "1376826.729",
        "averageNumberOfTransactionsPerBlock": "13"
    },
    {
        "month": "4",
        "day": "18",
        "year": "2011",
        "price": "1.1999",
        "totalCirculation": "5950650",
        "totalTransactionFees": "2.23520399",
        "numberOfUniqueBitcoinAddressesUsed": "3997",
        "totalOutputVolumeValue": "132199.6754",
        "averageNumberOfTransactionsPerBlock": "12"
    },
    {
        "month": "4",
        "day": "19",
        "year": "2011",
        "price": "1.19",
        "totalCirculation": "5957700",
        "totalTransactionFees": "5.88128213",
        "numberOfUniqueBitcoinAddressesUsed": "5118",
        "totalOutputVolumeValue": "2177926.085",
        "averageNumberOfTransactionsPerBlock": "15"
    },
    {
        "month": "4",
        "day": "20",
        "year": "2011",
        "price": "1.1979",
        "totalCirculation": "5964900",
        "totalTransactionFees": "7.35490728",
        "numberOfUniqueBitcoinAddressesUsed": "4676",
        "totalOutputVolumeValue": "5272339.948",
        "averageNumberOfTransactionsPerBlock": "13"
    },
    {
        "month": "4",
        "day": "21",
        "year": "2011",
        "price": "1.1979",
        "totalCirculation": "5973150",
        "totalTransactionFees": "3.63999931",
        "numberOfUniqueBitcoinAddressesUsed": "3310",
        "totalOutputVolumeValue": "136189.2748",
        "averageNumberOfTransactionsPerBlock": "14"
    },
    {
        "month": "4",
        "day": "22",
        "year": "2011",
        "price": "1.332",
        "totalCirculation": "5981800",
        "totalTransactionFees": "4.3937338",
        "numberOfUniqueBitcoinAddressesUsed": "3723",
        "totalOutputVolumeValue": "465318.8355",
        "averageNumberOfTransactionsPerBlock": "23"
    },
    {
        "month": "4",
        "day": "23",
        "year": "2011",
        "price": "1.549",
        "totalCirculation": "5990300",
        "totalTransactionFees": "5.3103",
        "numberOfUniqueBitcoinAddressesUsed": "3399",
        "totalOutputVolumeValue": "136771.929",
        "averageNumberOfTransactionsPerBlock": "22"
    },
    {
        "month": "4",
        "day": "24",
        "year": "2011",
        "price": "1.95",
        "totalCirculation": "5998200",
        "totalTransactionFees": "7.36302226",
        "numberOfUniqueBitcoinAddressesUsed": "4082",
        "totalOutputVolumeValue": "164011.8699",
        "averageNumberOfTransactionsPerBlock": "17"
    },
    {
        "month": "4",
        "day": "25",
        "year": "2011",
        "price": "1.701",
        "totalCirculation": "6007600",
        "totalTransactionFees": "7.87326592",
        "numberOfUniqueBitcoinAddressesUsed": "4110",
        "totalOutputVolumeValue": "103284.5935",
        "averageNumberOfTransactionsPerBlock": "21"
    },
    {
        "month": "4",
        "day": "26",
        "year": "2011",
        "price": "1.73",
        "totalCirculation": "6017250",
        "totalTransactionFees": "5.52887739",
        "numberOfUniqueBitcoinAddressesUsed": "4431",
        "totalOutputVolumeValue": "146695.9076",
        "averageNumberOfTransactionsPerBlock": "23"
    },
    {
        "month": "4",
        "day": "27",
        "year": "2011",
        "price": "1.95",
        "totalCirculation": "6026750",
        "totalTransactionFees": "8.94869711",
        "numberOfUniqueBitcoinAddressesUsed": "6329",
        "totalOutputVolumeValue": "206468.0069",
        "averageNumberOfTransactionsPerBlock": "14"
    },
    {
        "month": "4",
        "day": "28",
        "year": "2011",
        "price": "2.65",
        "totalCirculation": "6034700",
        "totalTransactionFees": "6.39308182",
        "numberOfUniqueBitcoinAddressesUsed": "5619",
        "totalOutputVolumeValue": "232588.9374",
        "averageNumberOfTransactionsPerBlock": "15"
    },
    {
        "month": "4",
        "day": "29",
        "year": "2011",
        "price": "2.7",
        "totalCirculation": "6044800",
        "totalTransactionFees": "7.01488483",
        "numberOfUniqueBitcoinAddressesUsed": "5505",
        "totalOutputVolumeValue": "771476.0749",
        "averageNumberOfTransactionsPerBlock": "15"
    },
    {
        "month": "4",
        "day": "30",
        "year": "2011",
        "price": "4.14996",
        "totalCirculation": "6054050",
        "totalTransactionFees": "9.56621478",
        "numberOfUniqueBitcoinAddressesUsed": "6324",
        "totalOutputVolumeValue": "400623.6525",
        "averageNumberOfTransactionsPerBlock": "14"
    },
    {
        "month": "5",
        "day": "1",
        "year": "2011",
        "price": "4.09",
        "totalCirculation": "6063850",
        "totalTransactionFees": "11.51184732",
        "numberOfUniqueBitcoinAddressesUsed": "7135",
        "totalOutputVolumeValue": "203700.3476",
        "averageNumberOfTransactionsPerBlock": "16"
    },
    {
        "month": "5",
        "day": "2",
        "year": "2011",
        "price": "3.495",
        "totalCirculation": "6072750",
        "totalTransactionFees": "6.64908916",
        "numberOfUniqueBitcoinAddressesUsed": "4268",
        "totalOutputVolumeValue": "131622.775",
        "averageNumberOfTransactionsPerBlock": "17"
    },
    {
        "month": "5",
        "day": "3",
        "year": "2011",
        "price": "3.49",
        "totalCirculation": "6083100",
        "totalTransactionFees": "4.72487624",
        "numberOfUniqueBitcoinAddressesUsed": "5240",
        "totalOutputVolumeValue": "180504.0648",
        "averageNumberOfTransactionsPerBlock": "13"
    },
    {
        "month": "5",
        "day": "4",
        "year": "2011",
        "price": "3.58",
        "totalCirculation": "6092400",
        "totalTransactionFees": "5.73991629",
        "numberOfUniqueBitcoinAddressesUsed": "5204",
        "totalOutputVolumeValue": "305517.5847",
        "averageNumberOfTransactionsPerBlock": "14"
    },
    {
        "month": "5",
        "day": "5",
        "year": "2011",
        "price": "3.5",
        "totalCirculation": "6103800",
        "totalTransactionFees": "7.74210231",
        "numberOfUniqueBitcoinAddressesUsed": "5773",
        "totalOutputVolumeValue": "159916.0922",
        "averageNumberOfTransactionsPerBlock": "15"
    },
    {
        "month": "5",
        "day": "6",
        "year": "2011",
        "price": "3.5998",
        "totalCirculation": "6113750",
        "totalTransactionFees": "9.48622833",
        "numberOfUniqueBitcoinAddressesUsed": "5690",
        "totalOutputVolumeValue": "224152.4762",
        "averageNumberOfTransactionsPerBlock": "17"
    },
    {
        "month": "5",
        "day": "7",
        "year": "2011",
        "price": "3.7",
        "totalCirculation": "6124700",
        "totalTransactionFees": "6.804853",
        "numberOfUniqueBitcoinAddressesUsed": "6110",
        "totalOutputVolumeValue": "299762.8943",
        "averageNumberOfTransactionsPerBlock": "16"
    },
    {
        "month": "5",
        "day": "8",
        "year": "2011",
        "price": "3.9",
        "totalCirculation": "6135000",
        "totalTransactionFees": "5.95522686",
        "numberOfUniqueBitcoinAddressesUsed": "4744",
        "totalOutputVolumeValue": "338722.1112",
        "averageNumberOfTransactionsPerBlock": "21"
    },
    {
        "month": "5",
        "day": "9",
        "year": "2011",
        "price": "3.937",
        "totalCirculation": "6147450",
        "totalTransactionFees": "11.69832794",
        "numberOfUniqueBitcoinAddressesUsed": "6323",
        "totalOutputVolumeValue": "380676.6328",
        "averageNumberOfTransactionsPerBlock": "17"
    },
    {
        "month": "5",
        "day": "10",
        "year": "2011",
        "price": "5.2",
        "totalCirculation": "6157450",
        "totalTransactionFees": "7.41932207",
        "numberOfUniqueBitcoinAddressesUsed": "5425",
        "totalOutputVolumeValue": "566091.4497",
        "averageNumberOfTransactionsPerBlock": "17"
    },
    {
        "month": "5",
        "day": "11",
        "year": "2011",
        "price": "6.065",
        "totalCirculation": "6166800",
        "totalTransactionFees": "9.66501217",
        "numberOfUniqueBitcoinAddressesUsed": "5921",
        "totalOutputVolumeValue": "185354.4992",
        "averageNumberOfTransactionsPerBlock": "18"
    },
    {
        "month": "5",
        "day": "12",
        "year": "2011",
        "price": "5.94998",
        "totalCirculation": "6175000",
        "totalTransactionFees": "5.60952486",
        "numberOfUniqueBitcoinAddressesUsed": "4914",
        "totalOutputVolumeValue": "212128.2623",
        "averageNumberOfTransactionsPerBlock": "16"
    },
    {
        "month": "5",
        "day": "13",
        "year": "2011",
        "price": "8.45",
        "totalCirculation": "6185050",
        "totalTransactionFees": "11.3227713",
        "numberOfUniqueBitcoinAddressesUsed": "7624",
        "totalOutputVolumeValue": "467029.4386",
        "averageNumberOfTransactionsPerBlock": "17"
    },
    {
        "month": "5",
        "day": "14",
        "year": "2011",
        "price": "8.9",
        "totalCirculation": "6197450",
        "totalTransactionFees": "13.88461025",
        "numberOfUniqueBitcoinAddressesUsed": "7463",
        "totalOutputVolumeValue": "1691796.399",
        "averageNumberOfTransactionsPerBlock": "28"
    },
    {
        "month": "5",
        "day": "15",
        "year": "2011",
        "price": "8.55",
        "totalCirculation": "6208850",
        "totalTransactionFees": "14.44747033",
        "numberOfUniqueBitcoinAddressesUsed": "7124",
        "totalOutputVolumeValue": "442071.4298",
        "averageNumberOfTransactionsPerBlock": "21"
    },
    {
        "month": "5",
        "day": "16",
        "year": "2011",
        "price": "8.5",
        "totalCirculation": "6220050",
        "totalTransactionFees": "15.61282785",
        "numberOfUniqueBitcoinAddressesUsed": "9243",
        "totalOutputVolumeValue": "207534.7543",
        "averageNumberOfTransactionsPerBlock": "22"
    },
    {
        "month": "5",
        "day": "17",
        "year": "2011",
        "price": "8.38901",
        "totalCirculation": "6233050",
        "totalTransactionFees": "13.29486724",
        "numberOfUniqueBitcoinAddressesUsed": "9093",
        "totalOutputVolumeValue": "297603.6826",
        "averageNumberOfTransactionsPerBlock": "21"
    },
    {
        "month": "5",
        "day": "18",
        "year": "2011",
        "price": "7.874",
        "totalCirculation": "6247200",
        "totalTransactionFees": "16.69735463",
        "numberOfUniqueBitcoinAddressesUsed": "9918",
        "totalOutputVolumeValue": "187535.9074",
        "averageNumberOfTransactionsPerBlock": "20"
    },
    {
        "month": "5",
        "day": "19",
        "year": "2011",
        "price": "7.34",
        "totalCirculation": "6256250",
        "totalTransactionFees": "18.61140679",
        "numberOfUniqueBitcoinAddressesUsed": "11265",
        "totalOutputVolumeValue": "166850.2113",
        "averageNumberOfTransactionsPerBlock": "18"
    },
    {
        "month": "5",
        "day": "20",
        "year": "2011",
        "price": "7.1",
        "totalCirculation": "6267450",
        "totalTransactionFees": "16.95989301",
        "numberOfUniqueBitcoinAddressesUsed": "9419",
        "totalOutputVolumeValue": "319316.9883",
        "averageNumberOfTransactionsPerBlock": "21"
    },
    {
        "month": "5",
        "day": "21",
        "year": "2011",
        "price": "6.6036",
        "totalCirculation": "6278100",
        "totalTransactionFees": "19.00720349",
        "numberOfUniqueBitcoinAddressesUsed": "9193",
        "totalOutputVolumeValue": "694878.5464",
        "averageNumberOfTransactionsPerBlock": "21"
    },
    {
        "month": "5",
        "day": "22",
        "year": "2011",
        "price": "6.61",
        "totalCirculation": "6290800",
        "totalTransactionFees": "21.16861654",
        "numberOfUniqueBitcoinAddressesUsed": "9823",
        "totalOutputVolumeValue": "902283.6392",
        "averageNumberOfTransactionsPerBlock": "27"
    },
    {
        "month": "5",
        "day": "23",
        "year": "2011",
        "price": "7.45",
        "totalCirculation": "6304650",
        "totalTransactionFees": "19.12275662",
        "numberOfUniqueBitcoinAddressesUsed": "10157",
        "totalOutputVolumeValue": "462051.8358",
        "averageNumberOfTransactionsPerBlock": "32"
    },
    {
        "month": "5",
        "day": "24",
        "year": "2011",
        "price": "7.2",
        "totalCirculation": "6319400",
        "totalTransactionFees": "19.09579145",
        "numberOfUniqueBitcoinAddressesUsed": "10691",
        "totalOutputVolumeValue": "332288.1552",
        "averageNumberOfTransactionsPerBlock": "27"
    },
    {
        "month": "5",
        "day": "25",
        "year": "2011",
        "price": "7.51",
        "totalCirculation": "6334000",
        "totalTransactionFees": "21.39997947",
        "numberOfUniqueBitcoinAddressesUsed": "12928",
        "totalOutputVolumeValue": "407506.8258",
        "averageNumberOfTransactionsPerBlock": "31"
    },
    {
        "month": "5",
        "day": "26",
        "year": "2011",
        "price": "9.33",
        "totalCirculation": "6349900",
        "totalTransactionFees": "20.2567875",
        "numberOfUniqueBitcoinAddressesUsed": "12180",
        "totalOutputVolumeValue": "434392.7825",
        "averageNumberOfTransactionsPerBlock": "41"
    },
    {
        "month": "5",
        "day": "27",
        "year": "2011",
        "price": "8.92",
        "totalCirculation": "6359800",
        "totalTransactionFees": "16.43284651",
        "numberOfUniqueBitcoinAddressesUsed": "9863",
        "totalOutputVolumeValue": "596236.9876",
        "averageNumberOfTransactionsPerBlock": "34"
    },
    {
        "month": "5",
        "day": "28",
        "year": "2011",
        "price": "8.735",
        "totalCirculation": "6367550",
        "totalTransactionFees": "13.1819608",
        "numberOfUniqueBitcoinAddressesUsed": "9834",
        "totalOutputVolumeValue": "235608.5891",
        "averageNumberOfTransactionsPerBlock": "37"
    },
    {
        "month": "5",
        "day": "29",
        "year": "2011",
        "price": "8.4992",
        "totalCirculation": "6376200",
        "totalTransactionFees": "14.43394585",
        "numberOfUniqueBitcoinAddressesUsed": "9270",
        "totalOutputVolumeValue": "262939.8117",
        "averageNumberOfTransactionsPerBlock": "41"
    },
    {
        "month": "5",
        "day": "30",
        "year": "2011",
        "price": "9",
        "totalCirculation": "6383850",
        "totalTransactionFees": "15.95794968",
        "numberOfUniqueBitcoinAddressesUsed": "10010",
        "totalOutputVolumeValue": "262665.656",
        "averageNumberOfTransactionsPerBlock": "40"
    },
    {
        "month": "5",
        "day": "31",
        "year": "2011",
        "price": "9.4998",
        "totalCirculation": "6391350",
        "totalTransactionFees": "20.95768475",
        "numberOfUniqueBitcoinAddressesUsed": "12252",
        "totalOutputVolumeValue": "295010.675",
        "averageNumberOfTransactionsPerBlock": "39"
    },
    {
        "month": "6",
        "day": "1",
        "year": "2011",
        "price": "9.391",
        "totalCirculation": "6400250",
        "totalTransactionFees": "21.6219555",
        "numberOfUniqueBitcoinAddressesUsed": "11219",
        "totalOutputVolumeValue": "259862.3112",
        "averageNumberOfTransactionsPerBlock": "39"
    },
    {
        "month": "6",
        "day": "2",
        "year": "2011",
        "price": "10.57",
        "totalCirculation": "6409750",
        "totalTransactionFees": "25.08212749",
        "numberOfUniqueBitcoinAddressesUsed": "12768",
        "totalOutputVolumeValue": "330587.2806",
        "averageNumberOfTransactionsPerBlock": "51"
    },
    {
        "month": "6",
        "day": "3",
        "year": "2011",
        "price": "14.3",
        "totalCirculation": "6419900",
        "totalTransactionFees": "26.6377786",
        "numberOfUniqueBitcoinAddressesUsed": "14800",
        "totalOutputVolumeValue": "600652.1836",
        "averageNumberOfTransactionsPerBlock": "62"
    },
    {
        "month": "6",
        "day": "4",
        "year": "2011",
        "price": "17.41",
        "totalCirculation": "6430700",
        "totalTransactionFees": "31.68367067",
        "numberOfUniqueBitcoinAddressesUsed": "16750",
        "totalOutputVolumeValue": "514581.6812",
        "averageNumberOfTransactionsPerBlock": "57"
    },
    {
        "month": "6",
        "day": "5",
        "year": "2011",
        "price": "18.998",
        "totalCirculation": "6441100",
        "totalTransactionFees": "23.52063186",
        "numberOfUniqueBitcoinAddressesUsed": "14944",
        "totalOutputVolumeValue": "486337.0509",
        "averageNumberOfTransactionsPerBlock": "49"
    },
    {
        "month": "6",
        "day": "6",
        "year": "2011",
        "price": "19.23",
        "totalCirculation": "6453600",
        "totalTransactionFees": "26.458909",
        "numberOfUniqueBitcoinAddressesUsed": "17688",
        "totalOutputVolumeValue": "834087.583",
        "averageNumberOfTransactionsPerBlock": "48"
    },
    {
        "month": "6",
        "day": "7",
        "year": "2011",
        "price": "19.06",
        "totalCirculation": "6462050",
        "totalTransactionFees": "28.53132133",
        "numberOfUniqueBitcoinAddressesUsed": "15812",
        "totalOutputVolumeValue": "570308.8952",
        "averageNumberOfTransactionsPerBlock": "49"
    },
    {
        "month": "6",
        "day": "8",
        "year": "2011",
        "price": "31.9099",
        "totalCirculation": "6471200",
        "totalTransactionFees": "39.21740563",
        "numberOfUniqueBitcoinAddressesUsed": "20730",
        "totalOutputVolumeValue": "682341.0445",
        "averageNumberOfTransactionsPerBlock": "49"
    },
    {
        "month": "6",
        "day": "9",
        "year": "2011",
        "price": "31.5",
        "totalCirculation": "6481800",
        "totalTransactionFees": "48.4001229",
        "numberOfUniqueBitcoinAddressesUsed": "22272",
        "totalOutputVolumeValue": "791144.4658",
        "averageNumberOfTransactionsPerBlock": "56"
    },
    {
        "month": "6",
        "day": "10",
        "year": "2011",
        "price": "35",
        "totalCirculation": "6493100",
        "totalTransactionFees": "37.85372624",
        "numberOfUniqueBitcoinAddressesUsed": "21061",
        "totalOutputVolumeValue": "865325.4428",
        "averageNumberOfTransactionsPerBlock": "50"
    },
    {
        "month": "6",
        "day": "11",
        "year": "2011",
        "price": "30",
        "totalCirculation": "6504700",
        "totalTransactionFees": "36.72083742",
        "numberOfUniqueBitcoinAddressesUsed": "20896",
        "totalOutputVolumeValue": "1390639.189",
        "averageNumberOfTransactionsPerBlock": "58"
    },
    {
        "month": "6",
        "day": "12",
        "year": "2011",
        "price": "24.99",
        "totalCirculation": "6516600",
        "totalTransactionFees": "41.15152999",
        "numberOfUniqueBitcoinAddressesUsed": "21909",
        "totalOutputVolumeValue": "1875945.146",
        "averageNumberOfTransactionsPerBlock": "64"
    },
    {
        "month": "6",
        "day": "13",
        "year": "2011",
        "price": "24.5",
        "totalCirculation": "6528850",
        "totalTransactionFees": "40.65158133",
        "numberOfUniqueBitcoinAddressesUsed": "22918",
        "totalOutputVolumeValue": "1307769.209",
        "averageNumberOfTransactionsPerBlock": "59"
    },
    {
        "month": "6",
        "day": "14",
        "year": "2011",
        "price": "20.99",
        "totalCirculation": "6540100",
        "totalTransactionFees": "33.47003135",
        "numberOfUniqueBitcoinAddressesUsed": "23877",
        "totalOutputVolumeValue": "1555268.183",
        "averageNumberOfTransactionsPerBlock": "52"
    },
    {
        "month": "6",
        "day": "15",
        "year": "2011",
        "price": "20",
        "totalCirculation": "6554200",
        "totalTransactionFees": "42.43918865",
        "numberOfUniqueBitcoinAddressesUsed": "26175",
        "totalOutputVolumeValue": "2041254.366",
        "averageNumberOfTransactionsPerBlock": "48"
    },
    {
        "month": "6",
        "day": "16",
        "year": "2011",
        "price": "19.96",
        "totalCirculation": "6564250",
        "totalTransactionFees": "31.72265722",
        "numberOfUniqueBitcoinAddressesUsed": "22537",
        "totalOutputVolumeValue": "9235676.426",
        "averageNumberOfTransactionsPerBlock": "39"
    },
    {
        "month": "6",
        "day": "17",
        "year": "2011",
        "price": "19.3898",
        "totalCirculation": "6573250",
        "totalTransactionFees": "30.76697918",
        "numberOfUniqueBitcoinAddressesUsed": "22736",
        "totalOutputVolumeValue": "2938717.202",
        "averageNumberOfTransactionsPerBlock": "43"
    },
    {
        "month": "6",
        "day": "18",
        "year": "2011",
        "price": "17.2",
        "totalCirculation": "6583350",
        "totalTransactionFees": "30.27588907",
        "numberOfUniqueBitcoinAddressesUsed": "23543",
        "totalOutputVolumeValue": "1375764.237",
        "averageNumberOfTransactionsPerBlock": "44"
    },
    {
        "month": "6",
        "day": "19",
        "year": "2011",
        "price": "18.8766",
        "totalCirculation": "6594300",
        "totalTransactionFees": "26.78637934",
        "numberOfUniqueBitcoinAddressesUsed": "23804",
        "totalOutputVolumeValue": "1301575.104",
        "averageNumberOfTransactionsPerBlock": "46"
    },
    {
        "month": "6",
        "day": "20",
        "year": "2011",
        "price": "17.35",
        "totalCirculation": "6605900",
        "totalTransactionFees": "21.06156276",
        "numberOfUniqueBitcoinAddressesUsed": "23113",
        "totalOutputVolumeValue": "5015069.734",
        "averageNumberOfTransactionsPerBlock": "63"
    },
    {
        "month": "6",
        "day": "21",
        "year": "2011",
        "price": "15.5",
        "totalCirculation": "6617450",
        "totalTransactionFees": "18.24724796",
        "numberOfUniqueBitcoinAddressesUsed": "19981",
        "totalOutputVolumeValue": "1307009.068",
        "averageNumberOfTransactionsPerBlock": "66"
    },
    {
        "month": "6",
        "day": "22",
        "year": "2011",
        "price": "15.05",
        "totalCirculation": "6630950",
        "totalTransactionFees": "17.88992398",
        "numberOfUniqueBitcoinAddressesUsed": "24881",
        "totalOutputVolumeValue": "3232503.743",
        "averageNumberOfTransactionsPerBlock": "71"
    },
    {
        "month": "6",
        "day": "23",
        "year": "2011",
        "price": "16",
        "totalCirculation": "6642850",
        "totalTransactionFees": "16.04724236",
        "numberOfUniqueBitcoinAddressesUsed": "22014",
        "totalOutputVolumeValue": "1682473.312",
        "averageNumberOfTransactionsPerBlock": "71"
    },
    {
        "month": "6",
        "day": "24",
        "year": "2011",
        "price": "16.7501",
        "totalCirculation": "6654850",
        "totalTransactionFees": "15.10772997",
        "numberOfUniqueBitcoinAddressesUsed": "22763",
        "totalOutputVolumeValue": "4528661.415",
        "averageNumberOfTransactionsPerBlock": "57"
    },
    {
        "month": "6",
        "day": "25",
        "year": "2011",
        "price": "17.6",
        "totalCirculation": "6662400",
        "totalTransactionFees": "21.99481921",
        "numberOfUniqueBitcoinAddressesUsed": "19107",
        "totalOutputVolumeValue": "6997337.31",
        "averageNumberOfTransactionsPerBlock": "54"
    },
    {
        "month": "6",
        "day": "26",
        "year": "2011",
        "price": "17.51001",
        "totalCirculation": "6670150",
        "totalTransactionFees": "22.58593178",
        "numberOfUniqueBitcoinAddressesUsed": "20531",
        "totalOutputVolumeValue": "6549819.135",
        "averageNumberOfTransactionsPerBlock": "52"
    },
    {
        "month": "6",
        "day": "27",
        "year": "2011",
        "price": "18",
        "totalCirculation": "6678150",
        "totalTransactionFees": "28.5009098",
        "numberOfUniqueBitcoinAddressesUsed": "24689",
        "totalOutputVolumeValue": "2876425.88",
        "averageNumberOfTransactionsPerBlock": "54"
    },
    {
        "month": "6",
        "day": "28",
        "year": "2011",
        "price": "17.52",
        "totalCirculation": "6685800",
        "totalTransactionFees": "21.04399723",
        "numberOfUniqueBitcoinAddressesUsed": "22877",
        "totalOutputVolumeValue": "4785676.894",
        "averageNumberOfTransactionsPerBlock": "49"
    },
    {
        "month": "6",
        "day": "29",
        "year": "2011",
        "price": "17.3",
        "totalCirculation": "6694650",
        "totalTransactionFees": "20.27653059",
        "numberOfUniqueBitcoinAddressesUsed": "21640",
        "totalOutputVolumeValue": "5122234.927",
        "averageNumberOfTransactionsPerBlock": "57"
    },
    {
        "month": "6",
        "day": "30",
        "year": "2011",
        "price": "17.5",
        "totalCirculation": "6703700",
        "totalTransactionFees": "18.31708499",
        "numberOfUniqueBitcoinAddressesUsed": "20088",
        "totalOutputVolumeValue": "1678315.564",
        "averageNumberOfTransactionsPerBlock": "56"
    },
    {
        "month": "7",
        "day": "1",
        "year": "2011",
        "price": "17",
        "totalCirculation": "6712700",
        "totalTransactionFees": "16.95778436",
        "numberOfUniqueBitcoinAddressesUsed": "25731",
        "totalOutputVolumeValue": "1261003.584",
        "averageNumberOfTransactionsPerBlock": "70"
    },
    {
        "month": "7",
        "day": "2",
        "year": "2011",
        "price": "16.49",
        "totalCirculation": "6721450",
        "totalTransactionFees": "17.63908177",
        "numberOfUniqueBitcoinAddressesUsed": "31999",
        "totalOutputVolumeValue": "927541.1445",
        "averageNumberOfTransactionsPerBlock": "69"
    },
    {
        "month": "7",
        "day": "3",
        "year": "2011",
        "price": "15.7",
        "totalCirculation": "6729450",
        "totalTransactionFees": "12.95560401",
        "numberOfUniqueBitcoinAddressesUsed": "19140",
        "totalOutputVolumeValue": "475146.2804",
        "averageNumberOfTransactionsPerBlock": "55"
    },
    {
        "month": "7",
        "day": "4",
        "year": "2011",
        "price": "15.85",
        "totalCirculation": "6737650",
        "totalTransactionFees": "15.26228889",
        "numberOfUniqueBitcoinAddressesUsed": "20364",
        "totalOutputVolumeValue": "1503044.186",
        "averageNumberOfTransactionsPerBlock": "53"
    },
    {
        "month": "7",
        "day": "5",
        "year": "2011",
        "price": "15",
        "totalCirculation": "6745200",
        "totalTransactionFees": "17.1050446",
        "numberOfUniqueBitcoinAddressesUsed": "17861",
        "totalOutputVolumeValue": "339654.7158",
        "averageNumberOfTransactionsPerBlock": "55"
    },
    {
        "month": "7",
        "day": "6",
        "year": "2011",
        "price": "16.5",
        "totalCirculation": "6753000",
        "totalTransactionFees": "18.73264167",
        "numberOfUniqueBitcoinAddressesUsed": "23786",
        "totalOutputVolumeValue": "641728.8139",
        "averageNumberOfTransactionsPerBlock": "66"
    },
    {
        "month": "7",
        "day": "7",
        "year": "2011",
        "price": "16.25",
        "totalCirculation": "6759800",
        "totalTransactionFees": "14.78154774",
        "numberOfUniqueBitcoinAddressesUsed": "20579",
        "totalOutputVolumeValue": "471109.2657",
        "averageNumberOfTransactionsPerBlock": "61"
    },
    {
        "month": "7",
        "day": "8",
        "year": "2011",
        "price": "15.64276",
        "totalCirculation": "6767150",
        "totalTransactionFees": "13.00884717",
        "numberOfUniqueBitcoinAddressesUsed": "19803",
        "totalOutputVolumeValue": "351140.0581",
        "averageNumberOfTransactionsPerBlock": "52"
    },
    {
        "month": "7",
        "day": "9",
        "year": "2011",
        "price": "15",
        "totalCirculation": "6775050",
        "totalTransactionFees": "13.50615094",
        "numberOfUniqueBitcoinAddressesUsed": "20921",
        "totalOutputVolumeValue": "1209556.871",
        "averageNumberOfTransactionsPerBlock": "54"
    },
    {
        "month": "7",
        "day": "10",
        "year": "2011",
        "price": "15.68",
        "totalCirculation": "6782250",
        "totalTransactionFees": "12.79683879",
        "numberOfUniqueBitcoinAddressesUsed": "25941",
        "totalOutputVolumeValue": "3308051.513",
        "averageNumberOfTransactionsPerBlock": "53"
    },
    {
        "month": "7",
        "day": "11",
        "year": "2011",
        "price": "15.1999",
        "totalCirculation": "6789700",
        "totalTransactionFees": "13.77107564",
        "numberOfUniqueBitcoinAddressesUsed": "20304",
        "totalOutputVolumeValue": "1007736.374",
        "averageNumberOfTransactionsPerBlock": "49"
    },
    {
        "month": "7",
        "day": "12",
        "year": "2011",
        "price": "14.63988",
        "totalCirculation": "6796900",
        "totalTransactionFees": "12.17776867",
        "numberOfUniqueBitcoinAddressesUsed": "20971",
        "totalOutputVolumeValue": "693214.9793",
        "averageNumberOfTransactionsPerBlock": "53"
    },
    {
        "month": "7",
        "day": "13",
        "year": "2011",
        "price": "14.15",
        "totalCirculation": "6806050",
        "totalTransactionFees": "15.64254982",
        "numberOfUniqueBitcoinAddressesUsed": "24854",
        "totalOutputVolumeValue": "1210875.08",
        "averageNumberOfTransactionsPerBlock": "53"
    },
    {
        "month": "7",
        "day": "14",
        "year": "2011",
        "price": "14.1",
        "totalCirculation": "6813750",
        "totalTransactionFees": "14.32494418",
        "numberOfUniqueBitcoinAddressesUsed": "25498",
        "totalOutputVolumeValue": "1118040.127",
        "averageNumberOfTransactionsPerBlock": "60"
    },
    {
        "month": "7",
        "day": "15",
        "year": "2011",
        "price": "14.3",
        "totalCirculation": "6821800",
        "totalTransactionFees": "13.93294757",
        "numberOfUniqueBitcoinAddressesUsed": "21025",
        "totalOutputVolumeValue": "2069623.204",
        "averageNumberOfTransactionsPerBlock": "59"
    },
    {
        "month": "7",
        "day": "16",
        "year": "2011",
        "price": "14.1",
        "totalCirculation": "6829750",
        "totalTransactionFees": "13.44019776",
        "numberOfUniqueBitcoinAddressesUsed": "21029",
        "totalOutputVolumeValue": "462605.0695",
        "averageNumberOfTransactionsPerBlock": "55"
    },
    {
        "month": "7",
        "day": "17",
        "year": "2011",
        "price": "13.96",
        "totalCirculation": "6838200",
        "totalTransactionFees": "12.45441972",
        "numberOfUniqueBitcoinAddressesUsed": "22354",
        "totalOutputVolumeValue": "1043977.128",
        "averageNumberOfTransactionsPerBlock": "59"
    },
    {
        "month": "7",
        "day": "18",
        "year": "2011",
        "price": "13.6901",
        "totalCirculation": "6845850",
        "totalTransactionFees": "10.45340351",
        "numberOfUniqueBitcoinAddressesUsed": "19515",
        "totalOutputVolumeValue": "1191448.452",
        "averageNumberOfTransactionsPerBlock": "55"
    },
    {
        "month": "7",
        "day": "19",
        "year": "2011",
        "price": "14.7",
        "totalCirculation": "6854050",
        "totalTransactionFees": "17.08671088",
        "numberOfUniqueBitcoinAddressesUsed": "23514",
        "totalOutputVolumeValue": "3298360.477",
        "averageNumberOfTransactionsPerBlock": "44"
    },
    {
        "month": "7",
        "day": "20",
        "year": "2011",
        "price": "14.04",
        "totalCirculation": "6861200",
        "totalTransactionFees": "11.50496853",
        "numberOfUniqueBitcoinAddressesUsed": "21109",
        "totalOutputVolumeValue": "2284316.438",
        "averageNumberOfTransactionsPerBlock": "60"
    },
    {
        "month": "7",
        "day": "21",
        "year": "2011",
        "price": "13.9389",
        "totalCirculation": "6868950",
        "totalTransactionFees": "9.3605919",
        "numberOfUniqueBitcoinAddressesUsed": "22713",
        "totalOutputVolumeValue": "1472833.918",
        "averageNumberOfTransactionsPerBlock": "49"
    },
    {
        "month": "7",
        "day": "22",
        "year": "2011",
        "price": "13.9389",
        "totalCirculation": "6876100",
        "totalTransactionFees": "11.77873472",
        "numberOfUniqueBitcoinAddressesUsed": "21044",
        "totalOutputVolumeValue": "717267.6593",
        "averageNumberOfTransactionsPerBlock": "46"
    },
    {
        "month": "7",
        "day": "23",
        "year": "2011",
        "price": "13.92",
        "totalCirculation": "6883350",
        "totalTransactionFees": "9.81383186",
        "numberOfUniqueBitcoinAddressesUsed": "19698",
        "totalOutputVolumeValue": "1131999.892",
        "averageNumberOfTransactionsPerBlock": "46"
    },
    {
        "month": "7",
        "day": "24",
        "year": "2011",
        "price": "13.979999",
        "totalCirculation": "6892150",
        "totalTransactionFees": "7.9042719",
        "numberOfUniqueBitcoinAddressesUsed": "20708",
        "totalOutputVolumeValue": "640016.2198",
        "averageNumberOfTransactionsPerBlock": "46"
    },
    {
        "month": "7",
        "day": "25",
        "year": "2011",
        "price": "14.7399",
        "totalCirculation": "6900000",
        "totalTransactionFees": "13.19779016",
        "numberOfUniqueBitcoinAddressesUsed": "22766",
        "totalOutputVolumeValue": "1478082.668",
        "averageNumberOfTransactionsPerBlock": "45"
    },
    {
        "month": "7",
        "day": "26",
        "year": "2011",
        "price": "14.4",
        "totalCirculation": "6908450",
        "totalTransactionFees": "8.61433947",
        "numberOfUniqueBitcoinAddressesUsed": "21078",
        "totalOutputVolumeValue": "1233720.075",
        "averageNumberOfTransactionsPerBlock": "44"
    },
    {
        "month": "7",
        "day": "27",
        "year": "2011",
        "price": "14.13",
        "totalCirculation": "6917450",
        "totalTransactionFees": "9.17862736",
        "numberOfUniqueBitcoinAddressesUsed": "20882",
        "totalOutputVolumeValue": "1008445.949",
        "averageNumberOfTransactionsPerBlock": "45"
    },
    {
        "month": "7",
        "day": "28",
        "year": "2011",
        "price": "14",
        "totalCirculation": "6925800",
        "totalTransactionFees": "7.45699769",
        "numberOfUniqueBitcoinAddressesUsed": "22225",
        "totalOutputVolumeValue": "2869315.945",
        "averageNumberOfTransactionsPerBlock": "59"
    },
    {
        "month": "7",
        "day": "29",
        "year": "2011",
        "price": "13.8",
        "totalCirculation": "6933850",
        "totalTransactionFees": "6.6564493",
        "numberOfUniqueBitcoinAddressesUsed": "20440",
        "totalOutputVolumeValue": "1609180.881",
        "averageNumberOfTransactionsPerBlock": "50"
    },
    {
        "month": "7",
        "day": "30",
        "year": "2011",
        "price": "13.8",
        "totalCirculation": "6941450",
        "totalTransactionFees": "6.60580997",
        "numberOfUniqueBitcoinAddressesUsed": "18672",
        "totalOutputVolumeValue": "374677.1434",
        "averageNumberOfTransactionsPerBlock": "62"
    },
    {
        "month": "7",
        "day": "31",
        "year": "2011",
        "price": "14.8999",
        "totalCirculation": "6949850",
        "totalTransactionFees": "6.12797681",
        "numberOfUniqueBitcoinAddressesUsed": "20480",
        "totalOutputVolumeValue": "585272.8997",
        "averageNumberOfTransactionsPerBlock": "52"
    },
    {
        "month": "8",
        "day": "1",
        "year": "2011",
        "price": "13.5501",
        "totalCirculation": "6958600",
        "totalTransactionFees": "7.45372377",
        "numberOfUniqueBitcoinAddressesUsed": "21414",
        "totalOutputVolumeValue": "398551.8854",
        "averageNumberOfTransactionsPerBlock": "57"
    },
    {
        "month": "8",
        "day": "2",
        "year": "2011",
        "price": "13.45",
        "totalCirculation": "6965950",
        "totalTransactionFees": "7.8853759",
        "numberOfUniqueBitcoinAddressesUsed": "19473",
        "totalOutputVolumeValue": "541433.9509",
        "averageNumberOfTransactionsPerBlock": "52"
    },
    {
        "month": "8",
        "day": "3",
        "year": "2011",
        "price": "13.1",
        "totalCirculation": "6973900",
        "totalTransactionFees": "7.49064465",
        "numberOfUniqueBitcoinAddressesUsed": "15703",
        "totalOutputVolumeValue": "423218.6332",
        "averageNumberOfTransactionsPerBlock": "55"
    },
    {
        "month": "8",
        "day": "4",
        "year": "2011",
        "price": "11.4876543",
        "totalCirculation": "6980550",
        "totalTransactionFees": "8.65111491",
        "numberOfUniqueBitcoinAddressesUsed": "15681",
        "totalOutputVolumeValue": "346382.1282",
        "averageNumberOfTransactionsPerBlock": "64"
    },
    {
        "month": "8",
        "day": "5",
        "year": "2011",
        "price": "11.55",
        "totalCirculation": "6987450",
        "totalTransactionFees": "6.39034612",
        "numberOfUniqueBitcoinAddressesUsed": "18013",
        "totalOutputVolumeValue": "443829.868",
        "averageNumberOfTransactionsPerBlock": "50"
    },
    {
        "month": "8",
        "day": "6",
        "year": "2011",
        "price": "11",
        "totalCirculation": "6993650",
        "totalTransactionFees": "7.4397722",
        "numberOfUniqueBitcoinAddressesUsed": "18171",
        "totalOutputVolumeValue": "393965.5977",
        "averageNumberOfTransactionsPerBlock": "60"
    },
    {
        "month": "8",
        "day": "7",
        "year": "2011",
        "price": "9.8",
        "totalCirculation": "7000100",
        "totalTransactionFees": "22.92516799",
        "numberOfUniqueBitcoinAddressesUsed": "17200",
        "totalOutputVolumeValue": "383287.1724",
        "averageNumberOfTransactionsPerBlock": "51"
    },
    {
        "month": "8",
        "day": "8",
        "year": "2011",
        "price": "8.89",
        "totalCirculation": "7006550",
        "totalTransactionFees": "8.01767941",
        "numberOfUniqueBitcoinAddressesUsed": "18130",
        "totalOutputVolumeValue": "775351.5911",
        "averageNumberOfTransactionsPerBlock": "57"
    },
    {
        "month": "8",
        "day": "9",
        "year": "2011",
        "price": "12.1",
        "totalCirculation": "7013200",
        "totalTransactionFees": "11.0804063",
        "numberOfUniqueBitcoinAddressesUsed": "20864",
        "totalOutputVolumeValue": "2787550.074",
        "averageNumberOfTransactionsPerBlock": "61"
    },
    {
        "month": "8",
        "day": "10",
        "year": "2011",
        "price": "10.7",
        "totalCirculation": "7021500",
        "totalTransactionFees": "9.43100171",
        "numberOfUniqueBitcoinAddressesUsed": "16769",
        "totalOutputVolumeValue": "952897.3183",
        "averageNumberOfTransactionsPerBlock": "58"
    },
    {
        "month": "8",
        "day": "11",
        "year": "2011",
        "price": "10.4959",
        "totalCirculation": "7028250",
        "totalTransactionFees": "8.96972833",
        "numberOfUniqueBitcoinAddressesUsed": "16032",
        "totalOutputVolumeValue": "686891.8849",
        "averageNumberOfTransactionsPerBlock": "68"
    },
    {
        "month": "8",
        "day": "12",
        "year": "2011",
        "price": "9.89520343",
        "totalCirculation": "7035100",
        "totalTransactionFees": "6.31242296",
        "numberOfUniqueBitcoinAddressesUsed": "14031",
        "totalOutputVolumeValue": "350528.3094",
        "averageNumberOfTransactionsPerBlock": "63"
    },
    {
        "month": "8",
        "day": "13",
        "year": "2011",
        "price": "10.05",
        "totalCirculation": "7041500",
        "totalTransactionFees": "6.7979716",
        "numberOfUniqueBitcoinAddressesUsed": "15861",
        "totalOutputVolumeValue": "326912.9335",
        "averageNumberOfTransactionsPerBlock": "47"
    },
    {
        "month": "8",
        "day": "14",
        "year": "2011",
        "price": "11.24",
        "totalCirculation": "7047650",
        "totalTransactionFees": "9.77820713",
        "numberOfUniqueBitcoinAddressesUsed": "19243",
        "totalOutputVolumeValue": "431809.4176",
        "averageNumberOfTransactionsPerBlock": "57"
    },
    {
        "month": "8",
        "day": "15",
        "year": "2011",
        "price": "11.89",
        "totalCirculation": "7054800",
        "totalTransactionFees": "9.26323877",
        "numberOfUniqueBitcoinAddressesUsed": "16500",
        "totalOutputVolumeValue": "348419.1962",
        "averageNumberOfTransactionsPerBlock": "49"
    },
    {
        "month": "8",
        "day": "16",
        "year": "2011",
        "price": "11.38",
        "totalCirculation": "7061550",
        "totalTransactionFees": "9.5779113",
        "numberOfUniqueBitcoinAddressesUsed": "16666",
        "totalOutputVolumeValue": "337473.2592",
        "averageNumberOfTransactionsPerBlock": "50"
    },
    {
        "month": "8",
        "day": "17",
        "year": "2011",
        "price": "11.3",
        "totalCirculation": "7068000",
        "totalTransactionFees": "7.99886482",
        "numberOfUniqueBitcoinAddressesUsed": "16997",
        "totalOutputVolumeValue": "339782.9772",
        "averageNumberOfTransactionsPerBlock": "45"
    },
    {
        "month": "8",
        "day": "18",
        "year": "2011",
        "price": "11.67",
        "totalCirculation": "7075900",
        "totalTransactionFees": "6.1145595",
        "numberOfUniqueBitcoinAddressesUsed": "18383",
        "totalOutputVolumeValue": "429956.3696",
        "averageNumberOfTransactionsPerBlock": "43"
    },
    {
        "month": "8",
        "day": "19",
        "year": "2011",
        "price": "11.81",
        "totalCirculation": "7082650",
        "totalTransactionFees": "7.41319369",
        "numberOfUniqueBitcoinAddressesUsed": "20161",
        "totalOutputVolumeValue": "564623.0561",
        "averageNumberOfTransactionsPerBlock": "55"
    },
    {
        "month": "8",
        "day": "20",
        "year": "2011",
        "price": "11.798",
        "totalCirculation": "7089900",
        "totalTransactionFees": "6.10397746",
        "numberOfUniqueBitcoinAddressesUsed": "19019",
        "totalOutputVolumeValue": "245694.3859",
        "averageNumberOfTransactionsPerBlock": "55"
    },
    {
        "month": "8",
        "day": "21",
        "year": "2011",
        "price": "11.59",
        "totalCirculation": "7097150",
        "totalTransactionFees": "5.57001909",
        "numberOfUniqueBitcoinAddressesUsed": "18708",
        "totalOutputVolumeValue": "237932.12",
        "averageNumberOfTransactionsPerBlock": "48"
    },
    {
        "month": "8",
        "day": "22",
        "year": "2011",
        "price": "11.501",
        "totalCirculation": "7105950",
        "totalTransactionFees": "7.23054005",
        "numberOfUniqueBitcoinAddressesUsed": "21602",
        "totalOutputVolumeValue": "294077.7455",
        "averageNumberOfTransactionsPerBlock": "53"
    },
    {
        "month": "8",
        "day": "23",
        "year": "2011",
        "price": "11.49",
        "totalCirculation": "7114450",
        "totalTransactionFees": "5.45671341",
        "numberOfUniqueBitcoinAddressesUsed": "21892",
        "totalOutputVolumeValue": "435943.3225",
        "averageNumberOfTransactionsPerBlock": "47"
    },
    {
        "month": "8",
        "day": "24",
        "year": "2011",
        "price": "11.4",
        "totalCirculation": "7121000",
        "totalTransactionFees": "9.52533281",
        "numberOfUniqueBitcoinAddressesUsed": "17886",
        "totalOutputVolumeValue": "552500.4108",
        "averageNumberOfTransactionsPerBlock": "62"
    },
    {
        "month": "8",
        "day": "25",
        "year": "2011",
        "price": "10.96554",
        "totalCirculation": "7127400",
        "totalTransactionFees": "6.85117903",
        "numberOfUniqueBitcoinAddressesUsed": "18626",
        "totalOutputVolumeValue": "394895.9493",
        "averageNumberOfTransactionsPerBlock": "50"
    },
    {
        "month": "8",
        "day": "26",
        "year": "2011",
        "price": "10.3",
        "totalCirculation": "7135100",
        "totalTransactionFees": "5.08571809",
        "numberOfUniqueBitcoinAddressesUsed": "19914",
        "totalOutputVolumeValue": "278481.5307",
        "averageNumberOfTransactionsPerBlock": "48"
    },
    {
        "month": "8",
        "day": "27",
        "year": "2011",
        "price": "9.11",
        "totalCirculation": "7141650",
        "totalTransactionFees": "5.07591598",
        "numberOfUniqueBitcoinAddressesUsed": "16681",
        "totalOutputVolumeValue": "2731977.811",
        "averageNumberOfTransactionsPerBlock": "56"
    },
    {
        "month": "8",
        "day": "28",
        "year": "2011",
        "price": "9.48",
        "totalCirculation": "7147350",
        "totalTransactionFees": "4.24898819",
        "numberOfUniqueBitcoinAddressesUsed": "16239",
        "totalOutputVolumeValue": "196781.4599",
        "averageNumberOfTransactionsPerBlock": "42"
    },
    {
        "month": "8",
        "day": "29",
        "year": "2011",
        "price": "9.4811",
        "totalCirculation": "7153600",
        "totalTransactionFees": "5.35302216",
        "numberOfUniqueBitcoinAddressesUsed": "17103",
        "totalOutputVolumeValue": "235746.9132",
        "averageNumberOfTransactionsPerBlock": "44"
    },
    {
        "month": "8",
        "day": "30",
        "year": "2011",
        "price": "9.15031",
        "totalCirculation": "7161350",
        "totalTransactionFees": "5.3418445",
        "numberOfUniqueBitcoinAddressesUsed": "14933",
        "totalOutputVolumeValue": "243490.7645",
        "averageNumberOfTransactionsPerBlock": "52"
    },
    {
        "month": "8",
        "day": "31",
        "year": "2011",
        "price": "9",
        "totalCirculation": "7168900",
        "totalTransactionFees": "10.10021477",
        "numberOfUniqueBitcoinAddressesUsed": "14550",
        "totalOutputVolumeValue": "267606.5559",
        "averageNumberOfTransactionsPerBlock": "47"
    },
    {
        "month": "9",
        "day": "1",
        "year": "2011",
        "price": "8.44934",
        "totalCirculation": "7175250",
        "totalTransactionFees": "5.69525979",
        "numberOfUniqueBitcoinAddressesUsed": "13820",
        "totalOutputVolumeValue": "346068.2175",
        "averageNumberOfTransactionsPerBlock": "51"
    },
    {
        "month": "9",
        "day": "2",
        "year": "2011",
        "price": "8.4989",
        "totalCirculation": "7183350",
        "totalTransactionFees": "5.26021947",
        "numberOfUniqueBitcoinAddressesUsed": "13891",
        "totalOutputVolumeValue": "243024.952",
        "averageNumberOfTransactionsPerBlock": "48"
    },
    {
        "month": "9",
        "day": "3",
        "year": "2011",
        "price": "8.7138",
        "totalCirculation": "7190450",
        "totalTransactionFees": "6.07488965",
        "numberOfUniqueBitcoinAddressesUsed": "12731",
        "totalOutputVolumeValue": "241946.1174",
        "averageNumberOfTransactionsPerBlock": "51"
    },
    {
        "month": "9",
        "day": "4",
        "year": "2011",
        "price": "8.593999999",
        "totalCirculation": "7196750",
        "totalTransactionFees": "9.10167977",
        "numberOfUniqueBitcoinAddressesUsed": "14161",
        "totalOutputVolumeValue": "1672147.942",
        "averageNumberOfTransactionsPerBlock": "51"
    },
    {
        "month": "9",
        "day": "5",
        "year": "2011",
        "price": "8.467",
        "totalCirculation": "7204450",
        "totalTransactionFees": "7.16748946",
        "numberOfUniqueBitcoinAddressesUsed": "15971",
        "totalOutputVolumeValue": "1727494.293",
        "averageNumberOfTransactionsPerBlock": "45"
    },
    {
        "month": "9",
        "day": "6",
        "year": "2011",
        "price": "7.65713",
        "totalCirculation": "7211950",
        "totalTransactionFees": "6.40762714",
        "numberOfUniqueBitcoinAddressesUsed": "15194",
        "totalOutputVolumeValue": "3276984.707",
        "averageNumberOfTransactionsPerBlock": "45"
    },
    {
        "month": "9",
        "day": "7",
        "year": "2011",
        "price": "7.59916",
        "totalCirculation": "7219300",
        "totalTransactionFees": "8.10420009",
        "numberOfUniqueBitcoinAddressesUsed": "14446",
        "totalOutputVolumeValue": "1079147.894",
        "averageNumberOfTransactionsPerBlock": "49"
    },
    {
        "month": "9",
        "day": "8",
        "year": "2011",
        "price": "7.31509",
        "totalCirculation": "7225550",
        "totalTransactionFees": "4.9515221",
        "numberOfUniqueBitcoinAddressesUsed": "13362",
        "totalOutputVolumeValue": "384196.0149",
        "averageNumberOfTransactionsPerBlock": "48"
    },
    {
        "month": "9",
        "day": "9",
        "year": "2011",
        "price": "6.94",
        "totalCirculation": "7232550",
        "totalTransactionFees": "7.39910874",
        "numberOfUniqueBitcoinAddressesUsed": "13930",
        "totalOutputVolumeValue": "414417.2717",
        "averageNumberOfTransactionsPerBlock": "42"
    },
    {
        "month": "9",
        "day": "10",
        "year": "2011",
        "price": "6.20892",
        "totalCirculation": "7239700",
        "totalTransactionFees": "5.89377078",
        "numberOfUniqueBitcoinAddressesUsed": "13186",
        "totalOutputVolumeValue": "313641.3628",
        "averageNumberOfTransactionsPerBlock": "40"
    },
    {
        "month": "9",
        "day": "11",
        "year": "2011",
        "price": "7.4",
        "totalCirculation": "7246600",
        "totalTransactionFees": "4.71826473",
        "numberOfUniqueBitcoinAddressesUsed": "12955",
        "totalOutputVolumeValue": "1007931.349",
        "averageNumberOfTransactionsPerBlock": "47"
    },
    {
        "month": "9",
        "day": "12",
        "year": "2011",
        "price": "7.081",
        "totalCirculation": "7253100",
        "totalTransactionFees": "5.38775655",
        "numberOfUniqueBitcoinAddressesUsed": "12932",
        "totalOutputVolumeValue": "633133.7237",
        "averageNumberOfTransactionsPerBlock": "50"
    },
    {
        "month": "9",
        "day": "13",
        "year": "2011",
        "price": "6.25",
        "totalCirculation": "7259900",
        "totalTransactionFees": "4.74685664",
        "numberOfUniqueBitcoinAddressesUsed": "13053",
        "totalOutputVolumeValue": "341538.8695",
        "averageNumberOfTransactionsPerBlock": "34"
    },
    {
        "month": "9",
        "day": "14",
        "year": "2011",
        "price": "5.990000001",
        "totalCirculation": "7267500",
        "totalTransactionFees": "3.85622561",
        "numberOfUniqueBitcoinAddressesUsed": "13152",
        "totalOutputVolumeValue": "337226.5027",
        "averageNumberOfTransactionsPerBlock": "51"
    },
    {
        "month": "9",
        "day": "15",
        "year": "2011",
        "price": "5.69",
        "totalCirculation": "7274900",
        "totalTransactionFees": "3.88694001",
        "numberOfUniqueBitcoinAddressesUsed": "11956",
        "totalOutputVolumeValue": "248417.394",
        "averageNumberOfTransactionsPerBlock": "53"
    },
    {
        "month": "9",
        "day": "16",
        "year": "2011",
        "price": "5.23",
        "totalCirculation": "7281200",
        "totalTransactionFees": "7.98324496",
        "numberOfUniqueBitcoinAddressesUsed": "12058",
        "totalOutputVolumeValue": "535163.4919",
        "averageNumberOfTransactionsPerBlock": "54"
    },
    {
        "month": "9",
        "day": "17",
        "year": "2011",
        "price": "5.022",
        "totalCirculation": "7287350",
        "totalTransactionFees": "5.4756153",
        "numberOfUniqueBitcoinAddressesUsed": "12148",
        "totalOutputVolumeValue": "527059.1744",
        "averageNumberOfTransactionsPerBlock": "45"
    },
    {
        "month": "9",
        "day": "18",
        "year": "2011",
        "price": "5",
        "totalCirculation": "7295700",
        "totalTransactionFees": "4.96046949",
        "numberOfUniqueBitcoinAddressesUsed": "11736",
        "totalOutputVolumeValue": "300685.9418",
        "averageNumberOfTransactionsPerBlock": "43"
    },
    {
        "month": "9",
        "day": "19",
        "year": "2011",
        "price": "5.6",
        "totalCirculation": "7301800",
        "totalTransactionFees": "6.00913231",
        "numberOfUniqueBitcoinAddressesUsed": "12541",
        "totalOutputVolumeValue": "341653.5303",
        "averageNumberOfTransactionsPerBlock": "50"
    },
    {
        "month": "9",
        "day": "20",
        "year": "2011",
        "price": "6.795",
        "totalCirculation": "7308750",
        "totalTransactionFees": "6.01759103",
        "numberOfUniqueBitcoinAddressesUsed": "18459",
        "totalOutputVolumeValue": "339001.2072",
        "averageNumberOfTransactionsPerBlock": "39"
    },
    {
        "month": "9",
        "day": "21",
        "year": "2011",
        "price": "6.28664",
        "totalCirculation": "7316150",
        "totalTransactionFees": "5.34280467",
        "numberOfUniqueBitcoinAddressesUsed": "13872",
        "totalOutputVolumeValue": "414519.7517",
        "averageNumberOfTransactionsPerBlock": "43"
    },
    {
        "month": "9",
        "day": "22",
        "year": "2011",
        "price": "5.83001",
        "totalCirculation": "7323650",
        "totalTransactionFees": "4.47693446",
        "numberOfUniqueBitcoinAddressesUsed": "14757",
        "totalOutputVolumeValue": "314771.6547",
        "averageNumberOfTransactionsPerBlock": "44"
    },
    {
        "month": "9",
        "day": "23",
        "year": "2011",
        "price": "5.70653",
        "totalCirculation": "7330350",
        "totalTransactionFees": "3.83846876",
        "numberOfUniqueBitcoinAddressesUsed": "17019",
        "totalOutputVolumeValue": "241895.8348",
        "averageNumberOfTransactionsPerBlock": "43"
    },
    {
        "month": "9",
        "day": "24",
        "year": "2011",
        "price": "5.66",
        "totalCirculation": "7336550",
        "totalTransactionFees": "7.17138576",
        "numberOfUniqueBitcoinAddressesUsed": "17662",
        "totalOutputVolumeValue": "337969.8798",
        "averageNumberOfTransactionsPerBlock": "42"
    },
    {
        "month": "9",
        "day": "25",
        "year": "2011",
        "price": "5.5",
        "totalCirculation": "7343650",
        "totalTransactionFees": "3.23532626",
        "numberOfUniqueBitcoinAddressesUsed": "17523",
        "totalOutputVolumeValue": "238157.2466",
        "averageNumberOfTransactionsPerBlock": "46"
    },
    {
        "month": "9",
        "day": "26",
        "year": "2011",
        "price": "5.46014",
        "totalCirculation": "7350500",
        "totalTransactionFees": "3.33132041",
        "numberOfUniqueBitcoinAddressesUsed": "17160",
        "totalOutputVolumeValue": "346174.178",
        "averageNumberOfTransactionsPerBlock": "41"
    },
    {
        "month": "9",
        "day": "27",
        "year": "2011",
        "price": "5.13018",
        "totalCirculation": "7357300",
        "totalTransactionFees": "4.17476213",
        "numberOfUniqueBitcoinAddressesUsed": "16854",
        "totalOutputVolumeValue": "370803.6468",
        "averageNumberOfTransactionsPerBlock": "39"
    },
    {
        "month": "9",
        "day": "28",
        "year": "2011",
        "price": "4.989",
        "totalCirculation": "7363950",
        "totalTransactionFees": "4.57610176",
        "numberOfUniqueBitcoinAddressesUsed": "11610",
        "totalOutputVolumeValue": "390599.5677",
        "averageNumberOfTransactionsPerBlock": "48"
    },
    {
        "month": "9",
        "day": "29",
        "year": "2011",
        "price": "4.809",
        "totalCirculation": "7370650",
        "totalTransactionFees": "3.56288467",
        "numberOfUniqueBitcoinAddressesUsed": "10806",
        "totalOutputVolumeValue": "348551.5312",
        "averageNumberOfTransactionsPerBlock": "40"
    },
    {
        "month": "9",
        "day": "30",
        "year": "2011",
        "price": "5.35",
        "totalCirculation": "7376800",
        "totalTransactionFees": "3.38489362",
        "numberOfUniqueBitcoinAddressesUsed": "11409",
        "totalOutputVolumeValue": "282245.8727",
        "averageNumberOfTransactionsPerBlock": "45"
    },
    {
        "month": "10",
        "day": "1",
        "year": "2011",
        "price": "5.3",
        "totalCirculation": "7383600",
        "totalTransactionFees": "3.5672863",
        "numberOfUniqueBitcoinAddressesUsed": "10969",
        "totalOutputVolumeValue": "310744.4916",
        "averageNumberOfTransactionsPerBlock": "45"
    },
    {
        "month": "10",
        "day": "2",
        "year": "2011",
        "price": "5.16",
        "totalCirculation": "7390150",
        "totalTransactionFees": "3.26002348",
        "numberOfUniqueBitcoinAddressesUsed": "10163",
        "totalOutputVolumeValue": "434779.8815",
        "averageNumberOfTransactionsPerBlock": "43"
    },
    {
        "month": "10",
        "day": "3",
        "year": "2011",
        "price": "5.07546",
        "totalCirculation": "7396650",
        "totalTransactionFees": "9.34666058",
        "numberOfUniqueBitcoinAddressesUsed": "11545",
        "totalOutputVolumeValue": "389637.531",
        "averageNumberOfTransactionsPerBlock": "43"
    },
    {
        "month": "10",
        "day": "4",
        "year": "2011",
        "price": "5.03",
        "totalCirculation": "7403150",
        "totalTransactionFees": "3.40150005",
        "numberOfUniqueBitcoinAddressesUsed": "10079",
        "totalOutputVolumeValue": "371051.0924",
        "averageNumberOfTransactionsPerBlock": "45"
    },
    {
        "month": "10",
        "day": "5",
        "year": "2011",
        "price": "5.025",
        "totalCirculation": "7410000",
        "totalTransactionFees": "3.52404524",
        "numberOfUniqueBitcoinAddressesUsed": "12453",
        "totalOutputVolumeValue": "453881.7605",
        "averageNumberOfTransactionsPerBlock": "46"
    },
    {
        "month": "10",
        "day": "6",
        "year": "2011",
        "price": "4.93",
        "totalCirculation": "7416650",
        "totalTransactionFees": "6.66264112",
        "numberOfUniqueBitcoinAddressesUsed": "11909",
        "totalOutputVolumeValue": "429374.4669",
        "averageNumberOfTransactionsPerBlock": "55"
    },
    {
        "month": "10",
        "day": "7",
        "year": "2011",
        "price": "4.85",
        "totalCirculation": "7423050",
        "totalTransactionFees": "5.68168641",
        "numberOfUniqueBitcoinAddressesUsed": "11289",
        "totalOutputVolumeValue": "466382.1607",
        "averageNumberOfTransactionsPerBlock": "54"
    },
    {
        "month": "10",
        "day": "8",
        "year": "2011",
        "price": "4.594",
        "totalCirculation": "7429500",
        "totalTransactionFees": "3.92876955",
        "numberOfUniqueBitcoinAddressesUsed": "10939",
        "totalOutputVolumeValue": "324504.7311",
        "averageNumberOfTransactionsPerBlock": "52"
    },
    {
        "month": "10",
        "day": "9",
        "year": "2011",
        "price": "4.389",
        "totalCirculation": "7435650",
        "totalTransactionFees": "3.07908946",
        "numberOfUniqueBitcoinAddressesUsed": "10976",
        "totalOutputVolumeValue": "312208.7113",
        "averageNumberOfTransactionsPerBlock": "42"
    },
    {
        "month": "10",
        "day": "10",
        "year": "2011",
        "price": "4.25937",
        "totalCirculation": "7441550",
        "totalTransactionFees": "3.17994555",
        "numberOfUniqueBitcoinAddressesUsed": "10553",
        "totalOutputVolumeValue": "296865.6798",
        "averageNumberOfTransactionsPerBlock": "43"
    },
    {
        "month": "10",
        "day": "11",
        "year": "2011",
        "price": "4.14001",
        "totalCirculation": "7446850",
        "totalTransactionFees": "4.8110874",
        "numberOfUniqueBitcoinAddressesUsed": "11523",
        "totalOutputVolumeValue": "333200.9451",
        "averageNumberOfTransactionsPerBlock": "39"
    },
    {
        "month": "10",
        "day": "12",
        "year": "2011",
        "price": "4.20612",
        "totalCirculation": "7452800",
        "totalTransactionFees": "4.52713498",
        "numberOfUniqueBitcoinAddressesUsed": "12312",
        "totalOutputVolumeValue": "339241.2286",
        "averageNumberOfTransactionsPerBlock": "49"
    },
    {
        "month": "10",
        "day": "13",
        "year": "2011",
        "price": "4.45",
        "totalCirculation": "7457350",
        "totalTransactionFees": "4.68456623",
        "numberOfUniqueBitcoinAddressesUsed": "9294",
        "totalOutputVolumeValue": "306799.8725",
        "averageNumberOfTransactionsPerBlock": "43"
    },
    {
        "month": "10",
        "day": "14",
        "year": "2011",
        "price": "4.11455",
        "totalCirculation": "7464000",
        "totalTransactionFees": "3.47204625",
        "numberOfUniqueBitcoinAddressesUsed": "10647",
        "totalOutputVolumeValue": "270082.8971",
        "averageNumberOfTransactionsPerBlock": "36"
    },
    {
        "month": "10",
        "day": "15",
        "year": "2011",
        "price": "4.05",
        "totalCirculation": "7471050",
        "totalTransactionFees": "3.47903207",
        "numberOfUniqueBitcoinAddressesUsed": "11551",
        "totalOutputVolumeValue": "402600.0018",
        "averageNumberOfTransactionsPerBlock": "45"
    },
    {
        "month": "10",
        "day": "16",
        "year": "2011",
        "price": "3.9009",
        "totalCirculation": "7477200",
        "totalTransactionFees": "2.8099505",
        "numberOfUniqueBitcoinAddressesUsed": "9706",
        "totalOutputVolumeValue": "233069.9002",
        "averageNumberOfTransactionsPerBlock": "38"
    },
    {
        "month": "10",
        "day": "17",
        "year": "2011",
        "price": "3.75996",
        "totalCirculation": "7482850",
        "totalTransactionFees": "4.46768129",
        "numberOfUniqueBitcoinAddressesUsed": "11136",
        "totalOutputVolumeValue": "451457.1893",
        "averageNumberOfTransactionsPerBlock": "51"
    },
    {
        "month": "10",
        "day": "18",
        "year": "2011",
        "price": "2.9",
        "totalCirculation": "7489200",
        "totalTransactionFees": "3.1571327",
        "numberOfUniqueBitcoinAddressesUsed": "10981",
        "totalOutputVolumeValue": "406424.7152",
        "averageNumberOfTransactionsPerBlock": "51"
    },
    {
        "month": "10",
        "day": "19",
        "year": "2011",
        "price": "2.64999",
        "totalCirculation": "7495800",
        "totalTransactionFees": "3.42772158",
        "numberOfUniqueBitcoinAddressesUsed": "9684",
        "totalOutputVolumeValue": "274846.1126",
        "averageNumberOfTransactionsPerBlock": "48"
    },
    {
        "month": "10",
        "day": "20",
        "year": "2011",
        "price": "2.42",
        "totalCirculation": "7500950",
        "totalTransactionFees": "5.74099126",
        "numberOfUniqueBitcoinAddressesUsed": "8801",
        "totalOutputVolumeValue": "321171.8506",
        "averageNumberOfTransactionsPerBlock": "40"
    },
    {
        "month": "10",
        "day": "21",
        "year": "2011",
        "price": "2.72002",
        "totalCirculation": "7507850",
        "totalTransactionFees": "2.79374852",
        "numberOfUniqueBitcoinAddressesUsed": "10518",
        "totalOutputVolumeValue": "446049.8318",
        "averageNumberOfTransactionsPerBlock": "48"
    },
    {
        "month": "10",
        "day": "22",
        "year": "2011",
        "price": "3.3",
        "totalCirculation": "7512550",
        "totalTransactionFees": "2.66416828",
        "numberOfUniqueBitcoinAddressesUsed": "9425",
        "totalOutputVolumeValue": "615136.9349",
        "averageNumberOfTransactionsPerBlock": "41"
    },
    {
        "month": "10",
        "day": "23",
        "year": "2011",
        "price": "3.36",
        "totalCirculation": "7517800",
        "totalTransactionFees": "3.00894325",
        "numberOfUniqueBitcoinAddressesUsed": "10417",
        "totalOutputVolumeValue": "557222.7315",
        "averageNumberOfTransactionsPerBlock": "50"
    },
    {
        "month": "10",
        "day": "24",
        "year": "2011",
        "price": "3.2",
        "totalCirculation": "7523950",
        "totalTransactionFees": "3.24402503",
        "numberOfUniqueBitcoinAddressesUsed": "11390",
        "totalOutputVolumeValue": "417449.3014",
        "averageNumberOfTransactionsPerBlock": "48"
    },
    {
        "month": "10",
        "day": "25",
        "year": "2011",
        "price": "3.04",
        "totalCirculation": "7530450",
        "totalTransactionFees": "3.01637396",
        "numberOfUniqueBitcoinAddressesUsed": "10830",
        "totalOutputVolumeValue": "354032.3213",
        "averageNumberOfTransactionsPerBlock": "50"
    },
    {
        "month": "10",
        "day": "26",
        "year": "2011",
        "price": "2.876",
        "totalCirculation": "7535900",
        "totalTransactionFees": "3.39589176",
        "numberOfUniqueBitcoinAddressesUsed": "10204",
        "totalOutputVolumeValue": "354289.4338",
        "averageNumberOfTransactionsPerBlock": "36"
    },
    {
        "month": "10",
        "day": "27",
        "year": "2011",
        "price": "3.0499",
        "totalCirculation": "7541650",
        "totalTransactionFees": "2.51974203",
        "numberOfUniqueBitcoinAddressesUsed": "9527",
        "totalOutputVolumeValue": "616114.9093",
        "averageNumberOfTransactionsPerBlock": "40"
    },
    {
        "month": "10",
        "day": "28",
        "year": "2011",
        "price": "3.255",
        "totalCirculation": "7546750",
        "totalTransactionFees": "3.15074039",
        "numberOfUniqueBitcoinAddressesUsed": "9752",
        "totalOutputVolumeValue": "464194.2783",
        "averageNumberOfTransactionsPerBlock": "38"
    },
    {
        "month": "10",
        "day": "29",
        "year": "2011",
        "price": "3.82717",
        "totalCirculation": "7552700",
        "totalTransactionFees": "3.40234917",
        "numberOfUniqueBitcoinAddressesUsed": "11058",
        "totalOutputVolumeValue": "467306.3952",
        "averageNumberOfTransactionsPerBlock": "45"
    },
    {
        "month": "10",
        "day": "30",
        "year": "2011",
        "price": "3.65026",
        "totalCirculation": "7557550",
        "totalTransactionFees": "3.40992865",
        "numberOfUniqueBitcoinAddressesUsed": "9259",
        "totalOutputVolumeValue": "217988.1543",
        "averageNumberOfTransactionsPerBlock": "46"
    },
    {
        "month": "10",
        "day": "31",
        "year": "2011",
        "price": "3.388",
        "totalCirculation": "7564400",
        "totalTransactionFees": "2.56528203",
        "numberOfUniqueBitcoinAddressesUsed": "9725",
        "totalOutputVolumeValue": "226517.5637",
        "averageNumberOfTransactionsPerBlock": "43"
    },
    {
        "month": "11",
        "day": "1",
        "year": "2011",
        "price": "3.35",
        "totalCirculation": "7571700",
        "totalTransactionFees": "5.1065652",
        "numberOfUniqueBitcoinAddressesUsed": "10403",
        "totalOutputVolumeValue": "671779.7136",
        "averageNumberOfTransactionsPerBlock": "33"
    },
    {
        "month": "11",
        "day": "2",
        "year": "2011",
        "price": "3.44",
        "totalCirculation": "7579250",
        "totalTransactionFees": "3.23511613",
        "numberOfUniqueBitcoinAddressesUsed": "10673",
        "totalOutputVolumeValue": "403170.8473",
        "averageNumberOfTransactionsPerBlock": "40"
    },
    {
        "month": "11",
        "day": "3",
        "year": "2011",
        "price": "3.299",
        "totalCirculation": "7585600",
        "totalTransactionFees": "2.88038385",
        "numberOfUniqueBitcoinAddressesUsed": "10207",
        "totalOutputVolumeValue": "357650.878",
        "averageNumberOfTransactionsPerBlock": "42"
    },
    {
        "month": "11",
        "day": "4",
        "year": "2011",
        "price": "3.21874",
        "totalCirculation": "7592750",
        "totalTransactionFees": "3.33893916",
        "numberOfUniqueBitcoinAddressesUsed": "11518",
        "totalOutputVolumeValue": "346464.8745",
        "averageNumberOfTransactionsPerBlock": "39"
    },
    {
        "month": "11",
        "day": "5",
        "year": "2011",
        "price": "3.21",
        "totalCirculation": "7600250",
        "totalTransactionFees": "3.42899532",
        "numberOfUniqueBitcoinAddressesUsed": "12548",
        "totalOutputVolumeValue": "368120.7916",
        "averageNumberOfTransactionsPerBlock": "43"
    },
    {
        "month": "11",
        "day": "6",
        "year": "2011",
        "price": "3.05",
        "totalCirculation": "7607650",
        "totalTransactionFees": "2.68651732",
        "numberOfUniqueBitcoinAddressesUsed": "9641",
        "totalOutputVolumeValue": "242378.3126",
        "averageNumberOfTransactionsPerBlock": "44"
    },
    {
        "month": "11",
        "day": "7",
        "year": "2011",
        "price": "3.0289",
        "totalCirculation": "7614200",
        "totalTransactionFees": "3.44751402",
        "numberOfUniqueBitcoinAddressesUsed": "10269",
        "totalOutputVolumeValue": "234510.825",
        "averageNumberOfTransactionsPerBlock": "39"
    },
    {
        "month": "11",
        "day": "8",
        "year": "2011",
        "price": "3.21",
        "totalCirculation": "7620950",
        "totalTransactionFees": "3.72947765",
        "numberOfUniqueBitcoinAddressesUsed": "10896",
        "totalOutputVolumeValue": "864461.9364",
        "averageNumberOfTransactionsPerBlock": "34"
    },
    {
        "month": "11",
        "day": "9",
        "year": "2011",
        "price": "3.114",
        "totalCirculation": "7629400",
        "totalTransactionFees": "3.78935692",
        "numberOfUniqueBitcoinAddressesUsed": "12174",
        "totalOutputVolumeValue": "1193440.333",
        "averageNumberOfTransactionsPerBlock": "41"
    },
    {
        "month": "11",
        "day": "10",
        "year": "2011",
        "price": "3",
        "totalCirculation": "7636650",
        "totalTransactionFees": "3.43121601",
        "numberOfUniqueBitcoinAddressesUsed": "11557",
        "totalOutputVolumeValue": "389487.3803",
        "averageNumberOfTransactionsPerBlock": "37"
    },
    {
        "month": "11",
        "day": "11",
        "year": "2011",
        "price": "3",
        "totalCirculation": "7642750",
        "totalTransactionFees": "2.04213243",
        "numberOfUniqueBitcoinAddressesUsed": "10074",
        "totalOutputVolumeValue": "333985.9527",
        "averageNumberOfTransactionsPerBlock": "44"
    },
    {
        "month": "11",
        "day": "12",
        "year": "2011",
        "price": "3.11",
        "totalCirculation": "7649500",
        "totalTransactionFees": "2.58769763",
        "numberOfUniqueBitcoinAddressesUsed": "10156",
        "totalOutputVolumeValue": "259102.7559",
        "averageNumberOfTransactionsPerBlock": "38"
    },
    {
        "month": "11",
        "day": "13",
        "year": "2011",
        "price": "3.099",
        "totalCirculation": "7656850",
        "totalTransactionFees": "2.52287731",
        "numberOfUniqueBitcoinAddressesUsed": "9589",
        "totalOutputVolumeValue": "275344.1999",
        "averageNumberOfTransactionsPerBlock": "36"
    },
    {
        "month": "11",
        "day": "14",
        "year": "2011",
        "price": "3.03",
        "totalCirculation": "7663650",
        "totalTransactionFees": "2.76633599",
        "numberOfUniqueBitcoinAddressesUsed": "10726",
        "totalOutputVolumeValue": "312461.389",
        "averageNumberOfTransactionsPerBlock": "38"
    },
    {
        "month": "11",
        "day": "15",
        "year": "2011",
        "price": "2.69",
        "totalCirculation": "7672300",
        "totalTransactionFees": "3.20336403",
        "numberOfUniqueBitcoinAddressesUsed": "11798",
        "totalOutputVolumeValue": "385370.903",
        "averageNumberOfTransactionsPerBlock": "37"
    },
    {
        "month": "11",
        "day": "16",
        "year": "2011",
        "price": "2.6",
        "totalCirculation": "7678950",
        "totalTransactionFees": "3.57793717",
        "numberOfUniqueBitcoinAddressesUsed": "10639",
        "totalOutputVolumeValue": "1877613.011",
        "averageNumberOfTransactionsPerBlock": "37"
    },
    {
        "month": "11",
        "day": "17",
        "year": "2011",
        "price": "2.60031",
        "totalCirculation": "7686200",
        "totalTransactionFees": "2.95917489",
        "numberOfUniqueBitcoinAddressesUsed": "10600",
        "totalOutputVolumeValue": "2858886.197",
        "averageNumberOfTransactionsPerBlock": "39"
    },
    {
        "month": "11",
        "day": "18",
        "year": "2011",
        "price": "2.38998",
        "totalCirculation": "7692750",
        "totalTransactionFees": "3.34454677",
        "numberOfUniqueBitcoinAddressesUsed": "9438",
        "totalOutputVolumeValue": "5136996.581",
        "averageNumberOfTransactionsPerBlock": "42"
    },
    {
        "month": "11",
        "day": "19",
        "year": "2011",
        "price": "2.3",
        "totalCirculation": "7699200",
        "totalTransactionFees": "3.05504471",
        "numberOfUniqueBitcoinAddressesUsed": "8745",
        "totalOutputVolumeValue": "4105280.905",
        "averageNumberOfTransactionsPerBlock": "44"
    },
    {
        "month": "11",
        "day": "20",
        "year": "2011",
        "price": "2.499",
        "totalCirculation": "7705600",
        "totalTransactionFees": "4.0309302",
        "numberOfUniqueBitcoinAddressesUsed": "8068",
        "totalOutputVolumeValue": "1958849.413",
        "averageNumberOfTransactionsPerBlock": "41"
    },
    {
        "month": "11",
        "day": "21",
        "year": "2011",
        "price": "2.29",
        "totalCirculation": "7712350",
        "totalTransactionFees": "2.50056261",
        "numberOfUniqueBitcoinAddressesUsed": "8487",
        "totalOutputVolumeValue": "1796249.437",
        "averageNumberOfTransactionsPerBlock": "39"
    },
    {
        "month": "11",
        "day": "22",
        "year": "2011",
        "price": "2.35",
        "totalCirculation": "7719100",
        "totalTransactionFees": "3.37516787",
        "numberOfUniqueBitcoinAddressesUsed": "8795",
        "totalOutputVolumeValue": "3512090.689",
        "averageNumberOfTransactionsPerBlock": "42"
    },
    {
        "month": "11",
        "day": "23",
        "year": "2011",
        "price": "2.38",
        "totalCirculation": "7725650",
        "totalTransactionFees": "3.41667059",
        "numberOfUniqueBitcoinAddressesUsed": "8805",
        "totalOutputVolumeValue": "1556254.492",
        "averageNumberOfTransactionsPerBlock": "47"
    },
    {
        "month": "11",
        "day": "24",
        "year": "2011",
        "price": "2.46",
        "totalCirculation": "7731250",
        "totalTransactionFees": "3.49219286",
        "numberOfUniqueBitcoinAddressesUsed": "8310",
        "totalOutputVolumeValue": "1481015.672",
        "averageNumberOfTransactionsPerBlock": "46"
    },
    {
        "month": "11",
        "day": "25",
        "year": "2011",
        "price": "2.56",
        "totalCirculation": "7737750",
        "totalTransactionFees": "3.78509764",
        "numberOfUniqueBitcoinAddressesUsed": "9336",
        "totalOutputVolumeValue": "676349.7316",
        "averageNumberOfTransactionsPerBlock": "43"
    },
    {
        "month": "11",
        "day": "26",
        "year": "2011",
        "price": "2.53125",
        "totalCirculation": "7744100",
        "totalTransactionFees": "3.60336148",
        "numberOfUniqueBitcoinAddressesUsed": "8122",
        "totalOutputVolumeValue": "2154058.364",
        "averageNumberOfTransactionsPerBlock": "36"
    },
    {
        "month": "11",
        "day": "27",
        "year": "2011",
        "price": "2.4965",
        "totalCirculation": "7749800",
        "totalTransactionFees": "2.73332716",
        "numberOfUniqueBitcoinAddressesUsed": "8141",
        "totalOutputVolumeValue": "1799564.621",
        "averageNumberOfTransactionsPerBlock": "40"
    },
    {
        "month": "11",
        "day": "28",
        "year": "2011",
        "price": "2.53899",
        "totalCirculation": "7756000",
        "totalTransactionFees": "3.04363533",
        "numberOfUniqueBitcoinAddressesUsed": "9939",
        "totalOutputVolumeValue": "3976959.62",
        "averageNumberOfTransactionsPerBlock": "36"
    },
    {
        "month": "11",
        "day": "29",
        "year": "2011",
        "price": "2.981",
        "totalCirculation": "7762950",
        "totalTransactionFees": "4.44141507",
        "numberOfUniqueBitcoinAddressesUsed": "11164",
        "totalOutputVolumeValue": "3011316.727",
        "averageNumberOfTransactionsPerBlock": "38"
    },
    {
        "month": "11",
        "day": "30",
        "year": "2011",
        "price": "2.959",
        "totalCirculation": "7770250",
        "totalTransactionFees": "3.29898062",
        "numberOfUniqueBitcoinAddressesUsed": "10512",
        "totalOutputVolumeValue": "5874122.084",
        "averageNumberOfTransactionsPerBlock": "39"
    },
    {
        "month": "12",
        "day": "1",
        "year": "2011",
        "price": "3.14",
        "totalCirculation": "7779500",
        "totalTransactionFees": "4.31536335",
        "numberOfUniqueBitcoinAddressesUsed": "11715",
        "totalOutputVolumeValue": "3247186.586",
        "averageNumberOfTransactionsPerBlock": "44"
    },
    {
        "month": "12",
        "day": "2",
        "year": "2011",
        "price": "3.138",
        "totalCirculation": "7787350",
        "totalTransactionFees": "4.30495028",
        "numberOfUniqueBitcoinAddressesUsed": "10589",
        "totalOutputVolumeValue": "4672086.59",
        "averageNumberOfTransactionsPerBlock": "48"
    },
    {
        "month": "12",
        "day": "3",
        "year": "2011",
        "price": "3.12999",
        "totalCirculation": "7794850",
        "totalTransactionFees": "4.0934545",
        "numberOfUniqueBitcoinAddressesUsed": "9426",
        "totalOutputVolumeValue": "4034195.819",
        "averageNumberOfTransactionsPerBlock": "37"
    },
    {
        "month": "12",
        "day": "4",
        "year": "2011",
        "price": "2.99",
        "totalCirculation": "7801700",
        "totalTransactionFees": "3.5088385",
        "numberOfUniqueBitcoinAddressesUsed": "9094",
        "totalOutputVolumeValue": "3364466.296",
        "averageNumberOfTransactionsPerBlock": "37"
    },
    {
        "month": "12",
        "day": "5",
        "year": "2011",
        "price": "2.93",
        "totalCirculation": "7809700",
        "totalTransactionFees": "3.61583294",
        "numberOfUniqueBitcoinAddressesUsed": "10411",
        "totalOutputVolumeValue": "2092723.786",
        "averageNumberOfTransactionsPerBlock": "36"
    },
    {
        "month": "12",
        "day": "6",
        "year": "2011",
        "price": "3.05",
        "totalCirculation": "7817650",
        "totalTransactionFees": "3.49937086",
        "numberOfUniqueBitcoinAddressesUsed": "11341",
        "totalOutputVolumeValue": "7369513.047",
        "averageNumberOfTransactionsPerBlock": "36"
    },
    {
        "month": "12",
        "day": "7",
        "year": "2011",
        "price": "3.082",
        "totalCirculation": "7825000",
        "totalTransactionFees": "3.99867645",
        "numberOfUniqueBitcoinAddressesUsed": "10988",
        "totalOutputVolumeValue": "5591453.634",
        "averageNumberOfTransactionsPerBlock": "36"
    },
    {
        "month": "12",
        "day": "8",
        "year": "2011",
        "price": "3.1",
        "totalCirculation": "7832700",
        "totalTransactionFees": "3.28631467",
        "numberOfUniqueBitcoinAddressesUsed": "9481",
        "totalOutputVolumeValue": "4750151.416",
        "averageNumberOfTransactionsPerBlock": "42"
    },
    {
        "month": "12",
        "day": "9",
        "year": "2011",
        "price": "3.039",
        "totalCirculation": "7840250",
        "totalTransactionFees": "2.96146207",
        "numberOfUniqueBitcoinAddressesUsed": "9524",
        "totalOutputVolumeValue": "2578945.791",
        "averageNumberOfTransactionsPerBlock": "35"
    },
    {
        "month": "12",
        "day": "10",
        "year": "2011",
        "price": "3.04",
        "totalCirculation": "7848100",
        "totalTransactionFees": "3.02294953",
        "numberOfUniqueBitcoinAddressesUsed": "9793",
        "totalOutputVolumeValue": "1146907.377",
        "averageNumberOfTransactionsPerBlock": "44"
    },
    {
        "month": "12",
        "day": "11",
        "year": "2011",
        "price": "3.38",
        "totalCirculation": "7855350",
        "totalTransactionFees": "90.99811174",
        "numberOfUniqueBitcoinAddressesUsed": "8549",
        "totalOutputVolumeValue": "908804.1487",
        "averageNumberOfTransactionsPerBlock": "42"
    },
    {
        "month": "12",
        "day": "12",
        "year": "2011",
        "price": "3.34237",
        "totalCirculation": "7862050",
        "totalTransactionFees": "305.2021348",
        "numberOfUniqueBitcoinAddressesUsed": "8547",
        "totalOutputVolumeValue": "780887.0583",
        "averageNumberOfTransactionsPerBlock": "33"
    },
    {
        "month": "12",
        "day": "13",
        "year": "2011",
        "price": "3.3",
        "totalCirculation": "7868500",
        "totalTransactionFees": "4.77703305",
        "numberOfUniqueBitcoinAddressesUsed": "9008",
        "totalOutputVolumeValue": "415686.9301",
        "averageNumberOfTransactionsPerBlock": "31"
    },
    {
        "month": "12",
        "day": "14",
        "year": "2011",
        "price": "3.277",
        "totalCirculation": "7875700",
        "totalTransactionFees": "3.6461913",
        "numberOfUniqueBitcoinAddressesUsed": "9943",
        "totalOutputVolumeValue": "414644.0224",
        "averageNumberOfTransactionsPerBlock": "34"
    },
    {
        "month": "12",
        "day": "15",
        "year": "2011",
        "price": "3.1933",
        "totalCirculation": "7881850",
        "totalTransactionFees": "8.39607542",
        "numberOfUniqueBitcoinAddressesUsed": "8700",
        "totalOutputVolumeValue": "460923.2232",
        "averageNumberOfTransactionsPerBlock": "49"
    },
    {
        "month": "12",
        "day": "16",
        "year": "2011",
        "price": "3.23",
        "totalCirculation": "7888050",
        "totalTransactionFees": "2.836012",
        "numberOfUniqueBitcoinAddressesUsed": "8365",
        "totalOutputVolumeValue": "434633.6244",
        "averageNumberOfTransactionsPerBlock": "36"
    },
    {
        "month": "12",
        "day": "17",
        "year": "2011",
        "price": "3.23",
        "totalCirculation": "7895350",
        "totalTransactionFees": "2.72970204",
        "numberOfUniqueBitcoinAddressesUsed": "7780",
        "totalOutputVolumeValue": "427685.7564",
        "averageNumberOfTransactionsPerBlock": "42"
    },
    {
        "month": "12",
        "day": "18",
        "year": "2011",
        "price": "3.25",
        "totalCirculation": "7902700",
        "totalTransactionFees": "3.89415776",
        "numberOfUniqueBitcoinAddressesUsed": "7873",
        "totalOutputVolumeValue": "310832.2712",
        "averageNumberOfTransactionsPerBlock": "37"
    },
    {
        "month": "12",
        "day": "19",
        "year": "2011",
        "price": "3.70036",
        "totalCirculation": "7910250",
        "totalTransactionFees": "3.61261747",
        "numberOfUniqueBitcoinAddressesUsed": "8828",
        "totalOutputVolumeValue": "456568.6696",
        "averageNumberOfTransactionsPerBlock": "35"
    },
    {
        "month": "12",
        "day": "20",
        "year": "2011",
        "price": "4.5",
        "totalCirculation": "7917000",
        "totalTransactionFees": "5.83700461",
        "numberOfUniqueBitcoinAddressesUsed": "10966",
        "totalOutputVolumeValue": "487765.0914",
        "averageNumberOfTransactionsPerBlock": "30"
    },
    {
        "month": "12",
        "day": "21",
        "year": "2011",
        "price": "4.11",
        "totalCirculation": "7924750",
        "totalTransactionFees": "3.99252286",
        "numberOfUniqueBitcoinAddressesUsed": "9328",
        "totalOutputVolumeValue": "608602.0222",
        "averageNumberOfTransactionsPerBlock": "31"
    },
    {
        "month": "12",
        "day": "22",
        "year": "2011",
        "price": "3.99199",
        "totalCirculation": "7931650",
        "totalTransactionFees": "4.15561326",
        "numberOfUniqueBitcoinAddressesUsed": "9669",
        "totalOutputVolumeValue": "497996.0193",
        "averageNumberOfTransactionsPerBlock": "35"
    },
    {
        "month": "12",
        "day": "23",
        "year": "2011",
        "price": "3.95",
        "totalCirculation": "7939250",
        "totalTransactionFees": "3.10079941",
        "numberOfUniqueBitcoinAddressesUsed": "9685",
        "totalOutputVolumeValue": "293820.1171",
        "averageNumberOfTransactionsPerBlock": "33"
    },
    {
        "month": "12",
        "day": "24",
        "year": "2011",
        "price": "3.9499",
        "totalCirculation": "7945850",
        "totalTransactionFees": "2.23895545",
        "numberOfUniqueBitcoinAddressesUsed": "7849",
        "totalOutputVolumeValue": "278028.5472",
        "averageNumberOfTransactionsPerBlock": "35"
    },
    {
        "month": "12",
        "day": "25",
        "year": "2011",
        "price": "4.3897",
        "totalCirculation": "7954550",
        "totalTransactionFees": "2.78505591",
        "numberOfUniqueBitcoinAddressesUsed": "8775",
        "totalOutputVolumeValue": "316815.8535",
        "averageNumberOfTransactionsPerBlock": "39"
    },
    {
        "month": "12",
        "day": "26",
        "year": "2011",
        "price": "4.31259",
        "totalCirculation": "7963150",
        "totalTransactionFees": "3.40552884",
        "numberOfUniqueBitcoinAddressesUsed": "9053",
        "totalOutputVolumeValue": "383673.9983",
        "averageNumberOfTransactionsPerBlock": "33"
    },
    {
        "month": "12",
        "day": "27",
        "year": "2011",
        "price": "4.06",
        "totalCirculation": "7971100",
        "totalTransactionFees": "2.76747331",
        "numberOfUniqueBitcoinAddressesUsed": "9312",
        "totalOutputVolumeValue": "982261.4209",
        "averageNumberOfTransactionsPerBlock": "30"
    },
    {
        "month": "12",
        "day": "28",
        "year": "2011",
        "price": "4.18888",
        "totalCirculation": "7978600",
        "totalTransactionFees": "3.33596172",
        "numberOfUniqueBitcoinAddressesUsed": "8289",
        "totalOutputVolumeValue": "326037.9592",
        "averageNumberOfTransactionsPerBlock": "38"
    },
    {
        "month": "12",
        "day": "29",
        "year": "2011",
        "price": "4.33",
        "totalCirculation": "7985600",
        "totalTransactionFees": "4.0354475",
        "numberOfUniqueBitcoinAddressesUsed": "8731",
        "totalOutputVolumeValue": "451570.1402",
        "averageNumberOfTransactionsPerBlock": "34"
    },
    {
        "month": "12",
        "day": "30",
        "year": "2011",
        "price": "4.3",
        "totalCirculation": "7992000",
        "totalTransactionFees": "3.52080887",
        "numberOfUniqueBitcoinAddressesUsed": "8353",
        "totalOutputVolumeValue": "337122.4893",
        "averageNumberOfTransactionsPerBlock": "36"
    },
    {
        "month": "12",
        "day": "31",
        "year": "2011",
        "price": "4.995",
        "totalCirculation": "8000050",
        "totalTransactionFees": "3.62038935",
        "numberOfUniqueBitcoinAddressesUsed": "8668",
        "totalOutputVolumeValue": "288894.5291",
        "averageNumberOfTransactionsPerBlock": "47"
    },
    {
        "month": "1",
        "day": "1",
        "year": "2012",
        "price": "5.2",
        "totalCirculation": "8007500",
        "totalTransactionFees": "3.22260941",
        "numberOfUniqueBitcoinAddressesUsed": "7701",
        "totalOutputVolumeValue": "303512.4084",
        "averageNumberOfTransactionsPerBlock": "37"
    },
    {
        "month": "1",
        "day": "2",
        "year": "2012",
        "price": "5.4999",
        "totalCirculation": "8015100",
        "totalTransactionFees": "5.2069139",
        "numberOfUniqueBitcoinAddressesUsed": "9669",
        "totalOutputVolumeValue": "295186.119",
        "averageNumberOfTransactionsPerBlock": "34"
    },
    {
        "month": "1",
        "day": "3",
        "year": "2012",
        "price": "5.29",
        "totalCirculation": "8023200",
        "totalTransactionFees": "5.78307056",
        "numberOfUniqueBitcoinAddressesUsed": "9207",
        "totalOutputVolumeValue": "244250.9376",
        "averageNumberOfTransactionsPerBlock": "39"
    },
    {
        "month": "1",
        "day": "4",
        "year": "2012",
        "price": "5.6063",
        "totalCirculation": "8030900",
        "totalTransactionFees": "14.21969541",
        "numberOfUniqueBitcoinAddressesUsed": "9255",
        "totalOutputVolumeValue": "338482.0051",
        "averageNumberOfTransactionsPerBlock": "37"
    },
    {
        "month": "1",
        "day": "5",
        "year": "2012",
        "price": "6.399",
        "totalCirculation": "8038250",
        "totalTransactionFees": "5.55023698",
        "numberOfUniqueBitcoinAddressesUsed": "11542",
        "totalOutputVolumeValue": "673601.0946",
        "averageNumberOfTransactionsPerBlock": "45"
    },
    {
        "month": "1",
        "day": "6",
        "year": "2012",
        "price": "7.22",
        "totalCirculation": "8046750",
        "totalTransactionFees": "6.65531797",
        "numberOfUniqueBitcoinAddressesUsed": "11043",
        "totalOutputVolumeValue": "622080.9943",
        "averageNumberOfTransactionsPerBlock": "47"
    },
    {
        "month": "1",
        "day": "7",
        "year": "2012",
        "price": "7.01556",
        "totalCirculation": "8055800",
        "totalTransactionFees": "4.83857232",
        "numberOfUniqueBitcoinAddressesUsed": "9902",
        "totalOutputVolumeValue": "393041.1115",
        "averageNumberOfTransactionsPerBlock": "41"
    },
    {
        "month": "1",
        "day": "8",
        "year": "2012",
        "price": "7.2",
        "totalCirculation": "8063850",
        "totalTransactionFees": "3.44381947",
        "numberOfUniqueBitcoinAddressesUsed": "10516",
        "totalOutputVolumeValue": "330587.8228",
        "averageNumberOfTransactionsPerBlock": "55"
    },
    {
        "month": "1",
        "day": "9",
        "year": "2012",
        "price": "7.2",
        "totalCirculation": "8071900",
        "totalTransactionFees": "6.16347974",
        "numberOfUniqueBitcoinAddressesUsed": "10229",
        "totalOutputVolumeValue": "442394.9516",
        "averageNumberOfTransactionsPerBlock": "42"
    },
    {
        "month": "1",
        "day": "10",
        "year": "2012",
        "price": "6.89",
        "totalCirculation": "8079200",
        "totalTransactionFees": "4.64067614",
        "numberOfUniqueBitcoinAddressesUsed": "11080",
        "totalOutputVolumeValue": "375302.0031",
        "averageNumberOfTransactionsPerBlock": "45"
    },
    {
        "month": "1",
        "day": "11",
        "year": "2012",
        "price": "7.138",
        "totalCirculation": "8086800",
        "totalTransactionFees": "5.17871126",
        "numberOfUniqueBitcoinAddressesUsed": "12031",
        "totalOutputVolumeValue": "451444.2657",
        "averageNumberOfTransactionsPerBlock": "42"
    },
    {
        "month": "1",
        "day": "12",
        "year": "2012",
        "price": "6.997",
        "totalCirculation": "8095100",
        "totalTransactionFees": "41.82887588",
        "numberOfUniqueBitcoinAddressesUsed": "11184",
        "totalOutputVolumeValue": "311617.9555",
        "averageNumberOfTransactionsPerBlock": "41"
    },
    {
        "month": "1",
        "day": "13",
        "year": "2012",
        "price": "6.85838999",
        "totalCirculation": "8101300",
        "totalTransactionFees": "9.94639858",
        "numberOfUniqueBitcoinAddressesUsed": "11096",
        "totalOutputVolumeValue": "439298.7146",
        "averageNumberOfTransactionsPerBlock": "50"
    },
    {
        "month": "1",
        "day": "14",
        "year": "2012",
        "price": "6.75",
        "totalCirculation": "8109300",
        "totalTransactionFees": "11.73821501",
        "numberOfUniqueBitcoinAddressesUsed": "10567",
        "totalOutputVolumeValue": "368949.3628",
        "averageNumberOfTransactionsPerBlock": "47"
    },
    {
        "month": "1",
        "day": "15",
        "year": "2012",
        "price": "6.98999",
        "totalCirculation": "8116700",
        "totalTransactionFees": "6.7042272",
        "numberOfUniqueBitcoinAddressesUsed": "11200",
        "totalOutputVolumeValue": "279850.6916",
        "averageNumberOfTransactionsPerBlock": "48"
    },
    {
        "month": "1",
        "day": "16",
        "year": "2012",
        "price": "7.18888",
        "totalCirculation": "8124600",
        "totalTransactionFees": "30.6769841",
        "numberOfUniqueBitcoinAddressesUsed": "11207",
        "totalOutputVolumeValue": "406064.2841",
        "averageNumberOfTransactionsPerBlock": "37"
    },
    {
        "month": "1",
        "day": "17",
        "year": "2012",
        "price": "6.98",
        "totalCirculation": "8132500",
        "totalTransactionFees": "23.16297162",
        "numberOfUniqueBitcoinAddressesUsed": "11033",
        "totalOutputVolumeValue": "398498.285",
        "averageNumberOfTransactionsPerBlock": "40"
    },
    {
        "month": "1",
        "day": "18",
        "year": "2012",
        "price": "6.95",
        "totalCirculation": "8139600",
        "totalTransactionFees": "11.20841262",
        "numberOfUniqueBitcoinAddressesUsed": "11962",
        "totalOutputVolumeValue": "448003.8016",
        "averageNumberOfTransactionsPerBlock": "34"
    },
    {
        "month": "1",
        "day": "19",
        "year": "2012",
        "price": "6.3",
        "totalCirculation": "8146400",
        "totalTransactionFees": "7.25502575",
        "numberOfUniqueBitcoinAddressesUsed": "10970",
        "totalOutputVolumeValue": "359155.5673",
        "averageNumberOfTransactionsPerBlock": "50"
    },
    {
        "month": "1",
        "day": "20",
        "year": "2012",
        "price": "6.58",
        "totalCirculation": "8153300",
        "totalTransactionFees": "43.74500914",
        "numberOfUniqueBitcoinAddressesUsed": "11045",
        "totalOutputVolumeValue": "391788.6849",
        "averageNumberOfTransactionsPerBlock": "51"
    },
    {
        "month": "1",
        "day": "21",
        "year": "2012",
        "price": "6.55",
        "totalCirculation": "8162250",
        "totalTransactionFees": "5.32543933",
        "numberOfUniqueBitcoinAddressesUsed": "10759",
        "totalOutputVolumeValue": "307719.9186",
        "averageNumberOfTransactionsPerBlock": "51"
    },
    {
        "month": "1",
        "day": "22",
        "year": "2012",
        "price": "6.39",
        "totalCirculation": "8168750",
        "totalTransactionFees": "3.21846767",
        "numberOfUniqueBitcoinAddressesUsed": "8918",
        "totalOutputVolumeValue": "303898.4064",
        "averageNumberOfTransactionsPerBlock": "47"
    },
    {
        "month": "1",
        "day": "23",
        "year": "2012",
        "price": "6.45485",
        "totalCirculation": "8177300",
        "totalTransactionFees": "4.32893996",
        "numberOfUniqueBitcoinAddressesUsed": "10161",
        "totalOutputVolumeValue": "287869.4625",
        "averageNumberOfTransactionsPerBlock": "39"
    },
    {
        "month": "1",
        "day": "24",
        "year": "2012",
        "price": "6.515",
        "totalCirculation": "8184050",
        "totalTransactionFees": "8.74090361",
        "numberOfUniqueBitcoinAddressesUsed": "11338",
        "totalOutputVolumeValue": "321695.2799",
        "averageNumberOfTransactionsPerBlock": "39"
    },
    {
        "month": "1",
        "day": "25",
        "year": "2012",
        "price": "6.45",
        "totalCirculation": "8191800",
        "totalTransactionFees": "7.51802097",
        "numberOfUniqueBitcoinAddressesUsed": "12942",
        "totalOutputVolumeValue": "410275.4737",
        "averageNumberOfTransactionsPerBlock": "36"
    },
    {
        "month": "1",
        "day": "26",
        "year": "2012",
        "price": "6.2",
        "totalCirculation": "8198300",
        "totalTransactionFees": "7.15324525",
        "numberOfUniqueBitcoinAddressesUsed": "11098",
        "totalOutputVolumeValue": "443244.8285",
        "averageNumberOfTransactionsPerBlock": "40"
    },
    {
        "month": "1",
        "day": "27",
        "year": "2012",
        "price": "5.689",
        "totalCirculation": "8205250",
        "totalTransactionFees": "21.44948903",
        "numberOfUniqueBitcoinAddressesUsed": "10852",
        "totalOutputVolumeValue": "388447.8812",
        "averageNumberOfTransactionsPerBlock": "51"
    },
    {
        "month": "1",
        "day": "28",
        "year": "2012",
        "price": "5.74815",
        "totalCirculation": "8213000",
        "totalTransactionFees": "6.21920755",
        "numberOfUniqueBitcoinAddressesUsed": "10498",
        "totalOutputVolumeValue": "272882.337",
        "averageNumberOfTransactionsPerBlock": "42"
    },
    {
        "month": "1",
        "day": "29",
        "year": "2012",
        "price": "5.76",
        "totalCirculation": "8221150",
        "totalTransactionFees": "221.2835515",
        "numberOfUniqueBitcoinAddressesUsed": "10772",
        "totalOutputVolumeValue": "328587.8401",
        "averageNumberOfTransactionsPerBlock": "43"
    },
    {
        "month": "1",
        "day": "30",
        "year": "2012",
        "price": "5.6",
        "totalCirculation": "8229450",
        "totalTransactionFees": "5.00811954",
        "numberOfUniqueBitcoinAddressesUsed": "10175",
        "totalOutputVolumeValue": "340079.4805",
        "averageNumberOfTransactionsPerBlock": "46"
    },
    {
        "month": "1",
        "day": "31",
        "year": "2012",
        "price": "5.65",
        "totalCirculation": "8237350",
        "totalTransactionFees": "27.76413677",
        "numberOfUniqueBitcoinAddressesUsed": "11376",
        "totalOutputVolumeValue": "319873.153",
        "averageNumberOfTransactionsPerBlock": "48"
    },
    {
        "month": "2",
        "day": "1",
        "year": "2012",
        "price": "5.638",
        "totalCirculation": "8244100",
        "totalTransactionFees": "7.67023534",
        "numberOfUniqueBitcoinAddressesUsed": "11855",
        "totalOutputVolumeValue": "413291.7832",
        "averageNumberOfTransactionsPerBlock": "43"
    },
    {
        "month": "2",
        "day": "2",
        "year": "2012",
        "price": "6.2",
        "totalCirculation": "8252250",
        "totalTransactionFees": "10.52551844",
        "numberOfUniqueBitcoinAddressesUsed": "12071",
        "totalOutputVolumeValue": "426235.6073",
        "averageNumberOfTransactionsPerBlock": "47"
    },
    {
        "month": "2",
        "day": "3",
        "year": "2012",
        "price": "6.148",
        "totalCirculation": "8260250",
        "totalTransactionFees": "7.14420136",
        "numberOfUniqueBitcoinAddressesUsed": "12407",
        "totalOutputVolumeValue": "365576.375",
        "averageNumberOfTransactionsPerBlock": "50"
    },
    {
        "month": "2",
        "day": "4",
        "year": "2012",
        "price": "6",
        "totalCirculation": "8268450",
        "totalTransactionFees": "8.85793127",
        "numberOfUniqueBitcoinAddressesUsed": "12959",
        "totalOutputVolumeValue": "398931.8412",
        "averageNumberOfTransactionsPerBlock": "50"
    },
    {
        "month": "2",
        "day": "5",
        "year": "2012",
        "price": "5.9625",
        "totalCirculation": "8275250",
        "totalTransactionFees": "4.45615015",
        "numberOfUniqueBitcoinAddressesUsed": "11232",
        "totalOutputVolumeValue": "347978.2079",
        "averageNumberOfTransactionsPerBlock": "58"
    },
    {
        "month": "2",
        "day": "6",
        "year": "2012",
        "price": "5.79",
        "totalCirculation": "8282650",
        "totalTransactionFees": "4.48191176",
        "numberOfUniqueBitcoinAddressesUsed": "10914",
        "totalOutputVolumeValue": "312114.6286",
        "averageNumberOfTransactionsPerBlock": "55"
    },
    {
        "month": "2",
        "day": "7",
        "year": "2012",
        "price": "5.70999",
        "totalCirculation": "8289800",
        "totalTransactionFees": "5.50077725",
        "numberOfUniqueBitcoinAddressesUsed": "10983",
        "totalOutputVolumeValue": "335635.5406",
        "averageNumberOfTransactionsPerBlock": "46"
    },
    {
        "month": "2",
        "day": "8",
        "year": "2012",
        "price": "5.8494",
        "totalCirculation": "8296400",
        "totalTransactionFees": "4.40704453",
        "numberOfUniqueBitcoinAddressesUsed": "11209",
        "totalOutputVolumeValue": "302182.0652",
        "averageNumberOfTransactionsPerBlock": "51"
    },
    {
        "month": "2",
        "day": "9",
        "year": "2012",
        "price": "5.8",
        "totalCirculation": "8303600",
        "totalTransactionFees": "5.95689282",
        "numberOfUniqueBitcoinAddressesUsed": "11806",
        "totalOutputVolumeValue": "275427.6779",
        "averageNumberOfTransactionsPerBlock": "71"
    },
    {
        "month": "2",
        "day": "10",
        "year": "2012",
        "price": "5.92525",
        "totalCirculation": "8310950",
        "totalTransactionFees": "7.26552646",
        "numberOfUniqueBitcoinAddressesUsed": "12310",
        "totalOutputVolumeValue": "300669.729",
        "averageNumberOfTransactionsPerBlock": "66"
    },
    {
        "month": "2",
        "day": "11",
        "year": "2012",
        "price": "6",
        "totalCirculation": "8317850",
        "totalTransactionFees": "4.07907004",
        "numberOfUniqueBitcoinAddressesUsed": "12079",
        "totalOutputVolumeValue": "364050.0796",
        "averageNumberOfTransactionsPerBlock": "71"
    },
    {
        "month": "2",
        "day": "12",
        "year": "2012",
        "price": "5.85",
        "totalCirculation": "8325850",
        "totalTransactionFees": "3.47829872",
        "numberOfUniqueBitcoinAddressesUsed": "11301",
        "totalOutputVolumeValue": "444742.9585",
        "averageNumberOfTransactionsPerBlock": "50"
    },
    {
        "month": "2",
        "day": "13",
        "year": "2012",
        "price": "5.72",
        "totalCirculation": "8333200",
        "totalTransactionFees": "4.81346772",
        "numberOfUniqueBitcoinAddressesUsed": "12245",
        "totalOutputVolumeValue": "336255.7438",
        "averageNumberOfTransactionsPerBlock": "38"
    },
    {
        "month": "2",
        "day": "14",
        "year": "2012",
        "price": "5.6",
        "totalCirculation": "8340000",
        "totalTransactionFees": "6.96051344",
        "numberOfUniqueBitcoinAddressesUsed": "14695",
        "totalOutputVolumeValue": "1272718.19",
        "averageNumberOfTransactionsPerBlock": "37"
    },
    {
        "month": "2",
        "day": "15",
        "year": "2012",
        "price": "4.88",
        "totalCirculation": "8347100",
        "totalTransactionFees": "15.26703072",
        "numberOfUniqueBitcoinAddressesUsed": "14215",
        "totalOutputVolumeValue": "1218761.589",
        "averageNumberOfTransactionsPerBlock": "41"
    },
    {
        "month": "2",
        "day": "16",
        "year": "2012",
        "price": "4.73368",
        "totalCirculation": "8353550",
        "totalTransactionFees": "9.73008108",
        "numberOfUniqueBitcoinAddressesUsed": "14299",
        "totalOutputVolumeValue": "1710441.061",
        "averageNumberOfTransactionsPerBlock": "49"
    },
    {
        "month": "2",
        "day": "17",
        "year": "2012",
        "price": "4.76998",
        "totalCirculation": "8360650",
        "totalTransactionFees": "3.53606055",
        "numberOfUniqueBitcoinAddressesUsed": "11991",
        "totalOutputVolumeValue": "1128149.138",
        "averageNumberOfTransactionsPerBlock": "45"
    },
    {
        "month": "2",
        "day": "18",
        "year": "2012",
        "price": "4.49675",
        "totalCirculation": "8369400",
        "totalTransactionFees": "3.79084356",
        "numberOfUniqueBitcoinAddressesUsed": "11605",
        "totalOutputVolumeValue": "668757.3795",
        "averageNumberOfTransactionsPerBlock": "46"
    },
    {
        "month": "2",
        "day": "19",
        "year": "2012",
        "price": "4.33333",
        "totalCirculation": "8377250",
        "totalTransactionFees": "2.44848079",
        "numberOfUniqueBitcoinAddressesUsed": "10536",
        "totalOutputVolumeValue": "471283.4859",
        "averageNumberOfTransactionsPerBlock": "49"
    },
    {
        "month": "2",
        "day": "20",
        "year": "2012",
        "price": "4.52",
        "totalCirculation": "8384550",
        "totalTransactionFees": "3.9273343",
        "numberOfUniqueBitcoinAddressesUsed": "10712",
        "totalOutputVolumeValue": "398966.3151",
        "averageNumberOfTransactionsPerBlock": "39"
    },
    {
        "month": "2",
        "day": "21",
        "year": "2012",
        "price": "4.4354",
        "totalCirculation": "8390950",
        "totalTransactionFees": "3.68499377",
        "numberOfUniqueBitcoinAddressesUsed": "11125",
        "totalOutputVolumeValue": "361327.0687",
        "averageNumberOfTransactionsPerBlock": "38"
    },
    {
        "month": "2",
        "day": "22",
        "year": "2012",
        "price": "4.54",
        "totalCirculation": "8398800",
        "totalTransactionFees": "3.3301254",
        "numberOfUniqueBitcoinAddressesUsed": "12333",
        "totalOutputVolumeValue": "628104.8527",
        "averageNumberOfTransactionsPerBlock": "40"
    },
    {
        "month": "2",
        "day": "23",
        "year": "2012",
        "price": "4.92481",
        "totalCirculation": "8407200",
        "totalTransactionFees": "4.19034459",
        "numberOfUniqueBitcoinAddressesUsed": "13080",
        "totalOutputVolumeValue": "810128.3647",
        "averageNumberOfTransactionsPerBlock": "44"
    },
    {
        "month": "2",
        "day": "24",
        "year": "2012",
        "price": "5.19778",
        "totalCirculation": "8414450",
        "totalTransactionFees": "4.33478143",
        "numberOfUniqueBitcoinAddressesUsed": "12673",
        "totalOutputVolumeValue": "587906.6797",
        "averageNumberOfTransactionsPerBlock": "36"
    },
    {
        "month": "2",
        "day": "25",
        "year": "2012",
        "price": "5.07",
        "totalCirculation": "8422800",
        "totalTransactionFees": "4.26574148",
        "numberOfUniqueBitcoinAddressesUsed": "11532",
        "totalOutputVolumeValue": "523252.1375",
        "averageNumberOfTransactionsPerBlock": "43"
    },
    {
        "month": "2",
        "day": "26",
        "year": "2012",
        "price": "5.00073",
        "totalCirculation": "8430400",
        "totalTransactionFees": "2.61240263",
        "numberOfUniqueBitcoinAddressesUsed": "10278",
        "totalOutputVolumeValue": "330484.6372",
        "averageNumberOfTransactionsPerBlock": "57"
    },
    {
        "month": "2",
        "day": "27",
        "year": "2012",
        "price": "5.1",
        "totalCirculation": "8438300",
        "totalTransactionFees": "4.78372398",
        "numberOfUniqueBitcoinAddressesUsed": "11131",
        "totalOutputVolumeValue": "362452.7583",
        "averageNumberOfTransactionsPerBlock": "47"
    },
    {
        "month": "2",
        "day": "28",
        "year": "2012",
        "price": "5",
        "totalCirculation": "8445800",
        "totalTransactionFees": "5.47527216",
        "numberOfUniqueBitcoinAddressesUsed": "11726",
        "totalOutputVolumeValue": "386149.3235",
        "averageNumberOfTransactionsPerBlock": "46"
    },
    {
        "month": "2",
        "day": "29",
        "year": "2012",
        "price": "4.9",
        "totalCirculation": "8455100",
        "totalTransactionFees": "3.15391449",
        "numberOfUniqueBitcoinAddressesUsed": "12087",
        "totalOutputVolumeValue": "342453.111",
        "averageNumberOfTransactionsPerBlock": "50"
    },
    {
        "month": "3",
        "day": "1",
        "year": "2012",
        "price": "4.98421",
        "totalCirculation": "8462900",
        "totalTransactionFees": "6.63650636",
        "numberOfUniqueBitcoinAddressesUsed": "12079",
        "totalOutputVolumeValue": "453115.7238",
        "averageNumberOfTransactionsPerBlock": "45"
    },
    {
        "month": "3",
        "day": "2",
        "year": "2012",
        "price": "4.98888",
        "totalCirculation": "8469550",
        "totalTransactionFees": "4.45115638",
        "numberOfUniqueBitcoinAddressesUsed": "13152",
        "totalOutputVolumeValue": "731389.3959",
        "averageNumberOfTransactionsPerBlock": "44"
    },
    {
        "month": "3",
        "day": "3",
        "year": "2012",
        "price": "4.77995",
        "totalCirculation": "8475500",
        "totalTransactionFees": "3.04970302",
        "numberOfUniqueBitcoinAddressesUsed": "10220",
        "totalOutputVolumeValue": "422063.1432",
        "averageNumberOfTransactionsPerBlock": "42"
    },
    {
        "month": "3",
        "day": "4",
        "year": "2012",
        "price": "4.9",
        "totalCirculation": "8482000",
        "totalTransactionFees": "3.95643698",
        "numberOfUniqueBitcoinAddressesUsed": "11319",
        "totalOutputVolumeValue": "630240.9675",
        "averageNumberOfTransactionsPerBlock": "39"
    },
    {
        "month": "3",
        "day": "5",
        "year": "2012",
        "price": "5.04",
        "totalCirculation": "8488600",
        "totalTransactionFees": "4.57778698",
        "numberOfUniqueBitcoinAddressesUsed": "12425",
        "totalOutputVolumeValue": "437601.3154",
        "averageNumberOfTransactionsPerBlock": "34"
    },
    {
        "month": "3",
        "day": "6",
        "year": "2012",
        "price": "5.05",
        "totalCirculation": "8496000",
        "totalTransactionFees": "4.77293119",
        "numberOfUniqueBitcoinAddressesUsed": "11913",
        "totalOutputVolumeValue": "360222.3106",
        "averageNumberOfTransactionsPerBlock": "38"
    },
    {
        "month": "3",
        "day": "7",
        "year": "2012",
        "price": "5.07",
        "totalCirculation": "8503450",
        "totalTransactionFees": "4.97452409",
        "numberOfUniqueBitcoinAddressesUsed": "11591",
        "totalOutputVolumeValue": "403618.0325",
        "averageNumberOfTransactionsPerBlock": "33"
    },
    {
        "month": "3",
        "day": "8",
        "year": "2012",
        "price": "5",
        "totalCirculation": "8511250",
        "totalTransactionFees": "4.28583196",
        "numberOfUniqueBitcoinAddressesUsed": "12250",
        "totalOutputVolumeValue": "413181.3558",
        "averageNumberOfTransactionsPerBlock": "44"
    },
    {
        "month": "3",
        "day": "9",
        "year": "2012",
        "price": "4.9499",
        "totalCirculation": "8519550",
        "totalTransactionFees": "3.56641541",
        "numberOfUniqueBitcoinAddressesUsed": "11826",
        "totalOutputVolumeValue": "605187.4507",
        "averageNumberOfTransactionsPerBlock": "51"
    },
    {
        "month": "3",
        "day": "10",
        "year": "2012",
        "price": "4.94",
        "totalCirculation": "8528200",
        "totalTransactionFees": "5.05300613",
        "numberOfUniqueBitcoinAddressesUsed": "10915",
        "totalOutputVolumeValue": "534069.0333",
        "averageNumberOfTransactionsPerBlock": "50"
    },
    {
        "month": "3",
        "day": "11",
        "year": "2012",
        "price": "4.99",
        "totalCirculation": "8534850",
        "totalTransactionFees": "3.07837341",
        "numberOfUniqueBitcoinAddressesUsed": "9925",
        "totalOutputVolumeValue": "352413.0264",
        "averageNumberOfTransactionsPerBlock": "46"
    },
    {
        "month": "3",
        "day": "12",
        "year": "2012",
        "price": "4.95915",
        "totalCirculation": "8543300",
        "totalTransactionFees": "3.51928212",
        "numberOfUniqueBitcoinAddressesUsed": "10385",
        "totalOutputVolumeValue": "523378.2952",
        "averageNumberOfTransactionsPerBlock": "43"
    },
    {
        "month": "3",
        "day": "13",
        "year": "2012",
        "price": "5.41",
        "totalCirculation": "8550900",
        "totalTransactionFees": "10.06316769",
        "numberOfUniqueBitcoinAddressesUsed": "12352",
        "totalOutputVolumeValue": "668177.8348",
        "averageNumberOfTransactionsPerBlock": "36"
    },
    {
        "month": "3",
        "day": "14",
        "year": "2012",
        "price": "5.4444",
        "totalCirculation": "8557800",
        "totalTransactionFees": "5.98762025",
        "numberOfUniqueBitcoinAddressesUsed": "12273",
        "totalOutputVolumeValue": "460298.9102",
        "averageNumberOfTransactionsPerBlock": "42"
    },
    {
        "month": "3",
        "day": "15",
        "year": "2012",
        "price": "5.45",
        "totalCirculation": "8564250",
        "totalTransactionFees": "4.16277495",
        "numberOfUniqueBitcoinAddressesUsed": "12046",
        "totalOutputVolumeValue": "624033.8155",
        "averageNumberOfTransactionsPerBlock": "44"
    },
    {
        "month": "3",
        "day": "16",
        "year": "2012",
        "price": "5.4",
        "totalCirculation": "8571400",
        "totalTransactionFees": "7.96536218",
        "numberOfUniqueBitcoinAddressesUsed": "11928",
        "totalOutputVolumeValue": "492599.6538",
        "averageNumberOfTransactionsPerBlock": "43"
    },
    {
        "month": "3",
        "day": "17",
        "year": "2012",
        "price": "5.3998",
        "totalCirculation": "8580000",
        "totalTransactionFees": "4.23269898",
        "numberOfUniqueBitcoinAddressesUsed": "13116",
        "totalOutputVolumeValue": "506495.4969",
        "averageNumberOfTransactionsPerBlock": "43"
    },
    {
        "month": "3",
        "day": "18",
        "year": "2012",
        "price": "5.37998",
        "totalCirculation": "8587800",
        "totalTransactionFees": "3.01294827",
        "numberOfUniqueBitcoinAddressesUsed": "10606",
        "totalOutputVolumeValue": "403515.814",
        "averageNumberOfTransactionsPerBlock": "48"
    },
    {
        "month": "3",
        "day": "19",
        "year": "2012",
        "price": "5.3099",
        "totalCirculation": "8595700",
        "totalTransactionFees": "4.23856313",
        "numberOfUniqueBitcoinAddressesUsed": "11743",
        "totalOutputVolumeValue": "358260.2845",
        "averageNumberOfTransactionsPerBlock": "37"
    },
    {
        "month": "3",
        "day": "20",
        "year": "2012",
        "price": "4.98",
        "totalCirculation": "8603100",
        "totalTransactionFees": "4.28587033",
        "numberOfUniqueBitcoinAddressesUsed": "11698",
        "totalOutputVolumeValue": "496018.0404",
        "averageNumberOfTransactionsPerBlock": "37"
    },
    {
        "month": "3",
        "day": "21",
        "year": "2012",
        "price": "4.87",
        "totalCirculation": "8611200",
        "totalTransactionFees": "4.19889868",
        "numberOfUniqueBitcoinAddressesUsed": "12291",
        "totalOutputVolumeValue": "547823.2579",
        "averageNumberOfTransactionsPerBlock": "42"
    },
    {
        "month": "3",
        "day": "22",
        "year": "2012",
        "price": "4.88",
        "totalCirculation": "8619000",
        "totalTransactionFees": "3.31425094",
        "numberOfUniqueBitcoinAddressesUsed": "12360",
        "totalOutputVolumeValue": "640130.2212",
        "averageNumberOfTransactionsPerBlock": "42"
    },
    {
        "month": "3",
        "day": "23",
        "year": "2012",
        "price": "4.83",
        "totalCirculation": "8625500",
        "totalTransactionFees": "3.85590401",
        "numberOfUniqueBitcoinAddressesUsed": "10829",
        "totalOutputVolumeValue": "931256.2746",
        "averageNumberOfTransactionsPerBlock": "44"
    },
    {
        "month": "3",
        "day": "24",
        "year": "2012",
        "price": "4.74896",
        "totalCirculation": "8634100",
        "totalTransactionFees": "4.46816675",
        "numberOfUniqueBitcoinAddressesUsed": "11385",
        "totalOutputVolumeValue": "893589.0336",
        "averageNumberOfTransactionsPerBlock": "54"
    },
    {
        "month": "3",
        "day": "25",
        "year": "2012",
        "price": "4.68294",
        "totalCirculation": "8642450",
        "totalTransactionFees": "13.87452827",
        "numberOfUniqueBitcoinAddressesUsed": "10821",
        "totalOutputVolumeValue": "522493.1744",
        "averageNumberOfTransactionsPerBlock": "47"
    },
    {
        "month": "3",
        "day": "26",
        "year": "2012",
        "price": "4.73793",
        "totalCirculation": "8650050",
        "totalTransactionFees": "7.26561565",
        "numberOfUniqueBitcoinAddressesUsed": "11226",
        "totalOutputVolumeValue": "423096.0241",
        "averageNumberOfTransactionsPerBlock": "38"
    },
    {
        "month": "3",
        "day": "27",
        "year": "2012",
        "price": "4.74",
        "totalCirculation": "8657450",
        "totalTransactionFees": "3.94960465",
        "numberOfUniqueBitcoinAddressesUsed": "11432",
        "totalOutputVolumeValue": "600916.9953",
        "averageNumberOfTransactionsPerBlock": "37"
    },
    {
        "month": "3",
        "day": "28",
        "year": "2012",
        "price": "4.84592",
        "totalCirculation": "8665400",
        "totalTransactionFees": "4.67877081",
        "numberOfUniqueBitcoinAddressesUsed": "12371",
        "totalOutputVolumeValue": "693995.0947",
        "averageNumberOfTransactionsPerBlock": "47"
    },
    {
        "month": "3",
        "day": "29",
        "year": "2012",
        "price": "4.86092",
        "totalCirculation": "8672350",
        "totalTransactionFees": "4.69239431",
        "numberOfUniqueBitcoinAddressesUsed": "12719",
        "totalOutputVolumeValue": "1067404.03",
        "averageNumberOfTransactionsPerBlock": "58"
    },
    {
        "month": "3",
        "day": "30",
        "year": "2012",
        "price": "4.83",
        "totalCirculation": "8679850",
        "totalTransactionFees": "4.04466777",
        "numberOfUniqueBitcoinAddressesUsed": "12480",
        "totalOutputVolumeValue": "1093096.442",
        "averageNumberOfTransactionsPerBlock": "53"
    },
    {
        "month": "3",
        "day": "31",
        "year": "2012",
        "price": "4.95",
        "totalCirculation": "8688000",
        "totalTransactionFees": "4.66025176",
        "numberOfUniqueBitcoinAddressesUsed": "11040",
        "totalOutputVolumeValue": "958244.8474",
        "averageNumberOfTransactionsPerBlock": "58"
    },
    {
        "month": "4",
        "day": "1",
        "year": "2012",
        "price": "4.929",
        "totalCirculation": "8695500",
        "totalTransactionFees": "4.34212197",
        "numberOfUniqueBitcoinAddressesUsed": "9586",
        "totalOutputVolumeValue": "469525.437",
        "averageNumberOfTransactionsPerBlock": "56"
    },
    {
        "month": "4",
        "day": "2",
        "year": "2012",
        "price": "5.08",
        "totalCirculation": "8701850",
        "totalTransactionFees": "4.14115894",
        "numberOfUniqueBitcoinAddressesUsed": "10766",
        "totalOutputVolumeValue": "810177.5886",
        "averageNumberOfTransactionsPerBlock": "46"
    },
    {
        "month": "4",
        "day": "3",
        "year": "2012",
        "price": "5.01",
        "totalCirculation": "8708250",
        "totalTransactionFees": "4.62668219",
        "numberOfUniqueBitcoinAddressesUsed": "13073",
        "totalOutputVolumeValue": "759655.1403",
        "averageNumberOfTransactionsPerBlock": "41"
    },
    {
        "month": "4",
        "day": "4",
        "year": "2012",
        "price": "4.97",
        "totalCirculation": "8715300",
        "totalTransactionFees": "3.95271361",
        "numberOfUniqueBitcoinAddressesUsed": "12774",
        "totalOutputVolumeValue": "751035.768",
        "averageNumberOfTransactionsPerBlock": "40"
    },
    {
        "month": "4",
        "day": "5",
        "year": "2012",
        "price": "4.94486",
        "totalCirculation": "8721250",
        "totalTransactionFees": "6.2116662",
        "numberOfUniqueBitcoinAddressesUsed": "11946",
        "totalOutputVolumeValue": "1026300.846",
        "averageNumberOfTransactionsPerBlock": "58"
    },
    {
        "month": "4",
        "day": "6",
        "year": "2012",
        "price": "4.96",
        "totalCirculation": "8727400",
        "totalTransactionFees": "4.94414079",
        "numberOfUniqueBitcoinAddressesUsed": "12300",
        "totalOutputVolumeValue": "602873.7248",
        "averageNumberOfTransactionsPerBlock": "52"
    },
    {
        "month": "4",
        "day": "7",
        "year": "2012",
        "price": "4.98",
        "totalCirculation": "8734000",
        "totalTransactionFees": "3.89581731",
        "numberOfUniqueBitcoinAddressesUsed": "11003",
        "totalOutputVolumeValue": "407210.8655",
        "averageNumberOfTransactionsPerBlock": "61"
    },
    {
        "month": "4",
        "day": "8",
        "year": "2012",
        "price": "4.8",
        "totalCirculation": "8741300",
        "totalTransactionFees": "3.8064745",
        "numberOfUniqueBitcoinAddressesUsed": "10863",
        "totalOutputVolumeValue": "879113.6781",
        "averageNumberOfTransactionsPerBlock": "59"
    },
    {
        "month": "4",
        "day": "9",
        "year": "2012",
        "price": "4.8",
        "totalCirculation": "8748850",
        "totalTransactionFees": "3.83316764",
        "numberOfUniqueBitcoinAddressesUsed": "10799",
        "totalOutputVolumeValue": "1580081.103",
        "averageNumberOfTransactionsPerBlock": "59"
    },
    {
        "month": "4",
        "day": "10",
        "year": "2012",
        "price": "4.9",
        "totalCirculation": "8756000",
        "totalTransactionFees": "4.69114701",
        "numberOfUniqueBitcoinAddressesUsed": "13688",
        "totalOutputVolumeValue": "1168453.422",
        "averageNumberOfTransactionsPerBlock": "62"
    },
    {
        "month": "4",
        "day": "11",
        "year": "2012",
        "price": "4.8941",
        "totalCirculation": "8763150",
        "totalTransactionFees": "6.53992391",
        "numberOfUniqueBitcoinAddressesUsed": "13265",
        "totalOutputVolumeValue": "1113398.834",
        "averageNumberOfTransactionsPerBlock": "58"
    },
    {
        "month": "4",
        "day": "12",
        "year": "2012",
        "price": "4.98",
        "totalCirculation": "8770050",
        "totalTransactionFees": "6.96030524",
        "numberOfUniqueBitcoinAddressesUsed": "14415",
        "totalOutputVolumeValue": "1625269.808",
        "averageNumberOfTransactionsPerBlock": "58"
    },
    {
        "month": "4",
        "day": "13",
        "year": "2012",
        "price": "4.94464",
        "totalCirculation": "8776350",
        "totalTransactionFees": "4.42240979",
        "numberOfUniqueBitcoinAddressesUsed": "12853",
        "totalOutputVolumeValue": "944297.8376",
        "averageNumberOfTransactionsPerBlock": "66"
    },
    {
        "month": "4",
        "day": "14",
        "year": "2012",
        "price": "5.03",
        "totalCirculation": "8783000",
        "totalTransactionFees": "5.88161612",
        "numberOfUniqueBitcoinAddressesUsed": "13306",
        "totalOutputVolumeValue": "811725.6219",
        "averageNumberOfTransactionsPerBlock": "51"
    },
    {
        "month": "4",
        "day": "15",
        "year": "2012",
        "price": "4.98389",
        "totalCirculation": "8788850",
        "totalTransactionFees": "4.03081438",
        "numberOfUniqueBitcoinAddressesUsed": "12285",
        "totalOutputVolumeValue": "1329795.842",
        "averageNumberOfTransactionsPerBlock": "51"
    },
    {
        "month": "4",
        "day": "16",
        "year": "2012",
        "price": "4.98",
        "totalCirculation": "8795500",
        "totalTransactionFees": "4.67124833",
        "numberOfUniqueBitcoinAddressesUsed": "13624",
        "totalOutputVolumeValue": "1516544.526",
        "averageNumberOfTransactionsPerBlock": "52"
    },
    {
        "month": "4",
        "day": "17",
        "year": "2012",
        "price": "5.02207",
        "totalCirculation": "8802600",
        "totalTransactionFees": "7.52707743",
        "numberOfUniqueBitcoinAddressesUsed": "14357",
        "totalOutputVolumeValue": "1161251.579",
        "averageNumberOfTransactionsPerBlock": "45"
    },
    {
        "month": "4",
        "day": "18",
        "year": "2012",
        "price": "5.1782",
        "totalCirculation": "8808700",
        "totalTransactionFees": "5.87363778",
        "numberOfUniqueBitcoinAddressesUsed": "13860",
        "totalOutputVolumeValue": "1158712.007",
        "averageNumberOfTransactionsPerBlock": "46"
    },
    {
        "month": "4",
        "day": "19",
        "year": "2012",
        "price": "5.19",
        "totalCirculation": "8816500",
        "totalTransactionFees": "5.94767942",
        "numberOfUniqueBitcoinAddressesUsed": "13885",
        "totalOutputVolumeValue": "739373.6324",
        "averageNumberOfTransactionsPerBlock": "60"
    },
    {
        "month": "4",
        "day": "20",
        "year": "2012",
        "price": "5.17",
        "totalCirculation": "8824250",
        "totalTransactionFees": "6.07277319",
        "numberOfUniqueBitcoinAddressesUsed": "13626",
        "totalOutputVolumeValue": "2411391.363",
        "averageNumberOfTransactionsPerBlock": "56"
    },
    {
        "month": "4",
        "day": "21",
        "year": "2012",
        "price": "5.48",
        "totalCirculation": "8831600",
        "totalTransactionFees": "6.263791",
        "numberOfUniqueBitcoinAddressesUsed": "14018",
        "totalOutputVolumeValue": "1486036.532",
        "averageNumberOfTransactionsPerBlock": "65"
    },
    {
        "month": "4",
        "day": "22",
        "year": "2012",
        "price": "5.3287",
        "totalCirculation": "8839050",
        "totalTransactionFees": "5.15564775",
        "numberOfUniqueBitcoinAddressesUsed": "11561",
        "totalOutputVolumeValue": "1150690.449",
        "averageNumberOfTransactionsPerBlock": "56"
    },
    {
        "month": "4",
        "day": "23",
        "year": "2012",
        "price": "5.21799",
        "totalCirculation": "8846450",
        "totalTransactionFees": "4.34820541",
        "numberOfUniqueBitcoinAddressesUsed": "12471",
        "totalOutputVolumeValue": "774046.0598",
        "averageNumberOfTransactionsPerBlock": "45"
    },
    {
        "month": "4",
        "day": "24",
        "year": "2012",
        "price": "5.2",
        "totalCirculation": "8852600",
        "totalTransactionFees": "5.43974157",
        "numberOfUniqueBitcoinAddressesUsed": "12541",
        "totalOutputVolumeValue": "800438.0474",
        "averageNumberOfTransactionsPerBlock": "48"
    },
    {
        "month": "4",
        "day": "25",
        "year": "2012",
        "price": "5.16",
        "totalCirculation": "8859500",
        "totalTransactionFees": "5.27822828",
        "numberOfUniqueBitcoinAddressesUsed": "13879",
        "totalOutputVolumeValue": "748268.5992",
        "averageNumberOfTransactionsPerBlock": "53"
    },
    {
        "month": "4",
        "day": "26",
        "year": "2012",
        "price": "5.18",
        "totalCirculation": "8867200",
        "totalTransactionFees": "13.33086106",
        "numberOfUniqueBitcoinAddressesUsed": "14567",
        "totalOutputVolumeValue": "2031001.035",
        "averageNumberOfTransactionsPerBlock": "56"
    },
    {
        "month": "4",
        "day": "27",
        "year": "2012",
        "price": "5.1372",
        "totalCirculation": "8873500",
        "totalTransactionFees": "6.9636861",
        "numberOfUniqueBitcoinAddressesUsed": "12887",
        "totalOutputVolumeValue": "1334928.651",
        "averageNumberOfTransactionsPerBlock": "60"
    },
    {
        "month": "4",
        "day": "28",
        "year": "2012",
        "price": "5.1176",
        "totalCirculation": "8881300",
        "totalTransactionFees": "5.3321923",
        "numberOfUniqueBitcoinAddressesUsed": "12306",
        "totalOutputVolumeValue": "1042504.462",
        "averageNumberOfTransactionsPerBlock": "73"
    },
    {
        "month": "4",
        "day": "29",
        "year": "2012",
        "price": "5.0184",
        "totalCirculation": "8889600",
        "totalTransactionFees": "5.79655728",
        "numberOfUniqueBitcoinAddressesUsed": "12863",
        "totalOutputVolumeValue": "970611.9482",
        "averageNumberOfTransactionsPerBlock": "92"
    },
    {
        "month": "4",
        "day": "30",
        "year": "2012",
        "price": "5",
        "totalCirculation": "8898050",
        "totalTransactionFees": "4.96371671",
        "numberOfUniqueBitcoinAddressesUsed": "14525",
        "totalOutputVolumeValue": "1191280.939",
        "averageNumberOfTransactionsPerBlock": "87"
    },
    {
        "month": "5",
        "day": "1",
        "year": "2012",
        "price": "5",
        "totalCirculation": "8907000",
        "totalTransactionFees": "6.49137637",
        "numberOfUniqueBitcoinAddressesUsed": "15610",
        "totalOutputVolumeValue": "995623.201",
        "averageNumberOfTransactionsPerBlock": "72"
    },
    {
        "month": "5",
        "day": "2",
        "year": "2012",
        "price": "5.1789",
        "totalCirculation": "8914700",
        "totalTransactionFees": "6.68304753",
        "numberOfUniqueBitcoinAddressesUsed": "14824",
        "totalOutputVolumeValue": "1093624.152",
        "averageNumberOfTransactionsPerBlock": "95"
    },
    {
        "month": "5",
        "day": "3",
        "year": "2012",
        "price": "5.184",
        "totalCirculation": "8923000",
        "totalTransactionFees": "8.49677544",
        "numberOfUniqueBitcoinAddressesUsed": "17151",
        "totalOutputVolumeValue": "1118696.164",
        "averageNumberOfTransactionsPerBlock": "92"
    },
    {
        "month": "5",
        "day": "4",
        "year": "2012",
        "price": "5.15",
        "totalCirculation": "8930750",
        "totalTransactionFees": "10.52965254",
        "numberOfUniqueBitcoinAddressesUsed": "17877",
        "totalOutputVolumeValue": "1168190.544",
        "averageNumberOfTransactionsPerBlock": "115"
    },
    {
        "month": "5",
        "day": "5",
        "year": "2012",
        "price": "5.1495",
        "totalCirculation": "8938550",
        "totalTransactionFees": "9.92443083",
        "numberOfUniqueBitcoinAddressesUsed": "16679",
        "totalOutputVolumeValue": "1089067.706",
        "averageNumberOfTransactionsPerBlock": "88"
    },
    {
        "month": "5",
        "day": "6",
        "year": "2012",
        "price": "5.099",
        "totalCirculation": "8947150",
        "totalTransactionFees": "8.47898308",
        "numberOfUniqueBitcoinAddressesUsed": "15598",
        "totalOutputVolumeValue": "942031.3411",
        "averageNumberOfTransactionsPerBlock": "115"
    },
    {
        "month": "5",
        "day": "7",
        "year": "2012",
        "price": "5.0947",
        "totalCirculation": "8955700",
        "totalTransactionFees": "10.57768272",
        "numberOfUniqueBitcoinAddressesUsed": "19235",
        "totalOutputVolumeValue": "1360550.692",
        "averageNumberOfTransactionsPerBlock": "160"
    },
    {
        "month": "5",
        "day": "8",
        "year": "2012",
        "price": "5.1",
        "totalCirculation": "8965000",
        "totalTransactionFees": "12.78385726",
        "numberOfUniqueBitcoinAddressesUsed": "19674",
        "totalOutputVolumeValue": "4235212.547",
        "averageNumberOfTransactionsPerBlock": "106"
    },
    {
        "month": "5",
        "day": "9",
        "year": "2012",
        "price": "5.09609",
        "totalCirculation": "8973200",
        "totalTransactionFees": "14.96129097",
        "numberOfUniqueBitcoinAddressesUsed": "20332",
        "totalOutputVolumeValue": "2567050.111",
        "averageNumberOfTransactionsPerBlock": "195"
    },
    {
        "month": "5",
        "day": "10",
        "year": "2012",
        "price": "5.125",
        "totalCirculation": "8980400",
        "totalTransactionFees": "9.90617607",
        "numberOfUniqueBitcoinAddressesUsed": "17330",
        "totalOutputVolumeValue": "1264003.508",
        "averageNumberOfTransactionsPerBlock": "158"
    },
    {
        "month": "5",
        "day": "11",
        "year": "2012",
        "price": "5.03188",
        "totalCirculation": "8986550",
        "totalTransactionFees": "10.00517341",
        "numberOfUniqueBitcoinAddressesUsed": "17977",
        "totalOutputVolumeValue": "1126846.07",
        "averageNumberOfTransactionsPerBlock": "175"
    },
    {
        "month": "5",
        "day": "12",
        "year": "2012",
        "price": "5",
        "totalCirculation": "8993400",
        "totalTransactionFees": "12.89572253",
        "numberOfUniqueBitcoinAddressesUsed": "21047",
        "totalOutputVolumeValue": "3086157.901",
        "averageNumberOfTransactionsPerBlock": "126"
    },
    {
        "month": "5",
        "day": "13",
        "year": "2012",
        "price": "4.99888",
        "totalCirculation": "9000000",
        "totalTransactionFees": "10.1650517",
        "numberOfUniqueBitcoinAddressesUsed": "16837",
        "totalOutputVolumeValue": "2235581.966",
        "averageNumberOfTransactionsPerBlock": "151"
    },
    {
        "month": "5",
        "day": "14",
        "year": "2012",
        "price": "5.036",
        "totalCirculation": "9007150",
        "totalTransactionFees": "28.27673306",
        "numberOfUniqueBitcoinAddressesUsed": "26853",
        "totalOutputVolumeValue": "2062283.748",
        "averageNumberOfTransactionsPerBlock": "261"
    },
    {
        "month": "5",
        "day": "15",
        "year": "2012",
        "price": "5.09",
        "totalCirculation": "9013700",
        "totalTransactionFees": "19.59848847",
        "numberOfUniqueBitcoinAddressesUsed": "22051",
        "totalOutputVolumeValue": "2979362.456",
        "averageNumberOfTransactionsPerBlock": "234"
    },
    {
        "month": "5",
        "day": "16",
        "year": "2012",
        "price": "5.08998",
        "totalCirculation": "9019300",
        "totalTransactionFees": "13.98413588",
        "numberOfUniqueBitcoinAddressesUsed": "20909",
        "totalOutputVolumeValue": "3967466.929",
        "averageNumberOfTransactionsPerBlock": "220"
    },
    {
        "month": "5",
        "day": "17",
        "year": "2012",
        "price": "5.1345",
        "totalCirculation": "9025200",
        "totalTransactionFees": "10.10983418",
        "numberOfUniqueBitcoinAddressesUsed": "17048",
        "totalOutputVolumeValue": "3303219.434",
        "averageNumberOfTransactionsPerBlock": "216"
    },
    {
        "month": "5",
        "day": "18",
        "year": "2012",
        "price": "5.13",
        "totalCirculation": "9032400",
        "totalTransactionFees": "15.75663471",
        "numberOfUniqueBitcoinAddressesUsed": "20911",
        "totalOutputVolumeValue": "2258449.065",
        "averageNumberOfTransactionsPerBlock": "221"
    },
    {
        "month": "5",
        "day": "19",
        "year": "2012",
        "price": "5.14291",
        "totalCirculation": "9039700",
        "totalTransactionFees": "33.30233593",
        "numberOfUniqueBitcoinAddressesUsed": "28460",
        "totalOutputVolumeValue": "1338498.238",
        "averageNumberOfTransactionsPerBlock": "192"
    },
    {
        "month": "5",
        "day": "20",
        "year": "2012",
        "price": "5.15",
        "totalCirculation": "9046800",
        "totalTransactionFees": "22.03784271",
        "numberOfUniqueBitcoinAddressesUsed": "25560",
        "totalOutputVolumeValue": "1038377.366",
        "averageNumberOfTransactionsPerBlock": "250"
    },
    {
        "month": "5",
        "day": "21",
        "year": "2012",
        "price": "5.1475",
        "totalCirculation": "9053400",
        "totalTransactionFees": "18.00690588",
        "numberOfUniqueBitcoinAddressesUsed": "23727",
        "totalOutputVolumeValue": "3722513.265",
        "averageNumberOfTransactionsPerBlock": "177"
    },
    {
        "month": "5",
        "day": "22",
        "year": "2012",
        "price": "5.12",
        "totalCirculation": "9059250",
        "totalTransactionFees": "14.48193745",
        "numberOfUniqueBitcoinAddressesUsed": "22830",
        "totalOutputVolumeValue": "4585990.256",
        "averageNumberOfTransactionsPerBlock": "135"
    },
    {
        "month": "5",
        "day": "23",
        "year": "2012",
        "price": "5.16",
        "totalCirculation": "9065300",
        "totalTransactionFees": "16.09408162",
        "numberOfUniqueBitcoinAddressesUsed": "23849",
        "totalOutputVolumeValue": "2395544.217",
        "averageNumberOfTransactionsPerBlock": "235"
    },
    {
        "month": "5",
        "day": "24",
        "year": "2012",
        "price": "5.2324",
        "totalCirculation": "9072050",
        "totalTransactionFees": "20.59204355",
        "numberOfUniqueBitcoinAddressesUsed": "22814",
        "totalOutputVolumeValue": "1187257.425",
        "averageNumberOfTransactionsPerBlock": "229"
    },
    {
        "month": "5",
        "day": "25",
        "year": "2012",
        "price": "5.15",
        "totalCirculation": "9077850",
        "totalTransactionFees": "19.10534085",
        "numberOfUniqueBitcoinAddressesUsed": "24436",
        "totalOutputVolumeValue": "1416401.316",
        "averageNumberOfTransactionsPerBlock": "214"
    },
    {
        "month": "5",
        "day": "26",
        "year": "2012",
        "price": "5.149",
        "totalCirculation": "9084600",
        "totalTransactionFees": "16.87447099",
        "numberOfUniqueBitcoinAddressesUsed": "21295",
        "totalOutputVolumeValue": "5219577.842",
        "averageNumberOfTransactionsPerBlock": "143"
    },
    {
        "month": "5",
        "day": "27",
        "year": "2012",
        "price": "5.148",
        "totalCirculation": "9092800",
        "totalTransactionFees": "15.29363421",
        "numberOfUniqueBitcoinAddressesUsed": "19795",
        "totalOutputVolumeValue": "2082024.364",
        "averageNumberOfTransactionsPerBlock": "163"
    },
    {
        "month": "5",
        "day": "28",
        "year": "2012",
        "price": "5.16",
        "totalCirculation": "9099700",
        "totalTransactionFees": "20.21974674",
        "numberOfUniqueBitcoinAddressesUsed": "24424",
        "totalOutputVolumeValue": "2433082.741",
        "averageNumberOfTransactionsPerBlock": "119"
    },
    {
        "month": "5",
        "day": "29",
        "year": "2012",
        "price": "5.15889",
        "totalCirculation": "9106500",
        "totalTransactionFees": "18.96538173",
        "numberOfUniqueBitcoinAddressesUsed": "26445",
        "totalOutputVolumeValue": "3153174.673",
        "averageNumberOfTransactionsPerBlock": "168"
    },
    {
        "month": "5",
        "day": "30",
        "year": "2012",
        "price": "5.1725",
        "totalCirculation": "9112500",
        "totalTransactionFees": "16.86572549",
        "numberOfUniqueBitcoinAddressesUsed": "23184",
        "totalOutputVolumeValue": "1873294.866",
        "averageNumberOfTransactionsPerBlock": "297"
    },
    {
        "month": "5",
        "day": "31",
        "year": "2012",
        "price": "5.19",
        "totalCirculation": "9119800",
        "totalTransactionFees": "13.60278435",
        "numberOfUniqueBitcoinAddressesUsed": "21952",
        "totalOutputVolumeValue": "4812129.309",
        "averageNumberOfTransactionsPerBlock": "333"
    },
    {
        "month": "6",
        "day": "1",
        "year": "2012",
        "price": "5.27",
        "totalCirculation": "9127350",
        "totalTransactionFees": "15.68116299",
        "numberOfUniqueBitcoinAddressesUsed": "23238",
        "totalOutputVolumeValue": "3223156.245",
        "averageNumberOfTransactionsPerBlock": "108"
    },
    {
        "month": "6",
        "day": "2",
        "year": "2012",
        "price": "5.279",
        "totalCirculation": "9135150",
        "totalTransactionFees": "9.96264787",
        "numberOfUniqueBitcoinAddressesUsed": "18762",
        "totalOutputVolumeValue": "2387134.36",
        "averageNumberOfTransactionsPerBlock": "242"
    },
    {
        "month": "6",
        "day": "3",
        "year": "2012",
        "price": "5.26466",
        "totalCirculation": "9143050",
        "totalTransactionFees": "15.02353311",
        "numberOfUniqueBitcoinAddressesUsed": "22565",
        "totalOutputVolumeValue": "1609492.547",
        "averageNumberOfTransactionsPerBlock": "182"
    },
    {
        "month": "6",
        "day": "4",
        "year": "2012",
        "price": "5.2785",
        "totalCirculation": "9150600",
        "totalTransactionFees": "28.12443169",
        "numberOfUniqueBitcoinAddressesUsed": "32189",
        "totalOutputVolumeValue": "3521172.509",
        "averageNumberOfTransactionsPerBlock": "188"
    },
    {
        "month": "6",
        "day": "5",
        "year": "2012",
        "price": "5.5",
        "totalCirculation": "9157400",
        "totalTransactionFees": "29.98382458",
        "numberOfUniqueBitcoinAddressesUsed": "34449",
        "totalOutputVolumeValue": "5317556.456",
        "averageNumberOfTransactionsPerBlock": "231"
    },
    {
        "month": "6",
        "day": "6",
        "year": "2012",
        "price": "5.47",
        "totalCirculation": "9165850",
        "totalTransactionFees": "13.28754541",
        "numberOfUniqueBitcoinAddressesUsed": "20500",
        "totalOutputVolumeValue": "2751676.412",
        "averageNumberOfTransactionsPerBlock": "229"
    },
    {
        "month": "6",
        "day": "7",
        "year": "2012",
        "price": "5.529",
        "totalCirculation": "9172150",
        "totalTransactionFees": "20.49586485",
        "numberOfUniqueBitcoinAddressesUsed": "26044",
        "totalOutputVolumeValue": "4158245.014",
        "averageNumberOfTransactionsPerBlock": "148"
    },
    {
        "month": "6",
        "day": "8",
        "year": "2012",
        "price": "5.66",
        "totalCirculation": "9179550",
        "totalTransactionFees": "16.81802928",
        "numberOfUniqueBitcoinAddressesUsed": "23625",
        "totalOutputVolumeValue": "6042248.698",
        "averageNumberOfTransactionsPerBlock": "321"
    },
    {
        "month": "6",
        "day": "9",
        "year": "2012",
        "price": "5.69999",
        "totalCirculation": "9187900",
        "totalTransactionFees": "22.52987299",
        "numberOfUniqueBitcoinAddressesUsed": "24654",
        "totalOutputVolumeValue": "1867311.942",
        "averageNumberOfTransactionsPerBlock": "390"
    },
    {
        "month": "6",
        "day": "10",
        "year": "2012",
        "price": "5.62",
        "totalCirculation": "9196400",
        "totalTransactionFees": "24.41006786",
        "numberOfUniqueBitcoinAddressesUsed": "26535",
        "totalOutputVolumeValue": "1644528.245",
        "averageNumberOfTransactionsPerBlock": "361"
    },
    {
        "month": "6",
        "day": "11",
        "year": "2012",
        "price": "5.54545",
        "totalCirculation": "9204100",
        "totalTransactionFees": "20.67463329",
        "numberOfUniqueBitcoinAddressesUsed": "27456",
        "totalOutputVolumeValue": "4066159.985",
        "averageNumberOfTransactionsPerBlock": "308"
    },
    {
        "month": "6",
        "day": "12",
        "year": "2012",
        "price": "5.7",
        "totalCirculation": "9211100",
        "totalTransactionFees": "12.59682379",
        "numberOfUniqueBitcoinAddressesUsed": "18916",
        "totalOutputVolumeValue": "2787261.324",
        "averageNumberOfTransactionsPerBlock": "247"
    },
    {
        "month": "6",
        "day": "13",
        "year": "2012",
        "price": "5.96",
        "totalCirculation": "9219200",
        "totalTransactionFees": "35.1762952",
        "numberOfUniqueBitcoinAddressesUsed": "35054",
        "totalOutputVolumeValue": "1760143.067",
        "averageNumberOfTransactionsPerBlock": "248"
    },
    {
        "month": "6",
        "day": "14",
        "year": "2012",
        "price": "5.95",
        "totalCirculation": "9226500",
        "totalTransactionFees": "35.89565212",
        "numberOfUniqueBitcoinAddressesUsed": "37395",
        "totalOutputVolumeValue": "5229504.533",
        "averageNumberOfTransactionsPerBlock": "209"
    },
    {
        "month": "6",
        "day": "15",
        "year": "2012",
        "price": "6.165",
        "totalCirculation": "9234450",
        "totalTransactionFees": "35.61308945",
        "numberOfUniqueBitcoinAddressesUsed": "39031",
        "totalOutputVolumeValue": "3656680.349",
        "averageNumberOfTransactionsPerBlock": "246"
    },
    {
        "month": "6",
        "day": "16",
        "year": "2012",
        "price": "6.599",
        "totalCirculation": "9242450",
        "totalTransactionFees": "30.02680517",
        "numberOfUniqueBitcoinAddressesUsed": "34580",
        "totalOutputVolumeValue": "4351600.724",
        "averageNumberOfTransactionsPerBlock": "217"
    },
    {
        "month": "6",
        "day": "17",
        "year": "2012",
        "price": "6.52999",
        "totalCirculation": "9250600",
        "totalTransactionFees": "24.4001962",
        "numberOfUniqueBitcoinAddressesUsed": "30521",
        "totalOutputVolumeValue": "1159009.953",
        "averageNumberOfTransactionsPerBlock": "181"
    },
    {
        "month": "6",
        "day": "18",
        "year": "2012",
        "price": "6.4668",
        "totalCirculation": "9258450",
        "totalTransactionFees": "26.16138093",
        "numberOfUniqueBitcoinAddressesUsed": "31363",
        "totalOutputVolumeValue": "2575358.106",
        "averageNumberOfTransactionsPerBlock": "133"
    },
    {
        "month": "6",
        "day": "19",
        "year": "2012",
        "price": "6.53294",
        "totalCirculation": "9267550",
        "totalTransactionFees": "26.94018882",
        "numberOfUniqueBitcoinAddressesUsed": "30103",
        "totalOutputVolumeValue": "2217216.37",
        "averageNumberOfTransactionsPerBlock": "156"
    },
    {
        "month": "6",
        "day": "20",
        "year": "2012",
        "price": "6.64999",
        "totalCirculation": "9274350",
        "totalTransactionFees": "21.58001528",
        "numberOfUniqueBitcoinAddressesUsed": "25912",
        "totalOutputVolumeValue": "1737453.295",
        "averageNumberOfTransactionsPerBlock": "169"
    },
    {
        "month": "6",
        "day": "21",
        "year": "2012",
        "price": "6.8",
        "totalCirculation": "9280450",
        "totalTransactionFees": "26.27883814",
        "numberOfUniqueBitcoinAddressesUsed": "22814",
        "totalOutputVolumeValue": "1186755.333",
        "averageNumberOfTransactionsPerBlock": "219"
    },
    {
        "month": "6",
        "day": "22",
        "year": "2012",
        "price": "6.79962",
        "totalCirculation": "9287500",
        "totalTransactionFees": "29.83422135",
        "numberOfUniqueBitcoinAddressesUsed": "23645",
        "totalOutputVolumeValue": "1584455.898",
        "averageNumberOfTransactionsPerBlock": "189"
    },
    {
        "month": "6",
        "day": "23",
        "year": "2012",
        "price": "6.65062",
        "totalCirculation": "9295600",
        "totalTransactionFees": "15.19853598",
        "numberOfUniqueBitcoinAddressesUsed": "22670",
        "totalOutputVolumeValue": "3282570.077",
        "averageNumberOfTransactionsPerBlock": "202"
    },
    {
        "month": "6",
        "day": "24",
        "year": "2012",
        "price": "6.5915",
        "totalCirculation": "9302600",
        "totalTransactionFees": "16.06404355",
        "numberOfUniqueBitcoinAddressesUsed": "21800",
        "totalOutputVolumeValue": "2180761.314",
        "averageNumberOfTransactionsPerBlock": "159"
    },
    {
        "month": "6",
        "day": "25",
        "year": "2012",
        "price": "6.44999",
        "totalCirculation": "9310250",
        "totalTransactionFees": "14.82897323",
        "numberOfUniqueBitcoinAddressesUsed": "25287",
        "totalOutputVolumeValue": "1843260.419",
        "averageNumberOfTransactionsPerBlock": "166"
    },
    {
        "month": "6",
        "day": "26",
        "year": "2012",
        "price": "6.4514",
        "totalCirculation": "9317650",
        "totalTransactionFees": "19.65510869",
        "numberOfUniqueBitcoinAddressesUsed": "30371",
        "totalOutputVolumeValue": "1782749.753",
        "averageNumberOfTransactionsPerBlock": "136"
    },
    {
        "month": "6",
        "day": "27",
        "year": "2012",
        "price": "6.55555",
        "totalCirculation": "9325750",
        "totalTransactionFees": "17.42605631",
        "numberOfUniqueBitcoinAddressesUsed": "29665",
        "totalOutputVolumeValue": "1327378.717",
        "averageNumberOfTransactionsPerBlock": "156"
    },
    {
        "month": "6",
        "day": "28",
        "year": "2012",
        "price": "6.66897",
        "totalCirculation": "9332500",
        "totalTransactionFees": "16.85485099",
        "numberOfUniqueBitcoinAddressesUsed": "27355",
        "totalOutputVolumeValue": "3571435.206",
        "averageNumberOfTransactionsPerBlock": "158"
    },
    {
        "month": "6",
        "day": "29",
        "year": "2012",
        "price": "6.662",
        "totalCirculation": "9339500",
        "totalTransactionFees": "11.58999775",
        "numberOfUniqueBitcoinAddressesUsed": "25246",
        "totalOutputVolumeValue": "2843499.263",
        "averageNumberOfTransactionsPerBlock": "138"
    },
    {
        "month": "6",
        "day": "30",
        "year": "2012",
        "price": "6.693",
        "totalCirculation": "9346600",
        "totalTransactionFees": "14.1692415",
        "numberOfUniqueBitcoinAddressesUsed": "27258",
        "totalOutputVolumeValue": "1659773.182",
        "averageNumberOfTransactionsPerBlock": "160"
    },
    {
        "month": "7",
        "day": "1",
        "year": "2012",
        "price": "6.694",
        "totalCirculation": "9353500",
        "totalTransactionFees": "10.02531446",
        "numberOfUniqueBitcoinAddressesUsed": "23260",
        "totalOutputVolumeValue": "1287322.111",
        "averageNumberOfTransactionsPerBlock": "143"
    },
    {
        "month": "7",
        "day": "2",
        "year": "2012",
        "price": "6.75",
        "totalCirculation": "9361550",
        "totalTransactionFees": "13.30033059",
        "numberOfUniqueBitcoinAddressesUsed": "30158",
        "totalOutputVolumeValue": "1167866.969",
        "averageNumberOfTransactionsPerBlock": "153"
    },
    {
        "month": "7",
        "day": "3",
        "year": "2012",
        "price": "6.765",
        "totalCirculation": "9368800",
        "totalTransactionFees": "17.70742136",
        "numberOfUniqueBitcoinAddressesUsed": "26804",
        "totalOutputVolumeValue": "1227878.767",
        "averageNumberOfTransactionsPerBlock": "140"
    },
    {
        "month": "7",
        "day": "4",
        "year": "2012",
        "price": "6.55",
        "totalCirculation": "9376750",
        "totalTransactionFees": "12.04784878",
        "numberOfUniqueBitcoinAddressesUsed": "24790",
        "totalOutputVolumeValue": "2384064.436",
        "averageNumberOfTransactionsPerBlock": "153"
    },
    {
        "month": "7",
        "day": "5",
        "year": "2012",
        "price": "6.77",
        "totalCirculation": "9383600",
        "totalTransactionFees": "13.38649042",
        "numberOfUniqueBitcoinAddressesUsed": "22083",
        "totalOutputVolumeValue": "1819963.939",
        "averageNumberOfTransactionsPerBlock": "221"
    },
    {
        "month": "7",
        "day": "6",
        "year": "2012",
        "price": "6.73449",
        "totalCirculation": "9391250",
        "totalTransactionFees": "12.41769967",
        "numberOfUniqueBitcoinAddressesUsed": "22262",
        "totalOutputVolumeValue": "1621179.083",
        "averageNumberOfTransactionsPerBlock": "220"
    },
    {
        "month": "7",
        "day": "7",
        "year": "2012",
        "price": "6.75",
        "totalCirculation": "9399750",
        "totalTransactionFees": "45.39267827",
        "numberOfUniqueBitcoinAddressesUsed": "26033",
        "totalOutputVolumeValue": "4379832.144",
        "averageNumberOfTransactionsPerBlock": "175"
    },
    {
        "month": "7",
        "day": "8",
        "year": "2012",
        "price": "6.87",
        "totalCirculation": "9407450",
        "totalTransactionFees": "12.394001",
        "numberOfUniqueBitcoinAddressesUsed": "22403",
        "totalOutputVolumeValue": "623122.9494",
        "averageNumberOfTransactionsPerBlock": "145"
    },
    {
        "month": "7",
        "day": "9",
        "year": "2012",
        "price": "6.896",
        "totalCirculation": "9415700",
        "totalTransactionFees": "15.91462354",
        "numberOfUniqueBitcoinAddressesUsed": "24678",
        "totalOutputVolumeValue": "1893125.877",
        "averageNumberOfTransactionsPerBlock": "170"
    },
    {
        "month": "7",
        "day": "10",
        "year": "2012",
        "price": "7.239",
        "totalCirculation": "9423250",
        "totalTransactionFees": "22.70876035",
        "numberOfUniqueBitcoinAddressesUsed": "30219",
        "totalOutputVolumeValue": "2373200.403",
        "averageNumberOfTransactionsPerBlock": "173"
    },
    {
        "month": "7",
        "day": "11",
        "year": "2012",
        "price": "7.257",
        "totalCirculation": "9430100",
        "totalTransactionFees": "17.78720701",
        "numberOfUniqueBitcoinAddressesUsed": "27370",
        "totalOutputVolumeValue": "1249365.534",
        "averageNumberOfTransactionsPerBlock": "206"
    },
    {
        "month": "7",
        "day": "12",
        "year": "2012",
        "price": "7.32",
        "totalCirculation": "9437650",
        "totalTransactionFees": "16.10499023",
        "numberOfUniqueBitcoinAddressesUsed": "27972",
        "totalOutputVolumeValue": "1310703.542",
        "averageNumberOfTransactionsPerBlock": "196"
    },
    {
        "month": "7",
        "day": "13",
        "year": "2012",
        "price": "7.9",
        "totalCirculation": "9445700",
        "totalTransactionFees": "12.71610684",
        "numberOfUniqueBitcoinAddressesUsed": "24266",
        "totalOutputVolumeValue": "2448766.95",
        "averageNumberOfTransactionsPerBlock": "203"
    },
    {
        "month": "7",
        "day": "14",
        "year": "2012",
        "price": "7.68891",
        "totalCirculation": "9453150",
        "totalTransactionFees": "16.39495791",
        "numberOfUniqueBitcoinAddressesUsed": "24426",
        "totalOutputVolumeValue": "2369172.76",
        "averageNumberOfTransactionsPerBlock": "217"
    },
    {
        "month": "7",
        "day": "15",
        "year": "2012",
        "price": "7.64877",
        "totalCirculation": "9460600",
        "totalTransactionFees": "16.82730601",
        "numberOfUniqueBitcoinAddressesUsed": "24339",
        "totalOutputVolumeValue": "1672124.099",
        "averageNumberOfTransactionsPerBlock": "254"
    },
    {
        "month": "7",
        "day": "16",
        "year": "2012",
        "price": "8.2899",
        "totalCirculation": "9468000",
        "totalTransactionFees": "21.32899927",
        "numberOfUniqueBitcoinAddressesUsed": "28370",
        "totalOutputVolumeValue": "1695175.106",
        "averageNumberOfTransactionsPerBlock": "250"
    },
    {
        "month": "7",
        "day": "17",
        "year": "2012",
        "price": "9.49",
        "totalCirculation": "9476850",
        "totalTransactionFees": "20.25827138",
        "numberOfUniqueBitcoinAddressesUsed": "33380",
        "totalOutputVolumeValue": "2666970.477",
        "averageNumberOfTransactionsPerBlock": "215"
    },
    {
        "month": "7",
        "day": "18",
        "year": "2012",
        "price": "9.39899",
        "totalCirculation": "9484400",
        "totalTransactionFees": "25.25477096",
        "numberOfUniqueBitcoinAddressesUsed": "27537",
        "totalOutputVolumeValue": "1740583.536",
        "averageNumberOfTransactionsPerBlock": "239"
    },
    {
        "month": "7",
        "day": "19",
        "year": "2012",
        "price": "9.27491",
        "totalCirculation": "9491550",
        "totalTransactionFees": "20.39232492",
        "numberOfUniqueBitcoinAddressesUsed": "28008",
        "totalOutputVolumeValue": "1295478.216",
        "averageNumberOfTransactionsPerBlock": "185"
    },
    {
        "month": "7",
        "day": "20",
        "year": "2012",
        "price": "9.23355",
        "totalCirculation": "9498500",
        "totalTransactionFees": "30.14867241",
        "numberOfUniqueBitcoinAddressesUsed": "28822",
        "totalOutputVolumeValue": "1421994.546",
        "averageNumberOfTransactionsPerBlock": "189"
    },
    {
        "month": "7",
        "day": "21",
        "year": "2012",
        "price": "9.7",
        "totalCirculation": "9506000",
        "totalTransactionFees": "28.9098919",
        "numberOfUniqueBitcoinAddressesUsed": "31248",
        "totalOutputVolumeValue": "2234606.509",
        "averageNumberOfTransactionsPerBlock": "172"
    },
    {
        "month": "7",
        "day": "22",
        "year": "2012",
        "price": "9",
        "totalCirculation": "9512950",
        "totalTransactionFees": "15.35397674",
        "numberOfUniqueBitcoinAddressesUsed": "28132",
        "totalOutputVolumeValue": "2017199.616",
        "averageNumberOfTransactionsPerBlock": "157"
    },
    {
        "month": "7",
        "day": "23",
        "year": "2012",
        "price": "9.2",
        "totalCirculation": "9520450",
        "totalTransactionFees": "23.16193893",
        "numberOfUniqueBitcoinAddressesUsed": "35299",
        "totalOutputVolumeValue": "1883207.373",
        "averageNumberOfTransactionsPerBlock": "195"
    },
    {
        "month": "7",
        "day": "24",
        "year": "2012",
        "price": "8.96",
        "totalCirculation": "9528500",
        "totalTransactionFees": "17.55491401",
        "numberOfUniqueBitcoinAddressesUsed": "29817",
        "totalOutputVolumeValue": "2038593.744",
        "averageNumberOfTransactionsPerBlock": "226"
    },
    {
        "month": "7",
        "day": "25",
        "year": "2012",
        "price": "8.76998",
        "totalCirculation": "9536200",
        "totalTransactionFees": "15.29289555",
        "numberOfUniqueBitcoinAddressesUsed": "26521",
        "totalOutputVolumeValue": "1181372.189",
        "averageNumberOfTransactionsPerBlock": "206"
    },
    {
        "month": "7",
        "day": "26",
        "year": "2012",
        "price": "8.9",
        "totalCirculation": "9545100",
        "totalTransactionFees": "18.68667012",
        "numberOfUniqueBitcoinAddressesUsed": "25872",
        "totalOutputVolumeValue": "1759046.67",
        "averageNumberOfTransactionsPerBlock": "271"
    },
    {
        "month": "7",
        "day": "27",
        "year": "2012",
        "price": "8.95",
        "totalCirculation": "9553500",
        "totalTransactionFees": "15.17561226",
        "numberOfUniqueBitcoinAddressesUsed": "25871",
        "totalOutputVolumeValue": "2542177.227",
        "averageNumberOfTransactionsPerBlock": "242"
    },
    {
        "month": "7",
        "day": "28",
        "year": "2012",
        "price": "8.93",
        "totalCirculation": "9562000",
        "totalTransactionFees": "20.70498525",
        "numberOfUniqueBitcoinAddressesUsed": "31154",
        "totalOutputVolumeValue": "1721419.873",
        "averageNumberOfTransactionsPerBlock": "210"
    },
    {
        "month": "7",
        "day": "29",
        "year": "2012",
        "price": "8.889",
        "totalCirculation": "9569250",
        "totalTransactionFees": "17.74577763",
        "numberOfUniqueBitcoinAddressesUsed": "26862",
        "totalOutputVolumeValue": "1270281.866",
        "averageNumberOfTransactionsPerBlock": "169"
    },
    {
        "month": "7",
        "day": "30",
        "year": "2012",
        "price": "9.15",
        "totalCirculation": "9578500",
        "totalTransactionFees": "21.59461114",
        "numberOfUniqueBitcoinAddressesUsed": "30168",
        "totalOutputVolumeValue": "948209.3546",
        "averageNumberOfTransactionsPerBlock": "187"
    },
    {
        "month": "7",
        "day": "31",
        "year": "2012",
        "price": "9.44",
        "totalCirculation": "9585150",
        "totalTransactionFees": "19.84360187",
        "numberOfUniqueBitcoinAddressesUsed": "37314",
        "totalOutputVolumeValue": "2129740.04",
        "averageNumberOfTransactionsPerBlock": "220"
    },
    {
        "month": "8",
        "day": "1",
        "year": "2012",
        "price": "9.54",
        "totalCirculation": "9592200",
        "totalTransactionFees": "20.21423246",
        "numberOfUniqueBitcoinAddressesUsed": "38959",
        "totalOutputVolumeValue": "2785336.89",
        "averageNumberOfTransactionsPerBlock": "255"
    },
    {
        "month": "8",
        "day": "2",
        "year": "2012",
        "price": "9.8",
        "totalCirculation": "9599900",
        "totalTransactionFees": "19.86616974",
        "numberOfUniqueBitcoinAddressesUsed": "32741",
        "totalOutputVolumeValue": "1964547.298",
        "averageNumberOfTransactionsPerBlock": "192"
    },
    {
        "month": "8",
        "day": "3",
        "year": "2012",
        "price": "11.1188",
        "totalCirculation": "9608550",
        "totalTransactionFees": "17.9249095",
        "numberOfUniqueBitcoinAddressesUsed": "29197",
        "totalOutputVolumeValue": "1674221.833",
        "averageNumberOfTransactionsPerBlock": "228"
    },
    {
        "month": "8",
        "day": "4",
        "year": "2012",
        "price": "11.3",
        "totalCirculation": "9616050",
        "totalTransactionFees": "24.23379789",
        "numberOfUniqueBitcoinAddressesUsed": "28179",
        "totalOutputVolumeValue": "1149479.488",
        "averageNumberOfTransactionsPerBlock": "208"
    },
    {
        "month": "8",
        "day": "5",
        "year": "2012",
        "price": "11.1869",
        "totalCirculation": "9623300",
        "totalTransactionFees": "24.52949124",
        "numberOfUniqueBitcoinAddressesUsed": "28698",
        "totalOutputVolumeValue": "2028384.346",
        "averageNumberOfTransactionsPerBlock": "166"
    },
    {
        "month": "8",
        "day": "6",
        "year": "2012",
        "price": "11.29112",
        "totalCirculation": "9630350",
        "totalTransactionFees": "22.199207",
        "numberOfUniqueBitcoinAddressesUsed": "33954",
        "totalOutputVolumeValue": "1875108.811",
        "averageNumberOfTransactionsPerBlock": "189"
    },
    {
        "month": "8",
        "day": "7",
        "year": "2012",
        "price": "11.04",
        "totalCirculation": "9637800",
        "totalTransactionFees": "20.92753532",
        "numberOfUniqueBitcoinAddressesUsed": "32197",
        "totalOutputVolumeValue": "1940221.755",
        "averageNumberOfTransactionsPerBlock": "199"
    },
    {
        "month": "8",
        "day": "8",
        "year": "2012",
        "price": "11.14999",
        "totalCirculation": "9646300",
        "totalTransactionFees": "52.18018387",
        "numberOfUniqueBitcoinAddressesUsed": "35918",
        "totalOutputVolumeValue": "1765841.135",
        "averageNumberOfTransactionsPerBlock": "324"
    },
    {
        "month": "8",
        "day": "9",
        "year": "2012",
        "price": "12",
        "totalCirculation": "9654250",
        "totalTransactionFees": "18.36985252",
        "numberOfUniqueBitcoinAddressesUsed": "34940",
        "totalOutputVolumeValue": "1601461.745",
        "averageNumberOfTransactionsPerBlock": "230"
    },
    {
        "month": "8",
        "day": "10",
        "year": "2012",
        "price": "11.6",
        "totalCirculation": "9662450",
        "totalTransactionFees": "45.85604941",
        "numberOfUniqueBitcoinAddressesUsed": "29288",
        "totalOutputVolumeValue": "1174688.424",
        "averageNumberOfTransactionsPerBlock": "286"
    },
    {
        "month": "8",
        "day": "11",
        "year": "2012",
        "price": "11.59788",
        "totalCirculation": "9670350",
        "totalTransactionFees": "17.37179137",
        "numberOfUniqueBitcoinAddressesUsed": "27985",
        "totalOutputVolumeValue": "1920172.472",
        "averageNumberOfTransactionsPerBlock": "319"
    },
    {
        "month": "8",
        "day": "12",
        "year": "2012",
        "price": "11.765",
        "totalCirculation": "9678800",
        "totalTransactionFees": "17.49173695",
        "numberOfUniqueBitcoinAddressesUsed": "30165",
        "totalOutputVolumeValue": "1621721.944",
        "averageNumberOfTransactionsPerBlock": "285"
    },
    {
        "month": "8",
        "day": "13",
        "year": "2012",
        "price": "11.86999",
        "totalCirculation": "9686450",
        "totalTransactionFees": "25.04966154",
        "numberOfUniqueBitcoinAddressesUsed": "41509",
        "totalOutputVolumeValue": "1784521.536",
        "averageNumberOfTransactionsPerBlock": "261"
    },
    {
        "month": "8",
        "day": "14",
        "year": "2012",
        "price": "12.17887",
        "totalCirculation": "9694600",
        "totalTransactionFees": "21.93973905",
        "numberOfUniqueBitcoinAddressesUsed": "34362",
        "totalOutputVolumeValue": "1715320.342",
        "averageNumberOfTransactionsPerBlock": "221"
    },
    {
        "month": "8",
        "day": "15",
        "year": "2012",
        "price": "12.67",
        "totalCirculation": "9703150",
        "totalTransactionFees": "28.12433709",
        "numberOfUniqueBitcoinAddressesUsed": "36444",
        "totalOutputVolumeValue": "1863928.721",
        "averageNumberOfTransactionsPerBlock": "191"
    },
    {
        "month": "8",
        "day": "16",
        "year": "2012",
        "price": "13.84119",
        "totalCirculation": "9710850",
        "totalTransactionFees": "32.70348326",
        "numberOfUniqueBitcoinAddressesUsed": "47362",
        "totalOutputVolumeValue": "1664499.548",
        "averageNumberOfTransactionsPerBlock": "223"
    },
    {
        "month": "8",
        "day": "17",
        "year": "2012",
        "price": "15.4",
        "totalCirculation": "9718000",
        "totalTransactionFees": "30.58990923",
        "numberOfUniqueBitcoinAddressesUsed": "45775",
        "totalOutputVolumeValue": "2729697.58",
        "averageNumberOfTransactionsPerBlock": "272"
    },
    {
        "month": "8",
        "day": "18",
        "year": "2012",
        "price": "15.26014",
        "totalCirculation": "9725400",
        "totalTransactionFees": "20.76717614",
        "numberOfUniqueBitcoinAddressesUsed": "41427",
        "totalOutputVolumeValue": "2627510.82",
        "averageNumberOfTransactionsPerBlock": "192"
    },
    {
        "month": "8",
        "day": "19",
        "year": "2012",
        "price": "12",
        "totalCirculation": "9733300",
        "totalTransactionFees": "18.95507601",
        "numberOfUniqueBitcoinAddressesUsed": "32820",
        "totalOutputVolumeValue": "3349445.756",
        "averageNumberOfTransactionsPerBlock": "198"
    },
    {
        "month": "8",
        "day": "20",
        "year": "2012",
        "price": "10.5",
        "totalCirculation": "9742750",
        "totalTransactionFees": "28.01583883",
        "numberOfUniqueBitcoinAddressesUsed": "34086",
        "totalOutputVolumeValue": "9622289.3",
        "averageNumberOfTransactionsPerBlock": "270"
    },
    {
        "month": "8",
        "day": "21",
        "year": "2012",
        "price": "10.29999",
        "totalCirculation": "9751800",
        "totalTransactionFees": "23.26574408",
        "numberOfUniqueBitcoinAddressesUsed": "40498",
        "totalOutputVolumeValue": "6768934.301",
        "averageNumberOfTransactionsPerBlock": "173"
    },
    {
        "month": "8",
        "day": "22",
        "year": "2012",
        "price": "10.26",
        "totalCirculation": "9759250",
        "totalTransactionFees": "24.5640378",
        "numberOfUniqueBitcoinAddressesUsed": "39189",
        "totalOutputVolumeValue": "5845207.913",
        "averageNumberOfTransactionsPerBlock": "210"
    },
    {
        "month": "8",
        "day": "23",
        "year": "2012",
        "price": "10.25",
        "totalCirculation": "9767500",
        "totalTransactionFees": "21.53412752",
        "numberOfUniqueBitcoinAddressesUsed": "34809",
        "totalOutputVolumeValue": "8073544.018",
        "averageNumberOfTransactionsPerBlock": "205"
    },
    {
        "month": "8",
        "day": "24",
        "year": "2012",
        "price": "10.25",
        "totalCirculation": "9775300",
        "totalTransactionFees": "18.81258311",
        "numberOfUniqueBitcoinAddressesUsed": "34511",
        "totalOutputVolumeValue": "7957035.361",
        "averageNumberOfTransactionsPerBlock": "203"
    },
    {
        "month": "8",
        "day": "25",
        "year": "2012",
        "price": "10.25",
        "totalCirculation": "9781850",
        "totalTransactionFees": "21.92109799",
        "numberOfUniqueBitcoinAddressesUsed": "33067",
        "totalOutputVolumeValue": "9640536.112",
        "averageNumberOfTransactionsPerBlock": "198"
    },
    {
        "month": "8",
        "day": "26",
        "year": "2012",
        "price": "10.61913",
        "totalCirculation": "9790650",
        "totalTransactionFees": "22.34564361",
        "numberOfUniqueBitcoinAddressesUsed": "28168",
        "totalOutputVolumeValue": "3147442.026",
        "averageNumberOfTransactionsPerBlock": "290"
    },
    {
        "month": "8",
        "day": "27",
        "year": "2012",
        "price": "12.14999",
        "totalCirculation": "9798100",
        "totalTransactionFees": "29.03414368",
        "numberOfUniqueBitcoinAddressesUsed": "30516",
        "totalOutputVolumeValue": "3271317.782",
        "averageNumberOfTransactionsPerBlock": "257"
    },
    {
        "month": "8",
        "day": "28",
        "year": "2012",
        "price": "11.3807",
        "totalCirculation": "9805600",
        "totalTransactionFees": "23.62564327",
        "numberOfUniqueBitcoinAddressesUsed": "32138",
        "totalOutputVolumeValue": "8618370.671",
        "averageNumberOfTransactionsPerBlock": "204"
    },
    {
        "month": "8",
        "day": "29",
        "year": "2012",
        "price": "11.20999",
        "totalCirculation": "9813900",
        "totalTransactionFees": "24.54703076",
        "numberOfUniqueBitcoinAddressesUsed": "32378",
        "totalOutputVolumeValue": "12858493.64",
        "averageNumberOfTransactionsPerBlock": "228"
    },
    {
        "month": "8",
        "day": "30",
        "year": "2012",
        "price": "10.937",
        "totalCirculation": "9821800",
        "totalTransactionFees": "27.34385576",
        "numberOfUniqueBitcoinAddressesUsed": "26377",
        "totalOutputVolumeValue": "13468328.55",
        "averageNumberOfTransactionsPerBlock": "288"
    },
    {
        "month": "8",
        "day": "31",
        "year": "2012",
        "price": "10.8359",
        "totalCirculation": "9828950",
        "totalTransactionFees": "32.39425452",
        "numberOfUniqueBitcoinAddressesUsed": "37505",
        "totalOutputVolumeValue": "6726903.675",
        "averageNumberOfTransactionsPerBlock": "230"
    },
    {
        "month": "9",
        "day": "1",
        "year": "2012",
        "price": "10.42",
        "totalCirculation": "9837100",
        "totalTransactionFees": "28.87869838",
        "numberOfUniqueBitcoinAddressesUsed": "39715",
        "totalOutputVolumeValue": "11028471.47",
        "averageNumberOfTransactionsPerBlock": "237"
    },
    {
        "month": "9",
        "day": "2",
        "year": "2012",
        "price": "10.18999",
        "totalCirculation": "9844750",
        "totalTransactionFees": "31.86619313",
        "numberOfUniqueBitcoinAddressesUsed": "28708",
        "totalOutputVolumeValue": "6853914.887",
        "averageNumberOfTransactionsPerBlock": "188"
    },
    {
        "month": "9",
        "day": "3",
        "year": "2012",
        "price": "10.5",
        "totalCirculation": "9853750",
        "totalTransactionFees": "36.95385361",
        "numberOfUniqueBitcoinAddressesUsed": "29237",
        "totalOutputVolumeValue": "4085171.785",
        "averageNumberOfTransactionsPerBlock": "245"
    },
    {
        "month": "9",
        "day": "4",
        "year": "2012",
        "price": "10.5934",
        "totalCirculation": "9860150",
        "totalTransactionFees": "30.59917481",
        "numberOfUniqueBitcoinAddressesUsed": "31358",
        "totalOutputVolumeValue": "6181981.318",
        "averageNumberOfTransactionsPerBlock": "196"
    },
    {
        "month": "9",
        "day": "5",
        "year": "2012",
        "price": "10.57888",
        "totalCirculation": "9869150",
        "totalTransactionFees": "25.18379882",
        "numberOfUniqueBitcoinAddressesUsed": "33850",
        "totalOutputVolumeValue": "8813231.517",
        "averageNumberOfTransactionsPerBlock": "222"
    },
    {
        "month": "9",
        "day": "6",
        "year": "2012",
        "price": "11.17",
        "totalCirculation": "9878450",
        "totalTransactionFees": "28.46114685",
        "numberOfUniqueBitcoinAddressesUsed": "38202",
        "totalOutputVolumeValue": "16235603.51",
        "averageNumberOfTransactionsPerBlock": "239"
    },
    {
        "month": "9",
        "day": "7",
        "year": "2012",
        "price": "11.29",
        "totalCirculation": "9887050",
        "totalTransactionFees": "18.75177954",
        "numberOfUniqueBitcoinAddressesUsed": "31911",
        "totalOutputVolumeValue": "20505513.35",
        "averageNumberOfTransactionsPerBlock": "215"
    },
    {
        "month": "9",
        "day": "8",
        "year": "2012",
        "price": "11.21",
        "totalCirculation": "9894050",
        "totalTransactionFees": "23.92353501",
        "numberOfUniqueBitcoinAddressesUsed": "30088",
        "totalOutputVolumeValue": "11470487.22",
        "averageNumberOfTransactionsPerBlock": "192"
    },
    {
        "month": "9",
        "day": "9",
        "year": "2012",
        "price": "11.14288",
        "totalCirculation": "9901700",
        "totalTransactionFees": "20.56845317",
        "numberOfUniqueBitcoinAddressesUsed": "33631",
        "totalOutputVolumeValue": "4639990.618",
        "averageNumberOfTransactionsPerBlock": "216"
    },
    {
        "month": "9",
        "day": "10",
        "year": "2012",
        "price": "11.127",
        "totalCirculation": "9908900",
        "totalTransactionFees": "22.3581976",
        "numberOfUniqueBitcoinAddressesUsed": "28826",
        "totalOutputVolumeValue": "12681255.04",
        "averageNumberOfTransactionsPerBlock": "212"
    },
    {
        "month": "9",
        "day": "11",
        "year": "2012",
        "price": "11.19401",
        "totalCirculation": "9916800",
        "totalTransactionFees": "29.23196182",
        "numberOfUniqueBitcoinAddressesUsed": "36043",
        "totalOutputVolumeValue": "23357681.84",
        "averageNumberOfTransactionsPerBlock": "182"
    },
    {
        "month": "9",
        "day": "12",
        "year": "2012",
        "price": "11.3789",
        "totalCirculation": "9923850",
        "totalTransactionFees": "23.00668134",
        "numberOfUniqueBitcoinAddressesUsed": "29944",
        "totalOutputVolumeValue": "7673581.175",
        "averageNumberOfTransactionsPerBlock": "144"
    },
    {
        "month": "9",
        "day": "13",
        "year": "2012",
        "price": "11.399",
        "totalCirculation": "9931100",
        "totalTransactionFees": "20.11991821",
        "numberOfUniqueBitcoinAddressesUsed": "27663",
        "totalOutputVolumeValue": "24861234.92",
        "averageNumberOfTransactionsPerBlock": "187"
    },
    {
        "month": "9",
        "day": "14",
        "year": "2012",
        "price": "11.75",
        "totalCirculation": "9939200",
        "totalTransactionFees": "21.40527069",
        "numberOfUniqueBitcoinAddressesUsed": "30426",
        "totalOutputVolumeValue": "18210399.12",
        "averageNumberOfTransactionsPerBlock": "224"
    },
    {
        "month": "9",
        "day": "15",
        "year": "2012",
        "price": "11.799",
        "totalCirculation": "9946350",
        "totalTransactionFees": "16.00925068",
        "numberOfUniqueBitcoinAddressesUsed": "26871",
        "totalOutputVolumeValue": "9750031.706",
        "averageNumberOfTransactionsPerBlock": "230"
    },
    {
        "month": "9",
        "day": "16",
        "year": "2012",
        "price": "11.99",
        "totalCirculation": "9953850",
        "totalTransactionFees": "14.37584654",
        "numberOfUniqueBitcoinAddressesUsed": "24913",
        "totalOutputVolumeValue": "11469649.95",
        "averageNumberOfTransactionsPerBlock": "183"
    },
    {
        "month": "9",
        "day": "17",
        "year": "2012",
        "price": "11.9625",
        "totalCirculation": "9962650",
        "totalTransactionFees": "14.49014511",
        "numberOfUniqueBitcoinAddressesUsed": "26956",
        "totalOutputVolumeValue": "13502363.62",
        "averageNumberOfTransactionsPerBlock": "138"
    },
    {
        "month": "9",
        "day": "18",
        "year": "2012",
        "price": "12.09",
        "totalCirculation": "9971000",
        "totalTransactionFees": "19.83549726",
        "numberOfUniqueBitcoinAddressesUsed": "31239",
        "totalOutputVolumeValue": "12215553.7",
        "averageNumberOfTransactionsPerBlock": "162"
    },
    {
        "month": "9",
        "day": "19",
        "year": "2012",
        "price": "12.61",
        "totalCirculation": "9978150",
        "totalTransactionFees": "22.47986657",
        "numberOfUniqueBitcoinAddressesUsed": "32351",
        "totalOutputVolumeValue": "26708894.67",
        "averageNumberOfTransactionsPerBlock": "200"
    },
    {
        "month": "9",
        "day": "20",
        "year": "2012",
        "price": "12.68666",
        "totalCirculation": "9985500",
        "totalTransactionFees": "20.6905111",
        "numberOfUniqueBitcoinAddressesUsed": "41220",
        "totalOutputVolumeValue": "19151623.13",
        "averageNumberOfTransactionsPerBlock": "159"
    },
    {
        "month": "9",
        "day": "21",
        "year": "2012",
        "price": "12.57001",
        "totalCirculation": "9993650",
        "totalTransactionFees": "29.49860957",
        "numberOfUniqueBitcoinAddressesUsed": "29455",
        "totalOutputVolumeValue": "8815674.084",
        "averageNumberOfTransactionsPerBlock": "222"
    },
    {
        "month": "9",
        "day": "22",
        "year": "2012",
        "price": "12.4433",
        "totalCirculation": "10002250",
        "totalTransactionFees": "15.707411",
        "numberOfUniqueBitcoinAddressesUsed": "22976",
        "totalOutputVolumeValue": "33955701.47",
        "averageNumberOfTransactionsPerBlock": "211"
    },
    {
        "month": "9",
        "day": "23",
        "year": "2012",
        "price": "12.2749",
        "totalCirculation": "10009700",
        "totalTransactionFees": "15.21996842",
        "numberOfUniqueBitcoinAddressesUsed": "22048",
        "totalOutputVolumeValue": "10006137.7",
        "averageNumberOfTransactionsPerBlock": "182"
    },
    {
        "month": "9",
        "day": "24",
        "year": "2012",
        "price": "12.29888",
        "totalCirculation": "10017500",
        "totalTransactionFees": "27.32303762",
        "numberOfUniqueBitcoinAddressesUsed": "26499",
        "totalOutputVolumeValue": "8220431.728",
        "averageNumberOfTransactionsPerBlock": "157"
    },
    {
        "month": "9",
        "day": "25",
        "year": "2012",
        "price": "12.22909",
        "totalCirculation": "10024950",
        "totalTransactionFees": "17.18850981",
        "numberOfUniqueBitcoinAddressesUsed": "31768",
        "totalOutputVolumeValue": "2934062.341",
        "averageNumberOfTransactionsPerBlock": "139"
    },
    {
        "month": "9",
        "day": "26",
        "year": "2012",
        "price": "12.28",
        "totalCirculation": "10032100",
        "totalTransactionFees": "18.39848429",
        "numberOfUniqueBitcoinAddressesUsed": "37569",
        "totalOutputVolumeValue": "1747872.327",
        "averageNumberOfTransactionsPerBlock": "160"
    },
    {
        "month": "9",
        "day": "27",
        "year": "2012",
        "price": "12.46",
        "totalCirculation": "10039250",
        "totalTransactionFees": "17.75388518",
        "numberOfUniqueBitcoinAddressesUsed": "32067",
        "totalOutputVolumeValue": "1377324.528",
        "averageNumberOfTransactionsPerBlock": "209"
    },
    {
        "month": "9",
        "day": "28",
        "year": "2012",
        "price": "12.444",
        "totalCirculation": "10047450",
        "totalTransactionFees": "57.9866703",
        "numberOfUniqueBitcoinAddressesUsed": "35047",
        "totalOutputVolumeValue": "2301007.674",
        "averageNumberOfTransactionsPerBlock": "233"
    },
    {
        "month": "9",
        "day": "29",
        "year": "2012",
        "price": "12.49",
        "totalCirculation": "10055850",
        "totalTransactionFees": "14.87112626",
        "numberOfUniqueBitcoinAddressesUsed": "29803",
        "totalOutputVolumeValue": "1426952.879",
        "averageNumberOfTransactionsPerBlock": "220"
    },
    {
        "month": "9",
        "day": "30",
        "year": "2012",
        "price": "12.47499",
        "totalCirculation": "10063450",
        "totalTransactionFees": "12.37119439",
        "numberOfUniqueBitcoinAddressesUsed": "25781",
        "totalOutputVolumeValue": "1701101.393",
        "averageNumberOfTransactionsPerBlock": "253"
    },
    {
        "month": "10",
        "day": "1",
        "year": "2012",
        "price": "12.481",
        "totalCirculation": "10070850",
        "totalTransactionFees": "15.05241324",
        "numberOfUniqueBitcoinAddressesUsed": "29541",
        "totalOutputVolumeValue": "1327585.717",
        "averageNumberOfTransactionsPerBlock": "251"
    },
    {
        "month": "10",
        "day": "2",
        "year": "2012",
        "price": "12.88",
        "totalCirculation": "10077650",
        "totalTransactionFees": "25.53766212",
        "numberOfUniqueBitcoinAddressesUsed": "35169",
        "totalOutputVolumeValue": "2197482.526",
        "averageNumberOfTransactionsPerBlock": "231"
    },
    {
        "month": "10",
        "day": "3",
        "year": "2012",
        "price": "12.8999",
        "totalCirculation": "10084550",
        "totalTransactionFees": "23.89542547",
        "numberOfUniqueBitcoinAddressesUsed": "35365",
        "totalOutputVolumeValue": "1393561.63",
        "averageNumberOfTransactionsPerBlock": "231"
    },
    {
        "month": "10",
        "day": "4",
        "year": "2012",
        "price": "13.0899",
        "totalCirculation": "10091250",
        "totalTransactionFees": "129.0727315",
        "numberOfUniqueBitcoinAddressesUsed": "35434",
        "totalOutputVolumeValue": "1201539.476",
        "averageNumberOfTransactionsPerBlock": "247"
    },
    {
        "month": "10",
        "day": "5",
        "year": "2012",
        "price": "12.99",
        "totalCirculation": "10098050",
        "totalTransactionFees": "27.33750416",
        "numberOfUniqueBitcoinAddressesUsed": "34539",
        "totalOutputVolumeValue": "2283634.905",
        "averageNumberOfTransactionsPerBlock": "216"
    },
    {
        "month": "10",
        "day": "6",
        "year": "2012",
        "price": "12.89999",
        "totalCirculation": "10105150",
        "totalTransactionFees": "23.63559135",
        "numberOfUniqueBitcoinAddressesUsed": "34398",
        "totalOutputVolumeValue": "2108275.873",
        "averageNumberOfTransactionsPerBlock": "217"
    },
    {
        "month": "10",
        "day": "7",
        "year": "2012",
        "price": "12.7369",
        "totalCirculation": "10112000",
        "totalTransactionFees": "23.24799372",
        "numberOfUniqueBitcoinAddressesUsed": "30653",
        "totalOutputVolumeValue": "1712849.004",
        "averageNumberOfTransactionsPerBlock": "160"
    },
    {
        "month": "10",
        "day": "8",
        "year": "2012",
        "price": "12.08",
        "totalCirculation": "10120300",
        "totalTransactionFees": "29.1855467",
        "numberOfUniqueBitcoinAddressesUsed": "37625",
        "totalOutputVolumeValue": "1904907.84",
        "averageNumberOfTransactionsPerBlock": "255"
    },
    {
        "month": "10",
        "day": "9",
        "year": "2012",
        "price": "12.35",
        "totalCirculation": "10127550",
        "totalTransactionFees": "24.92948098",
        "numberOfUniqueBitcoinAddressesUsed": "37794",
        "totalOutputVolumeValue": "1455360.202",
        "averageNumberOfTransactionsPerBlock": "195"
    },
    {
        "month": "10",
        "day": "10",
        "year": "2012",
        "price": "12.15",
        "totalCirculation": "10135000",
        "totalTransactionFees": "22.58048511",
        "numberOfUniqueBitcoinAddressesUsed": "37830",
        "totalOutputVolumeValue": "1037860.322",
        "averageNumberOfTransactionsPerBlock": "189"
    },
    {
        "month": "10",
        "day": "11",
        "year": "2012",
        "price": "12.19",
        "totalCirculation": "10141900",
        "totalTransactionFees": "25.1547753",
        "numberOfUniqueBitcoinAddressesUsed": "32004",
        "totalOutputVolumeValue": "1036064.965",
        "averageNumberOfTransactionsPerBlock": "220"
    },
    {
        "month": "10",
        "day": "12",
        "year": "2012",
        "price": "12.15",
        "totalCirculation": "10149450",
        "totalTransactionFees": "18.97829142",
        "numberOfUniqueBitcoinAddressesUsed": "32832",
        "totalOutputVolumeValue": "2408018.727",
        "averageNumberOfTransactionsPerBlock": "232"
    },
    {
        "month": "10",
        "day": "13",
        "year": "2012",
        "price": "12.137",
        "totalCirculation": "10156750",
        "totalTransactionFees": "24.55671427",
        "numberOfUniqueBitcoinAddressesUsed": "33228",
        "totalOutputVolumeValue": "2263100.715",
        "averageNumberOfTransactionsPerBlock": "183"
    },
    {
        "month": "10",
        "day": "14",
        "year": "2012",
        "price": "12",
        "totalCirculation": "10163650",
        "totalTransactionFees": "16.36760937",
        "numberOfUniqueBitcoinAddressesUsed": "30494",
        "totalOutputVolumeValue": "2175251.887",
        "averageNumberOfTransactionsPerBlock": "179"
    },
    {
        "month": "10",
        "day": "15",
        "year": "2012",
        "price": "12.03",
        "totalCirculation": "10171500",
        "totalTransactionFees": "19.19003194",
        "numberOfUniqueBitcoinAddressesUsed": "32370",
        "totalOutputVolumeValue": "932927.1697",
        "averageNumberOfTransactionsPerBlock": "200"
    },
    {
        "month": "10",
        "day": "16",
        "year": "2012",
        "price": "11.99",
        "totalCirculation": "10179100",
        "totalTransactionFees": "25.96467158",
        "numberOfUniqueBitcoinAddressesUsed": "31951",
        "totalOutputVolumeValue": "2153088.566",
        "averageNumberOfTransactionsPerBlock": "251"
    },
    {
        "month": "10",
        "day": "17",
        "year": "2012",
        "price": "11.99",
        "totalCirculation": "10186150",
        "totalTransactionFees": "66.89339529",
        "numberOfUniqueBitcoinAddressesUsed": "33554",
        "totalOutputVolumeValue": "3128474.951",
        "averageNumberOfTransactionsPerBlock": "214"
    },
    {
        "month": "10",
        "day": "18",
        "year": "2012",
        "price": "11.95998",
        "totalCirculation": "10193900",
        "totalTransactionFees": "18.16174438",
        "numberOfUniqueBitcoinAddressesUsed": "34489",
        "totalOutputVolumeValue": "3397667.679",
        "averageNumberOfTransactionsPerBlock": "292"
    },
    {
        "month": "10",
        "day": "19",
        "year": "2012",
        "price": "11.967",
        "totalCirculation": "10201850",
        "totalTransactionFees": "17.28631948",
        "numberOfUniqueBitcoinAddressesUsed": "32236",
        "totalOutputVolumeValue": "3198174.88",
        "averageNumberOfTransactionsPerBlock": "215"
    },
    {
        "month": "10",
        "day": "20",
        "year": "2012",
        "price": "11.85",
        "totalCirculation": "10208750",
        "totalTransactionFees": "16.59501444",
        "numberOfUniqueBitcoinAddressesUsed": "31187",
        "totalOutputVolumeValue": "2628427.1",
        "averageNumberOfTransactionsPerBlock": "203"
    },
    {
        "month": "10",
        "day": "21",
        "year": "2012",
        "price": "11.7965",
        "totalCirculation": "10216650",
        "totalTransactionFees": "22.27543359",
        "numberOfUniqueBitcoinAddressesUsed": "31535",
        "totalOutputVolumeValue": "2417572.502",
        "averageNumberOfTransactionsPerBlock": "140"
    },
    {
        "month": "10",
        "day": "22",
        "year": "2012",
        "price": "11.81",
        "totalCirculation": "10224950",
        "totalTransactionFees": "23.10204087",
        "numberOfUniqueBitcoinAddressesUsed": "29410",
        "totalOutputVolumeValue": "2035350.583",
        "averageNumberOfTransactionsPerBlock": "98"
    },
    {
        "month": "10",
        "day": "23",
        "year": "2012",
        "price": "12",
        "totalCirculation": "10231800",
        "totalTransactionFees": "24.37162899",
        "numberOfUniqueBitcoinAddressesUsed": "33577",
        "totalOutputVolumeValue": "2554099.321",
        "averageNumberOfTransactionsPerBlock": "102"
    },
    {
        "month": "10",
        "day": "24",
        "year": "2012",
        "price": "11.82",
        "totalCirculation": "10239600",
        "totalTransactionFees": "22.20707536",
        "numberOfUniqueBitcoinAddressesUsed": "33269",
        "totalOutputVolumeValue": "2318810.487",
        "averageNumberOfTransactionsPerBlock": "121"
    },
    {
        "month": "10",
        "day": "25",
        "year": "2012",
        "price": "11.71",
        "totalCirculation": "10246500",
        "totalTransactionFees": "18.26830049",
        "numberOfUniqueBitcoinAddressesUsed": "27911",
        "totalOutputVolumeValue": "1546384.98",
        "averageNumberOfTransactionsPerBlock": "200"
    },
    {
        "month": "10",
        "day": "26",
        "year": "2012",
        "price": "11.09988",
        "totalCirculation": "10254550",
        "totalTransactionFees": "16.80943206",
        "numberOfUniqueBitcoinAddressesUsed": "29737",
        "totalOutputVolumeValue": "929136.8506",
        "averageNumberOfTransactionsPerBlock": "205"
    },
    {
        "month": "10",
        "day": "27",
        "year": "2012",
        "price": "10.83883",
        "totalCirculation": "10263450",
        "totalTransactionFees": "13.76313528",
        "numberOfUniqueBitcoinAddressesUsed": "22726",
        "totalOutputVolumeValue": "1634453.613",
        "averageNumberOfTransactionsPerBlock": "188"
    },
    {
        "month": "10",
        "day": "28",
        "year": "2012",
        "price": "10.61",
        "totalCirculation": "10271900",
        "totalTransactionFees": "12.84233689",
        "numberOfUniqueBitcoinAddressesUsed": "21318",
        "totalOutputVolumeValue": "1123144.916",
        "averageNumberOfTransactionsPerBlock": "189"
    },
    {
        "month": "10",
        "day": "29",
        "year": "2012",
        "price": "10.95",
        "totalCirculation": "10279800",
        "totalTransactionFees": "15.0975509",
        "numberOfUniqueBitcoinAddressesUsed": "21429",
        "totalOutputVolumeValue": "1050571.592",
        "averageNumberOfTransactionsPerBlock": "176"
    },
    {
        "month": "10",
        "day": "30",
        "year": "2012",
        "price": "10.85",
        "totalCirculation": "10287250",
        "totalTransactionFees": "23.28136658",
        "numberOfUniqueBitcoinAddressesUsed": "26964",
        "totalOutputVolumeValue": "1502588.044",
        "averageNumberOfTransactionsPerBlock": "141"
    },
    {
        "month": "10",
        "day": "31",
        "year": "2012",
        "price": "11.14",
        "totalCirculation": "10294200",
        "totalTransactionFees": "23.11370123",
        "numberOfUniqueBitcoinAddressesUsed": "26412",
        "totalOutputVolumeValue": "6152986.359",
        "averageNumberOfTransactionsPerBlock": "210"
    },
    {
        "month": "11",
        "day": "1",
        "year": "2012",
        "price": "11.279",
        "totalCirculation": "10300950",
        "totalTransactionFees": "22.03532797",
        "numberOfUniqueBitcoinAddressesUsed": "23811",
        "totalOutputVolumeValue": "2890562.393",
        "averageNumberOfTransactionsPerBlock": "206"
    },
    {
        "month": "11",
        "day": "2",
        "year": "2012",
        "price": "11.20999",
        "totalCirculation": "10308200",
        "totalTransactionFees": "25.18210027",
        "numberOfUniqueBitcoinAddressesUsed": "26334",
        "totalOutputVolumeValue": "959473.781",
        "averageNumberOfTransactionsPerBlock": "238"
    },
    {
        "month": "11",
        "day": "3",
        "year": "2012",
        "price": "10.60097",
        "totalCirculation": "10315350",
        "totalTransactionFees": "20.58374693",
        "numberOfUniqueBitcoinAddressesUsed": "26548",
        "totalOutputVolumeValue": "1583479.705",
        "averageNumberOfTransactionsPerBlock": "215"
    },
    {
        "month": "11",
        "day": "4",
        "year": "2012",
        "price": "10.68",
        "totalCirculation": "10323350",
        "totalTransactionFees": "18.07275203",
        "numberOfUniqueBitcoinAddressesUsed": "22368",
        "totalOutputVolumeValue": "1878369.613",
        "averageNumberOfTransactionsPerBlock": "185"
    },
    {
        "month": "11",
        "day": "5",
        "year": "2012",
        "price": "10.9",
        "totalCirculation": "10331000",
        "totalTransactionFees": "25.83596115",
        "numberOfUniqueBitcoinAddressesUsed": "27968",
        "totalOutputVolumeValue": "2691305.941",
        "averageNumberOfTransactionsPerBlock": "166"
    },
    {
        "month": "11",
        "day": "6",
        "year": "2012",
        "price": "10.88997",
        "totalCirculation": "10337800",
        "totalTransactionFees": "22.98457161",
        "numberOfUniqueBitcoinAddressesUsed": "28560",
        "totalOutputVolumeValue": "1785267.506",
        "averageNumberOfTransactionsPerBlock": "179"
    },
    {
        "month": "11",
        "day": "7",
        "year": "2012",
        "price": "11.21603",
        "totalCirculation": "10345650",
        "totalTransactionFees": "29.35341825",
        "numberOfUniqueBitcoinAddressesUsed": "34011",
        "totalOutputVolumeValue": "2038626.866",
        "averageNumberOfTransactionsPerBlock": "174"
    },
    {
        "month": "11",
        "day": "8",
        "year": "2012",
        "price": "11.0979",
        "totalCirculation": "10353750",
        "totalTransactionFees": "27.51470818",
        "numberOfUniqueBitcoinAddressesUsed": "30564",
        "totalOutputVolumeValue": "1465964.211",
        "averageNumberOfTransactionsPerBlock": "182"
    },
    {
        "month": "11",
        "day": "9",
        "year": "2012",
        "price": "11.07",
        "totalCirculation": "10361000",
        "totalTransactionFees": "20.56769981",
        "numberOfUniqueBitcoinAddressesUsed": "28883",
        "totalOutputVolumeValue": "995659.2847",
        "averageNumberOfTransactionsPerBlock": "202"
    },
    {
        "month": "11",
        "day": "10",
        "year": "2012",
        "price": "10.95899",
        "totalCirculation": "10369000",
        "totalTransactionFees": "21.42115168",
        "numberOfUniqueBitcoinAddressesUsed": "24961",
        "totalOutputVolumeValue": "481900.2784",
        "averageNumberOfTransactionsPerBlock": "277"
    },
    {
        "month": "11",
        "day": "11",
        "year": "2012",
        "price": "10.939",
        "totalCirculation": "10375600",
        "totalTransactionFees": "17.92127199",
        "numberOfUniqueBitcoinAddressesUsed": "21483",
        "totalOutputVolumeValue": "375713.6753",
        "averageNumberOfTransactionsPerBlock": "264"
    },
    {
        "month": "11",
        "day": "12",
        "year": "2012",
        "price": "11.18",
        "totalCirculation": "10382650",
        "totalTransactionFees": "18.20735207",
        "numberOfUniqueBitcoinAddressesUsed": "26835",
        "totalOutputVolumeValue": "545937.8387",
        "averageNumberOfTransactionsPerBlock": "243"
    },
    {
        "month": "11",
        "day": "13",
        "year": "2012",
        "price": "11.129",
        "totalCirculation": "10389450",
        "totalTransactionFees": "18.42871936",
        "numberOfUniqueBitcoinAddressesUsed": "23713",
        "totalOutputVolumeValue": "496141.068",
        "averageNumberOfTransactionsPerBlock": "208"
    },
    {
        "month": "11",
        "day": "14",
        "year": "2012",
        "price": "11.05",
        "totalCirculation": "10396650",
        "totalTransactionFees": "22.71522209",
        "numberOfUniqueBitcoinAddressesUsed": "27765",
        "totalOutputVolumeValue": "1253459.552",
        "averageNumberOfTransactionsPerBlock": "285"
    },
    {
        "month": "11",
        "day": "15",
        "year": "2012",
        "price": "11.114",
        "totalCirculation": "10403450",
        "totalTransactionFees": "29.56062276",
        "numberOfUniqueBitcoinAddressesUsed": "34437",
        "totalOutputVolumeValue": "2726951.542",
        "averageNumberOfTransactionsPerBlock": "236"
    },
    {
        "month": "11",
        "day": "16",
        "year": "2012",
        "price": "11.8",
        "totalCirculation": "10410500",
        "totalTransactionFees": "32.35921036",
        "numberOfUniqueBitcoinAddressesUsed": "33886",
        "totalOutputVolumeValue": "3104026.869",
        "averageNumberOfTransactionsPerBlock": "267"
    },
    {
        "month": "11",
        "day": "17",
        "year": "2012",
        "price": "11.8",
        "totalCirculation": "10417550",
        "totalTransactionFees": "27.92768269",
        "numberOfUniqueBitcoinAddressesUsed": "45125",
        "totalOutputVolumeValue": "3247990.843",
        "averageNumberOfTransactionsPerBlock": "224"
    },
    {
        "month": "11",
        "day": "18",
        "year": "2012",
        "price": "11.832",
        "totalCirculation": "10425500",
        "totalTransactionFees": "25.4443562",
        "numberOfUniqueBitcoinAddressesUsed": "32677",
        "totalOutputVolumeValue": "2130380.056",
        "averageNumberOfTransactionsPerBlock": "217"
    },
    {
        "month": "11",
        "day": "19",
        "year": "2012",
        "price": "11.79998",
        "totalCirculation": "10431650",
        "totalTransactionFees": "27.02349917",
        "numberOfUniqueBitcoinAddressesUsed": "34545",
        "totalOutputVolumeValue": "1448137.128",
        "averageNumberOfTransactionsPerBlock": "180"
    },
    {
        "month": "11",
        "day": "20",
        "year": "2012",
        "price": "11.84",
        "totalCirculation": "10439600",
        "totalTransactionFees": "28.15159803",
        "numberOfUniqueBitcoinAddressesUsed": "34632",
        "totalOutputVolumeValue": "1593483.956",
        "averageNumberOfTransactionsPerBlock": "246"
    },
    {
        "month": "11",
        "day": "21",
        "year": "2012",
        "price": "11.784",
        "totalCirculation": "10447300",
        "totalTransactionFees": "32.87941782",
        "numberOfUniqueBitcoinAddressesUsed": "34618",
        "totalOutputVolumeValue": "1068059.971",
        "averageNumberOfTransactionsPerBlock": "218"
    },
    {
        "month": "11",
        "day": "22",
        "year": "2012",
        "price": "12.28",
        "totalCirculation": "10454650",
        "totalTransactionFees": "23.86825165",
        "numberOfUniqueBitcoinAddressesUsed": "32823",
        "totalOutputVolumeValue": "1217516.937",
        "averageNumberOfTransactionsPerBlock": "194"
    },
    {
        "month": "11",
        "day": "23",
        "year": "2012",
        "price": "12.43",
        "totalCirculation": "10461900",
        "totalTransactionFees": "23.99715144",
        "numberOfUniqueBitcoinAddressesUsed": "26731",
        "totalOutputVolumeValue": "1267259.82",
        "averageNumberOfTransactionsPerBlock": "216"
    },
    {
        "month": "11",
        "day": "24",
        "year": "2012",
        "price": "12.4108",
        "totalCirculation": "10470000",
        "totalTransactionFees": "22.73202401",
        "numberOfUniqueBitcoinAddressesUsed": "27215",
        "totalOutputVolumeValue": "1143992.612",
        "averageNumberOfTransactionsPerBlock": "236"
    },
    {
        "month": "11",
        "day": "25",
        "year": "2012",
        "price": "12.6",
        "totalCirculation": "10477050",
        "totalTransactionFees": "27.71888794",
        "numberOfUniqueBitcoinAddressesUsed": "27411",
        "totalOutputVolumeValue": "895674.0111",
        "averageNumberOfTransactionsPerBlock": "219"
    },
    {
        "month": "11",
        "day": "26",
        "year": "2012",
        "price": "12.6515",
        "totalCirculation": "10485000",
        "totalTransactionFees": "27.27039836",
        "numberOfUniqueBitcoinAddressesUsed": "28774",
        "totalOutputVolumeValue": "1074930.33",
        "averageNumberOfTransactionsPerBlock": "235"
    },
    {
        "month": "11",
        "day": "27",
        "year": "2012",
        "price": "12.52999",
        "totalCirculation": "10492600",
        "totalTransactionFees": "79.95789105",
        "numberOfUniqueBitcoinAddressesUsed": "31418",
        "totalOutputVolumeValue": "1282833.442",
        "averageNumberOfTransactionsPerBlock": "136"
    },
    {
        "month": "11",
        "day": "28",
        "year": "2012",
        "price": "12.40712",
        "totalCirculation": "10500525",
        "totalTransactionFees": "44.72614721",
        "numberOfUniqueBitcoinAddressesUsed": "33542",
        "totalOutputVolumeValue": "1892894.257",
        "averageNumberOfTransactionsPerBlock": "149"
    },
    {
        "month": "11",
        "day": "29",
        "year": "2012",
        "price": "12.599",
        "totalCirculation": "10504650",
        "totalTransactionFees": "30.9318334",
        "numberOfUniqueBitcoinAddressesUsed": "32816",
        "totalOutputVolumeValue": "1387531.545",
        "averageNumberOfTransactionsPerBlock": "252"
    },
    {
        "month": "11",
        "day": "30",
        "year": "2012",
        "price": "12.65",
        "totalCirculation": "10507875",
        "totalTransactionFees": "21.88004872",
        "numberOfUniqueBitcoinAddressesUsed": "27705",
        "totalOutputVolumeValue": "871782.2662",
        "averageNumberOfTransactionsPerBlock": "276"
    },
    {
        "month": "12",
        "day": "1",
        "year": "2012",
        "price": "12.68778",
        "totalCirculation": "10511875",
        "totalTransactionFees": "29.99228087",
        "numberOfUniqueBitcoinAddressesUsed": "29164",
        "totalOutputVolumeValue": "606808.3905",
        "averageNumberOfTransactionsPerBlock": "260"
    },
    {
        "month": "12",
        "day": "2",
        "year": "2012",
        "price": "12.68",
        "totalCirculation": "10515650",
        "totalTransactionFees": "15.02822634",
        "numberOfUniqueBitcoinAddressesUsed": "21186",
        "totalOutputVolumeValue": "631736.5815",
        "averageNumberOfTransactionsPerBlock": "265"
    },
    {
        "month": "12",
        "day": "3",
        "year": "2012",
        "price": "12.67901",
        "totalCirculation": "10519400",
        "totalTransactionFees": "18.85263816",
        "numberOfUniqueBitcoinAddressesUsed": "23333",
        "totalOutputVolumeValue": "1922115.722",
        "averageNumberOfTransactionsPerBlock": "235"
    },
    {
        "month": "12",
        "day": "4",
        "year": "2012",
        "price": "12.96675",
        "totalCirculation": "10522175",
        "totalTransactionFees": "24.16998401",
        "numberOfUniqueBitcoinAddressesUsed": "26758",
        "totalOutputVolumeValue": "2186081.698",
        "averageNumberOfTransactionsPerBlock": "252"
    },
    {
        "month": "12",
        "day": "5",
        "year": "2012",
        "price": "13.5",
        "totalCirculation": "10525175",
        "totalTransactionFees": "26.6733515",
        "numberOfUniqueBitcoinAddressesUsed": "32849",
        "totalOutputVolumeValue": "2965970.432",
        "averageNumberOfTransactionsPerBlock": "270"
    },
    {
        "month": "12",
        "day": "6",
        "year": "2012",
        "price": "13.6888",
        "totalCirculation": "10528750",
        "totalTransactionFees": "31.05820845",
        "numberOfUniqueBitcoinAddressesUsed": "29988",
        "totalOutputVolumeValue": "3060984.558",
        "averageNumberOfTransactionsPerBlock": "250"
    },
    {
        "month": "12",
        "day": "7",
        "year": "2012",
        "price": "13.68",
        "totalCirculation": "10531850",
        "totalTransactionFees": "25.9703386",
        "numberOfUniqueBitcoinAddressesUsed": "29236",
        "totalOutputVolumeValue": "2560250.21",
        "averageNumberOfTransactionsPerBlock": "273"
    },
    {
        "month": "12",
        "day": "8",
        "year": "2012",
        "price": "13.55",
        "totalCirculation": "10535225",
        "totalTransactionFees": "25.06019442",
        "numberOfUniqueBitcoinAddressesUsed": "29214",
        "totalOutputVolumeValue": "1004848.061",
        "averageNumberOfTransactionsPerBlock": "296"
    },
    {
        "month": "12",
        "day": "9",
        "year": "2012",
        "price": "13.53",
        "totalCirculation": "10538475",
        "totalTransactionFees": "24.43926299",
        "numberOfUniqueBitcoinAddressesUsed": "29112",
        "totalOutputVolumeValue": "874186.4771",
        "averageNumberOfTransactionsPerBlock": "398"
    },
    {
        "month": "12",
        "day": "10",
        "year": "2012",
        "price": "13.55",
        "totalCirculation": "10542025",
        "totalTransactionFees": "32.60099193",
        "numberOfUniqueBitcoinAddressesUsed": "26865",
        "totalOutputVolumeValue": "1504578.161",
        "averageNumberOfTransactionsPerBlock": "284"
    },
    {
        "month": "12",
        "day": "11",
        "year": "2012",
        "price": "13.63999",
        "totalCirculation": "10545650",
        "totalTransactionFees": "30.6428106",
        "numberOfUniqueBitcoinAddressesUsed": "28917",
        "totalOutputVolumeValue": "1564854.133",
        "averageNumberOfTransactionsPerBlock": "295"
    },
    {
        "month": "12",
        "day": "12",
        "year": "2012",
        "price": "13.63999",
        "totalCirculation": "10548875",
        "totalTransactionFees": "27.61405036",
        "numberOfUniqueBitcoinAddressesUsed": "30888",
        "totalOutputVolumeValue": "3267489.012",
        "averageNumberOfTransactionsPerBlock": "324"
    },
    {
        "month": "12",
        "day": "13",
        "year": "2012",
        "price": "13.79989",
        "totalCirculation": "10552275",
        "totalTransactionFees": "42.77546793",
        "numberOfUniqueBitcoinAddressesUsed": "33996",
        "totalOutputVolumeValue": "3435404.336",
        "averageNumberOfTransactionsPerBlock": "369"
    },
    {
        "month": "12",
        "day": "14",
        "year": "2012",
        "price": "13.90119",
        "totalCirculation": "10554875",
        "totalTransactionFees": "32.88696018",
        "numberOfUniqueBitcoinAddressesUsed": "33491",
        "totalOutputVolumeValue": "3494315.456",
        "averageNumberOfTransactionsPerBlock": "342"
    },
    {
        "month": "12",
        "day": "15",
        "year": "2012",
        "price": "13.7722",
        "totalCirculation": "10557825",
        "totalTransactionFees": "26.426188",
        "numberOfUniqueBitcoinAddressesUsed": "27511",
        "totalOutputVolumeValue": "1776620.592",
        "averageNumberOfTransactionsPerBlock": "334"
    },
    {
        "month": "12",
        "day": "16",
        "year": "2012",
        "price": "13.66548",
        "totalCirculation": "10560700",
        "totalTransactionFees": "27.40011287",
        "numberOfUniqueBitcoinAddressesUsed": "28933",
        "totalOutputVolumeValue": "1672238.068",
        "averageNumberOfTransactionsPerBlock": "336"
    },
    {
        "month": "12",
        "day": "17",
        "year": "2012",
        "price": "13.498",
        "totalCirculation": "10563850",
        "totalTransactionFees": "32.24930878",
        "numberOfUniqueBitcoinAddressesUsed": "32044",
        "totalOutputVolumeValue": "1899292.231",
        "averageNumberOfTransactionsPerBlock": "361"
    },
    {
        "month": "12",
        "day": "18",
        "year": "2012",
        "price": "13.399",
        "totalCirculation": "10567000",
        "totalTransactionFees": "37.08634431",
        "numberOfUniqueBitcoinAddressesUsed": "38406",
        "totalOutputVolumeValue": "2370518.372",
        "averageNumberOfTransactionsPerBlock": "284"
    },
    {
        "month": "12",
        "day": "19",
        "year": "2012",
        "price": "13.399",
        "totalCirculation": "10570575",
        "totalTransactionFees": "39.25169662",
        "numberOfUniqueBitcoinAddressesUsed": "36002",
        "totalOutputVolumeValue": "1257458.531",
        "averageNumberOfTransactionsPerBlock": "292"
    },
    {
        "month": "12",
        "day": "20",
        "year": "2012",
        "price": "13.72",
        "totalCirculation": "10573275",
        "totalTransactionFees": "30.62284069",
        "numberOfUniqueBitcoinAddressesUsed": "30200",
        "totalOutputVolumeValue": "940555.609",
        "averageNumberOfTransactionsPerBlock": "224"
    },
    {
        "month": "12",
        "day": "21",
        "year": "2012",
        "price": "13.6475",
        "totalCirculation": "10576300",
        "totalTransactionFees": "35.57252966",
        "numberOfUniqueBitcoinAddressesUsed": "32608",
        "totalOutputVolumeValue": "1599689.198",
        "averageNumberOfTransactionsPerBlock": "248"
    },
    {
        "month": "12",
        "day": "22",
        "year": "2012",
        "price": "13.58998",
        "totalCirculation": "10579900",
        "totalTransactionFees": "39.98089285",
        "numberOfUniqueBitcoinAddressesUsed": "43693",
        "totalOutputVolumeValue": "1513456.938",
        "averageNumberOfTransactionsPerBlock": "267"
    },
    {
        "month": "12",
        "day": "23",
        "year": "2012",
        "price": "13.48547",
        "totalCirculation": "10583350",
        "totalTransactionFees": "32.40114679",
        "numberOfUniqueBitcoinAddressesUsed": "32573",
        "totalOutputVolumeValue": "924770.427",
        "averageNumberOfTransactionsPerBlock": "269"
    },
    {
        "month": "12",
        "day": "24",
        "year": "2012",
        "price": "13.45",
        "totalCirculation": "10586525",
        "totalTransactionFees": "30.76535974",
        "numberOfUniqueBitcoinAddressesUsed": "29026",
        "totalOutputVolumeValue": "1001040.022",
        "averageNumberOfTransactionsPerBlock": "292"
    },
    {
        "month": "12",
        "day": "25",
        "year": "2012",
        "price": "13.45",
        "totalCirculation": "10589600",
        "totalTransactionFees": "21.56338759",
        "numberOfUniqueBitcoinAddressesUsed": "25045",
        "totalOutputVolumeValue": "719758.5757",
        "averageNumberOfTransactionsPerBlock": "273"
    },
    {
        "month": "12",
        "day": "26",
        "year": "2012",
        "price": "13.3989",
        "totalCirculation": "10593200",
        "totalTransactionFees": "29.20703966",
        "numberOfUniqueBitcoinAddressesUsed": "24110",
        "totalOutputVolumeValue": "507380.1259",
        "averageNumberOfTransactionsPerBlock": "203"
    },
    {
        "month": "12",
        "day": "27",
        "year": "2012",
        "price": "13.47",
        "totalCirculation": "10597225",
        "totalTransactionFees": "35.43010858",
        "numberOfUniqueBitcoinAddressesUsed": "27812",
        "totalOutputVolumeValue": "824369.1215",
        "averageNumberOfTransactionsPerBlock": "174"
    },
    {
        "month": "12",
        "day": "28",
        "year": "2012",
        "price": "13.6499",
        "totalCirculation": "10601625",
        "totalTransactionFees": "38.51894572",
        "numberOfUniqueBitcoinAddressesUsed": "31561",
        "totalOutputVolumeValue": "1042278.614",
        "averageNumberOfTransactionsPerBlock": "249"
    },
    {
        "month": "12",
        "day": "29",
        "year": "2012",
        "price": "13.67",
        "totalCirculation": "10604975",
        "totalTransactionFees": "30.58246185",
        "numberOfUniqueBitcoinAddressesUsed": "30563",
        "totalOutputVolumeValue": "1082114.463",
        "averageNumberOfTransactionsPerBlock": "258"
    },
    {
        "month": "12",
        "day": "30",
        "year": "2012",
        "price": "13.56998",
        "totalCirculation": "10608975",
        "totalTransactionFees": "35.09140165",
        "numberOfUniqueBitcoinAddressesUsed": "35482",
        "totalOutputVolumeValue": "763956.5505",
        "averageNumberOfTransactionsPerBlock": "354"
    },
    {
        "month": "12",
        "day": "31",
        "year": "2012",
        "price": "13.59",
        "totalCirculation": "10613175",
        "totalTransactionFees": "26.99566664",
        "numberOfUniqueBitcoinAddressesUsed": "29019",
        "totalOutputVolumeValue": "1167821.549",
        "averageNumberOfTransactionsPerBlock": "261"
    },
    {
        "month": "1",
        "day": "1",
        "year": "2013",
        "price": "13.561",
        "totalCirculation": "10617275",
        "totalTransactionFees": "23.37476946",
        "numberOfUniqueBitcoinAddressesUsed": "26713",
        "totalOutputVolumeValue": "1526842.034",
        "averageNumberOfTransactionsPerBlock": "243"
    },
    {
        "month": "1",
        "day": "2",
        "year": "2013",
        "price": "13.4",
        "totalCirculation": "10621175",
        "totalTransactionFees": "29.18198114",
        "numberOfUniqueBitcoinAddressesUsed": "33739",
        "totalOutputVolumeValue": "1942580.394",
        "averageNumberOfTransactionsPerBlock": "244"
    },
    {
        "month": "1",
        "day": "3",
        "year": "2013",
        "price": "13.464",
        "totalCirculation": "10625175",
        "totalTransactionFees": "35.68268787",
        "numberOfUniqueBitcoinAddressesUsed": "38262",
        "totalOutputVolumeValue": "1638132.312",
        "averageNumberOfTransactionsPerBlock": "245"
    },
    {
        "month": "1",
        "day": "4",
        "year": "2013",
        "price": "13.48986",
        "totalCirculation": "10628700",
        "totalTransactionFees": "42.89840546",
        "numberOfUniqueBitcoinAddressesUsed": "37428",
        "totalOutputVolumeValue": "2368655.154",
        "averageNumberOfTransactionsPerBlock": "323"
    },
    {
        "month": "1",
        "day": "5",
        "year": "2013",
        "price": "13.548",
        "totalCirculation": "10632425",
        "totalTransactionFees": "30.06402764",
        "numberOfUniqueBitcoinAddressesUsed": "41926",
        "totalOutputVolumeValue": "2270235.331",
        "averageNumberOfTransactionsPerBlock": "352"
    },
    {
        "month": "1",
        "day": "6",
        "year": "2013",
        "price": "13.52999",
        "totalCirculation": "10635975",
        "totalTransactionFees": "37.02643176",
        "numberOfUniqueBitcoinAddressesUsed": "33185",
        "totalOutputVolumeValue": "1053569.599",
        "averageNumberOfTransactionsPerBlock": "451"
    },
    {
        "month": "1",
        "day": "7",
        "year": "2013",
        "price": "13.535",
        "totalCirculation": "10640150",
        "totalTransactionFees": "34.80264212",
        "numberOfUniqueBitcoinAddressesUsed": "39233",
        "totalOutputVolumeValue": "1302255.4",
        "averageNumberOfTransactionsPerBlock": "393"
    },
    {
        "month": "1",
        "day": "8",
        "year": "2013",
        "price": "13.83",
        "totalCirculation": "10643750",
        "totalTransactionFees": "29.80098536",
        "numberOfUniqueBitcoinAddressesUsed": "36996",
        "totalOutputVolumeValue": "2088660.789",
        "averageNumberOfTransactionsPerBlock": "383"
    },
    {
        "month": "1",
        "day": "9",
        "year": "2013",
        "price": "13.87998",
        "totalCirculation": "10647100",
        "totalTransactionFees": "33.87855401",
        "numberOfUniqueBitcoinAddressesUsed": "40935",
        "totalOutputVolumeValue": "1849614.702",
        "averageNumberOfTransactionsPerBlock": "284"
    },
    {
        "month": "1",
        "day": "10",
        "year": "2013",
        "price": "14.32",
        "totalCirculation": "10650750",
        "totalTransactionFees": "152.1727259",
        "numberOfUniqueBitcoinAddressesUsed": "43702",
        "totalOutputVolumeValue": "1391896.029",
        "averageNumberOfTransactionsPerBlock": "359"
    },
    {
        "month": "1",
        "day": "11",
        "year": "2013",
        "price": "14.29999",
        "totalCirculation": "10653775",
        "totalTransactionFees": "44.13601946",
        "numberOfUniqueBitcoinAddressesUsed": "48496",
        "totalOutputVolumeValue": "1436539.471",
        "averageNumberOfTransactionsPerBlock": "424"
    },
    {
        "month": "1",
        "day": "12",
        "year": "2013",
        "price": "14.34999",
        "totalCirculation": "10656750",
        "totalTransactionFees": "38.36175715",
        "numberOfUniqueBitcoinAddressesUsed": "37486",
        "totalOutputVolumeValue": "1014169.554",
        "averageNumberOfTransactionsPerBlock": "390"
    },
    {
        "month": "1",
        "day": "13",
        "year": "2013",
        "price": "14.3148",
        "totalCirculation": "10659800",
        "totalTransactionFees": "35.86482633",
        "numberOfUniqueBitcoinAddressesUsed": "40823",
        "totalOutputVolumeValue": "936443.1611",
        "averageNumberOfTransactionsPerBlock": "407"
    },
    {
        "month": "1",
        "day": "14",
        "year": "2013",
        "price": "14.3",
        "totalCirculation": "10663650",
        "totalTransactionFees": "35.47591933",
        "numberOfUniqueBitcoinAddressesUsed": "32734",
        "totalOutputVolumeValue": "868829.0745",
        "averageNumberOfTransactionsPerBlock": "400"
    },
    {
        "month": "1",
        "day": "15",
        "year": "2013",
        "price": "14.47899",
        "totalCirculation": "10666825",
        "totalTransactionFees": "34.17528217",
        "numberOfUniqueBitcoinAddressesUsed": "46112",
        "totalOutputVolumeValue": "1895510.479",
        "averageNumberOfTransactionsPerBlock": "315"
    },
    {
        "month": "1",
        "day": "16",
        "year": "2013",
        "price": "14.689",
        "totalCirculation": "10669900",
        "totalTransactionFees": "40.03464889",
        "numberOfUniqueBitcoinAddressesUsed": "45312",
        "totalOutputVolumeValue": "2368253.173",
        "averageNumberOfTransactionsPerBlock": "283"
    },
    {
        "month": "1",
        "day": "17",
        "year": "2013",
        "price": "15.39",
        "totalCirculation": "10672975",
        "totalTransactionFees": "36.8345206",
        "numberOfUniqueBitcoinAddressesUsed": "42042",
        "totalOutputVolumeValue": "1902268.458",
        "averageNumberOfTransactionsPerBlock": "314"
    },
    {
        "month": "1",
        "day": "18",
        "year": "2013",
        "price": "15.985",
        "totalCirculation": "10676100",
        "totalTransactionFees": "39.75901296",
        "numberOfUniqueBitcoinAddressesUsed": "44445",
        "totalOutputVolumeValue": "1579630.056",
        "averageNumberOfTransactionsPerBlock": "360"
    },
    {
        "month": "1",
        "day": "19",
        "year": "2013",
        "price": "15.84304",
        "totalCirculation": "10679625",
        "totalTransactionFees": "63.02193154",
        "numberOfUniqueBitcoinAddressesUsed": "38673",
        "totalOutputVolumeValue": "1747204.614",
        "averageNumberOfTransactionsPerBlock": "314"
    },
    {
        "month": "1",
        "day": "20",
        "year": "2013",
        "price": "15.89",
        "totalCirculation": "10682925",
        "totalTransactionFees": "33.70685415",
        "numberOfUniqueBitcoinAddressesUsed": "34725",
        "totalOutputVolumeValue": "1163691.83",
        "averageNumberOfTransactionsPerBlock": "331"
    },
    {
        "month": "1",
        "day": "21",
        "year": "2013",
        "price": "16.98",
        "totalCirculation": "10686575",
        "totalTransactionFees": "30.62610484",
        "numberOfUniqueBitcoinAddressesUsed": "32882",
        "totalOutputVolumeValue": "1125356.295",
        "averageNumberOfTransactionsPerBlock": "356"
    },
    {
        "month": "1",
        "day": "22",
        "year": "2013",
        "price": "17.59",
        "totalCirculation": "10689775",
        "totalTransactionFees": "29.87214152",
        "numberOfUniqueBitcoinAddressesUsed": "37266",
        "totalOutputVolumeValue": "1388005.275",
        "averageNumberOfTransactionsPerBlock": "351"
    },
    {
        "month": "1",
        "day": "23",
        "year": "2013",
        "price": "17.5889",
        "totalCirculation": "10693125",
        "totalTransactionFees": "45.66376477",
        "numberOfUniqueBitcoinAddressesUsed": "36782",
        "totalOutputVolumeValue": "2199431.045",
        "averageNumberOfTransactionsPerBlock": "353"
    },
    {
        "month": "1",
        "day": "24",
        "year": "2013",
        "price": "19.18999",
        "totalCirculation": "10696825",
        "totalTransactionFees": "42.78012497",
        "numberOfUniqueBitcoinAddressesUsed": "39004",
        "totalOutputVolumeValue": "1697409.199",
        "averageNumberOfTransactionsPerBlock": "330"
    },
    {
        "month": "1",
        "day": "25",
        "year": "2013",
        "price": "18.8348",
        "totalCirculation": "10700300",
        "totalTransactionFees": "40.13334087",
        "numberOfUniqueBitcoinAddressesUsed": "39799",
        "totalOutputVolumeValue": "1850305.298",
        "averageNumberOfTransactionsPerBlock": "315"
    },
    {
        "month": "1",
        "day": "26",
        "year": "2013",
        "price": "17.61926",
        "totalCirculation": "10704050",
        "totalTransactionFees": "48.09323725",
        "numberOfUniqueBitcoinAddressesUsed": "40491",
        "totalOutputVolumeValue": "1390765.768",
        "averageNumberOfTransactionsPerBlock": "242"
    },
    {
        "month": "1",
        "day": "27",
        "year": "2013",
        "price": "17.99999",
        "totalCirculation": "10707850",
        "totalTransactionFees": "47.75957992",
        "numberOfUniqueBitcoinAddressesUsed": "40004",
        "totalOutputVolumeValue": "1225546.146",
        "averageNumberOfTransactionsPerBlock": "370"
    },
    {
        "month": "1",
        "day": "28",
        "year": "2013",
        "price": "18.45",
        "totalCirculation": "10711550",
        "totalTransactionFees": "42.66449033",
        "numberOfUniqueBitcoinAddressesUsed": "42353",
        "totalOutputVolumeValue": "1664814.38",
        "averageNumberOfTransactionsPerBlock": "365"
    },
    {
        "month": "1",
        "day": "29",
        "year": "2013",
        "price": "19.8",
        "totalCirculation": "10715600",
        "totalTransactionFees": "50.78193782",
        "numberOfUniqueBitcoinAddressesUsed": "41643",
        "totalOutputVolumeValue": "2197913.609",
        "averageNumberOfTransactionsPerBlock": "340"
    },
    {
        "month": "1",
        "day": "30",
        "year": "2013",
        "price": "19.7",
        "totalCirculation": "10719225",
        "totalTransactionFees": "39.13531897",
        "numberOfUniqueBitcoinAddressesUsed": "36938",
        "totalOutputVolumeValue": "2223436.633",
        "averageNumberOfTransactionsPerBlock": "326"
    },
    {
        "month": "1",
        "day": "31",
        "year": "2013",
        "price": "21.43",
        "totalCirculation": "10723975",
        "totalTransactionFees": "42.31036818",
        "numberOfUniqueBitcoinAddressesUsed": "34477",
        "totalOutputVolumeValue": "2389465.516",
        "averageNumberOfTransactionsPerBlock": "310"
    },
    {
        "month": "2",
        "day": "1",
        "year": "2013",
        "price": "21.3",
        "totalCirculation": "10727800",
        "totalTransactionFees": "49.20923656",
        "numberOfUniqueBitcoinAddressesUsed": "47420",
        "totalOutputVolumeValue": "1815712.841",
        "averageNumberOfTransactionsPerBlock": "290"
    },
    {
        "month": "2",
        "day": "2",
        "year": "2013",
        "price": "21.1",
        "totalCirculation": "10731825",
        "totalTransactionFees": "54.79985834",
        "numberOfUniqueBitcoinAddressesUsed": "45504",
        "totalOutputVolumeValue": "1401641.502",
        "averageNumberOfTransactionsPerBlock": "393"
    },
    {
        "month": "2",
        "day": "3",
        "year": "2013",
        "price": "20.68",
        "totalCirculation": "10735950",
        "totalTransactionFees": "72.35764756",
        "numberOfUniqueBitcoinAddressesUsed": "41758",
        "totalOutputVolumeValue": "1430890.763",
        "averageNumberOfTransactionsPerBlock": "433"
    },
    {
        "month": "2",
        "day": "4",
        "year": "2013",
        "price": "21.05",
        "totalCirculation": "10740350",
        "totalTransactionFees": "47.3593669",
        "numberOfUniqueBitcoinAddressesUsed": "41685",
        "totalOutputVolumeValue": "1808986.763",
        "averageNumberOfTransactionsPerBlock": "373"
    },
    {
        "month": "2",
        "day": "5",
        "year": "2013",
        "price": "20.79",
        "totalCirculation": "10744650",
        "totalTransactionFees": "42.90852642",
        "numberOfUniqueBitcoinAddressesUsed": "48193",
        "totalOutputVolumeValue": "2019250.363",
        "averageNumberOfTransactionsPerBlock": "349"
    },
    {
        "month": "2",
        "day": "6",
        "year": "2013",
        "price": "21.3339",
        "totalCirculation": "10748500",
        "totalTransactionFees": "33.47964254",
        "numberOfUniqueBitcoinAddressesUsed": "42634",
        "totalOutputVolumeValue": "1924319.453",
        "averageNumberOfTransactionsPerBlock": "370"
    },
    {
        "month": "2",
        "day": "7",
        "year": "2013",
        "price": "22.15",
        "totalCirculation": "10752200",
        "totalTransactionFees": "45.37600821",
        "numberOfUniqueBitcoinAddressesUsed": "44112",
        "totalOutputVolumeValue": "1741181.152",
        "averageNumberOfTransactionsPerBlock": "411"
    },
    {
        "month": "2",
        "day": "8",
        "year": "2013",
        "price": "22.15",
        "totalCirculation": "10756000",
        "totalTransactionFees": "53.57266767",
        "numberOfUniqueBitcoinAddressesUsed": "46037",
        "totalOutputVolumeValue": "2048030.687",
        "averageNumberOfTransactionsPerBlock": "365"
    },
    {
        "month": "2",
        "day": "9",
        "year": "2013",
        "price": "23.69997",
        "totalCirculation": "10759400",
        "totalTransactionFees": "41.81383069",
        "numberOfUniqueBitcoinAddressesUsed": "39368",
        "totalOutputVolumeValue": "1876122.146",
        "averageNumberOfTransactionsPerBlock": "328"
    },
    {
        "month": "2",
        "day": "10",
        "year": "2013",
        "price": "23.61458",
        "totalCirculation": "10763500",
        "totalTransactionFees": "43.83953143",
        "numberOfUniqueBitcoinAddressesUsed": "45554",
        "totalOutputVolumeValue": "1492597.605",
        "averageNumberOfTransactionsPerBlock": "326"
    },
    {
        "month": "2",
        "day": "11",
        "year": "2013",
        "price": "24.1955",
        "totalCirculation": "10767475",
        "totalTransactionFees": "49.32792778",
        "numberOfUniqueBitcoinAddressesUsed": "41240",
        "totalOutputVolumeValue": "1371392.959",
        "averageNumberOfTransactionsPerBlock": "270"
    },
    {
        "month": "2",
        "day": "12",
        "year": "2013",
        "price": "25.76997",
        "totalCirculation": "10771050",
        "totalTransactionFees": "48.61700477",
        "numberOfUniqueBitcoinAddressesUsed": "41227",
        "totalOutputVolumeValue": "1271739.572",
        "averageNumberOfTransactionsPerBlock": "270"
    },
    {
        "month": "2",
        "day": "13",
        "year": "2013",
        "price": "26.09999",
        "totalCirculation": "10774975",
        "totalTransactionFees": "51.50697092",
        "numberOfUniqueBitcoinAddressesUsed": "40152",
        "totalOutputVolumeValue": "1270390.863",
        "averageNumberOfTransactionsPerBlock": "287"
    },
    {
        "month": "2",
        "day": "14",
        "year": "2013",
        "price": "26.53092",
        "totalCirculation": "10779075",
        "totalTransactionFees": "49.49477446",
        "numberOfUniqueBitcoinAddressesUsed": "39268",
        "totalOutputVolumeValue": "1284821.739",
        "averageNumberOfTransactionsPerBlock": "334"
    },
    {
        "month": "2",
        "day": "15",
        "year": "2013",
        "price": "26.99898",
        "totalCirculation": "10783475",
        "totalTransactionFees": "53.36447438",
        "numberOfUniqueBitcoinAddressesUsed": "39955",
        "totalOutputVolumeValue": "1569728.285",
        "averageNumberOfTransactionsPerBlock": "333"
    },
    {
        "month": "2",
        "day": "16",
        "year": "2013",
        "price": "27.07009",
        "totalCirculation": "10788200",
        "totalTransactionFees": "53.91976276",
        "numberOfUniqueBitcoinAddressesUsed": "37901",
        "totalOutputVolumeValue": "1236901.977",
        "averageNumberOfTransactionsPerBlock": "299"
    },
    {
        "month": "2",
        "day": "17",
        "year": "2013",
        "price": "25.6083",
        "totalCirculation": "10792850",
        "totalTransactionFees": "49.1021201",
        "numberOfUniqueBitcoinAddressesUsed": "36500",
        "totalOutputVolumeValue": "1025415.926",
        "averageNumberOfTransactionsPerBlock": "365"
    },
    {
        "month": "2",
        "day": "18",
        "year": "2013",
        "price": "26.81565",
        "totalCirculation": "10796875",
        "totalTransactionFees": "39.08462929",
        "numberOfUniqueBitcoinAddressesUsed": "36918",
        "totalOutputVolumeValue": "1349064.956",
        "averageNumberOfTransactionsPerBlock": "366"
    },
    {
        "month": "2",
        "day": "19",
        "year": "2013",
        "price": "28.78999",
        "totalCirculation": "10801025",
        "totalTransactionFees": "50.51556581",
        "numberOfUniqueBitcoinAddressesUsed": "39259",
        "totalOutputVolumeValue": "1309651.245",
        "averageNumberOfTransactionsPerBlock": "352"
    },
    {
        "month": "2",
        "day": "20",
        "year": "2013",
        "price": "29.81231",
        "totalCirculation": "10805350",
        "totalTransactionFees": "48.65658234",
        "numberOfUniqueBitcoinAddressesUsed": "39597",
        "totalOutputVolumeValue": "1297382.488",
        "averageNumberOfTransactionsPerBlock": "334"
    },
    {
        "month": "2",
        "day": "21",
        "year": "2013",
        "price": "29.80012",
        "totalCirculation": "10810275",
        "totalTransactionFees": "47.39446",
        "numberOfUniqueBitcoinAddressesUsed": "42228",
        "totalOutputVolumeValue": "1107815.609",
        "averageNumberOfTransactionsPerBlock": "400"
    },
    {
        "month": "2",
        "day": "22",
        "year": "2013",
        "price": "30.901",
        "totalCirculation": "10814300",
        "totalTransactionFees": "56.97276299",
        "numberOfUniqueBitcoinAddressesUsed": "43549",
        "totalOutputVolumeValue": "1477965.614",
        "averageNumberOfTransactionsPerBlock": "310"
    },
    {
        "month": "2",
        "day": "23",
        "year": "2013",
        "price": "29.27998",
        "totalCirculation": "10818350",
        "totalTransactionFees": "49.74906996",
        "numberOfUniqueBitcoinAddressesUsed": "41330",
        "totalOutputVolumeValue": "1352726.486",
        "averageNumberOfTransactionsPerBlock": "356"
    },
    {
        "month": "2",
        "day": "24",
        "year": "2013",
        "price": "30.29777",
        "totalCirculation": "10822450",
        "totalTransactionFees": "46.36386186",
        "numberOfUniqueBitcoinAddressesUsed": "41919",
        "totalOutputVolumeValue": "1587736.628",
        "averageNumberOfTransactionsPerBlock": "416"
    },
    {
        "month": "2",
        "day": "25",
        "year": "2013",
        "price": "30.25001",
        "totalCirculation": "10827325",
        "totalTransactionFees": "64.694706",
        "numberOfUniqueBitcoinAddressesUsed": "43083",
        "totalOutputVolumeValue": "1901371.972",
        "averageNumberOfTransactionsPerBlock": "404"
    },
    {
        "month": "2",
        "day": "26",
        "year": "2013",
        "price": "31.179",
        "totalCirculation": "10831200",
        "totalTransactionFees": "54.54951162",
        "numberOfUniqueBitcoinAddressesUsed": "45961",
        "totalOutputVolumeValue": "1573298.696",
        "averageNumberOfTransactionsPerBlock": "326"
    },
    {
        "month": "2",
        "day": "27",
        "year": "2013",
        "price": "31.40181",
        "totalCirculation": "10836275",
        "totalTransactionFees": "52.05842396",
        "numberOfUniqueBitcoinAddressesUsed": "44197",
        "totalOutputVolumeValue": "1642449.476",
        "averageNumberOfTransactionsPerBlock": "367"
    },
    {
        "month": "2",
        "day": "28",
        "year": "2013",
        "price": "33.50001",
        "totalCirculation": "10840550",
        "totalTransactionFees": "61.69368024",
        "numberOfUniqueBitcoinAddressesUsed": "43778",
        "totalOutputVolumeValue": "1331847.075",
        "averageNumberOfTransactionsPerBlock": "373"
    },
    {
        "month": "3",
        "day": "1",
        "year": "2013",
        "price": "34.87799",
        "totalCirculation": "10844500",
        "totalTransactionFees": "71.21074427",
        "numberOfUniqueBitcoinAddressesUsed": "51127",
        "totalOutputVolumeValue": "1621906.509",
        "averageNumberOfTransactionsPerBlock": "410"
    },
    {
        "month": "3",
        "day": "2",
        "year": "2013",
        "price": "34.1808",
        "totalCirculation": "10848250",
        "totalTransactionFees": "54.50251001",
        "numberOfUniqueBitcoinAddressesUsed": "40918",
        "totalOutputVolumeValue": "1676548.779",
        "averageNumberOfTransactionsPerBlock": "410"
    },
    {
        "month": "3",
        "day": "3",
        "year": "2013",
        "price": "34.10007",
        "totalCirculation": "10852050",
        "totalTransactionFees": "41.44089193",
        "numberOfUniqueBitcoinAddressesUsed": "34273",
        "totalOutputVolumeValue": "1033499.41",
        "averageNumberOfTransactionsPerBlock": "443"
    },
    {
        "month": "3",
        "day": "4",
        "year": "2013",
        "price": "36.35",
        "totalCirculation": "10856425",
        "totalTransactionFees": "53.43016694",
        "numberOfUniqueBitcoinAddressesUsed": "40375",
        "totalOutputVolumeValue": "938719.5904",
        "averageNumberOfTransactionsPerBlock": "280"
    },
    {
        "month": "3",
        "day": "5",
        "year": "2013",
        "price": "40.04",
        "totalCirculation": "10860175",
        "totalTransactionFees": "51.15126817",
        "numberOfUniqueBitcoinAddressesUsed": "45553",
        "totalOutputVolumeValue": "1851112.582",
        "averageNumberOfTransactionsPerBlock": "385"
    },
    {
        "month": "3",
        "day": "6",
        "year": "2013",
        "price": "47.5",
        "totalCirculation": "10864225",
        "totalTransactionFees": "60.59100527",
        "numberOfUniqueBitcoinAddressesUsed": "52412",
        "totalOutputVolumeValue": "2208007.593",
        "averageNumberOfTransactionsPerBlock": "363"
    },
    {
        "month": "3",
        "day": "7",
        "year": "2013",
        "price": "42.49271",
        "totalCirculation": "10868025",
        "totalTransactionFees": "158.5014992",
        "numberOfUniqueBitcoinAddressesUsed": "51281",
        "totalOutputVolumeValue": "1653013.754",
        "averageNumberOfTransactionsPerBlock": "376"
    },
    {
        "month": "3",
        "day": "8",
        "year": "2013",
        "price": "42.98",
        "totalCirculation": "10871675",
        "totalTransactionFees": "55.6880887",
        "numberOfUniqueBitcoinAddressesUsed": "48391",
        "totalOutputVolumeValue": "1504043.042",
        "averageNumberOfTransactionsPerBlock": "364"
    },
    {
        "month": "3",
        "day": "9",
        "year": "2013",
        "price": "46.01112",
        "totalCirculation": "10875925",
        "totalTransactionFees": "39.84122112",
        "numberOfUniqueBitcoinAddressesUsed": "41355",
        "totalOutputVolumeValue": "874958.3781",
        "averageNumberOfTransactionsPerBlock": "318"
    },
    {
        "month": "3",
        "day": "10",
        "year": "2013",
        "price": "46.5",
        "totalCirculation": "10880550",
        "totalTransactionFees": "64.60075075",
        "numberOfUniqueBitcoinAddressesUsed": "45331",
        "totalOutputVolumeValue": "1273495.259",
        "averageNumberOfTransactionsPerBlock": "353"
    },
    {
        "month": "3",
        "day": "11",
        "year": "2013",
        "price": "47.7397",
        "totalCirculation": "10885200",
        "totalTransactionFees": "56.8499929",
        "numberOfUniqueBitcoinAddressesUsed": "42498",
        "totalOutputVolumeValue": "1090979.462",
        "averageNumberOfTransactionsPerBlock": "246"
    },
    {
        "month": "3",
        "day": "12",
        "year": "2013",
        "price": "45.01771",
        "totalCirculation": "10888150",
        "totalTransactionFees": "50.36590821",
        "numberOfUniqueBitcoinAddressesUsed": "39137",
        "totalOutputVolumeValue": "1280750.739",
        "averageNumberOfTransactionsPerBlock": "168"
    },
    {
        "month": "3",
        "day": "13",
        "year": "2013",
        "price": "46.79999",
        "totalCirculation": "10892000",
        "totalTransactionFees": "63.01622716",
        "numberOfUniqueBitcoinAddressesUsed": "54264",
        "totalOutputVolumeValue": "1598992.55",
        "averageNumberOfTransactionsPerBlock": "220"
    },
    {
        "month": "3",
        "day": "14",
        "year": "2013",
        "price": "47.27589",
        "totalCirculation": "10896625",
        "totalTransactionFees": "55.59309207",
        "numberOfUniqueBitcoinAddressesUsed": "47557",
        "totalOutputVolumeValue": "1278859.217",
        "averageNumberOfTransactionsPerBlock": "247"
    },
    {
        "month": "3",
        "day": "15",
        "year": "2013",
        "price": "47.25005",
        "totalCirculation": "10900875",
        "totalTransactionFees": "62.68231527",
        "numberOfUniqueBitcoinAddressesUsed": "51067",
        "totalOutputVolumeValue": "4072067.006",
        "averageNumberOfTransactionsPerBlock": "227"
    },
    {
        "month": "3",
        "day": "16",
        "year": "2013",
        "price": "47.11",
        "totalCirculation": "10905275",
        "totalTransactionFees": "37.94693049",
        "numberOfUniqueBitcoinAddressesUsed": "42592",
        "totalOutputVolumeValue": "3481094.35",
        "averageNumberOfTransactionsPerBlock": "241"
    },
    {
        "month": "3",
        "day": "17",
        "year": "2013",
        "price": "47.4419",
        "totalCirculation": "10910350",
        "totalTransactionFees": "31.01708237",
        "numberOfUniqueBitcoinAddressesUsed": "41008",
        "totalOutputVolumeValue": "990629.7085",
        "averageNumberOfTransactionsPerBlock": "267"
    },
    {
        "month": "3",
        "day": "18",
        "year": "2013",
        "price": "47.65",
        "totalCirculation": "10914825",
        "totalTransactionFees": "36.37341092",
        "numberOfUniqueBitcoinAddressesUsed": "42920",
        "totalOutputVolumeValue": "1640629.404",
        "averageNumberOfTransactionsPerBlock": "276"
    },
    {
        "month": "3",
        "day": "19",
        "year": "2013",
        "price": "57.76",
        "totalCirculation": "10919750",
        "totalTransactionFees": "53.53768945",
        "numberOfUniqueBitcoinAddressesUsed": "52355",
        "totalOutputVolumeValue": "3904974.877",
        "averageNumberOfTransactionsPerBlock": "229"
    },
    {
        "month": "3",
        "day": "20",
        "year": "2013",
        "price": "63.40967",
        "totalCirculation": "10924425",
        "totalTransactionFees": "34.14708481",
        "numberOfUniqueBitcoinAddressesUsed": "49153",
        "totalOutputVolumeValue": "1907336.63",
        "averageNumberOfTransactionsPerBlock": "375"
    },
    {
        "month": "3",
        "day": "21",
        "year": "2013",
        "price": "73.8",
        "totalCirculation": "10930000",
        "totalTransactionFees": "46.79446898",
        "numberOfUniqueBitcoinAddressesUsed": "51230",
        "totalOutputVolumeValue": "1692764.318",
        "averageNumberOfTransactionsPerBlock": "302"
    },
    {
        "month": "3",
        "day": "22",
        "year": "2013",
        "price": "71.5",
        "totalCirculation": "10935625",
        "totalTransactionFees": "64.6326007",
        "numberOfUniqueBitcoinAddressesUsed": "58318",
        "totalOutputVolumeValue": "1872881.849",
        "averageNumberOfTransactionsPerBlock": "412"
    },
    {
        "month": "3",
        "day": "23",
        "year": "2013",
        "price": "63",
        "totalCirculation": "10940875",
        "totalTransactionFees": "62.01260975",
        "numberOfUniqueBitcoinAddressesUsed": "50716",
        "totalOutputVolumeValue": "1496233.098",
        "averageNumberOfTransactionsPerBlock": "319"
    },
    {
        "month": "3",
        "day": "24",
        "year": "2013",
        "price": "70.1",
        "totalCirculation": "10946300",
        "totalTransactionFees": "38.61417031",
        "numberOfUniqueBitcoinAddressesUsed": "57950",
        "totalOutputVolumeValue": "1082056.08",
        "averageNumberOfTransactionsPerBlock": "363"
    },
    {
        "month": "3",
        "day": "25",
        "year": "2013",
        "price": "73.88798",
        "totalCirculation": "10949700",
        "totalTransactionFees": "47.36378797",
        "numberOfUniqueBitcoinAddressesUsed": "51092",
        "totalOutputVolumeValue": "1428160.792",
        "averageNumberOfTransactionsPerBlock": "360"
    },
    {
        "month": "3",
        "day": "26",
        "year": "2013",
        "price": "78",
        "totalCirculation": "10953600",
        "totalTransactionFees": "43.96831871",
        "numberOfUniqueBitcoinAddressesUsed": "56598",
        "totalOutputVolumeValue": "1381606.593",
        "averageNumberOfTransactionsPerBlock": "283"
    },
    {
        "month": "3",
        "day": "27",
        "year": "2013",
        "price": "88.9",
        "totalCirculation": "10956750",
        "totalTransactionFees": "58.81127579",
        "numberOfUniqueBitcoinAddressesUsed": "56615",
        "totalOutputVolumeValue": "3055075.436",
        "averageNumberOfTransactionsPerBlock": "240"
    },
    {
        "month": "3",
        "day": "28",
        "year": "2013",
        "price": "93.56701",
        "totalCirculation": "10961225",
        "totalTransactionFees": "45.41463054",
        "numberOfUniqueBitcoinAddressesUsed": "65540",
        "totalOutputVolumeValue": "1882944.373",
        "averageNumberOfTransactionsPerBlock": "344"
    },
    {
        "month": "3",
        "day": "29",
        "year": "2013",
        "price": "89.05",
        "totalCirculation": "10965775",
        "totalTransactionFees": "76.29513174",
        "numberOfUniqueBitcoinAddressesUsed": "69638",
        "totalOutputVolumeValue": "1552824.38",
        "averageNumberOfTransactionsPerBlock": "366"
    },
    {
        "month": "3",
        "day": "30",
        "year": "2013",
        "price": "90.99999",
        "totalCirculation": "10969925",
        "totalTransactionFees": "45.94568999",
        "numberOfUniqueBitcoinAddressesUsed": "60390",
        "totalOutputVolumeValue": "1765378.993",
        "averageNumberOfTransactionsPerBlock": "431"
    },
    {
        "month": "3",
        "day": "31",
        "year": "2013",
        "price": "92.50001",
        "totalCirculation": "10973850",
        "totalTransactionFees": "54.29219339",
        "numberOfUniqueBitcoinAddressesUsed": "49192",
        "totalOutputVolumeValue": "1559233.902",
        "averageNumberOfTransactionsPerBlock": "389"
    },
    {
        "month": "4",
        "day": "1",
        "year": "2013",
        "price": "102.51001",
        "totalCirculation": "10979300",
        "totalTransactionFees": "53.03664377",
        "numberOfUniqueBitcoinAddressesUsed": "55367",
        "totalOutputVolumeValue": "1340646.518",
        "averageNumberOfTransactionsPerBlock": "340"
    },
    {
        "month": "4",
        "day": "2",
        "year": "2013",
        "price": "108.73",
        "totalCirculation": "10983675",
        "totalTransactionFees": "57.61575904",
        "numberOfUniqueBitcoinAddressesUsed": "70819",
        "totalOutputVolumeValue": "2511772.575",
        "averageNumberOfTransactionsPerBlock": "363"
    },
    {
        "month": "4",
        "day": "3",
        "year": "2013",
        "price": "138.79",
        "totalCirculation": "10988125",
        "totalTransactionFees": "72.7152671",
        "numberOfUniqueBitcoinAddressesUsed": "85804",
        "totalOutputVolumeValue": "2426363.037",
        "averageNumberOfTransactionsPerBlock": "375"
    },
    {
        "month": "4",
        "day": "4",
        "year": "2013",
        "price": "131.99899",
        "totalCirculation": "10992125",
        "totalTransactionFees": "79.62487035",
        "numberOfUniqueBitcoinAddressesUsed": "86046",
        "totalOutputVolumeValue": "2285305.003",
        "averageNumberOfTransactionsPerBlock": "365"
    },
    {
        "month": "4",
        "day": "5",
        "year": "2013",
        "price": "143.8",
        "totalCirculation": "10995725",
        "totalTransactionFees": "52.66033205",
        "numberOfUniqueBitcoinAddressesUsed": "82343",
        "totalOutputVolumeValue": "2277775.258",
        "averageNumberOfTransactionsPerBlock": "374"
    },
    {
        "month": "4",
        "day": "6",
        "year": "2013",
        "price": "142.49765",
        "totalCirculation": "10999925",
        "totalTransactionFees": "42.12188594",
        "numberOfUniqueBitcoinAddressesUsed": "68732",
        "totalOutputVolumeValue": "1383020.598",
        "averageNumberOfTransactionsPerBlock": "412"
    },
    {
        "month": "4",
        "day": "7",
        "year": "2013",
        "price": "160.0997",
        "totalCirculation": "11003975",
        "totalTransactionFees": "50.70171294",
        "numberOfUniqueBitcoinAddressesUsed": "74149",
        "totalOutputVolumeValue": "1094580.441",
        "averageNumberOfTransactionsPerBlock": "349"
    },
    {
        "month": "4",
        "day": "8",
        "year": "2013",
        "price": "184",
        "totalCirculation": "11008200",
        "totalTransactionFees": "48.65175566",
        "numberOfUniqueBitcoinAddressesUsed": "93700",
        "totalOutputVolumeValue": "1371481.27",
        "averageNumberOfTransactionsPerBlock": "348"
    },
    {
        "month": "4",
        "day": "9",
        "year": "2013",
        "price": "237.99",
        "totalCirculation": "11012400",
        "totalTransactionFees": "43.21464562",
        "numberOfUniqueBitcoinAddressesUsed": "85063",
        "totalOutputVolumeValue": "1918801.683",
        "averageNumberOfTransactionsPerBlock": "327"
    },
    {
        "month": "4",
        "day": "10",
        "year": "2013",
        "price": "198",
        "totalCirculation": "11017000",
        "totalTransactionFees": "69.92445334",
        "numberOfUniqueBitcoinAddressesUsed": "102016",
        "totalOutputVolumeValue": "2294955.683",
        "averageNumberOfTransactionsPerBlock": "345"
    },
    {
        "month": "4",
        "day": "11",
        "year": "2013",
        "price": "123.40098",
        "totalCirculation": "11021100",
        "totalTransactionFees": "62.23017998",
        "numberOfUniqueBitcoinAddressesUsed": "100830",
        "totalOutputVolumeValue": "2929384.84",
        "averageNumberOfTransactionsPerBlock": "359"
    },
    {
        "month": "4",
        "day": "12",
        "year": "2013",
        "price": "76.488",
        "totalCirculation": "11025425",
        "totalTransactionFees": "55.21363942",
        "numberOfUniqueBitcoinAddressesUsed": "87352",
        "totalOutputVolumeValue": "2005155.974",
        "averageNumberOfTransactionsPerBlock": "336"
    },
    {
        "month": "4",
        "day": "13",
        "year": "2013",
        "price": "109.49999",
        "totalCirculation": "11029400",
        "totalTransactionFees": "44.43812922",
        "numberOfUniqueBitcoinAddressesUsed": "72076",
        "totalOutputVolumeValue": "1511454.667",
        "averageNumberOfTransactionsPerBlock": "322"
    },
    {
        "month": "4",
        "day": "14",
        "year": "2013",
        "price": "91",
        "totalCirculation": "11033475",
        "totalTransactionFees": "50.74181733",
        "numberOfUniqueBitcoinAddressesUsed": "57080",
        "totalOutputVolumeValue": "812695.5551",
        "averageNumberOfTransactionsPerBlock": "462"
    },
    {
        "month": "4",
        "day": "15",
        "year": "2013",
        "price": "91",
        "totalCirculation": "11037475",
        "totalTransactionFees": "76.63350621",
        "numberOfUniqueBitcoinAddressesUsed": "80731",
        "totalOutputVolumeValue": "871408.5325",
        "averageNumberOfTransactionsPerBlock": "331"
    },
    {
        "month": "4",
        "day": "16",
        "year": "2013",
        "price": "91",
        "totalCirculation": "11042050",
        "totalTransactionFees": "47.7076591",
        "numberOfUniqueBitcoinAddressesUsed": "79311",
        "totalOutputVolumeValue": "1795688.63",
        "averageNumberOfTransactionsPerBlock": "259"
    },
    {
        "month": "4",
        "day": "17",
        "year": "2013",
        "price": "85.59999",
        "totalCirculation": "11046225",
        "totalTransactionFees": "54.86451829",
        "numberOfUniqueBitcoinAddressesUsed": "84698",
        "totalOutputVolumeValue": "1364790.98",
        "averageNumberOfTransactionsPerBlock": "288"
    },
    {
        "month": "4",
        "day": "18",
        "year": "2013",
        "price": "96.5",
        "totalCirculation": "11050300",
        "totalTransactionFees": "75.99131193",
        "numberOfUniqueBitcoinAddressesUsed": "72737",
        "totalOutputVolumeValue": "6165997.457",
        "averageNumberOfTransactionsPerBlock": "360"
    },
    {
        "month": "4",
        "day": "19",
        "year": "2013",
        "price": "119.62",
        "totalCirculation": "11053425",
        "totalTransactionFees": "52.32051628",
        "numberOfUniqueBitcoinAddressesUsed": "87326",
        "totalOutputVolumeValue": "2035030.29",
        "averageNumberOfTransactionsPerBlock": "388"
    },
    {
        "month": "4",
        "day": "20",
        "year": "2013",
        "price": "123.86",
        "totalCirculation": "11057050",
        "totalTransactionFees": "47.63908441",
        "numberOfUniqueBitcoinAddressesUsed": "61190",
        "totalOutputVolumeValue": "1073892.028",
        "averageNumberOfTransactionsPerBlock": "384"
    },
    {
        "month": "4",
        "day": "21",
        "year": "2013",
        "price": "125",
        "totalCirculation": "11061400",
        "totalTransactionFees": "33.70386177",
        "numberOfUniqueBitcoinAddressesUsed": "59238",
        "totalOutputVolumeValue": "1013491.404",
        "averageNumberOfTransactionsPerBlock": "328"
    },
    {
        "month": "4",
        "day": "22",
        "year": "2013",
        "price": "123.515",
        "totalCirculation": "11065450",
        "totalTransactionFees": "45.88692146",
        "numberOfUniqueBitcoinAddressesUsed": "77777",
        "totalOutputVolumeValue": "1532386.051",
        "averageNumberOfTransactionsPerBlock": "303"
    },
    {
        "month": "4",
        "day": "23",
        "year": "2013",
        "price": "136.08099",
        "totalCirculation": "11069425",
        "totalTransactionFees": "42.08181801",
        "numberOfUniqueBitcoinAddressesUsed": "72900",
        "totalOutputVolumeValue": "1578962.347",
        "averageNumberOfTransactionsPerBlock": "245"
    },
    {
        "month": "4",
        "day": "24",
        "year": "2013",
        "price": "153.20019",
        "totalCirculation": "11073800",
        "totalTransactionFees": "79.62969215",
        "numberOfUniqueBitcoinAddressesUsed": "85420",
        "totalOutputVolumeValue": "2091426.705",
        "averageNumberOfTransactionsPerBlock": "276"
    },
    {
        "month": "4",
        "day": "25",
        "year": "2013",
        "price": "151.12001",
        "totalCirculation": "11077775",
        "totalTransactionFees": "50.77780195",
        "numberOfUniqueBitcoinAddressesUsed": "73729",
        "totalOutputVolumeValue": "1745107.969",
        "averageNumberOfTransactionsPerBlock": "327"
    },
    {
        "month": "4",
        "day": "26",
        "year": "2013",
        "price": "135.601",
        "totalCirculation": "11082075",
        "totalTransactionFees": "50.84713758",
        "numberOfUniqueBitcoinAddressesUsed": "74621",
        "totalOutputVolumeValue": "1223971.538",
        "averageNumberOfTransactionsPerBlock": "357"
    },
    {
        "month": "4",
        "day": "27",
        "year": "2013",
        "price": "128.00001",
        "totalCirculation": "11086050",
        "totalTransactionFees": "42.57794746",
        "numberOfUniqueBitcoinAddressesUsed": "62711",
        "totalOutputVolumeValue": "893994.839",
        "averageNumberOfTransactionsPerBlock": "397"
    },
    {
        "month": "4",
        "day": "28",
        "year": "2013",
        "price": "135.98999",
        "totalCirculation": "11090225",
        "totalTransactionFees": "32.57042361",
        "numberOfUniqueBitcoinAddressesUsed": "107554",
        "totalOutputVolumeValue": "617354.608",
        "averageNumberOfTransactionsPerBlock": "379"
    },
    {
        "month": "4",
        "day": "29",
        "year": "2013",
        "price": "141.50002",
        "totalCirculation": "11094750",
        "totalTransactionFees": "35.83009291",
        "numberOfUniqueBitcoinAddressesUsed": "73687",
        "totalOutputVolumeValue": "897729.2019",
        "averageNumberOfTransactionsPerBlock": "313"
    },
    {
        "month": "4",
        "day": "30",
        "year": "2013",
        "price": "139.109",
        "totalCirculation": "11098475",
        "totalTransactionFees": "54.59361391",
        "numberOfUniqueBitcoinAddressesUsed": "60887",
        "totalOutputVolumeValue": "1785923.389",
        "averageNumberOfTransactionsPerBlock": "320"
    },
    {
        "month": "5",
        "day": "1",
        "year": "2013",
        "price": "124.2998",
        "totalCirculation": "11102000",
        "totalTransactionFees": "35.90344815",
        "numberOfUniqueBitcoinAddressesUsed": "61672",
        "totalOutputVolumeValue": "1233492.059",
        "averageNumberOfTransactionsPerBlock": "314"
    },
    {
        "month": "5",
        "day": "2",
        "year": "2013",
        "price": "105.00003",
        "totalCirculation": "11105600",
        "totalTransactionFees": "55.0843293",
        "numberOfUniqueBitcoinAddressesUsed": "67744",
        "totalOutputVolumeValue": "1127675.268",
        "averageNumberOfTransactionsPerBlock": "336"
    },
    {
        "month": "5",
        "day": "3",
        "year": "2013",
        "price": "93.15",
        "totalCirculation": "11109275",
        "totalTransactionFees": "49.20782248",
        "numberOfUniqueBitcoinAddressesUsed": "70210",
        "totalOutputVolumeValue": "912306.8131",
        "averageNumberOfTransactionsPerBlock": "290"
    },
    {
        "month": "5",
        "day": "4",
        "year": "2013",
        "price": "111.98979",
        "totalCirculation": "11113125",
        "totalTransactionFees": "42.74796187",
        "numberOfUniqueBitcoinAddressesUsed": "56115",
        "totalOutputVolumeValue": "552714.5574",
        "averageNumberOfTransactionsPerBlock": "399"
    },
    {
        "month": "5",
        "day": "5",
        "year": "2013",
        "price": "117.89001",
        "totalCirculation": "11116975",
        "totalTransactionFees": "38.14591919",
        "numberOfUniqueBitcoinAddressesUsed": "55974",
        "totalOutputVolumeValue": "613475.0625",
        "averageNumberOfTransactionsPerBlock": "406"
    },
    {
        "month": "5",
        "day": "6",
        "year": "2013",
        "price": "120.94999",
        "totalCirculation": "11121050",
        "totalTransactionFees": "50.99940307",
        "numberOfUniqueBitcoinAddressesUsed": "64381",
        "totalOutputVolumeValue": "794309.0957",
        "averageNumberOfTransactionsPerBlock": "402"
    },
    {
        "month": "5",
        "day": "7",
        "year": "2013",
        "price": "106.81",
        "totalCirculation": "11125450",
        "totalTransactionFees": "45.04501941",
        "numberOfUniqueBitcoinAddressesUsed": "89457",
        "totalOutputVolumeValue": "1023330.961",
        "averageNumberOfTransactionsPerBlock": "389"
    },
    {
        "month": "5",
        "day": "8",
        "year": "2013",
        "price": "113.95001",
        "totalCirculation": "11129525",
        "totalTransactionFees": "49.35342081",
        "numberOfUniqueBitcoinAddressesUsed": "95352",
        "totalOutputVolumeValue": "806731.7211",
        "averageNumberOfTransactionsPerBlock": "345"
    },
    {
        "month": "5",
        "day": "9",
        "year": "2013",
        "price": "109.56154",
        "totalCirculation": "11133675",
        "totalTransactionFees": "68.44017033",
        "numberOfUniqueBitcoinAddressesUsed": "70728",
        "totalOutputVolumeValue": "693721.2551",
        "averageNumberOfTransactionsPerBlock": "430"
    },
    {
        "month": "5",
        "day": "10",
        "year": "2013",
        "price": "117.68",
        "totalCirculation": "11137850",
        "totalTransactionFees": "60.18777245",
        "numberOfUniqueBitcoinAddressesUsed": "72244",
        "totalOutputVolumeValue": "914238.4024",
        "averageNumberOfTransactionsPerBlock": "451"
    },
    {
        "month": "5",
        "day": "11",
        "year": "2013",
        "price": "115.4",
        "totalCirculation": "11142225",
        "totalTransactionFees": "63.69813949",
        "numberOfUniqueBitcoinAddressesUsed": "67240",
        "totalOutputVolumeValue": "706784.9444",
        "averageNumberOfTransactionsPerBlock": "417"
    },
    {
        "month": "5",
        "day": "12",
        "year": "2013",
        "price": "114.32",
        "totalCirculation": "11146675",
        "totalTransactionFees": "59.03344042",
        "numberOfUniqueBitcoinAddressesUsed": "61435",
        "totalOutputVolumeValue": "613817.4568",
        "averageNumberOfTransactionsPerBlock": "378"
    },
    {
        "month": "5",
        "day": "13",
        "year": "2013",
        "price": "117.50298",
        "totalCirculation": "11151175",
        "totalTransactionFees": "60.08625448",
        "numberOfUniqueBitcoinAddressesUsed": "65440",
        "totalOutputVolumeValue": "995953.3697",
        "averageNumberOfTransactionsPerBlock": "353"
    },
    {
        "month": "5",
        "day": "14",
        "year": "2013",
        "price": "119",
        "totalCirculation": "11154850",
        "totalTransactionFees": "54.66430818",
        "numberOfUniqueBitcoinAddressesUsed": "68323",
        "totalOutputVolumeValue": "778189.9723",
        "averageNumberOfTransactionsPerBlock": "305"
    },
    {
        "month": "5",
        "day": "15",
        "year": "2013",
        "price": "114.98499",
        "totalCirculation": "11158525",
        "totalTransactionFees": "49.64959569",
        "numberOfUniqueBitcoinAddressesUsed": "70212",
        "totalOutputVolumeValue": "825250.5735",
        "averageNumberOfTransactionsPerBlock": "362"
    },
    {
        "month": "5",
        "day": "16",
        "year": "2013",
        "price": "115.09024",
        "totalCirculation": "11162150",
        "totalTransactionFees": "57.87351884",
        "numberOfUniqueBitcoinAddressesUsed": "67246",
        "totalOutputVolumeValue": "708868.2776",
        "averageNumberOfTransactionsPerBlock": "366"
    },
    {
        "month": "5",
        "day": "17",
        "year": "2013",
        "price": "124.49",
        "totalCirculation": "11166175",
        "totalTransactionFees": "88.4985171",
        "numberOfUniqueBitcoinAddressesUsed": "64560",
        "totalOutputVolumeValue": "751659.7357",
        "averageNumberOfTransactionsPerBlock": "325"
    },
    {
        "month": "5",
        "day": "18",
        "year": "2013",
        "price": "123.74995",
        "totalCirculation": "11169850",
        "totalTransactionFees": "39.44980994",
        "numberOfUniqueBitcoinAddressesUsed": "55716",
        "totalOutputVolumeValue": "890106.5198",
        "averageNumberOfTransactionsPerBlock": "340"
    },
    {
        "month": "5",
        "day": "19",
        "year": "2013",
        "price": "121.05628",
        "totalCirculation": "11173700",
        "totalTransactionFees": "42.20084266",
        "numberOfUniqueBitcoinAddressesUsed": "51111",
        "totalOutputVolumeValue": "465511.5729",
        "averageNumberOfTransactionsPerBlock": "340"
    },
    {
        "month": "5",
        "day": "20",
        "year": "2013",
        "price": "122.65001",
        "totalCirculation": "11177150",
        "totalTransactionFees": "49.07464086",
        "numberOfUniqueBitcoinAddressesUsed": "56966",
        "totalOutputVolumeValue": "469681.0902",
        "averageNumberOfTransactionsPerBlock": "324"
    },
    {
        "month": "5",
        "day": "21",
        "year": "2013",
        "price": "122.5",
        "totalCirculation": "11180875",
        "totalTransactionFees": "42.99289632",
        "numberOfUniqueBitcoinAddressesUsed": "63976",
        "totalOutputVolumeValue": "669674.3383",
        "averageNumberOfTransactionsPerBlock": "247"
    },
    {
        "month": "5",
        "day": "22",
        "year": "2013",
        "price": "122.64",
        "totalCirculation": "11185025",
        "totalTransactionFees": "55.07809707",
        "numberOfUniqueBitcoinAddressesUsed": "65369",
        "totalOutputVolumeValue": "761102.6179",
        "averageNumberOfTransactionsPerBlock": "304"
    },
    {
        "month": "5",
        "day": "23",
        "year": "2013",
        "price": "125.67",
        "totalCirculation": "11189050",
        "totalTransactionFees": "53.41115964",
        "numberOfUniqueBitcoinAddressesUsed": "65171",
        "totalOutputVolumeValue": "669637.3555",
        "averageNumberOfTransactionsPerBlock": "340"
    },
    {
        "month": "5",
        "day": "24",
        "year": "2013",
        "price": "131.5",
        "totalCirculation": "11193100",
        "totalTransactionFees": "41.98819177",
        "numberOfUniqueBitcoinAddressesUsed": "67558",
        "totalOutputVolumeValue": "733232.7609",
        "averageNumberOfTransactionsPerBlock": "326"
    },
    {
        "month": "5",
        "day": "25",
        "year": "2013",
        "price": "132.69",
        "totalCirculation": "11197400",
        "totalTransactionFees": "55.98522589",
        "numberOfUniqueBitcoinAddressesUsed": "60147",
        "totalOutputVolumeValue": "865063.3614",
        "averageNumberOfTransactionsPerBlock": "338"
    },
    {
        "month": "5",
        "day": "26",
        "year": "2013",
        "price": "134.04701",
        "totalCirculation": "11201425",
        "totalTransactionFees": "30.67004412",
        "numberOfUniqueBitcoinAddressesUsed": "52307",
        "totalOutputVolumeValue": "391310.1538",
        "averageNumberOfTransactionsPerBlock": "309"
    },
    {
        "month": "5",
        "day": "27",
        "year": "2013",
        "price": "132.60997",
        "totalCirculation": "11205725",
        "totalTransactionFees": "47.80327835",
        "numberOfUniqueBitcoinAddressesUsed": "59395",
        "totalOutputVolumeValue": "504337.0191",
        "averageNumberOfTransactionsPerBlock": "264"
    },
    {
        "month": "5",
        "day": "28",
        "year": "2013",
        "price": "128.321",
        "totalCirculation": "11209775",
        "totalTransactionFees": "54.56592486",
        "numberOfUniqueBitcoinAddressesUsed": "56871",
        "totalOutputVolumeValue": "790756.3914",
        "averageNumberOfTransactionsPerBlock": "250"
    },
    {
        "month": "5",
        "day": "29",
        "year": "2013",
        "price": "129.97994",
        "totalCirculation": "11213975",
        "totalTransactionFees": "51.94317506",
        "numberOfUniqueBitcoinAddressesUsed": "66689",
        "totalOutputVolumeValue": "771923.0077",
        "averageNumberOfTransactionsPerBlock": "249"
    },
    {
        "month": "5",
        "day": "30",
        "year": "2013",
        "price": "130.99589",
        "totalCirculation": "11218200",
        "totalTransactionFees": "46.71194711",
        "numberOfUniqueBitcoinAddressesUsed": "63212",
        "totalOutputVolumeValue": "630011.5889",
        "averageNumberOfTransactionsPerBlock": "286"
    },
    {
        "month": "5",
        "day": "31",
        "year": "2013",
        "price": "127.34072",
        "totalCirculation": "11222850",
        "totalTransactionFees": "48.95769767",
        "numberOfUniqueBitcoinAddressesUsed": "62386",
        "totalOutputVolumeValue": "738730.7191",
        "averageNumberOfTransactionsPerBlock": "272"
    },
    {
        "month": "6",
        "day": "1",
        "year": "2013",
        "price": "129.19945",
        "totalCirculation": "11227800",
        "totalTransactionFees": "39.3619438",
        "numberOfUniqueBitcoinAddressesUsed": "59033",
        "totalOutputVolumeValue": "499558.6325",
        "averageNumberOfTransactionsPerBlock": "314"
    },
    {
        "month": "6",
        "day": "2",
        "year": "2013",
        "price": "120.60293",
        "totalCirculation": "11232900",
        "totalTransactionFees": "44.65643906",
        "numberOfUniqueBitcoinAddressesUsed": "50677",
        "totalOutputVolumeValue": "437429.0798",
        "averageNumberOfTransactionsPerBlock": "337"
    },
    {
        "month": "6",
        "day": "3",
        "year": "2013",
        "price": "120.00002",
        "totalCirculation": "11238125",
        "totalTransactionFees": "49.50440017",
        "numberOfUniqueBitcoinAddressesUsed": "58321",
        "totalOutputVolumeValue": "643729.2547",
        "averageNumberOfTransactionsPerBlock": "285"
    },
    {
        "month": "6",
        "day": "4",
        "year": "2013",
        "price": "120.56663",
        "totalCirculation": "11243375",
        "totalTransactionFees": "64.89014237",
        "numberOfUniqueBitcoinAddressesUsed": "63518",
        "totalOutputVolumeValue": "730847.3374",
        "averageNumberOfTransactionsPerBlock": "276"
    },
    {
        "month": "6",
        "day": "5",
        "year": "2013",
        "price": "122.4051",
        "totalCirculation": "11248425",
        "totalTransactionFees": "60.62469501",
        "numberOfUniqueBitcoinAddressesUsed": "67477",
        "totalOutputVolumeValue": "674394.7271",
        "averageNumberOfTransactionsPerBlock": "235"
    },
    {
        "month": "6",
        "day": "6",
        "year": "2013",
        "price": "120.68998",
        "totalCirculation": "11252875",
        "totalTransactionFees": "43.37307063",
        "numberOfUniqueBitcoinAddressesUsed": "60098",
        "totalOutputVolumeValue": "762431.2924",
        "averageNumberOfTransactionsPerBlock": "290"
    },
    {
        "month": "6",
        "day": "7",
        "year": "2013",
        "price": "110.29501",
        "totalCirculation": "11256900",
        "totalTransactionFees": "40.4846895",
        "numberOfUniqueBitcoinAddressesUsed": "60504",
        "totalOutputVolumeValue": "716027.7695",
        "averageNumberOfTransactionsPerBlock": "232"
    },
    {
        "month": "6",
        "day": "8",
        "year": "2013",
        "price": "107.8",
        "totalCirculation": "11261100",
        "totalTransactionFees": "45.68561726",
        "numberOfUniqueBitcoinAddressesUsed": "51054",
        "totalOutputVolumeValue": "428601.4053",
        "averageNumberOfTransactionsPerBlock": "224"
    },
    {
        "month": "6",
        "day": "9",
        "year": "2013",
        "price": "98.47045",
        "totalCirculation": "11265275",
        "totalTransactionFees": "36.50155661",
        "numberOfUniqueBitcoinAddressesUsed": "45062",
        "totalOutputVolumeValue": "642064.6291",
        "averageNumberOfTransactionsPerBlock": "279"
    },
    {
        "month": "6",
        "day": "10",
        "year": "2013",
        "price": "104.96851",
        "totalCirculation": "11269775",
        "totalTransactionFees": "34.19488951",
        "numberOfUniqueBitcoinAddressesUsed": "48672",
        "totalOutputVolumeValue": "491518.5508",
        "averageNumberOfTransactionsPerBlock": "235"
    },
    {
        "month": "6",
        "day": "11",
        "year": "2013",
        "price": "108",
        "totalCirculation": "11274175",
        "totalTransactionFees": "47.23966648",
        "numberOfUniqueBitcoinAddressesUsed": "57169",
        "totalOutputVolumeValue": "569521.5477",
        "averageNumberOfTransactionsPerBlock": "214"
    },
    {
        "month": "6",
        "day": "12",
        "year": "2013",
        "price": "108.16201",
        "totalCirculation": "11279175",
        "totalTransactionFees": "43.47723521",
        "numberOfUniqueBitcoinAddressesUsed": "52722",
        "totalOutputVolumeValue": "600093.8836",
        "averageNumberOfTransactionsPerBlock": "281"
    },
    {
        "month": "6",
        "day": "13",
        "year": "2013",
        "price": "109",
        "totalCirculation": "11284000",
        "totalTransactionFees": "38.93851606",
        "numberOfUniqueBitcoinAddressesUsed": "53645",
        "totalOutputVolumeValue": "533607.002",
        "averageNumberOfTransactionsPerBlock": "322"
    },
    {
        "month": "6",
        "day": "14",
        "year": "2013",
        "price": "100",
        "totalCirculation": "11288300",
        "totalTransactionFees": "38.16991619",
        "numberOfUniqueBitcoinAddressesUsed": "60855",
        "totalOutputVolumeValue": "741296.8417",
        "averageNumberOfTransactionsPerBlock": "375"
    },
    {
        "month": "6",
        "day": "15",
        "year": "2013",
        "price": "101.96998",
        "totalCirculation": "11292700",
        "totalTransactionFees": "37.25196643",
        "numberOfUniqueBitcoinAddressesUsed": "52008",
        "totalOutputVolumeValue": "509157.7248",
        "averageNumberOfTransactionsPerBlock": "338"
    },
    {
        "month": "6",
        "day": "16",
        "year": "2013",
        "price": "100",
        "totalCirculation": "11297375",
        "totalTransactionFees": "29.0746919",
        "numberOfUniqueBitcoinAddressesUsed": "37955",
        "totalOutputVolumeValue": "458689.5912",
        "averageNumberOfTransactionsPerBlock": "306"
    },
    {
        "month": "6",
        "day": "17",
        "year": "2013",
        "price": "100.52521",
        "totalCirculation": "11301225",
        "totalTransactionFees": "35.05299427",
        "numberOfUniqueBitcoinAddressesUsed": "45693",
        "totalOutputVolumeValue": "557268.8023",
        "averageNumberOfTransactionsPerBlock": "247"
    },
    {
        "month": "6",
        "day": "18",
        "year": "2013",
        "price": "107.38999",
        "totalCirculation": "11304875",
        "totalTransactionFees": "36.99237474",
        "numberOfUniqueBitcoinAddressesUsed": "48967",
        "totalOutputVolumeValue": "600799.7376",
        "averageNumberOfTransactionsPerBlock": "230"
    },
    {
        "month": "6",
        "day": "19",
        "year": "2013",
        "price": "107.835",
        "totalCirculation": "11308000",
        "totalTransactionFees": "36.13715542",
        "numberOfUniqueBitcoinAddressesUsed": "55778",
        "totalOutputVolumeValue": "639946.2426",
        "averageNumberOfTransactionsPerBlock": "286"
    },
    {
        "month": "6",
        "day": "20",
        "year": "2013",
        "price": "111.97",
        "totalCirculation": "11311650",
        "totalTransactionFees": "62.60148592",
        "numberOfUniqueBitcoinAddressesUsed": "54530",
        "totalOutputVolumeValue": "664640.9822",
        "averageNumberOfTransactionsPerBlock": "308"
    },
    {
        "month": "6",
        "day": "21",
        "year": "2013",
        "price": "111",
        "totalCirculation": "11315975",
        "totalTransactionFees": "55.51629176",
        "numberOfUniqueBitcoinAddressesUsed": "58295",
        "totalOutputVolumeValue": "808002.2303",
        "averageNumberOfTransactionsPerBlock": "241"
    },
    {
        "month": "6",
        "day": "22",
        "year": "2013",
        "price": "109.09",
        "totalCirculation": "11320275",
        "totalTransactionFees": "45.58428107",
        "numberOfUniqueBitcoinAddressesUsed": "49708",
        "totalOutputVolumeValue": "453784.5126",
        "averageNumberOfTransactionsPerBlock": "281"
    },
    {
        "month": "6",
        "day": "23",
        "year": "2013",
        "price": "107.68389",
        "totalCirculation": "11324675",
        "totalTransactionFees": "40.63780671",
        "numberOfUniqueBitcoinAddressesUsed": "41462",
        "totalOutputVolumeValue": "363194.7181",
        "averageNumberOfTransactionsPerBlock": "287"
    },
    {
        "month": "6",
        "day": "24",
        "year": "2013",
        "price": "101.96936",
        "totalCirculation": "11328250",
        "totalTransactionFees": "37.82404209",
        "numberOfUniqueBitcoinAddressesUsed": "48326",
        "totalOutputVolumeValue": "519400.8813",
        "averageNumberOfTransactionsPerBlock": "242"
    },
    {
        "month": "6",
        "day": "25",
        "year": "2013",
        "price": "103.86665",
        "totalCirculation": "11331950",
        "totalTransactionFees": "36.22112769",
        "numberOfUniqueBitcoinAddressesUsed": "50770",
        "totalOutputVolumeValue": "729778.8644",
        "averageNumberOfTransactionsPerBlock": "201"
    },
    {
        "month": "6",
        "day": "26",
        "year": "2013",
        "price": "104.40565",
        "totalCirculation": "11336675",
        "totalTransactionFees": "38.21914872",
        "numberOfUniqueBitcoinAddressesUsed": "54518",
        "totalOutputVolumeValue": "647186.4106",
        "averageNumberOfTransactionsPerBlock": "222"
    },
    {
        "month": "6",
        "day": "27",
        "year": "2013",
        "price": "102.79001",
        "totalCirculation": "11340825",
        "totalTransactionFees": "33.13590698",
        "numberOfUniqueBitcoinAddressesUsed": "51936",
        "totalOutputVolumeValue": "595242.991",
        "averageNumberOfTransactionsPerBlock": "275"
    },
    {
        "month": "6",
        "day": "28",
        "year": "2013",
        "price": "96.63498",
        "totalCirculation": "11345025",
        "totalTransactionFees": "47.29444705",
        "numberOfUniqueBitcoinAddressesUsed": "53524",
        "totalOutputVolumeValue": "582637.0046",
        "averageNumberOfTransactionsPerBlock": "202"
    },
    {
        "month": "6",
        "day": "29",
        "year": "2013",
        "price": "95.85301",
        "totalCirculation": "11349050",
        "totalTransactionFees": "25.79585074",
        "numberOfUniqueBitcoinAddressesUsed": "55499",
        "totalOutputVolumeValue": "599896.3873",
        "averageNumberOfTransactionsPerBlock": "203"
    },
    {
        "month": "6",
        "day": "30",
        "year": "2013",
        "price": "96.5",
        "totalCirculation": "11353150",
        "totalTransactionFees": "19.88041027",
        "numberOfUniqueBitcoinAddressesUsed": "41271",
        "totalOutputVolumeValue": "421917.863",
        "averageNumberOfTransactionsPerBlock": "205"
    },
    {
        "month": "7",
        "day": "1",
        "year": "2013",
        "price": "90.998",
        "totalCirculation": "11356975",
        "totalTransactionFees": "31.95531521",
        "numberOfUniqueBitcoinAddressesUsed": "49206",
        "totalOutputVolumeValue": "702652.2629",
        "averageNumberOfTransactionsPerBlock": "196"
    },
    {
        "month": "7",
        "day": "2",
        "year": "2013",
        "price": "89.55",
        "totalCirculation": "11360900",
        "totalTransactionFees": "37.0769864",
        "numberOfUniqueBitcoinAddressesUsed": "56769",
        "totalOutputVolumeValue": "858590.7197",
        "averageNumberOfTransactionsPerBlock": "154"
    },
    {
        "month": "7",
        "day": "3",
        "year": "2013",
        "price": "82.8",
        "totalCirculation": "11365275",
        "totalTransactionFees": "29.49682754",
        "numberOfUniqueBitcoinAddressesUsed": "53642",
        "totalOutputVolumeValue": "744097.3616",
        "averageNumberOfTransactionsPerBlock": "198"
    },
    {
        "month": "7",
        "day": "4",
        "year": "2013",
        "price": "79.8",
        "totalCirculation": "11369525",
        "totalTransactionFees": "21.101607",
        "numberOfUniqueBitcoinAddressesUsed": "53347",
        "totalOutputVolumeValue": "887100.5764",
        "averageNumberOfTransactionsPerBlock": "207"
    },
    {
        "month": "7",
        "day": "5",
        "year": "2013",
        "price": "67.85844",
        "totalCirculation": "11373950",
        "totalTransactionFees": "33.41026781",
        "numberOfUniqueBitcoinAddressesUsed": "47699",
        "totalOutputVolumeValue": "964524.8385",
        "averageNumberOfTransactionsPerBlock": "230"
    },
    {
        "month": "7",
        "day": "6",
        "year": "2013",
        "price": "69.34602",
        "totalCirculation": "11378650",
        "totalTransactionFees": "31.75035904",
        "numberOfUniqueBitcoinAddressesUsed": "46957",
        "totalOutputVolumeValue": "845854.8106",
        "averageNumberOfTransactionsPerBlock": "213"
    },
    {
        "month": "7",
        "day": "7",
        "year": "2013",
        "price": "70.942",
        "totalCirculation": "11383325",
        "totalTransactionFees": "17.31315056",
        "numberOfUniqueBitcoinAddressesUsed": "37506",
        "totalOutputVolumeValue": "670229.7275",
        "averageNumberOfTransactionsPerBlock": "303"
    },
    {
        "month": "7",
        "day": "8",
        "year": "2013",
        "price": "77.64",
        "totalCirculation": "11387975",
        "totalTransactionFees": "31.43815723",
        "numberOfUniqueBitcoinAddressesUsed": "47647",
        "totalOutputVolumeValue": "684014.0953",
        "averageNumberOfTransactionsPerBlock": "266"
    },
    {
        "month": "7",
        "day": "9",
        "year": "2013",
        "price": "76.32791",
        "totalCirculation": "11393000",
        "totalTransactionFees": "35.161138",
        "numberOfUniqueBitcoinAddressesUsed": "54846",
        "totalOutputVolumeValue": "1087300.053",
        "averageNumberOfTransactionsPerBlock": "209"
    },
    {
        "month": "7",
        "day": "10",
        "year": "2013",
        "price": "78.58899",
        "totalCirculation": "11397275",
        "totalTransactionFees": "26.25884419",
        "numberOfUniqueBitcoinAddressesUsed": "55835",
        "totalOutputVolumeValue": "1218489.976",
        "averageNumberOfTransactionsPerBlock": "214"
    },
    {
        "month": "7",
        "day": "11",
        "year": "2013",
        "price": "87.15",
        "totalCirculation": "11402075",
        "totalTransactionFees": "33.81696437",
        "numberOfUniqueBitcoinAddressesUsed": "56988",
        "totalOutputVolumeValue": "956221.1025",
        "averageNumberOfTransactionsPerBlock": "236"
    },
    {
        "month": "7",
        "day": "12",
        "year": "2013",
        "price": "97.8",
        "totalCirculation": "11406200",
        "totalTransactionFees": "32.05021445",
        "numberOfUniqueBitcoinAddressesUsed": "69663",
        "totalOutputVolumeValue": "1134412.888",
        "averageNumberOfTransactionsPerBlock": "234"
    },
    {
        "month": "7",
        "day": "13",
        "year": "2013",
        "price": "95.995",
        "totalCirculation": "11409975",
        "totalTransactionFees": "25.13594621",
        "numberOfUniqueBitcoinAddressesUsed": "57072",
        "totalOutputVolumeValue": "881201.1587",
        "averageNumberOfTransactionsPerBlock": "239"
    },
    {
        "month": "7",
        "day": "14",
        "year": "2013",
        "price": "94.75",
        "totalCirculation": "11414050",
        "totalTransactionFees": "31.82965821",
        "numberOfUniqueBitcoinAddressesUsed": "38740",
        "totalOutputVolumeValue": "694343.8011",
        "averageNumberOfTransactionsPerBlock": "224"
    },
    {
        "month": "7",
        "day": "15",
        "year": "2013",
        "price": "98.37516",
        "totalCirculation": "11418325",
        "totalTransactionFees": "23.34949228",
        "numberOfUniqueBitcoinAddressesUsed": "46589",
        "totalOutputVolumeValue": "605676.6457",
        "averageNumberOfTransactionsPerBlock": "179"
    },
    {
        "month": "7",
        "day": "16",
        "year": "2013",
        "price": "97.01",
        "totalCirculation": "11422425",
        "totalTransactionFees": "34.01475967",
        "numberOfUniqueBitcoinAddressesUsed": "53761",
        "totalOutputVolumeValue": "906868.4965",
        "averageNumberOfTransactionsPerBlock": "189"
    },
    {
        "month": "7",
        "day": "17",
        "year": "2013",
        "price": "97.97",
        "totalCirculation": "11426650",
        "totalTransactionFees": "33.40695216",
        "numberOfUniqueBitcoinAddressesUsed": "54355",
        "totalOutputVolumeValue": "1104177.144",
        "averageNumberOfTransactionsPerBlock": "206"
    },
    {
        "month": "7",
        "day": "18",
        "year": "2013",
        "price": "90.40001",
        "totalCirculation": "11430950",
        "totalTransactionFees": "27.59409047",
        "numberOfUniqueBitcoinAddressesUsed": "54308",
        "totalOutputVolumeValue": "965209.8211",
        "averageNumberOfTransactionsPerBlock": "273"
    },
    {
        "month": "7",
        "day": "19",
        "year": "2013",
        "price": "93.41082",
        "totalCirculation": "11435175",
        "totalTransactionFees": "33.02637011",
        "numberOfUniqueBitcoinAddressesUsed": "48100",
        "totalOutputVolumeValue": "872196.4371",
        "averageNumberOfTransactionsPerBlock": "259"
    },
    {
        "month": "7",
        "day": "20",
        "year": "2013",
        "price": "91.8775",
        "totalCirculation": "11439850",
        "totalTransactionFees": "21.48857703",
        "numberOfUniqueBitcoinAddressesUsed": "44457",
        "totalOutputVolumeValue": "567387.9245",
        "averageNumberOfTransactionsPerBlock": "308"
    },
    {
        "month": "7",
        "day": "21",
        "year": "2013",
        "price": "88.93999",
        "totalCirculation": "11444725",
        "totalTransactionFees": "26.49400011",
        "numberOfUniqueBitcoinAddressesUsed": "43487",
        "totalOutputVolumeValue": "505908.0666",
        "averageNumberOfTransactionsPerBlock": "232"
    },
    {
        "month": "7",
        "day": "22",
        "year": "2013",
        "price": "91.788",
        "totalCirculation": "11449225",
        "totalTransactionFees": "21.9931243",
        "numberOfUniqueBitcoinAddressesUsed": "46082",
        "totalOutputVolumeValue": "866111.1725",
        "averageNumberOfTransactionsPerBlock": "218"
    },
    {
        "month": "7",
        "day": "23",
        "year": "2013",
        "price": "95.396",
        "totalCirculation": "11452850",
        "totalTransactionFees": "31.91271509",
        "numberOfUniqueBitcoinAddressesUsed": "54206",
        "totalOutputVolumeValue": "1029842.148",
        "averageNumberOfTransactionsPerBlock": "187"
    },
    {
        "month": "7",
        "day": "24",
        "year": "2013",
        "price": "93.6216",
        "totalCirculation": "11456700",
        "totalTransactionFees": "32.92301081",
        "numberOfUniqueBitcoinAddressesUsed": "54521",
        "totalOutputVolumeValue": "844442.5248",
        "averageNumberOfTransactionsPerBlock": "266"
    },
    {
        "month": "7",
        "day": "25",
        "year": "2013",
        "price": "96.2",
        "totalCirculation": "11460125",
        "totalTransactionFees": "34.86795346",
        "numberOfUniqueBitcoinAddressesUsed": "51978",
        "totalOutputVolumeValue": "777831.8929",
        "averageNumberOfTransactionsPerBlock": "216"
    },
    {
        "month": "7",
        "day": "26",
        "year": "2013",
        "price": "96.39475",
        "totalCirculation": "11464575",
        "totalTransactionFees": "22.80421394",
        "numberOfUniqueBitcoinAddressesUsed": "55955",
        "totalOutputVolumeValue": "869402.177",
        "averageNumberOfTransactionsPerBlock": "260"
    },
    {
        "month": "7",
        "day": "27",
        "year": "2013",
        "price": "95.20461",
        "totalCirculation": "11468700",
        "totalTransactionFees": "30.69502419",
        "numberOfUniqueBitcoinAddressesUsed": "42750",
        "totalOutputVolumeValue": "533718.3363",
        "averageNumberOfTransactionsPerBlock": "247"
    },
    {
        "month": "7",
        "day": "28",
        "year": "2013",
        "price": "99.00001",
        "totalCirculation": "11473125",
        "totalTransactionFees": "19.93133624",
        "numberOfUniqueBitcoinAddressesUsed": "37554",
        "totalOutputVolumeValue": "475543.7868",
        "averageNumberOfTransactionsPerBlock": "279"
    },
    {
        "month": "7",
        "day": "29",
        "year": "2013",
        "price": "101.04202",
        "totalCirculation": "11477275",
        "totalTransactionFees": "30.87144133",
        "numberOfUniqueBitcoinAddressesUsed": "54397",
        "totalOutputVolumeValue": "801401.4989",
        "averageNumberOfTransactionsPerBlock": "274"
    },
    {
        "month": "7",
        "day": "30",
        "year": "2013",
        "price": "101.89998",
        "totalCirculation": "11481900",
        "totalTransactionFees": "37.36421201",
        "numberOfUniqueBitcoinAddressesUsed": "55581",
        "totalOutputVolumeValue": "881026.5731",
        "averageNumberOfTransactionsPerBlock": "260"
    },
    {
        "month": "7",
        "day": "31",
        "year": "2013",
        "price": "104.95555",
        "totalCirculation": "11486875",
        "totalTransactionFees": "45.52101435",
        "numberOfUniqueBitcoinAddressesUsed": "69550",
        "totalOutputVolumeValue": "1031238.996",
        "averageNumberOfTransactionsPerBlock": "249"
    },
    {
        "month": "8",
        "day": "1",
        "year": "2013",
        "price": "104.19",
        "totalCirculation": "11491500",
        "totalTransactionFees": "31.49185887",
        "numberOfUniqueBitcoinAddressesUsed": "82370",
        "totalOutputVolumeValue": "1103374.378",
        "averageNumberOfTransactionsPerBlock": "276"
    },
    {
        "month": "8",
        "day": "2",
        "year": "2013",
        "price": "105.5",
        "totalCirculation": "11496250",
        "totalTransactionFees": "41.01530553",
        "numberOfUniqueBitcoinAddressesUsed": "84776",
        "totalOutputVolumeValue": "906937.4879",
        "averageNumberOfTransactionsPerBlock": "325"
    },
    {
        "month": "8",
        "day": "3",
        "year": "2013",
        "price": "103.80001",
        "totalCirculation": "11500725",
        "totalTransactionFees": "28.01755065",
        "numberOfUniqueBitcoinAddressesUsed": "53305",
        "totalOutputVolumeValue": "738992.0737",
        "averageNumberOfTransactionsPerBlock": "282"
    },
    {
        "month": "8",
        "day": "4",
        "year": "2013",
        "price": "104.67459",
        "totalCirculation": "11505000",
        "totalTransactionFees": "32.74170112",
        "numberOfUniqueBitcoinAddressesUsed": "46413",
        "totalOutputVolumeValue": "501888.0517",
        "averageNumberOfTransactionsPerBlock": "255"
    },
    {
        "month": "8",
        "day": "5",
        "year": "2013",
        "price": "106.4",
        "totalCirculation": "11509800",
        "totalTransactionFees": "27.05473128",
        "numberOfUniqueBitcoinAddressesUsed": "57924",
        "totalOutputVolumeValue": "795629.1254",
        "averageNumberOfTransactionsPerBlock": "261"
    },
    {
        "month": "8",
        "day": "6",
        "year": "2013",
        "price": "106.88378",
        "totalCirculation": "11514525",
        "totalTransactionFees": "40.53861293",
        "numberOfUniqueBitcoinAddressesUsed": "61468",
        "totalOutputVolumeValue": "749616.2656",
        "averageNumberOfTransactionsPerBlock": "191"
    },
    {
        "month": "8",
        "day": "7",
        "year": "2013",
        "price": "105.6",
        "totalCirculation": "11518925",
        "totalTransactionFees": "30.18051369",
        "numberOfUniqueBitcoinAddressesUsed": "64048",
        "totalOutputVolumeValue": "805001.5609",
        "averageNumberOfTransactionsPerBlock": "200"
    },
    {
        "month": "8",
        "day": "8",
        "year": "2013",
        "price": "101.9",
        "totalCirculation": "11523975",
        "totalTransactionFees": "49.6207779",
        "numberOfUniqueBitcoinAddressesUsed": "61019",
        "totalOutputVolumeValue": "785257.1086",
        "averageNumberOfTransactionsPerBlock": "278"
    },
    {
        "month": "8",
        "day": "9",
        "year": "2013",
        "price": "102.3",
        "totalCirculation": "11529175",
        "totalTransactionFees": "45.849913",
        "numberOfUniqueBitcoinAddressesUsed": "57904",
        "totalOutputVolumeValue": "640799.0042",
        "averageNumberOfTransactionsPerBlock": "327"
    },
    {
        "month": "8",
        "day": "10",
        "year": "2013",
        "price": "102.61802",
        "totalCirculation": "11534150",
        "totalTransactionFees": "29.35579481",
        "numberOfUniqueBitcoinAddressesUsed": "52564",
        "totalOutputVolumeValue": "517153.9425",
        "averageNumberOfTransactionsPerBlock": "353"
    },
    {
        "month": "8",
        "day": "11",
        "year": "2013",
        "price": "103.85001",
        "totalCirculation": "11539500",
        "totalTransactionFees": "33.93550069",
        "numberOfUniqueBitcoinAddressesUsed": "43679",
        "totalOutputVolumeValue": "432494.3896",
        "averageNumberOfTransactionsPerBlock": "397"
    },
    {
        "month": "8",
        "day": "12",
        "year": "2013",
        "price": "104.99498",
        "totalCirculation": "11545225",
        "totalTransactionFees": "24.14323112",
        "numberOfUniqueBitcoinAddressesUsed": "70581",
        "totalOutputVolumeValue": "731015.4422",
        "averageNumberOfTransactionsPerBlock": "316"
    },
    {
        "month": "8",
        "day": "13",
        "year": "2013",
        "price": "107.29884",
        "totalCirculation": "11550025",
        "totalTransactionFees": "29.55608972",
        "numberOfUniqueBitcoinAddressesUsed": "75208",
        "totalOutputVolumeValue": "1196357.334",
        "averageNumberOfTransactionsPerBlock": "269"
    },
    {
        "month": "8",
        "day": "14",
        "year": "2013",
        "price": "100.03",
        "totalCirculation": "11553875",
        "totalTransactionFees": "43.02378882",
        "numberOfUniqueBitcoinAddressesUsed": "60659",
        "totalOutputVolumeValue": "1405350.267",
        "averageNumberOfTransactionsPerBlock": "392"
    },
    {
        "month": "8",
        "day": "15",
        "year": "2013",
        "price": "98.28",
        "totalCirculation": "11558050",
        "totalTransactionFees": "64.02507935",
        "numberOfUniqueBitcoinAddressesUsed": "66433",
        "totalOutputVolumeValue": "923708.5749",
        "averageNumberOfTransactionsPerBlock": "367"
    },
    {
        "month": "8",
        "day": "16",
        "year": "2013",
        "price": "98.51",
        "totalCirculation": "11562350",
        "totalTransactionFees": "45.60521477",
        "numberOfUniqueBitcoinAddressesUsed": "69457",
        "totalOutputVolumeValue": "1099833.809",
        "averageNumberOfTransactionsPerBlock": "307"
    },
    {
        "month": "8",
        "day": "17",
        "year": "2013",
        "price": "98.39",
        "totalCirculation": "11567025",
        "totalTransactionFees": "29.42751688",
        "numberOfUniqueBitcoinAddressesUsed": "58546",
        "totalOutputVolumeValue": "983013.8618",
        "averageNumberOfTransactionsPerBlock": "301"
    },
    {
        "month": "8",
        "day": "18",
        "year": "2013",
        "price": "99.02",
        "totalCirculation": "11571950",
        "totalTransactionFees": "44.92668611",
        "numberOfUniqueBitcoinAddressesUsed": "42791",
        "totalOutputVolumeValue": "831928.9473",
        "averageNumberOfTransactionsPerBlock": "278"
    },
    {
        "month": "8",
        "day": "19",
        "year": "2013",
        "price": "102.07",
        "totalCirculation": "11576400",
        "totalTransactionFees": "37.81465044",
        "numberOfUniqueBitcoinAddressesUsed": "65506",
        "totalOutputVolumeValue": "1086202.696",
        "averageNumberOfTransactionsPerBlock": "274"
    },
    {
        "month": "8",
        "day": "20",
        "year": "2013",
        "price": "104.59",
        "totalCirculation": "11580925",
        "totalTransactionFees": "45.78527809",
        "numberOfUniqueBitcoinAddressesUsed": "69460",
        "totalOutputVolumeValue": "955506.834",
        "averageNumberOfTransactionsPerBlock": "315"
    },
    {
        "month": "8",
        "day": "21",
        "year": "2013",
        "price": "109.75",
        "totalCirculation": "11586075",
        "totalTransactionFees": "34.14204628",
        "numberOfUniqueBitcoinAddressesUsed": "70761",
        "totalOutputVolumeValue": "1186924.102",
        "averageNumberOfTransactionsPerBlock": "328"
    },
    {
        "month": "8",
        "day": "22",
        "year": "2013",
        "price": "111.01",
        "totalCirculation": "11591275",
        "totalTransactionFees": "37.04061907",
        "numberOfUniqueBitcoinAddressesUsed": "70737",
        "totalOutputVolumeValue": "890014.5175",
        "averageNumberOfTransactionsPerBlock": "354"
    },
    {
        "month": "8",
        "day": "23",
        "year": "2013",
        "price": "107.48",
        "totalCirculation": "11596650",
        "totalTransactionFees": "35.02624015",
        "numberOfUniqueBitcoinAddressesUsed": "68764",
        "totalOutputVolumeValue": "828835.1012",
        "averageNumberOfTransactionsPerBlock": "381"
    },
    {
        "month": "8",
        "day": "24",
        "year": "2013",
        "price": "108.79",
        "totalCirculation": "11601300",
        "totalTransactionFees": "28.06437009",
        "numberOfUniqueBitcoinAddressesUsed": "54649",
        "totalOutputVolumeValue": "622248.642",
        "averageNumberOfTransactionsPerBlock": "310"
    },
    {
        "month": "8",
        "day": "25",
        "year": "2013",
        "price": "112.9",
        "totalCirculation": "11604875",
        "totalTransactionFees": "30.74091178",
        "numberOfUniqueBitcoinAddressesUsed": "48105",
        "totalOutputVolumeValue": "565019.3883",
        "averageNumberOfTransactionsPerBlock": "312"
    },
    {
        "month": "8",
        "day": "26",
        "year": "2013",
        "price": "111.8",
        "totalCirculation": "11608950",
        "totalTransactionFees": "27.45229801",
        "numberOfUniqueBitcoinAddressesUsed": "57471",
        "totalOutputVolumeValue": "642473.9372",
        "averageNumberOfTransactionsPerBlock": "244"
    },
    {
        "month": "8",
        "day": "27",
        "year": "2013",
        "price": "117.52",
        "totalCirculation": "11613250",
        "totalTransactionFees": "51.94695338",
        "numberOfUniqueBitcoinAddressesUsed": "71151",
        "totalOutputVolumeValue": "895651.7835",
        "averageNumberOfTransactionsPerBlock": "205"
    },
    {
        "month": "8",
        "day": "28",
        "year": "2013",
        "price": "119.25",
        "totalCirculation": "11617425",
        "totalTransactionFees": "243.5203389",
        "numberOfUniqueBitcoinAddressesUsed": "72494",
        "totalOutputVolumeValue": "817469.6983",
        "averageNumberOfTransactionsPerBlock": "214"
    },
    {
        "month": "8",
        "day": "29",
        "year": "2013",
        "price": "119.48",
        "totalCirculation": "11622375",
        "totalTransactionFees": "44.63568124",
        "numberOfUniqueBitcoinAddressesUsed": "67844",
        "totalOutputVolumeValue": "2687667.893",
        "averageNumberOfTransactionsPerBlock": "272"
    },
    {
        "month": "8",
        "day": "30",
        "year": "2013",
        "price": "124.79",
        "totalCirculation": "11627225",
        "totalTransactionFees": "43.30645342",
        "numberOfUniqueBitcoinAddressesUsed": "72629",
        "totalOutputVolumeValue": "727229.9762",
        "averageNumberOfTransactionsPerBlock": "293"
    },
    {
        "month": "8",
        "day": "31",
        "year": "2013",
        "price": "132.75",
        "totalCirculation": "11632600",
        "totalTransactionFees": "32.35235089",
        "numberOfUniqueBitcoinAddressesUsed": "82290",
        "totalOutputVolumeValue": "753757.5476",
        "averageNumberOfTransactionsPerBlock": "369"
    },
    {
        "month": "9",
        "day": "1",
        "year": "2013",
        "price": "130.82",
        "totalCirculation": "11638150",
        "totalTransactionFees": "25.28747187",
        "numberOfUniqueBitcoinAddressesUsed": "49046",
        "totalOutputVolumeValue": "1064159.23",
        "averageNumberOfTransactionsPerBlock": "333"
    },
    {
        "month": "9",
        "day": "2",
        "year": "2013",
        "price": "131.03",
        "totalCirculation": "11644025",
        "totalTransactionFees": "46.83183395",
        "numberOfUniqueBitcoinAddressesUsed": "52118",
        "totalOutputVolumeValue": "748660.7934",
        "averageNumberOfTransactionsPerBlock": "332"
    },
    {
        "month": "9",
        "day": "3",
        "year": "2013",
        "price": "130.45",
        "totalCirculation": "11648650",
        "totalTransactionFees": "30.91428847",
        "numberOfUniqueBitcoinAddressesUsed": "54757",
        "totalOutputVolumeValue": "894041.0108",
        "averageNumberOfTransactionsPerBlock": "311"
    },
    {
        "month": "9",
        "day": "4",
        "year": "2013",
        "price": "126.74",
        "totalCirculation": "11653000",
        "totalTransactionFees": "24.59734787",
        "numberOfUniqueBitcoinAddressesUsed": "58274",
        "totalOutputVolumeValue": "895742.7851",
        "averageNumberOfTransactionsPerBlock": "284"
    },
    {
        "month": "9",
        "day": "5",
        "year": "2013",
        "price": "124.51",
        "totalCirculation": "11657075",
        "totalTransactionFees": "34.00943099",
        "numberOfUniqueBitcoinAddressesUsed": "63542",
        "totalOutputVolumeValue": "858463.1279",
        "averageNumberOfTransactionsPerBlock": "287"
    },
    {
        "month": "9",
        "day": "6",
        "year": "2013",
        "price": "122.44",
        "totalCirculation": "11661825",
        "totalTransactionFees": "33.00862693",
        "numberOfUniqueBitcoinAddressesUsed": "57620",
        "totalOutputVolumeValue": "838119.7477",
        "averageNumberOfTransactionsPerBlock": "246"
    },
    {
        "month": "9",
        "day": "7",
        "year": "2013",
        "price": "120.15",
        "totalCirculation": "11665900",
        "totalTransactionFees": "27.40258306",
        "numberOfUniqueBitcoinAddressesUsed": "56635",
        "totalOutputVolumeValue": "667774.7839",
        "averageNumberOfTransactionsPerBlock": "245"
    },
    {
        "month": "9",
        "day": "8",
        "year": "2013",
        "price": "118.51",
        "totalCirculation": "11669625",
        "totalTransactionFees": "22.51021597",
        "numberOfUniqueBitcoinAddressesUsed": "43712",
        "totalOutputVolumeValue": "409117.8523",
        "averageNumberOfTransactionsPerBlock": "230"
    },
    {
        "month": "9",
        "day": "9",
        "year": "2013",
        "price": "121.66",
        "totalCirculation": "11674450",
        "totalTransactionFees": "30.43641891",
        "numberOfUniqueBitcoinAddressesUsed": "53474",
        "totalOutputVolumeValue": "527143.1761",
        "averageNumberOfTransactionsPerBlock": "218"
    },
    {
        "month": "9",
        "day": "10",
        "year": "2013",
        "price": "123.39",
        "totalCirculation": "11679100",
        "totalTransactionFees": "28.07548626",
        "numberOfUniqueBitcoinAddressesUsed": "55161",
        "totalOutputVolumeValue": "1092297.075",
        "averageNumberOfTransactionsPerBlock": "255"
    },
    {
        "month": "9",
        "day": "11",
        "year": "2013",
        "price": "124.1",
        "totalCirculation": "11684125",
        "totalTransactionFees": "23.61451906",
        "numberOfUniqueBitcoinAddressesUsed": "58672",
        "totalOutputVolumeValue": "806718.3184",
        "averageNumberOfTransactionsPerBlock": "298"
    },
    {
        "month": "9",
        "day": "12",
        "year": "2013",
        "price": "128.45",
        "totalCirculation": "11689325",
        "totalTransactionFees": "24.96850657",
        "numberOfUniqueBitcoinAddressesUsed": "65300",
        "totalOutputVolumeValue": "663689.9503",
        "averageNumberOfTransactionsPerBlock": "374"
    },
    {
        "month": "9",
        "day": "13",
        "year": "2013",
        "price": "128.29",
        "totalCirculation": "11694575",
        "totalTransactionFees": "26.42562521",
        "numberOfUniqueBitcoinAddressesUsed": "59829",
        "totalOutputVolumeValue": "734589.3105",
        "averageNumberOfTransactionsPerBlock": "426"
    },
    {
        "month": "9",
        "day": "14",
        "year": "2013",
        "price": "124.32",
        "totalCirculation": "11699975",
        "totalTransactionFees": "21.9094985",
        "numberOfUniqueBitcoinAddressesUsed": "48712",
        "totalOutputVolumeValue": "606148.1933",
        "averageNumberOfTransactionsPerBlock": "302"
    },
    {
        "month": "9",
        "day": "15",
        "year": "2013",
        "price": "125.46",
        "totalCirculation": "11704550",
        "totalTransactionFees": "24.16845305",
        "numberOfUniqueBitcoinAddressesUsed": "42924",
        "totalOutputVolumeValue": "410950.2141",
        "averageNumberOfTransactionsPerBlock": "305"
    },
    {
        "month": "9",
        "day": "16",
        "year": "2013",
        "price": "126.02",
        "totalCirculation": "11708775",
        "totalTransactionFees": "29.82849822",
        "numberOfUniqueBitcoinAddressesUsed": "52304",
        "totalOutputVolumeValue": "585717.368",
        "averageNumberOfTransactionsPerBlock": "284"
    },
    {
        "month": "9",
        "day": "17",
        "year": "2013",
        "price": "127.56",
        "totalCirculation": "11713200",
        "totalTransactionFees": "90.93785999",
        "numberOfUniqueBitcoinAddressesUsed": "61057",
        "totalOutputVolumeValue": "672793.4335",
        "averageNumberOfTransactionsPerBlock": "255"
    },
    {
        "month": "9",
        "day": "18",
        "year": "2013",
        "price": "127.23",
        "totalCirculation": "11716975",
        "totalTransactionFees": "303.0384485",
        "numberOfUniqueBitcoinAddressesUsed": "65538",
        "totalOutputVolumeValue": "788617.1299",
        "averageNumberOfTransactionsPerBlock": "272"
    },
    {
        "month": "9",
        "day": "19",
        "year": "2013",
        "price": "124.1",
        "totalCirculation": "11721850",
        "totalTransactionFees": "111.427816",
        "numberOfUniqueBitcoinAddressesUsed": "66398",
        "totalOutputVolumeValue": "785082.7042",
        "averageNumberOfTransactionsPerBlock": "316"
    },
    {
        "month": "9",
        "day": "20",
        "year": "2013",
        "price": "123.98",
        "totalCirculation": "11726675",
        "totalTransactionFees": "35.98775791",
        "numberOfUniqueBitcoinAddressesUsed": "65306",
        "totalOutputVolumeValue": "793416.423",
        "averageNumberOfTransactionsPerBlock": "271"
    },
    {
        "month": "9",
        "day": "21",
        "year": "2013",
        "price": "123.5",
        "totalCirculation": "11731350",
        "totalTransactionFees": "26.17798718",
        "numberOfUniqueBitcoinAddressesUsed": "58758",
        "totalOutputVolumeValue": "522574.7648",
        "averageNumberOfTransactionsPerBlock": "317"
    },
    {
        "month": "9",
        "day": "22",
        "year": "2013",
        "price": "122.78",
        "totalCirculation": "11736500",
        "totalTransactionFees": "27.4817632",
        "numberOfUniqueBitcoinAddressesUsed": "53993",
        "totalOutputVolumeValue": "458740.4706",
        "averageNumberOfTransactionsPerBlock": "286"
    },
    {
        "month": "9",
        "day": "23",
        "year": "2013",
        "price": "123.02",
        "totalCirculation": "11742025",
        "totalTransactionFees": "36.37139814",
        "numberOfUniqueBitcoinAddressesUsed": "62037",
        "totalOutputVolumeValue": "783517.9985",
        "averageNumberOfTransactionsPerBlock": "261"
    },
    {
        "month": "9",
        "day": "24",
        "year": "2013",
        "price": "122.59",
        "totalCirculation": "11747050",
        "totalTransactionFees": "31.74116641",
        "numberOfUniqueBitcoinAddressesUsed": "65845",
        "totalOutputVolumeValue": "1095771.974",
        "averageNumberOfTransactionsPerBlock": "248"
    },
    {
        "month": "9",
        "day": "25",
        "year": "2013",
        "price": "124.18",
        "totalCirculation": "11752400",
        "totalTransactionFees": "30.8215087",
        "numberOfUniqueBitcoinAddressesUsed": "66539",
        "totalOutputVolumeValue": "842440.8585",
        "averageNumberOfTransactionsPerBlock": "256"
    },
    {
        "month": "9",
        "day": "26",
        "year": "2013",
        "price": "123.85",
        "totalCirculation": "11756675",
        "totalTransactionFees": "28.01795022",
        "numberOfUniqueBitcoinAddressesUsed": "63157",
        "totalOutputVolumeValue": "717166.1371",
        "averageNumberOfTransactionsPerBlock": "282"
    },
    {
        "month": "9",
        "day": "27",
        "year": "2013",
        "price": "125.6",
        "totalCirculation": "11761075",
        "totalTransactionFees": "82.75466408",
        "numberOfUniqueBitcoinAddressesUsed": "66494",
        "totalOutputVolumeValue": "718883.7734",
        "averageNumberOfTransactionsPerBlock": "349"
    },
    {
        "month": "9",
        "day": "28",
        "year": "2013",
        "price": "126.5",
        "totalCirculation": "11765350",
        "totalTransactionFees": "27.84186309",
        "numberOfUniqueBitcoinAddressesUsed": "60434",
        "totalOutputVolumeValue": "592862.7568",
        "averageNumberOfTransactionsPerBlock": "296"
    },
    {
        "month": "9",
        "day": "29",
        "year": "2013",
        "price": "128.1",
        "totalCirculation": "11769550",
        "totalTransactionFees": "19.75447388",
        "numberOfUniqueBitcoinAddressesUsed": "54587",
        "totalOutputVolumeValue": "560375.1583",
        "averageNumberOfTransactionsPerBlock": "307"
    },
    {
        "month": "9",
        "day": "30",
        "year": "2013",
        "price": "125.8",
        "totalCirculation": "11773650",
        "totalTransactionFees": "26.00052268",
        "numberOfUniqueBitcoinAddressesUsed": "61734",
        "totalOutputVolumeValue": "691501.3174",
        "averageNumberOfTransactionsPerBlock": "226"
    },
    {
        "month": "10",
        "day": "1",
        "year": "2013",
        "price": "127.11",
        "totalCirculation": "11778550",
        "totalTransactionFees": "36.02532288",
        "numberOfUniqueBitcoinAddressesUsed": "69975",
        "totalOutputVolumeValue": "1039752.258",
        "averageNumberOfTransactionsPerBlock": "221"
    },
    {
        "month": "10",
        "day": "2",
        "year": "2013",
        "price": "104.47",
        "totalCirculation": "11782875",
        "totalTransactionFees": "35.39513493",
        "numberOfUniqueBitcoinAddressesUsed": "77571",
        "totalOutputVolumeValue": "1095329.729",
        "averageNumberOfTransactionsPerBlock": "282"
    },
    {
        "month": "10",
        "day": "3",
        "year": "2013",
        "price": "116.95",
        "totalCirculation": "11788075",
        "totalTransactionFees": "40.37392697",
        "numberOfUniqueBitcoinAddressesUsed": "72720",
        "totalOutputVolumeValue": "1108953.948",
        "averageNumberOfTransactionsPerBlock": "274"
    },
    {
        "month": "10",
        "day": "4",
        "year": "2013",
        "price": "122",
        "totalCirculation": "11792525",
        "totalTransactionFees": "33.53991469",
        "numberOfUniqueBitcoinAddressesUsed": "64698",
        "totalOutputVolumeValue": "829560.5917",
        "averageNumberOfTransactionsPerBlock": "256"
    },
    {
        "month": "10",
        "day": "5",
        "year": "2013",
        "price": "121.51",
        "totalCirculation": "11797800",
        "totalTransactionFees": "26.70745176",
        "numberOfUniqueBitcoinAddressesUsed": "55710",
        "totalOutputVolumeValue": "550816.6317",
        "averageNumberOfTransactionsPerBlock": "296"
    },
    {
        "month": "10",
        "day": "6",
        "year": "2013",
        "price": "121.6",
        "totalCirculation": "11802850",
        "totalTransactionFees": "21.98375278",
        "numberOfUniqueBitcoinAddressesUsed": "48783",
        "totalOutputVolumeValue": "410691.0149",
        "averageNumberOfTransactionsPerBlock": "307"
    },
    {
        "month": "10",
        "day": "7",
        "year": "2013",
        "price": "123.6",
        "totalCirculation": "11806675",
        "totalTransactionFees": "32.99949234",
        "numberOfUniqueBitcoinAddressesUsed": "58652",
        "totalOutputVolumeValue": "595294.0665",
        "averageNumberOfTransactionsPerBlock": "252"
    },
    {
        "month": "10",
        "day": "8",
        "year": "2013",
        "price": "123.84",
        "totalCirculation": "11810575",
        "totalTransactionFees": "16.18054086",
        "numberOfUniqueBitcoinAddressesUsed": "60475",
        "totalOutputVolumeValue": "707716.7127",
        "averageNumberOfTransactionsPerBlock": "223"
    },
    {
        "month": "10",
        "day": "9",
        "year": "2013",
        "price": "126.08",
        "totalCirculation": "11815150",
        "totalTransactionFees": "25.13904198",
        "numberOfUniqueBitcoinAddressesUsed": "69133",
        "totalOutputVolumeValue": "862761.0195",
        "averageNumberOfTransactionsPerBlock": "216"
    },
    {
        "month": "10",
        "day": "10",
        "year": "2013",
        "price": "126.43",
        "totalCirculation": "11820025",
        "totalTransactionFees": "29.73024401",
        "numberOfUniqueBitcoinAddressesUsed": "65216",
        "totalOutputVolumeValue": "824938.1381",
        "averageNumberOfTransactionsPerBlock": "231"
    },
    {
        "month": "10",
        "day": "11",
        "year": "2013",
        "price": "126.84",
        "totalCirculation": "11824450",
        "totalTransactionFees": "28.46158064",
        "numberOfUniqueBitcoinAddressesUsed": "67974",
        "totalOutputVolumeValue": "870771.6175",
        "averageNumberOfTransactionsPerBlock": "237"
    },
    {
        "month": "10",
        "day": "12",
        "year": "2013",
        "price": "127.53",
        "totalCirculation": "11829375",
        "totalTransactionFees": "32.21519984",
        "numberOfUniqueBitcoinAddressesUsed": "58649",
        "totalOutputVolumeValue": "715254.4658",
        "averageNumberOfTransactionsPerBlock": "252"
    },
    {
        "month": "10",
        "day": "13",
        "year": "2013",
        "price": "129.74",
        "totalCirculation": "11835100",
        "totalTransactionFees": "31.15736732",
        "numberOfUniqueBitcoinAddressesUsed": "57180",
        "totalOutputVolumeValue": "637885.7799",
        "averageNumberOfTransactionsPerBlock": "349"
    },
    {
        "month": "10",
        "day": "14",
        "year": "2013",
        "price": "135.69",
        "totalCirculation": "11841550",
        "totalTransactionFees": "24.76312632",
        "numberOfUniqueBitcoinAddressesUsed": "74721",
        "totalOutputVolumeValue": "963077.955",
        "averageNumberOfTransactionsPerBlock": "249"
    },
    {
        "month": "10",
        "day": "15",
        "year": "2013",
        "price": "139.24",
        "totalCirculation": "11847750",
        "totalTransactionFees": "46.86833704",
        "numberOfUniqueBitcoinAddressesUsed": "70171",
        "totalOutputVolumeValue": "822209.7656",
        "averageNumberOfTransactionsPerBlock": "230"
    },
    {
        "month": "10",
        "day": "16",
        "year": "2013",
        "price": "141.83",
        "totalCirculation": "11853225",
        "totalTransactionFees": "36.84323895",
        "numberOfUniqueBitcoinAddressesUsed": "74562",
        "totalOutputVolumeValue": "1024516.321",
        "averageNumberOfTransactionsPerBlock": "289"
    },
    {
        "month": "10",
        "day": "17",
        "year": "2013",
        "price": "143.33",
        "totalCirculation": "11857700",
        "totalTransactionFees": "39.50246713",
        "numberOfUniqueBitcoinAddressesUsed": "68607",
        "totalOutputVolumeValue": "912009.3743",
        "averageNumberOfTransactionsPerBlock": "260"
    },
    {
        "month": "10",
        "day": "18",
        "year": "2013",
        "price": "150.59",
        "totalCirculation": "11862025",
        "totalTransactionFees": "45.53965756",
        "numberOfUniqueBitcoinAddressesUsed": "69519",
        "totalOutputVolumeValue": "880504.6042",
        "averageNumberOfTransactionsPerBlock": "258"
    },
    {
        "month": "10",
        "day": "19",
        "year": "2013",
        "price": "165.05",
        "totalCirculation": "11867500",
        "totalTransactionFees": "35.8234771",
        "numberOfUniqueBitcoinAddressesUsed": "75457",
        "totalOutputVolumeValue": "1066912.825",
        "averageNumberOfTransactionsPerBlock": "302"
    },
    {
        "month": "10",
        "day": "20",
        "year": "2013",
        "price": "165.71",
        "totalCirculation": "11872900",
        "totalTransactionFees": "27.8955071",
        "numberOfUniqueBitcoinAddressesUsed": "64030",
        "totalOutputVolumeValue": "691056.4816",
        "averageNumberOfTransactionsPerBlock": "249"
    },
    {
        "month": "10",
        "day": "21",
        "year": "2013",
        "price": "177.07",
        "totalCirculation": "11877925",
        "totalTransactionFees": "36.82997401",
        "numberOfUniqueBitcoinAddressesUsed": "73341",
        "totalOutputVolumeValue": "979061.3851",
        "averageNumberOfTransactionsPerBlock": "248"
    },
    {
        "month": "10",
        "day": "22",
        "year": "2013",
        "price": "191.78",
        "totalCirculation": "11884150",
        "totalTransactionFees": "41.67292026",
        "numberOfUniqueBitcoinAddressesUsed": "89356",
        "totalOutputVolumeValue": "1235490.634",
        "averageNumberOfTransactionsPerBlock": "250"
    },
    {
        "month": "10",
        "day": "23",
        "year": "2013",
        "price": "199.95",
        "totalCirculation": "11889425",
        "totalTransactionFees": "36.67520171",
        "numberOfUniqueBitcoinAddressesUsed": "87179",
        "totalOutputVolumeValue": "1096234.374",
        "averageNumberOfTransactionsPerBlock": "271"
    },
    {
        "month": "10",
        "day": "24",
        "year": "2013",
        "price": "195.78",
        "totalCirculation": "11894650",
        "totalTransactionFees": "49.26787775",
        "numberOfUniqueBitcoinAddressesUsed": "88605",
        "totalOutputVolumeValue": "1068753.626",
        "averageNumberOfTransactionsPerBlock": "326"
    },
    {
        "month": "10",
        "day": "25",
        "year": "2013",
        "price": "172.81",
        "totalCirculation": "11900650",
        "totalTransactionFees": "46.75449972",
        "numberOfUniqueBitcoinAddressesUsed": "82770",
        "totalOutputVolumeValue": "2883479.398",
        "averageNumberOfTransactionsPerBlock": "244"
    },
    {
        "month": "10",
        "day": "26",
        "year": "2013",
        "price": "179.71",
        "totalCirculation": "11905625",
        "totalTransactionFees": "53.66366945",
        "numberOfUniqueBitcoinAddressesUsed": "67249",
        "totalOutputVolumeValue": "702233.6587",
        "averageNumberOfTransactionsPerBlock": "270"
    },
    {
        "month": "10",
        "day": "27",
        "year": "2013",
        "price": "189.06",
        "totalCirculation": "11910050",
        "totalTransactionFees": "44.03445576",
        "numberOfUniqueBitcoinAddressesUsed": "54418",
        "totalOutputVolumeValue": "505512.469",
        "averageNumberOfTransactionsPerBlock": "254"
    },
    {
        "month": "10",
        "day": "28",
        "year": "2013",
        "price": "196.25",
        "totalCirculation": "11914525",
        "totalTransactionFees": "43.74981757",
        "numberOfUniqueBitcoinAddressesUsed": "63786",
        "totalOutputVolumeValue": "613494.0734",
        "averageNumberOfTransactionsPerBlock": "189"
    },
    {
        "month": "10",
        "day": "29",
        "year": "2013",
        "price": "202.09",
        "totalCirculation": "11918450",
        "totalTransactionFees": "26.14906747",
        "numberOfUniqueBitcoinAddressesUsed": "70275",
        "totalOutputVolumeValue": "1671663.71",
        "averageNumberOfTransactionsPerBlock": "182"
    },
    {
        "month": "10",
        "day": "30",
        "year": "2013",
        "price": "203.39",
        "totalCirculation": "11923350",
        "totalTransactionFees": "38.08800627",
        "numberOfUniqueBitcoinAddressesUsed": "77520",
        "totalOutputVolumeValue": "712930.2264",
        "averageNumberOfTransactionsPerBlock": "210"
    },
    {
        "month": "10",
        "day": "31",
        "year": "2013",
        "price": "201.61",
        "totalCirculation": "11928575",
        "totalTransactionFees": "30.03529546",
        "numberOfUniqueBitcoinAddressesUsed": "77578",
        "totalOutputVolumeValue": "695676.6571",
        "averageNumberOfTransactionsPerBlock": "300"
    },
    {
        "month": "11",
        "day": "1",
        "year": "2013",
        "price": "203.24",
        "totalCirculation": "11933325",
        "totalTransactionFees": "35.40296681",
        "numberOfUniqueBitcoinAddressesUsed": "72946",
        "totalOutputVolumeValue": "686117.5332",
        "averageNumberOfTransactionsPerBlock": "339"
    },
    {
        "month": "11",
        "day": "2",
        "year": "2013",
        "price": "204.15",
        "totalCirculation": "11938750",
        "totalTransactionFees": "23.87084674",
        "numberOfUniqueBitcoinAddressesUsed": "69196",
        "totalOutputVolumeValue": "686361.0603",
        "averageNumberOfTransactionsPerBlock": "380"
    },
    {
        "month": "11",
        "day": "3",
        "year": "2013",
        "price": "206.85",
        "totalCirculation": "11943650",
        "totalTransactionFees": "24.97396102",
        "numberOfUniqueBitcoinAddressesUsed": "63309",
        "totalOutputVolumeValue": "538328.0159",
        "averageNumberOfTransactionsPerBlock": "450"
    },
    {
        "month": "11",
        "day": "4",
        "year": "2013",
        "price": "225.1",
        "totalCirculation": "11948650",
        "totalTransactionFees": "67.37958812",
        "numberOfUniqueBitcoinAddressesUsed": "77104",
        "totalOutputVolumeValue": "793106.5572",
        "averageNumberOfTransactionsPerBlock": "407"
    },
    {
        "month": "11",
        "day": "5",
        "year": "2013",
        "price": "246.63",
        "totalCirculation": "11952900",
        "totalTransactionFees": "47.14006645",
        "numberOfUniqueBitcoinAddressesUsed": "93462",
        "totalOutputVolumeValue": "1218397.71",
        "averageNumberOfTransactionsPerBlock": "340"
    },
    {
        "month": "11",
        "day": "6",
        "year": "2013",
        "price": "258.23",
        "totalCirculation": "11956950",
        "totalTransactionFees": "118.3737812",
        "numberOfUniqueBitcoinAddressesUsed": "101631",
        "totalOutputVolumeValue": "945894.5919",
        "averageNumberOfTransactionsPerBlock": "279"
    },
    {
        "month": "11",
        "day": "7",
        "year": "2013",
        "price": "292.32",
        "totalCirculation": "11960800",
        "totalTransactionFees": "117.8109883",
        "numberOfUniqueBitcoinAddressesUsed": "104142",
        "totalOutputVolumeValue": "1071612.897",
        "averageNumberOfTransactionsPerBlock": "309"
    },
    {
        "month": "11",
        "day": "8",
        "year": "2013",
        "price": "325.56",
        "totalCirculation": "11964125",
        "totalTransactionFees": "108.1932055",
        "numberOfUniqueBitcoinAddressesUsed": "107930",
        "totalOutputVolumeValue": "1144910.921",
        "averageNumberOfTransactionsPerBlock": "335"
    },
    {
        "month": "11",
        "day": "9",
        "year": "2013",
        "price": "359.76",
        "totalCirculation": "11967675",
        "totalTransactionFees": "86.29385375",
        "numberOfUniqueBitcoinAddressesUsed": "108461",
        "totalOutputVolumeValue": "1024303.739",
        "averageNumberOfTransactionsPerBlock": "415"
    },
    {
        "month": "11",
        "day": "10",
        "year": "2013",
        "price": "296.91",
        "totalCirculation": "11971875",
        "totalTransactionFees": "52.48680278",
        "numberOfUniqueBitcoinAddressesUsed": "97886",
        "totalOutputVolumeValue": "771057.0323",
        "averageNumberOfTransactionsPerBlock": "380"
    },
    {
        "month": "11",
        "day": "11",
        "year": "2013",
        "price": "339.38",
        "totalCirculation": "11976750",
        "totalTransactionFees": "62.00580352",
        "numberOfUniqueBitcoinAddressesUsed": "86543",
        "totalOutputVolumeValue": "723078.1589",
        "averageNumberOfTransactionsPerBlock": "263"
    },
    {
        "month": "11",
        "day": "12",
        "year": "2013",
        "price": "353.95",
        "totalCirculation": "11981475",
        "totalTransactionFees": "20.0940219",
        "numberOfUniqueBitcoinAddressesUsed": "95747",
        "totalOutputVolumeValue": "1022112.687",
        "averageNumberOfTransactionsPerBlock": "248"
    },
    {
        "month": "11",
        "day": "13",
        "year": "2013",
        "price": "391.64",
        "totalCirculation": "11986175",
        "totalTransactionFees": "24.28778395",
        "numberOfUniqueBitcoinAddressesUsed": "100090",
        "totalOutputVolumeValue": "1201973.744",
        "averageNumberOfTransactionsPerBlock": "446"
    },
    {
        "month": "11",
        "day": "14",
        "year": "2013",
        "price": "416.5",
        "totalCirculation": "11990400",
        "totalTransactionFees": "23.93546077",
        "numberOfUniqueBitcoinAddressesUsed": "113020",
        "totalOutputVolumeValue": "1263986.952",
        "averageNumberOfTransactionsPerBlock": "602"
    },
    {
        "month": "11",
        "day": "15",
        "year": "2013",
        "price": "428.24",
        "totalCirculation": "11994475",
        "totalTransactionFees": "18.56994291",
        "numberOfUniqueBitcoinAddressesUsed": "97415",
        "totalOutputVolumeValue": "2139315.185",
        "averageNumberOfTransactionsPerBlock": "478"
    },
    {
        "month": "11",
        "day": "16",
        "year": "2013",
        "price": "433.53",
        "totalCirculation": "11999375",
        "totalTransactionFees": "15.43971301",
        "numberOfUniqueBitcoinAddressesUsed": "97096",
        "totalOutputVolumeValue": "1922099.308",
        "averageNumberOfTransactionsPerBlock": "479"
    },
    {
        "month": "11",
        "day": "17",
        "year": "2013",
        "price": "463",
        "totalCirculation": "12004200",
        "totalTransactionFees": "15.1031091",
        "numberOfUniqueBitcoinAddressesUsed": "86411",
        "totalOutputVolumeValue": "1032920.081",
        "averageNumberOfTransactionsPerBlock": "461"
    },
    {
        "month": "11",
        "day": "18",
        "year": "2013",
        "price": "583.16",
        "totalCirculation": "12008300",
        "totalTransactionFees": "25.27467522",
        "numberOfUniqueBitcoinAddressesUsed": "130894",
        "totalOutputVolumeValue": "1868810.008",
        "averageNumberOfTransactionsPerBlock": "463"
    },
    {
        "month": "11",
        "day": "19",
        "year": "2013",
        "price": "559.99",
        "totalCirculation": "12012175",
        "totalTransactionFees": "32.54373365",
        "numberOfUniqueBitcoinAddressesUsed": "170367",
        "totalOutputVolumeValue": "2532380.22",
        "averageNumberOfTransactionsPerBlock": "348"
    },
    {
        "month": "11",
        "day": "20",
        "year": "2013",
        "price": "595",
        "totalCirculation": "12016250",
        "totalTransactionFees": "25.18151883",
        "numberOfUniqueBitcoinAddressesUsed": "141505",
        "totalOutputVolumeValue": "1605499.29",
        "averageNumberOfTransactionsPerBlock": "399"
    },
    {
        "month": "11",
        "day": "21",
        "year": "2013",
        "price": "694.95",
        "totalCirculation": "12019950",
        "totalTransactionFees": "26.57492613",
        "numberOfUniqueBitcoinAddressesUsed": "124584",
        "totalOutputVolumeValue": "2028461.556",
        "averageNumberOfTransactionsPerBlock": "488"
    },
    {
        "month": "11",
        "day": "22",
        "year": "2013",
        "price": "761",
        "totalCirculation": "12024100",
        "totalTransactionFees": "23.61058302",
        "numberOfUniqueBitcoinAddressesUsed": "140082",
        "totalOutputVolumeValue": "2680025.273",
        "averageNumberOfTransactionsPerBlock": "549"
    },
    {
        "month": "11",
        "day": "23",
        "year": "2013",
        "price": "837.99",
        "totalCirculation": "12028150",
        "totalTransactionFees": "21.86122464",
        "numberOfUniqueBitcoinAddressesUsed": "134532",
        "totalOutputVolumeValue": "1528167.612",
        "averageNumberOfTransactionsPerBlock": "560"
    },
    {
        "month": "11",
        "day": "24",
        "year": "2013",
        "price": "833.16",
        "totalCirculation": "12032450",
        "totalTransactionFees": "17.57820997",
        "numberOfUniqueBitcoinAddressesUsed": "103353",
        "totalOutputVolumeValue": "1415956.724",
        "averageNumberOfTransactionsPerBlock": "488"
    },
    {
        "month": "11",
        "day": "25",
        "year": "2013",
        "price": "814",
        "totalCirculation": "12036950",
        "totalTransactionFees": "19.27979672",
        "numberOfUniqueBitcoinAddressesUsed": "117870",
        "totalOutputVolumeValue": "1453068.816",
        "averageNumberOfTransactionsPerBlock": "505"
    },
    {
        "month": "11",
        "day": "26",
        "year": "2013",
        "price": "844.9",
        "totalCirculation": "12041050",
        "totalTransactionFees": "24.05961565",
        "numberOfUniqueBitcoinAddressesUsed": "145494",
        "totalOutputVolumeValue": "3518557.604",
        "averageNumberOfTransactionsPerBlock": "344"
    },
    {
        "month": "11",
        "day": "27",
        "year": "2013",
        "price": "961",
        "totalCirculation": "12045200",
        "totalTransactionFees": "28.13438242",
        "numberOfUniqueBitcoinAddressesUsed": "164541",
        "totalOutputVolumeValue": "3576079.926",
        "averageNumberOfTransactionsPerBlock": "455"
    },
    {
        "month": "11",
        "day": "28",
        "year": "2013",
        "price": "1009",
        "totalCirculation": "12049750",
        "totalTransactionFees": "32.98440093",
        "numberOfUniqueBitcoinAddressesUsed": "180643",
        "totalOutputVolumeValue": "3492155.695",
        "averageNumberOfTransactionsPerBlock": "411"
    },
    {
        "month": "11",
        "day": "29",
        "year": "2013",
        "price": "1083.9",
        "totalCirculation": "12054375",
        "totalTransactionFees": "25.92092417",
        "numberOfUniqueBitcoinAddressesUsed": "160752",
        "totalOutputVolumeValue": "2819146.404",
        "averageNumberOfTransactionsPerBlock": "450"
    },
    {
        "month": "11",
        "day": "30",
        "year": "2013",
        "price": "1119.96",
        "totalCirculation": "12058375",
        "totalTransactionFees": "22.01670436",
        "numberOfUniqueBitcoinAddressesUsed": "150747",
        "totalOutputVolumeValue": "1908515.759",
        "averageNumberOfTransactionsPerBlock": "497"
    },
    {
        "month": "12",
        "day": "1",
        "year": "2013",
        "price": "970",
        "totalCirculation": "12063250",
        "totalTransactionFees": "17.71816338",
        "numberOfUniqueBitcoinAddressesUsed": "125448",
        "totalOutputVolumeValue": "1459358.22",
        "averageNumberOfTransactionsPerBlock": "337"
    },
    {
        "month": "12",
        "day": "2",
        "year": "2013",
        "price": "992.27",
        "totalCirculation": "12067325",
        "totalTransactionFees": "19.64441022",
        "numberOfUniqueBitcoinAddressesUsed": "144106",
        "totalOutputVolumeValue": "1408867.796",
        "averageNumberOfTransactionsPerBlock": "391"
    },
    {
        "month": "12",
        "day": "3",
        "year": "2013",
        "price": "1060",
        "totalCirculation": "12072075",
        "totalTransactionFees": "21.85614673",
        "numberOfUniqueBitcoinAddressesUsed": "149257",
        "totalOutputVolumeValue": "1224061.223",
        "averageNumberOfTransactionsPerBlock": "274"
    },
    {
        "month": "12",
        "day": "4",
        "year": "2013",
        "price": "1151",
        "totalCirculation": "12076500",
        "totalTransactionFees": "21.13728202",
        "numberOfUniqueBitcoinAddressesUsed": "150637",
        "totalOutputVolumeValue": "1393612.33",
        "averageNumberOfTransactionsPerBlock": "293"
    },
    {
        "month": "12",
        "day": "5",
        "year": "2013",
        "price": "1028.34",
        "totalCirculation": "12080775",
        "totalTransactionFees": "21.98836499",
        "numberOfUniqueBitcoinAddressesUsed": "164289",
        "totalOutputVolumeValue": "1464895.121",
        "averageNumberOfTransactionsPerBlock": "337"
    },
    {
        "month": "12",
        "day": "6",
        "year": "2013",
        "price": "894",
        "totalCirculation": "12086050",
        "totalTransactionFees": "18.58752694",
        "numberOfUniqueBitcoinAddressesUsed": "140744",
        "totalOutputVolumeValue": "1218717.233",
        "averageNumberOfTransactionsPerBlock": "432"
    },
    {
        "month": "12",
        "day": "7",
        "year": "2013",
        "price": "727.29",
        "totalCirculation": "12090850",
        "totalTransactionFees": "20.50910369",
        "numberOfUniqueBitcoinAddressesUsed": "143645",
        "totalOutputVolumeValue": "2246474.26",
        "averageNumberOfTransactionsPerBlock": "359"
    },
    {
        "month": "12",
        "day": "8",
        "year": "2013",
        "price": "722.99",
        "totalCirculation": "12095325",
        "totalTransactionFees": "32.37259238",
        "numberOfUniqueBitcoinAddressesUsed": "95996",
        "totalOutputVolumeValue": "1409374.732",
        "averageNumberOfTransactionsPerBlock": "360"
    },
    {
        "month": "12",
        "day": "9",
        "year": "2013",
        "price": "871",
        "totalCirculation": "12100200",
        "totalTransactionFees": "12.81918828",
        "numberOfUniqueBitcoinAddressesUsed": "127647",
        "totalOutputVolumeValue": "1241954.374",
        "averageNumberOfTransactionsPerBlock": "279"
    },
    {
        "month": "12",
        "day": "10",
        "year": "2013",
        "price": "936.98",
        "totalCirculation": "12105225",
        "totalTransactionFees": "19.97697104",
        "numberOfUniqueBitcoinAddressesUsed": "128388",
        "totalOutputVolumeValue": "883234.4513",
        "averageNumberOfTransactionsPerBlock": "291"
    },
    {
        "month": "12",
        "day": "11",
        "year": "2013",
        "price": "886.2",
        "totalCirculation": "12109175",
        "totalTransactionFees": "17.69299634",
        "numberOfUniqueBitcoinAddressesUsed": "129666",
        "totalOutputVolumeValue": "1116560.57",
        "averageNumberOfTransactionsPerBlock": "326"
    },
    {
        "month": "12",
        "day": "12",
        "year": "2013",
        "price": "845.75",
        "totalCirculation": "12113325",
        "totalTransactionFees": "14.89978988",
        "numberOfUniqueBitcoinAddressesUsed": "113825",
        "totalOutputVolumeValue": "800870.1968",
        "averageNumberOfTransactionsPerBlock": "363"
    },
    {
        "month": "12",
        "day": "13",
        "year": "2013",
        "price": "874",
        "totalCirculation": "12117475",
        "totalTransactionFees": "14.94454362",
        "numberOfUniqueBitcoinAddressesUsed": "120982",
        "totalOutputVolumeValue": "1015077.8",
        "averageNumberOfTransactionsPerBlock": "388"
    },
    {
        "month": "12",
        "day": "14",
        "year": "2013",
        "price": "864.7",
        "totalCirculation": "12122475",
        "totalTransactionFees": "13.21918752",
        "numberOfUniqueBitcoinAddressesUsed": "113263",
        "totalOutputVolumeValue": "685149.2235",
        "averageNumberOfTransactionsPerBlock": "318"
    },
    {
        "month": "12",
        "day": "15",
        "year": "2013",
        "price": "848.17",
        "totalCirculation": "12126925",
        "totalTransactionFees": "11.2711577",
        "numberOfUniqueBitcoinAddressesUsed": "103782",
        "totalOutputVolumeValue": "479877.2723",
        "averageNumberOfTransactionsPerBlock": "343"
    },
    {
        "month": "12",
        "day": "16",
        "year": "2013",
        "price": "709",
        "totalCirculation": "12131750",
        "totalTransactionFees": "14.01108799",
        "numberOfUniqueBitcoinAddressesUsed": "137337",
        "totalOutputVolumeValue": "1464660.948",
        "averageNumberOfTransactionsPerBlock": "362"
    },
    {
        "month": "12",
        "day": "17",
        "year": "2013",
        "price": "702.05",
        "totalCirculation": "12136675",
        "totalTransactionFees": "16.22399978",
        "numberOfUniqueBitcoinAddressesUsed": "139023",
        "totalOutputVolumeValue": "2043815.893",
        "averageNumberOfTransactionsPerBlock": "310"
    },
    {
        "month": "12",
        "day": "18",
        "year": "2013",
        "price": "576.16",
        "totalCirculation": "12141925",
        "totalTransactionFees": "18.50617393",
        "numberOfUniqueBitcoinAddressesUsed": "153222",
        "totalOutputVolumeValue": "2028260.308",
        "averageNumberOfTransactionsPerBlock": "327"
    },
    {
        "month": "12",
        "day": "19",
        "year": "2013",
        "price": "653",
        "totalCirculation": "12147325",
        "totalTransactionFees": "15.81127156",
        "numberOfUniqueBitcoinAddressesUsed": "134257",
        "totalOutputVolumeValue": "1314311.995",
        "averageNumberOfTransactionsPerBlock": "342"
    },
    {
        "month": "12",
        "day": "20",
        "year": "2013",
        "price": "660",
        "totalCirculation": "12152375",
        "totalTransactionFees": "16.24572703",
        "numberOfUniqueBitcoinAddressesUsed": "125004",
        "totalOutputVolumeValue": "1090953.043",
        "averageNumberOfTransactionsPerBlock": "331"
    },
    {
        "month": "12",
        "day": "21",
        "year": "2013",
        "price": "612.5",
        "totalCirculation": "12156450",
        "totalTransactionFees": "14.69955031",
        "numberOfUniqueBitcoinAddressesUsed": "110306",
        "totalOutputVolumeValue": "1054795.099",
        "averageNumberOfTransactionsPerBlock": "271"
    },
    {
        "month": "12",
        "day": "22",
        "year": "2013",
        "price": "637",
        "totalCirculation": "12160600",
        "totalTransactionFees": "11.14297494",
        "numberOfUniqueBitcoinAddressesUsed": "98559",
        "totalOutputVolumeValue": "754702.3536",
        "averageNumberOfTransactionsPerBlock": "315"
    },
    {
        "month": "12",
        "day": "23",
        "year": "2013",
        "price": "639.9",
        "totalCirculation": "12164575",
        "totalTransactionFees": "11.43633559",
        "numberOfUniqueBitcoinAddressesUsed": "105307",
        "totalOutputVolumeValue": "801056.1802",
        "averageNumberOfTransactionsPerBlock": "291"
    },
    {
        "month": "12",
        "day": "24",
        "year": "2013",
        "price": "647.27",
        "totalCirculation": "12168725",
        "totalTransactionFees": "12.64534115",
        "numberOfUniqueBitcoinAddressesUsed": "135360",
        "totalOutputVolumeValue": "752936.8719",
        "averageNumberOfTransactionsPerBlock": "326"
    },
    {
        "month": "12",
        "day": "25",
        "year": "2013",
        "price": "658.07",
        "totalCirculation": "12173025",
        "totalTransactionFees": "12.45799785",
        "numberOfUniqueBitcoinAddressesUsed": "120437",
        "totalOutputVolumeValue": "1097540.476",
        "averageNumberOfTransactionsPerBlock": "291"
    },
    {
        "month": "12",
        "day": "26",
        "year": "2013",
        "price": "734.42",
        "totalCirculation": "12177500",
        "totalTransactionFees": "11.77737607",
        "numberOfUniqueBitcoinAddressesUsed": "97504",
        "totalOutputVolumeValue": "553891.0205",
        "averageNumberOfTransactionsPerBlock": "309"
    },
    {
        "month": "12",
        "day": "27",
        "year": "2013",
        "price": "715.51",
        "totalCirculation": "12181875",
        "totalTransactionFees": "13.52135419",
        "numberOfUniqueBitcoinAddressesUsed": "115404",
        "totalOutputVolumeValue": "566821.5729",
        "averageNumberOfTransactionsPerBlock": "207"
    },
    {
        "month": "12",
        "day": "28",
        "year": "2013",
        "price": "701.61",
        "totalCirculation": "12185975",
        "totalTransactionFees": "11.80259669",
        "numberOfUniqueBitcoinAddressesUsed": "95474",
        "totalOutputVolumeValue": "714279.8895",
        "averageNumberOfTransactionsPerBlock": "331"
    },
    {
        "month": "12",
        "day": "29",
        "year": "2013",
        "price": "714.79",
        "totalCirculation": "12189725",
        "totalTransactionFees": "11.46103748",
        "numberOfUniqueBitcoinAddressesUsed": "93084",
        "totalOutputVolumeValue": "744045.3184",
        "averageNumberOfTransactionsPerBlock": "391"
    },
    {
        "month": "12",
        "day": "30",
        "year": "2013",
        "price": "739.1",
        "totalCirculation": "12194575",
        "totalTransactionFees": "14.91471734",
        "numberOfUniqueBitcoinAddressesUsed": "130692",
        "totalOutputVolumeValue": "811163.1271",
        "averageNumberOfTransactionsPerBlock": "364"
    },
    {
        "month": "12",
        "day": "31",
        "year": "2013",
        "price": "731",
        "totalCirculation": "12198800",
        "totalTransactionFees": "11.43245003",
        "numberOfUniqueBitcoinAddressesUsed": "108166",
        "totalOutputVolumeValue": "640497.3879",
        "averageNumberOfTransactionsPerBlock": "309"
    },
    {
        "month": "1",
        "day": "1",
        "year": "2014",
        "price": "746.9",
        "totalCirculation": "12203800",
        "totalTransactionFees": "9.18372917",
        "numberOfUniqueBitcoinAddressesUsed": "83356",
        "totalOutputVolumeValue": "525007.9021",
        "averageNumberOfTransactionsPerBlock": "381"
    },
    {
        "month": "1",
        "day": "2",
        "year": "2014",
        "price": "758.01",
        "totalCirculation": "12207450",
        "totalTransactionFees": "12.12566192",
        "numberOfUniqueBitcoinAddressesUsed": "103246",
        "totalOutputVolumeValue": "590706.9477",
        "averageNumberOfTransactionsPerBlock": "332"
    },
    {
        "month": "1",
        "day": "3",
        "year": "2014",
        "price": "806.21",
        "totalCirculation": "12211525",
        "totalTransactionFees": "14.56454873",
        "numberOfUniqueBitcoinAddressesUsed": "125864",
        "totalOutputVolumeValue": "963612.8783",
        "averageNumberOfTransactionsPerBlock": "319"
    },
    {
        "month": "1",
        "day": "4",
        "year": "2014",
        "price": "822.38",
        "totalCirculation": "12215225",
        "totalTransactionFees": "12.68023544",
        "numberOfUniqueBitcoinAddressesUsed": "103502",
        "totalOutputVolumeValue": "609284.4477",
        "averageNumberOfTransactionsPerBlock": "322"
    },
    {
        "month": "1",
        "day": "5",
        "year": "2014",
        "price": "896",
        "totalCirculation": "12219725",
        "totalTransactionFees": "13.24221702",
        "numberOfUniqueBitcoinAddressesUsed": "106688",
        "totalOutputVolumeValue": "847976.263",
        "averageNumberOfTransactionsPerBlock": "280"
    },
    {
        "month": "1",
        "day": "6",
        "year": "2014",
        "price": "934.21",
        "totalCirculation": "12224150",
        "totalTransactionFees": "29.71047036",
        "numberOfUniqueBitcoinAddressesUsed": "152700",
        "totalOutputVolumeValue": "881121.2085",
        "averageNumberOfTransactionsPerBlock": "272"
    },
    {
        "month": "1",
        "day": "7",
        "year": "2014",
        "price": "867.38",
        "totalCirculation": "12228825",
        "totalTransactionFees": "15.37383323",
        "numberOfUniqueBitcoinAddressesUsed": "121152",
        "totalOutputVolumeValue": "866610.1909",
        "averageNumberOfTransactionsPerBlock": "259"
    },
    {
        "month": "1",
        "day": "8",
        "year": "2014",
        "price": "825.29",
        "totalCirculation": "12233750",
        "totalTransactionFees": "14.28866784",
        "numberOfUniqueBitcoinAddressesUsed": "129583",
        "totalOutputVolumeValue": "1089862.958",
        "averageNumberOfTransactionsPerBlock": "269"
    },
    {
        "month": "1",
        "day": "9",
        "year": "2014",
        "price": "809.17",
        "totalCirculation": "12238275",
        "totalTransactionFees": "12.95045939",
        "numberOfUniqueBitcoinAddressesUsed": "114730",
        "totalOutputVolumeValue": "594481.5504",
        "averageNumberOfTransactionsPerBlock": "360"
    },
    {
        "month": "1",
        "day": "10",
        "year": "2014",
        "price": "827.46",
        "totalCirculation": "12243325",
        "totalTransactionFees": "12.83831463",
        "numberOfUniqueBitcoinAddressesUsed": "112691",
        "totalOutputVolumeValue": "613242.7165",
        "averageNumberOfTransactionsPerBlock": "353"
    },
    {
        "month": "1",
        "day": "11",
        "year": "2014",
        "price": "891.85",
        "totalCirculation": "12248500",
        "totalTransactionFees": "12.47216717",
        "numberOfUniqueBitcoinAddressesUsed": "110670",
        "totalOutputVolumeValue": "438326.0669",
        "averageNumberOfTransactionsPerBlock": "287"
    },
    {
        "month": "1",
        "day": "12",
        "year": "2014",
        "price": "851",
        "totalCirculation": "12253250",
        "totalTransactionFees": "11.56181557",
        "numberOfUniqueBitcoinAddressesUsed": "98958",
        "totalOutputVolumeValue": "383751.2285",
        "averageNumberOfTransactionsPerBlock": "381"
    },
    {
        "month": "1",
        "day": "13",
        "year": "2014",
        "price": "807.83",
        "totalCirculation": "12258325",
        "totalTransactionFees": "12.27931661",
        "numberOfUniqueBitcoinAddressesUsed": "110334",
        "totalOutputVolumeValue": "506489.6974",
        "averageNumberOfTransactionsPerBlock": "326"
    },
    {
        "month": "1",
        "day": "14",
        "year": "2014",
        "price": "820.75",
        "totalCirculation": "12262175",
        "totalTransactionFees": "12.63627999",
        "numberOfUniqueBitcoinAddressesUsed": "133541",
        "totalOutputVolumeValue": "646592.8078",
        "averageNumberOfTransactionsPerBlock": "267"
    },
    {
        "month": "1",
        "day": "15",
        "year": "2014",
        "price": "847.7",
        "totalCirculation": "12266450",
        "totalTransactionFees": "19.48537647",
        "numberOfUniqueBitcoinAddressesUsed": "115087",
        "totalOutputVolumeValue": "717169.6476",
        "averageNumberOfTransactionsPerBlock": "321"
    },
    {
        "month": "1",
        "day": "16",
        "year": "2014",
        "price": "830.9",
        "totalCirculation": "12271450",
        "totalTransactionFees": "13.32827534",
        "numberOfUniqueBitcoinAddressesUsed": "110024",
        "totalOutputVolumeValue": "599816.1888",
        "averageNumberOfTransactionsPerBlock": "415"
    },
    {
        "month": "1",
        "day": "17",
        "year": "2014",
        "price": "793",
        "totalCirculation": "12275275",
        "totalTransactionFees": "14.93833901",
        "numberOfUniqueBitcoinAddressesUsed": "113632",
        "totalOutputVolumeValue": "464566.5207",
        "averageNumberOfTransactionsPerBlock": "349"
    },
    {
        "month": "1",
        "day": "18",
        "year": "2014",
        "price": "801.53",
        "totalCirculation": "12279350",
        "totalTransactionFees": "12.86943728",
        "numberOfUniqueBitcoinAddressesUsed": "95634",
        "totalOutputVolumeValue": "358330.7701",
        "averageNumberOfTransactionsPerBlock": "356"
    },
    {
        "month": "1",
        "day": "19",
        "year": "2014",
        "price": "833",
        "totalCirculation": "12283950",
        "totalTransactionFees": "12.06898253",
        "numberOfUniqueBitcoinAddressesUsed": "94782",
        "totalOutputVolumeValue": "509881.8718",
        "averageNumberOfTransactionsPerBlock": "346"
    },
    {
        "month": "1",
        "day": "20",
        "year": "2014",
        "price": "831.72",
        "totalCirculation": "12288525",
        "totalTransactionFees": "13.5138866",
        "numberOfUniqueBitcoinAddressesUsed": "144276",
        "totalOutputVolumeValue": "802067.7525",
        "averageNumberOfTransactionsPerBlock": "357"
    },
    {
        "month": "1",
        "day": "21",
        "year": "2014",
        "price": "822.56",
        "totalCirculation": "12292825",
        "totalTransactionFees": "16.50972485",
        "numberOfUniqueBitcoinAddressesUsed": "136930",
        "totalOutputVolumeValue": "615535.6446",
        "averageNumberOfTransactionsPerBlock": "322"
    },
    {
        "month": "1",
        "day": "22",
        "year": "2014",
        "price": "813.05",
        "totalCirculation": "12297575",
        "totalTransactionFees": "13.93433582",
        "numberOfUniqueBitcoinAddressesUsed": "131062",
        "totalOutputVolumeValue": "494014.6155",
        "averageNumberOfTransactionsPerBlock": "377"
    },
    {
        "month": "1",
        "day": "23",
        "year": "2014",
        "price": "813.02",
        "totalCirculation": "12302025",
        "totalTransactionFees": "16.03678895",
        "numberOfUniqueBitcoinAddressesUsed": "127975",
        "totalOutputVolumeValue": "550964.5397",
        "averageNumberOfTransactionsPerBlock": "395"
    },
    {
        "month": "1",
        "day": "24",
        "year": "2014",
        "price": "789.1",
        "totalCirculation": "12306925",
        "totalTransactionFees": "16.99280777",
        "numberOfUniqueBitcoinAddressesUsed": "127984",
        "totalOutputVolumeValue": "693140.3092",
        "averageNumberOfTransactionsPerBlock": "391"
    },
    {
        "month": "1",
        "day": "25",
        "year": "2014",
        "price": "806",
        "totalCirculation": "12310800",
        "totalTransactionFees": "12.38973921",
        "numberOfUniqueBitcoinAddressesUsed": "108098",
        "totalOutputVolumeValue": "534461.2894",
        "averageNumberOfTransactionsPerBlock": "380"
    },
    {
        "month": "1",
        "day": "26",
        "year": "2014",
        "price": "826.77",
        "totalCirculation": "12314800",
        "totalTransactionFees": "11.32315585",
        "numberOfUniqueBitcoinAddressesUsed": "107203",
        "totalOutputVolumeValue": "349814.5246",
        "averageNumberOfTransactionsPerBlock": "336"
    },
    {
        "month": "1",
        "day": "27",
        "year": "2014",
        "price": "777",
        "totalCirculation": "12318825",
        "totalTransactionFees": "12.91506741",
        "numberOfUniqueBitcoinAddressesUsed": "145032",
        "totalOutputVolumeValue": "789929.9136",
        "averageNumberOfTransactionsPerBlock": "288"
    },
    {
        "month": "1",
        "day": "28",
        "year": "2014",
        "price": "800.2",
        "totalCirculation": "12322975",
        "totalTransactionFees": "13.82708352",
        "numberOfUniqueBitcoinAddressesUsed": "135152",
        "totalOutputVolumeValue": "752428.6624",
        "averageNumberOfTransactionsPerBlock": "283"
    },
    {
        "month": "1",
        "day": "29",
        "year": "2014",
        "price": "803.6",
        "totalCirculation": "12326925",
        "totalTransactionFees": "13.74047422",
        "numberOfUniqueBitcoinAddressesUsed": "124466",
        "totalOutputVolumeValue": "482434.9297",
        "averageNumberOfTransactionsPerBlock": "303"
    },
    {
        "month": "1",
        "day": "30",
        "year": "2014",
        "price": "799.37",
        "totalCirculation": "12330925",
        "totalTransactionFees": "13.37773716",
        "numberOfUniqueBitcoinAddressesUsed": "129214",
        "totalOutputVolumeValue": "545337.9441",
        "averageNumberOfTransactionsPerBlock": "389"
    },
    {
        "month": "1",
        "day": "31",
        "year": "2014",
        "price": "802.5",
        "totalCirculation": "12335525",
        "totalTransactionFees": "14.04752687",
        "numberOfUniqueBitcoinAddressesUsed": "132531",
        "totalOutputVolumeValue": "455912.5665",
        "averageNumberOfTransactionsPerBlock": "397"
    },
    {
        "month": "2",
        "day": "1",
        "year": "2014",
        "price": "815.99",
        "totalCirculation": "12340450",
        "totalTransactionFees": "12.87806484",
        "numberOfUniqueBitcoinAddressesUsed": "123558",
        "totalOutputVolumeValue": "447692.9537",
        "averageNumberOfTransactionsPerBlock": "417"
    },
    {
        "month": "2",
        "day": "2",
        "year": "2014",
        "price": "819.57",
        "totalCirculation": "12344900",
        "totalTransactionFees": "9.97459141",
        "numberOfUniqueBitcoinAddressesUsed": "112877",
        "totalOutputVolumeValue": "455281.8124",
        "averageNumberOfTransactionsPerBlock": "435"
    },
    {
        "month": "2",
        "day": "3",
        "year": "2014",
        "price": "813.8",
        "totalCirculation": "12349750",
        "totalTransactionFees": "12.40954994",
        "numberOfUniqueBitcoinAddressesUsed": "152868",
        "totalOutputVolumeValue": "528609.7398",
        "averageNumberOfTransactionsPerBlock": "366"
    },
    {
        "month": "2",
        "day": "4",
        "year": "2014",
        "price": "809.05",
        "totalCirculation": "12353975",
        "totalTransactionFees": "13.62165633",
        "numberOfUniqueBitcoinAddressesUsed": "140332",
        "totalOutputVolumeValue": "678275.4604",
        "averageNumberOfTransactionsPerBlock": "392"
    },
    {
        "month": "2",
        "day": "5",
        "year": "2014",
        "price": "800",
        "totalCirculation": "12358250",
        "totalTransactionFees": "13.8823951",
        "numberOfUniqueBitcoinAddressesUsed": "139743",
        "totalOutputVolumeValue": "653404.2301",
        "averageNumberOfTransactionsPerBlock": "441"
    },
    {
        "month": "2",
        "day": "6",
        "year": "2014",
        "price": "778",
        "totalCirculation": "12362425",
        "totalTransactionFees": "14.96859202",
        "numberOfUniqueBitcoinAddressesUsed": "142991",
        "totalOutputVolumeValue": "853640.946",
        "averageNumberOfTransactionsPerBlock": "376"
    },
    {
        "month": "2",
        "day": "7",
        "year": "2014",
        "price": "742.78",
        "totalCirculation": "12366550",
        "totalTransactionFees": "15.60584661",
        "numberOfUniqueBitcoinAddressesUsed": "143818",
        "totalOutputVolumeValue": "848509.676",
        "averageNumberOfTransactionsPerBlock": "376"
    },
    {
        "month": "2",
        "day": "8",
        "year": "2014",
        "price": "707",
        "totalCirculation": "12370925",
        "totalTransactionFees": "12.34375821",
        "numberOfUniqueBitcoinAddressesUsed": "131014",
        "totalOutputVolumeValue": "602439.9845",
        "averageNumberOfTransactionsPerBlock": "371"
    },
    {
        "month": "2",
        "day": "9",
        "year": "2014",
        "price": "710",
        "totalCirculation": "12374700",
        "totalTransactionFees": "11.06004141",
        "numberOfUniqueBitcoinAddressesUsed": "112334",
        "totalOutputVolumeValue": "549603.5616",
        "averageNumberOfTransactionsPerBlock": "401"
    },
    {
        "month": "2",
        "day": "10",
        "year": "2014",
        "price": "665",
        "totalCirculation": "12378525",
        "totalTransactionFees": "13.307136",
        "numberOfUniqueBitcoinAddressesUsed": "155591",
        "totalOutputVolumeValue": "640746.2296",
        "averageNumberOfTransactionsPerBlock": "356"
    },
    {
        "month": "2",
        "day": "11",
        "year": "2014",
        "price": "670",
        "totalCirculation": "12382700",
        "totalTransactionFees": "11.97222271",
        "numberOfUniqueBitcoinAddressesUsed": "121449",
        "totalOutputVolumeValue": "760757.1299",
        "averageNumberOfTransactionsPerBlock": "294"
    },
    {
        "month": "2",
        "day": "12",
        "year": "2014",
        "price": "667.01",
        "totalCirculation": "12386875",
        "totalTransactionFees": "15.9470347",
        "numberOfUniqueBitcoinAddressesUsed": "121999",
        "totalOutputVolumeValue": "655177.7497",
        "averageNumberOfTransactionsPerBlock": "344"
    },
    {
        "month": "2",
        "day": "13",
        "year": "2014",
        "price": "633.99",
        "totalCirculation": "12391375",
        "totalTransactionFees": "14.00026739",
        "numberOfUniqueBitcoinAddressesUsed": "130490",
        "totalOutputVolumeValue": "601867.4333",
        "averageNumberOfTransactionsPerBlock": "409"
    },
    {
        "month": "2",
        "day": "14",
        "year": "2014",
        "price": "672.1",
        "totalCirculation": "12396150",
        "totalTransactionFees": "17.1625273",
        "numberOfUniqueBitcoinAddressesUsed": "148377",
        "totalOutputVolumeValue": "788230.0691",
        "averageNumberOfTransactionsPerBlock": "347"
    },
    {
        "month": "2",
        "day": "15",
        "year": "2014",
        "price": "651.42",
        "totalCirculation": "12400650",
        "totalTransactionFees": "13.74692375",
        "numberOfUniqueBitcoinAddressesUsed": "127810",
        "totalOutputVolumeValue": "963549.3909",
        "averageNumberOfTransactionsPerBlock": "419"
    },
    {
        "month": "2",
        "day": "16",
        "year": "2014",
        "price": "623.5",
        "totalCirculation": "12405475",
        "totalTransactionFees": "11.12655289",
        "numberOfUniqueBitcoinAddressesUsed": "110198",
        "totalOutputVolumeValue": "535099.1189",
        "averageNumberOfTransactionsPerBlock": "437"
    },
    {
        "month": "2",
        "day": "17",
        "year": "2014",
        "price": "642",
        "totalCirculation": "12409625",
        "totalTransactionFees": "12.38282042",
        "numberOfUniqueBitcoinAddressesUsed": "114626",
        "totalOutputVolumeValue": "646105.5141",
        "averageNumberOfTransactionsPerBlock": "363"
    },
    {
        "month": "2",
        "day": "18",
        "year": "2014",
        "price": "626.77",
        "totalCirculation": "12413800",
        "totalTransactionFees": "24.33053354",
        "numberOfUniqueBitcoinAddressesUsed": "163002",
        "totalOutputVolumeValue": "505763.6542",
        "averageNumberOfTransactionsPerBlock": "322"
    },
    {
        "month": "2",
        "day": "19",
        "year": "2014",
        "price": "623.93",
        "totalCirculation": "12418575",
        "totalTransactionFees": "13.63818549",
        "numberOfUniqueBitcoinAddressesUsed": "142987",
        "totalOutputVolumeValue": "457454.0409",
        "averageNumberOfTransactionsPerBlock": "376"
    },
    {
        "month": "2",
        "day": "20",
        "year": "2014",
        "price": "582.7",
        "totalCirculation": "12422850",
        "totalTransactionFees": "14.92340459",
        "numberOfUniqueBitcoinAddressesUsed": "159962",
        "totalOutputVolumeValue": "494954.9415",
        "averageNumberOfTransactionsPerBlock": "494"
    },
    {
        "month": "2",
        "day": "21",
        "year": "2014",
        "price": "566.16",
        "totalCirculation": "12427050",
        "totalTransactionFees": "14.69796906",
        "numberOfUniqueBitcoinAddressesUsed": "165370",
        "totalOutputVolumeValue": "614005.6789",
        "averageNumberOfTransactionsPerBlock": "395"
    },
    {
        "month": "2",
        "day": "22",
        "year": "2014",
        "price": "603.98",
        "totalCirculation": "12431150",
        "totalTransactionFees": "12.56877924",
        "numberOfUniqueBitcoinAddressesUsed": "132542",
        "totalOutputVolumeValue": "376956.4448",
        "averageNumberOfTransactionsPerBlock": "392"
    },
    {
        "month": "2",
        "day": "23",
        "year": "2014",
        "price": "626.77",
        "totalCirculation": "12435700",
        "totalTransactionFees": "11.78154841",
        "numberOfUniqueBitcoinAddressesUsed": "142019",
        "totalOutputVolumeValue": "403304.4548",
        "averageNumberOfTransactionsPerBlock": "381"
    },
    {
        "month": "2",
        "day": "24",
        "year": "2014",
        "price": "545",
        "totalCirculation": "12440250",
        "totalTransactionFees": "13.98013914",
        "numberOfUniqueBitcoinAddressesUsed": "167219",
        "totalOutputVolumeValue": "753715.2434",
        "averageNumberOfTransactionsPerBlock": "428"
    },
    {
        "month": "2",
        "day": "25",
        "year": "2014",
        "price": "528",
        "totalCirculation": "12444500",
        "totalTransactionFees": "18.46032012",
        "numberOfUniqueBitcoinAddressesUsed": "208180",
        "totalOutputVolumeValue": "1064788.543",
        "averageNumberOfTransactionsPerBlock": "396"
    },
    {
        "month": "2",
        "day": "26",
        "year": "2014",
        "price": "585.38",
        "totalCirculation": "12449025",
        "totalTransactionFees": "14.8421543",
        "numberOfUniqueBitcoinAddressesUsed": "166920",
        "totalOutputVolumeValue": "686983.7246",
        "averageNumberOfTransactionsPerBlock": "511"
    },
    {
        "month": "2",
        "day": "27",
        "year": "2014",
        "price": "585.17",
        "totalCirculation": "12453575",
        "totalTransactionFees": "13.92144316",
        "numberOfUniqueBitcoinAddressesUsed": "164199",
        "totalOutputVolumeValue": "621739.9374",
        "averageNumberOfTransactionsPerBlock": "618"
    },
    {
        "month": "2",
        "day": "28",
        "year": "2014",
        "price": "577.97",
        "totalCirculation": "12458275",
        "totalTransactionFees": "15.28626504",
        "numberOfUniqueBitcoinAddressesUsed": "145830",
        "totalOutputVolumeValue": "601985.1191",
        "averageNumberOfTransactionsPerBlock": "460"
    },
    {
        "month": "3",
        "day": "1",
        "year": "2014",
        "price": "571.5",
        "totalCirculation": "12461975",
        "totalTransactionFees": "14.89760883",
        "numberOfUniqueBitcoinAddressesUsed": "151446",
        "totalOutputVolumeValue": "782306.5754",
        "averageNumberOfTransactionsPerBlock": "442"
    },
    {
        "month": "3",
        "day": "2",
        "year": "2014",
        "price": "559.88",
        "totalCirculation": "12465700",
        "totalTransactionFees": "11.10023303",
        "numberOfUniqueBitcoinAddressesUsed": "139563",
        "totalOutputVolumeValue": "539949.015",
        "averageNumberOfTransactionsPerBlock": "416"
    },
    {
        "month": "3",
        "day": "3",
        "year": "2014",
        "price": "666.5",
        "totalCirculation": "12469250",
        "totalTransactionFees": "14.75881128",
        "numberOfUniqueBitcoinAddressesUsed": "187106",
        "totalOutputVolumeValue": "972398.6137",
        "averageNumberOfTransactionsPerBlock": "405"
    },
    {
        "month": "3",
        "day": "4",
        "year": "2014",
        "price": "677.61",
        "totalCirculation": "12472725",
        "totalTransactionFees": "18.22862564",
        "numberOfUniqueBitcoinAddressesUsed": "201394",
        "totalOutputVolumeValue": "1100369.102",
        "averageNumberOfTransactionsPerBlock": "373"
    },
    {
        "month": "3",
        "day": "5",
        "year": "2014",
        "price": "664.85",
        "totalCirculation": "12476750",
        "totalTransactionFees": "14.70329167",
        "numberOfUniqueBitcoinAddressesUsed": "180104",
        "totalOutputVolumeValue": "695394.8994",
        "averageNumberOfTransactionsPerBlock": "404"
    },
    {
        "month": "3",
        "day": "6",
        "year": "2014",
        "price": "657.02",
        "totalCirculation": "12480800",
        "totalTransactionFees": "14.8778672",
        "numberOfUniqueBitcoinAddressesUsed": "171560",
        "totalOutputVolumeValue": "672160.8058",
        "averageNumberOfTransactionsPerBlock": "452"
    },
    {
        "month": "3",
        "day": "7",
        "year": "2014",
        "price": "621.3",
        "totalCirculation": "12484975",
        "totalTransactionFees": "13.19699401",
        "numberOfUniqueBitcoinAddressesUsed": "154757",
        "totalOutputVolumeValue": "2335941.884",
        "averageNumberOfTransactionsPerBlock": "452"
    },
    {
        "month": "3",
        "day": "8",
        "year": "2014",
        "price": "609",
        "totalCirculation": "12489350",
        "totalTransactionFees": "12.98291657",
        "numberOfUniqueBitcoinAddressesUsed": "154394",
        "totalOutputVolumeValue": "1754719.956",
        "averageNumberOfTransactionsPerBlock": "445"
    },
    {
        "month": "3",
        "day": "9",
        "year": "2014",
        "price": "637.99",
        "totalCirculation": "12493450",
        "totalTransactionFees": "12.0606882",
        "numberOfUniqueBitcoinAddressesUsed": "155361",
        "totalOutputVolumeValue": "626975.0602",
        "averageNumberOfTransactionsPerBlock": "494"
    },
    {
        "month": "3",
        "day": "10",
        "year": "2014",
        "price": "621.99",
        "totalCirculation": "12497575",
        "totalTransactionFees": "14.43470377",
        "numberOfUniqueBitcoinAddressesUsed": "164890",
        "totalOutputVolumeValue": "1634554.232",
        "averageNumberOfTransactionsPerBlock": "376"
    },
    {
        "month": "3",
        "day": "11",
        "year": "2014",
        "price": "622.9",
        "totalCirculation": "12501775",
        "totalTransactionFees": "15.4523833",
        "numberOfUniqueBitcoinAddressesUsed": "152037",
        "totalOutputVolumeValue": "1148465.115",
        "averageNumberOfTransactionsPerBlock": "371"
    },
    {
        "month": "3",
        "day": "12",
        "year": "2014",
        "price": "642.1",
        "totalCirculation": "12505975",
        "totalTransactionFees": "17.27911595",
        "numberOfUniqueBitcoinAddressesUsed": "165460",
        "totalOutputVolumeValue": "1002730.268",
        "averageNumberOfTransactionsPerBlock": "364"
    },
    {
        "month": "3",
        "day": "13",
        "year": "2014",
        "price": "642.61",
        "totalCirculation": "12510200",
        "totalTransactionFees": "14.85979519",
        "numberOfUniqueBitcoinAddressesUsed": "165883",
        "totalOutputVolumeValue": "814550.5878",
        "averageNumberOfTransactionsPerBlock": "399"
    },
    {
        "month": "3",
        "day": "14",
        "year": "2014",
        "price": "636.47",
        "totalCirculation": "12513675",
        "totalTransactionFees": "14.00794115",
        "numberOfUniqueBitcoinAddressesUsed": "139218",
        "totalOutputVolumeValue": "689820.9571",
        "averageNumberOfTransactionsPerBlock": "434"
    },
    {
        "month": "3",
        "day": "15",
        "year": "2014",
        "price": "636.29",
        "totalCirculation": "12518050",
        "totalTransactionFees": "11.78133769",
        "numberOfUniqueBitcoinAddressesUsed": "128219",
        "totalOutputVolumeValue": "506583.7197",
        "averageNumberOfTransactionsPerBlock": "431"
    },
    {
        "month": "3",
        "day": "16",
        "year": "2014",
        "price": "634.94",
        "totalCirculation": "12522000",
        "totalTransactionFees": "10.38601922",
        "numberOfUniqueBitcoinAddressesUsed": "121995",
        "totalOutputVolumeValue": "462623.861",
        "averageNumberOfTransactionsPerBlock": "408"
    },
    {
        "month": "3",
        "day": "17",
        "year": "2014",
        "price": "624.7",
        "totalCirculation": "12526450",
        "totalTransactionFees": "14.51477994",
        "numberOfUniqueBitcoinAddressesUsed": "140722",
        "totalOutputVolumeValue": "517959.6362",
        "averageNumberOfTransactionsPerBlock": "392"
    },
    {
        "month": "3",
        "day": "18",
        "year": "2014",
        "price": "627",
        "totalCirculation": "12530075",
        "totalTransactionFees": "10.60617286",
        "numberOfUniqueBitcoinAddressesUsed": "140518",
        "totalOutputVolumeValue": "2075230.608",
        "averageNumberOfTransactionsPerBlock": "277"
    },
    {
        "month": "3",
        "day": "19",
        "year": "2014",
        "price": "608.41",
        "totalCirculation": "12533950",
        "totalTransactionFees": "12.4119528",
        "numberOfUniqueBitcoinAddressesUsed": "130586",
        "totalOutputVolumeValue": "1602006.393",
        "averageNumberOfTransactionsPerBlock": "338"
    },
    {
        "month": "3",
        "day": "20",
        "year": "2014",
        "price": "590",
        "totalCirculation": "12538125",
        "totalTransactionFees": "13.68047528",
        "numberOfUniqueBitcoinAddressesUsed": "141026",
        "totalOutputVolumeValue": "775632.1723",
        "averageNumberOfTransactionsPerBlock": "480"
    },
    {
        "month": "3",
        "day": "21",
        "year": "2014",
        "price": "579.99",
        "totalCirculation": "12542650",
        "totalTransactionFees": "15.05458024",
        "numberOfUniqueBitcoinAddressesUsed": "155285",
        "totalOutputVolumeValue": "619998.7982",
        "averageNumberOfTransactionsPerBlock": "442"
    },
    {
        "month": "3",
        "day": "22",
        "year": "2014",
        "price": "557",
        "totalCirculation": "12547050",
        "totalTransactionFees": "14.60447433",
        "numberOfUniqueBitcoinAddressesUsed": "137388",
        "totalOutputVolumeValue": "458635.5372",
        "averageNumberOfTransactionsPerBlock": "424"
    },
    {
        "month": "3",
        "day": "23",
        "year": "2014",
        "price": "567.13",
        "totalCirculation": "12552175",
        "totalTransactionFees": "14.39001698",
        "numberOfUniqueBitcoinAddressesUsed": "131768",
        "totalOutputVolumeValue": "313956.4034",
        "averageNumberOfTransactionsPerBlock": "377"
    },
    {
        "month": "3",
        "day": "24",
        "year": "2014",
        "price": "572",
        "totalCirculation": "12557150",
        "totalTransactionFees": "12.36959646",
        "numberOfUniqueBitcoinAddressesUsed": "155589",
        "totalOutputVolumeValue": "638123.3755",
        "averageNumberOfTransactionsPerBlock": "321"
    },
    {
        "month": "3",
        "day": "25",
        "year": "2014",
        "price": "580.02",
        "totalCirculation": "12560925",
        "totalTransactionFees": "14.41318613",
        "numberOfUniqueBitcoinAddressesUsed": "145432",
        "totalOutputVolumeValue": "585139.6922",
        "averageNumberOfTransactionsPerBlock": "371"
    },
    {
        "month": "3",
        "day": "26",
        "year": "2014",
        "price": "585.7",
        "totalCirculation": "12564875",
        "totalTransactionFees": "15.58162914",
        "numberOfUniqueBitcoinAddressesUsed": "146464",
        "totalOutputVolumeValue": "501214.9332",
        "averageNumberOfTransactionsPerBlock": "375"
    },
    {
        "month": "3",
        "day": "27",
        "year": "2014",
        "price": "520.2",
        "totalCirculation": "12569050",
        "totalTransactionFees": "13.74833968",
        "numberOfUniqueBitcoinAddressesUsed": "158999",
        "totalOutputVolumeValue": "756564.7961",
        "averageNumberOfTransactionsPerBlock": "361"
    },
    {
        "month": "3",
        "day": "28",
        "year": "2014",
        "price": "503",
        "totalCirculation": "12573625",
        "totalTransactionFees": "12.76760033",
        "numberOfUniqueBitcoinAddressesUsed": "163425",
        "totalOutputVolumeValue": "806230.2488",
        "averageNumberOfTransactionsPerBlock": "360"
    },
    {
        "month": "3",
        "day": "29",
        "year": "2014",
        "price": "499.94",
        "totalCirculation": "12577900",
        "totalTransactionFees": "9.91116708",
        "numberOfUniqueBitcoinAddressesUsed": "126941",
        "totalOutputVolumeValue": "509121.7399",
        "averageNumberOfTransactionsPerBlock": "323"
    },
    {
        "month": "3",
        "day": "30",
        "year": "2014",
        "price": "449.02",
        "totalCirculation": "12581625",
        "totalTransactionFees": "10.75046791",
        "numberOfUniqueBitcoinAddressesUsed": "150155",
        "totalOutputVolumeValue": "551880.315",
        "averageNumberOfTransactionsPerBlock": "326"
    },
    {
        "month": "3",
        "day": "31",
        "year": "2014",
        "price": "457",
        "totalCirculation": "12585825",
        "totalTransactionFees": "11.95022358",
        "numberOfUniqueBitcoinAddressesUsed": "137342",
        "totalOutputVolumeValue": "729762.0537",
        "averageNumberOfTransactionsPerBlock": "333"
    },
    {
        "month": "4",
        "day": "1",
        "year": "2014",
        "price": "479.51",
        "totalCirculation": "12590300",
        "totalTransactionFees": "12.54864889",
        "numberOfUniqueBitcoinAddressesUsed": "157020",
        "totalOutputVolumeValue": "703152.6027",
        "averageNumberOfTransactionsPerBlock": "334"
    },
    {
        "month": "4",
        "day": "2",
        "year": "2014",
        "price": "445",
        "totalCirculation": "12594925",
        "totalTransactionFees": "13.09056906",
        "numberOfUniqueBitcoinAddressesUsed": "152718",
        "totalOutputVolumeValue": "712975.9813",
        "averageNumberOfTransactionsPerBlock": "426"
    },
    {
        "month": "4",
        "day": "3",
        "year": "2014",
        "price": "446.31",
        "totalCirculation": "12600125",
        "totalTransactionFees": "13.42152449",
        "numberOfUniqueBitcoinAddressesUsed": "137224",
        "totalOutputVolumeValue": "842061.8031",
        "averageNumberOfTransactionsPerBlock": "449"
    },
    {
        "month": "4",
        "day": "4",
        "year": "2014",
        "price": "446.01",
        "totalCirculation": "12605150",
        "totalTransactionFees": "13.60614942",
        "numberOfUniqueBitcoinAddressesUsed": "144468",
        "totalOutputVolumeValue": "663996.4141",
        "averageNumberOfTransactionsPerBlock": "443"
    },
    {
        "month": "4",
        "day": "5",
        "year": "2014",
        "price": "451.84",
        "totalCirculation": "12609625",
        "totalTransactionFees": "12.15739669",
        "numberOfUniqueBitcoinAddressesUsed": "135497",
        "totalOutputVolumeValue": "753433.7343",
        "averageNumberOfTransactionsPerBlock": "394"
    },
    {
        "month": "4",
        "day": "6",
        "year": "2014",
        "price": "459.67",
        "totalCirculation": "12613175",
        "totalTransactionFees": "9.16831339",
        "numberOfUniqueBitcoinAddressesUsed": "163904",
        "totalOutputVolumeValue": "450531.7286",
        "averageNumberOfTransactionsPerBlock": "448"
    },
    {
        "month": "4",
        "day": "7",
        "year": "2014",
        "price": "447.74",
        "totalCirculation": "12616825",
        "totalTransactionFees": "13.90620728",
        "numberOfUniqueBitcoinAddressesUsed": "134360",
        "totalOutputVolumeValue": "445138.8488",
        "averageNumberOfTransactionsPerBlock": "324"
    },
    {
        "month": "4",
        "day": "8",
        "year": "2014",
        "price": "454.07",
        "totalCirculation": "12620725",
        "totalTransactionFees": "15.09697226",
        "numberOfUniqueBitcoinAddressesUsed": "148772",
        "totalOutputVolumeValue": "511123.3156",
        "averageNumberOfTransactionsPerBlock": "248"
    },
    {
        "month": "4",
        "day": "9",
        "year": "2014",
        "price": "443.1",
        "totalCirculation": "12624350",
        "totalTransactionFees": "13.2776719",
        "numberOfUniqueBitcoinAddressesUsed": "144875",
        "totalOutputVolumeValue": "485103.8781",
        "averageNumberOfTransactionsPerBlock": "353"
    },
    {
        "month": "4",
        "day": "10",
        "year": "2014",
        "price": "401",
        "totalCirculation": "12628725",
        "totalTransactionFees": "21.30299867",
        "numberOfUniqueBitcoinAddressesUsed": "165795",
        "totalOutputVolumeValue": "851803.1051",
        "averageNumberOfTransactionsPerBlock": "384"
    },
    {
        "month": "4",
        "day": "11",
        "year": "2014",
        "price": "427.99",
        "totalCirculation": "12632450",
        "totalTransactionFees": "14.57004853",
        "numberOfUniqueBitcoinAddressesUsed": "146801",
        "totalOutputVolumeValue": "827736.8152",
        "averageNumberOfTransactionsPerBlock": "459"
    },
    {
        "month": "4",
        "day": "12",
        "year": "2014",
        "price": "424.98",
        "totalCirculation": "12636450",
        "totalTransactionFees": "9.91757697",
        "numberOfUniqueBitcoinAddressesUsed": "124543",
        "totalOutputVolumeValue": "455422.9105",
        "averageNumberOfTransactionsPerBlock": "386"
    },
    {
        "month": "4",
        "day": "13",
        "year": "2014",
        "price": "405",
        "totalCirculation": "12641425",
        "totalTransactionFees": "9.30580111",
        "numberOfUniqueBitcoinAddressesUsed": "150009",
        "totalOutputVolumeValue": "377624.9683",
        "averageNumberOfTransactionsPerBlock": "362"
    },
    {
        "month": "4",
        "day": "14",
        "year": "2014",
        "price": "453.14",
        "totalCirculation": "12645975",
        "totalTransactionFees": "14.39419263",
        "numberOfUniqueBitcoinAddressesUsed": "146634",
        "totalOutputVolumeValue": "576197.2436",
        "averageNumberOfTransactionsPerBlock": "347"
    },
    {
        "month": "4",
        "day": "15",
        "year": "2014",
        "price": "489.91",
        "totalCirculation": "12650850",
        "totalTransactionFees": "16.40310745",
        "numberOfUniqueBitcoinAddressesUsed": "166401",
        "totalOutputVolumeValue": "680667.7526",
        "averageNumberOfTransactionsPerBlock": "290"
    },
    {
        "month": "4",
        "day": "16",
        "year": "2014",
        "price": "511.5",
        "totalCirculation": "12654575",
        "totalTransactionFees": "15.0145845",
        "numberOfUniqueBitcoinAddressesUsed": "142870",
        "totalOutputVolumeValue": "828585.8636",
        "averageNumberOfTransactionsPerBlock": "327"
    },
    {
        "month": "4",
        "day": "17",
        "year": "2014",
        "price": "495",
        "totalCirculation": "12658925",
        "totalTransactionFees": "15.27722248",
        "numberOfUniqueBitcoinAddressesUsed": "141012",
        "totalOutputVolumeValue": "815861.1786",
        "averageNumberOfTransactionsPerBlock": "475"
    },
    {
        "month": "4",
        "day": "18",
        "year": "2014",
        "price": "479.98",
        "totalCirculation": "12662825",
        "totalTransactionFees": "12.11666488",
        "numberOfUniqueBitcoinAddressesUsed": "123771",
        "totalOutputVolumeValue": "671188.4361",
        "averageNumberOfTransactionsPerBlock": "412"
    },
    {
        "month": "4",
        "day": "19",
        "year": "2014",
        "price": "499.9",
        "totalCirculation": "12666900",
        "totalTransactionFees": "13.3065243",
        "numberOfUniqueBitcoinAddressesUsed": "127435",
        "totalOutputVolumeValue": "581524.682",
        "averageNumberOfTransactionsPerBlock": "460"
    },
    {
        "month": "4",
        "day": "20",
        "year": "2014",
        "price": "500.19",
        "totalCirculation": "12671150",
        "totalTransactionFees": "10.78653306",
        "numberOfUniqueBitcoinAddressesUsed": "149260",
        "totalOutputVolumeValue": "404073.9622",
        "averageNumberOfTransactionsPerBlock": "475"
    },
    {
        "month": "4",
        "day": "21",
        "year": "2014",
        "price": "496.5",
        "totalCirculation": "12675575",
        "totalTransactionFees": "11.60986595",
        "numberOfUniqueBitcoinAddressesUsed": "124225",
        "totalOutputVolumeValue": "704751.1742",
        "averageNumberOfTransactionsPerBlock": "328"
    },
    {
        "month": "4",
        "day": "22",
        "year": "2014",
        "price": "493.33",
        "totalCirculation": "12679425",
        "totalTransactionFees": "15.41285036",
        "numberOfUniqueBitcoinAddressesUsed": "150856",
        "totalOutputVolumeValue": "767457.1526",
        "averageNumberOfTransactionsPerBlock": "301"
    },
    {
        "month": "4",
        "day": "23",
        "year": "2014",
        "price": "487.3",
        "totalCirculation": "12683800",
        "totalTransactionFees": "14.28109385",
        "numberOfUniqueBitcoinAddressesUsed": "134126",
        "totalOutputVolumeValue": "722510.506",
        "averageNumberOfTransactionsPerBlock": "378"
    },
    {
        "month": "4",
        "day": "24",
        "year": "2014",
        "price": "491.6",
        "totalCirculation": "12687475",
        "totalTransactionFees": "14.18530262",
        "numberOfUniqueBitcoinAddressesUsed": "129810",
        "totalOutputVolumeValue": "559681.808",
        "averageNumberOfTransactionsPerBlock": "406"
    },
    {
        "month": "4",
        "day": "25",
        "year": "2014",
        "price": "459.15",
        "totalCirculation": "12691575",
        "totalTransactionFees": "14.40370555",
        "numberOfUniqueBitcoinAddressesUsed": "157853",
        "totalOutputVolumeValue": "550861.7291",
        "averageNumberOfTransactionsPerBlock": "437"
    },
    {
        "month": "4",
        "day": "26",
        "year": "2014",
        "price": "463.88",
        "totalCirculation": "12696025",
        "totalTransactionFees": "10.52495082",
        "numberOfUniqueBitcoinAddressesUsed": "131955",
        "totalOutputVolumeValue": "407118.2973",
        "averageNumberOfTransactionsPerBlock": "362"
    },
    {
        "month": "4",
        "day": "27",
        "year": "2014",
        "price": "440.1",
        "totalCirculation": "12700200",
        "totalTransactionFees": "11.27509025",
        "numberOfUniqueBitcoinAddressesUsed": "147987",
        "totalOutputVolumeValue": "278902.3664",
        "averageNumberOfTransactionsPerBlock": "355"
    },
    {
        "month": "4",
        "day": "28",
        "year": "2014",
        "price": "447",
        "totalCirculation": "12704350",
        "totalTransactionFees": "12.34031962",
        "numberOfUniqueBitcoinAddressesUsed": "133142",
        "totalOutputVolumeValue": "482175.4106",
        "averageNumberOfTransactionsPerBlock": "389"
    },
    {
        "month": "4",
        "day": "29",
        "year": "2014",
        "price": "447.7",
        "totalCirculation": "12708300",
        "totalTransactionFees": "12.17060621",
        "numberOfUniqueBitcoinAddressesUsed": "145888",
        "totalOutputVolumeValue": "566494.9218",
        "averageNumberOfTransactionsPerBlock": "337"
    },
    {
        "month": "4",
        "day": "30",
        "year": "2014",
        "price": "449",
        "totalCirculation": "12711950",
        "totalTransactionFees": "12.53470401",
        "numberOfUniqueBitcoinAddressesUsed": "137816",
        "totalOutputVolumeValue": "548190.8376",
        "averageNumberOfTransactionsPerBlock": "507"
    },
    {
        "month": "5",
        "day": "1",
        "year": "2014",
        "price": "460.01",
        "totalCirculation": "12716150",
        "totalTransactionFees": "12.01720682",
        "numberOfUniqueBitcoinAddressesUsed": "134499",
        "totalOutputVolumeValue": "471807.9025",
        "averageNumberOfTransactionsPerBlock": "412"
    },
    {
        "month": "5",
        "day": "2",
        "year": "2014",
        "price": "447.51",
        "totalCirculation": "12720400",
        "totalTransactionFees": "11.50948836",
        "numberOfUniqueBitcoinAddressesUsed": "128157",
        "totalOutputVolumeValue": "498876.5566",
        "averageNumberOfTransactionsPerBlock": "432"
    },
    {
        "month": "5",
        "day": "3",
        "year": "2014",
        "price": "434.5",
        "totalCirculation": "12724000",
        "totalTransactionFees": "11.0080935",
        "numberOfUniqueBitcoinAddressesUsed": "103028",
        "totalOutputVolumeValue": "658967.9921",
        "averageNumberOfTransactionsPerBlock": "438"
    },
    {
        "month": "5",
        "day": "4",
        "year": "2014",
        "price": "436.21",
        "totalCirculation": "12727800",
        "totalTransactionFees": "9.99820449",
        "numberOfUniqueBitcoinAddressesUsed": "138218",
        "totalOutputVolumeValue": "454251.7265",
        "averageNumberOfTransactionsPerBlock": "407"
    },
    {
        "month": "5",
        "day": "5",
        "year": "2014",
        "price": "427.83",
        "totalCirculation": "12730925",
        "totalTransactionFees": "12.36926791",
        "numberOfUniqueBitcoinAddressesUsed": "113712",
        "totalOutputVolumeValue": "575576.6431",
        "averageNumberOfTransactionsPerBlock": "337"
    },
    {
        "month": "5",
        "day": "6",
        "year": "2014",
        "price": "430.33",
        "totalCirculation": "12735575",
        "totalTransactionFees": "15.21115475",
        "numberOfUniqueBitcoinAddressesUsed": "144937",
        "totalOutputVolumeValue": "661019.7968",
        "averageNumberOfTransactionsPerBlock": "311"
    },
    {
        "month": "5",
        "day": "7",
        "year": "2014",
        "price": "446.65",
        "totalCirculation": "12739650",
        "totalTransactionFees": "13.38035393",
        "numberOfUniqueBitcoinAddressesUsed": "137586",
        "totalOutputVolumeValue": "799617.0928",
        "averageNumberOfTransactionsPerBlock": "446"
    },
    {
        "month": "5",
        "day": "8",
        "year": "2014",
        "price": "441.5",
        "totalCirculation": "12743550",
        "totalTransactionFees": "13.58134445",
        "numberOfUniqueBitcoinAddressesUsed": "140822",
        "totalOutputVolumeValue": "1310228.932",
        "averageNumberOfTransactionsPerBlock": "415"
    },
    {
        "month": "5",
        "day": "9",
        "year": "2014",
        "price": "452.02",
        "totalCirculation": "12747700",
        "totalTransactionFees": "15.8661507",
        "numberOfUniqueBitcoinAddressesUsed": "140925",
        "totalOutputVolumeValue": "1352519.578",
        "averageNumberOfTransactionsPerBlock": "466"
    },
    {
        "month": "5",
        "day": "10",
        "year": "2014",
        "price": "452.42",
        "totalCirculation": "12752125",
        "totalTransactionFees": "10.8683326",
        "numberOfUniqueBitcoinAddressesUsed": "119139",
        "totalOutputVolumeValue": "730814.5403",
        "averageNumberOfTransactionsPerBlock": "438"
    },
    {
        "month": "5",
        "day": "11",
        "year": "2014",
        "price": "435",
        "totalCirculation": "12756275",
        "totalTransactionFees": "9.32474235",
        "numberOfUniqueBitcoinAddressesUsed": "143525",
        "totalOutputVolumeValue": "481606.5205",
        "averageNumberOfTransactionsPerBlock": "378"
    },
    {
        "month": "5",
        "day": "12",
        "year": "2014",
        "price": "441.5",
        "totalCirculation": "12760200",
        "totalTransactionFees": "12.74240695",
        "numberOfUniqueBitcoinAddressesUsed": "130988",
        "totalOutputVolumeValue": "535630.4842",
        "averageNumberOfTransactionsPerBlock": "303"
    },
    {
        "month": "5",
        "day": "13",
        "year": "2014",
        "price": "438.95",
        "totalCirculation": "12764450",
        "totalTransactionFees": "13.05030601",
        "numberOfUniqueBitcoinAddressesUsed": "125036",
        "totalOutputVolumeValue": "708545.9958",
        "averageNumberOfTransactionsPerBlock": "328"
    },
    {
        "month": "5",
        "day": "14",
        "year": "2014",
        "price": "447.49",
        "totalCirculation": "12768200",
        "totalTransactionFees": "12.04391208",
        "numberOfUniqueBitcoinAddressesUsed": "131116",
        "totalOutputVolumeValue": "634329.0259",
        "averageNumberOfTransactionsPerBlock": "341"
    },
    {
        "month": "5",
        "day": "15",
        "year": "2014",
        "price": "448.99",
        "totalCirculation": "12772350",
        "totalTransactionFees": "12.75536468",
        "numberOfUniqueBitcoinAddressesUsed": "151809",
        "totalOutputVolumeValue": "790157.0932",
        "averageNumberOfTransactionsPerBlock": "388"
    },
    {
        "month": "5",
        "day": "16",
        "year": "2014",
        "price": "449.51",
        "totalCirculation": "12776900",
        "totalTransactionFees": "12.02164864",
        "numberOfUniqueBitcoinAddressesUsed": "127748",
        "totalOutputVolumeValue": "767480.9286",
        "averageNumberOfTransactionsPerBlock": "399"
    },
    {
        "month": "5",
        "day": "17",
        "year": "2014",
        "price": "449.08",
        "totalCirculation": "12781475",
        "totalTransactionFees": "9.7917159",
        "numberOfUniqueBitcoinAddressesUsed": "115383",
        "totalOutputVolumeValue": "484797.3732",
        "averageNumberOfTransactionsPerBlock": "425"
    },
    {
        "month": "5",
        "day": "18",
        "year": "2014",
        "price": "447.14",
        "totalCirculation": "12785325",
        "totalTransactionFees": "8.92569908",
        "numberOfUniqueBitcoinAddressesUsed": "151855",
        "totalOutputVolumeValue": "324600.8274",
        "averageNumberOfTransactionsPerBlock": "472"
    },
    {
        "month": "5",
        "day": "19",
        "year": "2014",
        "price": "446.42",
        "totalCirculation": "12789750",
        "totalTransactionFees": "10.7224626",
        "numberOfUniqueBitcoinAddressesUsed": "127935",
        "totalOutputVolumeValue": "478218.7215",
        "averageNumberOfTransactionsPerBlock": "346"
    },
    {
        "month": "5",
        "day": "20",
        "year": "2014",
        "price": "485.01",
        "totalCirculation": "12794225",
        "totalTransactionFees": "12.69875738",
        "numberOfUniqueBitcoinAddressesUsed": "153007",
        "totalOutputVolumeValue": "1283778.261",
        "averageNumberOfTransactionsPerBlock": "357"
    },
    {
        "month": "5",
        "day": "21",
        "year": "2014",
        "price": "494.87",
        "totalCirculation": "12798675",
        "totalTransactionFees": "13.27575617",
        "numberOfUniqueBitcoinAddressesUsed": "145579",
        "totalOutputVolumeValue": "880729.1098",
        "averageNumberOfTransactionsPerBlock": "389"
    },
    {
        "month": "5",
        "day": "22",
        "year": "2014",
        "price": "523.84",
        "totalCirculation": "12802850",
        "totalTransactionFees": "12.71659841",
        "numberOfUniqueBitcoinAddressesUsed": "129318",
        "totalOutputVolumeValue": "802081.5796",
        "averageNumberOfTransactionsPerBlock": "519"
    },
    {
        "month": "5",
        "day": "23",
        "year": "2014",
        "price": "527.47",
        "totalCirculation": "12806800",
        "totalTransactionFees": "12.99220611",
        "numberOfUniqueBitcoinAddressesUsed": "155129",
        "totalOutputVolumeValue": "1246459.492",
        "averageNumberOfTransactionsPerBlock": "408"
    },
    {
        "month": "5",
        "day": "24",
        "year": "2014",
        "price": "521.52",
        "totalCirculation": "12811000",
        "totalTransactionFees": "12.10475911",
        "numberOfUniqueBitcoinAddressesUsed": "113362",
        "totalOutputVolumeValue": "973175.1467",
        "averageNumberOfTransactionsPerBlock": "503"
    },
    {
        "month": "5",
        "day": "25",
        "year": "2014",
        "price": "575",
        "totalCirculation": "12814775",
        "totalTransactionFees": "9.57210433",
        "numberOfUniqueBitcoinAddressesUsed": "159903",
        "totalOutputVolumeValue": "808996.9656",
        "averageNumberOfTransactionsPerBlock": "410"
    },
    {
        "month": "5",
        "day": "26",
        "year": "2014",
        "price": "584",
        "totalCirculation": "12819000",
        "totalTransactionFees": "11.91589205",
        "numberOfUniqueBitcoinAddressesUsed": "136252",
        "totalOutputVolumeValue": "716702.7946",
        "averageNumberOfTransactionsPerBlock": "362"
    },
    {
        "month": "5",
        "day": "27",
        "year": "2014",
        "price": "581.87",
        "totalCirculation": "12822225",
        "totalTransactionFees": "12.33282353",
        "numberOfUniqueBitcoinAddressesUsed": "145771",
        "totalOutputVolumeValue": "889789.7097",
        "averageNumberOfTransactionsPerBlock": "295"
    },
    {
        "month": "5",
        "day": "28",
        "year": "2014",
        "price": "574.33",
        "totalCirculation": "12826650",
        "totalTransactionFees": "13.24677566",
        "numberOfUniqueBitcoinAddressesUsed": "161438",
        "totalOutputVolumeValue": "932703.7505",
        "averageNumberOfTransactionsPerBlock": "341"
    },
    {
        "month": "5",
        "day": "29",
        "year": "2014",
        "price": "568",
        "totalCirculation": "12829925",
        "totalTransactionFees": "12.39205713",
        "numberOfUniqueBitcoinAddressesUsed": "143379",
        "totalOutputVolumeValue": "700606.523",
        "averageNumberOfTransactionsPerBlock": "371"
    },
    {
        "month": "5",
        "day": "30",
        "year": "2014",
        "price": "609.03",
        "totalCirculation": "12834000",
        "totalTransactionFees": "12.06522539",
        "numberOfUniqueBitcoinAddressesUsed": "137258",
        "totalOutputVolumeValue": "920847.4343",
        "averageNumberOfTransactionsPerBlock": "363"
    },
    {
        "month": "5",
        "day": "31",
        "year": "2014",
        "price": "620.45",
        "totalCirculation": "12837800",
        "totalTransactionFees": "9.93876923",
        "numberOfUniqueBitcoinAddressesUsed": "123216",
        "totalOutputVolumeValue": "602173.7806",
        "averageNumberOfTransactionsPerBlock": "459"
    },
    {
        "month": "6",
        "day": "1",
        "year": "2014",
        "price": "674.98",
        "totalCirculation": "12842275",
        "totalTransactionFees": "10.68373708",
        "numberOfUniqueBitcoinAddressesUsed": "164472",
        "totalOutputVolumeValue": "709780.7925",
        "averageNumberOfTransactionsPerBlock": "438"
    },
    {
        "month": "6",
        "day": "2",
        "year": "2014",
        "price": "631.49",
        "totalCirculation": "12846750",
        "totalTransactionFees": "10.91517676",
        "numberOfUniqueBitcoinAddressesUsed": "140278",
        "totalOutputVolumeValue": "711248.7612",
        "averageNumberOfTransactionsPerBlock": "347"
    },
    {
        "month": "6",
        "day": "3",
        "year": "2014",
        "price": "673.9",
        "totalCirculation": "12851450",
        "totalTransactionFees": "13.71930957",
        "numberOfUniqueBitcoinAddressesUsed": "162366",
        "totalOutputVolumeValue": "1139172.3",
        "averageNumberOfTransactionsPerBlock": "318"
    },
    {
        "month": "6",
        "day": "4",
        "year": "2014",
        "price": "644.66",
        "totalCirculation": "12856025",
        "totalTransactionFees": "12.26613461",
        "numberOfUniqueBitcoinAddressesUsed": "154092",
        "totalOutputVolumeValue": "924375.5041",
        "averageNumberOfTransactionsPerBlock": "411"
    },
    {
        "month": "6",
        "day": "5",
        "year": "2014",
        "price": "658.72",
        "totalCirculation": "12859650",
        "totalTransactionFees": "12.24567",
        "numberOfUniqueBitcoinAddressesUsed": "148891",
        "totalOutputVolumeValue": "1002352.43",
        "averageNumberOfTransactionsPerBlock": "369"
    },
    {
        "month": "6",
        "day": "6",
        "year": "2014",
        "price": "655.75",
        "totalCirculation": "12863350",
        "totalTransactionFees": "11.31817452",
        "numberOfUniqueBitcoinAddressesUsed": "150478",
        "totalOutputVolumeValue": "1178339.323",
        "averageNumberOfTransactionsPerBlock": "421"
    },
    {
        "month": "6",
        "day": "7",
        "year": "2014",
        "price": "654.3",
        "totalCirculation": "12867175",
        "totalTransactionFees": "9.12080675",
        "numberOfUniqueBitcoinAddressesUsed": "127246",
        "totalOutputVolumeValue": "577982.8619",
        "averageNumberOfTransactionsPerBlock": "397"
    },
    {
        "month": "6",
        "day": "8",
        "year": "2014",
        "price": "652",
        "totalCirculation": "12870925",
        "totalTransactionFees": "8.70951916",
        "numberOfUniqueBitcoinAddressesUsed": "153084",
        "totalOutputVolumeValue": "815990.0289",
        "averageNumberOfTransactionsPerBlock": "387"
    },
    {
        "month": "6",
        "day": "9",
        "year": "2014",
        "price": "650.93",
        "totalCirculation": "12874325",
        "totalTransactionFees": "10.27619998",
        "numberOfUniqueBitcoinAddressesUsed": "128287",
        "totalOutputVolumeValue": "341221.735",
        "averageNumberOfTransactionsPerBlock": "335"
    },
    {
        "month": "6",
        "day": "10",
        "year": "2014",
        "price": "649.89",
        "totalCirculation": "12878750",
        "totalTransactionFees": "12.193239",
        "numberOfUniqueBitcoinAddressesUsed": "150796",
        "totalOutputVolumeValue": "614894.552",
        "averageNumberOfTransactionsPerBlock": "289"
    },
    {
        "month": "6",
        "day": "11",
        "year": "2014",
        "price": "639.99",
        "totalCirculation": "12882400",
        "totalTransactionFees": "10.95603824",
        "numberOfUniqueBitcoinAddressesUsed": "141736",
        "totalOutputVolumeValue": "546126.0519",
        "averageNumberOfTransactionsPerBlock": "321"
    },
    {
        "month": "6",
        "day": "12",
        "year": "2014",
        "price": "617",
        "totalCirculation": "12886275",
        "totalTransactionFees": "12.15329591",
        "numberOfUniqueBitcoinAddressesUsed": "140825",
        "totalOutputVolumeValue": "686936.3531",
        "averageNumberOfTransactionsPerBlock": "377"
    },
    {
        "month": "6",
        "day": "13",
        "year": "2014",
        "price": "582",
        "totalCirculation": "12890475",
        "totalTransactionFees": "12.22428882",
        "numberOfUniqueBitcoinAddressesUsed": "151052",
        "totalOutputVolumeValue": "1167896.172",
        "averageNumberOfTransactionsPerBlock": "394"
    },
    {
        "month": "6",
        "day": "14",
        "year": "2014",
        "price": "557.92",
        "totalCirculation": "12894875",
        "totalTransactionFees": "9.95194649",
        "numberOfUniqueBitcoinAddressesUsed": "136421",
        "totalOutputVolumeValue": "472211.4609",
        "averageNumberOfTransactionsPerBlock": "412"
    },
    {
        "month": "6",
        "day": "15",
        "year": "2014",
        "price": "560.49",
        "totalCirculation": "12899525",
        "totalTransactionFees": "9.33855066",
        "numberOfUniqueBitcoinAddressesUsed": "156871",
        "totalOutputVolumeValue": "448374.4286",
        "averageNumberOfTransactionsPerBlock": "323"
    },
    {
        "month": "6",
        "day": "16",
        "year": "2014",
        "price": "595",
        "totalCirculation": "12904600",
        "totalTransactionFees": "11.12862904",
        "numberOfUniqueBitcoinAddressesUsed": "144825",
        "totalOutputVolumeValue": "723679.883",
        "averageNumberOfTransactionsPerBlock": "274"
    },
    {
        "month": "6",
        "day": "17",
        "year": "2014",
        "price": "597.65",
        "totalCirculation": "12909050",
        "totalTransactionFees": "11.98842568",
        "numberOfUniqueBitcoinAddressesUsed": "157183",
        "totalOutputVolumeValue": "460801.3223",
        "averageNumberOfTransactionsPerBlock": "261"
    },
    {
        "month": "6",
        "day": "18",
        "year": "2014",
        "price": "604.6",
        "totalCirculation": "12913300",
        "totalTransactionFees": "12.23255724",
        "numberOfUniqueBitcoinAddressesUsed": "153204",
        "totalOutputVolumeValue": "573046.443",
        "averageNumberOfTransactionsPerBlock": "358"
    },
    {
        "month": "6",
        "day": "19",
        "year": "2014",
        "price": "604.32",
        "totalCirculation": "12917075",
        "totalTransactionFees": "12.63691856",
        "numberOfUniqueBitcoinAddressesUsed": "127162",
        "totalOutputVolumeValue": "650150.7954",
        "averageNumberOfTransactionsPerBlock": "327"
    },
    {
        "month": "6",
        "day": "20",
        "year": "2014",
        "price": "593.33",
        "totalCirculation": "12921700",
        "totalTransactionFees": "11.25311797",
        "numberOfUniqueBitcoinAddressesUsed": "142279",
        "totalOutputVolumeValue": "609970.3641",
        "averageNumberOfTransactionsPerBlock": "342"
    },
    {
        "month": "6",
        "day": "21",
        "year": "2014",
        "price": "590.99",
        "totalCirculation": "12926425",
        "totalTransactionFees": "9.11976494",
        "numberOfUniqueBitcoinAddressesUsed": "131691",
        "totalOutputVolumeValue": "503587.7279",
        "averageNumberOfTransactionsPerBlock": "364"
    },
    {
        "month": "6",
        "day": "22",
        "year": "2014",
        "price": "596.08",
        "totalCirculation": "12931250",
        "totalTransactionFees": "9.42521379",
        "numberOfUniqueBitcoinAddressesUsed": "166479",
        "totalOutputVolumeValue": "520673.9866",
        "averageNumberOfTransactionsPerBlock": "335"
    },
    {
        "month": "6",
        "day": "23",
        "year": "2014",
        "price": "591.5",
        "totalCirculation": "12935200",
        "totalTransactionFees": "9.92050289",
        "numberOfUniqueBitcoinAddressesUsed": "125908",
        "totalOutputVolumeValue": "493645.5382",
        "averageNumberOfTransactionsPerBlock": "304"
    },
    {
        "month": "6",
        "day": "24",
        "year": "2014",
        "price": "585.54",
        "totalCirculation": "12940150",
        "totalTransactionFees": "11.64240605",
        "numberOfUniqueBitcoinAddressesUsed": "149893",
        "totalOutputVolumeValue": "974332.6751",
        "averageNumberOfTransactionsPerBlock": "300"
    },
    {
        "month": "6",
        "day": "25",
        "year": "2014",
        "price": "567",
        "totalCirculation": "12944800",
        "totalTransactionFees": "11.5556694",
        "numberOfUniqueBitcoinAddressesUsed": "150209",
        "totalOutputVolumeValue": "525512.1072",
        "averageNumberOfTransactionsPerBlock": "496"
    },
    {
        "month": "6",
        "day": "26",
        "year": "2014",
        "price": "569",
        "totalCirculation": "12949075",
        "totalTransactionFees": "11.37751104",
        "numberOfUniqueBitcoinAddressesUsed": "141973",
        "totalOutputVolumeValue": "523609.7446",
        "averageNumberOfTransactionsPerBlock": "514"
    },
    {
        "month": "6",
        "day": "27",
        "year": "2014",
        "price": "588.97",
        "totalCirculation": "12953750",
        "totalTransactionFees": "10.29537954",
        "numberOfUniqueBitcoinAddressesUsed": "143429",
        "totalOutputVolumeValue": "465624.735",
        "averageNumberOfTransactionsPerBlock": "487"
    },
    {
        "month": "6",
        "day": "28",
        "year": "2014",
        "price": "597.08",
        "totalCirculation": "12958425",
        "totalTransactionFees": "9.87835113",
        "numberOfUniqueBitcoinAddressesUsed": "123855",
        "totalOutputVolumeValue": "386544.9099",
        "averageNumberOfTransactionsPerBlock": "475"
    },
    {
        "month": "6",
        "day": "29",
        "year": "2014",
        "price": "596",
        "totalCirculation": "12962775",
        "totalTransactionFees": "8.84416498",
        "numberOfUniqueBitcoinAddressesUsed": "159773",
        "totalOutputVolumeValue": "336897.0261",
        "averageNumberOfTransactionsPerBlock": "386"
    },
    {
        "month": "6",
        "day": "30",
        "year": "2014",
        "price": "620",
        "totalCirculation": "12965900",
        "totalTransactionFees": "10.90944259",
        "numberOfUniqueBitcoinAddressesUsed": "136152",
        "totalOutputVolumeValue": "586067.1147",
        "averageNumberOfTransactionsPerBlock": "319"
    },
    {
        "month": "7",
        "day": "1",
        "year": "2014",
        "price": "654.45",
        "totalCirculation": "12969350",
        "totalTransactionFees": "12.36328988",
        "numberOfUniqueBitcoinAddressesUsed": "163651",
        "totalOutputVolumeValue": "922663.2478",
        "averageNumberOfTransactionsPerBlock": "358"
    },
    {
        "month": "7",
        "day": "2",
        "year": "2014",
        "price": "654",
        "totalCirculation": "12972825",
        "totalTransactionFees": "13.73343865",
        "numberOfUniqueBitcoinAddressesUsed": "152310",
        "totalOutputVolumeValue": "953854.0659",
        "averageNumberOfTransactionsPerBlock": "431"
    },
    {
        "month": "7",
        "day": "3",
        "year": "2014",
        "price": "644.04",
        "totalCirculation": "12976150",
        "totalTransactionFees": "11.08189519",
        "numberOfUniqueBitcoinAddressesUsed": "142946",
        "totalOutputVolumeValue": "646583.7207",
        "averageNumberOfTransactionsPerBlock": "432"
    },
    {
        "month": "7",
        "day": "4",
        "year": "2014",
        "price": "635.49",
        "totalCirculation": "12980150",
        "totalTransactionFees": "10.58824881",
        "numberOfUniqueBitcoinAddressesUsed": "128352",
        "totalOutputVolumeValue": "425600.3181",
        "averageNumberOfTransactionsPerBlock": "444"
    },
    {
        "month": "7",
        "day": "5",
        "year": "2014",
        "price": "632.78",
        "totalCirculation": "12983950",
        "totalTransactionFees": "8.26076745",
        "numberOfUniqueBitcoinAddressesUsed": "107662",
        "totalOutputVolumeValue": "402775.0973",
        "averageNumberOfTransactionsPerBlock": "416"
    },
    {
        "month": "7",
        "day": "6",
        "year": "2014",
        "price": "634.49",
        "totalCirculation": "12987675",
        "totalTransactionFees": "9.24924683",
        "numberOfUniqueBitcoinAddressesUsed": "163209",
        "totalOutputVolumeValue": "392600.4604",
        "averageNumberOfTransactionsPerBlock": "399"
    },
    {
        "month": "7",
        "day": "7",
        "year": "2014",
        "price": "621.98",
        "totalCirculation": "12991150",
        "totalTransactionFees": "10.44603741",
        "numberOfUniqueBitcoinAddressesUsed": "136897",
        "totalOutputVolumeValue": "427135.8126",
        "averageNumberOfTransactionsPerBlock": "328"
    },
    {
        "month": "7",
        "day": "8",
        "year": "2014",
        "price": "623.7",
        "totalCirculation": "12995200",
        "totalTransactionFees": "12.21686237",
        "numberOfUniqueBitcoinAddressesUsed": "192201",
        "totalOutputVolumeValue": "400562.5669",
        "averageNumberOfTransactionsPerBlock": "344"
    },
    {
        "month": "7",
        "day": "9",
        "year": "2014",
        "price": "624.84",
        "totalCirculation": "12999175",
        "totalTransactionFees": "11.9361757",
        "numberOfUniqueBitcoinAddressesUsed": "160879",
        "totalOutputVolumeValue": "462661.1408",
        "averageNumberOfTransactionsPerBlock": "412"
    },
    {
        "month": "7",
        "day": "10",
        "year": "2014",
        "price": "619.78",
        "totalCirculation": "13003025",
        "totalTransactionFees": "11.22613459",
        "numberOfUniqueBitcoinAddressesUsed": "149129",
        "totalOutputVolumeValue": "509362.7541",
        "averageNumberOfTransactionsPerBlock": "503"
    },
    {
        "month": "7",
        "day": "11",
        "year": "2014",
        "price": "630.31",
        "totalCirculation": "13006775",
        "totalTransactionFees": "11.12342321",
        "numberOfUniqueBitcoinAddressesUsed": "145718",
        "totalOutputVolumeValue": "439592.2531",
        "averageNumberOfTransactionsPerBlock": "410"
    },
    {
        "month": "7",
        "day": "12",
        "year": "2014",
        "price": "631.98",
        "totalCirculation": "13010900",
        "totalTransactionFees": "9.01518862",
        "numberOfUniqueBitcoinAddressesUsed": "145144",
        "totalOutputVolumeValue": "457155.4053",
        "averageNumberOfTransactionsPerBlock": "401"
    },
    {
        "month": "7",
        "day": "13",
        "year": "2014",
        "price": "630.9",
        "totalCirculation": "13014750",
        "totalTransactionFees": "9.32359299",
        "numberOfUniqueBitcoinAddressesUsed": "165376",
        "totalOutputVolumeValue": "503290.9247",
        "averageNumberOfTransactionsPerBlock": "392"
    },
    {
        "month": "7",
        "day": "14",
        "year": "2014",
        "price": "622.8",
        "totalCirculation": "13018375",
        "totalTransactionFees": "11.35018792",
        "numberOfUniqueBitcoinAddressesUsed": "133673",
        "totalOutputVolumeValue": "448907.6513",
        "averageNumberOfTransactionsPerBlock": "340"
    },
    {
        "month": "7",
        "day": "15",
        "year": "2014",
        "price": "623.17",
        "totalCirculation": "13021825",
        "totalTransactionFees": "11.87785856",
        "numberOfUniqueBitcoinAddressesUsed": "151679",
        "totalOutputVolumeValue": "597198.1655",
        "averageNumberOfTransactionsPerBlock": "322"
    },
    {
        "month": "7",
        "day": "16",
        "year": "2014",
        "price": "619.48",
        "totalCirculation": "13025950",
        "totalTransactionFees": "12.33196333",
        "numberOfUniqueBitcoinAddressesUsed": "151081",
        "totalOutputVolumeValue": "567687.7767",
        "averageNumberOfTransactionsPerBlock": "413"
    },
    {
        "month": "7",
        "day": "17",
        "year": "2014",
        "price": "626",
        "totalCirculation": "13030225",
        "totalTransactionFees": "12.74168175",
        "numberOfUniqueBitcoinAddressesUsed": "146474",
        "totalOutputVolumeValue": "473771.878",
        "averageNumberOfTransactionsPerBlock": "467"
    },
    {
        "month": "7",
        "day": "18",
        "year": "2014",
        "price": "629.86",
        "totalCirculation": "13034200",
        "totalTransactionFees": "11.60568116",
        "numberOfUniqueBitcoinAddressesUsed": "141439",
        "totalOutputVolumeValue": "552675.728",
        "averageNumberOfTransactionsPerBlock": "471"
    },
    {
        "month": "7",
        "day": "19",
        "year": "2014",
        "price": "630.92",
        "totalCirculation": "13038500",
        "totalTransactionFees": "10.4567612",
        "numberOfUniqueBitcoinAddressesUsed": "132003",
        "totalOutputVolumeValue": "348919.2634",
        "averageNumberOfTransactionsPerBlock": "435"
    },
    {
        "month": "7",
        "day": "20",
        "year": "2014",
        "price": "623.77",
        "totalCirculation": "13042750",
        "totalTransactionFees": "9.50599823",
        "numberOfUniqueBitcoinAddressesUsed": "176955",
        "totalOutputVolumeValue": "261004.7079",
        "averageNumberOfTransactionsPerBlock": "402"
    },
    {
        "month": "7",
        "day": "21",
        "year": "2014",
        "price": "619.14",
        "totalCirculation": "13046475",
        "totalTransactionFees": "10.02036474",
        "numberOfUniqueBitcoinAddressesUsed": "135230",
        "totalOutputVolumeValue": "419218.1766",
        "averageNumberOfTransactionsPerBlock": "410"
    },
    {
        "month": "7",
        "day": "22",
        "year": "2014",
        "price": "621.03",
        "totalCirculation": "13050050",
        "totalTransactionFees": "11.8573934",
        "numberOfUniqueBitcoinAddressesUsed": "134257",
        "totalOutputVolumeValue": "409845.8799",
        "averageNumberOfTransactionsPerBlock": "329"
    },
    {
        "month": "7",
        "day": "23",
        "year": "2014",
        "price": "622.01",
        "totalCirculation": "13053700",
        "totalTransactionFees": "11.23511096",
        "numberOfUniqueBitcoinAddressesUsed": "155345",
        "totalOutputVolumeValue": "411686.2939",
        "averageNumberOfTransactionsPerBlock": "437"
    },
    {
        "month": "7",
        "day": "24",
        "year": "2014",
        "price": "601.18",
        "totalCirculation": "13057425",
        "totalTransactionFees": "10.633025",
        "numberOfUniqueBitcoinAddressesUsed": "150217",
        "totalOutputVolumeValue": "518394.6739",
        "averageNumberOfTransactionsPerBlock": "434"
    },
    {
        "month": "7",
        "day": "25",
        "year": "2014",
        "price": "602.59",
        "totalCirculation": "13061350",
        "totalTransactionFees": "10.19839577",
        "numberOfUniqueBitcoinAddressesUsed": "151416",
        "totalOutputVolumeValue": "504563.9726",
        "averageNumberOfTransactionsPerBlock": "368"
    },
    {
        "month": "7",
        "day": "26",
        "year": "2014",
        "price": "595.88",
        "totalCirculation": "13064850",
        "totalTransactionFees": "9.50827747",
        "numberOfUniqueBitcoinAddressesUsed": "130299",
        "totalOutputVolumeValue": "349792.1607",
        "averageNumberOfTransactionsPerBlock": "439"
    },
    {
        "month": "7",
        "day": "27",
        "year": "2014",
        "price": "592.51",
        "totalCirculation": "13068875",
        "totalTransactionFees": "8.77568128",
        "numberOfUniqueBitcoinAddressesUsed": "163986",
        "totalOutputVolumeValue": "245926.7461",
        "averageNumberOfTransactionsPerBlock": "452"
    },
    {
        "month": "7",
        "day": "28",
        "year": "2014",
        "price": "586.96",
        "totalCirculation": "13072275",
        "totalTransactionFees": "9.70412523",
        "numberOfUniqueBitcoinAddressesUsed": "135674",
        "totalOutputVolumeValue": "443294.0827",
        "averageNumberOfTransactionsPerBlock": "354"
    },
    {
        "month": "7",
        "day": "29",
        "year": "2014",
        "price": "581.5",
        "totalCirculation": "13076000",
        "totalTransactionFees": "10.6532582",
        "numberOfUniqueBitcoinAddressesUsed": "147327",
        "totalOutputVolumeValue": "542927.2547",
        "averageNumberOfTransactionsPerBlock": "345"
    },
    {
        "month": "7",
        "day": "30",
        "year": "2014",
        "price": "573.48",
        "totalCirculation": "13080375",
        "totalTransactionFees": "10.85994311",
        "numberOfUniqueBitcoinAddressesUsed": "151806",
        "totalOutputVolumeValue": "401968.065",
        "averageNumberOfTransactionsPerBlock": "467"
    },
    {
        "month": "7",
        "day": "31",
        "year": "2014",
        "price": "586",
        "totalCirculation": "13084225",
        "totalTransactionFees": "11.02486059",
        "numberOfUniqueBitcoinAddressesUsed": "152214",
        "totalOutputVolumeValue": "442521.5557",
        "averageNumberOfTransactionsPerBlock": "552"
    },
    {
        "month": "8",
        "day": "1",
        "year": "2014",
        "price": "601.94",
        "totalCirculation": "13088050",
        "totalTransactionFees": "10.87967636",
        "numberOfUniqueBitcoinAddressesUsed": "146378",
        "totalOutputVolumeValue": "467637.6989",
        "averageNumberOfTransactionsPerBlock": "515"
    },
    {
        "month": "8",
        "day": "2",
        "year": "2014",
        "price": "591.59",
        "totalCirculation": "13092275",
        "totalTransactionFees": "9.36154144",
        "numberOfUniqueBitcoinAddressesUsed": "133227",
        "totalOutputVolumeValue": "371023.9948",
        "averageNumberOfTransactionsPerBlock": "450"
    },
    {
        "month": "8",
        "day": "3",
        "year": "2014",
        "price": "589.79",
        "totalCirculation": "13096075",
        "totalTransactionFees": "8.36702521",
        "numberOfUniqueBitcoinAddressesUsed": "155660",
        "totalOutputVolumeValue": "444379.2905",
        "averageNumberOfTransactionsPerBlock": "429"
    },
    {
        "month": "8",
        "day": "4",
        "year": "2014",
        "price": "593.94",
        "totalCirculation": "13099450",
        "totalTransactionFees": "10.10701582",
        "numberOfUniqueBitcoinAddressesUsed": "122118",
        "totalOutputVolumeValue": "399294.1037",
        "averageNumberOfTransactionsPerBlock": "363"
    },
    {
        "month": "8",
        "day": "5",
        "year": "2014",
        "price": "580.21",
        "totalCirculation": "13102750",
        "totalTransactionFees": "12.15106865",
        "numberOfUniqueBitcoinAddressesUsed": "166966",
        "totalOutputVolumeValue": "529514.9417",
        "averageNumberOfTransactionsPerBlock": "326"
    },
    {
        "month": "8",
        "day": "6",
        "year": "2014",
        "price": "581.6",
        "totalCirculation": "13106575",
        "totalTransactionFees": "12.93168516",
        "numberOfUniqueBitcoinAddressesUsed": "175244",
        "totalOutputVolumeValue": "560463.9626",
        "averageNumberOfTransactionsPerBlock": "385"
    },
    {
        "month": "8",
        "day": "7",
        "year": "2014",
        "price": "587.24",
        "totalCirculation": "13110500",
        "totalTransactionFees": "11.21723833",
        "numberOfUniqueBitcoinAddressesUsed": "153189",
        "totalOutputVolumeValue": "452393.1086",
        "averageNumberOfTransactionsPerBlock": "435"
    },
    {
        "month": "8",
        "day": "8",
        "year": "2014",
        "price": "589.3",
        "totalCirculation": "13114525",
        "totalTransactionFees": "11.08588192",
        "numberOfUniqueBitcoinAddressesUsed": "151292",
        "totalOutputVolumeValue": "297685.6222",
        "averageNumberOfTransactionsPerBlock": "477"
    },
    {
        "month": "8",
        "day": "9",
        "year": "2014",
        "price": "588.61",
        "totalCirculation": "13118850",
        "totalTransactionFees": "9.89679335",
        "numberOfUniqueBitcoinAddressesUsed": "130400",
        "totalOutputVolumeValue": "420310.5818",
        "averageNumberOfTransactionsPerBlock": "477"
    },
    {
        "month": "8",
        "day": "10",
        "year": "2014",
        "price": "588.99",
        "totalCirculation": "13123325",
        "totalTransactionFees": "9.6259823",
        "numberOfUniqueBitcoinAddressesUsed": "176751",
        "totalOutputVolumeValue": "341775.0295",
        "averageNumberOfTransactionsPerBlock": "427"
    },
    {
        "month": "8",
        "day": "11",
        "year": "2014",
        "price": "578.97",
        "totalCirculation": "13127875",
        "totalTransactionFees": "11.68497448",
        "numberOfUniqueBitcoinAddressesUsed": "161536",
        "totalOutputVolumeValue": "495304.617",
        "averageNumberOfTransactionsPerBlock": "440"
    },
    {
        "month": "8",
        "day": "12",
        "year": "2014",
        "price": "569.54",
        "totalCirculation": "13132400",
        "totalTransactionFees": "12.42984721",
        "numberOfUniqueBitcoinAddressesUsed": "172608",
        "totalOutputVolumeValue": "764214.6776",
        "averageNumberOfTransactionsPerBlock": "359"
    },
    {
        "month": "8",
        "day": "13",
        "year": "2014",
        "price": "550.14",
        "totalCirculation": "13136325",
        "totalTransactionFees": "12.599707",
        "numberOfUniqueBitcoinAddressesUsed": "173743",
        "totalOutputVolumeValue": "717606.6144",
        "averageNumberOfTransactionsPerBlock": "388"
    },
    {
        "month": "8",
        "day": "14",
        "year": "2014",
        "price": "521.66",
        "totalCirculation": "13140575",
        "totalTransactionFees": "12.6295534",
        "numberOfUniqueBitcoinAddressesUsed": "168931",
        "totalOutputVolumeValue": "700727.3105",
        "averageNumberOfTransactionsPerBlock": "366"
    },
    {
        "month": "8",
        "day": "15",
        "year": "2014",
        "price": "498.16",
        "totalCirculation": "13144650",
        "totalTransactionFees": "10.97370877",
        "numberOfUniqueBitcoinAddressesUsed": "155144",
        "totalOutputVolumeValue": "796925.7647",
        "averageNumberOfTransactionsPerBlock": "462"
    },
    {
        "month": "8",
        "day": "16",
        "year": "2014",
        "price": "509",
        "totalCirculation": "13148925",
        "totalTransactionFees": "14.69897958",
        "numberOfUniqueBitcoinAddressesUsed": "161700",
        "totalOutputVolumeValue": "689805.1059",
        "averageNumberOfTransactionsPerBlock": "449"
    },
    {
        "month": "8",
        "day": "17",
        "year": "2014",
        "price": "491.88",
        "totalCirculation": "13153050",
        "totalTransactionFees": "37.29813075",
        "numberOfUniqueBitcoinAddressesUsed": "180542",
        "totalOutputVolumeValue": "493900.2813",
        "averageNumberOfTransactionsPerBlock": "423"
    },
    {
        "month": "8",
        "day": "18",
        "year": "2014",
        "price": "468.19",
        "totalCirculation": "13157425",
        "totalTransactionFees": "10.68090312",
        "numberOfUniqueBitcoinAddressesUsed": "146537",
        "totalOutputVolumeValue": "978813.3801",
        "averageNumberOfTransactionsPerBlock": "383"
    },
    {
        "month": "8",
        "day": "19",
        "year": "2014",
        "price": "487.5",
        "totalCirculation": "13162575",
        "totalTransactionFees": "12.87741605",
        "numberOfUniqueBitcoinAddressesUsed": "172107",
        "totalOutputVolumeValue": "655716.6884",
        "averageNumberOfTransactionsPerBlock": "335"
    },
    {
        "month": "8",
        "day": "20",
        "year": "2014",
        "price": "507.3",
        "totalCirculation": "13166525",
        "totalTransactionFees": "12.02058864",
        "numberOfUniqueBitcoinAddressesUsed": "163890",
        "totalOutputVolumeValue": "575101.3765",
        "averageNumberOfTransactionsPerBlock": "495"
    },
    {
        "month": "8",
        "day": "21",
        "year": "2014",
        "price": "525.78",
        "totalCirculation": "13170725",
        "totalTransactionFees": "11.94405134",
        "numberOfUniqueBitcoinAddressesUsed": "176373",
        "totalOutputVolumeValue": "613696.6055",
        "averageNumberOfTransactionsPerBlock": "445"
    },
    {
        "month": "8",
        "day": "22",
        "year": "2014",
        "price": "518.25",
        "totalCirculation": "13174750",
        "totalTransactionFees": "10.85000669",
        "numberOfUniqueBitcoinAddressesUsed": "156481",
        "totalOutputVolumeValue": "3355242.274",
        "averageNumberOfTransactionsPerBlock": "461"
    },
    {
        "month": "8",
        "day": "23",
        "year": "2014",
        "price": "503.88",
        "totalCirculation": "13178675",
        "totalTransactionFees": "9.21595098",
        "numberOfUniqueBitcoinAddressesUsed": "135772",
        "totalOutputVolumeValue": "667276.9219",
        "averageNumberOfTransactionsPerBlock": "382"
    },
    {
        "month": "8",
        "day": "24",
        "year": "2014",
        "price": "510.75",
        "totalCirculation": "13182775",
        "totalTransactionFees": "8.65681711",
        "numberOfUniqueBitcoinAddressesUsed": "183565",
        "totalOutputVolumeValue": "483183.1586",
        "averageNumberOfTransactionsPerBlock": "407"
    },
    {
        "month": "8",
        "day": "25",
        "year": "2014",
        "price": "503.79",
        "totalCirculation": "13186125",
        "totalTransactionFees": "14.33068278",
        "numberOfUniqueBitcoinAddressesUsed": "148320",
        "totalOutputVolumeValue": "837227.9845",
        "averageNumberOfTransactionsPerBlock": "371"
    },
    {
        "month": "8",
        "day": "26",
        "year": "2014",
        "price": "512.79",
        "totalCirculation": "13190275",
        "totalTransactionFees": "13.09978465",
        "numberOfUniqueBitcoinAddressesUsed": "163922",
        "totalOutputVolumeValue": "1849501.097",
        "averageNumberOfTransactionsPerBlock": "306"
    },
    {
        "month": "8",
        "day": "27",
        "year": "2014",
        "price": "514.84",
        "totalCirculation": "13194300",
        "totalTransactionFees": "11.61214904",
        "numberOfUniqueBitcoinAddressesUsed": "160858",
        "totalOutputVolumeValue": "1473447.111",
        "averageNumberOfTransactionsPerBlock": "441"
    },
    {
        "month": "8",
        "day": "28",
        "year": "2014",
        "price": "509.39",
        "totalCirculation": "13198825",
        "totalTransactionFees": "10.66182195",
        "numberOfUniqueBitcoinAddressesUsed": "166074",
        "totalOutputVolumeValue": "729893.9113",
        "averageNumberOfTransactionsPerBlock": "500"
    },
    {
        "month": "8",
        "day": "29",
        "year": "2014",
        "price": "511.99",
        "totalCirculation": "13202975",
        "totalTransactionFees": "10.22007288",
        "numberOfUniqueBitcoinAddressesUsed": "145588",
        "totalOutputVolumeValue": "527726.8258",
        "averageNumberOfTransactionsPerBlock": "453"
    },
    {
        "month": "8",
        "day": "30",
        "year": "2014",
        "price": "503.88",
        "totalCirculation": "13207275",
        "totalTransactionFees": "9.7465966",
        "numberOfUniqueBitcoinAddressesUsed": "145985",
        "totalOutputVolumeValue": "643988.2664",
        "averageNumberOfTransactionsPerBlock": "424"
    },
    {
        "month": "8",
        "day": "31",
        "year": "2014",
        "price": "477.98",
        "totalCirculation": "13212150",
        "totalTransactionFees": "9.02275826",
        "numberOfUniqueBitcoinAddressesUsed": "172302",
        "totalOutputVolumeValue": "545659.8582",
        "averageNumberOfTransactionsPerBlock": "449"
    },
    {
        "month": "9",
        "day": "1",
        "year": "2014",
        "price": "482.59",
        "totalCirculation": "13215900",
        "totalTransactionFees": "10.30536727",
        "numberOfUniqueBitcoinAddressesUsed": "162588",
        "totalOutputVolumeValue": "687875.7552",
        "averageNumberOfTransactionsPerBlock": "401"
    },
    {
        "month": "9",
        "day": "2",
        "year": "2014",
        "price": "483.65",
        "totalCirculation": "13219475",
        "totalTransactionFees": "11.41237447",
        "numberOfUniqueBitcoinAddressesUsed": "153606",
        "totalOutputVolumeValue": "574246.0662",
        "averageNumberOfTransactionsPerBlock": "362"
    },
    {
        "month": "9",
        "day": "3",
        "year": "2014",
        "price": "472.76",
        "totalCirculation": "13223450",
        "totalTransactionFees": "11.28382249",
        "numberOfUniqueBitcoinAddressesUsed": "148218",
        "totalOutputVolumeValue": "512676.8879",
        "averageNumberOfTransactionsPerBlock": "468"
    },
    {
        "month": "9",
        "day": "4",
        "year": "2014",
        "price": "486",
        "totalCirculation": "13227625",
        "totalTransactionFees": "11.15620263",
        "numberOfUniqueBitcoinAddressesUsed": "152304",
        "totalOutputVolumeValue": "443030.7918",
        "averageNumberOfTransactionsPerBlock": "605"
    },
    {
        "month": "9",
        "day": "5",
        "year": "2014",
        "price": "485.91",
        "totalCirculation": "13231350",
        "totalTransactionFees": "10.7140055",
        "numberOfUniqueBitcoinAddressesUsed": "155908",
        "totalOutputVolumeValue": "446975.7395",
        "averageNumberOfTransactionsPerBlock": "489"
    },
    {
        "month": "9",
        "day": "6",
        "year": "2014",
        "price": "481.09",
        "totalCirculation": "13235550",
        "totalTransactionFees": "10.4899443",
        "numberOfUniqueBitcoinAddressesUsed": "143414",
        "totalOutputVolumeValue": "391892.9554",
        "averageNumberOfTransactionsPerBlock": "417"
    },
    {
        "month": "9",
        "day": "7",
        "year": "2014",
        "price": "480.62",
        "totalCirculation": "13239650",
        "totalTransactionFees": "19.46564618",
        "numberOfUniqueBitcoinAddressesUsed": "214360",
        "totalOutputVolumeValue": "320158.1026",
        "averageNumberOfTransactionsPerBlock": "411"
    },
    {
        "month": "9",
        "day": "8",
        "year": "2014",
        "price": "476.61",
        "totalCirculation": "13243475",
        "totalTransactionFees": "11.323667",
        "numberOfUniqueBitcoinAddressesUsed": "151689",
        "totalOutputVolumeValue": "519189.7412",
        "averageNumberOfTransactionsPerBlock": "353"
    },
    {
        "month": "9",
        "day": "9",
        "year": "2014",
        "price": "466.48",
        "totalCirculation": "13246775",
        "totalTransactionFees": "13.00607767",
        "numberOfUniqueBitcoinAddressesUsed": "173414",
        "totalOutputVolumeValue": "488189.9522",
        "averageNumberOfTransactionsPerBlock": "388"
    },
    {
        "month": "9",
        "day": "10",
        "year": "2014",
        "price": "485.03",
        "totalCirculation": "13250675",
        "totalTransactionFees": "14.66467827",
        "numberOfUniqueBitcoinAddressesUsed": "164564",
        "totalOutputVolumeValue": "506624.7066",
        "averageNumberOfTransactionsPerBlock": "500"
    },
    {
        "month": "9",
        "day": "11",
        "year": "2014",
        "price": "469",
        "totalCirculation": "13254725",
        "totalTransactionFees": "10.27418557",
        "numberOfUniqueBitcoinAddressesUsed": "147710",
        "totalOutputVolumeValue": "466172.2597",
        "averageNumberOfTransactionsPerBlock": "528"
    },
    {
        "month": "9",
        "day": "12",
        "year": "2014",
        "price": "470.43",
        "totalCirculation": "13258750",
        "totalTransactionFees": "10.4459308",
        "numberOfUniqueBitcoinAddressesUsed": "148941",
        "totalOutputVolumeValue": "454009.5276",
        "averageNumberOfTransactionsPerBlock": "422"
    },
    {
        "month": "9",
        "day": "13",
        "year": "2014",
        "price": "479.86",
        "totalCirculation": "13263175",
        "totalTransactionFees": "9.87754729",
        "numberOfUniqueBitcoinAddressesUsed": "136734",
        "totalOutputVolumeValue": "358930.1942",
        "averageNumberOfTransactionsPerBlock": "431"
    },
    {
        "month": "9",
        "day": "14",
        "year": "2014",
        "price": "475.49",
        "totalCirculation": "13267425",
        "totalTransactionFees": "10.41613288",
        "numberOfUniqueBitcoinAddressesUsed": "203940",
        "totalOutputVolumeValue": "332978.2976",
        "averageNumberOfTransactionsPerBlock": "442"
    },
    {
        "month": "9",
        "day": "15",
        "year": "2014",
        "price": "475.3",
        "totalCirculation": "13271125",
        "totalTransactionFees": "11.9467162",
        "numberOfUniqueBitcoinAddressesUsed": "161269",
        "totalOutputVolumeValue": "462681.1224",
        "averageNumberOfTransactionsPerBlock": "360"
    },
    {
        "month": "9",
        "day": "16",
        "year": "2014",
        "price": "468",
        "totalCirculation": "13275350",
        "totalTransactionFees": "14.7337395",
        "numberOfUniqueBitcoinAddressesUsed": "186658",
        "totalOutputVolumeValue": "437451.4801",
        "averageNumberOfTransactionsPerBlock": "360"
    },
    {
        "month": "9",
        "day": "17",
        "year": "2014",
        "price": "448",
        "totalCirculation": "13280075",
        "totalTransactionFees": "12.27569456",
        "numberOfUniqueBitcoinAddressesUsed": "164215",
        "totalOutputVolumeValue": "462824.8682",
        "averageNumberOfTransactionsPerBlock": "436"
    },
    {
        "month": "9",
        "day": "18",
        "year": "2014",
        "price": "428.19",
        "totalCirculation": "13284700",
        "totalTransactionFees": "12.45941455",
        "numberOfUniqueBitcoinAddressesUsed": "168204",
        "totalOutputVolumeValue": "652489.2436",
        "averageNumberOfTransactionsPerBlock": "471"
    },
    {
        "month": "9",
        "day": "19",
        "year": "2014",
        "price": "398.89",
        "totalCirculation": "13288750",
        "totalTransactionFees": "11.14791622",
        "numberOfUniqueBitcoinAddressesUsed": "149539",
        "totalOutputVolumeValue": "741891.7351",
        "averageNumberOfTransactionsPerBlock": "497"
    },
    {
        "month": "9",
        "day": "20",
        "year": "2014",
        "price": "415.56",
        "totalCirculation": "13293075",
        "totalTransactionFees": "9.96929167",
        "numberOfUniqueBitcoinAddressesUsed": "142592",
        "totalOutputVolumeValue": "720476.6817",
        "averageNumberOfTransactionsPerBlock": "475"
    },
    {
        "month": "9",
        "day": "21",
        "year": "2014",
        "price": "406.3",
        "totalCirculation": "13297450",
        "totalTransactionFees": "9.80993611",
        "numberOfUniqueBitcoinAddressesUsed": "172794",
        "totalOutputVolumeValue": "875032.1061",
        "averageNumberOfTransactionsPerBlock": "485"
    },
    {
        "month": "9",
        "day": "22",
        "year": "2014",
        "price": "400.98",
        "totalCirculation": "13301375",
        "totalTransactionFees": "10.88655821",
        "numberOfUniqueBitcoinAddressesUsed": "175943",
        "totalOutputVolumeValue": "507462.7293",
        "averageNumberOfTransactionsPerBlock": "522"
    },
    {
        "month": "9",
        "day": "23",
        "year": "2014",
        "price": "423",
        "totalCirculation": "13305150",
        "totalTransactionFees": "11.60787131",
        "numberOfUniqueBitcoinAddressesUsed": "166664",
        "totalOutputVolumeValue": "738732.1412",
        "averageNumberOfTransactionsPerBlock": "447"
    },
    {
        "month": "9",
        "day": "24",
        "year": "2014",
        "price": "431.91",
        "totalCirculation": "13309225",
        "totalTransactionFees": "13.42090123",
        "numberOfUniqueBitcoinAddressesUsed": "171434",
        "totalOutputVolumeValue": "957227.8191",
        "averageNumberOfTransactionsPerBlock": "531"
    },
    {
        "month": "9",
        "day": "25",
        "year": "2014",
        "price": "408.08",
        "totalCirculation": "13313300",
        "totalTransactionFees": "13.07804471",
        "numberOfUniqueBitcoinAddressesUsed": "167940",
        "totalOutputVolumeValue": "686077.5817",
        "averageNumberOfTransactionsPerBlock": "517"
    },
    {
        "month": "9",
        "day": "26",
        "year": "2014",
        "price": "405.14",
        "totalCirculation": "13317075",
        "totalTransactionFees": "47.43930673",
        "numberOfUniqueBitcoinAddressesUsed": "149986",
        "totalOutputVolumeValue": "596150.4681",
        "averageNumberOfTransactionsPerBlock": "539"
    },
    {
        "month": "9",
        "day": "27",
        "year": "2014",
        "price": "400.74",
        "totalCirculation": "13320275",
        "totalTransactionFees": "11.34818893",
        "numberOfUniqueBitcoinAddressesUsed": "145374",
        "totalOutputVolumeValue": "532351.156",
        "averageNumberOfTransactionsPerBlock": "504"
    },
    {
        "month": "9",
        "day": "28",
        "year": "2014",
        "price": "380",
        "totalCirculation": "13323750",
        "totalTransactionFees": "11.08075213",
        "numberOfUniqueBitcoinAddressesUsed": "213832",
        "totalOutputVolumeValue": "453805.8176",
        "averageNumberOfTransactionsPerBlock": "515"
    },
    {
        "month": "9",
        "day": "29",
        "year": "2014",
        "price": "381.94",
        "totalCirculation": "13327200",
        "totalTransactionFees": "11.45663317",
        "numberOfUniqueBitcoinAddressesUsed": "152629",
        "totalOutputVolumeValue": "654029.3292",
        "averageNumberOfTransactionsPerBlock": "492"
    },
    {
        "month": "9",
        "day": "30",
        "year": "2014",
        "price": "382.67",
        "totalCirculation": "13331000",
        "totalTransactionFees": "12.33293377",
        "numberOfUniqueBitcoinAddressesUsed": "184554",
        "totalOutputVolumeValue": "631639.8353",
        "averageNumberOfTransactionsPerBlock": "374"
    },
    {
        "month": "10",
        "day": "1",
        "year": "2014",
        "price": "385.27",
        "totalCirculation": "13334625",
        "totalTransactionFees": "12.63437263",
        "numberOfUniqueBitcoinAddressesUsed": "184739",
        "totalOutputVolumeValue": "731277.1057",
        "averageNumberOfTransactionsPerBlock": "469"
    },
    {
        "month": "10",
        "day": "2",
        "year": "2014",
        "price": "375.85",
        "totalCirculation": "13338325",
        "totalTransactionFees": "11.80636226",
        "numberOfUniqueBitcoinAddressesUsed": "161404",
        "totalOutputVolumeValue": "624053.1904",
        "averageNumberOfTransactionsPerBlock": "521"
    },
    {
        "month": "10",
        "day": "3",
        "year": "2014",
        "price": "363.75",
        "totalCirculation": "13341850",
        "totalTransactionFees": "11.69504803",
        "numberOfUniqueBitcoinAddressesUsed": "150641",
        "totalOutputVolumeValue": "646978.0055",
        "averageNumberOfTransactionsPerBlock": "613"
    },
    {
        "month": "10",
        "day": "4",
        "year": "2014",
        "price": "336",
        "totalCirculation": "13345425",
        "totalTransactionFees": "13.09999729",
        "numberOfUniqueBitcoinAddressesUsed": "137659",
        "totalOutputVolumeValue": "701363.3878",
        "averageNumberOfTransactionsPerBlock": "555"
    },
    {
        "month": "10",
        "day": "5",
        "year": "2014",
        "price": "293.67",
        "totalCirculation": "13349875",
        "totalTransactionFees": "11.43225211",
        "numberOfUniqueBitcoinAddressesUsed": "207383",
        "totalOutputVolumeValue": "832748.7001",
        "averageNumberOfTransactionsPerBlock": "533"
    },
    {
        "month": "10",
        "day": "6",
        "year": "2014",
        "price": "331.2",
        "totalCirculation": "13353875",
        "totalTransactionFees": "12.29635546",
        "numberOfUniqueBitcoinAddressesUsed": "151236",
        "totalOutputVolumeValue": "1220734.779",
        "averageNumberOfTransactionsPerBlock": "459"
    },
    {
        "month": "10",
        "day": "7",
        "year": "2014",
        "price": "330.7",
        "totalCirculation": "13357650",
        "totalTransactionFees": "13.26892581",
        "numberOfUniqueBitcoinAddressesUsed": "178444",
        "totalOutputVolumeValue": "877334.1147",
        "averageNumberOfTransactionsPerBlock": "432"
    },
    {
        "month": "10",
        "day": "8",
        "year": "2014",
        "price": "346.26",
        "totalCirculation": "13360925",
        "totalTransactionFees": "13.07728331",
        "numberOfUniqueBitcoinAddressesUsed": "165335",
        "totalOutputVolumeValue": "767509.0555",
        "averageNumberOfTransactionsPerBlock": "492"
    },
    {
        "month": "10",
        "day": "9",
        "year": "2014",
        "price": "378.94",
        "totalCirculation": "13364475",
        "totalTransactionFees": "13.35198908",
        "numberOfUniqueBitcoinAddressesUsed": "156106",
        "totalOutputVolumeValue": "1095727.483",
        "averageNumberOfTransactionsPerBlock": "582"
    },
    {
        "month": "10",
        "day": "10",
        "year": "2014",
        "price": "358.97",
        "totalCirculation": "13368450",
        "totalTransactionFees": "13.41027929",
        "numberOfUniqueBitcoinAddressesUsed": "164414",
        "totalOutputVolumeValue": "919976.9903",
        "averageNumberOfTransactionsPerBlock": "524"
    },
    {
        "month": "10",
        "day": "11",
        "year": "2014",
        "price": "359.99",
        "totalCirculation": "13372025",
        "totalTransactionFees": "10.51275487",
        "numberOfUniqueBitcoinAddressesUsed": "152027",
        "totalOutputVolumeValue": "700669.8075",
        "averageNumberOfTransactionsPerBlock": "493"
    },
    {
        "month": "10",
        "day": "12",
        "year": "2014",
        "price": "364.83",
        "totalCirculation": "13375725",
        "totalTransactionFees": "11.06974068",
        "numberOfUniqueBitcoinAddressesUsed": "206084",
        "totalOutputVolumeValue": "462113.0089",
        "averageNumberOfTransactionsPerBlock": "536"
    },
    {
        "month": "10",
        "day": "13",
        "year": "2014",
        "price": "381.46",
        "totalCirculation": "13379550",
        "totalTransactionFees": "12.83998343",
        "numberOfUniqueBitcoinAddressesUsed": "181872",
        "totalOutputVolumeValue": "763961.0632",
        "averageNumberOfTransactionsPerBlock": "411"
    },
    {
        "month": "10",
        "day": "14",
        "year": "2014",
        "price": "411.89",
        "totalCirculation": "13383050",
        "totalTransactionFees": "13.09047261",
        "numberOfUniqueBitcoinAddressesUsed": "174859",
        "totalOutputVolumeValue": "901154.5788",
        "averageNumberOfTransactionsPerBlock": "467"
    },
    {
        "month": "10",
        "day": "15",
        "year": "2014",
        "price": "394",
        "totalCirculation": "13386725",
        "totalTransactionFees": "12.64154509",
        "numberOfUniqueBitcoinAddressesUsed": "175952",
        "totalOutputVolumeValue": "1182079.054",
        "averageNumberOfTransactionsPerBlock": "568"
    },
    {
        "month": "10",
        "day": "16",
        "year": "2014",
        "price": "378.02",
        "totalCirculation": "13390475",
        "totalTransactionFees": "12.18979168",
        "numberOfUniqueBitcoinAddressesUsed": "163270",
        "totalOutputVolumeValue": "1054418.564",
        "averageNumberOfTransactionsPerBlock": "581"
    },
    {
        "month": "10",
        "day": "17",
        "year": "2014",
        "price": "382.83",
        "totalCirculation": "13393825",
        "totalTransactionFees": "11.63600658",
        "numberOfUniqueBitcoinAddressesUsed": "157782",
        "totalOutputVolumeValue": "941743.9903",
        "averageNumberOfTransactionsPerBlock": "465"
    },
    {
        "month": "10",
        "day": "18",
        "year": "2014",
        "price": "389.68",
        "totalCirculation": "13398050",
        "totalTransactionFees": "11.15788265",
        "numberOfUniqueBitcoinAddressesUsed": "156631",
        "totalOutputVolumeValue": "623439.8269",
        "averageNumberOfTransactionsPerBlock": "553"
    },
    {
        "month": "10",
        "day": "19",
        "year": "2014",
        "price": "388.99",
        "totalCirculation": "13401400",
        "totalTransactionFees": "10.3090553",
        "numberOfUniqueBitcoinAddressesUsed": "211493",
        "totalOutputVolumeValue": "469915.1968",
        "averageNumberOfTransactionsPerBlock": "500"
    },
    {
        "month": "10",
        "day": "20",
        "year": "2014",
        "price": "384.95",
        "totalCirculation": "13404850",
        "totalTransactionFees": "12.24408182",
        "numberOfUniqueBitcoinAddressesUsed": "155800",
        "totalOutputVolumeValue": "779840.4409",
        "averageNumberOfTransactionsPerBlock": "483"
    },
    {
        "month": "10",
        "day": "21",
        "year": "2014",
        "price": "387",
        "totalCirculation": "13408350",
        "totalTransactionFees": "12.99216076",
        "numberOfUniqueBitcoinAddressesUsed": "175051",
        "totalOutputVolumeValue": "597224.0938",
        "averageNumberOfTransactionsPerBlock": "542"
    },
    {
        "month": "10",
        "day": "22",
        "year": "2014",
        "price": "385.1",
        "totalCirculation": "13412625",
        "totalTransactionFees": "12.4960203",
        "numberOfUniqueBitcoinAddressesUsed": "171845",
        "totalOutputVolumeValue": "856126.742",
        "averageNumberOfTransactionsPerBlock": "537"
    },
    {
        "month": "10",
        "day": "23",
        "year": "2014",
        "price": "363.99",
        "totalCirculation": "13416200",
        "totalTransactionFees": "12.58522357",
        "numberOfUniqueBitcoinAddressesUsed": "163026",
        "totalOutputVolumeValue": "1056703.001",
        "averageNumberOfTransactionsPerBlock": "590"
    },
    {
        "month": "10",
        "day": "24",
        "year": "2014",
        "price": "358.46",
        "totalCirculation": "13420275",
        "totalTransactionFees": "13.03797728",
        "numberOfUniqueBitcoinAddressesUsed": "165243",
        "totalOutputVolumeValue": "729895.5124",
        "averageNumberOfTransactionsPerBlock": "626"
    },
    {
        "month": "10",
        "day": "25",
        "year": "2014",
        "price": "348.89",
        "totalCirculation": "13424075",
        "totalTransactionFees": "11.56370092",
        "numberOfUniqueBitcoinAddressesUsed": "189654",
        "totalOutputVolumeValue": "967324.3819",
        "averageNumberOfTransactionsPerBlock": "539"
    },
    {
        "month": "10",
        "day": "26",
        "year": "2014",
        "price": "355.43",
        "totalCirculation": "13427325",
        "totalTransactionFees": "10.7606396",
        "numberOfUniqueBitcoinAddressesUsed": "183560",
        "totalOutputVolumeValue": "869465.6116",
        "averageNumberOfTransactionsPerBlock": "468"
    },
    {
        "month": "10",
        "day": "27",
        "year": "2014",
        "price": "356.5",
        "totalCirculation": "13431050",
        "totalTransactionFees": "12.80693278",
        "numberOfUniqueBitcoinAddressesUsed": "181920",
        "totalOutputVolumeValue": "1047668.332",
        "averageNumberOfTransactionsPerBlock": "465"
    },
    {
        "month": "10",
        "day": "28",
        "year": "2014",
        "price": "354.94",
        "totalCirculation": "13434800",
        "totalTransactionFees": "13.72107912",
        "numberOfUniqueBitcoinAddressesUsed": "177816",
        "totalOutputVolumeValue": "831304.7652",
        "averageNumberOfTransactionsPerBlock": "462"
    },
    {
        "month": "10",
        "day": "29",
        "year": "2014",
        "price": "343.53",
        "totalCirculation": "13438400",
        "totalTransactionFees": "13.55763444",
        "numberOfUniqueBitcoinAddressesUsed": "175287",
        "totalOutputVolumeValue": "785066.4008",
        "averageNumberOfTransactionsPerBlock": "545"
    },
    {
        "month": "10",
        "day": "30",
        "year": "2014",
        "price": "337",
        "totalCirculation": "13442725",
        "totalTransactionFees": "14.37016784",
        "numberOfUniqueBitcoinAddressesUsed": "175625",
        "totalOutputVolumeValue": "713144.3449",
        "averageNumberOfTransactionsPerBlock": "551"
    },
    {
        "month": "10",
        "day": "31",
        "year": "2014",
        "price": "340.95",
        "totalCirculation": "13447425",
        "totalTransactionFees": "13.21155884",
        "numberOfUniqueBitcoinAddressesUsed": "174925",
        "totalOutputVolumeValue": "1213778.66",
        "averageNumberOfTransactionsPerBlock": "557"
    },
    {
        "month": "11",
        "day": "1",
        "year": "2014",
        "price": "327.39",
        "totalCirculation": "13451425",
        "totalTransactionFees": "13.16989149",
        "numberOfUniqueBitcoinAddressesUsed": "146848",
        "totalOutputVolumeValue": "827309.2892",
        "averageNumberOfTransactionsPerBlock": "623"
    },
    {
        "month": "11",
        "day": "2",
        "year": "2014",
        "price": "326.41",
        "totalCirculation": "13455525",
        "totalTransactionFees": "12.40614973",
        "numberOfUniqueBitcoinAddressesUsed": "236884",
        "totalOutputVolumeValue": "559357.2712",
        "averageNumberOfTransactionsPerBlock": "621"
    },
    {
        "month": "11",
        "day": "3",
        "year": "2014",
        "price": "325.81",
        "totalCirculation": "13459400",
        "totalTransactionFees": "12.83380219",
        "numberOfUniqueBitcoinAddressesUsed": "157911",
        "totalOutputVolumeValue": "1042661.312",
        "averageNumberOfTransactionsPerBlock": "486"
    },
    {
        "month": "11",
        "day": "4",
        "year": "2014",
        "price": "328.72",
        "totalCirculation": "13463500",
        "totalTransactionFees": "16.9453104",
        "numberOfUniqueBitcoinAddressesUsed": "184888",
        "totalOutputVolumeValue": "923157.2126",
        "averageNumberOfTransactionsPerBlock": "519"
    },
    {
        "month": "11",
        "day": "5",
        "year": "2014",
        "price": "341.99",
        "totalCirculation": "13467500",
        "totalTransactionFees": "13.4448337",
        "numberOfUniqueBitcoinAddressesUsed": "171401",
        "totalOutputVolumeValue": "1152156.045",
        "averageNumberOfTransactionsPerBlock": "536"
    },
    {
        "month": "11",
        "day": "6",
        "year": "2014",
        "price": "347.96",
        "totalCirculation": "13471125",
        "totalTransactionFees": "13.61566812",
        "numberOfUniqueBitcoinAddressesUsed": "173515",
        "totalOutputVolumeValue": "748729.8643",
        "averageNumberOfTransactionsPerBlock": "619"
    },
    {
        "month": "11",
        "day": "7",
        "year": "2014",
        "price": "342.26",
        "totalCirculation": "13474725",
        "totalTransactionFees": "14.19042877",
        "numberOfUniqueBitcoinAddressesUsed": "163094",
        "totalOutputVolumeValue": "878920.5941",
        "averageNumberOfTransactionsPerBlock": "650"
    },
    {
        "month": "11",
        "day": "8",
        "year": "2014",
        "price": "345.84",
        "totalCirculation": "13478625",
        "totalTransactionFees": "11.42289968",
        "numberOfUniqueBitcoinAddressesUsed": "144394",
        "totalOutputVolumeValue": "610662.4295",
        "averageNumberOfTransactionsPerBlock": "685"
    },
    {
        "month": "11",
        "day": "9",
        "year": "2014",
        "price": "356.34",
        "totalCirculation": "13482100",
        "totalTransactionFees": "15.08499306",
        "numberOfUniqueBitcoinAddressesUsed": "223383",
        "totalOutputVolumeValue": "527379.8869",
        "averageNumberOfTransactionsPerBlock": "607"
    },
    {
        "month": "11",
        "day": "10",
        "year": "2014",
        "price": "375.87",
        "totalCirculation": "13486050",
        "totalTransactionFees": "12.86996556",
        "numberOfUniqueBitcoinAddressesUsed": "176533",
        "totalOutputVolumeValue": "892187.1142",
        "averageNumberOfTransactionsPerBlock": "498"
    },
    {
        "month": "11",
        "day": "11",
        "year": "2014",
        "price": "365.04",
        "totalCirculation": "13489575",
        "totalTransactionFees": "13.37547938",
        "numberOfUniqueBitcoinAddressesUsed": "168913",
        "totalOutputVolumeValue": "696341.6986",
        "averageNumberOfTransactionsPerBlock": "505"
    },
    {
        "month": "11",
        "day": "12",
        "year": "2014",
        "price": "430.07",
        "totalCirculation": "13492950",
        "totalTransactionFees": "13.57996146",
        "numberOfUniqueBitcoinAddressesUsed": "179505",
        "totalOutputVolumeValue": "987906.6216",
        "averageNumberOfTransactionsPerBlock": "560"
    },
    {
        "month": "11",
        "day": "13",
        "year": "2014",
        "price": "406.56",
        "totalCirculation": "13496600",
        "totalTransactionFees": "15.77819904",
        "numberOfUniqueBitcoinAddressesUsed": "197029",
        "totalOutputVolumeValue": "1238485.92",
        "averageNumberOfTransactionsPerBlock": "583"
    },
    {
        "month": "11",
        "day": "14",
        "year": "2014",
        "price": "396.56",
        "totalCirculation": "13500250",
        "totalTransactionFees": "13.66636534",
        "numberOfUniqueBitcoinAddressesUsed": "200490",
        "totalOutputVolumeValue": "1507331.412",
        "averageNumberOfTransactionsPerBlock": "637"
    },
    {
        "month": "11",
        "day": "15",
        "year": "2014",
        "price": "373.14",
        "totalCirculation": "13504000",
        "totalTransactionFees": "11.49113334",
        "numberOfUniqueBitcoinAddressesUsed": "156976",
        "totalOutputVolumeValue": "818788.5823",
        "averageNumberOfTransactionsPerBlock": "624"
    },
    {
        "month": "11",
        "day": "16",
        "year": "2014",
        "price": "383.65",
        "totalCirculation": "13507625",
        "totalTransactionFees": "11.2481313",
        "numberOfUniqueBitcoinAddressesUsed": "220218",
        "totalOutputVolumeValue": "696352.429",
        "averageNumberOfTransactionsPerBlock": "698"
    },
    {
        "month": "11",
        "day": "17",
        "year": "2014",
        "price": "378.48",
        "totalCirculation": "13511425",
        "totalTransactionFees": "14.59071691",
        "numberOfUniqueBitcoinAddressesUsed": "171933",
        "totalOutputVolumeValue": "810899.0753",
        "averageNumberOfTransactionsPerBlock": "492"
    },
    {
        "month": "11",
        "day": "18",
        "year": "2014",
        "price": "379.91",
        "totalCirculation": "13515175",
        "totalTransactionFees": "13.12671076",
        "numberOfUniqueBitcoinAddressesUsed": "176768",
        "totalOutputVolumeValue": "1003526.484",
        "averageNumberOfTransactionsPerBlock": "532"
    },
    {
        "month": "11",
        "day": "19",
        "year": "2014",
        "price": "374.77",
        "totalCirculation": "13518600",
        "totalTransactionFees": "13.42190503",
        "numberOfUniqueBitcoinAddressesUsed": "175445",
        "totalOutputVolumeValue": "932714.6384",
        "averageNumberOfTransactionsPerBlock": "540"
    },
    {
        "month": "11",
        "day": "20",
        "year": "2014",
        "price": "361.7",
        "totalCirculation": "13522025",
        "totalTransactionFees": "12.9020255",
        "numberOfUniqueBitcoinAddressesUsed": "177646",
        "totalOutputVolumeValue": "1049769.09",
        "averageNumberOfTransactionsPerBlock": "646"
    },
    {
        "month": "11",
        "day": "21",
        "year": "2014",
        "price": "356.9",
        "totalCirculation": "13525125",
        "totalTransactionFees": "13.09970976",
        "numberOfUniqueBitcoinAddressesUsed": "174282",
        "totalOutputVolumeValue": "1154314.516",
        "averageNumberOfTransactionsPerBlock": "629"
    },
    {
        "month": "11",
        "day": "22",
        "year": "2014",
        "price": "359.8",
        "totalCirculation": "13529075",
        "totalTransactionFees": "11.58254175",
        "numberOfUniqueBitcoinAddressesUsed": "166491",
        "totalOutputVolumeValue": "1010860.917",
        "averageNumberOfTransactionsPerBlock": "633"
    },
    {
        "month": "11",
        "day": "23",
        "year": "2014",
        "price": "362.99",
        "totalCirculation": "13532600",
        "totalTransactionFees": "11.46468237",
        "numberOfUniqueBitcoinAddressesUsed": "224922",
        "totalOutputVolumeValue": "630481.049",
        "averageNumberOfTransactionsPerBlock": "554"
    },
    {
        "month": "11",
        "day": "24",
        "year": "2014",
        "price": "384",
        "totalCirculation": "13536475",
        "totalTransactionFees": "12.49930625",
        "numberOfUniqueBitcoinAddressesUsed": "163316",
        "totalOutputVolumeValue": "684551.8473",
        "averageNumberOfTransactionsPerBlock": "539"
    },
    {
        "month": "11",
        "day": "25",
        "year": "2014",
        "price": "381.03",
        "totalCirculation": "13539675",
        "totalTransactionFees": "12.20971239",
        "numberOfUniqueBitcoinAddressesUsed": "169442",
        "totalOutputVolumeValue": "971907.5627",
        "averageNumberOfTransactionsPerBlock": "518"
    },
    {
        "month": "11",
        "day": "26",
        "year": "2014",
        "price": "371.44",
        "totalCirculation": "13543250",
        "totalTransactionFees": "13.02889699",
        "numberOfUniqueBitcoinAddressesUsed": "180983",
        "totalOutputVolumeValue": "1104521.734",
        "averageNumberOfTransactionsPerBlock": "665"
    },
    {
        "month": "11",
        "day": "27",
        "year": "2014",
        "price": "372.62",
        "totalCirculation": "13546525",
        "totalTransactionFees": "11.78619228",
        "numberOfUniqueBitcoinAddressesUsed": "178381",
        "totalOutputVolumeValue": "1029359.486",
        "averageNumberOfTransactionsPerBlock": "709"
    },
    {
        "month": "11",
        "day": "28",
        "year": "2014",
        "price": "376.12",
        "totalCirculation": "13550400",
        "totalTransactionFees": "11.65678584",
        "numberOfUniqueBitcoinAddressesUsed": "175185",
        "totalOutputVolumeValue": "1213410.976",
        "averageNumberOfTransactionsPerBlock": "804"
    },
    {
        "month": "11",
        "day": "29",
        "year": "2014",
        "price": "377.22",
        "totalCirculation": "13554175",
        "totalTransactionFees": "11.54299905",
        "numberOfUniqueBitcoinAddressesUsed": "166646",
        "totalOutputVolumeValue": "1033732.094",
        "averageNumberOfTransactionsPerBlock": "681"
    },
    {
        "month": "11",
        "day": "30",
        "year": "2014",
        "price": "375.96",
        "totalCirculation": "13558075",
        "totalTransactionFees": "11.696469",
        "numberOfUniqueBitcoinAddressesUsed": "245004",
        "totalOutputVolumeValue": "990440.1206",
        "averageNumberOfTransactionsPerBlock": "619"
    },
    {
        "month": "12",
        "day": "1",
        "year": "2014",
        "price": "381.72",
        "totalCirculation": "13561650",
        "totalTransactionFees": "14.00206215",
        "numberOfUniqueBitcoinAddressesUsed": "174232",
        "totalOutputVolumeValue": "1309082.45",
        "averageNumberOfTransactionsPerBlock": "576"
    },
    {
        "month": "12",
        "day": "2",
        "year": "2014",
        "price": "381.93",
        "totalCirculation": "13565200",
        "totalTransactionFees": "14.21393491",
        "numberOfUniqueBitcoinAddressesUsed": "205483",
        "totalOutputVolumeValue": "1337249.838",
        "averageNumberOfTransactionsPerBlock": "634"
    },
    {
        "month": "12",
        "day": "3",
        "year": "2014",
        "price": "378.25",
        "totalCirculation": "13568225",
        "totalTransactionFees": "13.58502718",
        "numberOfUniqueBitcoinAddressesUsed": "199881",
        "totalOutputVolumeValue": "1219368.151",
        "averageNumberOfTransactionsPerBlock": "563"
    },
    {
        "month": "12",
        "day": "4",
        "year": "2014",
        "price": "371.67",
        "totalCirculation": "13571925",
        "totalTransactionFees": "14.05123147",
        "numberOfUniqueBitcoinAddressesUsed": "186491",
        "totalOutputVolumeValue": "993707.5456",
        "averageNumberOfTransactionsPerBlock": "644"
    },
    {
        "month": "12",
        "day": "5",
        "year": "2014",
        "price": "373.98",
        "totalCirculation": "13575675",
        "totalTransactionFees": "13.71698344",
        "numberOfUniqueBitcoinAddressesUsed": "194141",
        "totalOutputVolumeValue": "1282269.548",
        "averageNumberOfTransactionsPerBlock": "553"
    },
    {
        "month": "12",
        "day": "6",
        "year": "2014",
        "price": "374.05",
        "totalCirculation": "13579300",
        "totalTransactionFees": "11.67542429",
        "numberOfUniqueBitcoinAddressesUsed": "173360",
        "totalOutputVolumeValue": "680509.6613",
        "averageNumberOfTransactionsPerBlock": "591"
    },
    {
        "month": "12",
        "day": "7",
        "year": "2014",
        "price": "375.73",
        "totalCirculation": "13582350",
        "totalTransactionFees": "10.89598656",
        "numberOfUniqueBitcoinAddressesUsed": "232300",
        "totalOutputVolumeValue": "804717.078",
        "averageNumberOfTransactionsPerBlock": "564"
    },
    {
        "month": "12",
        "day": "8",
        "year": "2014",
        "price": "367.01",
        "totalCirculation": "13586100",
        "totalTransactionFees": "12.62220787",
        "numberOfUniqueBitcoinAddressesUsed": "183776",
        "totalOutputVolumeValue": "1393038.481",
        "averageNumberOfTransactionsPerBlock": "556"
    },
    {
        "month": "12",
        "day": "9",
        "year": "2014",
        "price": "350.29",
        "totalCirculation": "13589575",
        "totalTransactionFees": "14.93934077",
        "numberOfUniqueBitcoinAddressesUsed": "191539",
        "totalOutputVolumeValue": "1356402.3",
        "averageNumberOfTransactionsPerBlock": "560"
    },
    {
        "month": "12",
        "day": "10",
        "year": "2014",
        "price": "350.97",
        "totalCirculation": "13593675",
        "totalTransactionFees": "12.66263071",
        "numberOfUniqueBitcoinAddressesUsed": "190602",
        "totalOutputVolumeValue": "1349030.263",
        "averageNumberOfTransactionsPerBlock": "625"
    },
    {
        "month": "12",
        "day": "11",
        "year": "2014",
        "price": "356.1",
        "totalCirculation": "13597300",
        "totalTransactionFees": "12.19265382",
        "numberOfUniqueBitcoinAddressesUsed": "187113",
        "totalOutputVolumeValue": "826047.1887",
        "averageNumberOfTransactionsPerBlock": "742"
    },
    {
        "month": "12",
        "day": "12",
        "year": "2014",
        "price": "355.08",
        "totalCirculation": "13600850",
        "totalTransactionFees": "11.48717516",
        "numberOfUniqueBitcoinAddressesUsed": "177462",
        "totalOutputVolumeValue": "748838.7466",
        "averageNumberOfTransactionsPerBlock": "737"
    },
    {
        "month": "12",
        "day": "13",
        "year": "2014",
        "price": "350.31",
        "totalCirculation": "13604425",
        "totalTransactionFees": "10.95838328",
        "numberOfUniqueBitcoinAddressesUsed": "174655",
        "totalOutputVolumeValue": "936868.6789",
        "averageNumberOfTransactionsPerBlock": "742"
    },
    {
        "month": "12",
        "day": "14",
        "year": "2014",
        "price": "353.28",
        "totalCirculation": "13607725",
        "totalTransactionFees": "10.70376498",
        "numberOfUniqueBitcoinAddressesUsed": "231376",
        "totalOutputVolumeValue": "602573.1564",
        "averageNumberOfTransactionsPerBlock": "742"
    },
    {
        "month": "12",
        "day": "15",
        "year": "2014",
        "price": "352.15",
        "totalCirculation": "13611550",
        "totalTransactionFees": "14.79932134",
        "numberOfUniqueBitcoinAddressesUsed": "215842",
        "totalOutputVolumeValue": "838145.7245",
        "averageNumberOfTransactionsPerBlock": "648"
    },
    {
        "month": "12",
        "day": "16",
        "year": "2014",
        "price": "336.73",
        "totalCirculation": "13614875",
        "totalTransactionFees": "14.58563393",
        "numberOfUniqueBitcoinAddressesUsed": "204914",
        "totalOutputVolumeValue": "987898.2975",
        "averageNumberOfTransactionsPerBlock": "557"
    },
    {
        "month": "12",
        "day": "17",
        "year": "2014",
        "price": "318.2",
        "totalCirculation": "13618050",
        "totalTransactionFees": "13.840813",
        "numberOfUniqueBitcoinAddressesUsed": "203993",
        "totalOutputVolumeValue": "1013157.429",
        "averageNumberOfTransactionsPerBlock": "693"
    },
    {
        "month": "12",
        "day": "18",
        "year": "2014",
        "price": "317.7",
        "totalCirculation": "13621525",
        "totalTransactionFees": "15.70384421",
        "numberOfUniqueBitcoinAddressesUsed": "225354",
        "totalOutputVolumeValue": "1297165.975",
        "averageNumberOfTransactionsPerBlock": "615"
    },
    {
        "month": "12",
        "day": "19",
        "year": "2014",
        "price": "317.63",
        "totalCirculation": "13624625",
        "totalTransactionFees": "14.30375502",
        "numberOfUniqueBitcoinAddressesUsed": "160502",
        "totalOutputVolumeValue": "883379.8209",
        "averageNumberOfTransactionsPerBlock": "592"
    },
    {
        "month": "12",
        "day": "20",
        "year": "2014",
        "price": "325.7",
        "totalCirculation": "13628150",
        "totalTransactionFees": "12.89936506",
        "numberOfUniqueBitcoinAddressesUsed": "240775",
        "totalOutputVolumeValue": "755847.5988",
        "averageNumberOfTransactionsPerBlock": "418"
    },
    {
        "month": "12",
        "day": "21",
        "year": "2014",
        "price": "326.93",
        "totalCirculation": "13631775",
        "totalTransactionFees": "11.33814908",
        "numberOfUniqueBitcoinAddressesUsed": "204217",
        "totalOutputVolumeValue": "597130.4303",
        "averageNumberOfTransactionsPerBlock": "497"
    },
    {
        "month": "12",
        "day": "22",
        "year": "2014",
        "price": "332.53",
        "totalCirculation": "13635000",
        "totalTransactionFees": "13.1266531",
        "numberOfUniqueBitcoinAddressesUsed": "195624",
        "totalOutputVolumeValue": "1311029.418",
        "averageNumberOfTransactionsPerBlock": "492"
    },
    {
        "month": "12",
        "day": "23",
        "year": "2014",
        "price": "336.96",
        "totalCirculation": "13639050",
        "totalTransactionFees": "14.11126208",
        "numberOfUniqueBitcoinAddressesUsed": "210726",
        "totalOutputVolumeValue": "1095934.414",
        "averageNumberOfTransactionsPerBlock": "447"
    },
    {
        "month": "12",
        "day": "24",
        "year": "2014",
        "price": "327.59",
        "totalCirculation": "13642825",
        "totalTransactionFees": "12.39728577",
        "numberOfUniqueBitcoinAddressesUsed": "174711",
        "totalOutputVolumeValue": "1028991.521",
        "averageNumberOfTransactionsPerBlock": "472"
    },
    {
        "month": "12",
        "day": "25",
        "year": "2014",
        "price": "319.31",
        "totalCirculation": "13647050",
        "totalTransactionFees": "9.64807936",
        "numberOfUniqueBitcoinAddressesUsed": "147374",
        "totalOutputVolumeValue": "901768.4701",
        "averageNumberOfTransactionsPerBlock": "583"
    },
    {
        "month": "12",
        "day": "26",
        "year": "2014",
        "price": "328.09",
        "totalCirculation": "13650650",
        "totalTransactionFees": "16.42976058",
        "numberOfUniqueBitcoinAddressesUsed": "145412",
        "totalOutputVolumeValue": "635722.5598",
        "averageNumberOfTransactionsPerBlock": "540"
    },
    {
        "month": "12",
        "day": "27",
        "year": "2014",
        "price": "314.45",
        "totalCirculation": "13654650",
        "totalTransactionFees": "19.41831457",
        "numberOfUniqueBitcoinAddressesUsed": "188604",
        "totalOutputVolumeValue": "711498.4051",
        "averageNumberOfTransactionsPerBlock": "355"
    },
    {
        "month": "12",
        "day": "28",
        "year": "2014",
        "price": "317.5",
        "totalCirculation": "13658825",
        "totalTransactionFees": "12.04266588",
        "numberOfUniqueBitcoinAddressesUsed": "236392",
        "totalOutputVolumeValue": "698406.146",
        "averageNumberOfTransactionsPerBlock": "451"
    },
    {
        "month": "12",
        "day": "29",
        "year": "2014",
        "price": "314.49",
        "totalCirculation": "13663050",
        "totalTransactionFees": "14.06563348",
        "numberOfUniqueBitcoinAddressesUsed": "159314",
        "totalOutputVolumeValue": "693097.2734",
        "averageNumberOfTransactionsPerBlock": "505"
    },
    {
        "month": "12",
        "day": "30",
        "year": "2014",
        "price": "313.09",
        "totalCirculation": "13666700",
        "totalTransactionFees": "13.95085145",
        "numberOfUniqueBitcoinAddressesUsed": "181005",
        "totalOutputVolumeValue": "1118283.639",
        "averageNumberOfTransactionsPerBlock": "515"
    },
    {
        "month": "12",
        "day": "31",
        "year": "2014",
        "price": "317.4",
        "totalCirculation": "13670575",
        "totalTransactionFees": "12.44896755",
        "numberOfUniqueBitcoinAddressesUsed": "157377",
        "totalOutputVolumeValue": "989198.004",
        "averageNumberOfTransactionsPerBlock": "558"
    },
    {
        "month": "1",
        "day": "1",
        "year": "2015",
        "price": "315.7",
        "totalCirculation": "13674725",
        "totalTransactionFees": "8.00307587",
        "numberOfUniqueBitcoinAddressesUsed": "116012",
        "totalOutputVolumeValue": "489722.0732",
        "averageNumberOfTransactionsPerBlock": "555"
    },
    {
        "month": "1",
        "day": "2",
        "year": "2015",
        "price": "316.15",
        "totalCirculation": "13678725",
        "totalTransactionFees": "10.72769484",
        "numberOfUniqueBitcoinAddressesUsed": "168563",
        "totalOutputVolumeValue": "695649.9484",
        "averageNumberOfTransactionsPerBlock": "627"
    },
    {
        "month": "1",
        "day": "3",
        "year": "2015",
        "price": "302.33",
        "totalCirculation": "13682825",
        "totalTransactionFees": "11.90608788",
        "numberOfUniqueBitcoinAddressesUsed": "207571",
        "totalOutputVolumeValue": "774531.6795",
        "averageNumberOfTransactionsPerBlock": "734"
    },
    {
        "month": "1",
        "day": "4",
        "year": "2015",
        "price": "270.93",
        "totalCirculation": "13686975",
        "totalTransactionFees": "20.28810703",
        "numberOfUniqueBitcoinAddressesUsed": "206228",
        "totalOutputVolumeValue": "1193920.561",
        "averageNumberOfTransactionsPerBlock": "692"
    },
    {
        "month": "1",
        "day": "5",
        "year": "2015",
        "price": "276.8",
        "totalCirculation": "13691175",
        "totalTransactionFees": "16.96708357",
        "numberOfUniqueBitcoinAddressesUsed": "193982",
        "totalOutputVolumeValue": "1083677.283",
        "averageNumberOfTransactionsPerBlock": "751"
    },
    {
        "month": "1",
        "day": "6",
        "year": "2015",
        "price": "276.8",
        "totalCirculation": "13695100",
        "totalTransactionFees": "12.85666757",
        "numberOfUniqueBitcoinAddressesUsed": "179154",
        "totalOutputVolumeValue": "1113410.373",
        "averageNumberOfTransactionsPerBlock": "639"
    },
    {
        "month": "1",
        "day": "7",
        "year": "2015",
        "price": "276.8",
        "totalCirculation": "13698800",
        "totalTransactionFees": "13.40521434",
        "numberOfUniqueBitcoinAddressesUsed": "180992",
        "totalOutputVolumeValue": "1286463.671",
        "averageNumberOfTransactionsPerBlock": "598"
    },
    {
        "month": "1",
        "day": "8",
        "year": "2015",
        "price": "276.8",
        "totalCirculation": "13702175",
        "totalTransactionFees": "14.45388694",
        "numberOfUniqueBitcoinAddressesUsed": "186319",
        "totalOutputVolumeValue": "1220111.037",
        "averageNumberOfTransactionsPerBlock": "943"
    },
    {
        "month": "1",
        "day": "9",
        "year": "2015",
        "price": "276.8",
        "totalCirculation": "13705975",
        "totalTransactionFees": "16.14480781",
        "numberOfUniqueBitcoinAddressesUsed": "201458",
        "totalOutputVolumeValue": "1272129.628",
        "averageNumberOfTransactionsPerBlock": "691"
    },
    {
        "month": "1",
        "day": "10",
        "year": "2015",
        "price": "278",
        "totalCirculation": "13709500",
        "totalTransactionFees": "15.44061914",
        "numberOfUniqueBitcoinAddressesUsed": "251092",
        "totalOutputVolumeValue": "1161365.529",
        "averageNumberOfTransactionsPerBlock": "833"
    },
    {
        "month": "1",
        "day": "11",
        "year": "2015",
        "price": "272.25",
        "totalCirculation": "13713175",
        "totalTransactionFees": "14.29837347",
        "numberOfUniqueBitcoinAddressesUsed": "209755",
        "totalOutputVolumeValue": "1288684.759",
        "averageNumberOfTransactionsPerBlock": "755"
    },
    {
        "month": "1",
        "day": "12",
        "year": "2015",
        "price": "270",
        "totalCirculation": "13717275",
        "totalTransactionFees": "32.63994364",
        "numberOfUniqueBitcoinAddressesUsed": "185802",
        "totalOutputVolumeValue": "1006862.227",
        "averageNumberOfTransactionsPerBlock": "655"
    },
    {
        "month": "1",
        "day": "13",
        "year": "2015",
        "price": "230.89",
        "totalCirculation": "13719900",
        "totalTransactionFees": "14.44909631",
        "numberOfUniqueBitcoinAddressesUsed": "199744",
        "totalOutputVolumeValue": "1638176.188",
        "averageNumberOfTransactionsPerBlock": "584"
    },
    {
        "month": "1",
        "day": "14",
        "year": "2015",
        "price": "176.5",
        "totalCirculation": "13723675",
        "totalTransactionFees": "15.87551555",
        "numberOfUniqueBitcoinAddressesUsed": "228898",
        "totalOutputVolumeValue": "2363588.937",
        "averageNumberOfTransactionsPerBlock": "607"
    },
    {
        "month": "1",
        "day": "15",
        "year": "2015",
        "price": "218.11",
        "totalCirculation": "13727150",
        "totalTransactionFees": "16.54900624",
        "numberOfUniqueBitcoinAddressesUsed": "212403",
        "totalOutputVolumeValue": "2644489.468",
        "averageNumberOfTransactionsPerBlock": "824"
    },
    {
        "month": "1",
        "day": "16",
        "year": "2015",
        "price": "205.35",
        "totalCirculation": "13730875",
        "totalTransactionFees": "15.88562435",
        "numberOfUniqueBitcoinAddressesUsed": "219873",
        "totalOutputVolumeValue": "1973818.741",
        "averageNumberOfTransactionsPerBlock": "731"
    },
    {
        "month": "1",
        "day": "17",
        "year": "2015",
        "price": "197.12",
        "totalCirculation": "13734300",
        "totalTransactionFees": "12.64597155",
        "numberOfUniqueBitcoinAddressesUsed": "254267",
        "totalOutputVolumeValue": "1295133.394",
        "averageNumberOfTransactionsPerBlock": "633"
    },
    {
        "month": "1",
        "day": "18",
        "year": "2015",
        "price": "211.18",
        "totalCirculation": "13738025",
        "totalTransactionFees": "12.75025624",
        "numberOfUniqueBitcoinAddressesUsed": "223392",
        "totalOutputVolumeValue": "987549.5258",
        "averageNumberOfTransactionsPerBlock": "703"
    },
    {
        "month": "1",
        "day": "19",
        "year": "2015",
        "price": "212.39",
        "totalCirculation": "13741900",
        "totalTransactionFees": "15.80453034",
        "numberOfUniqueBitcoinAddressesUsed": "197559",
        "totalOutputVolumeValue": "961837.517",
        "averageNumberOfTransactionsPerBlock": "740"
    },
    {
        "month": "1",
        "day": "20",
        "year": "2015",
        "price": "212.99",
        "totalCirculation": "13744900",
        "totalTransactionFees": "14.41535966",
        "numberOfUniqueBitcoinAddressesUsed": "194860",
        "totalOutputVolumeValue": "1340464",
        "averageNumberOfTransactionsPerBlock": "653"
    },
    {
        "month": "1",
        "day": "21",
        "year": "2015",
        "price": "215.2",
        "totalCirculation": "13748325",
        "totalTransactionFees": "13.96816034",
        "numberOfUniqueBitcoinAddressesUsed": "197159",
        "totalOutputVolumeValue": "1331879.333",
        "averageNumberOfTransactionsPerBlock": "830"
    },
    {
        "month": "1",
        "day": "22",
        "year": "2015",
        "price": "233.9",
        "totalCirculation": "13752075",
        "totalTransactionFees": "13.45202348",
        "numberOfUniqueBitcoinAddressesUsed": "188687",
        "totalOutputVolumeValue": "1361930.617",
        "averageNumberOfTransactionsPerBlock": "683"
    },
    {
        "month": "1",
        "day": "23",
        "year": "2015",
        "price": "233.03",
        "totalCirculation": "13755175",
        "totalTransactionFees": "13.16868437",
        "numberOfUniqueBitcoinAddressesUsed": "179966",
        "totalOutputVolumeValue": "1062942.253",
        "averageNumberOfTransactionsPerBlock": "565"
    },
    {
        "month": "1",
        "day": "24",
        "year": "2015",
        "price": "244.64",
        "totalCirculation": "13758200",
        "totalTransactionFees": "12.18056487",
        "numberOfUniqueBitcoinAddressesUsed": "172854",
        "totalOutputVolumeValue": "1201496.78",
        "averageNumberOfTransactionsPerBlock": "520"
    },
    {
        "month": "1",
        "day": "25",
        "year": "2015",
        "price": "247.11",
        "totalCirculation": "13761350",
        "totalTransactionFees": "12.2871243",
        "numberOfUniqueBitcoinAddressesUsed": "256121",
        "totalOutputVolumeValue": "960414.8217",
        "averageNumberOfTransactionsPerBlock": "621"
    },
    {
        "month": "1",
        "day": "26",
        "year": "2015",
        "price": "271.47",
        "totalCirculation": "13764525",
        "totalTransactionFees": "16.3312645",
        "numberOfUniqueBitcoinAddressesUsed": "236920",
        "totalOutputVolumeValue": "1985592.629",
        "averageNumberOfTransactionsPerBlock": "540"
    },
    {
        "month": "1",
        "day": "27",
        "year": "2015",
        "price": "266.03",
        "totalCirculation": "13768150",
        "totalTransactionFees": "13.84178061",
        "numberOfUniqueBitcoinAddressesUsed": "204121",
        "totalOutputVolumeValue": "1238580.794",
        "averageNumberOfTransactionsPerBlock": "465"
    },
    {
        "month": "1",
        "day": "28",
        "year": "2015",
        "price": "249.25",
        "totalCirculation": "13772100",
        "totalTransactionFees": "12.2880246",
        "numberOfUniqueBitcoinAddressesUsed": "165874",
        "totalOutputVolumeValue": "928260.2555",
        "averageNumberOfTransactionsPerBlock": "566"
    },
    {
        "month": "1",
        "day": "29",
        "year": "2015",
        "price": "233.19",
        "totalCirculation": "13776350",
        "totalTransactionFees": "11.80085579",
        "numberOfUniqueBitcoinAddressesUsed": "171619",
        "totalOutputVolumeValue": "960905.2185",
        "averageNumberOfTransactionsPerBlock": "692"
    },
    {
        "month": "1",
        "day": "30",
        "year": "2015",
        "price": "230.11",
        "totalCirculation": "13779825",
        "totalTransactionFees": "11.96990901",
        "numberOfUniqueBitcoinAddressesUsed": "167768",
        "totalOutputVolumeValue": "928813.6772",
        "averageNumberOfTransactionsPerBlock": "554"
    },
    {
        "month": "1",
        "day": "31",
        "year": "2015",
        "price": "229.7",
        "totalCirculation": "13783700",
        "totalTransactionFees": "12.15581794",
        "numberOfUniqueBitcoinAddressesUsed": "239182",
        "totalOutputVolumeValue": "771780.3176",
        "averageNumberOfTransactionsPerBlock": "612"
    },
    {
        "month": "2",
        "day": "1",
        "year": "2015",
        "price": "220.72",
        "totalCirculation": "13787950",
        "totalTransactionFees": "11.00546903",
        "numberOfUniqueBitcoinAddressesUsed": "208727",
        "totalOutputVolumeValue": "825510.1537",
        "averageNumberOfTransactionsPerBlock": "476"
    },
    {
        "month": "2",
        "day": "2",
        "year": "2015",
        "price": "223",
        "totalCirculation": "13791625",
        "totalTransactionFees": "12.12436146",
        "numberOfUniqueBitcoinAddressesUsed": "185554",
        "totalOutputVolumeValue": "934329.6956",
        "averageNumberOfTransactionsPerBlock": "501"
    },
    {
        "month": "2",
        "day": "3",
        "year": "2015",
        "price": "236.51",
        "totalCirculation": "13795000",
        "totalTransactionFees": "13.44597638",
        "numberOfUniqueBitcoinAddressesUsed": "207461",
        "totalOutputVolumeValue": "1169774.191",
        "averageNumberOfTransactionsPerBlock": "646"
    },
    {
        "month": "2",
        "day": "4",
        "year": "2015",
        "price": "222.56",
        "totalCirculation": "13799025",
        "totalTransactionFees": "12.3462302",
        "numberOfUniqueBitcoinAddressesUsed": "198955",
        "totalOutputVolumeValue": "1254353.855",
        "averageNumberOfTransactionsPerBlock": "618"
    },
    {
        "month": "2",
        "day": "5",
        "year": "2015",
        "price": "217.37",
        "totalCirculation": "13802700",
        "totalTransactionFees": "12.51951528",
        "numberOfUniqueBitcoinAddressesUsed": "181629",
        "totalOutputVolumeValue": "1271930.421",
        "averageNumberOfTransactionsPerBlock": "690"
    },
    {
        "month": "2",
        "day": "6",
        "year": "2015",
        "price": "220.47",
        "totalCirculation": "13807075",
        "totalTransactionFees": "11.45022497",
        "numberOfUniqueBitcoinAddressesUsed": "186259",
        "totalOutputVolumeValue": "1017057.813",
        "averageNumberOfTransactionsPerBlock": "658"
    },
    {
        "month": "2",
        "day": "7",
        "year": "2015",
        "price": "225.16",
        "totalCirculation": "13811375",
        "totalTransactionFees": "12.10137628",
        "numberOfUniqueBitcoinAddressesUsed": "180449",
        "totalOutputVolumeValue": "698170.2905",
        "averageNumberOfTransactionsPerBlock": "690"
    },
    {
        "month": "2",
        "day": "8",
        "year": "2015",
        "price": "223.5",
        "totalCirculation": "13814575",
        "totalTransactionFees": "11.45311434",
        "numberOfUniqueBitcoinAddressesUsed": "251391",
        "totalOutputVolumeValue": "640910.2696",
        "averageNumberOfTransactionsPerBlock": "767"
    },
    {
        "month": "2",
        "day": "9",
        "year": "2015",
        "price": "220.39",
        "totalCirculation": "13818450",
        "totalTransactionFees": "13.78402009",
        "numberOfUniqueBitcoinAddressesUsed": "197636",
        "totalOutputVolumeValue": "813074.0175",
        "averageNumberOfTransactionsPerBlock": "664"
    },
    {
        "month": "2",
        "day": "10",
        "year": "2015",
        "price": "220.16",
        "totalCirculation": "13822200",
        "totalTransactionFees": "14.18461123",
        "numberOfUniqueBitcoinAddressesUsed": "189629",
        "totalOutputVolumeValue": "820608.7881",
        "averageNumberOfTransactionsPerBlock": "636"
    },
    {
        "month": "2",
        "day": "11",
        "year": "2015",
        "price": "221.99",
        "totalCirculation": "13825950",
        "totalTransactionFees": "14.66267797",
        "numberOfUniqueBitcoinAddressesUsed": "189188",
        "totalOutputVolumeValue": "868785.5271",
        "averageNumberOfTransactionsPerBlock": "654"
    },
    {
        "month": "2",
        "day": "12",
        "year": "2015",
        "price": "221.83",
        "totalCirculation": "13829350",
        "totalTransactionFees": "13.49018655",
        "numberOfUniqueBitcoinAddressesUsed": "202264",
        "totalOutputVolumeValue": "819424.1746",
        "averageNumberOfTransactionsPerBlock": "638"
    },
    {
        "month": "2",
        "day": "13",
        "year": "2015",
        "price": "239.94",
        "totalCirculation": "13832850",
        "totalTransactionFees": "15.93974552",
        "numberOfUniqueBitcoinAddressesUsed": "256202",
        "totalOutputVolumeValue": "1009747.505",
        "averageNumberOfTransactionsPerBlock": "649"
    },
    {
        "month": "2",
        "day": "14",
        "year": "2015",
        "price": "245.31",
        "totalCirculation": "13836875",
        "totalTransactionFees": "16.67820257",
        "numberOfUniqueBitcoinAddressesUsed": "243646",
        "totalOutputVolumeValue": "743325.9236",
        "averageNumberOfTransactionsPerBlock": "585"
    },
    {
        "month": "2",
        "day": "15",
        "year": "2015",
        "price": "243.99",
        "totalCirculation": "13840225",
        "totalTransactionFees": "13.43496996",
        "numberOfUniqueBitcoinAddressesUsed": "295507",
        "totalOutputVolumeValue": "734014.8402",
        "averageNumberOfTransactionsPerBlock": "582"
    },
    {
        "month": "2",
        "day": "16",
        "year": "2015",
        "price": "235.86",
        "totalCirculation": "13844175",
        "totalTransactionFees": "15.54431223",
        "numberOfUniqueBitcoinAddressesUsed": "223579",
        "totalOutputVolumeValue": "735253.3224",
        "averageNumberOfTransactionsPerBlock": "670"
    },
    {
        "month": "2",
        "day": "17",
        "year": "2015",
        "price": "244",
        "totalCirculation": "13848050",
        "totalTransactionFees": "15.13607471",
        "numberOfUniqueBitcoinAddressesUsed": "226216",
        "totalOutputVolumeValue": "769047.253",
        "averageNumberOfTransactionsPerBlock": "569"
    },
    {
        "month": "2",
        "day": "18",
        "year": "2015",
        "price": "234.87",
        "totalCirculation": "13852075",
        "totalTransactionFees": "15.30417671",
        "numberOfUniqueBitcoinAddressesUsed": "223247",
        "totalOutputVolumeValue": "814178.3678",
        "averageNumberOfTransactionsPerBlock": "707"
    },
    {
        "month": "2",
        "day": "19",
        "year": "2015",
        "price": "241.59",
        "totalCirculation": "13856175",
        "totalTransactionFees": "13.71575584",
        "numberOfUniqueBitcoinAddressesUsed": "181312",
        "totalOutputVolumeValue": "703399.9095",
        "averageNumberOfTransactionsPerBlock": "756"
    },
    {
        "month": "2",
        "day": "20",
        "year": "2015",
        "price": "243.56",
        "totalCirculation": "13860325",
        "totalTransactionFees": "13.92458106",
        "numberOfUniqueBitcoinAddressesUsed": "194679",
        "totalOutputVolumeValue": "723775.8868",
        "averageNumberOfTransactionsPerBlock": "671"
    },
    {
        "month": "2",
        "day": "21",
        "year": "2015",
        "price": "245.66",
        "totalCirculation": "13863775",
        "totalTransactionFees": "14.40873654",
        "numberOfUniqueBitcoinAddressesUsed": "248310",
        "totalOutputVolumeValue": "765685.8418",
        "averageNumberOfTransactionsPerBlock": "703"
    },
    {
        "month": "2",
        "day": "22",
        "year": "2015",
        "price": "236",
        "totalCirculation": "13867550",
        "totalTransactionFees": "12.44675566",
        "numberOfUniqueBitcoinAddressesUsed": "223159",
        "totalOutputVolumeValue": "480914.1455",
        "averageNumberOfTransactionsPerBlock": "654"
    },
    {
        "month": "2",
        "day": "23",
        "year": "2015",
        "price": "237.09",
        "totalCirculation": "13870975",
        "totalTransactionFees": "13.83752097",
        "numberOfUniqueBitcoinAddressesUsed": "215517",
        "totalOutputVolumeValue": "718922.6506",
        "averageNumberOfTransactionsPerBlock": "668"
    },
    {
        "month": "2",
        "day": "24",
        "year": "2015",
        "price": "240.1",
        "totalCirculation": "13874425",
        "totalTransactionFees": "14.56045942",
        "numberOfUniqueBitcoinAddressesUsed": "196851",
        "totalOutputVolumeValue": "830578.4114",
        "averageNumberOfTransactionsPerBlock": "575"
    },
    {
        "month": "2",
        "day": "25",
        "year": "2015",
        "price": "238.59",
        "totalCirculation": "13878325",
        "totalTransactionFees": "15.13904695",
        "numberOfUniqueBitcoinAddressesUsed": "194596",
        "totalOutputVolumeValue": "793938.9817",
        "averageNumberOfTransactionsPerBlock": "686"
    },
    {
        "month": "2",
        "day": "26",
        "year": "2015",
        "price": "237.5",
        "totalCirculation": "13881925",
        "totalTransactionFees": "14.42623973",
        "numberOfUniqueBitcoinAddressesUsed": "189240",
        "totalOutputVolumeValue": "783337.0584",
        "averageNumberOfTransactionsPerBlock": "708"
    },
    {
        "month": "2",
        "day": "27",
        "year": "2015",
        "price": "254",
        "totalCirculation": "13885875",
        "totalTransactionFees": "14.17573583",
        "numberOfUniqueBitcoinAddressesUsed": "199935",
        "totalOutputVolumeValue": "1875028.085",
        "averageNumberOfTransactionsPerBlock": "667"
    },
    {
        "month": "2",
        "day": "28",
        "year": "2015",
        "price": "252.98",
        "totalCirculation": "13889250",
        "totalTransactionFees": "13.71948104",
        "numberOfUniqueBitcoinAddressesUsed": "238834",
        "totalOutputVolumeValue": "711898.997",
        "averageNumberOfTransactionsPerBlock": "847"
    },
    {
        "month": "3",
        "day": "1",
        "year": "2015",
        "price": "247.56",
        "totalCirculation": "13893000",
        "totalTransactionFees": "12.66952726",
        "numberOfUniqueBitcoinAddressesUsed": "229461",
        "totalOutputVolumeValue": "915290.39",
        "averageNumberOfTransactionsPerBlock": "609"
    },
    {
        "month": "3",
        "day": "2",
        "year": "2015",
        "price": "263.81",
        "totalCirculation": "13896750",
        "totalTransactionFees": "16.08425123",
        "numberOfUniqueBitcoinAddressesUsed": "213896",
        "totalOutputVolumeValue": "2057569.867",
        "averageNumberOfTransactionsPerBlock": "668"
    },
    {
        "month": "3",
        "day": "3",
        "year": "2015",
        "price": "275.8",
        "totalCirculation": "13900600",
        "totalTransactionFees": "15.32856227",
        "numberOfUniqueBitcoinAddressesUsed": "216316",
        "totalOutputVolumeValue": "1209244.95",
        "averageNumberOfTransactionsPerBlock": "554"
    },
    {
        "month": "3",
        "day": "4",
        "year": "2015",
        "price": "281.65",
        "totalCirculation": "13904525",
        "totalTransactionFees": "15.09375814",
        "numberOfUniqueBitcoinAddressesUsed": "211468",
        "totalOutputVolumeValue": "927352.9018",
        "averageNumberOfTransactionsPerBlock": "730"
    },
    {
        "month": "3",
        "day": "5",
        "year": "2015",
        "price": "265.63",
        "totalCirculation": "13907375",
        "totalTransactionFees": "14.20542004",
        "numberOfUniqueBitcoinAddressesUsed": "195590",
        "totalOutputVolumeValue": "1005916.168",
        "averageNumberOfTransactionsPerBlock": "744"
    },
    {
        "month": "3",
        "day": "6",
        "year": "2015",
        "price": "272.12",
        "totalCirculation": "13911325",
        "totalTransactionFees": "17.21188567",
        "numberOfUniqueBitcoinAddressesUsed": "199410",
        "totalOutputVolumeValue": "940738.476",
        "averageNumberOfTransactionsPerBlock": "619"
    },
    {
        "month": "3",
        "day": "7",
        "year": "2015",
        "price": "275.83",
        "totalCirculation": "13914850",
        "totalTransactionFees": "13.57345998",
        "numberOfUniqueBitcoinAddressesUsed": "222227",
        "totalOutputVolumeValue": "982317.3265",
        "averageNumberOfTransactionsPerBlock": "734"
    },
    {
        "month": "3",
        "day": "8",
        "year": "2015",
        "price": "273.87",
        "totalCirculation": "13918750",
        "totalTransactionFees": "13.14254063",
        "numberOfUniqueBitcoinAddressesUsed": "213398",
        "totalOutputVolumeValue": "2518102.636",
        "averageNumberOfTransactionsPerBlock": "696"
    },
    {
        "month": "3",
        "day": "9",
        "year": "2015",
        "price": "287.48",
        "totalCirculation": "13922050",
        "totalTransactionFees": "14.01348729",
        "numberOfUniqueBitcoinAddressesUsed": "201698",
        "totalOutputVolumeValue": "869353.1422",
        "averageNumberOfTransactionsPerBlock": "662"
    },
    {
        "month": "3",
        "day": "10",
        "year": "2015",
        "price": "294.06",
        "totalCirculation": "13925825",
        "totalTransactionFees": "16.8128673",
        "numberOfUniqueBitcoinAddressesUsed": "210072",
        "totalOutputVolumeValue": "1209163.672",
        "averageNumberOfTransactionsPerBlock": "574"
    },
    {
        "month": "3",
        "day": "11",
        "year": "2015",
        "price": "293.29",
        "totalCirculation": "13929975",
        "totalTransactionFees": "15.46580835",
        "numberOfUniqueBitcoinAddressesUsed": "208179",
        "totalOutputVolumeValue": "964364.1318",
        "averageNumberOfTransactionsPerBlock": "746"
    },
    {
        "month": "3",
        "day": "12",
        "year": "2015",
        "price": "297.39",
        "totalCirculation": "13933300",
        "totalTransactionFees": "14.35821792",
        "numberOfUniqueBitcoinAddressesUsed": "193924",
        "totalOutputVolumeValue": "1105245.833",
        "averageNumberOfTransactionsPerBlock": "728"
    },
    {
        "month": "3",
        "day": "13",
        "year": "2015",
        "price": "289.51",
        "totalCirculation": "13936775",
        "totalTransactionFees": "13.87866807",
        "numberOfUniqueBitcoinAddressesUsed": "198297",
        "totalOutputVolumeValue": "936006.7214",
        "averageNumberOfTransactionsPerBlock": "730"
    },
    {
        "month": "3",
        "day": "14",
        "year": "2015",
        "price": "284.21",
        "totalCirculation": "13940125",
        "totalTransactionFees": "12.3819142",
        "numberOfUniqueBitcoinAddressesUsed": "219463",
        "totalOutputVolumeValue": "845760.3666",
        "averageNumberOfTransactionsPerBlock": "716"
    },
    {
        "month": "3",
        "day": "15",
        "year": "2015",
        "price": "283.57",
        "totalCirculation": "13943800",
        "totalTransactionFees": "11.85474118",
        "numberOfUniqueBitcoinAddressesUsed": "222639",
        "totalOutputVolumeValue": "567261.9925",
        "averageNumberOfTransactionsPerBlock": "731"
    },
    {
        "month": "3",
        "day": "16",
        "year": "2015",
        "price": "290.88",
        "totalCirculation": "13947075",
        "totalTransactionFees": "14.04389459",
        "numberOfUniqueBitcoinAddressesUsed": "206461",
        "totalOutputVolumeValue": "845772.8294",
        "averageNumberOfTransactionsPerBlock": "702"
    },
    {
        "month": "3",
        "day": "17",
        "year": "2015",
        "price": "287.02",
        "totalCirculation": "13950650",
        "totalTransactionFees": "14.75421706",
        "numberOfUniqueBitcoinAddressesUsed": "199845",
        "totalOutputVolumeValue": "879535.3388",
        "averageNumberOfTransactionsPerBlock": "634"
    },
    {
        "month": "3",
        "day": "18",
        "year": "2015",
        "price": "265.85",
        "totalCirculation": "13954175",
        "totalTransactionFees": "15.20202714",
        "numberOfUniqueBitcoinAddressesUsed": "191204",
        "totalOutputVolumeValue": "1313065.331",
        "averageNumberOfTransactionsPerBlock": "699"
    },
    {
        "month": "3",
        "day": "19",
        "year": "2015",
        "price": "260.62",
        "totalCirculation": "13957750",
        "totalTransactionFees": "16.03415694",
        "numberOfUniqueBitcoinAddressesUsed": "190851",
        "totalOutputVolumeValue": "1264777.941",
        "averageNumberOfTransactionsPerBlock": "577"
    },
    {
        "month": "3",
        "day": "20",
        "year": "2015",
        "price": "259.8",
        "totalCirculation": "13961275",
        "totalTransactionFees": "16.10498382",
        "numberOfUniqueBitcoinAddressesUsed": "198449",
        "totalOutputVolumeValue": "898988.249",
        "averageNumberOfTransactionsPerBlock": "565"
    },
    {
        "month": "3",
        "day": "21",
        "year": "2015",
        "price": "257.83",
        "totalCirculation": "13964850",
        "totalTransactionFees": "14.67230432",
        "numberOfUniqueBitcoinAddressesUsed": "218099",
        "totalOutputVolumeValue": "671989.2006",
        "averageNumberOfTransactionsPerBlock": "660"
    },
    {
        "month": "3",
        "day": "22",
        "year": "2015",
        "price": "260.5",
        "totalCirculation": "13968175",
        "totalTransactionFees": "12.03965358",
        "numberOfUniqueBitcoinAddressesUsed": "214152",
        "totalOutputVolumeValue": "500187.762",
        "averageNumberOfTransactionsPerBlock": "618"
    },
    {
        "month": "3",
        "day": "23",
        "year": "2015",
        "price": "266.07",
        "totalCirculation": "13971975",
        "totalTransactionFees": "17.375943",
        "numberOfUniqueBitcoinAddressesUsed": "221091",
        "totalOutputVolumeValue": "777604.4346",
        "averageNumberOfTransactionsPerBlock": "600"
    },
    {
        "month": "3",
        "day": "24",
        "year": "2015",
        "price": "247.83",
        "totalCirculation": "13976150",
        "totalTransactionFees": "14.32893236",
        "numberOfUniqueBitcoinAddressesUsed": "185435",
        "totalOutputVolumeValue": "995369.8884",
        "averageNumberOfTransactionsPerBlock": "579"
    },
    {
        "month": "3",
        "day": "25",
        "year": "2015",
        "price": "245.68",
        "totalCirculation": "13980300",
        "totalTransactionFees": "15.31775967",
        "numberOfUniqueBitcoinAddressesUsed": "182792",
        "totalOutputVolumeValue": "1048542.223",
        "averageNumberOfTransactionsPerBlock": "719"
    },
    {
        "month": "3",
        "day": "26",
        "year": "2015",
        "price": "251.98",
        "totalCirculation": "13984025",
        "totalTransactionFees": "14.07414031",
        "numberOfUniqueBitcoinAddressesUsed": "188107",
        "totalOutputVolumeValue": "970255.8947",
        "averageNumberOfTransactionsPerBlock": "706"
    },
    {
        "month": "3",
        "day": "27",
        "year": "2015",
        "price": "248.63",
        "totalCirculation": "13988325",
        "totalTransactionFees": "15.37769189",
        "numberOfUniqueBitcoinAddressesUsed": "202290",
        "totalOutputVolumeValue": "1081116.668",
        "averageNumberOfTransactionsPerBlock": "891"
    },
    {
        "month": "3",
        "day": "28",
        "year": "2015",
        "price": "251.52",
        "totalCirculation": "13992075",
        "totalTransactionFees": "12.89657663",
        "numberOfUniqueBitcoinAddressesUsed": "208232",
        "totalOutputVolumeValue": "699832.0371",
        "averageNumberOfTransactionsPerBlock": "786"
    },
    {
        "month": "3",
        "day": "29",
        "year": "2015",
        "price": "244.05",
        "totalCirculation": "13995850",
        "totalTransactionFees": "12.19379189",
        "numberOfUniqueBitcoinAddressesUsed": "228699",
        "totalOutputVolumeValue": "542197.7672",
        "averageNumberOfTransactionsPerBlock": "687"
    },
    {
        "month": "3",
        "day": "30",
        "year": "2015",
        "price": "245.18",
        "totalCirculation": "13999400",
        "totalTransactionFees": "14.80696195",
        "numberOfUniqueBitcoinAddressesUsed": "202713",
        "totalOutputVolumeValue": "809237.4931",
        "averageNumberOfTransactionsPerBlock": "611"
    },
    {
        "month": "3",
        "day": "31",
        "year": "2015",
        "price": "242.92",
        "totalCirculation": "14003125",
        "totalTransactionFees": "14.73616593",
        "numberOfUniqueBitcoinAddressesUsed": "203189",
        "totalOutputVolumeValue": "780481.8759",
        "averageNumberOfTransactionsPerBlock": "622"
    },
    {
        "month": "4",
        "day": "1",
        "year": "2015",
        "price": "242.7",
        "totalCirculation": "14006675",
        "totalTransactionFees": "18.11563857",
        "numberOfUniqueBitcoinAddressesUsed": "241041",
        "totalOutputVolumeValue": "1065013.433",
        "averageNumberOfTransactionsPerBlock": "782"
    },
    {
        "month": "4",
        "day": "2",
        "year": "2015",
        "price": "252.44",
        "totalCirculation": "14010350",
        "totalTransactionFees": "16.0150584",
        "numberOfUniqueBitcoinAddressesUsed": "214884",
        "totalOutputVolumeValue": "919886.2699",
        "averageNumberOfTransactionsPerBlock": "703"
    },
    {
        "month": "4",
        "day": "3",
        "year": "2015",
        "price": "254.39",
        "totalCirculation": "14014125",
        "totalTransactionFees": "14.6205005",
        "numberOfUniqueBitcoinAddressesUsed": "195509",
        "totalOutputVolumeValue": "710039.2639",
        "averageNumberOfTransactionsPerBlock": "907"
    },
    {
        "month": "4",
        "day": "4",
        "year": "2015",
        "price": "253.77",
        "totalCirculation": "14017975",
        "totalTransactionFees": "15.06052225",
        "numberOfUniqueBitcoinAddressesUsed": "228536",
        "totalOutputVolumeValue": "534385.2119",
        "averageNumberOfTransactionsPerBlock": "823"
    },
    {
        "month": "4",
        "day": "5",
        "year": "2015",
        "price": "257.03",
        "totalCirculation": "14021750",
        "totalTransactionFees": "14.3073758",
        "numberOfUniqueBitcoinAddressesUsed": "222020",
        "totalOutputVolumeValue": "464142.9762",
        "averageNumberOfTransactionsPerBlock": "803"
    },
    {
        "month": "4",
        "day": "6",
        "year": "2015",
        "price": "254.7",
        "totalCirculation": "14024975",
        "totalTransactionFees": "15.31261593",
        "numberOfUniqueBitcoinAddressesUsed": "189967",
        "totalOutputVolumeValue": "630939.0199",
        "averageNumberOfTransactionsPerBlock": "755"
    },
    {
        "month": "4",
        "day": "7",
        "year": "2015",
        "price": "255.48",
        "totalCirculation": "14028950",
        "totalTransactionFees": "16.185038",
        "numberOfUniqueBitcoinAddressesUsed": "220417",
        "totalOutputVolumeValue": "825264.712",
        "averageNumberOfTransactionsPerBlock": "653"
    },
    {
        "month": "4",
        "day": "8",
        "year": "2015",
        "price": "245.89",
        "totalCirculation": "14031925",
        "totalTransactionFees": "15.47753386",
        "numberOfUniqueBitcoinAddressesUsed": "214628",
        "totalOutputVolumeValue": "920414.8328",
        "averageNumberOfTransactionsPerBlock": "746"
    },
    {
        "month": "4",
        "day": "9",
        "year": "2015",
        "price": "244.98",
        "totalCirculation": "14035500",
        "totalTransactionFees": "16.98327802",
        "numberOfUniqueBitcoinAddressesUsed": "203465",
        "totalOutputVolumeValue": "869233.7473",
        "averageNumberOfTransactionsPerBlock": "717"
    },
    {
        "month": "4",
        "day": "10",
        "year": "2015",
        "price": "235.71",
        "totalCirculation": "14039050",
        "totalTransactionFees": "29.80724162",
        "numberOfUniqueBitcoinAddressesUsed": "215133",
        "totalOutputVolumeValue": "938294.3579",
        "averageNumberOfTransactionsPerBlock": "857"
    },
    {
        "month": "4",
        "day": "11",
        "year": "2015",
        "price": "236.7",
        "totalCirculation": "14042475",
        "totalTransactionFees": "17.10524583",
        "numberOfUniqueBitcoinAddressesUsed": "243573",
        "totalOutputVolumeValue": "775358.4642",
        "averageNumberOfTransactionsPerBlock": "754"
    },
    {
        "month": "4",
        "day": "12",
        "year": "2015",
        "price": "236.76",
        "totalCirculation": "14045875",
        "totalTransactionFees": "14.35766331",
        "numberOfUniqueBitcoinAddressesUsed": "193479",
        "totalOutputVolumeValue": "518158.2748",
        "averageNumberOfTransactionsPerBlock": "761"
    },
    {
        "month": "4",
        "day": "13",
        "year": "2015",
        "price": "225.99",
        "totalCirculation": "14049400",
        "totalTransactionFees": "15.91337178",
        "numberOfUniqueBitcoinAddressesUsed": "232236",
        "totalOutputVolumeValue": "736302.8876",
        "averageNumberOfTransactionsPerBlock": "755"
    },
    {
        "month": "4",
        "day": "14",
        "year": "2015",
        "price": "216",
        "totalCirculation": "14053350",
        "totalTransactionFees": "16.94687098",
        "numberOfUniqueBitcoinAddressesUsed": "219510",
        "totalOutputVolumeValue": "1094007.709",
        "averageNumberOfTransactionsPerBlock": "634"
    },
    {
        "month": "4",
        "day": "15",
        "year": "2015",
        "price": "218.96",
        "totalCirculation": "14056425",
        "totalTransactionFees": "15.07987703",
        "numberOfUniqueBitcoinAddressesUsed": "190441",
        "totalOutputVolumeValue": "796458.5682",
        "averageNumberOfTransactionsPerBlock": "693"
    },
    {
        "month": "4",
        "day": "16",
        "year": "2015",
        "price": "229.62",
        "totalCirculation": "14059875",
        "totalTransactionFees": "15.02016737",
        "numberOfUniqueBitcoinAddressesUsed": "196262",
        "totalOutputVolumeValue": "1092751.348",
        "averageNumberOfTransactionsPerBlock": "717"
    },
    {
        "month": "4",
        "day": "17",
        "year": "2015",
        "price": "222.67",
        "totalCirculation": "14063225",
        "totalTransactionFees": "14.2760589",
        "numberOfUniqueBitcoinAddressesUsed": "191876",
        "totalOutputVolumeValue": "1160090.329",
        "averageNumberOfTransactionsPerBlock": "794"
    },
    {
        "month": "4",
        "day": "18",
        "year": "2015",
        "price": "222.32",
        "totalCirculation": "14066550",
        "totalTransactionFees": "13.91339511",
        "numberOfUniqueBitcoinAddressesUsed": "225102",
        "totalOutputVolumeValue": "888595.0446",
        "averageNumberOfTransactionsPerBlock": "777"
    },
    {
        "month": "4",
        "day": "19",
        "year": "2015",
        "price": "225.72",
        "totalCirculation": "14069950",
        "totalTransactionFees": "12.06487514",
        "numberOfUniqueBitcoinAddressesUsed": "168858",
        "totalOutputVolumeValue": "824017.0177",
        "averageNumberOfTransactionsPerBlock": "921"
    },
    {
        "month": "4",
        "day": "20",
        "year": "2015",
        "price": "224.63",
        "totalCirculation": "14074100",
        "totalTransactionFees": "15.96574801",
        "numberOfUniqueBitcoinAddressesUsed": "253148",
        "totalOutputVolumeValue": "1314222.74",
        "averageNumberOfTransactionsPerBlock": "654"
    },
    {
        "month": "4",
        "day": "21",
        "year": "2015",
        "price": "224.88",
        "totalCirculation": "14078075",
        "totalTransactionFees": "16.81026573",
        "numberOfUniqueBitcoinAddressesUsed": "205286",
        "totalOutputVolumeValue": "1167048.984",
        "averageNumberOfTransactionsPerBlock": "629"
    },
    {
        "month": "4",
        "day": "22",
        "year": "2015",
        "price": "237.34",
        "totalCirculation": "14081650",
        "totalTransactionFees": "16.12435635",
        "numberOfUniqueBitcoinAddressesUsed": "222085",
        "totalOutputVolumeValue": "1492167.795",
        "averageNumberOfTransactionsPerBlock": "792"
    },
    {
        "month": "4",
        "day": "23",
        "year": "2015",
        "price": "235.48",
        "totalCirculation": "14085100",
        "totalTransactionFees": "14.77482324",
        "numberOfUniqueBitcoinAddressesUsed": "212819",
        "totalOutputVolumeValue": "1043100.654",
        "averageNumberOfTransactionsPerBlock": "716"
    },
    {
        "month": "4",
        "day": "24",
        "year": "2015",
        "price": "230.93",
        "totalCirculation": "14088100",
        "totalTransactionFees": "16.22929386",
        "numberOfUniqueBitcoinAddressesUsed": "205205",
        "totalOutputVolumeValue": "1300018.225",
        "averageNumberOfTransactionsPerBlock": "906"
    },
    {
        "month": "4",
        "day": "25",
        "year": "2015",
        "price": "228.6",
        "totalCirculation": "14091950",
        "totalTransactionFees": "99.96396999",
        "numberOfUniqueBitcoinAddressesUsed": "242148",
        "totalOutputVolumeValue": "1061784.872",
        "averageNumberOfTransactionsPerBlock": "857"
    },
    {
        "month": "4",
        "day": "26",
        "year": "2015",
        "price": "218.42",
        "totalCirculation": "14095675",
        "totalTransactionFees": "13.29723822",
        "numberOfUniqueBitcoinAddressesUsed": "226263",
        "totalOutputVolumeValue": "986913.3041",
        "averageNumberOfTransactionsPerBlock": "715"
    },
    {
        "month": "4",
        "day": "27",
        "year": "2015",
        "price": "222.59",
        "totalCirculation": "14099125",
        "totalTransactionFees": "15.1962056",
        "numberOfUniqueBitcoinAddressesUsed": "203028",
        "totalOutputVolumeValue": "1387033.685",
        "averageNumberOfTransactionsPerBlock": "655"
    },
    {
        "month": "4",
        "day": "28",
        "year": "2015",
        "price": "222.66",
        "totalCirculation": "14103050",
        "totalTransactionFees": "15.80028461",
        "numberOfUniqueBitcoinAddressesUsed": "218502",
        "totalOutputVolumeValue": "1282095.821",
        "averageNumberOfTransactionsPerBlock": "623"
    },
    {
        "month": "4",
        "day": "29",
        "year": "2015",
        "price": "225.69",
        "totalCirculation": "14106275",
        "totalTransactionFees": "17.28262292",
        "numberOfUniqueBitcoinAddressesUsed": "207741",
        "totalOutputVolumeValue": "1302466.315",
        "averageNumberOfTransactionsPerBlock": "713"
    },
    {
        "month": "4",
        "day": "30",
        "year": "2015",
        "price": "235.13",
        "totalCirculation": "14109600",
        "totalTransactionFees": "16.08932183",
        "numberOfUniqueBitcoinAddressesUsed": "215077",
        "totalOutputVolumeValue": "1220912.967",
        "averageNumberOfTransactionsPerBlock": "741"
    },
    {
        "month": "5",
        "day": "1",
        "year": "2015",
        "price": "233.43",
        "totalCirculation": "14113275",
        "totalTransactionFees": "15.30178105",
        "numberOfUniqueBitcoinAddressesUsed": "197072",
        "totalOutputVolumeValue": "1211402.252",
        "averageNumberOfTransactionsPerBlock": "793"
    },
    {
        "month": "5",
        "day": "2",
        "year": "2015",
        "price": "234.13",
        "totalCirculation": "14116950",
        "totalTransactionFees": "14.07475563",
        "numberOfUniqueBitcoinAddressesUsed": "238390",
        "totalOutputVolumeValue": "938951.081",
        "averageNumberOfTransactionsPerBlock": "704"
    },
    {
        "month": "5",
        "day": "3",
        "year": "2015",
        "price": "240.51",
        "totalCirculation": "14120400",
        "totalTransactionFees": "12.37823502",
        "numberOfUniqueBitcoinAddressesUsed": "212123",
        "totalOutputVolumeValue": "814631.0011",
        "averageNumberOfTransactionsPerBlock": "732"
    },
    {
        "month": "5",
        "day": "4",
        "year": "2015",
        "price": "236.17",
        "totalCirculation": "14123700",
        "totalTransactionFees": "13.94423733",
        "numberOfUniqueBitcoinAddressesUsed": "190201",
        "totalOutputVolumeValue": "1115767.987",
        "averageNumberOfTransactionsPerBlock": "783"
    },
    {
        "month": "5",
        "day": "5",
        "year": "2015",
        "price": "234.66",
        "totalCirculation": "14127550",
        "totalTransactionFees": "16.03734494",
        "numberOfUniqueBitcoinAddressesUsed": "219068",
        "totalOutputVolumeValue": "1185724.429",
        "averageNumberOfTransactionsPerBlock": "698"
    },
    {
        "month": "5",
        "day": "6",
        "year": "2015",
        "price": "235.79",
        "totalCirculation": "14131125",
        "totalTransactionFees": "16.01690293",
        "numberOfUniqueBitcoinAddressesUsed": "219506",
        "totalOutputVolumeValue": "1163293.865",
        "averageNumberOfTransactionsPerBlock": "691"
    },
    {
        "month": "5",
        "day": "7",
        "year": "2015",
        "price": "233.99",
        "totalCirculation": "14135150",
        "totalTransactionFees": "16.35823476",
        "numberOfUniqueBitcoinAddressesUsed": "227324",
        "totalOutputVolumeValue": "1369922.518",
        "averageNumberOfTransactionsPerBlock": "724"
    },
    {
        "month": "5",
        "day": "8",
        "year": "2015",
        "price": "244.72",
        "totalCirculation": "14138850",
        "totalTransactionFees": "15.86988861",
        "numberOfUniqueBitcoinAddressesUsed": "261673",
        "totalOutputVolumeValue": "1125450.448",
        "averageNumberOfTransactionsPerBlock": "670"
    },
    {
        "month": "5",
        "day": "9",
        "year": "2015",
        "price": "241.08",
        "totalCirculation": "14142000",
        "totalTransactionFees": "14.78591409",
        "numberOfUniqueBitcoinAddressesUsed": "199251",
        "totalOutputVolumeValue": "912949.8807",
        "averageNumberOfTransactionsPerBlock": "723"
    },
    {
        "month": "5",
        "day": "10",
        "year": "2015",
        "price": "239.35",
        "totalCirculation": "14145225",
        "totalTransactionFees": "15.2176298",
        "numberOfUniqueBitcoinAddressesUsed": "213909",
        "totalOutputVolumeValue": "995251.9926",
        "averageNumberOfTransactionsPerBlock": "653"
    },
    {
        "month": "5",
        "day": "11",
        "year": "2015",
        "price": "244.19",
        "totalCirculation": "14148950",
        "totalTransactionFees": "16.18034809",
        "numberOfUniqueBitcoinAddressesUsed": "215628",
        "totalOutputVolumeValue": "1075275.174",
        "averageNumberOfTransactionsPerBlock": "726"
    },
    {
        "month": "5",
        "day": "12",
        "year": "2015",
        "price": "241.51",
        "totalCirculation": "14152900",
        "totalTransactionFees": "16.75259925",
        "numberOfUniqueBitcoinAddressesUsed": "233523",
        "totalOutputVolumeValue": "1161665.751",
        "averageNumberOfTransactionsPerBlock": "494"
    },
    {
        "month": "5",
        "day": "13",
        "year": "2015",
        "price": "242.72",
        "totalCirculation": "14156950",
        "totalTransactionFees": "15.40723591",
        "numberOfUniqueBitcoinAddressesUsed": "211323",
        "totalOutputVolumeValue": "1071140.424",
        "averageNumberOfTransactionsPerBlock": "714"
    },
    {
        "month": "5",
        "day": "14",
        "year": "2015",
        "price": "238.32",
        "totalCirculation": "14160450",
        "totalTransactionFees": "14.19848984",
        "numberOfUniqueBitcoinAddressesUsed": "201739",
        "totalOutputVolumeValue": "1047459.529",
        "averageNumberOfTransactionsPerBlock": "783"
    },
    {
        "month": "5",
        "day": "15",
        "year": "2015",
        "price": "237.6",
        "totalCirculation": "14164575",
        "totalTransactionFees": "15.0815495",
        "numberOfUniqueBitcoinAddressesUsed": "209999",
        "totalOutputVolumeValue": "1014614.791",
        "averageNumberOfTransactionsPerBlock": "758"
    },
    {
        "month": "5",
        "day": "16",
        "year": "2015",
        "price": "236.63",
        "totalCirculation": "14167775",
        "totalTransactionFees": "13.79618089",
        "numberOfUniqueBitcoinAddressesUsed": "236081",
        "totalOutputVolumeValue": "744402.1926",
        "averageNumberOfTransactionsPerBlock": "653"
    },
    {
        "month": "5",
        "day": "17",
        "year": "2015",
        "price": "235.78",
        "totalCirculation": "14172100",
        "totalTransactionFees": "12.33378944",
        "numberOfUniqueBitcoinAddressesUsed": "216412",
        "totalOutputVolumeValue": "686643.8674",
        "averageNumberOfTransactionsPerBlock": "708"
    },
    {
        "month": "5",
        "day": "18",
        "year": "2015",
        "price": "236.45",
        "totalCirculation": "14175525",
        "totalTransactionFees": "14.85179661",
        "numberOfUniqueBitcoinAddressesUsed": "197816",
        "totalOutputVolumeValue": "827210.0964",
        "averageNumberOfTransactionsPerBlock": "772"
    },
    {
        "month": "5",
        "day": "19",
        "year": "2015",
        "price": "232.04",
        "totalCirculation": "14178925",
        "totalTransactionFees": "15.46219384",
        "numberOfUniqueBitcoinAddressesUsed": "207126",
        "totalOutputVolumeValue": "1143305.566",
        "averageNumberOfTransactionsPerBlock": "624"
    },
    {
        "month": "5",
        "day": "20",
        "year": "2015",
        "price": "234.6",
        "totalCirculation": "14182475",
        "totalTransactionFees": "15.67924364",
        "numberOfUniqueBitcoinAddressesUsed": "221491",
        "totalOutputVolumeValue": "1191754.86",
        "averageNumberOfTransactionsPerBlock": "732"
    },
    {
        "month": "5",
        "day": "21",
        "year": "2015",
        "price": "236",
        "totalCirculation": "14186300",
        "totalTransactionFees": "14.46308563",
        "numberOfUniqueBitcoinAddressesUsed": "203159",
        "totalOutputVolumeValue": "957204.6814",
        "averageNumberOfTransactionsPerBlock": "792"
    },
    {
        "month": "5",
        "day": "22",
        "year": "2015",
        "price": "240.5",
        "totalCirculation": "14189850",
        "totalTransactionFees": "15.32116469",
        "numberOfUniqueBitcoinAddressesUsed": "207671",
        "totalOutputVolumeValue": "1165755.117",
        "averageNumberOfTransactionsPerBlock": "748"
    },
    {
        "month": "5",
        "day": "23",
        "year": "2015",
        "price": "238.77",
        "totalCirculation": "14192850",
        "totalTransactionFees": "13.47221894",
        "numberOfUniqueBitcoinAddressesUsed": "194783",
        "totalOutputVolumeValue": "1144605.368",
        "averageNumberOfTransactionsPerBlock": "831"
    },
    {
        "month": "5",
        "day": "24",
        "year": "2015",
        "price": "240.46",
        "totalCirculation": "14196375",
        "totalTransactionFees": "12.74716388",
        "numberOfUniqueBitcoinAddressesUsed": "246182",
        "totalOutputVolumeValue": "702062.2805",
        "averageNumberOfTransactionsPerBlock": "784"
    },
    {
        "month": "5",
        "day": "25",
        "year": "2015",
        "price": "235.65",
        "totalCirculation": "14199975",
        "totalTransactionFees": "15.48928101",
        "numberOfUniqueBitcoinAddressesUsed": "206424",
        "totalOutputVolumeValue": "886365.2097",
        "averageNumberOfTransactionsPerBlock": "1071"
    },
    {
        "month": "5",
        "day": "26",
        "year": "2015",
        "price": "235.94",
        "totalCirculation": "14203350",
        "totalTransactionFees": "17.74572734",
        "numberOfUniqueBitcoinAddressesUsed": "222322",
        "totalOutputVolumeValue": "1039896.703",
        "averageNumberOfTransactionsPerBlock": "653"
    },
    {
        "month": "5",
        "day": "27",
        "year": "2015",
        "price": "235",
        "totalCirculation": "14206975",
        "totalTransactionFees": "16.09865543",
        "numberOfUniqueBitcoinAddressesUsed": "221553",
        "totalOutputVolumeValue": "1119412",
        "averageNumberOfTransactionsPerBlock": "853"
    },
    {
        "month": "5",
        "day": "28",
        "year": "2015",
        "price": "236.48",
        "totalCirculation": "14210275",
        "totalTransactionFees": "16.12750693",
        "numberOfUniqueBitcoinAddressesUsed": "220123",
        "totalOutputVolumeValue": "1049285.993",
        "averageNumberOfTransactionsPerBlock": "914"
    },
    {
        "month": "5",
        "day": "29",
        "year": "2015",
        "price": "235.87",
        "totalCirculation": "14214200",
        "totalTransactionFees": "17.52633345",
        "numberOfUniqueBitcoinAddressesUsed": "237083",
        "totalOutputVolumeValue": "1125299.618",
        "averageNumberOfTransactionsPerBlock": "883"
    },
    {
        "month": "5",
        "day": "30",
        "year": "2015",
        "price": "231.12",
        "totalCirculation": "14217300",
        "totalTransactionFees": "18.13414229",
        "numberOfUniqueBitcoinAddressesUsed": "269743",
        "totalOutputVolumeValue": "928260.4783",
        "averageNumberOfTransactionsPerBlock": "872"
    },
    {
        "month": "5",
        "day": "31",
        "year": "2015",
        "price": "231.95",
        "totalCirculation": "14220975",
        "totalTransactionFees": "13.638817",
        "numberOfUniqueBitcoinAddressesUsed": "238007",
        "totalOutputVolumeValue": "782197.7079",
        "averageNumberOfTransactionsPerBlock": "772"
    },
    {
        "month": "6",
        "day": "1",
        "year": "2015",
        "price": "222.4",
        "totalCirculation": "14224400",
        "totalTransactionFees": "45.24728362",
        "numberOfUniqueBitcoinAddressesUsed": "252174",
        "totalOutputVolumeValue": "1473819.952",
        "averageNumberOfTransactionsPerBlock": "633"
    },
    {
        "month": "6",
        "day": "2",
        "year": "2015",
        "price": "224.83",
        "totalCirculation": "14228050",
        "totalTransactionFees": "19.09865642",
        "numberOfUniqueBitcoinAddressesUsed": "257275",
        "totalOutputVolumeValue": "1517326.809",
        "averageNumberOfTransactionsPerBlock": "529"
    },
    {
        "month": "6",
        "day": "3",
        "year": "2015",
        "price": "226.29",
        "totalCirculation": "14231600",
        "totalTransactionFees": "17.86202728",
        "numberOfUniqueBitcoinAddressesUsed": "239702",
        "totalOutputVolumeValue": "1325341.044",
        "averageNumberOfTransactionsPerBlock": "666"
    },
    {
        "month": "6",
        "day": "4",
        "year": "2015",
        "price": "225.54",
        "totalCirculation": "14235150",
        "totalTransactionFees": "17.47387221",
        "numberOfUniqueBitcoinAddressesUsed": "240222",
        "totalOutputVolumeValue": "1277219.058",
        "averageNumberOfTransactionsPerBlock": "713"
    },
    {
        "month": "6",
        "day": "5",
        "year": "2015",
        "price": "224.15",
        "totalCirculation": "14238700",
        "totalTransactionFees": "16.17225384",
        "numberOfUniqueBitcoinAddressesUsed": "232715",
        "totalOutputVolumeValue": "1443588.412",
        "averageNumberOfTransactionsPerBlock": "842"
    },
    {
        "month": "6",
        "day": "6",
        "year": "2015",
        "price": "224.49",
        "totalCirculation": "14242725",
        "totalTransactionFees": "15.2555162",
        "numberOfUniqueBitcoinAddressesUsed": "244636",
        "totalOutputVolumeValue": "1086475.725",
        "averageNumberOfTransactionsPerBlock": "806"
    },
    {
        "month": "6",
        "day": "7",
        "year": "2015",
        "price": "222.6",
        "totalCirculation": "14246900",
        "totalTransactionFees": "13.64505466",
        "numberOfUniqueBitcoinAddressesUsed": "225189",
        "totalOutputVolumeValue": "1064474.916",
        "averageNumberOfTransactionsPerBlock": ""
    },
    {
        "month": "6",
        "day": "8",
        "year": "2015",
        "price": "228",
        "totalCirculation": "14250425",
        "totalTransactionFees": "15.28474251",
        "numberOfUniqueBitcoinAddressesUsed": "188952",
        "totalOutputVolumeValue": "1001943.988",
        "averageNumberOfTransactionsPerBlock": ""
    },
    {
        "month": "6",
        "day": "9",
        "year": "2015",
        "price": "230.1",
        "totalCirculation": "14254475",
        "totalTransactionFees": "16.68496332",
        "numberOfUniqueBitcoinAddressesUsed": "208925",
        "totalOutputVolumeValue": "1244998.717",
        "averageNumberOfTransactionsPerBlock": ""
    },
    {
        "month": "6",
        "day": "10",
        "year": "2015",
        "price": "228.01",
        "totalCirculation": "14258425",
        "totalTransactionFees": "20.21619753",
        "numberOfUniqueBitcoinAddressesUsed": "267864",
        "totalOutputVolumeValue": "1303509.802",
        "averageNumberOfTransactionsPerBlock": ""
    },
    {
        "month": "6",
        "day": "10",
        "year": "2015",
        "price": "228.49",
        "totalCirculation": "14262575",
        "totalTransactionFees": "19.99560471",
        "numberOfUniqueBitcoinAddressesUsed": "261883",
        "totalOutputVolumeValue": "1335508.23",
        "averageNumberOfTransactionsPerBlock": ""
    }
]
	
function update(data){
	// console.log("data", JSON.stringify(data))
// }
// d3.json(bitcurveData, function(data) {
	console.log("data", data);
    custom_bubble_chart.init(data);
    custom_bubble_chart.toggle_view('all');
};
update(bitcurveData);

//jQuery 
$(document).ready(function() {
  $('#view_selection a').click(function() { //bind it to html element with class #view_selection
    var view_type = $(this).attr('id');
    $('#view_selection a').removeClass('active');
    $(this).toggleClass('active');
    custom_bubble_chart.toggle_view(view_type);
    return false;
  });
});

>>>>>>> 1fb77899587084a4bdc39e08d7f8e89c77c5087d

			}	// end link

		}	// end return

	}]);	// end .directive

})();	// end iffy