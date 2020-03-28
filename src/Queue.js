import React, { useState, useEffect } from "react";
import Moment from "moment";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Axios from "axios";
import Title from "./Title";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import DragIndicator from "@material-ui/icons/DragIndicator";
// 1 2 3 4 5 6
// 584  6 2 5 3 1 4
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
    border: isDraggingOver ? "2px dashed red" : "",

  padding: grid,
  width: "100%"
});

export default function Queue() {
  const [queue, setQueue] = useState([]);
  const [changeList, setChangeList] = useState([]);
  //const [orders, setOrders] = useState([]);
  let initQueue = [];

  const onDragEnd = async result => {
    if (!result.destination) {
      return;
    }

    const items = reorder(queue, result.source.index, result.destination.index);

    let previousOrder = 0;
    const movedOrder = items[result.destination.index].poId;
    let nextOrder = 0;

    //some confusing logic here due to database storing POs in reverse order.
    if (result.destination.index === 0) {
      //if moved to first, nextOrder's nextPO will be movedOrder and movedOrder's nextPO will be 0
      nextOrder = items[result.destination.index + 1].poId;
    } else if (result.destination.index === items.length - 1) {
      //if moved to last, movedOrder will be set as lastPO, and it's nextPO will be set to previousOrder
      previousOrder = items[result.destination.index - 1].poId;
    } else {
      previousOrder = items[result.destination.index - 1].poId; //if moved somewhere in between, nextOrder will set it's nextOrder to movedOrder, and movedOrder will set it's nextPO to previousOrder
      nextOrder = items[result.destination.index + 1].poId;
    }

    const change = {
      previousOrder: previousOrder,
      movedOrder: movedOrder,
      nextOrder: nextOrder
    };
    const newChangeList = [...changeList, change];

    setChangeList(newChangeList);
    setQueue(items);
  };

  function updateQueue(previousOrder, movedOrder, nextOrder) {
    return new Promise(resolve => {
      Axios.put("http://localhost:8000/api/v1/shoptracker/queue/update", {
        previousOrder: previousOrder,
        movedOrder: movedOrder,
        nextOrder: nextOrder
      }).then(res => {
        resolve(res.data.data);
      });
    });
  }

  function fetchLastPO() {
    return new Promise(resolve => {
      Axios.get("http://localhost:8000/api/v1/shoptracker/queue/lastpo").then(
        res => {
          resolve(res.data.data);
        }
      );
    });
  }

  function fetchOpenOrders() {
    return new Promise(resolve => {
      Axios.get(
        "http://localhost:8000/api/v1/shoptracker/order/read/allopen"
      ).then(res => {
        resolve(res.data.data);
      });
    });
  }

  async function fetchAndSortOrders() {
    const lastPO = await fetchLastPO();
    const openOrders = await fetchOpenOrders();

    //setOrders(openOrders);
    const lastOrder = openOrders.find(order => order.poId === lastPO);
    initQueue = [];
    sortOrders(openOrders, lastOrder);
    setQueue(initQueue);
  }

  const sortOrders = (orderList, currentOrder) => {
    if (currentOrder.nextPo !== 0) {
      const nextOrder = orderList.find(
        order => order.poId === currentOrder.nextPo
      );
      sortOrders(orderList, nextOrder);
    }
    let newQueue = initQueue.slice();
    newQueue.push(currentOrder);
    initQueue = newQueue;
  };

  useEffect(() => {
    fetchAndSortOrders();
  }, []);

  return (
    <React.Fragment>
      <Title>Queue</Title>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="droppable">
          {(provided, snapshot) => (
            <Table
              {...provided.droppableProps}
              ref={provided.innerRef}
              style={getListStyle(snapshot.isDraggingOver)}
            >
              <TableHead>
                <TableRow>
                  <TableCell></TableCell>
                  <TableCell>Order</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Part Qty</TableCell>
                  <TableCell>Date Issued</TableCell>
                  <TableCell>Date Requested</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {queue.map((order, index) => (
                  <Draggable
                    key={order.id}
                    draggableId={order.id}
                    index={index}
                  >
                    {(provided, snapshot) => (
                      <TableRow
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        sytle={getItemStyle(
                          snapshot.isDragging,
                          provided.draggableProps.style
                        )}
                      >
                        <TableCell>
                          <DragIndicator />
                        </TableCell>
                        <TableCell>{order.num}</TableCell>
                        <TableCell>{order.note}</TableCell>
                        <TableCell>{order.partQty}</TableCell>
                        <TableCell>
                          {Moment(order.dateIssued).fromNow()}
                        </TableCell>
                        <TableCell>
                          {Moment(order.dateRequested).fromNow()}
                        </TableCell>
                      </TableRow>
                    )}
                  </Draggable>
                ))}
              </TableBody>
              {provided.placeholder}
            </Table>
          )}
        </Droppable>
      </DragDropContext>
    </React.Fragment>
  );
}
