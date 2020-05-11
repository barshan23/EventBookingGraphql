import React, { Fragment } from 'react';
import { NavLink } from "react-router-dom";

import AuthContext from '../../context/authContext';

import './MainNav.css';

export function MainNavigation () {
  return (
    <AuthContext.Consumer>
    {(context) => {
      return (
        <header className='main-navigation'>
          <div className='main-navigation__logo'>
            <h1>Easy events</h1>
          </div>
    
          <nav className='main-navigation__items'>
            <ul>
              <li>
                <NavLink to="/events">Events</NavLink>
              </li>
              {!context.token && <li>
                <NavLink to="/auth">Login</NavLink>
              </li>}
              {context.token && (
                <Fragment>
                  <li>
                    <NavLink to="/bookings">Bookings</NavLink>
                  </li>
                  <li>
                    <NavLink to="/auth" onClick={context.logout}>Logout</NavLink>
                  </li>
                </Fragment>
              )}
            </ul> 
          </nav>
        </header>
      );
    }}
  </AuthContext.Consumer>
  );
};
