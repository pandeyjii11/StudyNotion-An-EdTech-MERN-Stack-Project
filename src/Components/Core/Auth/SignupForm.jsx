import React, { useState } from "react";
import {AiFillEye, AiFillEyeInvisible} from "react-icons/ai";
import Tab from "./Tab";
import { ACCOUNT_TYPE } from "../../../utils/constants";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
import { sendOtp } from "../../../services/operations/authAPI";
import { setSignupData } from "../../../slices/authSlice";

const SignupForm = () => {

    const navigation = useNavigate();
    const dispatch = useDispatch();

    const [accountType, setAccountType] = useState(ACCOUNT_TYPE.STUDENT);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    // tab Data for the Account Type
    const tabData = [
        {
            id: 1,
            tabName: "Student",
            type: ACCOUNT_TYPE.STUDENT
        },
        {
            id: 2,
            tabName: "Instructor",
            type: ACCOUNT_TYPE.INSTRUCTOR
        }
    ]

    function formChangeHandler(event) {
        setFormData( (prev) => {
            return{
                ...prev,
                [event.target.name]: event.target.value
            }
        });
    }

    const {firtName, lastName, email, password, confirmPassword} = formData;

    // Complete the on form Submit Handler
    function submitHandler(event) {
        event.preventDefault();

        if(password !== confirmPassword) {
            toast.error("Passwords do not Match");
            return;
        }

        const signUpData = {
            ...formData,
            accountType,
        }

        // Setting signup data to state 
        // To be used after otp verification

        // console.log("signUpdata in sigmup form: ", signUpData);
        dispatch(setSignupData(signUpData));

        // end otp to user for verifiation
        dispatch(sendOtp(formData.email, navigation));

        // reset form data
        setFormData({
            firstName: "" ,
            lastName: "",
            email: "" , 
            password: "" ,
            confirmPassword: ""
        });

        setAccountType(ACCOUNT_TYPE.STUDENT);
    }

    return(
        <div>
            {/* Student and Instructor tab */}
            <Tab tabData={tabData} accountType={accountType} setAccountType={setAccountType}/>
            {/* Form */}
            <form onSubmit={submitHandler} className="flex w-full flex-col gap-y-4">
                <div className="flex gap-x-4">
                    {/* First Name */}
                    <label>
                        <p className="mb-1 text-[0.875rem] leading-[1.375rem] text-richblack-5">
                            First Name <sup>*</sup>
                        </p>
                        <input
                        type="text"
                        required
                        placeholder="First Name"
                        value={formData.firstName}
                        name="firstName"
                        onChange={formChangeHandler}
                        className="w-full rounded-[0.5rem] bg-richblack-800 p-[12px] text-richblack-5"
                        style={{
                            boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
                        }}
                        />
                    </label>
                    {/* Last Name */}
                    <label>
                        <p className="mb-1 text-[0.875rem] leading-[1.375rem] text-richblack-5">
                            Last Name <sup>*</sup>
                        </p>
                        <input
                        type="text"
                        required
                        placeholder="Last Name"
                        value={formData.lastName}
                        name="lastName"
                        onChange={formChangeHandler}
                        className="w-full rounded-[0.5rem] bg-richblack-800 p-[12px] text-richblack-5"
                        style={{
                            boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
                        }}
                        />
                    </label>
                </div>

                <label className="w-full">
                    <p className="mb-1 text-[0.875rem] leading-[1.375rem] text-richblack-5">
                        Email Address <sup>*</sup>
                    </p>
                    <input
                    type="email"
                    required
                    placeholder="Enter Email Address"
                    value={formData.email}
                    name="email"
                    onChange={formChangeHandler}
                    className="w-full rounded-[0.5rem] bg-richblack-800 p-[12px] text-richblack-5"
                    style={{
                        boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
                    }}
                    />
                </label>

                <div className="flex gap-x-4">
                    {/* Create Password */}
                    <label className="relative">
                        <p className="mb-1 text-[0.875rem] leading-[1.375rem] text-richblack-5">
                            Create Password <sup>*</sup>
                        </p>
                        <input
                        type={showPassword ? "text" : "password"}
                        required
                        placeholder="Enter Password"
                        value={formData.password}
                        name="password"
                        onChange={formChangeHandler}
                        className="w-full rounded-[0.5rem] bg-richblack-800 p-[12px] text-richblack-5"
                        style={{
                            boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
                        }}
                        />
                        <span onClick={() => setShowPassword( (prev) => !prev)}
                        className="absolute right-3 top-[38px] z-[10] cursor-pointer">
                            {
                                showPassword ?
                                 <AiFillEye fontSize={24} fill="#AFB2BF" /> : 
                                 <AiFillEyeInvisible fontSize={24} fill="#AFB2BF" />
                            }
                        </span>
                    </label>
                    {/* Confirm Password */}
                    <label className="relative">
                        <p className="mb-1 text-[0.875rem] leading-[1.375rem] text-richblack-5">
                            Confirm Password <sup>*</sup>
                        </p>
                        <input
                        type={showConfirmPassword ? "text" : "password"}
                        required
                        placeholder="Confirm Password"
                        value={formData.confirmPassword}
                        name="confirmPassword"
                        onChange={formChangeHandler}
                        className="w-full rounded-[0.5rem] bg-richblack-800 p-[12px] text-richblack-5"
                        style={{
                            boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
                        }}
                        />
                        <span onClick={() => setShowConfirmPassword( (prev) => !prev)}
                        className="absolute right-3 top-[38px] z-[10] cursor-pointer">
                            {
                                showConfirmPassword ? 
                                <AiFillEye fontSize={24} fill="#AFB2BF" /> :
                                <AiFillEyeInvisible fontSize={24} fill="#AFB2BF" />
                            }
                        </span>
                    </label>
                </div>

                <button className="mt-6 rounded-[8px] bg-yellow-50 py-[8px] px-[12px] font-medium text-richblack-900"
                type="submit">
                    Create Account
                </button>
            </form>
        </div>
    );
}

export default SignupForm;