import React, { useState, useEffect, forwardRef } from "react";
import Axios from "axios";
import { Link } from "react-router-dom";
import Title from "./Title";
import MaterialTable from "material-table";
import {
  AddBox,
  ArrowUpward,
  Check,
  ChevronLeft,
  ChevronRight,
  Clear,
  DeleteOutline,
  Edit,
  FilterList,
  FirstPage,
  LastPage,
  Remove,
  SaveAlt,
  Search,
  ViewColumn
} from "@material-ui/icons";

const tableIcons = {
  Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
  Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
  Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
  Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />),
  DetailPanel: forwardRef((props, ref) => (
    <ChevronRight {...props} ref={ref} />
  )),
  Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
  Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />),
  Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
  FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
  LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
  NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
  PreviousPage: forwardRef((props, ref) => (
    <ChevronLeft {...props} ref={ref} />
  )),
  ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
  Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
  SortArrow: forwardRef((props, ref) => <ArrowUpward {...props} ref={ref} />),
  ThirdStateCheck: forwardRef((props, ref) => <Remove {...props} ref={ref} />),
  ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />)
};

export default function Orders() {
  const [parts, setParts] = useState([]);

  async function updatePart(part) {
    Axios.post("http://localhost:8000/api/v1/shoptracker/part/all", part).then(
      res => {
        const updatedPart = res.data;
        console.log(updatedPart.data);
        setParts(parts.data);
      }
    );
  }
  useEffect(() => {
    /**
     ** Fetch new POs from Fishbowl that are not in our database.
     */
    async function fetchParts() {
      Axios.get("http://localhost:8000/api/v1/shoptracker/part/all").then(
        res => {
          const parts = res.data;
          console.log(parts.data);
          setParts(parts.data);
        }
      );
    }
    fetchParts();
  }, []);

  return (
    <React.Fragment>
      <Title>Parts List</Title>

      <MaterialTable
        icons={tableIcons}
        title=""
        options={{
          pageSize: 10,
          pageSizeOptions: [10, 20, 50, 100]
        }}
        columns={[
          { title: "Part #", field: "num", editable: "onAdd", defaultSort: "desc"},
          { title: "Revision", field: "rev" },
          { title: "Description", field: "desc" },
          { title: "Material", field: "material" },
          { title: "Material Size", field: "size" },
          { title: "Time Estimate", field: "timeEstimate", type:"time"},
          { title: "Last Made", field: "lastMade", type:"datetime", editable: "never"}
        ]}
        data={parts}
        editable={{
          onRowAdd: newData =>
            new Promise(resolve => {
              setTimeout(() => {
                resolve();
                setState(prevState => {
                  const data = [...prevState.data];
                  data.push(newData);
                  return { ...prevState, data };
                });
              }, 600);
            }),
          onRowUpdate: (newData, oldData) =>
            new Promise(resolve => {
              setTimeout(() => {
                resolve();
                if (oldData) {
                  setState(prevState => {
                    const data = [...prevState.data];
                    data[data.indexOf(oldData)] = newData;
                    return { ...prevState, data };
                  });
                }
              }, 600);
            }),
          onRowDelete: oldData =>
            new Promise(resolve => {
              setTimeout(() => {
                resolve();
                setState(prevState => {
                  const data = [...prevState.data];
                  data.splice(data.indexOf(oldData), 1);
                  return { ...prevState, data };
                });
              }, 600);
            }),
        }}
      />

      {parts.map(part => (
        <Link to={`/parts/${part.num}`}>
          {part.num} - {part.desc}
        </Link>
      ))}
    </React.Fragment>
  );
}
