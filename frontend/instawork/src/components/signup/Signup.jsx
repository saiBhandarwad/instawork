import React, { useState } from 'react'
import axios from 'axios'
import welcomeImg from '../../assets/welcome.avif'
import mailImg from '../../assets/mail.png'
import userImg from '../../assets/user.png'
import lockImg from '../../assets/padlock.png'
import phoneIcon from '../../assets/telephone.png'
import './signup.css'
import { useNavigate } from 'react-router-dom'
import Navbar from '../navbar/Navbar'
import { useDispatch, useSelector } from 'react-redux'
import { setNotify, setShowNotify } from '../../redux/authSlice'
import Notifty from '../notify/Notify'

export default function Signup() {
    const showNotify = useSelector(state => state.user.showNotify)
    const notify = useSelector(state => state.user.notify)
    const [resOTP, setResOTP] = useState()
    const [MobileResOTP, setMobileResOTP] = useState()
    const [emailVerified, setEmailVerified] = useState()
    const [mobileNumberVerified, setMobileNumberVerified] = useState()
    const [mobileOTPVerified, setMobileOTPVerified] = useState()
    const [otpVerified, setOtpVerified] = useState()
    const [OTPSent, setOTPSent] = useState()
    const [mobileOTPSent, setMobileOTPSent] = useState()
    const [isEmailValid, setIsEmailValid] = useState()
    const [isMobileValid, setIsMobileValid] = useState()
    const [showEmailOTP, setShowEmailOTP] = useState(false)
    const [showMobileOTP, setShowMobileOTP] = useState(false)
    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [password, setPassword] = useState()
    const [confirmPassword, setConfirmPassword] = useState()
    const [email, setEmail] = useState(null)
    const [phone, setPhone] = useState('')
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const createUser = async () => {
        const response = await axios.post("https://instawork-backend.vercel.app/user/signup", {
            data: {
                firstName, lastName, email, phone, password
            }
        })
        if (response.data.success) {
            if (response.data.token) {
                localStorage.setItem("auth-token", response.data.token)
                dispatch(setIsLoggedIn(true))
                navigate("/works")
            }
        } else {
            dispatch(setNotify({ status: true, message: response.data.message }))
            handleNotify()
        }

    }
    const handleNotify = () => {
        dispatch(setShowNotify(true))
        setTimeout(() => {
            dispatch(setShowNotify(false))
        }, 5000);
    }
    const handleSignup = () => {
        if (firstName?.length < 3) {
            dispatch(setNotify({ status: true, message: "The minimum length of first name should be 3" }))
            handleNotify()
            return
        }
        else if (lastName?.length < 3) {
            dispatch(setNotify({ status: true, message: "The minimum length of last name should be 3" }))
            handleNotify()
            return
        }
        else if (emailVerified !== true) {
            dispatch(setNotify({ status: true, message: "email not verified" }))
            handleNotify()
            return
        }
        else if (password.length < 6 || !password) {
            const elem = document.getElementById("password")
            elem.classList.add("error-field")
            return
        }
        else if (confirmPassword.length < 6 || !confirmPassword) {
            const elem = document.getElementById("confirmPassword")
            elem.classList.add("error-field")
            return
        }
        else if (password !== confirmPassword) {
            dispatch(setNotify({ status: true, message: "password and confirm password did not match" }))
            handleNotify()
            const elem = document.getElementById("confirmPassword")
            elem.classList.add("error-field")
            return
        }
        else if (!phone || phone.length < 10) {
            const elem = document.getElementById("mobile_number")
            elem.classList.add("error-field")
            return
        }
        createUser()
    }
    const handleMobileNum = (e) => {
        
        setPhone(e.target.value)
        if (mobileNumberVerified === true) {
            setMobileNumberVerified('')
        }
        const elem = document.getElementById("mobile_number")
        if (e.target.value.length >= 10) {
            elem.value = e.target.value.slice(0, 10)
            setPhone(e.target.value.slice(0, 10))
            elem.classList.remove("error_field")
        } else {
            if(!elem.classList.contains("error_field")){
                elem.classList.add("error_field")
            }
        }
    }
    const handleOTP = (e, focusElem, verifyOTPFunction = null) => {
        if (e.target.value.length > 0) {
            document.getElementById(e.target.id).value = e.target.value.slice(e.target.value.length - 1)
            if (focusElem) {
                setTimeout(() => {
                    document.getElementById(focusElem).focus()
                }, 0);
            }
            if (verifyOTPFunction) {
                verifyOTPFunction()
            }
        }
    }
    const handleBackSpace = (e, focusElem) => {
        if (e.key == 'Backspace') {
            setTimeout(() => {
                document.getElementById(focusElem).focus()
            }, 0);
        }
    }
    const verifyOTP = () => {
        const otp1 = document.getElementById("otp1").value
        const otp2 = document.getElementById("otp2").value
        const otp3 = document.getElementById("otp3").value
        const otp4 = document.getElementById("otp4").value
        let totalOTP = otp1 + otp2 + otp3 + otp4
        if (totalOTP == resOTP) {
            setOtpVerified(true)
            setEmailVerified(true)
            setShowEmailOTP(false)
        } else {
            setOtpVerified(false)
        }
        setOTPSent(false)

    }
    const handleFirstName = (e) => {
        setFirstName(e.target.value)
        const elem = document.getElementById("first_name")
        if (e.target.value.length < 3) {

            elem.classList.add("error_field")
        } else {
            if (elem.classList.contains("error_field")) {
                elem.classList.remove("error_field")
            }
        }
    }
    const handleLastName = (e) => {
        setLastName(e.target.value)
        const elem = document.getElementById("last_name")
        if (e.target.value.length < 3) {

            elem.classList.add("error_field")
        } else {
            if (elem.classList.contains("error_field")) {
                elem.classList.remove("error_field")
            }
        }
    }
    const handlePassword = (e) => {
        setPassword(e.target.value)
        const elem = document.getElementById("password")
        if (e.target.value.length < 6) {
            elem.classList.add("error_field")
        } else {
            if (elem.classList.contains("error_field")) {
                elem.classList.remove("error_field")
            }
        }
        if (e.target.value === confirmPassword) {
            document.getElementById("confirmPassword").classList.remove("error_field")
        } else {
            document.getElementById("confirmPassword").classList.add("error_field")
        }
    }
    const handleConfirmPassword = (e) => {
        setConfirmPassword(e.target.value)
        const elem = document.getElementById("confirmPassword")
        if (e.target.value.length < 6 || e.target.value != password) {
            elem.classList.add("error_field")
        } else {
            if (elem.classList.contains("error_field")) {
                elem.classList.remove("error_field")
            }
        }
    }
    const handleEmail = (e) => {
        if (emailVerified === true) {
            setEmailVerified('')
        }
        setEmail(e.target.value)
        const elem = document.getElementById("email")
        if (e.target.value.includes("@")) {
            if (e.target.value.includes(".")) {
                if (elem.classList.contains("error_field")) {
                    elem.classList.remove("error_field")
                }
                setIsEmailValid(true)
            }

        } else {
            elem.classList.add("error_field")
            setIsEmailValid(false)
        }
    }
    const handleVerifyEmail = async (e) => {
        const elem = document.getElementById("email")
        if (email === null) {
            elem.classList.add("error_field")
            return;
        } else {
            elem.classList.remove("error_field")
        }
        if (isEmailValid === false || emailVerified === true) {
            //console.log({emailVerified,isEmailValid});
            return;
        }
        setShowEmailOTP(true)
        const res = await axios.post("https://instawork-backend.vercel.app/sendMail", {
            data: {
                email
            }
        })
        if (res.data.success) {
            setOTPSent(true)
            setOtpVerified('')
        } else {
            dispatch(setNotify({ status: false, message: res.data.message }))
            handleNotify()
        }
        setResOTP(res.data.OTP)

    }
    const sendMobileOTP = async () => {
        if (phone.length == 10) {
            setShowMobileOTP(true)
            const res = await axios.post("https://instawork-backend.vercel.app/sendOTP", {
                data: {
                    phone
                }
            })
            if (res.data.success) {
                localStorage.setItem("auth-token", res.data.token)
                setMobileOTPSent(true)
                setMobileResOTP(res.data.OTP)
                setIsMobileValid(true)
            } else {
                dispatch(setNotify({ status: false, message: res.data.message }))
                handleNotify()
                setMobileOTPSent(false)
                setIsMobileValid(false)
            }
        }
    }
    const debouncedSendOTP = () => {
        let timer;
        return () => {
            if (timer) clearTimeout(timer)
            timer = setTimeout(() => {
                sendMobileOTP()
            }, 500);
        }
    }
    const optSendOTP = debouncedSendOTP()
    const handleMobileOTP = (e, focusElem, verifyOTPFunction = null) => {
        if (e.target.value.length > 0) {
            document.getElementById(e.target.id).value = e.target.value.slice(e.target.value.length - 1)
            if (focusElem) {
                setTimeout(() => {
                    document.getElementById(focusElem).focus()
                }, 0);
            }
            if (verifyOTPFunction) {
                verifyOTPFunction()
            }
        }
    }
    const verifyMobileOTP = () => {
        const otp1 = document.getElementById("mob_otp1").value
        const otp2 = document.getElementById("mob_otp2").value
        const otp3 = document.getElementById("mob_otp3").value
        const otp4 = document.getElementById("mob_otp4").value
        let totalOTP = otp1 + otp2 + otp3 + otp4
        if (totalOTP == MobileResOTP) {
            setMobileNumberVerified(true)
            setShowMobileOTP(false)
            setMobileOTPVerified(true)

        } else {
            setMobileOTPVerified(false)
        }
        setMobileOTPSent("")

    }
    return (
        <>
            <div className="signup_holder">
                <div className="signup_container">

                    <div className="signup_left_container">
                        <div className="signup_left">
                            <p className='signup_heading'>USER SIGNUP</p>
                            <div className="user_holder">

                                <input className='' type="text" id='first_name' placeholder='Enter First Name' onChange={e => handleFirstName(e)} title='minimum length should be 3' />
                                <img src={userImg} alt="" id='firstNameIcon' />
                                <input type="text" id='last_name' placeholder='Enter Last Name' onChange={e => handleLastName(e)} title='minimum length should be 3' />
                                <img src={userImg} alt="" id='lastNameIcon' />

                            </div>
                            <div className="email_holder">
                                <input type="text" id='email' placeholder='Enter email here' onChange={e => handleEmail(e)} title='email should include @ and .' />
                                <img src={mailImg} alt="" id='mailIcon' />
                            </div>
                            <div className="email_verify_container">
                                <div className="email_verify_status">
                                    {emailVerified === true && <div className="verify_success">
                                        ✅verified
                                    </div>}
                                    {emailVerified === false && <div className="verify_fail">
                                        ❌not verified
                                    </div>}
                                </div>
                                <p className="email_verify_btn" onClick={handleVerifyEmail}>
                                    verify email
                                </p>
                            </div>
                            {showEmailOTP && <div className='otp_input_container' id="otp_container">
                                <label htmlFor="" className='labelForOTP'>Enter OTP : </label>
                                <input type="number" onChange={(e) => handleOTP(e, "otp2")} id='otp1' />
                                <input type="number" onChange={(e) => handleOTP(e, "otp3")} onKeyUp={e => handleBackSpace(e, "otp1")} id='otp2' />
                                <input type="number" onChange={(e) => handleOTP(e, "otp4")} onKeyUp={e => handleBackSpace(e, "otp2")} id='otp3' />
                                <input type="number" onChange={(e) => handleOTP(e, null, verifyOTP)} onKeyUp={e => handleBackSpace(e, "otp3")} id='otp4' />
                                <div className="otp_status_container">
                                    {OTPSent && <p className='otp_status_success'>✅ OTP sent successfully</p>}

                                    {otpVerified === false && <p className='otp_status_fail'>❌ wrong OTP</p>}
                                </div>
                            </div>}
                            <div className="password_holder">
                                <input type="text" id='password' placeholder='Enter password here' onChange={e => handlePassword(e)} title='minimum length should be 6' />
                                <img src={lockImg} alt="" id='passwordIcon' />
                                <input type="text" id='confirmPassword' placeholder='Enter password again' onChange={e => handleConfirmPassword(e)} />
                                <img src={lockImg} alt="" id='confirmPasswordIcon' />

                            </div>

                            <div className="signup_with_mobile">
                                <input className='' type="number" placeholder='Enter Mobile No' id='mobile_number' onChange={(e) => handleMobileNum(e)} />
                                {/* { <button className='send_otp_btn' onClick={optSendOTP}>SEND OTP</button>} */}
                                <img src={phoneIcon} alt="" id='phoneIcon' />

                            </div>
                            {mobileNumberVerified && <p>✅verified</p>}
                            {mobileNumberVerified === false && <p>❌not verified</p>}
                            {showMobileOTP && <div className='otp_input_container' id="otp_container">
                                <label htmlFor="" className='labelForOTP'>Enter OTP : </label>
                                <input type="number" onChange={(e) => handleMobileOTP(e, "mob_otp2")} id='mob_otp1' />
                                <input type="number" onChange={(e) => handleMobileOTP(e, "mob_otp3")} onKeyUp={e => handleBackSpace(e, "mob_otp1")} id='mob_otp2' />
                                <input type="number" onChange={(e) => handleMobileOTP(e, "mob_otp4")} onKeyUp={e => handleBackSpace(e, "mob_otp2")} id='mob_otp3' />
                                <input type="number" onChange={(e) => handleMobileOTP(e, null, verifyMobileOTP)} onKeyUp={e => handleBackSpace(e, "mob_otp3")} id='mob_otp4' />
                                <div className="otp_status_container">
                                    {mobileOTPSent && <p className='otp_status_success'>✅ OTP sent successfully</p>}

                                    {isMobileValid === false && <p className='otp_status_fail'>❌ Invalid Number</p>}
                                    {mobileOTPVerified === false && isMobileValid && <p className='otp_status_fail'>❌ wrong OTP</p>}
                                </div>
                            </div>}
                            <button className="signup_btn" onClick={handleSignup}>SIGNUP</button>
                            <p className='not_have_account' onClick={() => navigate("/login")}>already have an account?</p>
                        </div>

                    </div>
                    <div className="signup_img_container">
                        <img className='welcome_img' src={welcomeImg} alt="" />
                    </div>
                </div>
            </div>
            {showNotify && <Notifty msg={notify.message} status={notify.status} />}
        </>
    )
}
