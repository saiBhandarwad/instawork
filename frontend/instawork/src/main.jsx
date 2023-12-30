import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { Provider } from 'react-redux'
import { RouterProvider } from 'react-router-dom'
import Login from './components/login/Login.jsx'
import { createBrowserRouter } from 'react-router-dom'
import Signup from './components/signup/Signup.jsx'
import Post from './components/post/Post.jsx'
import Home from './components/home/Home.jsx'
import { store } from './redux/store.js'
import 'bootstrap/dist/css/bootstrap.min.css';
import SavedJobs from './components/saved jobs/SavedJobs.jsx'
const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />
  },
  {
    path: "/works",
    element: <App />
  },
  {
    path: "/myjobs",
    element: <SavedJobs />
  },
  {
    path: "/login",
    element: <Login />
  },
  {
    path: "/signup",
    element: <Signup />
  },
  {
    path: "/post",
    element: <Post />
  },
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <RouterProvider router={router}>
    </RouterProvider>
  </Provider>
)