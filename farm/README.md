# [WIP] Render farm infrastructure

Our cutting-edge render farm infrastructure relies heavily on [Flamenco](https://flamenco.blender.org), a specialized system optimized for equitable task distribution across multiple high-performance workstations. While the architecture is cloud-compatible, it is primarily designed for operation within a local network environment, which can also be configured for secure remote access via a VPN. The infrastructure employs a hybrid approach, serving not only as a powerhouse for routine, large-scale rendering projects, but also offering the flexibility to handle ad hoc, single-task render jobs efficiently.

## Concepts

- Release: a collection of jobs that are run in a related context
- Job: a file that defines a set of tasks to be run
- Task: a single command to be run on a single worker
- Worker: a render worker node instance

Following above concepts, the main volume should look like this:

```txt
├── jobs # reserved by Flamenco
├── file-store # reserved by Flamenco
├── quick
├── releases
│   ├── <release-name>
│   │   ├── store
│   │   │   ├── <job-name.blend>
│   │   │   ├── <job-name.blend>
│   │   │   ├── ...
│   │   ├── out
│   │   │   ├── <job-name>
│   │   │   │   ├── ######.png
├── dist
│   ├── <release-name>
│   │   ├── xyz.png
│   │   ├── xyz.png
│   │   ├── ...
├── archives
│   ├── <release-name.tar.gz>
│   ├── <release-name.tar.gz>
│   ├── ...
```

## Scenarios and solutions

- When certain object has updated after the release is created.

## Usage

```bash
# plan a new release
farm plan release

# update a specific job
farm replace job <job-name>

# finalize the release, rename output files as expected, move to dist folder
farm harvest release <release-name>

# kill job(s) with a specific query
farm kill jobs <query>

# cancel job(s) with a specific query from a specific release
farm kill release.jobs <query>

# push a prior independent job to the farm
farm seed job [file] <job-name>

# archive a release
farm archive release <release-name>

# reset the farm, clean up all the history
farm slash-and-burn
```
