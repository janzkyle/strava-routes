import { useEffect, useState } from 'react';
import ReactMapGL, { FullscreenControl } from 'react-map-gl';

type Viewport = {
  width: string;
  height: string;
  latitude: number;
  longitude: number;
  zoom: number;
}

const fullscreenControlStyle= {
  right: 10,
  top: 10
};

function Map() {
  const [viewport, setViewport] = useState<Viewport>({
    width: "100vw",
    height: "100vh",
    latitude: 14.5353954,
    longitude: 121.0674113,
    zoom: 15
  });

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.watchPosition((position) => {
        setViewport({
          ...viewport,
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        })
      });
    }
  })
  
  return (
    <ReactMapGL
      {...viewport}
      mapStyle="mapbox://styles/mapbox/outdoors-v11"
      onViewportChange={(nextViewport: Viewport) => setViewport(nextViewport)}
    >
      <FullscreenControl style={fullscreenControlStyle} />
    </ReactMapGL>
  );
}

export default Map;
