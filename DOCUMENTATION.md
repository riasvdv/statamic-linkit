# LinkIt Docs

Link to anything and everything!

---

## Installing

- Unzip and place the LinkIt directory into /site/addons.
- You're done!

## Usage

Add the fieldtype to your fieldset by using the `link_it` handle. The most basic configuration is the following:

```yaml
fields:
  link:
    type: link_it
```

Content editors can then choose from all the following types:
- url
![url](https://github.com/Rias500/statamic-linkit/raw/master/resources/assets/img/url.png)

- custom
![custom](https://github.com/Rias500/statamic-linkit/raw/master/resources/assets/img/custom.png)

- email
![email](https://github.com/Rias500/statamic-linkit/raw/master/resources/assets/img/email.png)

- tel
![tel](https://github.com/Rias500/statamic-linkit/raw/master/resources/assets/img/tel.png)

- asset
![asset](https://github.com/Rias500/statamic-linkit/raw/master/resources/assets/img/asset.png)

- taxonomy
![taxonomy](https://github.com/Rias500/statamic-linkit/raw/master/resources/assets/img/taxonomy.png)

- page
![page](https://github.com/Rias500/statamic-linkit/raw/master/resources/assets/img/page.png)

- collection
![collection](https://github.com/Rias500/statamic-linkit/raw/master/resources/assets/img/collection.png)


You can configure which types are allowed by adding a `types` setting to your fieldtype.

## Settings
This fieldtype supports the following settings. The default value is shown in the example.

### Required
`bool` - Whether this field is required

```yaml
fields:
  link:
    type: link_it
    required: false
```

### Types
`array` - A set of types which content managers can choose from.

```yaml
fields:
  link:
    type: link_it
    types:
      - asset
      - collection
      - custom
      - email
      - page
      - taxonomy
      - tel
      - url
```

### NewWindow
`bool` - Whether to give the choice to have links opened in a new window.

```yaml
fields:
  link:
    type: link_it
    newWindow: false
```

### Text
`bool` - Whether to allow a custom link text. (For example "Read more")

```yaml
fields:
  link:
    type: link_it
    text: false
```

### Aria
`bool` - Whether to allow control over the `aria-label`.

```yaml
fields:
  link:
    type: link_it
    aria: false
```

### Title
`bool` - Whether to allow control over the link `title`.

```yaml
fields:
  link:
    type: link_it
    title: false
```

### Collections
`array` - By default, all collections can be chosen from the dropdown to link to. This allows you to limit them.

```yaml
fields:
  link:
    type: link_it
    collections:
      - blog
```

### Containers
`array` - By default, all asset containers can be chosen from the dropdown to link to. This allows you to limit them.

```yaml
fields:
  link:
    type: link_it
    containers:
      - documents
```

### Taxonomies
`array` - By default, all taxonomies can be chosen from the dropdown to link to. This allows you to limit them.

```yaml
fields:
  link:
    type: link_it
    taxonomies:
      - blog_categories
```

## The modifier

For easy usage, LinkIt comes with a modifier to generate a link tag or extract the necessary information.

### Generate a link tag
```
{{ link | link_it }}
```

### Get the link target
```
{{ link | link_it:target }}
```

### Get the link text
```
{{ link | link_it:text }}
```

### Get the link url
```
{{ link | link_it:url }}
```

### Get the link title
```
{{ link | link_it:title }}
```

### Get the link aria label
```
{{ link | link_it:aria }}
```