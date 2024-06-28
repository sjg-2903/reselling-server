import React, { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import './Login.css';
import logo from '../../LoginAssets/logo.png';
import { FaUserShield } from "react-icons/fa";
import { BsFillShieldLockFill } from "react-icons/bs";
import { AiOutlineSwapRight } from "react-icons/ai";
import Axios from 'axios';

const Login = () => {
    const [formData, setFormData] = useState({
        adminname: '',
        adminpassword: ''
    });
    const [loggedIn, setLoggedIn] = useState(false); // Track login state

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [id]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        Axios.post('http://localhost:3005/adminsignin', formData)
            .then(response => {
                console.log(response.data);
                alert('Login successful!');
                setLoggedIn(true); // Set logged in state to true upon successful login
            })
            .catch(error => {
                console.error('Login failed:', error);
                alert('Login failed. Please try again.');
            });
    };

    return (
        <div className='loginPage flex'>
            <div className='container1 flex'>
                <div className="videoDiv">
                    <div className="textDiv">
                        <h2 className='title'>Create and Sell Extraordinary Products</h2>
                        <p className="line1">Download the Reselling.De App</p>
                    </div>
                    {/* <div className="footerDiv flex">
                        <span className="text"> Don't have an account?</span>
                        <Link to='/register'> <button className='btn'> Sign Up </button> </Link>
                    </div> */}
                </div>
                <div className="formDiv flex">
                    <div className="headerDiv">
                        <img src={logo} alt="Logo Image"/>
                        <h3>Welcome Back!</h3>
                    </div>
                    <form onSubmit={handleSubmit} className='form grid'>
                        <div className="inputDiv">
                            <label htmlFor="adminname">Admin Name</label>
                            <div className="input flex">
                                <FaUserShield className='icon'/>
                                <input
                                    type="text"
                                    id='adminname'
                                    placeholder='Enter Name'
                                    value={formData.adminname}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>
                        <div className="inputDiv">
                            <label htmlFor="adminpassword"> Admin Password</label>
                            <div className="input flex">
                                <BsFillShieldLockFill className='icon'/>
                                <input
                                    type="password"
                                    id='adminpassword'
                                    placeholder='Enter Password'
                                    value={formData.adminpassword}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>
                        <button type='submit' className='btn flex'>
                            <span>Login</span>
                            <AiOutlineSwapRight className='icon'/>
                        </button>
                        <span className='forgotPassword'>
                            Forgot Your Password? <Link to="/dashboard">Click Here</Link>
                        </span>
                    </form>
                </div>
            </div>
            {/* Conditionally render Navigate component upon successful login */}
            {loggedIn && <Navigate to="/dashboard" />}
        </div>
    );
};

export default Login;
