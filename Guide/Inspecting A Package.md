To pull just the manifest from a published package, use  `browse`. You can then download specific files and subdirectories of the package using `fetch`:

	# load the package from the registry
	p = t4.Package.browse("username/packagename", registry="s3://name-of-your-t4-bucket")

	# download everything from a package
	p.fetch("/", "target/directory/")

	# download a specific entry from a package
	p.fetch("foo.parquet", "target/directory/foo.parquet")
