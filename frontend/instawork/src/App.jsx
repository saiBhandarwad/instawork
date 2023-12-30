import React, { createContext, useEffect, useState } from 'react'
import Navbar from './components/navbar/Navbar'
import Filter from './components/filter/Filter'
import Job from './components/job/Job'
import './App.css'
import { useLocation, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { setShowNotify, setNotify, fetchAllWorks, getSavedJobs, getMyJobs } from './redux/authSlice'
import { useDispatch, useSelector } from 'react-redux'
import Notifty from './components/notify/Notify'
import { isExpired } from 'react-jwt'
export const MyContext = createContext()
export default function App() {
  const allWorks = useSelector(state => state.user.allWorks)
  const location = useLocation()
  const dispatch = useDispatch()
  const showNotify = useSelector(state => state.user.showNotify)
  const notify = useSelector(state => state.user.notify)
  const [showFilter, setShowFilter] = useState()
  const navigate = useNavigate()
  const token = localStorage.getItem("auth-token")


  useEffect(() => {
    let isMyTokenExpired;
    if (token) {
      isMyTokenExpired = isExpired(token)
      if(isMyTokenExpired){
        localStorage.removeItem("auth-token")
        navigate("/login")
        return
      }      
      dispatch(getSavedJobs(token))
      dispatch(getMyJobs(token))
    }
    console.log({ isMyTokenExpired });
    if (isMyTokenExpired) {
      localStorage.removeItem("auth-token")
      dispatch(setNotify({ status: true, message: "token is expired" }))
      handleNotify()
    }
    if (location?.state?.message) {
      dispatch(setNotify({ status: true, message: location?.state?.message }))
      handleNotify()
    }
    validateUser()
    dispatch(fetchAllWorks(token))

  }, [])

  const handleNotify = () => {
    dispatch(setShowNotify(true))
    setTimeout(() => {
      dispatch(setShowNotify(false))
    }, 5000);
  }
  const validateUser = () => {
    axios.post("https://instawork-backend.vercel.app/user/validateUser", {
      data: { token }
    }).then((res) => {
      if (res.data.success) {
        // nothing to do
      } else {
        navigate("/login")
      }
    }).catch((error) => {
      console.log({ error })
    })
  }

  const toggleFilter = () => {
    setShowFilter(!showFilter)
  }
  return (
    <>

      <Navbar />
      <div className="main_heading_container">
        <div className="main_heading">Ab Paise Ki Tension Ko Karo Bye Bye!
          <br />
          Find Work With Us!</div>
      </div>
      <div className="filter_handler_container">
        <div className="filter_handler" onClick={toggleFilter}>
          <i className="fa-solid fa-filter"></i>
          <span>Filter</span>
        </div>
        {showFilter && <div className="show_filter_holder">
          <i className="fa-solid fa-x" onClick={toggleFilter}></i>
          <Filter />
        </div>}
      </div>
      <div className='status'>{allWorks?.length} {allWorks?.length <= 1 ? "Job" : "Jobs"} Found..</div>
      <div className="app_container">
        <Filter />
        <div className="job_holder">
          <Job jobArray={allWorks}/>
        </div>
      </div>
      {showNotify && <Notifty msg={notify?.message} status={notify?.status} />}

    </>
  )
}
