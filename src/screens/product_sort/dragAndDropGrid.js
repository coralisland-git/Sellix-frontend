import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import VirtualDraggableGrid from 'react-virtual-draggable-grid';
 
const ItemComponent = props => {
  const { name, styles } = props;
 
  return (
    <div
      style={{
        userSelect: 'none',
        border: '1px solid black',
        fontFamily: 'sans-serif',
        background: '#91c6a6',
        ...styles,
      }}
    >
      <p
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          margin: 0,
          width: '100%',
          height: '60%',
          fontSize: 18,
        }}
      >
        {`Draggable ${name}!`}
      </p>
      <button
        type="button"
        style={{
          cursor: 'pointer',
          boxSizing: 'border-box',
          width: '100%',
          height: '40%',
          boxShadow: 'none',
          borderWidth: '1px 0 0 0',
          borderStyle: 'solid',
          borderColor: 'black',
          background: '#ccc',
          fontSize: 18,
        }}
        onClick={() => console.log('Clicked without initiating drag', name)}
      >
        {`Prevent Button Drag`}
      </button>
    </div>
  );
};
 
ItemComponent.propTypes = {
  name: PropTypes.string.isRequired,
  styles: PropTypes.object,
};
 
ItemComponent.defaultProps = {
  styles: {},
};
 
export class DragAndDropGrid extends React.Component {
  constructor(props) {
    super(props);
 
    const defaultParams = {
      fixedWidth: 300,
      fixedHeight: 251,
      ItemComponent: props.ItemComponent || ItemComponent,
      itemProps: {
        styles: {
          width: 'calc(100% - 2px)',
          height: 'calc(100% - 2px)',
        },
      }
    };

    const { items, itemToProps } = this.props

 
    const x = props.width || 3;
    const y = props.height || 2;
    const itemsToRender = [];

    let i = 0;

    console.log('items', items, x, y)
 
    for (let iY = 0; /*iY < y &&*/ i < items.length; iY += 1) {
        console.log('hy')
      const row = [];
      itemsToRender.push(row);
      for (let iX = 0; iX < x && i < items.length; iX += 1) {
          console.log('hx')

        const item = items[i];

        const newItem = { ...defaultParams };
        const increment = iX + iY * x;
        const key = `item-${increment}`;
 
        newItem.key = key;
        newItem.itemProps = { ...defaultParams.itemProps, name: key };
        // newItem.fixedWidth = defaultParams.fixedWidth + 20 * increment;
        // newItem.fixedHeight = defaultParams.fixedHeight + 20 * increment;

        newItem.itemProps = itemToProps(item, i)
        newItem.sourceItem = item
 
        row.push(newItem);

        i++;
      }
    }
 
    this.state = { items: itemsToRender };
  }
 
  // optional; RVDG works as a controlled
  // or an uncontrolled component
  getItems = items => {

    const x = this.props.width || 3;

    const flatItems = items.flat()

    const newItems = []

    for (let i=0,j=flatItems.length; i<j; i+=x) {
        newItems.push(flatItems.slice(i,i+x))
    }

      console.log('newItems', newItems)
    this.setState({ items: newItems });

    if(this.props.handleChange) {
        this.props.handleChange(newItems.flat().map(x => x.sourceItem))
    }
  };
 
  render() {
    console.log('itemsRender', this.state.items)
    return (
      <div style={{ width: '100vw', height: '100vh', margin: 20 }}>
        <VirtualDraggableGrid
          items={this.state.items}
          noDragElements={['button']}
          gutterX={10}
          gutterY={10}
          scrollBufferX={300}
          scrollBufferY={300}
          getItems={this.getItems}
        />
      </div>
    );
  }
}