---
title: LESS gradient mixins with unlimited colorstops and vendor prefixes
---
I recently made some LESS gradient mixins which allow unlimited colors.
They create gradient definitions with vendor prefixed including old webkit colorstops and IE gradient alternatives.

Function naming is according to Bootstrap's gradient mixins, as most people including myself are used to these.
I also [suggested](https://github.com/twbs/bootstrap/issues/12973) them to be included in Bootstrap as their own mixins only allow limited colors. But this seems to be a [longer discussion](https://github.com/twbs/bootstrap/pull/12558)...

Although these days Autoprefixer handles vendor prefixing for gradients and all other stuff, it doesn't provide alternatives for IE.

Further more, using those mixins feels more comfortable and convenient to me.

So here's an example for a vertical gradient with four colors:

```css
#gradient > .vertical(
    red,
    yellow 33%,
    green 66%,
    blue
);
```

The above LESS code will be parsed to the following CSS:

```css
background-image: -webkit-gradient(linear, left top, left bottom, color-stop(0%,#ff0000),color-stop(33%,#ffff00),color-stop(66%,#008000),color-stop(100%,#0000ff));
background-image: -webkit-linear-gradient(top, #ff0000, #ffff00 33%, #008000 66%, #0000ff);
background-image: -o-linear-gradient(top, #ff0000, #ffff00 33%, #008000 66%, #0000ff);
background-image: linear-gradient(to bottom, #ff0000, #ffff00 33%, #008000 66%, #0000ff);
background-repeat: repeat-x;
filter: progid:DXImageTransform.Microsoft.gradient(startColorstr='#ff0000', endColorstr='#0000ff', GradientType=0);
```

And here the mixins for vertical, horizontal, directional, radial and striped gradients:

```css
#gradient {
 
    // Filter color-stop params
    .color-stops(@color-stops-N...) {
        @color-stops: ~`"@{arguments}".replace(/(^\[)|(\]$)/g,'')`;
        @color-stops-webkit: ~`(function(c){
            for(var i=0; i<c.length; i++) {
                c[i] = c[i].trim().split(/\s+/);
                if(c[i].length==1)
                    c[i].push(i==0?"0%":"100%");
                c[i] = "color-stop("+c[i].reverse().join(',')+")";
            }
            return c.join(",");
        })("@{color-stops}".split(','))`;
    }
 
    // Creepy IE special treatment, fallback on first and last color-stop
    .ie-filter(@color-stops; @type) {
        filter: ~`(function(c,t){
            var a = c[0].split(/\s+/)[0].trim(),
                b = c.slice(-1)[0].trim().split(/\s+/)[0].trim();
            return "progid:DXImageTransform.Microsoft.gradient(startColorstr='"+a+"', endColorstr='"+b+"', GradientType="+t+")";
        })("@{color-stops}".split(','),@{type})`;
    }
 
    // Horizontal gradient, from left to right
    .horizontal(@color-stops-0: #555 0%, @color-stops-1: #333 100%, @color-stops-N...) {
        .color-stops(@arguments);
        background-image: -webkit-gradient(linear, left top, right top, @color-stops-webkit); // Chrome, Safari 4+
        background-image: -webkit-linear-gradient(left, @color-stops); // Safari 5.1-6, Chrome 10+
        background-image: -o-linear-gradient(left, @color-stops); // Opera 12
        background-image: linear-gradient(to right, @color-stops); // Standard, IE10, Firefox 16+, Opera 12.10+, Safari 7+, Chrome 26+
        background-repeat: repeat-x;
        #gradient > .ie-filter(@color-stops; 1); // IE9 and down, gets no color-stop at all for proper fallback
    }
 
    // Vertical gradient, from top to bottom
    .vertical(@color-stops-0: #555 0%, @color-stops-1: #333 100%, @color-stops-N...) {
        .color-stops(@arguments);
        background-image: -webkit-gradient(linear, left top, left bottom, @color-stops-webkit); // Chrome, Safari 4+
        background-image: -webkit-linear-gradient(top, @color-stops); // Safari 5.1-6, Chrome 10+
        background-image: -o-linear-gradient(top, @color-stops); // Opera 12
        background-image: linear-gradient(to bottom, @color-stops); // Standard, IE10, Firefox 16+, Opera 12.10+, Safari 7+, Chrome 26+
        background-repeat: repeat-x;
        #gradient > .ie-filter(@color-stops; 0); // IE9 and down, gets no color-stop at all for proper fallback
    }

    .directional(@deg: 45deg, @color-stops-0: #555 0%, @color-stops-1: #333 100%, @color-stops-N...) {
        .color-stops(@arguments);
        background-image: -webkit-linear-gradient(@deg, @color-stops); // Safari 5.1-6, Chrome 10+
        background-image: -o-linear-gradient(@deg, @color-stops); // Opera 12
        background-image: linear-gradient(@deg, @color-stops); // Standard, IE10, Firefox 16+, Opera 12.10+, Safari 7+, Chrome 26+
        background-repeat: repeat-x;
    }
 
    .radial(@color-stops-0: #555 0%, @color-stops-1: #333 100%, @color-stops-N...) {
        .color-stops(@arguments);
        background-image: -webkit-gradient(radial, center center, 0%, center center, 100%, @color-stops-webkit); // Chrome, Safari 4+
        background-image: -webkit-radial-gradient(circle, @color-stops); // Safari 5.1-6, Chrome 10+
        background-image: -o-radial-gradient(circle, @color-stops); // Opera 12+
        background-image: radial-gradient(circle, @color-stops); // Standard, IE10, Firefox 16+, Opera 12.10+, Safari 7+, Chrome 26+
        background-repeat: no-repeat;
    }
 
    .striped(@angle: 45deg; @color: rgba(255,255,255,.15)) {
        #gradient > .directional(@angle, @color 25%, transparent 25%, transparent 50%, @color 50%, @color 75%, transparent 75%, transparent);
        background-repeat: repeat;
    }
 
}
```

See also the [Gist](https://gist.github.com/simbo/9448334)...