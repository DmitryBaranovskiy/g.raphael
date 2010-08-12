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

**4. values** array of numbers **Values (more info soon.)**

**5. opts** object **Options (more info soon.)**

    
## Methods ##

**1. .hover(fin, fout)** - fin/fout: **callbacks to trigger when mouse hovers in and out respectively over the pie sectors.**

**2. .click(f)** - f: **callback to trigger on click event.**

**3. .each(f)** - 


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
    
    
Attach hover event to piechart,


    // example
    
    
Attach click event to piechart,


    // example
    
## Additional observations ##

    
    


    
    

    
    