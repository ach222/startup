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

### Flexbox
```css
div {
  /* grow, shrink, basis. */
  flex: 0 0 0;
}
```

### Grid
```css
div {
  /* repeated columns, min 300px, max 1 free fraction. */
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  /* repeated rows, constant height. */
  grid-auto-rows: 300px;
}
```

## JS

### Strings
* `length` (attr; not function)
* `indexOf`
* `split`
* `startsWith`
* `endsWith`
* `toLowerCase`

### Arrays
* `push`
* `pop`
* `slice`
* `sort`
* `values`
* `find`
* `forEach`
* `reduce`
* `map`
* `filter`
* `every`
* `some`

### Regex
* `str.match(exp)` -> `["match1", ...]`
* `str.replace(exp, val)`
* `str.test(exp)` -> `true/false`

### DOM
* `querySelector[All]()`

### LocalStorage
* `getItem(key)`
* `setItem(key, value)`
* `removeItem(key)`
* `clear()`

### express.js
* `app = express();`
* `app.listen(<port>);`
* `app.<method>((req, res, next) => void);`
* Middleware - `app.use()` - `(req, res, next) => void`, `(error, req, res, next) => void`, `express.static(<dir>)`