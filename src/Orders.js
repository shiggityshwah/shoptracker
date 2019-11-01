/* eslint-disable no-script-url */

import React, { useState, useEffect } from "react";
import Link from "@material-ui/core/Link";
import Axios from "axios";
import { makeStyles } from "@material-ui/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Title from "./Title";

// Generate Order Data
function createData(id, date, name, shipTo, paymentMethod, amount) {
  return { id, date, name, shipTo, paymentMethod, amount };
}

const rows = [
  createData(
    0,
    "16 Mar, 2019",
    "Elvis Presley",
    "Tupelo, MS",
    "VISA ⠀•••• 3719",
    312.44
  ),
  createData(
    1,
    "16 Mar, 2019",
    "Paul McCartney",
    "London, UK",
    "VISA ⠀•••• 2574",
    866.99
  ),
  createData(
    2,
    "16 Mar, 2019",
    "Tom Scholz",
    "Boston, MA",
    "MC ⠀•••• 1253",
    100.81
  ),
  createData(
    3,
    "16 Mar, 2019",
    "Michael Jackson",
    "Gary, IN",
    "AMEX ⠀•••• 2000",
    654.39
  ),
  createData(
    4,
    "15 Mar, 2019",
    "Bruce Springsteen",
    "Long Branch, NJ",
    "VISA ⠀•••• 5919",
    212.79
  )
];

const useStyles = makeStyles(theme => ({
  seeMore: {
    marginTop: "8px"
  }
}));

export default function Orders() {
  const [hasError, setErrors] = useState(false);
  const [openOrders, setOpenOrders] = useState([]);
  const [openOrderParts, setOpenOrderParts] = useState([]);
  const [poNums, setPoNums] = useState([]);

  async function fetchOrders() {
    const orders = await fetch(
      "https://311cd658-6124-47ce-9390-cd32a8173325.mock.pstmn.io/orders"
    );
    orders
      .json()
      .then(orders => setOpenOrders(orders))
      .catch(err => setErrors(err));
    if (openOrders.length) {
      openOrders.map(openOrder => fetchParts(openOrder.num));
      fetchParts();
    }
  }

  async function fetchParts(poNum) {
    const parts = await fetch(
      "https://311cd658-6124-47ce-9390-cd32a8173325.mock.pstmn.io/order/" + 5
    );
    parts
      .json()
      .then(parts => setOpenOrderParts(parts))
      .catch(err => setErrors(err));
  }

  function printParts() {
    const parts = rows.map(row => (
      <TableRow key={row.id}>
        <TableCell>{row.date}</TableCell>
        <TableCell>{row.name}</TableCell>
        <TableCell>{row.num}</TableCell>
        <TableCell>{row.paymentMethod}</TableCell>
      </TableRow>
    ));
    return parts;
  }

  useEffect(() => {
    /**
     * Fetch new POs from Fishbowl that are not in our database.
     */
    if (!openOrders.length) {
      Axios.get(
        "https://311cd658-6124-47ce-9390-cd32a8173325.mock.pstmn.io/orders"
      ).then(res => {
        const orders = res.data;
        setOpenOrders(orders);
      });
    }

    /**
     * Fetch part information associated with each new PO
     */
    else {
      poNums.map(poNum => {
      Axios.post(
        "https://311cd658-6124-47ce-9390-cd32a8173325.mock.pstmn.io/order/",
        {
          poNum
        }
      ).then(res => {
        const partData = res.data;
        const newOpenOrderParts = [
          ...openOrderParts,
          { poNum: poNum, parts: partData }
        ];
        setOpenOrderParts(newOpenOrderParts);
      });
    });
    }
    

    const numbers = openOrders.map(openOrder => {
      return openOrder.num;
    });
    setPoNums(numbers);
    console.log(numbers)
    console.log(poNums);
  }, [poNums]);

  const classes = useStyles();
  return (
    <React.Fragment>
      {openOrders.map(openOrder => openOrder.id)}
      <Title>Recent Orders</Title>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Date</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Ship To</TableCell>
            <TableCell>Payment Method</TableCell>
            <TableCell align="right">Sale Amount</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {openOrders.map(openOrder => (
            <TableRow key={openOrder.id}>
              <TableCell>{openOrder.dateIssued}</TableCell>
              <TableCell>{openOrder.buyer}</TableCell>
              <TableCell>{openOrder.remitAddress}</TableCell>
              <TableCell>{openOrder.id}</TableCell>
              <TableCell align="right">{openOrder.vendorId}</TableCell>
            </TableRow>
          ))}

          {printParts()}
        </TableBody>
      </Table>
      <div className={classes.seeMore}>
        <Link color="primary" href="javascript:;">
          See more orders
        </Link>
      </div>
    </React.Fragment>
  );
}
