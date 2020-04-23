import React, { useState, useEffect } from "react";
import Moment from "moment";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { makeStyles } from "@material-ui/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Button from '@material-ui/core/Button';
import Axios from "axios";
import Title from "./Title";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import DragIndicator from "@material-ui/icons/DragIndicator";
import SaveIcon from '@material-ui/icons/Save';
import CircularProgress from '@material-ui/core/CircularProgress';
// 1 2 3 4 5 6
// 584  6 2 5 3 1 4
const useStyles = makeStyles(theme => ({
  button: {
    margin: "15px",
    float: "right"
  },
}));


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
  ...draggableStyle
});

const getListStyle = isDraggingOver => ({
  background: isDraggingOver ? "#e1f5fe" : "",

  padding: grid,
  width: "100%"
});

export default function Queue() {
  const classes = useStyles();
  const [queue, setQueue] = useState([]);
  const [changeList, setChangeList] = useState([]);
  const [updating, setUpdating] = useState(false);
  //const [orders, setOrders] = useState([]);
  let initQueue = [];

  const onDragEnd = async result => {
    if (!result.destination) {
      return;
    }

    const items = reorder(queue, result.source.index, result.destination.index);

    setQueue(items);
  };

  function updateQueue(changes) {
    
    return new Promise(resolve => {
      Axios.put("http://localhost:8000/api/v1/shoptracker/queue/update", changes ).then(res => {
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

  async function confirmChanges() {
    setUpdating(true);
    let changes = [];
    for (let i = queue.length-1; i > 0; i--) {
      changes.push([queue[i].poId, queue[i-1].poId])
    }
    changes.push([queue[0].poId, 0])
    console.log(changes)
    await updateQueue(changes)
    console.log("helloooo there")
    setUpdating(false);
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
                        <TableCell>{order.poId}</TableCell>
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
      <div>
        <Button
        variant="contained"
        color="primary"
        className={classes.button}
        size="large"
        startIcon={ <SaveIcon />}
        onClick={confirmChanges}
      >
        Save Queue
      </Button>
      </div>
      
    </React.Fragment>
  );
}
