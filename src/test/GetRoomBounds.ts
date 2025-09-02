import GetFloors from "./GetFloors"

export default {
  floors: GetFloors.map(n => ({
    id: n.id,
    layer: {
      id: "aaaaaaaaaaaaaaaaaaaaaaaaa"
    },
    edges: []
  })),
  rooms: [
    {
      id: "613htqkzf66zz7hf7n8kzszed",
      layer: {
        id: "aaaaaaaaaaaaaaaaaaaaaaaaa"
      },
      floor: {
        id: GetFloors[0]?.id
      },
      classifications: [],
      boundary: {
        edges: []
      },
      holes: [],
      dimensionEstimates: null,
      label: null,
      keywords: []
    }
  ]
}
