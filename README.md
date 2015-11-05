# component-variantify
> HOCs to help create variants of components

A higher-order component that offers a common way of creating component variants.

Its purpose is to help wrap generalised components when specialised styling,
structure, content or behaviour are required.

A `variantName` can be passed in as a `prop`, like so `<VariantComponentSwitcher variantName="look-or-feel-id" />`, to:

1. Prefix the class name of the component it wraps
2. Alter the inner components of the component it wraps

## Goals

- [x] Allows a developer to *variantify* as little or as much as they want. You are not forced to do masses of overriding when you only want to change one thing (e.g. the `ArticleHeader` is swapped, but the rest is vanilla).
- [x] Allows variants with radically-different HTML to co-exist.
- [x] Separation of styling concerns using variant-specific classes. Attempts to avoid styling clashes.  
- [x] A common interface to describe variants and to enable easy switching between them using a property. Useful in future for A/B testing.

## Design

`createVariantSwitcher` calls `withSwitchableInnerComponents`

`withSwitchableInnerComponents` allows a developer to declaratively switch between the components that are composed by the wrapped component. It calls `createVariant` behind the scenes.

`createVariant` creates a component with some injected `components` and also uses `withVariantClassNameList` against the component that it composes.

`withVariantClassNameList` gives a developer a helper function
`generateClassNameList` that will generate additional variant classes when
passed a class name.

## Usage

```javascript
import { createVariant } from '@economist/component-variantify';
import ArticleBodyComponent from './body';

const WorldIfArticleBody = createVariant({
  Blockquote: 'blockquote',
}, 'world-if');

const data = {};
return (
  <WorldIfArticleBody {...data} />
)
```

[See `example.es6` for further usage instructions.](./example.es6)


## Install

```
npm install --save @economist/component-variantify;
```

## Run tests

```
npm test;
```

## Creating a new variant

Create an `index.es6` like so:
```javascript
import createVariantSwitcher from '@economist/component-variantify';
// The ArticleTemplate must have a `components`
// prop that is used to render its elements.
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

Create an `index.css` like so, and import it in your `App`'s styling:
```css
.variant-name-article-template__container {
  // ...
}
```
