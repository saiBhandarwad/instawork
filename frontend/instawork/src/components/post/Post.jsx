import React, { useEffect, useReducer, useRef, useState } from 'react'
import './post.css'
import axios from 'axios'
import { useLocation, useNavigate } from 'react-router-dom'
import Navbar from '../navbar/Navbar'
import Notifty from '../notify/Notify'
import { useDispatch, useSelector } from 'react-redux'
import { fetchAllWorks, getMyJobs, getSavedJobs, setNotify, setShowNotify } from '../../redux/authSlice'

export default function Post({ work, setShowUpdateBox }) {
    const {pathname} = useLocation()
    const setWorkType = "workType";
    const setSalary = "salary";
    const setCity = "city";
    const setDuration = "duration";
    const setStartDate = "startDate";
    const setEndDate = "endDate";
    const setDetail = "detail";
    const setAddress = "address";
    let initialState = {
        workType: "", salary: "", city: "", duration: "", startDate: "", endDate: "", detail: "", address: "", period: "", showContainer: true
    }
    const [state, thisDispatch] = useReducer(reducer, initialState)
    const dispatch = useDispatch()
    const notify = useSelector(state => state.user.notify)
    const showNotify = useSelector(state => state.user.showNotify)
    const [period, setPeriod] = useState()
    const navigate = useNavigate()
    const token = localStorage.getItem("auth-token")
    const workRef = useRef()
    const salaryRef = useRef()
    const cityRef = useRef()
    const durationRef = useRef()
    const startDateRef = useRef()
    const endDateRef = useRef()
    const detailRef = useRef()
    const addressRef = useRef()
    const periodRef = useRef()
    useEffect(() => {
        if (!token) {
            navigate("/login")
        }
        if (work) {
            workRef.current.value = work.type
            salaryRef.current.value = work.salary
            cityRef.current.value = work.city
            durationRef.current.value = work.duration
            startDateRef.current.value = work.startDate.slice(0, 10)
            endDateRef.current.value = work.endDate.slice(0, 10)
            detailRef.current.value = work.detail
            addressRef.current.value = work.address
            handleActive(work.salaryPeriod)

            thisDispatch({ type: setWorkType, payload: work.type })
            thisDispatch({ type: setSalary, payload: work.salary })
            thisDispatch({ type: setCity, payload: work.city })
            thisDispatch({ type: setDuration, payload: work.duration })
            thisDispatch({ type: setStartDate, payload: work.startDate })
            thisDispatch({ type: setEndDate, payload: work.endDate })
            thisDispatch({ type: setDetail, payload: work.detail })
            thisDispatch({ type: setAddress, payload: work.address })
        }
    }, [])

    function reducer(state, action) {
        switch (action.type) {
            case "workType": {
                return { ...state, workType: action.payload }
            }
            case "salary": {
                return { ...state, salary: action.payload }
            }
            case "city": {
                return { ...state, city: action.payload }
            }
            case "duration": {
                return { ...state, duration: action.payload }
            }
            case "startDate": {
                return { ...state, startDate: action.payload }
            }
            case "endDate": {
                return { ...state, endDate: action.payload }
            }
            case "detail": {
                return { ...state, detail: action.payload }
            }
            case "address": {
                return { ...state, address: action.payload }
            }
            case "showContainer": {
                return { ...state, showContainer: action.payload }
            }
        }
    }
    const handleNotify = () => {
        dispatch(setShowNotify(true))
        setTimeout(() => {
            dispatch(setShowNotify(false))
        }, 5000);
    }
    const handleActive = (id) => {
        if (id == "daily") {
            setPeriod("daily")
            document.getElementById("daily").classList.add("active")
            document.getElementById("weekly").classList.remove("active")
        } else {
            setPeriod("weekly")
            document.getElementById("weekly").classList.add("active")
            document.getElementById("daily").classList.remove("active")
        }
    }
    const handlePost = async (update) => {
       //console.log({ update });
        if (!state.workType) {
            workRef.current.focus()
            workRef.current.classList.add("error-field")
            return
        } else {
            workRef.current.classList.remove("error-field")
        }
        if (!state.salary) {
            salaryRef.current.focus()
            salaryRef.current.classList.add("error-field")
            return
        } else {
            salaryRef.current.classList.remove("error-field")
        }
        if (!state.city) {
            cityRef.current.focus()
            cityRef.current.classList.add("error-field")
            return
        } else {
            cityRef.current.classList.remove("error-field")
        }
        if (!state.duration) {
            durationRef.current.focus()
            durationRef.current.classList.add("error-field")
            return
        } else {
            durationRef.current.classList.remove("error-field")
        }
        if (!state.startDate) {
            startDateRef.current.focus()
            startDateRef.current.classList.add("error-field")
            return
        } else {
            startDateRef.current.classList.remove("error-field")
        }
        if (!state.endDate) {
            endDateRef.current.focus()
            endDateRef.current.classList.add("error-field")
            return
        } else {
            endDateRef.current.classList.remove("error-field")
        }
        if (!state.detail) {
            detailRef.current.focus()
            detailRef.current.classList.add("error-field")
            return
        } else {
            detailRef.current.classList.remove("error-field")
        }
        if (!state.address) {
            addressRef.current.focus()
            addressRef.current.classList.add("error-field")
            return
        } else {
            addressRef.current.classList.remove("error-field")
        }
        if (!period) {
            periodRef.current.focus()
            periodRef.current.classList.add("error-field")
            return
        } else {
            periodRef.current.classList.remove("error-field")
        }
        let res;
        if (update) {
            res = await axios.patch("https://instawork-backend.vercel.app/work/updateWork", {
                data: {
                    workType: state.workType, salary: state.salary, city: state.city, duration: state.duration, startDate: state.startDate, endDate: state.endDate, detail: state.detail, address: state.address, salaryPeriod:period, _id:work._id
                },
                headers: {
                    token
                }
            })
        } else {
            res = await axios.post("https://instawork-backend.vercel.app/work/postJob", {
                data: {
                    workType: state.workType, salary: state.salary, city: state.city, duration: state.duration, startDate: state.startDate, endDate: state.endDate, detail: state.detail, address: state.address, salaryPeriod:period, postedDate: Date.now()
                },
                headers: {
                    token
                }
            })
        }

       //console.log({res});
        if (res?.data?.success) {
           //console.log({pathname});
            if(pathname === "/works"){
                dispatch(fetchAllWorks(token))
            }else{
                dispatch(getMyJobs(token))
                dispatch(getSavedJobs(token))
            }
            handleNotify()
            dispatch(setNotify({ status: res.data.success, message: res.data.message }))
            workRef.current.value = ""
            salaryRef.current.value = ""
            cityRef.current.value = ""
            durationRef.current.value = ""
            startDateRef.current.value = ""
            endDateRef.current.value = ""
            detailRef.current.value = ""
            addressRef.current.value = ""
        } else {
            handleNotify()
            dispatch(setNotify({ status: res.data.success, message: res.data.message }))
        }
    }
    const handleContainer = () => {
        if (!work) return
        setShowUpdateBox(false)
        thisDispatch({ type: "showContainer", payload: false })
    }
    return (
        <>
            {state.showContainer && <div className={`${work ? "updateBoxContainer" : "post-container"}`} onClick={handleContainer}>
                <div className="post-form" onClick={(e) => e.stopPropagation()}>
                    {work && <i className='fa-solid fa-xmark closeBtn' onClick={handleContainer}></i>}
                    <div className="post-inner-container">
                        <p className='post-heading'>Find Worker With Us!</p>
                        <div className="post-detail">
                            <div className="post-left">
                                <div className="input-container">
                                    <label htmlFor="" >Work Type</label>
                                    <br />
                                    <input type="text" placeholder='e.g. painting' ref={workRef} onChange={(e) => thisDispatch({ type: setWorkType, payload: e.target.value.trim() })} />
                                </div>
                                <div className="input-container">
                                    <label htmlFor="">Salary</label>
                                    <br />
                                    <input type="number" placeholder='e.g. 500' ref={salaryRef} onChange={(e) => thisDispatch({ type: setSalary, payload: e.target.value })} />
                                </div>
                                <div className="input-container">
                                    <label htmlFor="">City</label>
                                    <br />
                                    <input ref={cityRef} placeholder='e.g. pune' onChange={(e) => thisDispatch({ type: setCity, payload: e.target.value.trim() })}></input>
                                </div>
                                <div className="input-container">
                                    <label htmlFor="">Duration</label>
                                    <br />
                                    <input type="number" placeholder='e.g. days in number' ref={durationRef} onChange={(e) => thisDispatch({ type: setDuration, payload: e.target.value })} />
                                </div>
                                <div className="input-container">
                                    <label htmlFor="">Salary Period</label>
                                    <br />
                                    <button ref={periodRef} className='salaryBtn' id="daily" onClick={(e) => handleActive(e.target.id)}>Daily</button>
                                    <button className='salaryBtn' id='weekly' onClick={(e) => handleActive(e.target.id)}>Weekly</button>
                                </div>
                            </div>

                            <div className="post-right">
                                <div className="input-container">
                                    <label htmlFor="">Start Date</label>
                                    <br />
                                    <input type="date" ref={startDateRef} onChange={(e) => thisDispatch({ type: setStartDate, payload: e.target.value.trim() })} />
                                </div>
                                <div className="input-container">
                                    <label htmlFor="">End Date</label>
                                    <br />
                                    <input type="date" ref={endDateRef} onChange={(e) => thisDispatch({ type: setEndDate, payload: e.target.value })} />
                                </div>

                                <div className="input-container">
                                    <label htmlFor="">Work Details</label>
                                    <br />
                                    <textarea ref={detailRef} onChange={(e) => thisDispatch({ type: setDetail, payload: e.target.value.trim() })}></textarea>
                                </div>
                                <div className="input-container">
                                    <label htmlFor="">Full Address</label>
                                    <br />
                                    <textarea ref={addressRef} onChange={(e) => thisDispatch({ type: setAddress, payload: e.target.value.trim() })}></textarea>
                                </div>

                            </div>
                        </div>
                        <div className='postBtnContainer'>
                            {work ? <button className='postBtn' onClick={(e) => handlePost(true)}>UPDATE JOB</button> : <button className='postBtn' onClick={(e) => handlePost(false)}>POST JOB</button>}
                        </div>
                    </div>
                </div>
            </div>}
            {showNotify && <Notifty msg={notify.message} status={notify.status} />}
        </>
    )
}
