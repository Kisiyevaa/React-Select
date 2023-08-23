import React, { useEffect, useState } from 'react'
import Select from "react-select"
import "bootstrap/dist/css/bootstrap.min.css"
import axios from "axios"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
function App() {
  const [countryList, setCountryList] = useState([])
  const [selectedCountry, setSelectedCountry] = useState(null)
  const [cityList, setCityList] = useState([])
  const [selectedCity, setSelectedCity] = useState(null)
  const [countryName, setCountryName] = useState('')
  const [cityName, setCityName] = useState('')
  const [filteredCountryList, setFilteredCountryList] = useState([]);
  useEffect(() => {
    getCountryList()
    handleSearchCountry('');

  }, [])

  const getCountryList = () => {
    axios.get("http://localhost:3000/countries")
      .then(res => setCountryList(res.data))
  }
  const handleChangeCountry = (country) => {
    setSelectedCountry(country)
    axios.get(`http://localhost:3000/cities?country_id=${country.id}`)
      .then(res => setCityList(res.data))
  }

  const createCountry = () => {
    if (!countryName) {
      toast.error('Input is empty!', {
        position: toast.POSITION.TOP_RIGHT
      });
      return
    }
    const existCountry = countryList.find(x => x.name.toLowerCase() === countryName.toLowerCase())
    if (existCountry) {
      toast('This country name exists!', {
        position: toast.POSITION.TOP_RIGHT,
        className: 'foo-bar'
      });
      return
    }
    axios.post('  http://localhost:3000/countries', {
      name: countryName
    }).then(res => {
      console.log(res.data);
      setCountryName('')
      setCountryList(prevState => [...prevState, res.data])
      toast.success('Success Notification !', {
        position: toast.POSITION.TOP_RIGHT
      });
    })
  }
  const createCity = () => {
    axios.post(' http://localhost:3000/cities', {
      name: cityName,
      country_id: selectedCountry.id
    }).then(res => {
      setCityList(prevState => [...prevState, res.data])
      setCityName('')
    })
  }

  const handleSearchCountry = (searchText) => {
    const filteredCountries = countryList.filter(country =>
      country.name.toLowerCase().includes(searchText.toLowerCase())
    );
    setFilteredCountryList(filteredCountries);
  };

  return (
    <div className='container'>
      <div className=' my-3'>
        <input
          type="text"
          className='py-1 px-2'
          placeholder="Search countries..."
          onChange={e => {
            handleSearchCountry(e.target.value);
          }}
        />
      </div>
      <div className='row my-4'>
        <div className='col-md-6 mb-4 '>
          <input type="text"
            value={countryName}
            onChange={e => setCountryName(e.target.value)}
          />
          <button onClick={createCountry} className='m-3 d-inline-block bg-secondary border border-0 px-2 p-1 
     rounded text-white'>Add country</button>
          <label className='d-block mb-2 fw-bold fs-4'>Country</label>
          <Select
            isSearchable
            value={selectedCountry}
            options={filteredCountryList.length > 0 ? filteredCountryList : countryList}
            getOptionLabel={option => option.name}
            getOptionValue={option => option.id}
            onChange={(country) => handleChangeCountry(country)}
          />
        </div>
        <div className='col-md-6'>

          {
            selectedCountry &&
            <div>
              <input type="text"
                value={cityName}
                onChange={e => setCityName(e.target.value)}
              />
              <button onClick={createCity} className='m-3 d-inline-block bg-secondary border border-0 px-2 p-1 
     rounded text-white'>Add city</button>
            </div>
          }
          <label className='d-block mb-2 fw-bold fs-4'>City</label>
          <Select
            isSearchable
            value={selectedCity}
            options={cityList}
            getOptionLabel={option => option.name}
            getOptionValue={option => option.id}
            onChange={e => setSelectedCity(e)}
          />
        </div>
      </div>
      <ToastContainer />
    </div>
  )
}

export default App