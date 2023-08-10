import bpy

# collections
# - example     |  default ON    |   output OFF
# - library     |  default OFF   |   output OFF
# - template    |  default OFF   |   output ON
# - environment |  default ON    |   output ON


DATA = {
    "text.data.body": "B",
}


file = "scene.blend"


# open file
bpy.ops.wm.open_mainfile(filepath=file)

print("Sorry for spaghetti code... -Han")


collections = {
    'example': bpy.data.collections['example'],
    'library': bpy.data.collections['library'],
    'template': bpy.data.collections['template'],
    'environment': bpy.data.collections['environment'],
}

# TODO: load other unknown collections as well.


# 1. get the text object
text = bpy.data.objects['text']

# 2. set the text body
text.data.body = DATA['text.data.body']

# convert to mesh
# (select the object first)
text.select_set(True)
bpy.context.view_layer.objects.active = text

# (convert to mesh)
bpy.ops.object.convert(target='MESH')

# load the sample object (for materials and particle systems)
sample = bpy.data.objects['sample']

# copy the material from <sample> to the text mesh object
text.data.materials.append(sample.data.materials[0])

# Add Remesh modifier
bpy.ops.object.modifier_add(type='REMESH')
remesh_modifier = text.modifiers["Remesh"]
remesh_modifier.octree_depth = 6
remesh_modifier.voxel_size = 0.015  # Changed voxel size
remesh_modifier.use_smooth_shade = True  # Enable smooth 

# Add Cloth modifier to the plane
# plane_obj = bpy.context.active_object
bpy.ops.object.modifier_add(type='CLOTH')
cloth_settings = text.modifiers["Cloth"].settings
cloth_settings.quality = 5
cloth_settings.mass = 0.5
cloth_settings.vertex_group_mass = "Group"

# Set Cloth settings
cloth_settings.use_pressure = True
cloth_settings.uniform_pressure_force = 5
cloth_settings.target_volume = 2
cloth_settings.pressure_factor = 3  # Changed pressure scale
cloth_settings.use_dynamic_mesh = True  # Set dynamic mass
cloth_settings.fluid_density = 0


# Set simulation visualization and rendering settings
n = 8
bpy.context.scene.frame_start = 1
bpy.context.scene.frame_end = n
bpy.context.scene.frame_set(n)

# Set field weights
cloth_settings.gravity = (0, 0, 0)  # Set gravity to 0

# Set collision quality
bpy.types.ClothCollisionSettings.collision_quality = 3  # Set the collision quality

# Run the simulation
bpy.ops.ptcache.bake({"point_cache": text.modifiers["Cloth"].point_cache}, bake=False)



# **********


# update render settings by collection
collection_on = ['template', 'environment']

for collection in collections:
    if collection in collection_on:
        collections[collection].hide_render = False
        collections[collection].hide_viewport = False

    else:
        collections[collection].hide_render = True
        collections[collection].hide_viewport = True


# save directory
bpy.context.scene.render.filepath = "//render.png"

# rennder options
bpy.context.scene.render.image_settings.file_format = 'PNG'
# samples
bpy.context.scene.cycles.samples = 256
# resolution
bpy.context.scene.render.resolution_x = 1024
bpy.context.scene.render.resolution_y = 1024

# render the scene
bpy.ops.render.render(write_still=True)



# Balloon Text

# 1. Locate a template text object
# 2. Change the text value
# 3. Convert to mesh
# 4. Add remesh modifier
# - voxel size = 0.015
# 5. Add constraints / cloth
# - vertext mass = 3Kg
# - Enable Pressure
# - Pressure = 4
# - Target Volume = 2
# - Pressure Strength = 3
# - Fluid Density = 0
# 6. Set cache
# - End = 8
# 7. Set collision
# - Quality = 3
# 5. Set field weights
# - Gravity = 0

# BAKE

# Enable Smooth shape

# Convert to mesh

# Apply material

# Render
