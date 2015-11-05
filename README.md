# component-variantify
> HOCs to help create variants of components

A higher-order component that offers a common way of creating component variants.

Its purpose is to help wrap generalised components when specialised styling,
structure, content or behaviour are required.

## Goals

- [x] Allows a developer to *variantify* as little or as much as they want. You are not forced to do masses of overriding when you only want to change one thing (e.g. the `ArticleHeader` is swapped, but the rest is vanilla).
- [x] Allows variants with radically-different HTML to co-exist.
- [x] Separation of styling concerns using variant-specific classes. Attempts to avoid styling clashes.
- [x] A common interface to describe variants and to enable easy switching between them using a property. Useful in future for A/B testing.

## Usage

```javascript
import { createVariant } from '@economist/component-variantify';
import ArticleBodyComponent from './body';
import TabView from '@economist/component-tabview';

const WorldIfArticleBody = createVariant({
  Blockquote: 'blockquote',
  TabView: TabView,
}, 'world-if')(ArticleTemplate);

const data = {};
return (
  <WorldIfArticleBody {...data} />
)
```

[See `example.es6` for further usage instructions.](./example.es6)

## Design

A function `createVariant` is provided that will:

1. Prefix the class name of the component it wraps
2. Alter the inner components of the component it wraps

There is also another function exposed by default: `createVariantSwitcher`.
When using this `variantName` can be passed in as a `prop` to affect the inner components that are passed into the `Component` it wraps. Like so:

`<VariantComponentSwitcher variantName="look-or-feel-id" />`.

#### NOTES

`createVariantSwitcher` wraps a component with `withSwitchableInnerComponents`

`withSwitchableInnerComponents` allows a developer to declaratively switch between the components that should be rendered by the wrapped component. It calls `createVariant` behind the scenes.

`createVariant` creates a component with some injected `components` and also wraps this component with `withVariantClassNameList`.

`withVariantClassNameList` gives a developer a helper function
`generateClassNameList` that will generate additional variant classes when passed a class name.

## Install

```
npm install --save @economist/component-variantify;
```

## Run tests

```
npm test;
```

## Creating a new variant

First, you must have a `*Template` component that renders itself based on a `props.components` object.

Then you must create an `index.es6` like so:
```javascript
import createVariantSwitcher from '@economist/component-variantify';
import ArticleTemplate from '@economist/component-articletemplate';

import {
  VariantHeader,
  VariantSubheader,
  VariantBody,
  VariantFooter,
} from './variant-items';
import {
  OtherVariantHeader,
  OtherVariantSubheader,
  OtherVariantBody,
  OtherVariantFooter,
} from './other-variant-items';

const config = {
  defaultVariant: 'variant-name',
  variants: {
    'variant-name': {
      ArticleHeader: VariantHeader,
      ArticleSubheader: VariantSubheader,
      ArticleBody: VariantBody,
      ArticleFooter: VariantFooter,
    },
    'other-variant-name': {
      ArticleHeader: OtherVariantHeader,
      ArticleSubheader: OtherVariantSubheader,
      ArticleBody: OtherVariantBody,
      ArticleFooter: OtherVariantFooter,
    },
  },
};

export default createVariantSwitcher(config)(ArticleTemplate);
```

And finally, create an `index.css` and import it in your `App`'s styling:
```css
.variant-name-article-template__container {
  // ...
}
```
