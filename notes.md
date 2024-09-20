# CS260 Notes

## Git

### The Git Development Cycle
1. `git pull`
2. Develop
3. `git add <...>`
4. `git commit`
5. `git push`

## EC2

IP (elastic): [34.238.238.39](http://34.238.238.39)

## HTML

### Elements to Remember

* `header` - block
* `footer` - block
* `section` - block
* `aside` - block

### Input

* `<fieldset><legend>...</legend></fieldset>`
* `<label for="id">...</label>`
* `<optgroup label="...">...</optgroup>`
* `<output value="0" />`
* `<meter min="0" max="100" value="50" />`

Valid input types: text\*, password\*, email\*, tel\*, url\*, search\*, number, checkbox, radio, range, date, datetime-local, month, week, color, file, submit.

\* - Supports `pattern`. 

Inputs can have `required`, `placeholder`.

Radios must share the `name` attribute.

### Media
* `<audio controls src="..." />`
* `<video controls crossorigin="anonymous"><source src="..."/></video>`

## CSS

### Interesting selectors
* `div ~ p` - General sibling
* `div + p` - Adjacent sibling

### Interesting units
* `em` - Multiplier of width of letter `m` in parent.
* `rem` - Multiplier of width of letter `m` in root.
* `ex` - Multiplier of height of element's font.
* `vmin` - Percent of smallest screen dimension.
* `vmax` - Percent of largest screen dimension.

### Animation
```css
div {
    animation-name: anim-name;
    animation-duration: 3s;
}

@keyframes anim-name {
    from {
        top: 0;
    }

    75% {
        top: 50;
    }

    to {
        top: 100;
    }
}
```
