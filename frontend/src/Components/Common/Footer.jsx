import React from "react";
import {FooterLink2} from "../../data/footer-links";
import Logo from "../../../src/assets/Logo/Logo-Full-Light.png";
import { Link } from "react-router-dom";
import {FaFacebook, FaGoogle, FaTwitter, FaYoutube} from "react-icons/fa";

const company = [
    "About",
    "Careers",
    "Affiliates"
];

const resourses = [
    "Artiles", 
    "Blog",
    "Chart Sheet",
    "Code challenges",
    "Docs",
    "Projects",
    "Videos",
    "Workspaces"
];

const support = [
    "Help Center"
];

const plans = [
    "Paid memberships",
    "For students",
    "Business solutions"
];

const community = [
    "Forums",
    "Chapters",
    "Events"
];

const footerLinks = [
    "Privacy Policy",
    "Cookie Policy",
    "Terms"
];


const Footer = () => {
    return(
        <div className="bg-richblack-800">
            {/* outer Div */}
            <div className="flex flex-col gap-8 items-center justify-between w-11/12 
            max-w-maxContent text-richblack-400 leading-6 mx-auto relative py-14">
                {/* Upper Div */}
                <div className="border-b w-[100%] flex flex-col lg:flex-row pb-5 border-richblack-700">
                    {/* Left Div */}
                    <div className="lg:w-[50%] flex flex-wrap flex-row justify-between lg:border-r lg:border-richblack-700 pl-3 lg:pr-5 gap-3">
                        {/* First div in left  */}
                        <div className="w-[30%] flex flex-col gap-3 lg:w-[30%] mb-7 lg:pl-0">
                            <img src={Logo} alt="Company Logo"
                             className="object-contain" />
                            <h1 className="text-richblack-50 font-semibold text-[16px]">
                                Company
                            </h1>
                            <div className="flex flex-col gap-2">
                                {
                                    company.map( (element, index) => {
                                        return (
                                            <div key={index}
                                            className="text-[14px] cursor-pointer hover:text-richblack-50 transition-all duration-200">
                                                <Link to={element.toLowerCase()}>{element}</Link>
                                            </div>
                                        )
                                    })
                                }
                            </div>
                            {/* Social logos */}
                            <div className="flex gap-3 text-lg">
                                <FaFacebook/>
                                <FaGoogle/>
                                <FaTwitter/>
                                <FaYoutube/>
                            </div>
                        </div>

                        {/* Second Div in left side */}
                        <div className="w-[48%] lg:w-[30%] mb-7 lg:pl-0">
                            {/* Resources */}
                            <div>
                                <h1 className="text-richblack-50 font-semibold text-[16px]">
                                    Resources
                                </h1>
                                <div className="flex flex-col gap-2 mt-2">
                                    {
                                        resourses.map( (element, index) => {
                                            return(
                                                <div key={index}
                                                className="text-[14px] cursor-pointer hover:text-richblack-50 transition-all duration-200">
                                                    <Link to={element.split(" ").join("-").toLowerCase}>
                                                        {element}
                                                    </Link>
                                                </div>
                                            )
                                        })
                                    }
                                </div>
                            </div>

                            {/* Support */}
                            <div>
                                <h1 className="text-richblack-50 font-semibold text-[16px] mt-7">
                                    Support
                                </h1>
                                <div className="text-[14px] cursor-pointer hover:text-richblack-50 transition-all duration-200 mt-2">
                                    <Link to={"/help-center"}>Help Center</Link>
                                </div>
                            </div>
                        </div>

                        {/*Third Div on left Side  */}
                        <div className="w-[48%] lg:w-[30%] mb-7 lg:pl-0">
                            {/* plans */}
                            <div>
                                <h1 className="text-richblack-50 font-semibold text-[16px]">
                                    Plans
                                </h1>
                                <div className="flex flex-col gap-2 mt-2">
                                    {
                                        plans.map( (element, index) => {
                                            return(
                                                <div key={index}
                                                className="text-[14px] cursor-pointer hover:text-richblack-50 transition-all duration-200">
                                                    <Link to={element.split(" ").join("-").toLowerCase()}>
                                                        {element}
                                                    </Link>
                                                </div>
                                            )
                                        })
                                    }
                                </div>
                            </div>
                            {/* Community */}
                            <div>
                                <h1 className="text-richblack-50 font-semibold text-[16px] mt-7">
                                    Community
                                </h1>
                                <div className="flex flex-col gap-2 mt-2">
                                    {
                                        community.map( (element, index) => {
                                            return(
                                                <div key={index}
                                                className="text-[14px] cursor-pointer hover:text-richblack-50 transition-all duration-200">
                                                    <Link to={element.split(" ").join("-").toLowerCase()}>
                                                        {element}
                                                    </Link>
                                                </div>
                                            )
                                        })
                                    }
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Div */}
                    <div className="lg:w-[50%] flex flex-wrap flex-row justify-between pl-3 lg:pl-5 gap-3">
                        {/* Map the footerLinks 2 and then further map the links */}
                        {
                            FooterLink2.map( (element, index) => {
                                return(
                                    <div key={index}
                                    className="w-[48%] lg:w-[30%] mb-7 lg:pl-0">
                                        <h1 className="text-richblack-50 font-semibold text-[16px]">
                                            {element.title}
                                        </h1>
                                        <div className="flex flex-col gap-2 mt-2">
                                            {
                                                element.links.map( (ele, index) => {
                                                    return(
                                                        <div key={index}
                                                        className="text-[14px] cursor-pointer hover:text-richblack-50 transition-all duration-200">
                                                            <Link to={ele.link}>
                                                                {ele.title}
                                                            </Link>
                                                        </div>
                                                    )
                                                })
                                            }
                                        </div>
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>

                {/* Lower div */}
                <div className="flex lg:flex-row flex-col lg:justify-between items-center gap-3 lg:gap-96 w-11/12
                text-richblack-400 mx-auto pb-14 text-sm">
                    {/* Left Div */}
                    <div className="flex flex-row">
                        {
                            footerLinks.map( (element, index) => {
                                return(
                                    <div key={index}
                                    className={`
                                    ${footerLinks.length - 1 === index ?
                                     "" :
                                     "border-r border-richblack-700 cursor-pointer hover:text-richblack-50 transition-all duration-200"} 
                                     px-3 `}>
                                        <Link to={element.split(" ").join("-").toLowerCase}>
                                            {element}
                                        </Link>
                                    </div>
                                )
                            })
                        }
                    </div>
                    {/* Right Div */}
                    <div className="text-center items-end">
                        Made with ❤️ Nitish Pandey © 2023 StudyNotion
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Footer;