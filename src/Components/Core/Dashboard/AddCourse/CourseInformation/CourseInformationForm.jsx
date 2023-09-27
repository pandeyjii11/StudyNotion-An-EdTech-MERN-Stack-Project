import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { addCourseDetails, editCourseDetails, fetchCourseCategories } from "../../../../../services/operations/courseDetailsAPI";
import { HiOutlineCurrencyRupee } from "react-icons/hi";
import RequirementField from "./RequirementField";
import { setCourse, setStep } from "../../../../../slices/courseSlice";
import IconBtn from "../../../../Common/IconBtn";
import toast from "react-hot-toast";
import ChipInput from "./ChipInput";
import Upload from "../Upload";
import {MdNavigateNext} from "react-icons/md";
import { COURSE_STATUS } from "../../../../../utils/constants";

const CourseInfromationForm = () => {

    const {
        register, 
        handleSubmit,
        setValue,
        getValues,
        formState: {errors},
    } = useForm();

    const dispatch = useDispatch();
    const {token} = useSelector( (state) => state.auth);
    const{course, editCourse} = useSelector( (state) => state.course);
    const [loading, setLoading] = useState(false);
    const [courseCategories, setCourseCategories] = useState([]);



    useEffect( () => {
        const getCategories = async() => {
            setLoading(true);
            const categories = await fetchCourseCategories();
            if(categories.length > 0) {
                setCourseCategories(categories);
            }
            setLoading(false)
        }

        if(editCourse) {
            setValue("courseTitle", course.courseName);
            setValue("courseShortDesc", course.courseDescription);
            setValue("coursePrice", course.price);
            setValue("courseTags", course.tag);
            setValue("courseBenefits", course.whatYouWillLearn);
            setValue("courseCategory", course.category);
            setValue("courseReqiurements", course.instructions);
            setValue("courseImage", course.thumbnail);
        }

        getCategories();
    }, []);

    const isFormUpdated = () => {
        const currentValues = getValues();
        if(currentValues.courseTitle !== course.courseName ||
            currentValues.courseShortDesc !== course.courseDescription ||
            currentValues.coursePrice !== course.price ||
            currentValues.courseTags.toString() !== course.tag.toString() ||
            currentValues.courseBenefits !== course.whatYouWillLearn ||
            currentValues.courseCategory._id !== course.category._id ||
            currentValues.courseImage !== course.thumbnail ||
            currentValues.courseRequirements.toString() !== course.instructions.toString()) {
            return true;
        }
        else {
            return false;
        }
    }


    // Handles next button click
    const onSubmit = async(data) => {
        if(editCourse) {
            if(isFormUpdated()) {
                const currentValues = getValues();
                const formData = new FormData();
                formData.append("courseId", course._id);
                if(currentValues.courseTitle !== course.courseName) {
                    formData.append("courseName", data.courseTitle);
                }
                if(currentValues.courseShortDesc !== course.courseDescription) {
                    formData.append("courseDescription", data.courseShortDesc);
                }
                if(currentValues.coursePrice !== course.price) {
                    formData.append("price", data.coursePrice);
                }
                if(currentValues.courseBenefits !== course.whatYouWillLearn) {
                    formData.append("whatYouWillLearn", data.courseBenefits);
                }
                if(currentValues.courseCategory._id !== course.category._id) {
                    formData.append("category", data.courseCategory);
                }
                if(currentValues.courseRequirements.toString() !== course.instructions.toString()) {
                    formData.append("instructions", data.courseRequirements);
                }
                if(currentValues.courseTags.toString() !== course.tag.toString()) {
                    formData.append("tag", JSON.stringify(data.courseTags));
                }
                if(currentValues.courseImage !== course.thumbnail) {
                    formData.append("thumbnailImage", data.courseImage);
                }

                setLoading(true);
                const result = await editCourseDetails(formData, token);
                setLoading(false);
                if(result) {
                    dispatch(setStep(2));
                    dispatch(setCourse(result));
                }
            }
            else {
                toast.error("No changes made to the form");
            }
            return;
        }
        // Create a new Course
        const formData = new FormData();
        formData.append("courseName", data.courseTitle);
        formData.append("courseDescription", data.courseShortDesc);
        formData.append("price", data.coursePrice);
        formData.append("tag", JSON.stringify(data.courseTags));
        formData.append("whatYouWillLearn", data.courseTitle);
        formData.append("category", data.courseCategory);
        formData.append("instructions", JSON.stringify(data.courseRequirements));
        formData.append("thumbnailImage", data.courseImage);
        formData.append("status", COURSE_STATUS.DRAFT);

        setLoading(true);
        const result = await addCourseDetails(formData, token);
        if(result) {
            dispatch(setStep(2));
            dispatch(setCourse(result));
        }
        setLoading(false);
    }
    

    return(
        <form onSubmit={handleSubmit(onSubmit)}
        className="space-y-8 rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-6">
            {/* Course Title */}
            <div className="flex flex-col space-y-2">
                <label className="text-sm text-richblack-5" htmlFor="courseTitle">
                    Course Description <sup className="text-pink-200">*</sup> 
                </label>
                <input 
                id="courseTitle"
                placeholder="Enter Course title"
                {...register("courseTitle", {required: true})}
                className="form-style w-full"
                />
                {
                    errors.courseTitle && (
                        <span className="form-style w-full">Course Title is Required</span>
                    )
                }
            </div>

            {/* Course Short Description */}
            <div className="flex flex-col space-y-2">
                <label className="text-sm text-richblack-5" htmlFor="courseShortDesc">
                    Course Short Description <sup className="text-pink-200">*</sup>
                </label>
                <textarea 
                id="courseShortDesc" 
                placeholder="Enter Description"
                {...register("courseShortDesc", {required: true})}
                className="form-style resize-x-none min-h-[130px] w-full"
                />
                {
                    errors.courseShortDesc && (
                        <span className="form-style w-full">Course Description is required</span>
                    )
                }
            </div>

            {/* Course Price */}
            <div className="flex flex-col space-y-2">
                <label className="text-sm text-richblack-5" htmlFor="price">
                    Course Price <sup className="text-pink-200">*</sup> 
                </label>
                <div className="relative">
                    <input 
                    id="price"
                    placeholder="Enter Price"
                    {...register("coursePrice", 
                        {
                            required: true,
                            valueAsNumber: true
                        })}
                    className="form-style w-full !pl-12"
                    />
                    <HiOutlineCurrencyRupee className="absolute left-3 top-1/2 inline-block -translate-y-1/2 text-2xl text-richblack-400" />
                </div>
                
                {
                    errors.coursePrice && (
                        <span className="form-style w-full">Course Price is Required</span>
                    )
                }
            </div>

            {/* Course category */}
            <div className="flex flex-col space-y-2">
                <label className="text-sm text-richblack-5" htmlFor="courseCategory">Course Category <sup>*</sup></label>
                <select 
                id="courseCategory"
                defaultValue=""
                {...register("courseCategory", {required: true})} 
                className="form-style w-full"
                >
                    <option value="" disabled>Choose a Category</option>
                    {
                        !loading && courseCategories.map( (category, index) => (
                            <option key={index} value={category?._id}>
                                {category?.name}
                            </option>
                        ))
                    }
                </select>
                {
                    errors.courseCategory && (
                        <span className="form-style w-full">Course category is Required</span>
                    )
                }
            </div>

            {/* Create a custom component for handling tags input */}
            <ChipInput 
            label="Tags"
            name="courseTags"
            placeholder="Enter Tags"
            register={register}
            errors = {errors}
            setValue={setValue}
            getValues={getValues}/>

            {/* Create a component Upload for uploading and showing preview of media */}
            <Upload 
            name="courseImage"
            label="Course Thumbnail"
            register={register}
            setValue={setValue}
            errors={errors}
            editData={editCourse ? course?.thumbnail : null}
            /> 

            {/* Benefits of the course */}
            <div className="flex flex-col space-y-2">
                <label className="text-sm text-richblack-5" htmlFor="courseBenefits">Benefits of the Course</label>
                <textarea 
                id="courseBenefits" 
                placeholder="Enter Course Benefits"
                {...register("courseBenefits", {required: true})}
                className="form-style resize-x-none min-h-[130px] w-full"
                />
                {
                    errors.courseBenefits && (
                        <span className="form-style w-full">
                            Benefits of the Course is Required
                        </span>
                    )
                }
            </div>

            <RequirementField
            name="courseRequirements"
            label="Requirements/Instructions"
            register={register}
            errors={errors}
            setValue={setValue}
            getValues={getValues} 
            />

            {/* Buttons */}
            <div className="flex justify-end gap-x-2">
                {
                    editCourse && (
                        <button
                        onClick={() => dispatch(setStep(2))}
                        disabled={loading}
                        className={`flex cursor-pointer items-center gap-x-2 rounded-md bg-richblack-300 
                        py-[8px] px-[20px] font-semibold text-richblack-900`}
                        >
                            Continue Without Saving
                        </button>
                    )
                }

                <IconBtn 
                disabled={loading}
                text={!editCourse ? "Next" : "Save Changes"}
                >
                    <MdNavigateNext />
                </IconBtn>
            </div>
        </form>
    );
}

export default CourseInfromationForm;