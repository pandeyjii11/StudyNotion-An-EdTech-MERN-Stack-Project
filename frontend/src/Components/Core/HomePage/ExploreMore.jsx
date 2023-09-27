import React, { useState } from "react";
import {HomePageExplore} from "../../../data/homepage-explore";
import HighlightText from "./HighlightText";
import CourseCard from "./CourseCard";

// console.log(HomePageExplore);

const tabs = [
    "Free",
    "New to coding",
    "Most popular",
    "Skills paths",
    "Career paths"
]


const ExploreMore = () => {

    const [currentTab, setCurrentTab] = useState(tabs[0]);
    const [course, setCourses] = useState(HomePageExplore[0].courses);
    const [currentCard, setCurrentCard] = useState(HomePageExplore[0].courses[0].heading);

    // console.log(course);

    const setMyCards = (value) => {
        setCurrentTab(value);
        const res = HomePageExplore.filter( (course) => course.tag === value );
        setCourses(res[0].courses);
        setCurrentCard(res[0].courses[0].heading);
    }

    return(
        <div>
            <div className="text-4xl font-semibold text-center mt-10">
                Unlock the 
                <HighlightText text={"power of code"}/>
            </div>
            
            <p className="text-center text-richblack-300 text-lg font-semibold mt-1">
                Learn to build anything You Can Imagine
            </p>

            <div className="hidden lg:flex gap-5 mt-5 mx-auto w-max bg-richblack-800 
            text-richblack-200 p-1 rounded-full font-medium drop-shadow-[0_1.5px_rgba(255,255,255,0.25)]">
                {
                    tabs.map( (element, index) => {
                        return(
                            <div key={index}
                            className={`text-[16px] flex  flex-row items-center gap-2
                            ${element === currentTab? "bg-richblack-900 text-richblack-5 font-medium"
                            : "text-richblack-200"} rounded-full transition-all duration-200 cursor-pointer
                            hover:bg-richblack-900 hover:text-richblack-5 px-7 py-[7px]`}
                            onClick={() => setMyCards(element)}>
                                {element}
                            </div>
                        )
                    })
                }
            </div>

            <div className="hidden lg:block lg:h-[200px]"></div>

            {/* Cards */}
            <div className="lg:absolute gap-10 justify-center lg:gap-0 flex lg:justify-between 
            flex-wrap w-full lg:bottom-[0] lg:left-[50%] lg:translate-x-[-50%] lg:translate-y-[50%] 
            text-black lg:mb-0 mb-7 lg:px-0 px-3">
                {
                    course.map( (element, index) => {
                        return(
                            <CourseCard key={index}
                            cardData={element}
                            currentCard={currentCard}
                            setCurrentCard={setCurrentCard}/>
                        )
                    })
                }
            </div>
        </div>
    );
}

export default ExploreMore;