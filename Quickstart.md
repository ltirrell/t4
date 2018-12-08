This page is a five-minute introduction to T4.

## Data packages
The core concept in T4 is that of a **data package**. A data package is a logically self contained group of files which provide some unit of value.

For example, suppose that you are a data scientist analyzing October sales at an apparel store. Your code might depend on the following set of files:

```bash
october-2018-clothing-sales
    sales-snapshot-11-01.parquet
    sales-snapshot-11-02.parquet
    ...
    sales-snapshot-11-31.parquet    
```

T4 allows you to create, edit, and distribute groups of files like this one as a single cohesive group&mdash;a data package. This gives your data a host of useful properties:

* **modularization**&mdash;data packages allow you express your data dependencies the same way you express your code dependencies: in groups of functional, well-documented modules
* **versioning**&mdash;data packages provide version control for data
* **reproducibility**&mdash;data packages are immutable and persistent, ensuring continuous reproducibility
* **accessibility**&mdash;anyone with access to your T4 instance can browse, explore, download, and even reuse your data package


## Before you begin
To get started, you will first need to [install the `t4` Python package](./Installation.md). Then import it:


```python
import t4
```

For demo purposes we will use a small dataset tracking an 1851 hurricane in the Atlantic Ocean, which we'll persist to disk immediately:

```python
import pandas as pd
data = pd.DataFrame({
    'id': ['AL011851']*5,
    'name': ['Unnamed']*5,
    'date': [f'1851-06-25 {hr}:00:00' for hr in 
             ['00', '06', '12', '18', '21']],
    'status_of_system': ['HU']*5,
    'latitude': [28.0, 28.0, 28.0, 28.1, 28.2],
    'longitude': [-94.8, -95.4, -96.0, -96.5, -96.8]
})
data.to_csv("atlantic-storm.csv")
```


## Creating a package

To initialize an in-memory data package, use the `Package` constructor:

```python
# define a package
p = t4.Package()
```

Use `set` to add a file to a package, or `set_dir` to add an entire folder all at once:

```python
# add a file
p.set('storms/atlantic-storm.csv', "atlantic-storm.csv")
# add a folder
p.set_dir('resources/', './')
```

You can point a package key at any local file or S3 key.

Packages support metadata on data nodes (directories too):


```python
# define metadata at set time
p.set('storms/atlantic-storm.csv', 'atlantic-storm.csv', meta={'ocean':'atlantic'})

# define it later, uses dictionary access, from the next section
p['storms']['atlantic-storms.csv'].set_meta({'ocean': 'atlantic'})
```

Packages mimic `dict` objects in their behavior. So to introspect a package, key into it using a path fragment:

```bash
p['storms']  # outputs just "atlantic-storms.csv"
```


You can interact with directories and files inside of a package once you're at their key. For example, use `get_meta` to get the metadata:


```python
p['storms/atlantic-storms.csv'].get_meta()
# outputs {'side': 'atlantic'}
```


Use `fetch` to download the data to a file or a directory:


```python
p['storms/atlantic-storms.csv'].fetch('another-copy-of-storms.csv')
```


You can also load certain types of entries directly into memory:


```python
p['storms/atlantic-storms.csv']()
# outputs <pandas.DataFrame at ...>
```

## Consuming packages

So far we've seen how to create packages and how to consume resources inside of packages. Now let's look at how to consume the packages themselves.

Suppose that you've create a package and want to share it with the rest of your team. T4 makes this easy by providing you with a **catalog**. A T4 catalog sits on top of an S3 bucket and allows anyone with access to that bucket to see, push, and download packages in that bucket.

To send a package to a catalog, use `push` (note: the large number of progress bars are a bug that we are working to fix):


```python
p.push('example/package', f'{bucket_name}')
```

    <t4.packages.Package at 0x11f8516a0>



`push` grabs your package and sends it and all of its data up to the catalog. Everyone with access to that catalog can now see and download this package and data from that catalog.

Alternatively, you may wish to save a package locally (we call this the local catalog). This is `build`, which is a much faster operation because it doesn't necessitate moving data.


```python
p.build('example/package')
```




    '43f3816c2ac87ef3cf943c7bc5a6be69985fcac200cc47db4f9e3b741f9dbe24'



To see a list of packages available locally or remotely, use `list_packages`:


```python
t4.list_packages()
```




    ['example/package', 'foo/bar']




```python
t4.list_packages(bucket_name)
```




    ['aics/pipeline',
     'akarve/test',
     'akave/t4test',
     'ay/lmao-redux',
     'dima/tmp2',
     'eode/testing_package',
     'example/package']



To download a package and all of its data from a remote catalog, `install` it.


```python
# to a temporary folder for demo purposes
p = t4.Package.install('example/package', bucket_name, dest='temp/')
p
```


    <t4.packages.Package at 0x117164f98>




```python
!rm -rf temp/
```

You can also choose to download just the package **manifest** without downloading the data files it references. The manifest is a simple JSON file that is independent of the actual package data, but stores pointers to and metadata about it. To load a package from a local or remote catalog, use the extremely fast static `browse` method:


```python
p = t4.Package.browse('example/package', bucket_name)
p
```




    <t4.packages.Package at 0x117168470>



`browse` is particularly benefitial when you are working with large packages that you only need parts of at a time; and when working with packages containing many subpackages. In those cases you can `browse`, then `fetch` to get data of interest:


```python
p = t4.Package.browse('example/package', bucket_name)
p['resources'].fetch('temp/')
```

```python
!rm -rf temp/
```