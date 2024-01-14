'use client'
import { useLoadScript, GoogleMap, MarkerF } from '@react-google-maps/api';
import { useMemo } from 'react';
import { Coordinate } from '@/types/Coordinate';

type MapProps = {
    center: Coordinate,
    markersData: MarkerData[]
    width? : string,
    height? : string
}
const MyGoogleMap = ({center, markersData, width, height} : MapProps) => {
    const libraries = useMemo(() => ['places'], []);
    const mapCenter = useMemo(
      () => ({ lat: center.lat, lng: center.lng }),
      []
      );
  
  const mapOptions = useMemo<google.maps.MapOptions>(
      () => ({
        disableDefaultUI: false,
        clickableIcons: true,
        scrollwheel: true,
      }),
      []
    );
  
    const { isLoaded } = useLoadScript({
      googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY || "",
      libraries: libraries as any,
    });
  
    const tradText = (a) => a;// useTranslations('Map');
    if (!isLoaded) {
      return <p>{tradText('Loading')}</p>;
    }
  
    return (
      <div className='w-full h-full'>
          <GoogleMap
          options={mapOptions}
          zoom={14}
          center={mapCenter}
          mapTypeId={google.maps.MapTypeId.ROADMAP}
          mapContainerStyle={{ width: width ?? '100vw', height: height ??'100vh' }}
          // onLoad={(map) => console.log('Map Loaded')}
          >

  {markersData.map((markerData) => (
      <MarkerF 
      key={"marker_" + markerData._id}
       position={markerData}
        // size is updated by scaledSize of icon and css of label.
      icon = {{url: "/Event.png", scaledSize: new window.google.maps.Size(80, 80)}}
      label={{text: markerData.eventName, className: "text-white -mt-[10px] max-w-[80px] px-3 truncate ", color: "white", fontSize: "12px"}}
      title={ markerData.eventName}
      
      />
    ))}
  </GoogleMap>
      </div>
    );
}
 
export default MyGoogleMap; 