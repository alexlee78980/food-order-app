import { createContext } from 'react';

export const AuthContext = createContext({
  isLoggedIn: false,
  userId: null,
  cart: [],
  token: null,
  loginFunction: () => {},
  logout: () => {},
  addtoCart: () =>{}
});
