/* eslint react/no-multi-comp: 0, init-declarations: 0, id-length: 0, id-match: 0 */
import React from 'react';
import { createRenderer } from 'react-addons-test-utils';

import createVariantSwitcher from '..';
import {
  createVariant,
  defaultGenerateClassNameList,
  withSwitchableInnerComponents,
  withVariantClassNameList,
} from '..';

import chai from 'chai';
const should = chai.should();
describe('variantify', () => {

  it('createVariantSwitcher should be exposed as default', () => {
    should.exist(createVariantSwitcher);
  });

  it('createVariant should be exposed as default', () => {
    should.exist(createVariant);
  });

  it('has defaultGenerateClassNameList exposed', () => {
    should.exist(defaultGenerateClassNameList);
  });

  it('has withSwitchableInnerComponents exposed', () => {
    should.exist(withSwitchableInnerComponents);
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

  describe('createVariant', () => {

    describe('props.components', () => {

      let renderer;
      beforeEach(() => {
        renderer = createRenderer();
      });

      describe('with no components in composed component\'s defaultProps and innerComponents', () => {

        it('should pass in an empty object', () => {
          class ComposedComponent extends React.Component {
            render() {
              return <div>Hello there <span>fellow developer</span>.</div>;
            }
          }

          const config = {
            defaultVariant: 'default-variant',
            innerComponents: {
              'ArticleHeader': 'component-goes-here',
            },
          };
          const VariantComponent = createVariant(config.innerComponents, config.defaultVariant)(ComposedComponent);
          renderer.render(<VariantComponent />);
          const renderOutput = renderer.getRenderOutput();
          renderOutput.type.name.should.equal('WithVariantClassNameListComponent');
          renderOutput.props.components.should.deep.equal(config.innerComponents);
        });

      });

      describe('with components in composed component\'s defaultProps and no innerComponents passed in', () => {

        it('should pass in the defaultProps components', () => {
          class ComposedComponent extends React.Component {
            static get defaultProps() {
              return {
                'components': {
                  'ArticleHeader': 'component-found-here',
                },
              };
            }

            render() {
              return <div>Hello there <span>fellow developer</span>.</div>;
            }
          }

          const config = {
            defaultVariant: 'default-variant',
            innerComponents: {},
          };
          const VariantComponent = createVariant(config.innerComponents, config.defaultVariant)(ComposedComponent);
          renderer.render(<VariantComponent />);
          const renderOutput = renderer.getRenderOutput();
          renderOutput.type.name.should.equal('WithVariantClassNameListComponent');
          renderOutput.props.components.should.deep.equal(ComposedComponent.defaultProps.components);
        });

      });

      describe('with components in composed component\'s defaultProps and innerComponents', () => {

        it('should pass in the matching variantNameComponents object', () => {
          class ComposedComponent extends React.Component {
            static get defaultProps() {
              return {
                'components': {
                  'ArticleBody': 'component-found-here',
                },
              };
            }

            render() {
              return <div>Hello there <span>fellow developer</span>.</div>;
            }
          }

          const config = {
            defaultVariant: 'default-variant',
            innerComponents: {
              'ArticleHeader': 'picked-component',
            },
          };
          const expected = config.innerComponents;
          expected.ArticleBody = 'component-found-here';

          const VariantComponent = createVariant(config.innerComponents, config.defaultVariant)(ComposedComponent);
          renderer.render(<VariantComponent />);
          const renderOutput = renderer.getRenderOutput();
          renderOutput.type.name.should.equal('WithVariantClassNameListComponent');
          renderOutput.props.components.should.deep.equal(expected);
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
        const config = {
          defaultVariant: 'variant-a',
        };

        const VariantComponent = withVariantClassNameList(config)(ComposedComponent);
        renderer.render(<VariantComponent variantName="variant-a" />);
        const renderOutput = renderer.getRenderOutput();
        renderOutput.type.name.should.equal('ComposedComponent');
        renderOutput.props.generateClassNameList.should.be.a('function');
      });

      describe('should generate a list containing', () => {

        it('the class that is passed in', () => {
          class ComposedComponent extends React.Component {
            render() {
              return <div>Hello there <span>fellow developer</span>.</div>;
            }
          }
          const config = {
            defaultVariant: 'variant-a',
          };

          const VariantComponent = withVariantClassNameList(config)(ComposedComponent);
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
          const config = {
            defaultVariant: 'variant-a',
          };

          const VariantComponent = withVariantClassNameList(config)(ComposedComponent);
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
          const config = {
            defaultVariant: null,
          };

          const VariantComponent = withVariantClassNameList(config)(ComposedComponent);
          renderer.render(<VariantComponent />);
          const renderOutput = renderer.getRenderOutput();
          const generateClassNameList = renderOutput.props.generateClassNameList;
          generateClassNameList('ClassName').should.not.include('variant-a-ClassName');
        });

      });

    });

  });

});
