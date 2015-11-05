import React, { Component, PropTypes } from 'react';
import compose from 'lodash.compose';

export const defaultGenerateClassNameList = (defaultClassName) => [ defaultClassName ];

export function withVariedInnerComponents({ variants = {}, defaultVariant }) {
  return (ComposedComponent) => class WithVariedInnerComponents extends Component {
    render() {
      const { variantName, ...remainingProps } = this.props;
      // If variant-specific omponents were found then passthrough,
      // otherwise just pass the remainingProps and variantName.
      const components = Object.assign(
        (ComposedComponent.defaultProps || {}).components || {},
        variants[variantName] || variants[defaultVariant] || {}
      );
      return (
        <ComposedComponent
          variantName={variantName}
          components={components}
          {...remainingProps}
        />
      );
    }
  };
}

export function withVariantClassNameList({ variantsAvailable = [], defaultVariant }) {
  return (ComposedComponent) => class WithVariantClassNameListComponent extends Component {

    static get propTypes() {
      return {
        variantName: PropTypes.oneOf(variantsAvailable),
      };
    }

    static get defaultProps() {
      return {
        variantName: defaultVariant,
      };
    }

    getVariantClassNameListGetter(variantName) {
      return (specifiedClassName) => {
        const classNameList = [ specifiedClassName ];
        if (variantName) {
          classNameList.unshift(`${variantName}-${specifiedClassName}`);
        }
        return classNameList;
      };
    }

    render() {
      const { variantName, ...remainingProps } = this.props;
      const generateClassNameList = this.getVariantClassNameListGetter(variantName);
      return (
        <ComposedComponent
          variantName={variantName}
          generateClassNameList={generateClassNameList}
          {...remainingProps}
        />
      );
    }
  };
}

export default function variantify(config = {}) {
  return compose(
    withVariedInnerComponents(config),
    withVariantClassNameList({
      defaultVariant: config.defaultVariant,
      variantsAvailable: Object.keys(config.variants),
    })
  );
}
