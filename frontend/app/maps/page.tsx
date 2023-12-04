import SingleEventMap from "@/components/Geolocation/organisms/SingleEventMap";
import AllEventsMap from "@/components/Geolocation/organisms/AllEventsMap";

type MapsProps = {
    searchParams?: { [key: string]: string | string[] | undefined };
}
const Maps = async ({
    searchParams,
}: MapsProps) => {
  
    
    if(searchParams?.eventId == undefined)
    return <AllEventsMap/>
    else 
    // @ts-expect-error Server Component
    return <SingleEventMap eventId={searchParams.eventId}/>

    
 
};
export default Maps;