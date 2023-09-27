import React from "react";
import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";
import backGroundImage from "../../../assets/Images/frame.png";

const Template = ({title, desc1, desc2, formType, image}) => {
    return(
        <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
            <div className="mx-auto flex w-11/12 max-w-maxContent flex-col-reverse justify-between gap-y-12 py-12 md:flex-row md:gap-y-0 md:gap-x-12">
                {/* Form div */}
                <div className="mx-auto w-11/12 max-w-[450px] md:mx-0">
                    <h1 className="text-[1.875rem] font-semibold leading-[2.375rem] text-richblack-5">
                        {title}
                    </h1>
                    <p className="mt-4 text-[1.125rem] leading-[1.625rem]">
                        <span className="text-richblack-100">{desc1}</span>
                        <span className="font-edu-sa font-bold italic text-blue-100">{desc2}</span>
                    </p>
                    <div>
                        {
                            formType === "login" ? 
                            <LoginForm/> :
                            <SignupForm/>
                        }
                    </div>

                </div>

                {/* image div */}
                <div className="relative mx-auto w-11/12 max-w-[450px] md:mx-0">
                    <img src={backGroundImage} alt="backgroundImg" width={558} height={504} />
                    <img src={image} alt="loginImg" width={558} height={504} className="absolute -top-4 right-4 z-10"/>
                </div>
            </div>
        </div>
    );
}

export default Template;