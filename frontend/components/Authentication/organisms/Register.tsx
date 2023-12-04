'use client'
// import { useLocale, useTranslations } from "next-intl";
import Checkbox from "@/components/Shared/atoms/Checkbox";
import Card from "@/components/Shared/atoms/Card";
import Input from "@/components/Shared/atoms/Input";
import Button from "@/components/Shared/atoms/Button";
import Typography from "@/components/Shared/atoms/Typography";
import {  signIn } from "next-auth/react"
import axios from "axios";
import { FaGoogle, FaGithub} from "react-icons/fa";
import Link from "next/link";
import { SocialEventsUser } from "@/types/SocialEventsUser";
import { Formik } from 'formik';
import React from "react";
import Feedback from "../atoms/Feedback";
import { checkEmail } from "../Validations";
import Starry from "./Starry";
const Register = () => {

    // const locale = useLocale();
    const tradText = (a)=>a; // useTranslations('Register');


    return (
        <>
           
            <div className="grid w-full h-screen bg-no-repeat bg-cover " style={{ gridTemplateColumns: '4fr 1fr 1fr' }}>
                <div></div>
                <Card className="justify-center bg-white px-8 rounded-none bg-card-white-transparent" color="transparent" shadow={false} >
                    <Typography variant="h4" color="blue-gray">

                        {tradText('Register')}
                    </Typography>
                    <Typography color="gray" className="mt-1 font-normal">
                        {tradText('Enter details')}
                    </Typography>
                    <Formik
                        initialValues={{ email: '', password: '', confirmPassword: '', name: '', agreeCheck: [] }}
                        validate={values => {
                            const errors = {} as any;
                            if (!values.email) {
                                errors.email = `${tradText('Required')}`;
                            } else if (!checkEmail(values.email)) {
                                errors.email = `${tradText('Invalid mail')}`;
                            }

                            if (!values.name) {
                                errors.name = `${tradText('Required')}`;

                            }
                            if (!values.password) {
                                errors.password = `${tradText('Required')}`;

                            } else if (
                                !/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/.test(values.password)
                            ) {
                                errors.password = `${tradText('Invalid pass')}`;
                            }

                            if (!values.confirmPassword) {
                                errors.confirmPassword = `${tradText('Required')}`;
                            } else if (
                                values.confirmPassword != values.password
                            ) {
                                errors.confirmPassword = `${tradText('Invalid confirm')}`;
                            }

                            if (values.agreeCheck.length == 0) {
                                errors.agreeCheck = `${tradText('Required')}`;
                            }
                            return errors;
                        }}

                        onSubmit={(values, { setSubmitting }) => {
                            setTimeout(async () => {
                                const user = {
                                    name: values.name,
                                    email: values.email,
                                    password: values.password
                                } as SocialEventsUser;
                                // create new user in database and login it
                                console.log(process.env.NEXT_PUBLIC_BACKEND_URL + "/User/create")    
                                console.log(user)
                                try {
                                    await axios.post(process.env.NEXT_PUBLIC_BACKEND_URL + "/User/create", user)
                                        signIn("credentials", {
                                            email: values.email,
                                            password: values.password,
                                            callbackUrl: `${window.location.origin}/calendar/all`
                                        })
                                } catch (error) {
                                    if(error.response.status == 409){
                                        // got some problem with him
                                        // toast("Email already exists");
                                        alert("Email already exists")
                                    }
                                }
                                   
                                   setSubmitting(false);
                            }, 400);
                        }}

                    >
                        {({
                            values,
                            errors,
                            touched,
                            handleChange,
                            handleBlur,
                            handleSubmit,
                            isSubmitting,
                        }) => (
                            <form onSubmit={handleSubmit} className="mt-8 mb-2 w-80 max-w-screen-lg sm:w-96">

                                <div className="mb-4 flex flex-col gap-6">
                                    <div>

                                        <Input onChange={handleChange} size="lg" label={tradText('Name')} name="name" error={!!errors.name} />
                                        {errors.name && <Feedback>{errors.name}</Feedback>}
                                    </div>
                                    <div>
                                        <Input onChange={handleChange} size="lg" label={tradText('Email')} name="email" error={!!errors.email} />
                                        {errors.email && <Feedback>{errors.email}</Feedback>}
                                    </div>
                                    <div>
                                        <Input onChange={handleChange} type="password" size="lg" label={tradText('Password')} name="password" error={!!errors.password} />
                                        {errors.password && <Feedback>{errors.password}</Feedback>}
                                    </div>
                                    <div>
                                        <Input onChange={handleChange} type="password" size="lg" label={tradText('Confirm pass')} name="confirmPassword" error={!!errors.confirmPassword} />
                                        {errors.confirmPassword && <Feedback>{errors.confirmPassword}</Feedback>}

                                    </div>
                                </div>
                                <div className={errors.agreeCheck ? "border border-red-600 rounded-lg" : ""}>

                                <Checkbox
                                    onChange={handleChange}
                                    name="agreeCheck"
                                    label={
                                        (
                                            <Typography
                                                variant="small"
                                                color="gray"
                                                className="flex items-center font-normal"
                                                >
                                                {tradText('I agree')}
                                                <a
                                                    href="#"
                                                    className="font-medium transition-colors hover:text-blue-500"
                                                    >
                                                    &nbsp;{tradText('Terms and Conds')}
                                                </a>
                                            </Typography>
                                        )
                                    }
                                    containerProps={{ className: "-ml-2.5" }}
                                    />
                                </div>
                                {errors.agreeCheck && <Feedback>{JSON.stringify(errors.agreeCheck)}</Feedback>}
                                <Button className="mt-6" color="indigo" fullWidth type="submit">
                                    {tradText('Register')}
                                </Button>
                                <div className="grid grid-cols-2 gap-2">
                                    <Button className="my-2 mx-1 flex items-center gap-2" onClick={() => signIn("google",{ callbackUrl: `${window.location.origin}/calendar/all`})}><FaGoogle color="white" size="25px"></FaGoogle>{tradText('Register Google')}</Button>
                                    <Button color="gray" className="my-2 mx-1 flex items-center gap-2" onClick={() => signIn("github",{ callbackUrl: `${window.location.origin}/calendar/all`})}><FaGithub size="25px"></FaGithub>{tradText('Register Github')}</Button>
                                </div>
                                <Typography color="blue-gray" className="mt-4 text-center font-normal">
                                    {tradText('Already account')}{" "}
                                    <Link
                                        href="/login"
                                        className="font-medium text-blue-500 transition-colors hover:text-blue-700"
                                    >
                                        {tradText('Log In')}
                                    </Link>
                                </Typography>
                            </form>
                        )}
                    </Formik>
                </Card>
                <div></div>

            </div>
        </>

    );
}

export default Register;