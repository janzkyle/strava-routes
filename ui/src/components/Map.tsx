import DeckGL from "@deck.gl/react";
import { PathLayer, PathLayerProps } from "@deck.gl/layers";
import { useEffect, useState } from "react";
import { StaticMap } from "react-map-gl";
import { stravaAPI } from "../api";
import polyline from "@mapbox/polyline";
import { RGBAColor } from "@deck.gl/core";
import { Position } from "deck.gl";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useCookies } from "react-cookie";
import { SEGMENTS_DATA } from '../data';

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
  type: string;
};

type Segment = {
  name: string;
  map: {
    polyline: string;
  };
  effort_count: number;
}

type PathData = {
  path: Position[];
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

const bounds = [14.533967, 121.051289, 14.623777, 121.110896]
const path = [[bounds[1], bounds[0]], [bounds[1], bounds[2]], [bounds[3], bounds[0]], [bounds[3], bounds[0]], [bounds[1], bounds[0]]];

const box = new PathLayer({
  id: "path-layer",
  data: [{
    name: "bound",
    path: [[bounds[1], bounds[0]], [bounds[1], bounds[2]], [bounds[3], bounds[2]], [bounds[3], bounds[0]], [bounds[1], bounds[0]]],
  }],
  pickable: true,
  widthMinPixels: 3,
  getPath: (d) => [[bounds[1], bounds[0]], [bounds[1], bounds[2]], [bounds[3], bounds[2]], [bounds[3], bounds[0]], [bounds[1], bounds[0]]],
  getWidth: 5,
  opacity: 0.5,
});

function reverseCoordsOrder(coordsList: Position[]) {
  return coordsList.map((coords): [number,number] => [coords[1], coords[0]]);
}

function generateRandomRGB(): RGBAColor {
  return [
    Math.floor(Math.random() * 256),
    Math.floor(Math.random() * 256),
    Math.floor(Math.random() * 256),
  ];
}

function Map() {
  const [layer, setLayer] =
    useState<PathLayer<PathData, PathLayerProps<PathData>>>();

  const [cookies] = useCookies();

  useEffect(() => {
    (async function fetchActivities() {
      // let activitiesData;
      // const userRef = doc(db, "users", cookies["id"]);
      // const userSnap = await getDoc(userRef);

      // if (userSnap.exists()) {
      //   activitiesData = userSnap.data().activities;
      // } else {
      //   const activities = await stravaAPI.get("/athlete/activities");
      //   await setDoc(doc(db, "users", cookies["id"]), {
      //     id: cookies["id"],
      //     activities: activities.data,
      //   });

      //   activitiesData = activities.data;
      // }

      const segmentsData = SEGMENTS_DATA;

      const pathData = segmentsData.reduce(
        (acc: PathData[], activity: Segment) => {
          if (activity.map.polyline) {
            acc.push({
              name: activity.name,
              path: reverseCoordsOrder(
                polyline.decode(activity.map.polyline)
              ),
              color: generateRandomRGB(),
            });
          }

          return acc;
        },
        []
      );

      const layer = new PathLayer({
        id: "path-layer",
        data: pathData,
        pickable: true,
        widthMinPixels: 3,
        getPath: (d) => d.path,
        getColor: (d) => d.color,
        getWidth: 5,
        opacity: 0.5,
      });

      setLayer(layer);
    })();
  }, [cookies]);

  return layer ? (
    <DeckGL
      initialViewState={INITIAL_VIEW_STATE}
      layers={[layer, box]}
      controller={true}
    >
      <StaticMap mapStyle="mapbox://styles/mapbox/light-v10" />
    </DeckGL>
  ) : null;
}

export default Map;
