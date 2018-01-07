# Frame CLI
Frame CLI is a dead simple reusable web component compiler and documentation tool.

### Simple
Tiny tooling, non-opinionated, zero configuration, Typescript and SASS support with no overhead.

### Integration ready
Compiles into UMD, bundle and clean vanillaJS automatically.

### Shareable
Compiles Markdown into static HTML and JSON, with live examples.


## Getting started

### Install the CLI

```sh
$ npm install -g @framejs/cli
```

### Create a project

```sh
project/
├── my-component.ts
├── my-component.scss
└── readme.md
```

From the project root run:

```sh
$ wui build
```

This will generate:

```sh
project/
├── dist
│   ├── my-component.html // Component demo file
│   ├── my-component.json // Parsed markdown in json (including frontmatter keys)
│   ├── my-component.js // es6
│   ├── my-component.js.map // sourcemap
│   ├── my-component.bundle.js // Rollup IIFE es6 bundle
│   ├── my-component.bundle.js.map // Bundle sourcemap
│   ├── my-component.module.js // UMD module
│   ├── my-component.module.js.map // Module sourcemap
│   └── readme.md // Copied readme.md
├── my-component.ts
├── my-component.scss
└── readme.md
```

### CLI options

| Command      | Option            | Description                                                            |
|--------------|-------------------|------------------------------------------------------------------------|
| `frame build`  |                   | Compiles all files in project folder.                                  |
| `frame build`  | -i, --index `path_to.md`  | Relative path to .md file to use as index html, defaults to a directory listing.        |

| Command      | Option            | Description                                                            |
|--------------|-------------------|------------------------------------------------------------------------|
| `frame start`  |                   | Compiles and watches for file changes                                  |
| `frame start`  | -o, --open        | Opens styleguide in the default browser                                |
| `frame build`  | -i, --index `path_to.md`  | Relative path to .md file to use as index html, defaults to a directory listing.        |


### Inline CSS from SASS in component

In a `<style>` tag, make an absolute path reference to sass file:

```typescript
const template = `
    <style>
        @style('project/my-component.scss')
    </style>
`
```

_SASS compiles into autoprefixed CSS 2 browser versions behind based on caniuse_

### Component styleguide
Frame CLI compiles all `.md` into HTML and JSON, not limited to components and follows the directory structure.

#### Inline component demo
In markdown write:

<pre>&lt;!--
```
&lt;custom-element-demo&gt;
  &lt;template&gt;
    <span>&lt;script src="my-component.bundle.js"&gt;&lt;/script&gt;</span>
    <span>&lt;next-code-block&gt;&lt;/next-code-block&gt;</span>
  &lt;/template&gt;
&lt;/custom-element-demo&gt;
```
--&gt;<span>
```html
&lt;my-component&gt;&lt;/my-component&gt;
```
</span></pre>

> Paths should be relative from the files location in dist folder.

> All code in `<template>...</template>` will execute on demo page load.

### Make a web component library
If you have a project like this, make a single `my-component-libary.ts` file that imports the other components and the compiler compiles it into UMD, bundle and es6:

```sh
project/
├── my-component-libary.ts
└── components
    ├── my-component
    │   ├── my-component.ts
    │   ├── my-component.scss
    │   └── my-component.md
    └── my-other-component
        ├── my-other-component.ts
        └── my-other-component.md
```

In `my-component-libary.ts`:

```typescript
@import './components/my-component/my-component.js';
@import './components/my-other-component/my-other-component.js';
```

_When referencing to component files use ending `.js` so it works with native modules loading in supported browsers_

## Can you help?

Yes! The more people (and bots) the better.

Please create an issue, make a pull request, start a discussion or ping me on [twitter - @emolrmoeller](https://twitter.com/emilrmoeller).

## Development

For development, you can use this demo project that uses all the features of the cli [web-component-ui-demo](https://github.com/emolr/web-component-ui-demo)

## The future? 

* Implement a testing suite like [web-component-tester](https://github.com/Polymer/web-component-tester).
* Make the documentation pages themable and add features reading from package.json. Like add a git link if git has been configured in a package.json file for example.
* Update style on documentation in general.
* Have tests on this codebase.
