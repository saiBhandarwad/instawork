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
    if (token) {
      let isMyTokenExpired = isExpired(token)
      if (isMyTokenExpired) {
        localStorage.removeItem("auth-token")
        navigate("/login")
      } else {
        axios.post("https://instawork-backend.vercel.app/user/validateUser", {
          data: { token }
        }).then((res) => {
          if (res.data.success) {
            dispatch(fetchAllWorks(token))
            dispatch(getSavedJobs(token))
            dispatch(getMyJobs(token))
            dispatch(setNotify({ status: true, message: "token is expired" }))
            handleNotify()
          } else {
            localStorage.removeItem("auth-token")
            navigate("/login")
          }
        })

      }
    }else{
      navigate("/login")
    }
    if (location?.state?.message) {
      dispatch(setNotify({ status: true, message: location?.state?.message }))
      handleNotify()
    }

  }, [])

  const handleNotify = () => {
    dispatch(setShowNotify(true))
    setTimeout(() => {
      dispatch(setShowNotify(false))
    }, 5000);
  }
  const toggleFilter = () => {
    setShowFilter(!showFilter)
  }
  return (
    <>

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
          <Job jobArray={allWorks} />
        </div>
      </div>
      {showNotify && <Notifty msg={notify?.message} status={notify?.status} />}

    </>
  )
}
