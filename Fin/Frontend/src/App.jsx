import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Signup from './pages/auth/Signup';
import Login from './pages/auth/Login';
import Income from './pages/dashboard/Income';
import Home from './pages/dashboard/Home';
import Expense from './pages/dashboard/Expense';
import UserProvider from './context/Usercontext';
import ThemeProvider from './context/ThemeContext';
import { Toaster } from 'react-hot-toast';
import Ai from './pages/dashboard/Ai';

function App() {

  return (
    <UserProvider>
      <ThemeProvider>
        <div>
          <Router>
            <Routes>
              <Route path="/" element={<Root />} />
              <Route path="/login" exact element={<Login />} />
              <Route path="/signUp" exact element={<Signup />} />
              <Route path="/dashboard" exact element={<Home />} />
              <Route path="/income" exact element={<Income />} />
              <Route path="/expense" exact element={<Expense />} />
              <Route path="/Ai" exact element={<Ai />} />
            </Routes>
          </Router>
        </div>

        <Toaster
          toastOptions={{
            className: "",
            style: {
              fontSize: '13px'
            },
          }} />
      </ThemeProvider>
    </UserProvider>
  )
}

export default App;

const Root = () => {
  const isAuthenticated = !!localStorage.getItem('token');

  return isAuthenticated ? (
    <Navigate to={'/dashboard'} />
  ) : (
    <Navigate to={'/login'} />
  )
};
