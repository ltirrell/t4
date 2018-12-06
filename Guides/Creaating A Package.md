To create a new in-memory package you initialize a new Package object and then perform operations on it until you have the Package you want. For example:

	import t4
	# initialize a package
	p = t4.Package()

	# add entries individually using `set`
	p = p.set("foo.csv", "/path/to/local/disk/foo.csv")
	p = p.set("bar.csv", "s3://bucket/path/to/cloud/bar.csv")

	# add many entries at once using `update`
	p = p.update({"baz.csv": "/path/to/baz", "bam.png": "/path/to/bam"})

	# or grab everything in a directory at once using set_dir
	p = p.set_dir("stuff", "/path/to/folder/with/stuff/")

	# delete entries using `delete`
	p = p.delete("bam.png")