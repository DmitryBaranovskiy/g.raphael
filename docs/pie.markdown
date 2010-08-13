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

**4. values** array of numbers **Values for your sectors.**

**5. opts** object **Options (more info soon.)**

_opts_

**legend**

Values are,

    + legend - e.g. ["apples", "oranges"]
    + legendothers
    + legendmark 
    + legendpos - e.g. "west"

legend is required. If legendpos is omitted, 'east' is assumed. If legendmark is omitted, 'disc' is assumed. The current possible options for legendmark are,

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
        // when mouse hovers over sector 
        this.sector.attr({fill:"#FAA"});
    }, function() {
        // when mouse hovers out
        this.sector.attr({fill:"#666"});
    });
    
Attach click event to piechart,


    // example
    r.g.piechart.click(function() {
       alert("You clicked on the pie chart!"); 
    });
    
## Others ##

N/A