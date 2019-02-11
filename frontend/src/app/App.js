import React, { Component } from "react";
import { BrowserRouter, Route } from "react-router-dom";

//Import all pages
import FrontPage from "pages/front-page";
import MemberPage from "pages/member-page";
import AdminPage from "pages/admin-page"

class App extends Component {
  render() {
    return (
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
    );
  }
}

export default App;
