import json
import click

rotations = []

X = 360
X_STEP = 15
Z = 180
Z_STEP = 30
VAR = "A"

# Iterate over x and z axes according to the specified steps
for x in range(0, X, X_STEP):  # X-axis: 15-degree increments up to 345
    for z in range(0, Z + 1, Z_STEP):  # Z-axis: 30-degree increments
        rotations.append([x, 0, z])

size = len(rotations)
name = f"R{size}__X{X}_{int(X/X_STEP)}__Z{Z}_{int(Z/Z_STEP)}__Y0{VAR}"

# Convert the structure to JSON and print
with open(f"{name}.json", "w") as f:
    json.dump(rotations, f, indent=4)

print(f"Created {name}.json")
print(f"Total rotations: {size}")
