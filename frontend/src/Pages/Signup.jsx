import React from "react";
import image from "../assets/Images/signup.webp";
import Template from "../Components/Core/Auth/Template";

const Signup = () => {
    return(
        <div>
            <Template 
            title={"Join the millions learning to code with StudyNotion for free"}
            desc1={"Build skills for today, tomorrow, and beyond."}
            desc2={"Education to future-proof your career."}
            image={image}
            formType={"signup"}
            />
        </div>
    );
}

export default Signup;