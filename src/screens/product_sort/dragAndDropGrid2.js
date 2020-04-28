import React, { Component } from "react";
import {
    GridContextProvider,
    GridDropZone,
    GridItem,
    swap
  } from "react-grid-dnd";
  
  export function DragAndDropGrid(props) {

    const {
        items,
        ItemComponent,
        itemToProps,
        handleChange,
    } = props
  
    // target id will only be set if dragging from one dropzone to another.
    function onChange(sourceId, sourceIndex, targetIndex, targetId) {
      const nextState = swap(items, sourceIndex, targetIndex);
      handleChange(nextState);
    }
  
    return (
      <GridContextProvider onChange={onChange}>
        <GridDropZone
          id="items"
          boxesPerRow={4}
          rowHeight={260}
          style={{ height: Math.ceil(items.length / 4) * 300 + "px" }}
        >
          {items.map(item => (
            <GridItem key={item.id}>
              <ItemComponent
                {...itemToProps(item)}
              >
                {item}
              </ItemComponent>
            </GridItem>
          ))}
        </GridDropZone>
      </GridContextProvider>
    );
  }