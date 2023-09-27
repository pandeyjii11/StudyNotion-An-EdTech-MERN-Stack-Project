import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { apiConnector } from "../../../services/apiConnector";
import { contactUsEndpoint } from "../../../services/apis";
import CountryCode from "../../../data/countrycode.json";

const ContactUsForm = () => {

    const [loading, setloading] = useState(false);
    const {
        register, 
        handleSubmit,
        reset,
        formState: {errors, isSubmitSuccessful}
    } = useForm();

    useEffect( () => {
        if(isSubmitSuccessful)
        {
            reset(
                {
                    firstname: "",
                    lastname: "",
                    email: "",
                    phoneNo: "",
                    message: ""
                }
            );
        }
    }, [isSubmitSuccessful, reset]);

    const submitContactForm =async(data) => {
        console.log("logging data: ", data);
        try {
            setloading(true);
            const response = await apiConnector("POST", contactUsEndpoint.CONTACT_US_API, data);
            console.log("Logging response: ", response);
            setloading(false);
        }
        catch(error) {
            console.log("Error in Contact Us Form: ", error.message);
            setloading(false);
        }
    }

    return(
        <form onSubmit={handleSubmit(submitContactForm)}
        className="flex flex-col gap-7">
            <div>
                <div className="flex flex-col gap-5 lg:flex-row">
                    {/* firtname */}
                    <div className="flex flex-col gap-2 lg:w-[48%]">
                        <label htmlFor="firstname" className="lable-style">
                            First Name
                        </label>
                        <input 
                        type="text"
                        name="firstname"
                        id="firstname"
                        placeholder="Enter first name"
                        className="form-style"
                        {...register("firstname", {required: true})}
                        />
                        {
                            errors.firstname && (
                                <span className="-mt-1 text-[12px] text-yellow-100">
                                    Please enter your name
                                </span>
                            )
                        }
                    </div>
                    {/* lastname */}
                    <div className="flex flex-col gap-2 lg:w-[48%]">
                        <label htmlFor="lastname" className="lable-style">
                            Last Name
                        </label>
                        <input 
                        type="text"
                        name="lastname"
                        id="lastname"
                        placeholder="Enter first name"
                        className="form-style"
                        {...register("lastname")}
                        />
                    </div>
                </div>
                {/* email */}
                <div className="flex flex-col gap-2">
                    <label htmlFor="email" className="lable-style">
                        Email Address
                    </label>
                    <input 
                    type="email"
                    name="email"
                    id="email"
                    placeholder="Enter Email Address"
                    className="form-style"
                    {...register("email", {required: true})}
                    />
                    {
                        errors.email && (
                            <span className="-mt-1 text-[12px] text-yellow-100">
                                Please enter email address
                            </span>
                        )
                    }
                </div>
                {/* Phone Number */}
                <div className="flex flex-col gap-2">
                    <label htmlFor="phonenumber" className="lable-style">
                        Phone Number
                    </label>
                    <div className="flex gap-5">
                        {/* Dropdown */}
                        <div className="flex w-[81px] flex-col gap-2">
                            <select
                            name="dropdown"
                            id="dropdown"
                            className="form-style"
                            {...register("countycode", {required: true})}
                            >
                                {
                                    CountryCode.map( (element, index) => {
                                        return(
                                            <option key={index} value={element.code}>
                                                {element.code} - {element.country}
                                            </option>
                                        )
                                    })
                                }
                            </select>
                        </div>
                        <div className="flex w-[calc(100%-90px)] flex-col gap-2">
                            <input 
                            type="number"
                            name="phonenumber"
                            id="phonenumber"
                            placeholder="12345 67890"
                            className="form-style"
                            {...register("phoneNo", 
                            {
                                required: {value: true, messgae: "Please Enter Phine Number"},
                                maxLength: {value: 10, messgae: "Invalid Phone Number"},
                                minLength: {value: 8, message: "Invalid Pone Number"}
                            })}
                            />
                        </div>
                    </div>
                    {
                        errors.phoneNo && (
                            <span className="-mt-1 text-[12px] text-yellow-100">
                                {errors.phoneNo.message}
                            </span>
                        )
                    }
                </div>
                {/* message */}
                <div className="flex flex-col gap-2">
                    <label htmlFor="message" className="lable-style">
                        Message
                    </label>
                    <textarea 
                    name="message"
                    id="message"
                    cols={30}
                    rows={7}
                    placeholder="Enter Your Message"
                    className="form-style"
                    {...register("message", {required: true})}
                    />
                    {
                        errors.message && (
                            <span className="-mt-1 text-[12px] text-yellow-100">
                                Please Enter your Message
                            </span>
                        )
                    }
                </div>

                <button type="submit"
                disabled={loading}
                className={`rounded-md bg-yellow-50 px-6 py-3 text-center text-[13px] font-bold text-black w-full mt-6
                shadow-[2px_2px_0px_0px_rgba(255,255,255,0.18)] 
                    ${
                    !loading &&
                    "transition-all duration-200 hover:scale-95 hover:shadow-none"
                    }  disabled:bg-richblack-500 sm:text-[16px] `}
                >
                    Send Message
                </button>
            </div>
        </form>
    );
}

export default ContactUsForm;