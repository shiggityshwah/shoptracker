import React, { useState } from "react";
import Moment from "moment";
import { makeStyles } from "@material-ui/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import IconButton from "@material-ui/core/IconButton";
import UpArrow from "@material-ui/icons/KeyboardArrowUp";
import DownArrow from "@material-ui/icons/KeyboardArrowDown";
import PartsTable from "./PartsTable";

const useStyles = makeStyles(theme => ({
  partHead: {
    fontWeight: 600,
  },
}));

/*   
TODO: add collapse transition 
*/
export default function OrderTable(props) {
  const classes = useStyles();
  const [orderIds, setOrderIds] = useState([]);

  function addOrRemovePoId(e) {
    console.log("clicked " + e.target);
    const included = orderIds.includes(parseInt(e.target.id))
    console.log("included is " + included + ", array includes " + orderIds);
    if (included) {
      console.log("array includes " + e.target.id);
      const filtered = orderIds.filter(function(value, index, arr) {
        return value != parseInt(e.target.id);
      })
      setOrderIds(filtered);
    }
    else {
      const added = [...orderIds, parseInt(e.target.id)];
      setOrderIds(added);
    }
  }

  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>PO Number</TableCell>
          <TableCell>Description</TableCell>
          <TableCell>Part Qty</TableCell>
          <TableCell>Date Issued</TableCell>
          <TableCell colSpan={2}>Due Date</TableCell>
        </TableRow>
      </TableHead>
      {props.orders.map(order => (
        <TableBody>
          <TableRow key={order.id} >
            <TableCell>{order.num}</TableCell>
            <TableCell>{order.note}</TableCell>
            <TableCell>{order.partQty}</TableCell>
            <TableCell>{Moment(order.dateIssued).fromNow()}</TableCell>
            <TableCell>{Moment(order.dateRequested).fromNow()}</TableCell>
            <TableCell>
              {orderIds.includes(order.poId) ? (
                <IconButton id={order.poId} onClick={addOrRemovePoId} >
                  <UpArrow id={order.poId} onClick={addOrRemovePoId} />
                </IconButton>
              ) : (
                <IconButton id={order.poId} onClick={addOrRemovePoId} >
                  <DownArrow id={order.poId} onClick={addOrRemovePoId} />
                </IconButton>
              )}
            </TableCell>
          </TableRow>
          <TableRow>
            {orderIds.includes(order.poId) ? (
              <TableCell
                colSpan={6}
                children={<PartsTable parts={props.orderItems} orderId={order.poId} />}
              />
            ) : (
              <div />
            )}
          </TableRow>
        </TableBody>
      ))}
    </Table>
  );
}
