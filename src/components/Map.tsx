import DeckGL from "@deck.gl/react";
import { PathLayer, PathLayerProps } from "@deck.gl/layers";
import { useEffect, useState } from "react";
import { StaticMap } from "react-map-gl";
import { stravaAPI } from "../api";
import polyline from "@mapbox/polyline";
import { RGBAColor } from "@deck.gl/core";

type View = {
  latitude: number;
  longitude: number;
  zoom: number;
  pitch: number;
  bearing: number;
};

type Activity = {
  name: string;
  map: {
    summary_polyline: string;
  };
};

type PathData = {
  path: [number, number][];
  name: string;
  color: RGBAColor;
};

const INITIAL_VIEW_STATE: View = {
  longitude: 121.06741,
  latitude: 14.53533,
  zoom: 10,
  pitch: 0,
  bearing: 0,
};

function reverseCoordsOrder(coordsList: [number, number][]) {
  return coordsList.map((coords) => coords.slice().reverse());
}

function generateRandomRGB() {
  return [
    Math.floor(Math.random() * 256),
    Math.floor(Math.random() * 256),
    Math.floor(Math.random() * 256),
  ];
}

function Map() {
  const [layer, setLayer] =
    useState<PathLayer<PathData, PathLayerProps<PathData>>>();

  useEffect(() => {
    (async function fetchActivities() {
      const activities = await stravaAPI.get("/athlete/activities");

      const pathData = activities.data.map((activity: Activity) => ({
        name: activity.name,
        path: reverseCoordsOrder(
          polyline.decode(activity.map.summary_polyline)
        ),
        color: generateRandomRGB(),
      }));

      const layer = new PathLayer({
        id: "path-layer",
        data: pathData,
        pickable: true,
        widthMinPixels: 3,
        getPath: (d) => d.path,
        getColor: (d) => d.color,
        getWidth: 5,
      });

      setLayer(layer);
    })();
  }, []);

  return layer ? (
    <DeckGL
      initialViewState={INITIAL_VIEW_STATE}
      layers={[layer]}
      controller={true}
    >
      <StaticMap mapStyle="mapbox://styles/mapbox/light-v10" />
    </DeckGL>
  ) : null;
}

export default Map;
