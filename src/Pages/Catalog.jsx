import React from "react";
import Footer from "../Components/Common/Footer";
import { useParams } from "react-router-dom";
import { useState } from "react";
import { useEffect } from "react";
import { apiConnector } from "../services/apiConnector";
import { categories } from "../services/apis";
import getCatalogPageData from "../services/operations/pageAndComponentData";
import CourseSlider from "../Components/Core/Catalog/CourseSlider";
import Course_Card from "../Components/Core/Catalog/Course_Card";
import { useSelector } from "react-redux";

const Catalog = () => {


    const {catalogName} = useParams();
    const [catalogPageData, setCatalogPageData] = useState(null);
    const [categoryId, setCategoryId] = useState("");
    const [active, setActive] = useState(1);
    const { loading } = useSelector((state) => state.profile);


    // fetch All categories
    useEffect( () => {
        const getCategories = async() => {
            const res = await apiConnector("GET", categories.CATEGORIES_API);
            const category_id = res?.data?.data?.filter( (category) => category.name.split(" ").join("-").toLowerCase() === catalogName)[0]._id;
            setCategoryId(category_id);
        }

        getCategories();
    }, [catalogName]);

    useEffect( () => {
        const getCategoryDetails = async() => {
            try {
                // console.log("Category Id before calling API: ", categoryId);
                const res = await getCatalogPageData(categoryId);

                console.log("Printing Res in the Catalog page: ", res);

                setCatalogPageData(res);
            }
            catch(error) {
                console.log(error);
            }
        }

        if(categoryId){
            getCategoryDetails();
        }
    }, [categoryId]);



    return(
        <div className=" box-content bg-richblack-800 px-4">
            <div className="mx-auto flex min-h-[260px] max-w-maxContentTab flex-col justify-center gap-4 lg:max-w-maxContent ">
                <p className="text-sm text-richblack-300">
                    {`Home / Catalog /`}
                    <span className="text-yellow-25">
                        {catalogPageData?.data?.selectedCategory?.name}
                    </span>
                </p>
                <p className="text-3xl text-richblack-5">{catalogPageData?.data?.selectedCategory?.name}</p>
                <p className="max-w-[870px] text-richblack-200">{catalogPageData?.data?.selectedCategory?.description}</p>
            </div>
            <div>
                {/* Section 1 */}
                <div className=" mx-auto box-content w-full max-w-maxContentTab px-4 py-12 lg:max-w-maxContent">
                    <div className="section_heading">Courses to get you started</div>
                    <div className="my-4 flex border-b border-b-richblack-600 text-sm">
                        <p
                        className={`px-4 py-2 ${
                            active === 1
                              ? "border-b border-b-yellow-25 text-yellow-25"
                              : "text-richblack-50"
                          } cursor-pointer`}
                          onClick={() => setActive(1)}
                        >
                            Most Popular
                        </p>
                        <p
                        className={`px-4 py-2 ${
                            active === 2
                              ? "border-b border-b-yellow-25 text-yellow-25"
                              : "text-richblack-50"
                          } cursor-pointer`}
                          onClick={() => setActive(2)}
                        >
                            New
                        </p>
                    </div>
                    <div>
                        <CourseSlider 
                        courses={catalogPageData?.data?.selectedCategory?.course}
                        />
                    </div>
                </div>
                {/* Section 2 */}
                <div className=" mx-auto box-content w-full max-w-maxContentTab px-4 py-12 lg:max-w-maxContent">
                    <div className="section_heading">Top Courses in {catalogPageData?.data?.selectedCategory?.name}</div>
                    <div className="py-8">
                        <CourseSlider 
                        courses={catalogPageData?.data?.differentCategory?.course}
                        />
                    </div>
                </div>

                {/* Section 3 */}
                <div className=" mx-auto box-content w-full max-w-maxContentTab px-4 py-12 lg:max-w-maxContent">
                    <div className="section_heading">Frequently Bought</div>
                    <div className="py-8">
                        <div className="grid grid-cols-1 lg:grid-cols-2">
                            {
                                catalogPageData?.data?.mostSellingCourses?.slice(0,4).map((course, index) => (
                                    <Course_Card course={course} key={index} Height={"h-[400px]"}/>
                                ))
                            }
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default Catalog;