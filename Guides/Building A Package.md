Once you've created a Package you're happy with, it's time to build it.

To save a local package to disk use `build`.

```python
import t4
# create an (empty) package
p = t4.Package()
# build it
tophash = p.build("username/packagename")
```

Building a package requires providing it with a name. Packages names must follow the `<authorname>/<packagename>` format.

To rebuild or update a package, just run `build` again.

Successfully built packages return a **tophash**.

```python
print(t4.Package().build("username/packagename"))

'2a5a67156ca9238c14d12042db51c5b52260fdd5511b61ea89b58929d6e1769b'
```

A tophash is to a data package what a git hash is to a code package, or a Docker hash to an environment: a persistent, immutable reference to a specific version of a package.

If you `build` a package multiple times, with different data each time, you will get multiple different tophashes. In the future, to refer to a _specific version_ of a package, just refer to that tophash.
