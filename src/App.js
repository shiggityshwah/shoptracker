import React, {Component, Fragment} from 'react';
import JobEntry from "./JobEntry";
import MainToolbar from "./MainToolbar";
import Header from "./Header";
import JobExplorer from "./JobExplorer";
import Grid from "@material-ui/core/Grid";
import {MuiThemeProvider, createMuiTheme} from "@material-ui/core/styles";

class App extends Component {

  render() {
    return (
      <div className="App">
        <Grid container >
          <Grid item xs={12}>
            <Header />
          </Grid>
          <Grid item xs={12}>
            <SideBar />
          </Grid>
          <Grid item sm={0} md={3}>
            <Content />
          </Grid>
        </Grid>
      </div>
    );
  }
}

export default App;
