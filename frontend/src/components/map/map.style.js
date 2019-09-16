export default [
    {
        stylers: [
            {
                hue: "#ff1a00",
            },
            {
                saturation: -100,
            },
            {
                invert_lightness: true,
            },
            {
                lightness: 33,
            },
            {
                gamma: 0.5,
            },
        ],
    },
    {
        featureType: "poi.business",
        stylers: [
            {
                visibility: "off",
            },
        ],
    },
    {
        featureType: "poi.park",
        elementType: "labels.text",
        stylers: [
            {
                visibility: "off",
            },
        ],
    },
    {
        featureType: "water",
        elementType: "geometry",
        stylers: [
            {
                color: "#2D333C",
            },
        ],
    },
]
