import MyGoogleMap from "@/components/Geolocation/organisms/MyGoogleMap";
import { Coordinate } from "@/types/Coordinate";
import React from "react";
import type { Event } from "@/types/Event";
type SingleEventMapProps = {
    event?: Event;
    width: string;
    height: string;

}
const SingleEventMap = ({event, width, height} : SingleEventMapProps) => {
    const TimisoaraCoordinates = { lat: 45.760696, lng: 21.226788 } as Coordinate;
    const eventLat =parseFloat(event!.location[1]);
    const eventLng = parseFloat(event!.location[2])
    const EventCoordinates = { 
        lat: eventLat ?? TimisoaraCoordinates.lat, 
        lng: eventLng ?? TimisoaraCoordinates.lng
    } as Coordinate;
    const center = EventCoordinates;
    const markerPositions = [{
        _id: event?._id,
        lat: eventLat ?? TimisoaraCoordinates.lat,
        lng: eventLng ?? TimisoaraCoordinates.lng,
            eventName: event?.name,
        } as  MarkerData] as MarkerData[];
        
        
        return (
        <>
            <MyGoogleMap center={center} markersData={markerPositions} width={width} height={height} />
        </>
    );
}
 
export default SingleEventMap;