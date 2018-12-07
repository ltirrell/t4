In the sections ["Creating A Package""](./Creating A Package.md) and ["Installing A Package"](./Installing A Package), we saw how to create a package from scratch and how to download a package from somewhere else, respectively.

Once you have a package it's easy to introspect it. Suppose we have the following example package:

```python
import t4
p = (t4.Package()
        .set("trades.parquet", "trades.parquet")
        .set("commodities/gold.csv", "gold.csv")
        .set("commodities/silver.csv", "silver.csv")
    )
```

To dig into a package tree:

```
$ python
>>> p["trades.parquet"]
<<< PackageEntry("trades.parquet")

>>> p["commodities"]
<<< gold.csv
    silver.csv
```

Slicing into a `Package` directory returns another `Package` rooted at that subdirectory. Slicing into a package entry returns an individual `PackageEntry`.

To download a subset of files from a package directory to a `dest`, use `fetch`:

```python
# download a subfolder
p["commodities"].fetch("<dest>")

# download a file
p["commodities"]["gold.csv"].fetch("<dest>")

# download everything
p.fetch("<dest>")
```

Alternatively, you can download data directly into memory using `deserialize`:

```
$ python
>>> df = p["commodities"]["gold.csv"]()
>>> df
<<< <pandas.DataFrame object at ...>
```

To read the metadata for a file or folder use `get_meta`:

```python
p["commodities"]["gold.csv"].get_meta()
```


To pull just the manifest from a published package, use  `browse`. You can then download specific files and subdirectories of the package using `fetch`:

	# load the package from the registry
	p = t4.Package.browse("username/packagename", registry="s3://name-of-your-t4-bucket")

	# download everything from a package
	p.fetch("/", "target/directory/")

	# download a specific entry from a package
	p.fetch("foo.parquet", "target/directory/foo.parquet")
