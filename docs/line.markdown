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
