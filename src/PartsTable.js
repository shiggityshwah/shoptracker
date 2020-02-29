import React, { useState, useEffect } from "react";
import Link from "@material-ui/core/Link";
import Axios from "axios";
import Moment from "moment";
import { makeStyles } from "@material-ui/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Title from "./Title";
import IconButton from "@material-ui/core/IconButton";
import UpArrow from "@material-ui/icons/KeyboardArrowUp";
import DownArrow from "@material-ui/icons/KeyboardArrowDown";
import AddCircle from "@material-ui/icons/AddCircle";

export default function OrderTable(props) {
  const [parts, setParts] = useState([]);

  useEffect(() => {
    const filtered = props.parts.filter(part => part.poId === props.orderId);
    setParts(filtered);
  }, []);


  return (
    <Table size="small">
      <TableHead>
        <TableRow>
          <TableCell>Part Number</TableCell>
          <TableCell>Description</TableCell>
          <TableCell>Revision</TableCell>
          <TableCell>Qty Needed</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {parts.map(part => (
          <TableRow key={part.id}>
            <TableCell align="center">{part.partId}</TableCell>
            <TableCell>{part.poId}</TableCell>
            <TableCell align="right">{part.lastUpdate}</TableCell>
            <TableCell align="right">{part.qty}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
