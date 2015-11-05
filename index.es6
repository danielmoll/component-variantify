import React, { Component, PropTypes } from 'react';

export const defaultGenerateClassNameList = (defaultClassName) => [ defaultClassName ];

export function withVariantClassNameList({ defaultVariant }) {
  return (ComposedComponent) => class WithVariantClassNameListComponent extends Component {

    static get propTypes() {
      return {
        variantName: PropTypes.string,
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

export function createVariant(components = {}, defaultVariant) {
  return (ComposedComponent) => class VariantComponent extends Component {
    render() {
      const VariantStyledComponent = withVariantClassNameList({ defaultVariant })(ComposedComponent);
      // If variant-specific components were found then passthrough,
      // otherwise just pass the remainingProps and variantName.
      const overriddenComponents = Object.assign(
        (ComposedComponent.defaultProps || {}).components || {},
        components
      );
      return (
        <VariantStyledComponent
          components={overriddenComponents}
          {...this.props}
        />
      );
    }
  };
}

export function withSwitchableInnerComponents({ variants = {}, defaultVariant }) {
  const variantsAvailable = Object.keys(variants);
  return (ComposedComponent) => class VariantSwitcherComponent extends Component {

    static get propTypes() {
      return {
        variantName: PropTypes.oneOf(variantsAvailable),
      };
    }

    render() {
      const { variantName, ...remainingProps } = this.props;
      const components = variants[variantName] || variants[defaultVariant] || {};
      const VariantComponent = createVariant(components, defaultVariant)(ComposedComponent);
      return (
        <VariantComponent
          variantName={variantName}
          {...remainingProps}
        />
      );
    }
  };
}

export default function createVariantSwitcher(config = {}) {
  return withSwitchableInnerComponents(config);
}
