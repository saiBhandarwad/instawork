import React, { useContext, useEffect, useRef, useState } from 'react'
import './filter.css'
import filterIcon from '../../assets/filter-filled-tool-symbol.png'
import sortIcon from '../../assets/sort.png'
import { useSelector, useDispatch } from 'react-redux'
import { fetchFilteredWorks, getAllCityAndWorks } from '../../redux/authSlice'

export default function () {
  const allWorks = useSelector(state => state.user.allWorks)
  const allWorkTypes = useSelector(state => state.user.allWorkTypes)
  const allCities = useSelector(state => state.user.allCities)
  const dispatch = useDispatch()
  const [city, setCity] = useState()
  const [sortType, setSortType] = useState("asc")
  const [workType, setWorkType] = useState()
  const [salary, setSalary] = useState(500)
  const [salaryRange, setSalaryRange] = useState('0.5k')
  const [salaryPeriod, setSalaryPeriod] = useState("any")
  const [sortBy, setSortBy] = useState("postedDate")
  const [showWorkOptions, setShowWorkOptions] = useState()
  const [showLocationOptions, setShowLocationOptions] = useState()
  const [workTypeValue, setWorkTypeValue] = useState('')
  const [workTypeArray, setWorkTypeArray] = useState([])
  const [cityValue, setCityValue] = useState('')
  const [cityArray, setCityArray] = useState([])
  const workTypeRef = useRef()
  const locationRef = useRef()
  const token = localStorage.getItem("auth-token")
  useEffect(() => {
    dispatch(getAllCityAndWorks(token))
    selectLatestRadio()
    selectAnySalaryPeriod()
  }, [])

  useEffect(() => {
    setWorkTypeArray(allWorkTypes?.filter((item, i, arr) => arr.indexOf(item) === i))
  }, [allWorkTypes])

  useEffect(() => {
    setCityArray(allCities?.filter((item, i, arr) => arr.indexOf(item) === i))
  }, [allCities])

  useEffect(() => {
    setWorkTypeArray(allWorkTypes?.filter((item, i, arr) => arr.indexOf(item) === i)
      .filter(item => item.startsWith(workTypeValue)))
  }, [workTypeValue])

  useEffect(() => {
    setCityArray(allCities?.filter((item, i, arr) => arr.indexOf(item) === i)
      .filter(item => item.startsWith(cityValue)))
  }, [cityValue])

  document.addEventListener("click", () => {
    if (locationRef.current === document.activeElement) {
      setShowLocationOptions(true)
    } else {
      setShowLocationOptions(false)
    }
    if (workTypeRef.current === document.activeElement) {
      setShowWorkOptions(true)
    } else {
      setShowWorkOptions(false)
    }
  }, false)
  const handleSalaryRange = (e) => {
    selectAnySalaryPeriod()
    let obj = { salary: { $gte: e.target.value.slice(0, 1) * 1000 } }
    setSalary(e.target.value.slice(0, 1) * 1000)
    if (workType) {
      obj.type = workType
    }
    if (city) {
      obj.city = city
    }
    if(salaryPeriod){
      if(salaryPeriod!=="any"){
        obj.salaryPeriod = salaryPeriod
      }
    }
    dispatch(fetchFilteredWorks({ obj, sortBy, sortType, token }))
    const salaryBG = document.querySelector('.salary_range_bg')
    const salaryRange = document.querySelector('.salary_range')
    if (e.target.value === '0.5') {
      salaryBG.style.left = +e.target.value * 6.25 - 18 + "%"
      salaryRange.style.left = +e.target.value * 6.25 - 12 + "%"
      setSalaryRange(e.target.value.slice(0, 3).concat('k'))
      return;
    }
    if (+e.target.value < 5) {
      salaryBG.style.left = +e.target.value * 6.25 - 11.5 + "%"
      salaryRange.style.left = +e.target.value * 6.25 - 9 + "%"
    } else {
      salaryBG.style.left = +e.target.value * 6.25 - 7 + "%"
      salaryRange.style.left = +e.target.value * 6.25 - 3 + "%"
    }
    if (e.target.value === '10.5') {
      setSalaryRange(e.target.value.slice(0, 2).concat('k'))
      return;
    }
    setSalaryRange(e.target.value.slice(0, 1).concat('k'))
  }
  const handleWorkType = () => {
    setShowWorkOptions(true)
  }
  const handleLocation = () => {
    setShowLocationOptions(true)
  }
  const workTypeOnChangeFunction = (e) => {
    setWorkTypeValue(e.target.value)
    setWorkType(e.target.value)
  }
  const locationOnChangeFunction = (e) => {
    setCityValue(e.target.value)
    setCity(e.target.value)
  }
  const handleWorkOption = (e, item) => {
    selectAnySalaryPeriod()
    workTypeRef.current.value = item
    setWorkTypeValue(item)
    setWorkType(item)
    
    let obj = { type: item }
    if (city) {
     obj.city = city
    }
    if (salary) {
      obj.salary = {$gte : salary}
    }
    if(salaryPeriod){
      if(salaryPeriod!=="any"){
        obj.salaryPeriod = salaryPeriod
      }
    }
    dispatch(fetchFilteredWorks({ obj, sortBy, sortType, token }))
  }
  const handleCityOption = (e, item) => {
    selectAnySalaryPeriod()
    locationRef.current.value = item
    setCityValue(item)
    setCity(item)

    let obj = {city:item}
    if (workType) {
      obj.type = workType
    }
    if(salary){
      obj.salary = {$gte : salary}
    }
    if(salaryPeriod){
      if(salaryPeriod!=="any"){
        obj.salaryPeriod = salaryPeriod
      }
    }
    dispatch(fetchFilteredWorks({ obj, sortBy, sortType, token }))
  }
  const handleApply = () => {

    if (city && workType && salary && salaryPeriod && sortBy && sortType) {
      let obj = { type: workType, city, salary: { $gte: salary }, salaryPeriod }
      dispatch(fetchFilteredWorks({ obj, sortBy, sortType, token }))
      console.log({ city, workType, salary, salaryPeriod, sortBy, token });
    }
  }
  const handleReset = () => {

  }
  const handleSalaryPeriod = (period) => {
    let obj = { salaryPeriod: period, salary: { $gte: salary } }
    setSalaryPeriod(period)
    if (workType) {
      obj.workType = workType
    }
    if (city) {
      obj.city = city
    }
    if (period === "any") {
      delete obj["salaryPeriod"]
    }
    dispatch(fetchFilteredWorks({ obj, sortBy, sortType, token }))
  }
  const handleSortType = (e) => {
    let id = e.target.id
    let obj = {}
    if (id == "asc") {
      setSortType("asc")
      document.getElementById("asc").classList.add("active")
      document.getElementById("desc").classList.remove("active")
    } else {
      setSortType("desc")
      document.getElementById("desc").classList.add("active")
      document.getElementById("asc").classList.remove("active")
    }
    if (city) {
      obj.city = city
    }
    if (workType) {
      obj.type = workType
    }
    if (salary) {
      obj.salary = { $gte: salary }
    }
    if(sortBy==="postedDate"){
      if(id==="asc"){
        dispatch(fetchFilteredWorks({ obj, sortBy, sortType: "desc", token }))
      }
      if(id==="desc"){
        dispatch(fetchFilteredWorks({ obj, sortBy, sortType: "asc", token }))
      }
      return
    }
    dispatch(fetchFilteredWorks({ obj, sortBy, sortType: id, token }))
  }
  const selectAnySalaryPeriod = () => {
    document.getElementById("anyRadioInput").setAttribute("checked", "checked")
  }
  const selectLatestRadio = () => {
    document.getElementById('latestRadioInput').setAttribute("checked", "checked")
  }
  const handleSortBy = (sortBy) =>{
    let obj = {}
    setSortBy(sortBy)
    if (city) {
      obj.city = city
    }
    if (workType) {
      obj.type = workType
    }
    if (salary) {
      obj.salary = { $gte: salary }
    }
    dispatch(fetchFilteredWorks({ obj, sortBy, sortType, token }))

  }
  const handleSalaryPopup = (mode) =>{
    if(mode==="leave"){
      document.getElementById("salary_range_bg").classList.add("display_none")
      document.getElementById("salary_range").classList.add("display_none")
    }
    if(mode==="enter"){
      document.getElementById("salary_range_bg").classList.remove("display_none")
      document.getElementById("salary_range").classList.remove("display_none")
    }
  }
  return (
    <>
      <div className="filter_holder">
        <div className="filter_container">
          <div className="filter_icon">
            <img src={filterIcon} alt="" />
            <span>Filters</span>
          </div>
          <div className="profile">

            {/************************ Work Type ***************************************/}

            <label >Work Type</label>
            <br />
            <input type="text" ref={workTypeRef} placeholder='eg. Loading and Unloading' onClick={handleWorkType} onChange={workTypeOnChangeFunction} />

            {showWorkOptions &&
              <div className='work_option_container'>
                {
                  workTypeValue?.length === 0 && allWorkTypes?.map(item => <div className='work_option' key={item} onClick={(e) => handleWorkOption(e, item)}>{item}</div>)
                }
                {
                  workTypeValue?.length > 0 && workTypeArray?.length === 0 && <div className='work_option'>no match found</div>
                }
                {workTypeValue?.length > 0 && workTypeArray?.length > 0 && workTypeArray?.map(
                  (item, i) => <div className='work_option' key={item} onClick={(e) => handleWorkOption(e, item)}>{item}</div>)
                }
              </div>
            }
          </div>
          {/******************** location **************************************/}

          <div className="location">
            <label htmlFor="location">Location</label>
            <br />
            <input type="text" ref={locationRef} placeholder='eg. Pune' name='location' onClick={handleLocation} onChange={locationOnChangeFunction} />
            {showLocationOptions && <div className='location_option_container'>
              {cityValue?.length === 0 ? (
                allCities?.filter((item, i, arr) => arr.indexOf(item) === i)
                  .map(item => <div className='work_option' key={item} onClick={(e) => handleCityOption(e, item)}>{item}</div>)
              ) : (
                cityArray?.length === 0 ? (
                  <div className='location_option' >no match found</div>
                ) : (
                  cityArray?.map((item) => <div className='location_option' key={item} onClick={(e) => handleCityOption(e, item)}>{item}</div>)
                )
              )}
            </div>}
          </div>

          <div className="salary">
            <label htmlFor="salary">Salary</label>
            <span className='salary_range display_none' id='salary_range'>{salaryRange}</span>
            <span className='salary_range_bg display_none' id='salary_range_bg'></span>
            <br />
            <div className="range">
              <span>0.5k</span><input type="range" defaultValue="0.5" step='1' min='0.5' max='10.5' onMouseLeave={()=>handleSalaryPopup("leave")} onMouseEnter={()=>handleSalaryPopup("enter")} onChange={e => handleSalaryRange(e)} /> <span>10k</span>
            </div>
          </div>
          <div className="salary_period_container">
            <p>Salary Period</p>
            <div className="salary_period">
              <input type="radio" id='dailyRadioInput' name='salary_period' onClick={() => handleSalaryPeriod("daily")} />
              <label htmlFor="salary_period" > Daily</label>
              <input type="radio" id='weeklyRadioInput' name='salary_period' onClick={() => handleSalaryPeriod("weekly")} />
              <label htmlFor="salary_period" > Weekly</label>
              <input type="radio" id='anyRadioInput' name='salary_period' onClick={() => handleSalaryPeriod("any")} />
              <label htmlFor="salary_period" > Any</label>
            </div>
          </div>
          <div className="sortby_container">
            <p><img src={sortIcon} alt="" />Sort By <button className='active' id='asc' onClick={handleSortType}>asc</button> <button className='' id='desc' onClick={handleSortType}>desc</button></p>
            <div className="latest" >
              <input type="radio" name='sort' id='latestRadioInput' onClick={() => handleSortBy("postedDate")} />
              <span>Latest</span>
            </div>
            <div className="duration" >
              <input type="radio" name='sort' onClick={() => handleSortBy("duration")} />
              <span>Duration</span>
            </div>
            <div className="salary_sorter" >
              <input type="radio" id='salaryRadioInput' name='sort' onClick={() => handleSortBy("salary")} />
              <span>Salary</span>
            </div>
          </div>
          <button className='apply_btn' onClick={handleApply}>Apply</button>
          <button className='reset_btn' onClick={handleReset}>Reset</button>
        </div>
      </div>
    </>

  )
}
