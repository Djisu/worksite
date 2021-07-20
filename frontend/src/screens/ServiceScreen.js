import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { addToService, listServices } from '../actions/serviceActions'
import LoadingBox from '../components/LoadingBox'
import MessageBox from '../components/MessageBox'
import { storage } from '../firebase'

export default function ServiceScreen(props) {
  const dispatch = useDispatch()

  const state = {
    button: 1,
  }

  const userSignin = useSelector((state) => state.userSignin)
  const { userInfo, loading, error } = userSignin || ''

  const serviceItems = useSelector((state) => state.serviceItems)

  const { success: successAdd, error: errorAdd, loading: loadingAdd } =
    serviceItems || ''

  console.log('serviceItems==', serviceItems)

  const [addrtype, setAddrtype] = useState([
    'Printer',
    'carpenter',
    'mason',
    'electrician',
    'plumber',
    'Mechanic',
    'Tiler',
    'Black smith',
    'Painter',
    'Cleaner',
  ])

  //setCategory(['Printer', 'carpenter', 'mason', 'electrician', 'plumber'])

  let Add = addrtype.map((item) => item)

  const handleCategoryChange = (e) => {
    setCategory(addrtype[e.target.value])
    //setAddrtype('') //YOU CAN STILL DISABLE THIS LINE
  }
  const [category, setCategory] = useState('Printer') //

  const [name, setName] = useState('')

  let [image, setImage] = useState([])

  let [photo, setPhoto] = useState('')

  const [unitPrice, setUnitPrice] = useState(0)

  const [description, setDescription] = useState('')

  const [telno, setTelno] = useState('') //

  let [delay, setDelay] = useState(0)

  let [transDate, setTransDate] = useState(new Date())

  let [expireDate, setExpireDate] = useState(new Date())

  let [serviceFees, setServiceFees] = useState(0)
  let [email, setEmail] = useState('')

  // let email = ''
  // email = email ? userInfo.email : ''

  let rating = 0
  let numReviews = 0

  const redirect = props.location.search
    ? props.location.search.split('=')[1]
    : '/'

  useEffect(() => {
    if (!userInfo) {
      props.history.push(redirect)
    }
  }, [props.history, redirect, userInfo])

  useEffect(() => {
    dispatch(listServices())
  }, [dispatch])

  //fileupload modules  userInfo.employmentStatu
  //const [image, setImage] = useState(null)
  //const [url, setUrl] = useState('')
  const [url, setUrl] = useState(null)
  const [progress, setProgress] = useState(0)

  const handleChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0])
    }
  }

  const submitHandler = (e) => {
    e.preventDefault()

    if (state.button === 1) {
      console.log('instate.button === 1 uploadImage')

      const uploadTask = storage.ref(`images/${image.name}`).put(image)
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100,
          )
          setProgress(progress)
        },
        (error) => {
          console.log(error)
        },
        () => {
          storage
            .ref('images')
            .child(image.name)
            .getDownloadURL()
            .then((url) => {
              setUrl(url)
            })
        },
      )
      //return //image
    }

    if (state.button === 2) {
      console.log('in state.button === 2 submit form')

      delay = parseInt(delay)

      let myDate = new Date()
      let newDate = new Date(myDate.setDate(myDate.getDate() + delay))

      console.log('newDate=', newDate)

      setTransDate(new Date())
      setExpireDate(newDate)
      setEmail(userInfo.email)

      if (
        document.querySelector('img').src ===
        'http://via.placeholder.com/200X200'
      ) {
        console.log('in submitHandler no image selected')
        return
      }

      console.log('in submitHandler  addclick === true)')

      console.log(
        'document.querySelector(img).src',
        document.querySelector('img').src,
      )

      setPhoto(document.querySelector('img').src)

      console.log('photo is ', photo)

      if (photo === 'http://via.placeholder.com/200X200') {
        return
      }

      image = document.querySelector('img').src
      console.log('image is ', image)

      if (!image) {
        console.log('No image loaded')
        return
      }

      console.log('name====', name)

      if (!name) {
        alert('Name cannot be empty')
        return
      }
      if (!image) {
        alert('Image cannot be empty')
        return
      }
      if (!description) {
        alert('Description cannot be empty')
        return
      }
      if (!delay) {
        alert('delay is required')
      }
      if (!userInfo.email) {
        alert('email is required')
      }

      dispatch(
        addToService(
          category,
          email,
          name,
          image,
          unitPrice,
          rating,
          numReviews,
          description,
          telno,
          delay,
          transDate,
          expireDate,
          serviceFees,
        ),
      )
      setCategory('')
      setName('')
      setImage([])
      setUnitPrice(0)
      setDescription('')
      setTelno('')
      setServiceFees(0)

      alert('Service added successfully')
    }
  }

  return (
    <div>
      <Link to="/">Back to results</Link>
      <div className="col-2">
        <form className="form" onSubmit={submitHandler}>
          <div>
            <h1>Create a Service</h1>
          </div>
          {loading ? (
            <LoadingBox></LoadingBox>
          ) : error ? (
            <MessageBox variant="danger">{error}</MessageBox>
          ) : (
            <>
              {loadingAdd && <LoadingBox></LoadingBox>}
              {errorAdd && <MessageBox variant="danger">{errorAdd}</MessageBox>}
              {successAdd && (
                <MessageBox variant="success">
                  Service Added Successfully
                </MessageBox>
              )}
              {/*  </>
          )} */}
              {userInfo.employmentStatus === 'Employer' && (
                <h4 style={{ color: 'red' }}>
                  Employer cannot create services. Change employment status to
                  employee to create a service
                </h4>
              )}
              {!userInfo && <h4>Add email address to your profile</h4>}
              <div>
                <label>
                  Pick your category of service:
                  <br />
                  <select
                    onChange={(e) => handleCategoryChange(e)}
                    className="browser-default custom-select"
                  >
                    {Add.map((category, key) => (
                      <option key={key} value={key}>
                        {category}
                      </option>
                    ))}
                  </select>
                  <br />
                </label>
                <br />
              </div>
              <div>
                <label>
                  Give your service a nice name
                  <br />
                  <input
                    type="text"
                    id="name"
                    placeholder="Name"
                    requires
                    onChange={(e) => setName(e.target.value)}
                  ></input>
                </label>
              </div>
              <br />
              <div>
                <label>
                  Describe your service
                  <br />
                  <textarea
                    type="text"
                    id="description"
                    placeholder="Description"
                    requires
                    onChange={(e) => setDescription(e.target.value)}
                  ></textarea>
                </label>
              </div>
              <br />
              <div>
                <label>
                  Your Mobile Number
                  <br />
                  <input
                    type="text"
                    id="telno"
                    placeholder="Mobile Number"
                    requires
                    onChange={(e) => setTelno(e.target.value)}
                  ></input>
                </label>
              </div>
              <br />
              <div>
                <label>
                  State the unit price of your service
                  <br />
                  <input
                    type="float"
                    id="unitPrice"
                    placeholder="Enter the unit price for your service"
                    requires
                    onChange={(e) => setUnitPrice(e.target.value)}
                  ></input>
                  per contract/day/hour: state in description
                </label>
              </div>
              <br />
              <div>
                <label>
                  Give the number of days to display your service
                  <br />
                  <input
                    type="number"
                    id="delay"
                    placeholder="Number of days"
                    requires
                    onChange={(e) => setDelay(e.target.value)}
                  ></input>
                </label>
              </div>
              <br />
              <br />
              {/* Owner's Email: {userInfo.email} */}
              <div>
                <label>
                  Owner's Email
                  <br />
                  <input
                    type="text"
                    id="email"
                    placeholder="Number of days"
                    requires
                    onChange={(e) => setEmail(e.target.value)}
                  ></input>
                </label>
              </div>
              <br />
              <div>
                <br />
                Select image/photo for your service
                <br />
                <progress value={progress} max="100" />
                <br />
                <input type="file" onChange={handleChange} />
                <button
                  className="primary"
                  type="submit"
                  onClick={() => (state.button = 1)}
                >
                  Upload
                </button>
                <br />
                {url}
                <br />
                <img
                  className="small-medium"
                  src={url || 'http://via.placeholder.com/200X200'}
                  alt="firebase-imagex"
                />
                <br />
              </div>
              <br />
              <label />
              <button
                className="primary"
                type="submit"
                onClick={() => (state.button = 2)}
              >
                Add Service
              </button>
              <div>
                <label />
                <div>
                  Already have an account?{' '}
                  <Link to={`/signin?redirect=${redirect}`}>Sign-In</Link>
                </div>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  )
}