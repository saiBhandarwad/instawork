import React, { useEffect, useState } from 'react'
import './home.css'
import AOS from 'aos';
import 'aos/dist/aos.css';
import CountUp from 'react-countup'
import ScrollTrigger from 'react-scroll-trigger'
import empowerImg from "../../assets/empower.jpg"
import Footer from '../footer/Footer';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserAsync, verifyUser } from '../../redux/authSlice';
import Navbar from '../navbar/Navbar';

export default function Home() { 
  const token = localStorage.getItem("auth-token")
  const isLoggedIn = useSelector(verifyUser) 
  const dispatch = useDispatch()
  const [show, setShow] = useState(false)
  const navigate = useNavigate()
  useEffect(() => {
    dispatch(fetchUserAsync(token))
    AOS.init({
      offset: 100,
      duration: 1000,
      once: true
    });
  }, [])

  return (
    <>
      <Navbar/>
      <div className="home_main_container">
        <div className='img_container'>{/* for image */}</div>

        <div className="main_container">
          <div className='main_text_container' data-aos="zoom-in">
            <div className="heading ">Find all types <br /> of works with instawork.</div>
            <div className="description">Empowering Tomorrow's Youngsters: Make Money With Part Time Work with Our Comprehensive Platform!</div>
            <div className="get_started" onClick={() => navigate("/login")}>Get Started</div>
          </div>
        </div>
      </div>
      <div className="bg-white">
        <div className="empower_section">
          <div className="empower_left" data-aos="fade-up">
            <p className='empower_heading'>If you have the courage and the commitment to learn, we are here to empower you.</p>
            <p className='empower_text'>✅We are dedicated to providing all available work at your place.</p>
            <p className='empower_text'>✅Whether you are a student just out of school,</p>
            <p className='empower_text'>✅ a college or university student who does preparation for government exams.</p>
            <p className='empower_text'>✅a person who needs money to run their own expenses and their family's expenses.
            </p>
            <p className='empower_text'>✅A person who is new to big cities and is not getting work.
            </p>
            <p className='empower_text'>✅We strive to increase your chances of getting work according to your preferences.</p>
          </div>
          <div className="empower_right" data-aos="fade-up">
            <img src={empowerImg} alt="" />
          </div>
        </div>
        <div className="number_counter_section" id='number_counter_section'>

          <ScrollTrigger onEnter={() => setShow(true)} >{/* onExit={()=>setShow(false)} */}
            <div className="number_counter">
              <div className="first">
                <p className='num' data-number="1200">
                  {show && <CountUp separator='' className='countup' start={0} end={2000} delay={0} duration={2} />}
                  +</p>
                <p>works</p>
              </div>
              <div className="second">
                <p className='num' data-number="800">
                  {show && <CountUp separator='' className='countup' start={0} end={800} delay={0} duration={2} />}
                  +</p>
                <p>presence in cities</p>
              </div>
              <div className="third">
                <p className='num' data-number="800">
                  {show && <CountUp separator='' className='countup' start={0} end={500} delay={0} duration={2} />}+
                </p>
                <p>happy users</p>
              </div>
              <div className="fourth">
                <p className='num' data-number="2000">
                  {show && <CountUp separator='' className='countup' start={0} end={600} delay={0} duration={2} />}+
                </p>
                <p>type of works</p>
              </div>
            </div>
          </ScrollTrigger>
        </div>

        <div className="why_choose_section">
          <div className="wc_first" data-aos="zoom-in-up">
            <div className="wc_first_heading">
              why instawork?
            </div>
            <div className="wc_first_description">
            Choose us to get instant work at your location. Our platform stands out as a beacon of excellence, offering curated work. Benefit daily and weekly payment assurance, flexible working timings, and a supportive community. With the chat option, you can chat with employers and know more about work, embark on a transformative journey, and gain not just money but can earn experience in different domains.
            </div>
          </div>
          <div className="wc_second" data-aos="zoom-in-up">
            <i className="fa-solid fa-cubes"></i>
            <h3>Filter and Sorting</h3>
            <p className='wc_text'>We are a trusted platform, where you can get work with us, instawork provides filter and sorting functionality for finding jobs according to your preferences. </p>
          </div>
          <div className="wc_third" data-aos="zoom-in-up"><i className="fa-solid fa-circle-check"></i>
            <h3>Verified Accounts</h3>
            <p className='wc_text'>We already verified the email and phone numbers of all who post jobs and applicants, you don't need to worry about verification.</p></div>
          <div className="wc_fourth" data-aos="zoom-in-up"><i className="fa-solid fa-file-invoice-dollar"></i>
            <h3>Payment Assurance</h3>
            <p className='wc_text'> We are here to give trusted jobs with payment assurance, you have to browse jobs according to your preferences</p></div>
        </div>
      </div>
      <Footer />
    </>
  )
}
