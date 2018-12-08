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

## Creating your own package
Start by [installing the T4 Python client](./Installation.md).

Then, let's create some example data.


## OLD BELOW

## Installation

To get started, you will first need to [install the `t4` Python package](./Installation.md). Then can then import it into the environment:


```python
import t4
```

This script generates a history of Atlantic hurricanes in a `pandas` `DataFrame`:


```python
atlantic_storms.head()
```




<div>
<style scoped>
    .dataframe tbody tr th:only-of-type {
        vertical-align: middle;
    }

    .dataframe tbody tr th {
        vertical-align: top;
    }

    .dataframe thead th {
        text-align: right;
    }
</style>
<table border="1" class="dataframe">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>id</th>
      <th>name</th>
      <th>date</th>
      <th>record_identifier</th>
      <th>status_of_system</th>
      <th>latitude</th>
      <th>longitude</th>
      <th>maximum_sustained_wind_knots</th>
      <th>maximum_pressure</th>
      <th>34_kt_ne</th>
      <th>...</th>
      <th>34_kt_sw</th>
      <th>34_kt_nw</th>
      <th>50_kt_ne</th>
      <th>50_kt_se</th>
      <th>50_kt_sw</th>
      <th>50_kt_nw</th>
      <th>64_kt_ne</th>
      <th>64_kt_se</th>
      <th>64_kt_sw</th>
      <th>64_kt_nw</th>
    </tr>
    <tr>
      <th>index</th>
      <th></th>
      <th></th>
      <th></th>
      <th></th>
      <th></th>
      <th></th>
      <th></th>
      <th></th>
      <th></th>
      <th></th>
      <th></th>
      <th></th>
      <th></th>
      <th></th>
      <th></th>
      <th></th>
      <th></th>
      <th></th>
      <th></th>
      <th></th>
      <th></th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>0</th>
      <td>AL011851</td>
      <td>UNNAMED</td>
      <td>1851-06-25 00:00:00</td>
      <td>NaN</td>
      <td>HU</td>
      <td>28.0</td>
      <td>-94.8</td>
      <td>80</td>
      <td>NaN</td>
      <td>NaN</td>
      <td>...</td>
      <td>NaN</td>
      <td>NaN</td>
      <td>NaN</td>
      <td>NaN</td>
      <td>NaN</td>
      <td>NaN</td>
      <td>NaN</td>
      <td>NaN</td>
      <td>NaN</td>
      <td>NaN</td>
    </tr>
    <tr>
      <th>1</th>
      <td>AL011851</td>
      <td>UNNAMED</td>
      <td>1851-06-25 06:00:00</td>
      <td>NaN</td>
      <td>HU</td>
      <td>28.0</td>
      <td>-95.4</td>
      <td>80</td>
      <td>NaN</td>
      <td>NaN</td>
      <td>...</td>
      <td>NaN</td>
      <td>NaN</td>
      <td>NaN</td>
      <td>NaN</td>
      <td>NaN</td>
      <td>NaN</td>
      <td>NaN</td>
      <td>NaN</td>
      <td>NaN</td>
      <td>NaN</td>
    </tr>
    <tr>
      <th>2</th>
      <td>AL011851</td>
      <td>UNNAMED</td>
      <td>1851-06-25 12:00:00</td>
      <td>NaN</td>
      <td>HU</td>
      <td>28.0</td>
      <td>-96.0</td>
      <td>80</td>
      <td>NaN</td>
      <td>NaN</td>
      <td>...</td>
      <td>NaN</td>
      <td>NaN</td>
      <td>NaN</td>
      <td>NaN</td>
      <td>NaN</td>
      <td>NaN</td>
      <td>NaN</td>
      <td>NaN</td>
      <td>NaN</td>
      <td>NaN</td>
    </tr>
    <tr>
      <th>3</th>
      <td>AL011851</td>
      <td>UNNAMED</td>
      <td>1851-06-25 18:00:00</td>
      <td>NaN</td>
      <td>HU</td>
      <td>28.1</td>
      <td>-96.5</td>
      <td>80</td>
      <td>NaN</td>
      <td>NaN</td>
      <td>...</td>
      <td>NaN</td>
      <td>NaN</td>
      <td>NaN</td>
      <td>NaN</td>
      <td>NaN</td>
      <td>NaN</td>
      <td>NaN</td>
      <td>NaN</td>
      <td>NaN</td>
      <td>NaN</td>
    </tr>
    <tr>
      <th>4</th>
      <td>AL011851</td>
      <td>UNNAMED</td>
      <td>1851-06-25 21:00:00</td>
      <td>L</td>
      <td>HU</td>
      <td>28.2</td>
      <td>-96.8</td>
      <td>80</td>
      <td>NaN</td>
      <td>NaN</td>
      <td>...</td>
      <td>NaN</td>
      <td>NaN</td>
      <td>NaN</td>
      <td>NaN</td>
      <td>NaN</td>
      <td>NaN</td>
      <td>NaN</td>
      <td>NaN</td>
      <td>NaN</td>
      <td>NaN</td>
    </tr>
  </tbody>
</table>
<p>5 rows × 21 columns</p>
</div>



Which we'll also save to disk.


```python
local_filepath = f"{local_folder}atlantic-storms.csv"
atlantic_storms.to_csv(local_filepath)
```

## Creating packages

The core construct in T4 is the **data package**. A data package is a collection of individual files which are meaningful when considered as a whole. A data package includes raw data files, metadata describing the raw data files, and anything else you think is meaningful.

Data packages make it easy to share data assets across the team. We'll use the HURDAT dataset to demonstrate how they work.

To initialize an in-memory data package:


```python
p = t4.Package()
```

To add a file to a package, use `set`:


```python
p.set('storms/atlantic-storms.csv', local_filepath)
```




    <t4.packages.Package at 0x10db752b0>



To capture everything in a folder, use `set_dir`:


```python
p.set_dir('resources/', './')
```




    <t4.packages.Package at 0x10db752b0>



You can point a package key at any local file or S3 key.

Packages support metadata on data nodes (directories too):


```python
p.set('storms/atlantic-storms.csv', local_filepath, meta={'side':'atlantic'})
```




    <t4.packages.Package at 0x10db752b0>



Packages mimic `dict` objects in their behavior. So to introspect a package, key into it using a path fragment:


```python
p['storms']
```




    <t4.packages.Package at 0x11f851b70>



You can interact with directories and files inside of a pacakge once you're at their key. For example, use `get_meta` to get the metadata:


```python
p['storms/atlantic-storms.csv'].get_meta()
```




    {'side': 'atlantic'}



Use `fetch` to download the data to a file or a directory:


```python
p['storms/atlantic-storms.csv'].fetch('storms.csv')
```

And finally, `deserialize` to load a piece of data directory into memory as a Python object (this only works on subsect of objects and object types right now):


```python
# b = t4.Bucket(bucket_name)
# b.put('atlantic_storms.parquet', atlantic_storms)
# d = t4.Package().set('atlantic_storms', f'{bucket_name}/atlantic_storms.parquet')['atlantic_storms']\
#         .deserialize()
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