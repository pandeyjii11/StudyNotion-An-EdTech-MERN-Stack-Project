import React, { useState } from "react";
import {AiFillEye, AiFillEyeInvisible} from "react-icons/ai";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../../../services/operations/authAPI";

const LoginForm = () => {

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });

    function formChangeHandler(event) {
        setFormData( (prev) => {
            return{
                ...prev,
                [event.target.name]: event.target.value
            }
        })
    }

    const {email, password} = formData;

    // complete the subhandler function
    function submitHandler(event) {
        event.preventDefault();
        dispatch(login(email, password, navigate));
    }

    return(
        <div>
            <form className="mt-6 flex w-full flex-col gap-y-4" onSubmit={submitHandler}>
                <label className="w-full">
                    <p className="mb-1 text-[0.875rem] leading-[1.375rem] text-richblack-5">
                        Email Address <sup className="text-pink-200">*</sup>
                    </p>
                    <input
                    type="email"
                    required
                    name = "email"
                    placeholder="Enter email address"
                    value={formData.email}
                    className="w-full rounded-[0.5rem] bg-richblack-800 p-[12px] text-richblack-5"
                    onChange={formChangeHandler}
                    style={{
                        boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
                    }}
                    
                    />
                </label>

                <label className="relative w-full">
                    <p className="mb-1 text-[0.875rem] leading-[1.375rem] text-richblack-5">
                        Password <sup className="text-pink-200">*</sup>
                    </p>
                    <input
                    type={showPassword? "text" : "password"}
                    required
                    name = "password"
                    placeholder="Enter Password"
                    value={formData.password}
                    className="w-full rounded-[0.5rem] bg-richblack-800 p-[12px] pr-12 text-richblack-5"
                    onChange={formChangeHandler}
                    style={{
                        boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
                    }}
                    />

                    <span className="absolute right-3 top-[38px] z-[10] cursor-pointer"
                    onClick={() => setShowPassword(!showPassword)}>
                        {
                            showPassword ? 
                            <AiFillEye fontSize={24} fill="#AFB2BF" /> : 
                            <AiFillEyeInvisible fontSize={24} fill="#AFB2BF" />
                        }
                    </span>

                    <Link to={"/forgot-Password"}>
                        <p className="mt-1 ml-auto max-w-max text-xs text-blue-100">
                            Forgot Password
                        </p>
                    </Link>
                </label>

                <button className="mt-6 rounded-[8px] bg-yellow-50 py-[8px] px-[12px] font-medium text-richblack-900"
                type="submit">
                    Sign In
                </button>
            </form>
        </div>
    );
}

export default LoginForm;