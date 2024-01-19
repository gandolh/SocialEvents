// import { useTranslations } from "next-intl";
import Typography from "@/components/Shared/atoms/Typography";
const LoginHeader = () => {
    const tradText = (a)=>a // useTranslations('LogIn');

    return (
        <>
            <Typography variant="h4" color="blue-gray">
                {tradText('Log In')}
            </Typography>
            <Typography color="gray" className="mt-1 font-normal" children="">
                
            </Typography>
        </>);
}

export default LoginHeader;