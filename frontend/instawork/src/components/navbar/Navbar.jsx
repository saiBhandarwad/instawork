import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import './navbar.css'
import { fetchUserAsync, setIsLoggedIn } from '../../redux/authSlice'
import { useDispatch, useSelector } from 'react-redux'
export default function Navbar() {
  const navigate = useNavigate()
  const user = useSelector(state => state.user.user)
  const [showMenu, setShowMenu] = useState(false)
  const isLoggedIn = useSelector(state => state.user.isLoggedIn)
  const { pathname } = useLocation()
  const token = localStorage.getItem("auth-token")
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(fetchUserAsync(token))
  }, [isLoggedIn])

  useEffect(() => {
    if (user) {
      dispatch(setIsLoggedIn(true))
    }
  }, [user])

  const handleLogout = () => {
    localStorage.removeItem("auth-token")
    dispatch(setIsLoggedIn(false))
    navigate("/login", { state: { message: "logout successfully!" } })
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
  const handleHome = () =>{
    navigate("/")
  }
  const handleLink = (fn,elem) =>{
    fn()
    if(elem === "login"){
      document.getElementById("signup").classList.remove("activeLink")
      document.getElementById("home").classList.remove("activeLink")
    }
    if(elem === "signup"){
      document.getElementById("login").classList.remove("activeLink")
      document.getElementById("home").classList.remove("activeLink")
    }
    if(elem === "home"){
      document.getElementById("signup").classList.remove("activeLink")
      document.getElementById("login").classList.remove("activeLink")
    }
    document.getElementById(elem).classList.add("activeLink")
  }
  return (
    <>
      <nav>
        <ul className='nav_container'>
          <div className="left"><span className='insta'>insta</span><span className='work'>work</span>.</div>

          <div className="right">
            {!isLoggedIn && <>
              <span className='nav_link_btn activeLink' onClick={() => handleLink(handleHome,"home")} id="home">Home</span>
              <span className='nav_link_btn' onClick={() => handleLink(handleLogin,"login")} id="login">Login</span>
              <span className='nav_link_btn' onClick={() => handleLink(handleSignup,"signup")} id="signup">Register</span>
            </>}
            
            {isLoggedIn && <span className='nav_link_btn' onClick={() => navigate("/post")}>post job</span>}
            {isLoggedIn && <div className='profile_big_container'>
              <span className='profile_btn'>{user?.firstName.charAt(0).toUpperCase()}</span>
              <div className='profile_container'>
                <div className='user_name'>{user?.firstName.toUpperCase()} {user?.lastName.toUpperCase()}</div>
                <div className='user_email'>{user?.email}</div>
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
        {!isLoggedIn && <div className="menu_inner_container">
          <div className=''>WELCOME TO INSTAWORK</div>
          <div className=''>
            <hr className='line' />
          </div>
          <span className='' onClick={() => navigate("/")}>Home</span>
          <span className='' onClick={handleLogin}>Login</span>
          <span className='' onClick={handleSignup}>Signup</span>
        </div>}
        {isLoggedIn && <div className="menu_inner_container">
          <div className=''>{user?.firstName.toUpperCase()} {user?.lastName.toUpperCase()}</div>
          <div className=''>{user?.email}
            <hr className='line' />
          </div>
          <div className='container_for_cursor'>
            <div className='profile_home' onClick={() => navigate("/")}>Home</div>
            <div className='profile_home' onClick={() => navigate("/works")}>Find Jobs</div>
            <div onClick={() => navigate("/myjobs")}>My Jobs</div>
            <div onClick={() => navigate("/")}>Chats</div>
            <div className='profile_post_job' onClick={() => navigate("/post")}>Post Job</div>
            <div className='profile_logout' onClick={handleLogout}>Logout</div>
          </div>
        </div>}
      </div>
    </>
  )
}
