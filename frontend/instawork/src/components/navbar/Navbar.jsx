import React, { useEffect, useState } from 'react'
import { decodeToken } from 'react-jwt'
import { useNavigate } from 'react-router-dom'
import './navbar.css'
import axios from 'axios'
export default function Navbar({ home }) {
  const navigate = useNavigate()
  const [user, setUser] = useState({ email: "", firstName: "", lastName: "" })
  const [showMenu, setShowMenu] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const token = localStorage.getItem("auth-token")

  useEffect(() => {
    if (token) {
      const decodedToken = decodeToken(token)
      setIsAuthenticated(true)
      axios.post("https://instawork-backend.vercel.app/user/getUser", {
        data: {
          email: decodedToken?.email
        }
      }).then(res => {
        setUser({ email: res.data.user.email, firstName: res.data.user.firstName, lastName: res.data.user.lastName })
      })
    }
  }, [])
  const handleLogout = () => {
    localStorage.removeItem("auth-token")
    navigate("/login", { state: { message: "logout successfully!" } })
  }
  const handlePost = () => {
    navigate("/post")
  }
  const handleBar = () => {
    setShowMenu(true)
    document.querySelector(".menu_container").classList.remove("display_none")
  }
  const handleClose = () => {
    setShowMenu(false)
    document.querySelector(".menu_container").classList.add("display_none")
  }
  const handleLogin = () => {
    navigate("/login")
  }
  const handleSignup = () => {
    navigate("/signup")
  }
  return (
    <>
      <nav>
        <ul className='nav_container'>
          <div className="left"><span className='insta'>insta</span><span className='work'>work</span>.</div>

          <div className="right">
            {!isAuthenticated ? <><button className='nav_link_btn' onClick={() => navigate('/login')}>Login</button>
              <button className='nav_link_btn' onClick={() => navigate('/signup')}>Register</button></> :
              home ? <span className='nav_link_btn' onClick={() => navigate("/")}>Home</span> : <span className='nav_link_btn' onClick={handlePost}>Post Job</span>
            }
            {isAuthenticated && <div className='profile_big_container'>
              <span className='profile_btn'>{user.firstName.charAt(0).toUpperCase()}</span>
              <div className='profile_container'>
                <div className='user_name'>{user.firstName.toUpperCase()} {user.lastName.toUpperCase()}</div>
                <div className='user_email'>{user.email}</div>
                <hr className='line' />
                <div className="lower">
                  <div onClick={() => navigate("/")}>home</div>
                  <div onClick={() => navigate("/works")}>Find Jobs</div>
                  <div onClick={() => navigate("/post")}>post job</div>
                  <div onClick={() => navigate("/")}>chats</div>
                  <div onClick={() => navigate("/myjobs")}>my jobs</div>
                  <div onClick={handleLogout}>logout</div>
                </div>
              </div>
            </div>}

          </div>
          {/* mobile nav */}
          <div className="auth_mobile_menu">
            {!showMenu && <i className="fa-solid fa-bars" onClick={handleBar}></i>}
          </div>
        </ul>
      </nav>
      {/* after clicking to show */}
      <div className="menu_container display_none">
        <div className="mobileMenu">
          {showMenu && <i className="fa-solid fa-x" onClick={handleClose}></i>}
        </div>
        {!isAuthenticated && <div className="menu_inner_container">
          <div className=''>WELCOME TO INSTAWORK</div>
          <div className=''>
            <hr className='line' />
          </div>
          <span className='' onClick={() => navigate("/")}>Home</span>
          <span className='' onClick={handleLogin}>Login</span>
          <span className='' onClick={handleSignup}>Signup</span>
        </div>}
        {isAuthenticated && <div className="menu_inner_container">
          <div className=''>{user.firstName.toUpperCase()} {user.lastName.toUpperCase()}</div>
          <div className=''>{user.email}
            <hr className='line' />
          </div>
          <div className='container_for_cursor'>
            <div className='profile_home' onClick={() => navigate("/")}>Home</div>
            <div className='profile_home' onClick={() => navigate("/works")}>Find Jobs</div>
            <div>My Jobs</div>
            <div>Chats</div>
            <div className='profile_post_job' onClick={() => navigate("/post")}>Post Job</div>
            <div className='profile_logout' onClick={handleLogout}>Logout</div>
          </div>
        </div>}
      </div>
    </>
  )
}
