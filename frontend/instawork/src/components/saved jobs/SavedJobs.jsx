import React, { useEffect, useState } from 'react'
import Navbar from '../navbar/Navbar'
import Filter from '../filter/Filter'
import Job from '../job/Job'
import { useSelector } from 'react-redux'
import './savedJob.css'
export default function SavedJobs() {
    const myJobs = useSelector(state => state.user.myJobs)
    const savedJobs = useSelector(state => state.user.savedJobs)
    const [showFilter, setShowFilter] = useState()
    const [showMyJobs, setShowMyJobs] = useState(true)
    const toggleFilter = () => {
        setShowFilter(!showFilter)
    }
    useEffect(() => {
        console.log({ myJobs, savedJobs });
    }, [])
    const handleMyJobs = (e) =>{
        document.getElementById("bg_btn").classList.add("left")
        document.getElementById("bg_btn").classList.remove("right")
        setShowMyJobs(true)
    }
    const handleMySavedJobs = (e) =>{
        document.getElementById("bg_btn").classList.add("right")
        document.getElementById("bg_btn").classList.remove("left")
        setShowMyJobs(false)
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
            <div className="jobs_btn">
                <div className='jobs_btn_wrapper'>
                    <span className='my_jobs' id="my_jobs" onClick={handleMyJobs}>my jobs</span>
                    <span className='saved_jobs' id="saved_jobs" onClick={handleMySavedJobs}>saved jobs</span>
                    <span className='bg_btn left' id="bg_btn"></span>
                </div>
            </div>
            {showMyJobs && <div className='status'>{myJobs?.length} {myJobs?.length <= 1 ? " job" : "Jobs"} you have posted..</div>}
            {!showMyJobs && <div className='status'>{savedJobs?.length} {savedJobs?.length <= 1 ? "job" : "Jobs"} you have saved..</div>}
            <div className="app_container">
                <Filter />
                <div className="job_holder">
                    {showMyJobs && <Job jobArray={myJobs} />}
                    {!showMyJobs && <Job jobArray={savedJobs} />}
                </div>
            </div>
        </>
    )
}
