import bpy


# collections
# - example     |  default ON    |   output OFF
# - library     |  default OFF   |   output OFF
# - template    |  default OFF   |   output ON
# - environment |  default ON    |   output ON


DATA = {
    "text.data.body": "gross",
}


file = "scene.blend"


# open file
bpy.ops.wm.open_mainfile(filepath=file)


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

# copy the particle system from <sample> to the text mesh object
text.modifiers.new(name="ParticleSystem 1", type='PARTICLE_SYSTEM')
text.particle_systems[0].settings = sample.particle_systems[0].settings


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
