# g.bar.js #

## Requirements ##

 + raphael.js
 + g.raphael.js
 + g.bar.js
 
## Overview ##

Creates a bar chart.

## Parameters ##

**1. x** number **X coordinate of the centre**

**2. y** number **Y coordinate of the centre**

**3. width** number **width**

**4. height** number **height**

**5. values** array of numbers **Values for your bars.**

**5. opts** object **Options (more info soon.)**

_opts_

**type**

Values are,

    + "round"
    + "sharp"
    + "soft"
    + "square"
    
Defaults to "square" if type is not specified.

**stacked**

Values are,

    + true
    + false
    
Defaults to false. Use this to stack your bars instead of displaying them side by side.

## Methods ##

**1. .hover(fin, fout)** - fin/fout: **callbacks to trigger when mouse hovers in and out respectively over the bars.**

## Usage ##

Create a bar chart,


    // bare bones
    var barchart = r.g.barchart(_params);
    // example
    var barchart = r.g.barchart(10, 10, 300, 220, [[30, 20, 10]]);
    
    
Create a stacked bar chart,


    // example
    var barchart = r.g.barchart(10, 10, 300, 220, [[30, 20, 10], [44, 66, 88]], {stacked:true});
    
## Additional observations ##


    
