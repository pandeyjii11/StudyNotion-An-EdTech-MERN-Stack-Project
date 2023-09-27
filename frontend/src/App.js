
import { Route, Routes } from 'react-router-dom';
import './App.css';
import Home from './Pages/Home';
import Login from './Pages/Login';
import Signup from './Pages/Signup';
import Navbar from './Components/Common/Navbar';
import ForgotPassword from './Pages/ForgotPassword';
import UpdatePassword from './Pages/UpdatePassword';
import VerifyEmail from './Pages/VerifyEmail';
import About from './Pages/About';
import MyProfile from './Components/Core/Dashboard/MyProfile';
import PrivateRoute from './Components/Core/Auth/PrivateRoute';
import Dashboard from './Pages/Dashboard';
import Error from "./Pages/Error";
import EnrolledCourses from './Components/Core/Dashboard/EnrolledCourses';
import Cart from './Components/Core/Dashboard/Cart';
import { useSelector } from 'react-redux';
import { ACCOUNT_TYPE } from './utils/constants';
import AddCourse from './Components/Core/Dashboard/AddCourse';
import { compose } from '@reduxjs/toolkit';
import MyCourses from './Components/Core/Dashboard/MyCourses';
import EditCourse from './Components/Core/Dashboard/EditCourse';
import Catalog from './Pages/Catalog';
import CourseDetails from './Pages/CourseDetails';
import Contact from './Pages/Contact';
import Settings from './Components/Core/Dashboard/Settings';
import InstructorDashboard from './Components/Core/Dashboard/InstructorDashboard/Instructor';

function App() {

  const {user} = useSelector((state) => state.profile);

  return (
    <div className="w-screen min-h-screen bg-richblack-900 flex flex-col font-inter">
      
      <Navbar />
      
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/login' element={<Login/>} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/forgot-Password' element={<ForgotPassword />} />
        <Route path='/update-password/:id' element={<UpdatePassword />}/>
        <Route path='/verify-email' element={<VerifyEmail />}/>
        <Route path='/about' element={<About />}/>
        <Route path='/catalog/:catalogName' element={<Catalog />}/>
        <Route path='/courses/:courseId' element={<CourseDetails />}/>
        <Route path='/contact' element={<Contact />}/>

        <Route element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        }>
          <Route path='/dashboard/my-profile' element={<MyProfile />}/>
          <Route path="dashboard/settings" element={<Settings />}/>

          
          {
            user?.accountType === ACCOUNT_TYPE.STUDENT && (
              <>
                <Route path='/dashboard/enrolled-courses' element={<EnrolledCourses />}/> 
                <Route path='/dashboard/cart' element={<Cart />}/> 
              </>
            )
          }

          {
            user?.accountType === ACCOUNT_TYPE.INSTRUCTOR && (
              <>
                <Route path='/dashboard/add-course' element={<AddCourse />}/>
                <Route path='/dashboard/my-courses' element={<MyCourses />}/>
                <Route path='/dashboard/edit-course/:courseId' element={<EditCourse />}/>
                <Route path='/dashboard/instructor' element={<InstructorDashboard />}/>
              </>
            )
          }
        </Route>
        

        <Route path='*' element={<Error />}/>
      </Routes>
    </div>
  );
}

export default App;
