'use client';

import Input from "@/components/Shared/atoms/Input";
import Button from "@/components/Shared/atoms/Button";
import Typography from "@/components/Shared/atoms/Typography";
// import { useTranslations, useLocale } from "next-intl";
import { Formik } from "formik";
import { signIn } from "next-auth/react"
import Link from "next/link";
import { FaGoogle, FaGithub } from "react-icons/fa";
import { SocialEventsUser } from "@/types/SocialEventsUser";
import Feedback from "../atoms/Feedback";

const LoginForm = () => {
    const tradText = (a)=> a; // useTranslations('LogIn');
    // const locale = useLocale();

    return (
        <Formik
            initialValues={{ email: '', password: '', name: '', }}
            validate={values => {
                const errors = {} as SocialEventsUser;
                //no validate for login
                return errors;
            }}

            onSubmit={(values, { setSubmitting }) => {
                setTimeout(async () => {
                    await signIn('credentials', {
                        email: values.email,
                        password: values.password,
                        callbackUrl: `${window.location.origin}/calendar/all`,
                    });
                    setSubmitting(false);
                }, 400);
            }}
        >
            {({
                errors,
                handleChange,
                handleSubmit,
                isSubmitting,
            }) => (
                <form onSubmit={handleSubmit} className="mt-8 mb-2 w-80 max-w-screen-lg sm:w-96">
                    <div className="mb-4 flex flex-col gap-6">
                        <div>
                            <Input size="lg" name="email" label={tradText('Email')} onInput={handleChange} error={!!errors.email} />
                            {errors.email && <Feedback>{errors.email}</Feedback>}
                        </div>

                        <div>
                            <Input type="password" name="password" size="lg" label={tradText('Password')} onInput={handleChange} error={!!errors.password} />
                            {errors.password && <Feedback>{errors.password}</Feedback>}
                        </div>

                    </div>

                    <Button type="submit" className="mt-6" color="indigo" fullWidth onClick={handleChange} disabled={isSubmitting}>
                        {tradText('Log In')}
                    </Button>
                    <div className="grid grid-cols-2">
                        <Button
                            className="my-2 mx-1 flex items-center"
                            onClick={() => signIn("google", { callbackUrl: `${window.location.origin}/calendar/all` })}>
                            <FaGoogle color="white" size="25px"></FaGoogle>{tradText('Log In Google')}</Button>
                        <Button
                            color="blue-gray"
                            className="my-2 mx-1 flex items-center"
                            onClick={() => signIn("github", { callbackUrl: `${window.location.origin}/calendar/all` })}>
                            <FaGithub size="25px">
                            </FaGithub>{tradText('Log In Github')}</Button>
                    </div>
                    <Typography color="blue-gray" className="mt-4 text-center font-normal">
                        {tradText('No account?')}{" "}
                        <Link
                            href="/register"
                            className="font-medium text-blue-500 transition-colors hover:text-blue-700">
                            {tradText('Register')}
                        </Link>
                    </Typography>
                </form>
            )}
        </Formik>);
}

export default LoginForm;