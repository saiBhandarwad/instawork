import React, { useEffect, useState } from 'react'
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

export default function Job({ jobArray }) {
    // const allWorks = useSelector(state => state.user.allWorks)
    const loading = useSelector(state => state.user.loading)
    const dispatch = useDispatch()
    const token = localStorage.getItem("auth-token")
    useEffect(() => {
        dispatch(fetchAllWorks(token))
        dispatch(getSavedJobs(token))
        dispatch(getMyJobs(token))
        console.log({ jobArray });

    }, [])
    const handleSaveJob = async (e, work) => {
        e.target.innerHTML = "saved"
        const response = await axios.post("https://instawork-backend.vercel.app/work/saveJob", {
            data: { work },
            headers: { token }
        });
        console.log({ response });
        dispatch(fetchAllWorks(token))
    }

    return (
        <>
            {
                jobArray?.length === 0 && loading === false && <>
                    <div className="job_container d-flex justify-content-center align-items-center"> NO DATA AVAILABLE</div>
                    <div className="job_container d-flex justify-content-center align-items-center"> NO DATA AVAILABLE</div>
                </>
            }
            {jobArray?.length === 0 || loading && <>
                <div className="job_container d-flex justify-content-center align-items-center"> <Loader /></div>
                <div className="job_container d-flex justify-content-center align-items-center"> <Loader /></div>

            </>}

            {jobArray && jobArray?.map((work) => {
                const { address, city, duration, endDate, startDate, salary, salaryPeriod, type, user, postedDate, status } = work
                const hours = Math.ceil((Date.now() - postedDate) / (1000 * 60 * 60))
                const minutes = Math.floor(((Date.now() - postedDate) / (1000 * 60)) % 60)

                return (
                    <div className="job_container" key={work._id}>
                        <div className="job_title"> {type?.split(" ").map(item => item.charAt(0).toUpperCase() + item.slice(1) + " ")}</div>
                        <div className="company_info">{user}</div>
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
                                    {hours < 1 && Math.ceil(minutes) + " minutes ago"}
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
                            {status === "saved" && <button>{status}</button>}
                            {status === "save job" && <button onClick={(e) => handleSaveJob(e, work)}>{status}</button>}
                            {!status && <button onClick={(e) => handleSaveJob(e, work)}>SAVE JOB</button>}
                        </div>
                    </div>
                )
            })}
        </>
    )
}
