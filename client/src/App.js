import React, { Component } from 'react';
import { BrowserRouter, Route, Redirect, Switch } from "react-router-dom";

import AuthPage from './pages/Auth';
import BookingsPage from './pages/Bookings';
import EventsPage from './pages/Events';
import { MainNavigation } from "./components/Navigation/MainNav";
import AuthContext from "./context/authContext";

import './App.css';

class App extends Component {
  state = {
    token: null,
    userId: null
  };

  onLogin = (token, userId, tokenExpiration) => {
    this.setState({ token: token, userId: userId });
  }

  onLogout = () => {
    this.setState({ token: null, userId: null });
  }

  render () {
    return (
      <BrowserRouter>
        <AuthContext.Provider value={{
          token: this.state.token,
          userId: this.state.userId,
          login: this.onLogin,
          logout: this.onLogout
        }}>
          <MainNavigation />
          <main className='main-content'>
            <Switch>
              {!this.state.token && <Redirect from="/" to="/auth" exact />}
              {this.state.token && <Redirect from="/" to="/events" exact />}
              {this.state.token && <Redirect from="/auth" to="/events" />}
              {!this.state.token && <Route path="/auth" component={AuthPage} />}
              {this.state.token && <Route path="/bookings" component={BookingsPage} />}
              <Route path="/events" component={EventsPage} />
            </Switch>
          </main>
        </AuthContext.Provider>
      </BrowserRouter>
    );
  }
}

export default App;
