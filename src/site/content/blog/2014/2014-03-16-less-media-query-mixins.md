---
title: LESS media query mixins
---

As LESS 1.7.0 now supports [passing rulesets to mixins](http://lesscss.org/features/#detached-rulesets-feature) i made some mixins for media queries using common Bootstrap screen sizes.

I also [suggested](https://github.com/twbs/bootstrap/issues/12974) this to be included in future releases of Bootstrap and they seem to [adopt](https://github.com/twbs/bootstrap/pull/13014) my old dirty version... :P

Whatever... let's say you want a media query to address medium screens and below, here you go:

```css
.my-element {
    .screen-md-max({
       color: red;
    });
}
```

This will generate the following CSS:

```css
@media (max-width: 1199px) {
    .my-element {
        color: red;
    }
}
```

Or, let's address three rulesets with a shorthand for mobile screens (xs), tablet screens (sm) and medium screens and above (md-min):

```css
.my-element {
    .screen({
        color: red;
    },{
        color: green;
    },{
        color: yellow;
    });
}
```

will generate:

```css
@media (max-width: 767px) {
  .my-element {
    color: red;
  }
}
@media (min-width: 768px) and (max-width: 991px) {
  .my-element {
    color: green;
  }
}
@media (min-width: 992px) {
  .my-element {
    color: yellow;
  }
}
```

## Finally, the mixins...   
As you can see, i added a fifth screen size `@screen-xl` to adress extra large desktop screens over 1600 pixels width:

```css
/* =============================================================================
   Screen size variables
   ========================================================================== */

@screen-xs:                        480px;
@screen-xs-min:                    @screen-xs;
@screen-sm:                        768px;
@screen-sm-min:                    @screen-sm;
@screen-md:                        992px;
@screen-md-min:                    @screen-md;
@screen-lg:                        1200px;
@screen-lg-min:                    @screen-lg;
@screen-xl:                        1600px;
@screen-xl-min:                    @screen-xl;
@screen-xs-max:                    ( @screen-sm-min - 1 );
@screen-sm-max:                    ( @screen-md-min - 1 );
@screen-md-max:                    ( @screen-lg-min - 1 );
@screen-lg-max:                    ( @screen-xl-min - 1 );

/* =============================================================================
   Media queries for different screen sizes
   ========================================================================== */

// xs only
.screen-xs(@rules) {
    @media (max-width: @screen-xs-max) { @rules(); }
}

// sm and larger
.screen-sm-min(@rules) {
    @media (min-width: @screen-sm-min) { @rules(); }
}

// sm only
.screen-sm(@rules) {
    @media (min-width: @screen-sm-min) and (max-width: @screen-sm-max) { @rules(); }
}

// sm and smaller
.screen-sm-max(@rules) {
    @media (max-width: @screen-sm-max) { @rules(); }
}

// md and larger
.screen-md-min(@rules) {
    @media (min-width: @screen-md-min) { @rules(); }
}

// md only
.screen-md(@rules) {
    @media (min-width: @screen-md-min) and (max-width: @screen-md-max) { @rules(); }
}

// md and smaller
.screen-md-max(@rules) {
    @media (max-width: @screen-md-max) { @rules(); }
}

// lg and larger
.screen-lg-min(@rules) {
    @media (min-width: @screen-lg-min) { @rules(); }
}

// lg only
.screen-lg(@rules) {
    @media (min-width: @screen-lg-min) and (max-width: @screen-lg-max) { @rules(); }
}

// lg and smaller
.screen-lg-max(@rules) {
    @media (max-width: @screen-lg-max) { @rules(); }
}

// xl and larger
.screen-xl(@rules) {
    @media (min-width: @screen-xl-min) { @rules(); }
}

// 1: xs only, 2: sm and larger
.screen(@rules-xs, @rules-sm) {
    .screen-xs(@rules-xs);
    .screen-sm-min(@rules-sm);
}

// 1: xs only, 2: sm only, 3: md and larger
.screen(@rules-xs, @rules-sm, @rules-md) {
    .screen-xs(@rules-xs);
    .screen-sm(@rules-sm);
    .screen-md-min(@rules-md);
}

// 1: xs only, 2: sm only, 3: md only, 4: lg and larger
.screen(@rules-xs, @rules-sm, @rules-md, @rules-lg) {
    .screen-xs(@rules-xs);
    .screen-sm(@rules-sm);
    .screen-md(@rules-md);
    .screen-lg-min(@rules-lg);
}

// 1: xs only, 2: sm only, 3: md only, 4: lg only, 5: xl and larger
.screen(@rules-xs, @rules-sm, @rules-md, @rules-lg, @rules-xl) {
    .screen-xs(@rules-xs);
    .screen-sm(@rules-sm);
    .screen-md(@rules-md);
    .screen-lg(@rules-lg);
    .screen-xl(@rules-xl);
}
```
