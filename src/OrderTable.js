import React, { useState } from "react";
import Moment from "moment";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import IconButton from "@material-ui/core/IconButton";
import UpArrow from "@material-ui/icons/KeyboardArrowUp";
import DownArrow from "@material-ui/icons/KeyboardArrowDown";
import PartsTable from "./PartsTable";

export default function OrderTable(props) {

  const [orderIds, setOrderIds] = useState([]);

  function addOrRemovePoId(e) {
    console.log("clicked " + e.target.id);
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

  function partsWithPoId(poId) {
    return this.props.orderItems.filter(orderItem => orderItem.poId === poId);
  }

  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>PO Number</TableCell>
          <TableCell>Description</TableCell>
          <TableCell>Part Qty</TableCell>
          <TableCell>Date Issued</TableCell>
          <TableCell>Due Date</TableCell>
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
                  <UpArrow style={{pointerEvents:"none"}} />
                </IconButton>
              ) : (
                <IconButton id={order.poId} onClick={addOrRemovePoId} >
                  <DownArrow style={{pointerEvents:"none"}} />
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
