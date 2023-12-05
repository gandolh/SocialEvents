import Input from '@/components/Shared/atoms/Input';
// import { useTranslations } from 'next-intl';
import {useLoadScript,Autocomplete}  from '@react-google-maps/api';
import React from 'react';

const bounds = { east: 20, north: 45, south:50, west: 30};

const LocationPicker = ({ setLocation }) => {

  const searchBox = React.useRef(null);
  const onLoad = ref => searchBox.current = ref;

  const onPlacesChanged = () => {
    const foundPlace = (searchBox as any).current.getPlace();
    const locationObject = {
      formatted_address: foundPlace.formatted_address,
      coordinates: [foundPlace.geometry.location.lat(), foundPlace.geometry.location.lng()]
    };
    console.log(locationObject)
    setLocation(locationObject);
  };
  const libraries = React.useMemo(() => ['places'], []);
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY || "",
    libraries: libraries as any,
  });

  const tradText = (a) => a // useTranslations('Map');

  if (!isLoaded) {
    return <p>{tradText('Loading')}</p>;
  }
  return (
    <>
      <div>
        <div className="mb-2 block">
          <Autocomplete
            onLoad={onLoad}
            onPlaceChanged={onPlacesChanged}
            bounds = {bounds}
             >
            <Input
              variant="outlined"
              label={tradText('Choose Location')}
            />
          </Autocomplete>
        </div>
      </div>
    </>
  );
}

export default LocationPicker;