import React, { useEffect, useLayoutEffect, useState } from 'react'
import './job.css'
import locationIcon from '../../assets/location.png'
import salaryIcon from '../../assets/salary.png'
import dateIcon from '../../assets/calendar.png'
import durationIcon from '../../assets/hourglass.png'
import HistoryIcon from '../../assets/history.png'
import Loader from '../Loader'
import { useDispatch, useSelector } from 'react-redux'
import { fetchAllWorks, getMyJobs, getSavedJobs } from '../../redux/authSlice'
import axios from 'axios'
import { decodeToken } from 'react-jwt'
import Post from '../post/Post'
import { useLocation } from 'react-router-dom'
export default function Job({ jobArray, action }) {
    const { pathname } = useLocation()
    const [showMore, setShowMore] = useState()
    const loading = useSelector(state => state.user.loading)
    const [showUpdateBox, setShowUpdateBox] = useState()
    const [workToUpdate, setWorkToUpdate] = useState()
    const dispatch = useDispatch()
    const token = localStorage.getItem("auth-token")
    const { email } = decodeToken(token)
    let user = []

    useEffect(() => {
        dispatch(fetchAllWorks(token))
        dispatch(getSavedJobs(token))
        dispatch(getMyJobs(token))
    }, [])
    const handleSaveJob = async (e, work) => {
        if (e.target.innerHTML === "saved✅") return
        e.target.innerHTML = "saved✅"
        e.target.style.cssText = "background-color :rgba(74, 143, 85, 0.626); cursor:not-allowed"


        const response = await axios.post("https://instawork-backend.vercel.app/work/saveJob", {
            data: { work },
            headers: { token }
        });
    }
    const removeFromSaved = async (work) => {
        const response = await axios.post("http://localhost:8080/work/removeFromSavedJob", {
            data: { work, token },
            headers: { token }
        });
        dispatch(getSavedJobs(token))
    }
    const deleteWork = async (work) => {
        const response = await axios.post("https://instawork-backend.vercel.app/work/deleteWork", {
            data: { work },
            headers: { token }
        });
        if (pathname === "/works") {
            dispatch(fetchAllWorks(token))
        } else {
            dispatch(getMyJobs(token))
            dispatch(getSavedJobs(token))
        }
    }
    const updateWork = async (work) => {
        // const response = await axios.patch("https://instawork-backend.vercel.app/work/updateWork", {
        //     data: { work },
        //     headers: { token }
        // });
        //console.log(response);
        // dispatch(getMyJobs(token))
        setWorkToUpdate(work)
        setShowUpdateBox(true)
    }
    const handleMore = (show, i) => {
        if (show) {
            document.getElementById("moreContainer" + i).style.display = "block"
        } else {
            document.getElementById("moreContainer" + i).style.display = "none"
        }
    }
    return (
        <>
            {
                jobArray?.length === 0 && loading === false && <>
                    <div className="job_container d-flex justify-content-center align-items-center"> NO DATA AVAILABLE</div>
                </>
            }
            {loading && <>
                <div className="job_container d-flex justify-content-center align-items-center"> <Loader /></div>

            </>}

            {!loading && jobArray && jobArray?.map((work, i) => {
                const { address, city, duration, endDate, startDate, salary, salaryPeriod, type, postedDate, user, status } = work
                const hours = Math.ceil((Date.now() - postedDate) / (1000 * 60 * 60))
                const minutes = Math.floor(((Date.now() - postedDate) / (1000 * 60)) % 60)

                return (
                    <div className="job_container" key={work._id}>
                        {(work.owner === email || action==="remove")&& <>
                            <i className="fa-solid fa-ellipsis-vertical moreBtn" onClick={() => handleMore(true, i)}></i>
                            <div className="more-container" id={"moreContainer" + i}>
                                <i className='fa-solid fa-xmark' onClick={() => handleMore(false, i)}></i>

                                {(action === "remove") && <div className='' onClick={(e) => removeFromSaved(work)}>Unsave</div>}

                                {work.owner === email && <>
                                    <div className='' onClick={(e) => deleteWork(work)}>Delete</div>
                                    <div className='' onClick={(e) => updateWork(work)}>Update</div>
                                </>}
                            </div>
                        </>}
                        <div className="job_title"> {type?.split(" ").map(item => item.charAt(0).toUpperCase() + item.slice(1) + " ")}</div>
                        <div className="company_info">{user?.firstName} {user?.lastName}</div>
                        <div className="job_location"><img src={locationIcon} alt="" />{city} {address}</div>
                        <div className="job_related_info">
                            <div className="job_start_date">
                                <p className='job_img_container'><img src={dateIcon} alt="" />START DATE</p>
                                <p className='text-center'>{startDate.slice(0, 10)}</p>
                            </div>
                            <div className="job_duration">
                                <p className='job_img_container'><img src={durationIcon} alt="" />DURATION</p>
                                <p className='text-center'>{duration} day</p>
                            </div>
                            <div className="job_validity">
                                <p className='job_img_container'><img src={dateIcon} alt="" />END BY</p>
                                <p className='text-center'>{endDate.slice(0, 10)}</p>
                            </div>
                            <div className="job_salary">
                                <p className='job_img_container'><img src={salaryIcon} alt="" />SALARY</p>
                                <p className='text-center'>&#8377; {salary}</p>
                            </div>
                        </div>
                        <div className="extra_info">
                            <div className="job_posted_info">
                                <img src={HistoryIcon} alt="" />
                                <span>
                                    {hours <= 1 && minutes + " minutes ago"}
                                    {hours > 1 && hours < 24 && Math.ceil(hours) + " hours ago"}
                                    {hours >= 24 && Math.round(hours / 24) + " days ago"}
                                </span>
                            </div>
                            <div className="job_posted_info">
                                <img src={salaryIcon} alt="" />
                                <span>{salaryPeriod} Payment</span>
                            </div>
                        </div>
                        <div className="job_apply_btn">
                            {status === "saved" && <button className='savedBtn'>saved✅</button>}

                            {!status && <button className='saveBtn' onClick={(e) => handleSaveJob(e, work)}>SAVE JOB</button>}
                        </div>
                    </div>
                )
            })}
            {showUpdateBox && <Post work={workToUpdate} setShowUpdateBox={setShowUpdateBox} />}

        </>
    )
}
