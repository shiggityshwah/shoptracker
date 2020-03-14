/* eslint-disable no-script-url */

import React, { useState, useEffect } from "react";
import Axios from "axios";
import Title from "./Title";
import OrderTable from "./OrderTable";

export default function Orders() {
  const [openOrders, setOpenOrders] = useState([]);
  const [openOrderParts, setOpenOrderParts] = useState([]);
  const [partsFetched, setPartsFetched] = useState(false);

  useEffect(() => {
    /**
     ** Fetch new POs from Fishbowl that are not in our database.
     */
    async function fetchNewOrders() {
      setPartsFetched(false);
      Axios.get("http://localhost:8000/api/v1/shoptracker/order/read/all").then(res => {
        const orders = res.data;
        console.log(orders.data);
        setOpenOrders(orders.data);
      });
    }
    fetchNewOrders();
  }, []);

  useEffect(() => {
    /**
     ** Fetch parts from each new PO
     */
    async function getParts() {
      console.log(partsFetched);
      openOrders.map(order => {
        const id = order.poId;
        Axios.get("http://localhost:8000/api/v1/shoptracker/order/parts/" + id).then(res => {
          const partData = res.data;
          console.log(partData.data);
          setOpenOrderParts(prevParts => prevParts.concat(partData.data));
          setPartsFetched(true);
        });
      });
    }
    getParts();
  }, [openOrders]);

  return (
    <React.Fragment>
      <Title>Recent Orders</Title>
      <OrderTable orders={openOrders} orderItems={openOrderParts} />
    </React.Fragment>
  );
}
