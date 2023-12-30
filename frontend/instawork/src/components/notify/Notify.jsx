import React from 'react'
import './notify.css'
export default function Notifty({msg}) {
  return (
    <>
    <div className='notify_container'>
        <div className="notify_msg">{msg}</div> 
        <div className="progress_line"></div>
       
    </div>
    </>
  )
}
