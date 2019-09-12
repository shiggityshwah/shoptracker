import React, { useState } from "react";
import Link from "@material-ui/core/Link";
import { makeStyles } from "@material-ui/styles";
import {
    Grid,
    Typography,
    TextField,
    FormControl,
    InputLabel,
    NativeSelect,
    Input,
    FormHelperText
} from "@material-ui/core";
import Title from "./Title";

const useStyles = makeStyles({
    depositContext: {
        flex: 1
    },
    textField: {
        width: "15rem"
    }
});

export default function JobEntry() {
    const classes = useStyles();
    const [purchaseOrder, setPurchaseOrder] = useState("");
    const [orderDate, setOrderDate] = useState("");
    const [dueDate, setDueDate] = useState("");
    const [partNumbers, setPartNumbers] = useState([""]);
    const [partRev, setPartRev] = useState([""]);
    const [partQty, setPartQty] = useState([""]);

    return (
        <React.Fragment>
            <Title>Job Entry</Title>
            <br/>
            <Grid container spacing={4}>
                <Grid item sm={12} md={4}>
                    <TextField
                        id="purchaseOrder"
                        label="Purchase Order Number"
                        value={purchaseOrder}
                        className={classes.textField}
                        variant="outlined"
                        InputLabelProps={{
                            shrink: true
                        }}
                        onChange={e => setPurchaseOrder(e.target.value)}
                    />
                </Grid>
                <Grid item sm={12} md={4}>
                    <TextField
                        id="orderDate"
                        label="Order Date"
                        type="date"
                        className={classes.textField}
                        variant="outlined"

                        InputLabelProps={{
                            shrink: true
                        }}
                        onChange={e => setOrderDate(e.target.value)}
                    />
                </Grid>
                <Grid item sm={12} md={4}>
                    <TextField
                        id="dueDate"
                        label="Due Date"
                        type="date"
                        className={classes.textField}
                        variant="outlined"
                        InputLabelProps={{
                            shrink: true
                        }}
                    />
                </Grid>
                </Grid>
                <br/>
                <Grid container spacing={4}>

                <Grid item sm={12} md={4}>
                    <TextField
                        id="partNumber"
                        label="Part Number"
                        InputLabelProps={{
                            shrink: true
                        }}
                    />
                </Grid>
                <Grid item sm={12} md={4}>
                    <TextField
                        id="partRev"
                        label="Part Revision"
                        defaultValue="A"
                        InputLabelProps={{
                            shrink: true
                        }}
                    />
                </Grid>
                <Grid item sm={12} md={4}>
                    <TextField
                        id="partQty"
                        label="Part Quantity"
                        type="number"
                        InputLabelProps={{
                            shrink: true
                        }}
                    />
                </Grid>
                <FormControl className={classes.formControl}>
                    <InputLabel htmlFor="status-native-helper">
                        Status
                    </InputLabel>
                    <NativeSelect
                        input={
                            <Input name="status" id="status-native-helper" />
                        }
                    >
                        <option value="" />
                        <option value="active">Active</option>
                        <option value="waiting">Waiting</option>
                        <option value="completed">Completed</option>
                    </NativeSelect>
                    <FormHelperText>Some important helper text</FormHelperText>
                </FormControl>
            </Grid>
            <div>
                <Link color="primary" href="javascript:;">
                    View balance
                </Link>
            </div>
        </React.Fragment>
    );
}
