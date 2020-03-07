import React, { useState, useEffect } from "react";
import Axios from "axios";
import { Link } from "react-router-dom";
import Title from "./Title";
import OrderTable from "./OrderTable";
import MaterialTable from "material-table";

export default function Orders() {
  const [parts, setParts] = useState([]);
  const [state, setState] = useState({
    columns: [
      { title: 'id', field: 'id'},
      { title: 'Number', field: 'num'},
      { title: 'Description', field: 'desc'}
  ],
    data: []
  })

  useEffect(() => {
    /**
     ** Fetch new POs from Fishbowl that are not in our database.
     */
    async function fetchParts() {
      Axios.get("http://localhost:8000/api/v1/shoptracker/parts/all").then(res => {
        const parts = res.data;
        console.log(parts.data);
        setParts(parts.data);
        setState((prevState)=> {
          const data = [...prevState.data];
          data.push(parts);
          return { ...prevState, data };
        })
      });
    }
    fetchParts();
  }, []);

  return (
    <React.Fragment>
      <Title>Parts List</Title>{
        parts.map( part => (
          <Link to={`/parts/${part.num}`}>{part.num} - {part.desc}</Link>
        ))
      }
      <MaterialTable
        title="parts list"
        columns={state.columns}
        data={state.data} />
    </React.Fragment>
  );
}
