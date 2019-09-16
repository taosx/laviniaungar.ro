import React, { useState, useEffect } from "react"
// import mapStyles from "./map.style"

import { GoogleMap, LoadScript, Marker, Circle } from "@react-google-maps/api"

const Map = props => {
    // const [visitorPosition, setVisitorPosition] = useState(undefined)

    // useEffect(() => {
    //     if (navigator.geolocation) {
    //         navigator.geolocation.getCurrentPosition(position => {
    //             setVisitorPosition({
    //                 lat: position.coords.latitude,
    //                 lng: position.coords.longitude,
    //             })
    //         })
    //     }
    // }, [])

    const center = {
        lat: 45.295604,
        lng: 21.881859,
    }
    // styles={mapStyles}

    const onLoad = data => {
        console.log("LOADED =========")
        console.log(data)
    }

    const onError = data => {
        console.log("ERROR =========")
        console.log(data)
    }

    return (
        <div className={props.className}>
            <LoadScript
                id={"hello-dearlyadasd"}
                googleMapsApiKey={"AIzaSyARApa2umCenNWXrLww23yA6Kk2Hw0xbq8"}
                region="EN"
                version="weekly"
                onLoad={onLoad}
                onError={onError}
                libraries={["drawing", "visualization", "places"]}
            >
                <GoogleMap
                    id="circle-example"
                    mapContainerStyle={{
                        height: "400px",
                        width: "800px",
                    }}
                    zoom={17}
                    center={center}
                />
                {/* <Marker position={center} title={"LU"}></Marker>
                    {visitorPosition && (
                        <Circle
                            center={visitorPosition}
                            radius={20}
                            options={{
                                strokeColor: "#284ee8",
                                strokeOpacity: 0.8,
                                strokeWeight: 2,
                                fillColor: "#455cb9",
                                fillOpacity: 0.35,
                                clickable: false,
                                draggable: false,
                                editable: false,
                                visible: true,
                                zIndex: 1,
                            }}
                        />
                    )}
                    )} */}
            </LoadScript>
        </div>
    )
}

export default Map
