import React, { Component } from "react";
import { BrowserRouter, Route } from "react-router-dom";

import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

import configureStore from "redux/configureStore";

//Import all pages
import FrontPage from "pages/front-page";
import MemberPage from "pages/member-page";
import AdminPage from "pages/admin-page"

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {};

    this.persistor = configureStore().persistor;
    this.store = configureStore().store;
  }
  render() {
    return (
      <Provider store={this.store}>
        <PersistGate loading={null} persistor={this.persistor}>
          <div className="App">
            <BrowserRouter>
              <React.Fragment>
                <Route path="/" exact component={FrontPage} />
                <Route path="/members" exact component={MemberPage} />
                <Route
                  exact
                  path="/admin/generate-code/:key"
                  component={AdminPage}
                />
              </React.Fragment>
            </BrowserRouter>
          </div>
        </PersistGate>
      </Provider>
    );
  }
}

export default App;
