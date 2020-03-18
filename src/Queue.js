import React, { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import Axios from "axios";
import Title from "./Title";

const grid = 8;

const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

const getItemStyle = (isDragging, draggableStyle) => ({
  userSelect: "none",
  padding: grid * 2,
  margin: `0 0 ${grid}px 0`,

  background: isDragging ? "lightgreen" : "grey",

  ...draggableStyle
});

const getListStyle = isDraggingOver => ({
  background: isDraggingOver ? "lightblue" : "lightgrey",
  padding: grid,
  width: 250,
  height: 600
});

export default function Queue() {
  const [openOrders, setOpenOrders] = useState([]);

  const onDragEnd = result => {
    if (!result.destination) {
      return;
    }

    const items = reorder(
      openOrders,
      result.source.index,
      result.destination.index
    );

    setOpenOrders(items);
  };

  useEffect(() => {
    /**
     ** Fetch new POs from Fishbowl that are not in our database.
     */
    async function fetchNewOrders() {
      Axios.get(
        "http://localhost:8000/api/v1/shoptracker/order/read/allopen"
      ).then(res => {
        const orders = res.data;
        console.log(orders.data);
        setOpenOrders(orders.data);
      });
    }
    fetchNewOrders();
  }, []);

  return (
    <React.Fragment>
      <Title>Queue</Title>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="droppable">
          {(provided, snapshot) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              //style={getListStyle(snapshot.isDraggingOver)}
            >
              {openOrders.map((order, index) => (
                <Draggable key={order.id} draggableId="draggable" index={index}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      //sytle={getItemStyle(
                       // snapshot.isDragging,
                       // provided.draggableProps.style
                      //)}
                    >
                      {order.num}
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </React.Fragment>
  );
}
