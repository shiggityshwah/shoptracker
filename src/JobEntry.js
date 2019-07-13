import React from 'react';
import Link from '@material-ui/core/Link';
import { makeStyles } from '@material-ui/styles';
import {Typography, TextField, FormControl, InputLabel, NativeSelect, Input, FormHelperText} from '@material-ui/core';
import Title from './Title';

const useStyles = makeStyles({
  depositContext: {
    flex: 1,
  },
});

export default function JobEntry() {
  const classes = useStyles();
  return (
    <React.Fragment>
      <Title>Job Entry</Title>
      <TextField
        id="orderDate"
        label="Order Date"
        type="date"
        className={classes.textField}
        InputLabelProps={{
          shrink: true,
        }}
      />
      <TextField
        id="orderQty"
        label="Order Qty"
        type="number"
        className={classes.textField}
        InputLabelProps={{
          shrink: true,
        }}
      />
     <FormControl className={classes.formControl}>
        <InputLabel htmlFor="status-native-helper">Status</InputLabel>
        <NativeSelect
          input={<Input name="status" id="status-native-helper" />}
        >
          <option value="" />
          <option value="active">Active</option>
          <option value="waiting">Waiting</option>
          <option value="completed">Completed</option>
        </NativeSelect>
        <FormHelperText>Some important helper text</FormHelperText>
      </FormControl>
      <div>
        <Link color="primary" href="javascript:;">
          View balance
        </Link>
      </div>
    </React.Fragment>
  );
}