T4 allows you to create, read, and write packages both on your local filesystem and on S3 buckets configured to work with T4. For convenience, we provide a simple API for working with S3 buckets that serves as an alternative to [boto3](https://boto3.amazonaws.com/v1/documentation/api/latest/index.html).


## Connecting
To connect to an S3 `Bucket`:

```python
b = t4.Bucket("s3://my-bucket")
```

This requires that the bucket is configured to work with T4.


## Introspecting
To see the contents of a `Bucket`, use `keys`:

```
$ python
>>> b.keys()
<<< [...a list of objects in the bucket...]
```


## Reading
To download a file or folder from a bucket use `fetch`:

```python
b.fetch("path/to/directory", "path/to/local")
b.fetch("path/to/file", "path/to/local")
```

To read a file or folder out of a bucket directly into memory use `deserialize`:

```python
obj = b.deserialize("path/to/file")
obj = b("path/to/file")  # sugar
```

To read the metadata on an object, use `get_meta`:

```python
meta = b.get_meta("path/to/file")
```


## Writing
You can also go the other way and write data to a bucket.

```python
# put a file to a bucket
b.put_file("foo.csv", "/path/to/local/disk/foo.csv")
# with metadata
b.put_file("foo.csv", "/path/to/local/disk/foo.csv", meta={"foo": "bar"})

# put an in-memory object to a bucket
b.put("my-dict.json", {"a": "b"})
# with metadata
b.put("my-dict.json", {"a": "b"}, meta={"how": "lazily"})

# or put everything in a directory at once
b.put_dir("stuff", "/path/to/folder/with/stuff/", meta={"origin": "unknown"})
```

Note that `set` operations on a `Package` are `put` operations on a `Bucket`.


## Searching
You can search for individual objects using `search`.

TODO