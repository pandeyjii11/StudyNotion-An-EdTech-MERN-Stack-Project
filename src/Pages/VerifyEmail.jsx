import React, { useEffect, useState } from "react";
import OTPInput from "react-otp-input";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { signUp } from "../services/operations/authAPI";
import { sendOtp } from "../services/operations/authAPI";
import {BiArrowBack} from "react-icons/bi";
import {RxCountdownTimer} from "react-icons/rx";

const VerifyEmail = () => {

    const [otp, setotp] = useState("");

    const {loading, signUpData} = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();


    useEffect( () => {
        if(!signUpData)
        {
            navigate("/signup");
        }
    }, []);

    console.log("SignUp data in verify email: ", signUpData);


    function handleOnSubmit(e) {
        e.preventDefault();
        const {firstName, lastName, accountType, email, password, confirmPassword} = signUpData;

        // console.log(firstName);
        // console.log(lastName);
        // console.log(accountType);
        // console.log(email);
        // console.log(password);
        // console.log(confirmPassword);
        
        dispatch(signUp(accountType, firstName, lastName, email, password, confirmPassword, otp, navigate));
    }

    return(
        <div className="min-h-[calc(100vh-3.5rem)] grid place-items-center">
            {
                loading ? 
                (<div>
                    loading...
                </div>) :
                (
                    <div className="max-w-[500px] p-4 lg:p-8">
                        <div>
                            <h1 className="text-richblack-5 font-semibold text-[1.875rem] leading-[2.375rem]">
                                verify Email
                            </h1>
                        </div>
                        <p className="text-[1.125rem] leading-[1.625rem] my-4 text-richblack-100">
                            A verification code has been sent to you. Enter the code below
                        </p>
                        <form onSubmit={handleOnSubmit}>
                            <OTPInput 
                            value={otp}
                            onChange={setotp}
                            numInputs={6}
                            renderInput={(props) => (
                                <input
                                  {...props}
                                  placeholder="-"
                                  style={{
                                    boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
                                  }}
                                  className="w-[48px] lg:w-[60px] border-0 bg-richblack-800 rounded-[0.5rem] text-richblack-5 aspect-square text-center focus:border-0 focus:outline-2 focus:outline-yellow-50"
                                />
                              )}
                              containerStyle={{
                                justifyContent: "space-between",
                                gap: "0 6px",
                              }}
                            />
        
                            <button type="submit"
                            className="w-full bg-yellow-50 py-[12px] px-[12px] rounded-[8px] mt-6 font-medium text-richblack-900">
                                Verify Email
                            </button>
        
                            <div className="mt-6 flex items-center justify-between">
                                <div>
                                    <Link to={"/login"}>
                                        <p className="text-richblack-5 flex items-center gap-x-2">
                                            <BiArrowBack /> Back to Login
                                        </p>
                                    </Link>
                                </div>
        
                                <button onClick={ () => dispatch(sendOtp(signUpData.email, navigate))}
                                className="flex items-center text-blue-100 gap-x-2">
                                    <RxCountdownTimer /> Resend OTP
                                </button>
                            </div>
                        </form>
                    </div>
                )
            }
        </div>
    );
}

export default VerifyEmail;