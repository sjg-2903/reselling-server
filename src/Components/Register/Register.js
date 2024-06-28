import React, { useState } from "react";
import { Link } from "react-router-dom";
import './Register.css';
import logo from '../../LoginAssets/logo.png';
import { FaUserShield } from "react-icons/fa";
import { BsFillShieldLockFill } from "react-icons/bs";
import { AiOutlineSwapRight } from "react-icons/ai";
import { MdMarkEmailRead } from "react-icons/md";
import Axios from 'axios';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: ''
    });

    const [registered, setRegistered] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        Axios.post('http://localhost:3005/adminsignup', formData)
            .then(response => {
                console.log(JSON.stringify(response.data));
                alert('Registration successful!');
                setRegistered(true); // Set registered state to true
            })
            .catch(error => {
                console.error('Registration failed:', error);
                // Handle registration error, e.g., display error message to user
            });
    };

    return (
        <div className='loginPage flex'>
            <div className='container1 flex'>
                <div className="videoDiv">
                    <div className="textDiv">
                        <h2 className='title'>Create and Sell Extraordinary Products</h2>
                        <p>Download the Reselling.De App</p>
                    </div>
                    <div className="footerDiv flex">
                        <span className="text">Already have an account?</span>
                        <Link to='/'> <button className='btn'> Sign In </button> </Link>
                    </div>
                </div>
                <div className="formDiv flex">
                    <div className="headerDiv">
                        <img src={logo} alt="Logo Image"/>
                        <h3>Let Us Know You!</h3>
                    </div>
                    {registered ? (
                        <div className="successMessage">
                            <p>Registration successful!</p>
                            <Link to='/'>Go to Login</Link>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className='form grid'>
                            <div className="inputDiv">
                                <label htmlFor="username">Username</label>
                                <div className="input flex">
                                    <FaUserShield className='icon'/>
                                    <input
                                        type="text"
                                        id='username'
                                        name='name'
                                        placeholder='Enter Username'
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="inputDiv">
                                <label htmlFor="email">Email</label>
                                <div className="input flex">
                                    <MdMarkEmailRead className='icon'/>
                                    <input
                                        type="email"
                                        id='email'
                                        name='email'
                                        placeholder='Enter Email'
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="inputDiv">
                                <label htmlFor="password">Password</label>
                                <div className="input flex">
                                    <BsFillShieldLockFill className='icon'/>
                                    <input
                                        type="password"
                                        id='password'
                                        name='password'
                                        placeholder='Enter Password'
                                        value={formData.password}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>
                            <button type='submit' className='btn flex'>
                                <span>Register</span>
                                <AiOutlineSwapRight className='icon'/>
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Register;
