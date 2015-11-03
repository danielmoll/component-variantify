/* eslint react/no-multi-comp: 0, init-declarations: 0, id-length: 0, id-match: 0 */
import React from 'react';
import { createRenderer } from 'react-addons-test-utils';

import variantify from '..';
import {
  defaultGenerateClassNameList,
  withVariedInnerComponents,
  withVariantClassNameList,
} from '..';

import chai from 'chai';
const should = chai.should();
describe('variantify', () => {

  it('the composition of the HOCs should be exposed as default', () => {
    should.exist(variantify);
  });

  it('has defaultGenerateClassNameList exposed', () => {
    should.exist(defaultGenerateClassNameList);
  });

  it('has withVariedInnerComponents exposed', () => {
    should.exist(withVariedInnerComponents);
  });

  it('has withVariantClassNameList exposed', () => {
    should.exist(withVariantClassNameList);
  });

  describe('defaultGenerateClassNameList', () => {

    it('should return an array containing the element passed in', () => {
      const element = 'ClassName';
      defaultGenerateClassNameList(element).should.deep.equal([ element ]);
    });

  });

  describe('withVariedInnerComponents', () => {

    describe('props.components', () => {

      let renderer;
      beforeEach(() => {
        renderer = createRenderer();
      });

      describe('with no components in composed component\'s defaultProps and no matching variantNameComponents', () => {

        it('should pass in an empty object', () => {
          class ComposedComponent extends React.Component {
            render() {
              return <div>Hello there <span>fellow developer</span>.</div>;
            }
          }

          const variantNameComponents = {
            'variant-not-matched': {
              'ArticleHeader': 'component-goes-here',
            },
          };
          const defaultVariant = 'default-variant';
          const VariantComponent = withVariedInnerComponents(
            variantNameComponents,
            defaultVariant
          )(ComposedComponent);
          renderer.render(<VariantComponent variantName="default-variant" />);
          const renderOutput = renderer.getRenderOutput();
          renderOutput.type.should.equal(ComposedComponent);
          renderOutput.props.components.should.deep.equal({});
        });

      });

      describe('with components in composed component\'s defaultProps and no matching variantName or default', () => {

        it('should pass in the defaultProps components', () => {
          class ComposedComponent extends React.Component {
            static get defaultProps() {
              return {
                'components': {
                  'default-variant': {
                    'ArticleHeader': 'component-found-here',
                  },
                },
              };
            }

            render() {
              return <div>Hello there <span>fellow developer</span>.</div>;
            }
          }

          const variantNameComponents = {
            'variant-not-matched': {
              'ArticleHeader': 'component-goes-here',
            },
          };
          const defaultVariant = 'default-variant';
          const VariantComponent = withVariedInnerComponents(
            variantNameComponents,
            defaultVariant
          )(ComposedComponent);
          renderer.render(<VariantComponent variantName="default-variant" />);
          const renderOutput = renderer.getRenderOutput();
          renderOutput.type.should.equal(ComposedComponent);
          renderOutput.props.components.should.deep.equal(ComposedComponent.defaultProps.components);
        });

      });

      describe('with no components in composed component\'s defaultProps and matching variantName', () => {

        it('should pass in the matching variantNameComponents object', () => {
          class ComposedComponent extends React.Component {
            render() {
              return <div>Hello there <span>fellow developer</span>.</div>;
            }
          }

          const variantNameComponents = {
            'default-variant': {
              'ArticleHeader': 'component-goes-here',
            },
            'picked-variant': {
              'ArticleHeader': 'picked-component',
            },
          };
          const defaultVariant = 'default-variant';
          const variantName = 'picked-variant';
          const VariantComponent = withVariedInnerComponents(
            variantNameComponents,
            defaultVariant
          )(ComposedComponent);
          renderer.render(<VariantComponent variantName={variantName} />);
          const renderOutput = renderer.getRenderOutput();
          renderOutput.type.should.equal(ComposedComponent);
          renderOutput.props.components.should.deep.equal(variantNameComponents[variantName]);
        });

      });

      describe('with no components in composed component\'s defaultProps and matching default', () => {

        it('should pass in the default variantNameComponents object', () => {
          class ComposedComponent extends React.Component {
            render() {
              return <div>Hello there <span>fellow developer</span>.</div>;
            }
          }

          const variantNameComponents = {
            'default-variant': {
              'ArticleHeader': 'component-goes-here',
            },
          };
          const defaultVariant = 'default-variant';
          const VariantComponent = withVariedInnerComponents(
            variantNameComponents,
            defaultVariant
          )(ComposedComponent);
          renderer.render(<VariantComponent variantName="does-not-match" />);
          const renderOutput = renderer.getRenderOutput();
          renderOutput.type.should.equal(ComposedComponent);
          renderOutput.props.components.should.deep.equal(variantNameComponents[defaultVariant]);
        });

      });

    });

  });

  describe('withVariantClassNameList', () => {

    describe('props.generateClassNameList', () => {

      let renderer;
      beforeEach(() => {
        renderer = createRenderer();
      });

      it('should be passed into the composed component', () => {
        class ComposedComponent extends React.Component {
          render() {
            return <div>Hello there <span>fellow developer</span>.</div>;
          }
        }

        const VariantComponent = withVariantClassNameList({
          variants: [ 'variant-a', 'variant-b', 'variant-c' ],
          defaultVariant: 'variant-a',
        })(ComposedComponent);
        renderer.render(<VariantComponent variantName="variant-a" />);
        const renderOutput = renderer.getRenderOutput();
        renderOutput.type.should.equal(ComposedComponent);
        renderOutput.props.generateClassNameList.should.be.a('function');
      });

      describe('should generate a list containing', () => {

        it('the class that is passed in', () => {
          class ComposedComponent extends React.Component {
            render() {
              return <div>Hello there <span>fellow developer</span>.</div>;
            }
          }

          const VariantComponent = withVariantClassNameList({
            variants: [ 'variant-a', 'variant-b', 'variant-c' ],
            defaultVariant: 'variant-a',
          })(ComposedComponent);
          renderer.render(<VariantComponent variantName="variant-a" />);
          const renderOutput = renderer.getRenderOutput();
          const generateClassNameList = renderOutput.props.generateClassNameList;
          generateClassNameList('ClassName').should.include('ClassName');
        });

        it('a variant-specific class from the class that is passed in; iff variantName', () => {
          class ComposedComponent extends React.Component {
            render() {
              return <div>Hello there <span>fellow developer</span>.</div>;
            }
          }

          const VariantComponent = withVariantClassNameList({
            variants: [ 'variant-a', 'variant-b', 'variant-c' ],
            defaultVariant: 'variant-a',
          })(ComposedComponent);
          renderer.render(<VariantComponent variantName="variant-a" />);
          const renderOutput = renderer.getRenderOutput();
          const generateClassNameList = renderOutput.props.generateClassNameList;
          generateClassNameList('ClassName').should.include('variant-a-ClassName');
        });

        it('no variant-specific class from the class that is passed in; iff no variantName', () => {
          class ComposedComponent extends React.Component {
            render() {
              return <div>Hello there <span>fellow developer</span>.</div>;
            }
          }

          const VariantComponent = withVariantClassNameList({
            variants: [ 'variant-a', 'variant-b', 'variant-c' ],
            defaultVariant: null,
          })(ComposedComponent);
          renderer.render(<VariantComponent />);
          const renderOutput = renderer.getRenderOutput();
          const generateClassNameList = renderOutput.props.generateClassNameList;
          generateClassNameList('ClassName').should.not.include('variant-a-ClassName');
        });

      });

    });

  });

});
