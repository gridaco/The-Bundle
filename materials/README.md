# Materials

### Naming Convention

`<class>.<render-feature>.<elemental-reference>.<feature-description>.<id> (<display name-or-discription>)`

**Class:**

- m - Metal
- g - Glass
- w - Wood
- p - Plastic
- l - Leather
- f - Fabric
- s - Stone
- c - Ceramic
- r - Rubber
- d - Diamond or Gem
- h - Hair
- b - Brick
- t - Tile
- j - Jade or Jewel
- e - Emissive
- v - Velvet
- o - Opal
- y - Clay
- q - Liquid
- z - Fur
- x - Wax
- i - Ice
- n - Neon
- u - Dust or Dirt
- k - Silk

**Rendering Feature:**

- `glas` - Glass/Transparent: Typically requires more samples due to refractions, caustics, and potential for fireflies.
  Multiplier: 2x

- `glos` - Glossy/Metallic: Reflective surfaces can be prone to noise but not as much as glass.
  Multiplier: 1.5x

- `sss` - Subsurface Scattering: Materials like skin, milk, or marble that have light penetrate their surface.
  Multiplier: 2x

- `emit` - Emissive: Light-emitting materials. Might produce noise in the areas they illuminate.
  Multiplier: 1.5x

- `diff` - Diffuse: Regular, non-reflective surfaces like matte-finished walls.
  Multiplier: 1x

- `plas` - Plastic: Slightly reflective but usually doesn't need as many samples as metals.
  Multiplier: 0.75x

- `fbrc` - Fabric: Varies in nature, but generally, non-reflective surfaces might need more samples if it has detailed textures or hair/fur-like properties.
  Multiplier: 1x

- `hair` - Hair/Fur: Can be tricky to render due to the many fine details.
  Multiplier: 1.5x

- `lqui` - Water/Liquid: Reflections, refractions, and potential for caustics. Can be sample-intensive.
  Multiplier: 2x

- `vol` - Volume: Materials with volumetrics, like clouds or smoke.
  Multiplier: 2.5x

- `shad` - Shadow Catcher: Materials designed to catch shadows often used in compositing.
  Multiplier: 1x

- `cmic` - Tile/Ceramic: Reflective but not to the same extent as metals.
  Multiplier: 1.25x

- `wood` - Wood: Generally diffuse, but polished wood can be glossy.
  Multiplier: 1x (or 1.25x for polished wood)

**Elemental reference:**

For Elemental reference, it is highly important to follow the academic term indicating the material, for example you can't use a word like `iron`, since this can get confusing very quickly as the material library grows. If the material is inspired by a real-world element, or even tries to mimic one, in a different style (for example cartoonic), be very concise about the reference, and try to use the most close one. If the material is somehow abstract, use a word that commonly describes the material, the one might appear on google search results or pinterest.

E.g.

- `au` instead of "gold"
- `ag` instead of "silver"
- `cu` instead of "copper"
- `fe` instead of "iron"
- `pt` instead of "platinum"
- `al` instead of "aluminum"
- `polycarbonate` instead of "plastic"

Yet, you might still find it hard to differencate by solely using the elemental reference. This can be solved by adding a feature description, the next part.

**Feature description (optional, but recommended):**

For the feature description, we don't enforce you to follow one of the following, but encourage you to come up with your best. This index is used for differentiating between same elemental references, which means this part is less strict than the previous parts, you can even skip this part if you want. It's commonly helpful to use chemical state, for instance, `al.oxidized` for oxidized aluminum

> _items below are just examples, you can use your own words to describe the material_

- oxidized
- scratched
- rusted
- chipped
- cracked
- worn
- dirty
- stained
- wet
- dry
- polished

**ID (if required):**

Lastly, you can add an ID to the material. This is often used when the two materials are very simalar, even to the "feature description" level. For example, `al.oxidized.001` and `al.oxidized.002` are two oxidized aluminum materials, but they are different in some way. This part is required if you have more than one material with the same elemental reference and feature description.

> Simply put, this is an indicator to variants of materials which are not able to be described with words.

**Display name (optional):**

Display name, you can write what every you want think is helpul for yourself and others to locate the material. Think of it as a tag, note, or a nickname.

For instance, like below

- `m.gloss.al.oxidized.001 (oxidized aluminum foil)`
- `m.gloss.al.oxidized.002 (oxidized aluminum can)`
- `m.gloss.au.standard (gold)`
