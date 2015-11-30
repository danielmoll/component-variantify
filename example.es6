import React, { PropTypes } from 'react';
import createVariantSwitcher, { defaultGenerateClassNameList } from '.';

const isComponent = PropTypes.oneOfType([ PropTypes.func, PropTypes.string ]);
class ComposedComponent extends React.Component {

  static propTypes = {
    generateClassNameList: PropTypes.func,
    components: PropTypes.shape({
      Information: isComponent,
    }),
  };

  static defaultProps = {
    generateClassNameList: defaultGenerateClassNameList,
    components: {
      Information: () => <div>Nothing by default</div>,
    },
  };

  render() {
    const { generateClassNameList, components = {}, ...remainingProps } = this.props;
    const { Information } = components;
    return (
      <div className={generateClassNameList('composed-component').join(' ')}>
        <span className={generateClassNameList('composed-component__header').join(' ')}>
          Details of <strong>film</strong>
        </span>
        <div className={generateClassNameList('composed-component__body').join(' ')}>
          <Information {...remainingProps} />
        </div>
      </div>
    );
  }

}

function BasicInformation({ title, director }) {
  return (
    <div>
      <h1>{title} by {director}</h1>
    </div>
  );
}
function ExtendedInformation({ title, director, synopsis, rating }) {
  return (
    <ul>
      <li><strong>{title}</strong> ({rating})</li>
      <li>Director: {director}</li>
      <li>Synopsis: {synopsis}</li>
    </ul>
  );
}

const config = {
  defaultVariant: 'basic',
  variants: {
    'basic': {
      'Information': BasicInformation,
    },
    'extended': {
      'Information': ExtendedInformation,
    },
  },
};
const VariantSwitcherComponent = createVariantSwitcher(config)(ComposedComponent);
export default (
  <div>
    <VariantSwitcherComponent
      title="E.T."
      director="Steven Spielberg"
    />
    <VariantSwitcherComponent
      variantName="extended"
      title="Trust"
      director="Hal Hartley"
      synopsis="...blah blah blah..."
      rating="5 stars"
    />
  </div>
);
