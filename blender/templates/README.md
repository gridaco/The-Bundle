# blender templates

## Structure

- `/template-name`
  - `template.blend.gz` gzipped blender file
  - `meta.json` meta data to the blender file containing customizable options

## Adding new template

After finishing up your work with blender, tidy up your file by organizing layers and removing unused resources.

Once this is done, change the name of the layer that is customizable via data pipeline.

```txt
{{name_of_the_layer}}
```

Once this step is done, run below script to validate and generate the `meta.json`

```bash
# for scene with no external resources
pipx bdt ./file.blend metagen

# for scene with external files (maps, etc..)
# Note: the directory should contain only one .blend file, otherwise it will fail
pipx bdt ./dir_to_project metagen
```

Update the `meta.json` by hand to further configure the customizable scopes.
