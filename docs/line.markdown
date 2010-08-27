# g.line.js #

## Requirements ##

 + raphael.js
 + g.raphael.js
 + g.line.js
 
## Overview ##

Creates a line chart.

## Parameters ##

**1. x** number **X coordinate of the centre**

**2. y** number **Y coordinate of the centre**

**3. width** number **width**

**4. height** number **height**

**5. valuesx** array of numbers **Values for x-axis.**

**6. valuesy** array of numbers **Values for y-axis.**

**7. opts** object **Options (more info soon.)**

_opts_

**colors**

Value - an array of color values, such as ["#444","#666"...]. If omitted, random colors will be used. (actually, Raphael.fn.g.colors. More info on this in the g.raphael.js documentation) For more information, refer to the [supported color formats](http://raphaeljs.com/reference.html#colour) section of the Raphaeljs documention.

**symbol**

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

If omitted, an empty "" is assigned to indicate no symbols.

**shade**

Value - boolean. If omitted, false is assumed. If true, the area underneath the line will be shaded with the same color as the line, with opacity set to .3. You can affect this by setting nostroke (see below) option to true.

**nostroke**

Value - boolean. If omitted, false is assumed.

**axis**

Value - "_top_ _right_ _bottom_ _left_". If omitted, no axis will be rendered for the line chart. For example, if you wanted axis rendered for the left and bottom, (as in a typical x-y chart), you'll add 'axis:"0 0 1 1"' to opts. The axis is created using g.axis (for more information, see the g documentation).

**smooth**

Value - boolean. If omitted, false is assumed. If true, smoothing/rounding is applied to the path between data points.

**gutter**

Value - number. If omitted, value of '10' is assigned. Think of this as a general padding value between the chart and the bounding box/container. 


## Methods ##

**1. .hover(fin, fout)** - fin/fout: **callbacks to trigger when mouse hovers in and out respectively over the data points.**

**2. .click(f)** - f: **callback to trigger on click event.**

**3. .each(f)** - f: **callback applied to each iteration.**

.each(f) works by iterating through each of the data points and returning each as a 'dot' object to the callback f(). Within the callback, you can access the object returned on each iteration in the context of 'this', for example


	var f = function() {
		
		console.log(this.symbol);	// the symbol used to represent the data point on the line chart

	}
	
**4. .hoverColumn(fin, fout)** - fin/fout: **callbacks to trigger when mouse hovers in and out respectively over the data columns.**

**5. .clickColumn(f)** - f: **callback to trigger on click event.**

**6. .hrefColumn(cols)** - _coming soon_

**7. .eachColumn(f)** - f: **callback applied to each iteration.**


## Usage ##

Create a Raphael instance, 


    // bare bones
    var r = Raphael();
    // create at top left corner of #element
    var r = Raphael('line-chart');
    
    
Create a line chart,


    // bare bones
    var linechart = r.g.linechart(_params);
    // example
    var linechart = r.g.linechart(10,10,300,220,[1,2,3,4,5],[10,20,15,35,30], {"colors":["#444"], "symbol":"s", axis:"0 0 1 1"});


Attach hover event to linechart,


    // example
	r.g.linechart.hover(function() {
		this.symbol.attr({'fill':'#CCC'});
	}, function() {
		this.symbol.attr({'fill':'#444'});
	});
	

Attach click event to linechart,


    // example
    r.g.linechart.click(function() {
       alert("You clicked on the line chart!"); 
    });


## Others ##

There's two important internal methods that are used to create and return the objects for interaction with a gRaphael line chart, based on what methods you call.

.hover(), .click(), .each() create and return representations ('dots') of the data points used to plot the line. The dots have the following properties when they're returned in the context of 'this' to the methods you call,

	+ x
	+ y
	+ value
	+ line
	+ shade
	+ symbol
	+ symbols 
	+ axis
	
.hoverColumn(), .clickColumn(), .eachColumn() create and return groupings of data 'dots'. Columns have similar properties to their atomic counterparts but are usually array of values. 