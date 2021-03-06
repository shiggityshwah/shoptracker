import React, { useState, useEffect, forwardRef } from "react";
import Axios from "axios";
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

export default function Part() {
  const [parts, setParts] = useState([]);

  async function addPart(part, resolve) {
    delete part["tableData"];

    let res = await Axios.post(
      "http://localhost:8000/api/v1/shoptracker/part/create/",
      part
    );

    let data = [...parts];
    data.push(part);
    setParts(data);
    resolve();
  }

  async function updatePart(part, resolve) {
    delete part["tableData"];

    let res = await Axios.post(
      "http://localhost:8000/api/v1/shoptracker/part/update/",
      part
    );

    let data = [...parts];
    data[data.indexOf(part)] = part;
    setParts(data);
    resolve();
  }

  async function removePart(part, resolve) {

    let res = await Axios.delete(
      "http://localhost:8000/api/v1/shoptracker/part/delete/" + part.id

    );

    let data = [...parts];
    data.splice(data.indexOf(part), 1);
    setParts(data);
    resolve();
  }

  function prepNewData(newData) {
    return {};
  }

  useEffect(() => {
    async function fetchParts() {
      Axios.get("http://localhost:8000/api/v1/shoptracker/part/read/all").then(
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
          {
            title: "Part #",
            field: "num",
            editable: "onAdd",
            defaultSort: "desc"
          },
          { title: "Revision", field: "rev" },
          { title: "Description", field: "desc" },
          { title: "Material", field: "material" },
          { title: "Material Size", field: "size" },
          {
            title: "Time Estimate (in mins)",
            field: "timeEstimate",
            type: "numeric"
          },
          {
            title: "Last Made",
            field: "lastMade",
            type: "datetime",
            editable: "never"
          }
        ]}
        data={parts}
        editable={{
          onRowAdd: newData =>
            new Promise(resolve => {
              addPart(newData, resolve);
              setTimeout(() => {
                console.log(newData);
                resolve();
                let data = [...parts];
                data.push(newData);
                setParts(data);
              }, 600);
            }),
          onRowUpdate: (newData, oldData) =>
            new Promise(resolve => {
              if (oldData && oldData !== newData) {
                updatePart(newData, resolve);
              }
            }),
          onRowDelete: oldData =>
            new Promise(resolve => {
              setTimeout(() => {
                console.log(oldData);
                resolve();
                let data = [...parts];
                data.splice(data.indexOf(oldData), 1);
                setParts(data);
              }, 600);
            })
        }}
      />
    </React.Fragment>
  );
}
