import React from "react";
import image from "../assets/Images/login.webp";
import Template from "../Components/Core/Auth/Template";

const Login = () => {
    return(
        <div>
            <Template
            title={"Welcome Back"}
            desc1={"Build skills for today, tomorrow, and beyond."}
            desc2={"Education to future-proof your career."}
            image={image}
            formType={"login"}
            />
        </div>
    );
}

export default Login;