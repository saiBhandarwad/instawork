import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { Provider } from 'react-redux'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Login from './components/login/Login.jsx'
import Signup from './components/signup/Signup.jsx'
import Post from './components/post/Post.jsx'
import Home from './components/home/Home.jsx'
import { store } from './redux/store.js'
import 'bootstrap/dist/css/bootstrap.min.css';
import SavedJobs from './components/saved jobs/SavedJobs.jsx'
import Navbar from './components/navbar/Navbar.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <Router>
      <Navbar />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/works' element={<App />} />
        <Route path='/myjobs' element={<SavedJobs />} />
        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/post' element={<Post />} />
      </Routes>
    </Router>
  </Provider>
)