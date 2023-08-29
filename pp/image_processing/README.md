# Post production Image Processing

The primary purpose of this module is to enhance the quality of rendered images on lower sample counts and resolution. This is done by applying various post production effects to the rendered image. while rendering tool takes account more accurate and theoretically correct approach to rendering, this module is primarily focused on the time-saving perspective.

**See also:**

- [color interpolation](../image_color_interpolation/)
- [signature](../signature/)

## Grayscale

<!-- before / after image view -->

|             A             |                  B                  |
| :-----------------------: | :---------------------------------: |
| ![](examples/example.png) | ![](examples/example.grayscale.png) |

## Grain Noise

| i     |             A             |                  B                  |
| :---- | :-----------------------: | :---------------------------------: |
| `0.1` | ![](examples/example.png) | ![](examples/example.grain_0.1.png) |
| `0.2` | ![](examples/example.png) | ![](examples/example.grain_0.2.png) |
| `0.3` | ![](examples/example.png) | ![](examples/example.grain_0.3.png) |
| `0.4` | ![](examples/example.png) | ![](examples/example.grain_0.4.png) |
| `0.5` | ![](examples/example.png) | ![](examples/example.grain_0.5.png) |

## Bloom

|             A             |                B                |
| :-----------------------: | :-----------------------------: |
| ![](examples/example.png) | ![](examples/example.bloom.png) |

## Glow

|             A             |               B                |
| :-----------------------: | :----------------------------: |
| ![](examples/example.png) | ![](examples/example.glow.png) |
