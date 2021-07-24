import React from 'react';
import DeckGL from '@deck.gl/react';
import {StaticMap, GeolocateControl} from 'react-map-gl';

type View = {
  latitude: number;
  longitude: number;
  zoom: number;
  pitch: number;
  bearing: number;
}

const INITIAL_VIEW_STATE: View = {
  longitude: -122.41669,
  latitude: 37.7853,
  zoom: 13,
  pitch: 0,
  bearing: 0
};

const geolocateControlStyle= {
  right: 10,
  top: 10
};

function Map() {
  return (
    <DeckGL
      initialViewState={INITIAL_VIEW_STATE}
      controller={true}
    >
      <StaticMap mapStyle="mapbox://styles/mapbox/outdoors-v11">
        <GeolocateControl
          style={geolocateControlStyle}
          positionOptions={{enableHighAccuracy: true}}
          trackUserLocation={true}
          auto
        />
      </StaticMap>
    </DeckGL>
  );
}

export default Map;
