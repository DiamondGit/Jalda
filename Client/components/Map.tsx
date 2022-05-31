import { useEffect, useState } from "react";
import { Map as YMap, Placemark, Circle } from "react-yandex-maps";
import { _randomCityCoords } from "../data";

type MapProps = {
    marker?: boolean;
    text?: string;
} & (
    | {
          center: number[];
          random?: never;
      }
    | {
          center?: never;
          random: true;
      }
);

const Map = ({ center = [], random, marker = false, text = null }: MapProps) => {
    const [mapCenter, setMapCenter] = useState(center);

    useEffect(() => {
        if (random) {
            setMapCenter(_randomCityCoords[Math.floor(Math.random() * 9)]);
        }
    }, []);

    return (
        <YMap style={{ width: "100%", height: "100%" }} state={{ center: mapCenter, zoom: 13 }} controls>
            {marker ? (
                <Placemark
                    geometry={mapCenter}
                    modules={["objectManager.addon.objectsBalloon", "objectManager.addon.objectsHint"]}
                    options={{
                        preset: "islands#dotIcon",
                        iconColor: "#fc4f4f",
                        hideIconOnBalloonOpen: false,
                        balloonOffset: [3, -40],
                    }}
                    properties={{
                        iconCaption: text,
                    }}
                />
            ) : (
                <Circle
                    geometry={[mapCenter, 500]}
                    options={{
                        fillColor: "#fc4f4f80",
                        strokeColor: "#3e497a",
                        strokeOpacity: 0.8,
                        strokeWidth: 5,
                    }}
                />
            )}
        </YMap>
    );
};

export { Map };
