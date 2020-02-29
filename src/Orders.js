/* eslint-disable no-script-url */

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
import OrderTable from "./OrderTable";

const useStyles = makeStyles(theme => ({
  seeMore: {
    marginTop: "8px"
  },
  po: {
    backgroundColor: "#283593"
  },
  poCell: {
    color: "rgba(255,255,255,.87)",
    fontSize: "1.0rem",
    "& div": {
      fontWeight: 900
    }
  },
  orderHeadCell: {
    fontSize: "1.2rem"
  },
  partHead: {
    fontWeight: 600,
    width: "5px",
    "& div": {
      width: "400 rem"
    }
  },
  icon: {
    fill: "rgba(255,255,255,.87)"
  },
  addCircle: {
    fill: "rgba(255,255,255,.87)"
  }
}));

export default function Orders() {
  const [hasError, setErrors] = useState(false);
  const [openOrders, setOpenOrders] = useState([]);
  const [openOrderParts, setOpenOrderParts] = useState([]);
  const [openOrderIds, setOpenOrderIds] = useState([]);
  const [partsFetched, setPartsFetched] = useState(false);

  //add collapse transition, button adds or removes orderID from array, Parts show if their order id is included ( .includes() ) in array
  function removePoId(e) {
    const filtered = openOrderIds.filter(function(value, index, arr) {
      return value != e.target.id;
    });
    setOpenOrderIds(filtered);
  }

  function addPoId(e) {
    const added = [...openOrderIds, parseInt(e.target.poId)];
    setOpenOrderIds(added);
  }

  function printParts(poId) {
    console.log(poId);
    console.log(openOrderParts);
    const order = openOrderParts.filter(orderParts => orderParts.poId === poId);
    const partTable = order.map(part => (
      <TableRow key={part.id}>
        <TableCell align="center">{part.partId}</TableCell>
        <TableCell>{part.poId}</TableCell>
        <TableCell align="right">{part.lastUpdate}</TableCell>
        <TableCell align="right">{part.qty}</TableCell>
      </TableRow>
    ));
    console.log(order);
    return partTable;
  }

  useEffect(() => {
    /**
     * Fetch new POs from Fishbowl that are not in our database.
     */
    async function fetchNewOrders() {
      setPartsFetched(false);
      Axios.get("http://localhost:8000/api/v1/shoptracker/").then(res => {
        const orders = res.data;
        console.log(orders.data);
        setOpenOrders(orders.data);
        // const orderIds = orders.map(order => order.id);
        // setOpenOrderIds(orderIds);
      });
    }
    fetchNewOrders();
  }, []);

  useEffect(() => {
    /**
     * Fetch parts from each new PO
     */
    async function getParts() {
      console.log(partsFetched);
      openOrders.map(order => {
        const id = order.poId;
        Axios.get("http://localhost:8000/api/v1/shoptracker/" + id).then(res => {
          const partData = res.data;
          console.log(partData.data);
          setOpenOrderParts(prevParts => prevParts.concat(partData.data));
          setPartsFetched(true);
        });
      });
    }
    getParts();
  }, [openOrders]);

  const classes = useStyles();

  return (
    <React.Fragment>
      <Title>Recent Orders</Title>
      <OrderTable orders={openOrders} orderItems={openOrderParts} />
    </React.Fragment>
    // <React.Fragment>
    //   <Title>Recent Orders</Title>
    //   <Table>
    //     <TableHead>
    //       <TableRow>
    //         <TableCell
    //           className={classes.orderHeadCell}
    //           style={{ width: "5px", padding: "5px" }}
    //           align="left"
    //         >
    //           Add to Queue
    //         </TableCell>
    //         <TableCell
    //           className={classes.orderHeadCell}
    //           style={{ width: "5px" }}
    //           align="center"
    //         >
    //           PO Number
    //         </TableCell>
    //         <TableCell className={classes.orderHeadCell}>
    //           <div>Description</div>
    //         </TableCell>
    //         <TableCell className={classes.orderHeadCell}>Purchaser</TableCell>
    //         <TableCell className={classes.orderHeadCell} align="right">
    //           Date Issued
    //         </TableCell>
    //         <TableCell />
    //       </TableRow>
    //     </TableHead>

    //     {!partsFetched ? (
    //       <TableBody>
    //         <TableCell colSpan={6} align="center">
    //           <div> Now loading... </div>
    //         </TableCell>
    //       </TableBody>
    //     ) : (
    //       openOrders.map(openOrder => (
    //         <TableBody>
    //           <TableRow className={classes.po} key={openOrder.id}>
    //             <TableCell className={classes.poCell} align="left">
    //               <IconButton>
    //                 <AddCircle className={classes.addCircle} />
    //               </IconButton>
    //             </TableCell>
    //             <TableCell className={classes.poCell} align="center">
    //               <div>{openOrder.num}</div>
    //             </TableCell>
    //             <TableCell className={classes.poCell}>
    //               {openOrder.note}
    //             </TableCell>
    //             <TableCell className={classes.poCell}>
    //               {openOrder.buyer}
    //             </TableCell>
    //             <TableCell className={classes.poCell} align="right">
    //               {Moment(openOrder.dateIssued).fromNow()}
    //             </TableCell>
    //             <TableCell className={classes.poCell} align="right">
    //               {openOrderIds.includes(openOrder.id) ? (
    //                 <IconButton id={openOrder.id} onClick={removePoId}>
    //                   <UpArrow
    //                     id={openOrder.id}
    //                     onClick={removePoId}
    //                     className={classes.icon}
    //                   />
    //                 </IconButton>
    //               ) : (
    //                 <IconButton id={openOrder.id} onClick={addPoId}>
    //                   <DownArrow
    //                     id={openOrder.id}
    //                     onClick={addPoId}
    //                     className={classes.icon}
    //                   />
    //                 </IconButton>
    //               )}
    //             </TableCell>
    //           </TableRow>
    //           <TableRow>
    //             {openOrderIds.includes(openOrder.poId) ? (
    //               <TableCell
    //                 colSpan={6}
    //                 children={
    //                   <Table size="small">
    //                     <TableHead>
    //                       <TableRow>
    //                         <TableCell
    //                           className={classes.partHead}
    //                           align="center"
    //                         >
    //                           Part Number
    //                         </TableCell>
    //                         <TableCell className={classes.partHead}>
    //                           Description
    //                         </TableCell>
    //                         <TableCell
    //                           className={classes.partHead}
    //                           align="right"
    //                         >
    //                           Revision
    //                         </TableCell>
    //                         <TableCell
    //                           className={classes.partHead}
    //                           align="right"
    //                         >
    //                           Qty Needed
    //                         </TableCell>
    //                       </TableRow>
    //                     </TableHead>
    //                     <TableBody>{printParts(openOrder.id)}</TableBody>
    //                   </Table>
    //                 }
    //               />
    //             ) : (
    //               <div />
    //             )}
    //           </TableRow>
    //         </TableBody>
    //       ))
    //     )}
    //   </Table>
    //   <div className={classes.seeMore}>
    //     <Link color="primary" href="javascript:;">
    //       See more orders
    //     </Link>
    //   </div>
    // </React.Fragment>
  );
}
