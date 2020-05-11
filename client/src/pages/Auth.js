import React, { Component } from "react";
import AuthContext from '../context/authContext';

import './Auth.css';

class AuthPage extends Component {
  static contextType = AuthContext;

  constructor (props) {
    super (props);

    this.state = {
      isLogin: true
    };

    this.emailEl = React.createRef();
    this.passwordEl = React.createRef();

    this.submitHandler = this.submitHandler.bind(this);
    this.switchModeHandler = this.switchModeHandler.bind(this);
  }

  switchModeHandler() {
    this.setState((prevState) => {
      return {isLogin: !prevState.isLogin};
    });
  }

  submitHandler (e) {
    e.preventDefault();

    const email = this.emailEl.current.value,
      password = this.passwordEl.current.value;

    if (email.trim().length === 0 || password.trim().length === 0) {
      return;
    }

    let payload = {
        query: `
          query {
            login(email: "${email}", password: "${password}") {
              userId,
              token,
              tokenExpiration
            }
          }
        `
    };

    if (!this.state.isLogin) {
      payload = {
        query: `
          mutation {
            createUser(userInput: {email: "${email}", password: "${password}"}) {
              _id,
              email
            }
          }
        `
      };
    }

    fetch('http://localhost:8000/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    }).then((res) => {
      if (res.status !== 200 && res.status !== 201) {
        throw new Error('Failed!');
      }

      return res.json();
    })
    .then((resData) => {
      if (resData.data && resData.data.login && resData.data.login.token) {
        this.context.login(resData.data.login.token, resData.data.login.userId, resData.data.login.tokenExpiration);
      }

      console.log(resData);
    })
    .catch((err) => {
      console.log(err);
    });
  }

  render () {
    return (
      <div className='auth-form-container'>
        <form className='auth-form' onSubmit={this.submitHandler}>
          <h4>{this.state.isLogin ? 'Sign In' : 'Sign Up'}</h4>
          <div className='form-element'>
            <label htmlFor="email"> Email</label>
            <input type='email' id='email'  ref={this.emailEl} />
          </div>
          <div className='form-element'>
            <label htmlFor='password'>Password</label>
            <input type='password' id='password' ref={this.passwordEl} />
          </div>
          <div className='form-actions'>
            <input type='submit' value={this.state.isLogin ? 'Sign In' : 'Sign Up'} />
            <input type='button' value={this.state.isLogin ? 'Sign Up instead' : 'Sign In instead'} onClick={this.switchModeHandler} />
          </div>
        </form>
      </div>
    );
  }
};

export default AuthPage;