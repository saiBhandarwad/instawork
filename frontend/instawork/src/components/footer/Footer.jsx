import React from 'react'
import './footer.css'
export default function Footer() {
    return (
        <footer>
            <div className='about'>
                <h3>Instawork pvt.ltd.</h3>
                <p>Survey no. 48/28, </p>
                   <p>sainath nagar, Kharadi </p>
                   <p>Pune</p>
                <p><span>Phone</span> : +91-7083985513</p>
                <p><span>Email</span> : instaworker.com@gmail.com</p>
            </div>
            <div className='useful_links'>
                <h3>Useful Links</h3>
                <p><span>&gt;</span>Home</p>
                <p><span>&gt;</span>About</p>
                <p><span>&gt;</span>Services</p>
                <p><span>&gt;</span>Policy</p>
                <p><span>&gt;</span>Schemes</p>
            </div>
            <div className='our_services'>
                <h3>Our Services</h3>
                <p><span>&gt;</span>Post Work</p>
                <p><span>&gt;</span>Find Work</p>
                <p><span>&gt;</span>Filter and Sort</p>
                <p><span>&gt;</span>Different Works
                </p>
                <p><span>&gt;</span>Chat With Employer</p>
            </div>
        </footer>
    )
}
