'use client';
import MyGoogleMap from "@/components/Geolocation/organisms/MyGoogleMap";
import { Coordinate } from "@/types/Coordinate";
import { useEvents } from "@/components/utils/ApiCallers/ServerApiCallers";
type AllEventsMapProps = {
    width? : string,
    height? : string
}
const AllEventsMap = ({width, height} : AllEventsMapProps) => {
    const { AllEvents } = useEvents();
    const TimisoaraCoordinates = { lat: 45.760696, lng: 21.226788 } as Coordinate;
    const markersData =  AllEvents?.map(event => {
        const MarkerDatas = {
            _id: event?._id,
            lat: parseFloat(event?.location[1]) ?? TimisoaraCoordinates.lat,
            lng: parseFloat(event?.location[2]) ?? TimisoaraCoordinates.lng,
            eventName: event?.name,
        } as  MarkerData ;
        return MarkerDatas;
    });
    const center = TimisoaraCoordinates;
    return (
        <>
            <MyGoogleMap center={center} markersData={markersData} width={width} height={height} />
        </>
    );
}
 
export default AllEventsMap;