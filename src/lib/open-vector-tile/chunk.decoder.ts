import { Pbf } from "./pbf"

export var binary_mesh = {
  read: (e: Pbf, t?) => {
    return e.readFields(binary_mesh._readField, { chunk: [], quantized_chunk: [] }, t)
  },
  _readField: (e, t, i) => {
    1 === e ? t.chunk.push(chunk_simple.read(i, i.readVarint() + i.pos)) : 2 === e && t.quantized_chunk.push(chunk_quantized.read(i, i.readVarint() + i.pos))
  },
  write: (e, t) => {
    if (e.chunk) for (var i = 0; i < e.chunk.length; i++) t.writeMessage(1, chunk_simple.write, e.chunk[i])
    if (e.quantized_chunk) for (i = 0; i < e.quantized_chunk.length; i++) t.writeMessage(2, chunk_quantized.write, e.quantized_chunk[i])
  }
}

export var vertices_simple = {
  read: (e, t) => {
    return e.readFields(vertices_simple._readField, { xyz: [], uv: [] }, t)
  },
  _readField: (e, t, i) => {
    1 === e ? i.readPackedFloat(t.xyz) : 2 === e && i.readPackedFloat(t.uv)
  },
  write: (e, t) => {
    e.xyz && t.writePackedFloat(1, e.xyz), e.uv && t.writePackedFloat(2, e.uv)
  }
}

var faces_simple = {
  read: (e, t) => {
    return e.readFields(faces_simple._readField, { faces: [] }, t)
  },
  _readField: (e, t, i) => {
    1 === e && i.readPackedVarint(t.faces)
  },
  write: (e, t) => {
    e.faces && t.writePackedVarint(1, e.faces)
  }
}

export var chunk_simple = {
  read: (e, t) => {
    return e.readFields(chunk_simple._readField, { vertices: null, faces: null, chunk_name: "", material_name: "" }, t)
  },
  _readField: (e, t, i) => {
    1 === e
      ? (t.vertices = vertices_simple.read(i, i.readVarint() + i.pos))
      : 2 === e
        ? (t.faces = faces_simple.read(i, i.readVarint() + i.pos))
        : 3 === e
          ? (t.chunk_name = i.readString())
          : 4 === e && (t.material_name = i.readString())
  },
  write: (e, t) => {
    e.vertices && t.writeMessage(1, vertices_simple.write, e.vertices),
      e.faces && t.writeMessage(2, faces_simple.write, e.faces),
      e.chunk_name && t.writeStringField(3, e.chunk_name),
      e.material_name && t.writeStringField(4, e.material_name)
  }
}

export var vertices_quantized = {
  read: (e, t) => {
    return e.readFields(vertices_quantized._readField, { quantization: 0, translation: [], x: [], y: [], z: [] }, t)
  },
  _readField: (e, t, i) => {
    1 === e
      ? (t.quantization = i.readFloat())
      : 2 === e
        ? i.readPackedFloat(t.translation)
        : 3 === e
          ? i.readPackedSVarint(t.x)
          : 4 === e
            ? i.readPackedSVarint(t.y)
            : 5 === e && i.readPackedSVarint(t.z)
  },
  write: (e, t) => {
    e.quantization && t.writeFloatField(1, e.quantization),
      e.translation && t.writePackedFloat(2, e.translation),
      e.x && t.writePackedSVarint(3, e.x),
      e.y && t.writePackedSVarint(4, e.y),
      e.z && t.writePackedSVarint(5, e.z)
  }
}

export var uv_quantized = {
  read: (e, t) => {
    return e.readFields(uv_quantized._readField, { name: "", quantization: 0, u: [], v: [] }, t)
  },
  _readField: (e, t, i) => {
    1 === e ? (t.name = i.readString()) : 2 === e ? (t.quantization = i.readFloat()) : 3 === e ? i.readPackedSVarint(t.u) : 4 === e && i.readPackedSVarint(t.v)
  },
  write: (e, t) => {
    e.name && t.writeStringField(1, e.name),
      e.quantization && t.writeFloatField(2, e.quantization),
      e.u && t.writePackedSVarint(3, e.u),
      e.v && t.writePackedSVarint(4, e.v)
  }
}

export var faces_compressed = {
  read: (e, t) => {
    return e.readFields(faces_compressed._readField, { faces: [] }, t)
  },
  _readField: (e, t, i) => {
    1 === e && i.readPackedSVarint(t.faces)
  },
  write: (e, t) => {
    e.faces && t.writePackedSVarint(1, e.faces)
  }
}

export var chunk_quantized = {
  read: (e, t) => {
    return e.readFields(chunk_quantized._readField, { chunk_name: "", material_name: "", vertices: null, uvs: [], faces: null }, t)
  },
  _readField: (e, t, i) => {
    1 === e
      ? (t.chunk_name = i.readString())
      : 2 === e
        ? (t.material_name = i.readString())
        : 3 === e
          ? (t.vertices = vertices_quantized.read(i, i.readVarint() + i.pos))
          : 4 === e
            ? t.uvs.push(uv_quantized.read(i, i.readVarint() + i.pos))
            : 5 === e && (t.faces = faces_simple.read(i, i.readVarint() + i.pos))
  },
  write: (e, t) => {
    if (
      (e.chunk_name && t.writeStringField(1, e.chunk_name),
      e.material_name && t.writeStringField(2, e.material_name),
      e.vertices && t.writeMessage(3, vertices_quantized.write, e.vertices),
      e.uvs)
    )
      for (var i = 0; i < e.uvs.length; i++) t.writeMessage(4, uv_quantized.write, e.uvs[i])
    e.faces && t.writeMessage(5, faces_simple.write, e.faces)
  }
}
