To make a remote package and all of its data available locally, `install` it.

```python
import t4
p = t4.Package.install(
    "username/packagename", 
    "s3://name-of-your-bucket",
    dest="path/to/a/file/location"
)
```

`install` starts by downloading the **package manifest**&mdash;essentially a `list` of things in the package. It then takes each file referenced by the package and downloads it to your `dest`.

Once you install a remote package it becomes a local package, available in your local registry (to learn more about registries, see the section ["Building A Package"](./Building A Package.md)).

To open a local package, use `browse`:

```python
import t4
p  = t4.Package.browse("username/packagename")
```

You can also use `browse` on a remote package:

```python
p = t4.Package.browse("username/packagename", registry="s3://name-of-your-bucket")
```

`browse` opens (if necessary, downloads) a package manifest. It does not move any data. This is advantageous (over `install`) when you don't want to download a large package all at once; you just want to see what's inside it.

To learn how to introspect a package see the next section: [Inspecting A Package](./Inspecting A Package.md).