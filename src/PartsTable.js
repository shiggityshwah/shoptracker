import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";

const useStyles = makeStyles(theme => ({
  partHead: {
    fontWeight: 600,
  },
}));

export default function OrderTable(props) {
  const classes = useStyles();
  const [parts, setParts] = useState([]);

  useEffect(() => {
    const filtered = props.parts.filter(part => part.poId === props.orderId);
    setParts(filtered);
  }, []);


  return (
    <Table size="small">
      <TableHead>
        <TableRow>
          <TableCell className={classes.partHead}>Part - Description</TableCell>
          <TableCell className={classes.partHead}>Revision</TableCell>
          <TableCell className={classes.partHead}>Material</TableCell>
          <TableCell className={classes.partHead}>Machine</TableCell>
          <TableCell className={classes.partHead} align="center">Qty Needed</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {parts.map(part => (
          <TableRow key={part.id}>
            <TableCell align="left">{part.num} -  {part.desc}</TableCell>
            <TableCell>{part.rev ? part.rev : "N/A"}</TableCell>
            <TableCell>{part.material ? part.material : "N/A"}</TableCell>
            <TableCell>{part.machine ? part.machine : "N/A"}</TableCell>
            <TableCell align="center">{part.qty}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
