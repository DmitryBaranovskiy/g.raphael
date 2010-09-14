# g.dot.js #

## Requirements ##

 + raphael.js
 + g.raphael.js
 + g.dot.js
 
## Overview ##

Creates a dot chart.

## Parameters ##

**1. x** number **X coordinate of the centre**

**2. y** number **Y coordinate of the centre**

**3. width** number **width**

**4. height** number **height**

**5. valuesx** array of numbers **Values for x-axis.**

**6. valuesy** array of numbers **Values for y-axis.**

**7. size** array of numbers **Values for dot data.**

**8. opts** object **Options (more info soon.)**

_opts_

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

**max**

Value - number. If omitted, this defaults to 100. This sets the max radius for the maximum value of your dot.

**href**

Value - array of links(string). This is positional and will be mapped from left to right. For example, if you supply 'href:["http://www.google.com","http://www.yahoo.com"]' and you have 4 dots, the links will be applied to the first two.

**axis**

Value - "_top_ _right_ _bottom_ _left_". If omitted, no axis will be rendered for the line chart. For example, if you wanted axis rendered for the left and bottom, (as in a typical x-y chart), you'll add 'axis:"0 0 1 1"' to opts. The axis is created using g.axis (for more information, see the g documentation).

**axisxlabels**

Value - array of labels.

**axisylabels**

Value - array of labels(string).

**axisxstep**

Value - number. Sets the stepping for the x-axis.

**axisystep**

Value - number. Sets the stepping for the y-axis.

**heat**

Value - boolean. If omitted, defaults to false. Sets a spectrum of color based on your values evenly across the dots.

## Methods ##

**1. .hover(fin, fout)** - fin/fout: **callbacks to trigger when mouse hovers in and out respectively over the dots.**

**2. .click(f)** - f: **callback to trigger on click event.**

**3. .each(f)** - f: **callback applied to each iteration.**

## Usage ##

Create a Raphael instance, 


    // bare bones
    var r = Raphael();
    // create at top left corner of #element
    var r = Raphael('dot-chart');
    
    
Create a dot chart,


    // bare bones
    var dotchart = r.g.dotchart(_params);
    // example
    var dotchart = r.g.dotchart(10,10,300,220,[5,10,15,20,25],[220,220,220,220,220],[1,2,3,4,5], {max:10});
    
    
Create labels,


    // example
    var axisx = ["dot1","dot2","dot3","dot4","dot5"]
    r.g.dotchart(10,10,300,220,[5,10,15,20,25],[220,220,220,220,220],[1,2,3,4,5], {max:10, axis: "0 0 1 0", axisxlabels: axisx, axisxstep: 4, heat: true});

    
Attach click event to dotchart,


    // example
     var dots = r.g.dotchart(10,10,300,220,[5,10,15,20,25],[220,220,220,220,220],[1,2,3,4,5], {max:10, href: ["http://www.google.com","http://www.yahoo.com",,,"http://www.raphaeljs.com"]});
      dots.each(function() {
        this.click(function() {
          // alerts href, if defined
          alert(this.attrs.href);
        });
      });
    
## Others ##
