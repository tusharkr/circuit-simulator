import React from 'react';
import radium from 'radium';
import Color from 'color';
import R from 'ramda';

import Button from '../../components/Button.js';

import Components from '../../diagram/components';
import camelToSpace from '../../utils/camelToSpace.js';

const { PropTypes } = React;

const lighten = s => new Color(s).lighten(0.2).rgbString();
const darken = s => new Color(s).darken(0.2).rgbString();

const getStyles = ({COLORS, STYLES}) => ({
  container: {
    display: 'flex',
    padding: '10px',
    margin: '5px 5px',
    backgroundColor: COLORS.insetBackground,
    borderRadius: '4px',
    boxShadow: [
      `inset 1px 1.5px 1px 0px ${darken(COLORS.insetBackground)}`,
      `inset -1px -1.5px 1px 0px ${lighten(COLORS.insetBackground)}`,
      `-0.5px -0.75px 1px 0px ${darken(COLORS.background)}`,
      `0.5px 0.75px 1px 0px ${lighten(COLORS.background)}`
    ].join(', ')
  },
  outerBase: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    flexGrow: '1'
  },
  content: {
    outer: {
      justifyContent: 'space-around',
      alignItems: 'flex-start'
    }
  },
  empty: {
    outer: {
      justifyContent: 'center',
      alignItems: 'center'
    },
    inner: {
      alignSelf: 'center'
    }
  },
  title: STYLES.title
});

class ComponentInspector extends React.Component {

  constructor(props) {
    super(props);
    // this.state = {
    //   value: undefined
    // };
    // this.onValueChange = this.onValueChange.bind(this);
    // this.onValueKeyPress = this.onValueKeyPress.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
  }

  // onValueChange(event) {
  //   const value = event.target.value;
  //   this.setState({
  //     value
  //   });
  //   console.log('onValueChange', value);
  //   // TODO this.props.changeComponentValue(this.props.selectedComponent.id, value);
  // }
  //
  // onValueKeyPress(event) {
  //   console.log('onValueKeyPress', event.which);
  //   console.log(this.state.value || this.props.selectedComponent.props.value);
  // }

  handleDelete() {
    this.props.onDeleteComponent(this.props.selectedComponent.id);
  }

  render() {
    const { selectedComponent, style } = this.props;
    const styles = getStyles(this.context.theme);
    return (
      <div style={R.merge(style, styles.container)}>
        {(() => {
          if (selectedComponent) {
            const {typeID, props: {value}} = selectedComponent;
            const unit = Components[typeID].unit;

            // <div>
            //   <input type='number' name='value' min='1' max='1000000' value={value} onChange={this.onValueChange} onKeyPress={this.onValueKeyPress} />{unit}
            // </div>
            const showValue = () => (
              <div>{value}{unit}</div>
            );

            return (
              <div style={R.merge(styles.outerBase, styles.content.outer)}>
                <div style={styles.title}>
                  {camelToSpace(typeID)}
                </div>
                {value ? showValue() : null}
                <Button style={styles.button}
                  onClick={this.handleDelete}
                >
                  <span>Delete</span>
                </Button>
              </div>
            );
          } else {
            return (
              <div style={R.merge(styles.outerBase, styles.empty.outer)}>
                <span style={styles.empty.inner}>No component selected</span>
              </div>
            );
          }
        })()}
      </div>
    );
  }
}

ComponentInspector.propTypes = {
  style: PropTypes.object,

  // state
  selectedComponent: PropTypes.shape({
    typeID: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    props: PropTypes.shape({
      value: PropTypes.number
    }).isRequired
  }),

  // action creators
  // changeComponentValue: PropTypes.func.isRequired,
  onDeleteComponent: PropTypes.func.isRequired
};

ComponentInspector.contextTypes = {
  theme: PropTypes.object.isRequired
};

export default radium(ComponentInspector);
