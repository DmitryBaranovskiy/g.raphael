# g.pie.js #

## Requirements ##

 + raphael.js
 + g.raphael.js
 + g.pie.js
 
## Overview ##

Creates a pie chart.

## Parameters ##

**1. x** number **X coordinate of the centre**

**2. y** number **Y coordinate of the centre**

**3. r** number **radius**

**4. values** array of numbers **Values for your slices.**

**5. opts** object **Options (more info soon.)**

_opts_

**legend**

Values are,

    + legend - e.g. ["apples", "oranges"]
    + legendothers
    + legendmark 
    + legendpos - e.g. "west"

legend is required. If legendpos is omitted, 'east' is assumed. If legendmark is omitted, 'disc' is assumed. The current possible options for legendmark and legendpos are,

**legendmark**

Values are,

_(shorthand: full name)_

    + o: "disc"
    + f: "flower"
    + d: "diamond"
    + s: "square"
    + t: "triangle"
    + *: "star"
    + x: "cross"
    + +: "plus"
    + ->: "arrow"

**legendpos**

Values are,

    + "north"
    + "south"
    + "east"
    + "west"
    
## Methods ##

**1. .hover(fin, fout)** - fin/fout: **callbacks to trigger when mouse hovers in and out respectively over the pie sectors.**

**2. .click(f)** - f: **callback to trigger on click event.**

**3. .each(f)** - f: **callback applied to each iteration.**

.each(f) works by iterating through each of the slices and returning each as an object to the callback f(). Within the callback, you can access the object returned on each iteration in the context of 'this', for example


	var f = function() {
		
		console.log(this.r);	// the radius of the slice

	}



## Usage ##

Create a Raphael instance, 


    // bare bones
    var r = Raphael();
    // create at top left corner of #element
    var r = Raphael('pie-chart');
    
    
Create a pie chart,


    // bare bones
    var pie = r.g.piechart(_params);
    // example
    var pie = r.g.piechart(10, 10, 90, [10,20,30]);
    
    
Create legends,


    // example
    r.g.piechart(320, 240, 100, [10,20,30,40], {legend:['%% apples', '%% bananas', '%% cherries', '%% durians'], legendmark:"*", legendpos: "south"});
    
Attach hover event to piechart,


    // example
    r.g.piechart(10, 10, 90, [10,20,30]).hover(function() {
        // when mouse hovers over slice, change color 
        this.sector.attr({fill:"#FAA"});
    }, function() {
        // when mouse hovers out, restore color
        this.sector.attr({fill:"#666"});
    });
    
Attach click event to piechart,


    // example
    r.g.piechart.click(function() {
       alert("You clicked on the pie chart!"); 
    });
    
## Others ##

Each pie chart in g.raphael.js is composed of a 'series', or a collection of slices/sectors. Each slice has its own 'sector' property which carries information like the value, the color and other attributes, as well as its own 'cover' which can be thought of as a layer (really set to opacity 0) to which you attach events like click or hover.

When you iterate through each slice of the pie chart using .each(), the returned slice has the following properties:

	+ sector
	+ cover
	+ cx
	+ cy
	+ x (middle x coordinate of the sector)
	+ y (middle y coordinate of the sector)
	+ mangle
	+ r (radius)
	+ value
	+ total
	+ label

When you attach a hover event for example, using .hover(), g.raphael.js is essentially iterating through each slice, as it does in .each(), and passing the returned slice to the callbacks to be called, and setting the events to happen by binding mouseover and mouseout events to the covers.

All of this is container within the 'chart' object, which is initialized and returned to you when you first call g.piechart.
