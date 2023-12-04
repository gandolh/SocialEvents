import Typography from "@/components/Shared/atoms/Typography";
import { HiInformationCircle } from "react-icons/hi"

type FeedbackProps = {
  children: React.ReactNode;
  className?: string;
};

const Feedback = ({children, className} : FeedbackProps) => {
    return ( 
        <Typography variant="small" color="gray" className={"flex items-center gap-1 font-normal mt-2 "+ className} >
        <HiInformationCircle className="w-4 h-4 -mt-px" />
        <div className="flex-grow">{children}</div>
      </Typography>

     );
}
 
export default Feedback;