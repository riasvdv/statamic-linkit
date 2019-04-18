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

### Url
![url](https://github.com/Rias500/statamic-linkit/raw/master/resources/assets/img/url.png)

### Custom
![custom](https://github.com/Rias500/statamic-linkit/raw/master/resources/assets/img/custom.png)

### Email
![email](https://github.com/Rias500/statamic-linkit/raw/master/resources/assets/img/email.png)

### Tel
![tel](https://github.com/Rias500/statamic-linkit/raw/master/resources/assets/img/tel.png)

### Asset
![asset](https://github.com/Rias500/statamic-linkit/raw/master/resources/assets/img/asset.png)

#### Containers
`array` - You have to define the asset containers in the field settings to use this type.

```yaml
fields:
  link:
    type: link_it
    containers:
      - documents
```

### Term
![term](https://github.com/Rias500/statamic-linkit/raw/master/resources/assets/img/term.png)

#### Taxonomies
`array` - You have to define the taxonomies in the field settings to use this type.

```yaml
fields:
  link:
    type: link_it
    taxonomies:
      - blog_categories
```

### Page
![page](https://github.com/Rias500/statamic-linkit/raw/master/resources/assets/img/page.png)

### Entry
![entry](https://github.com/Rias500/statamic-linkit/raw/master/resources/assets/img/entry.png)

#### Collections
`array` - You have to define the collections in the field settings to use this type.

```yaml
fields:
  link:
    type: link_it
    collections:
      - blog
```

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
      - entry
      - custom
      - email
      - page
      - term
      - tel
      - url
```

To use the `asset`, `entry` and `term` types, please make sure you define the corresponding `containers`, `collections` and `taxonomies` settings.

### Default
`string` - Which type is selected by default

```yaml
fields:
  link:
    type: link_it
    default: url
```

### NewWindow
`bool` - Whether to give the choice to have links opened in a new window.

![New Window](https://github.com/Rias500/statamic-linkit/raw/master/resources/assets/img/new-window.png)

```yaml
fields:
  link:
    type: link_it
    newWindow: false
```

### Text
`bool` - Whether to allow a custom link text. (For example "Read more")

![Text](https://github.com/Rias500/statamic-linkit/raw/master/resources/assets/img/text.png)

```yaml
fields:
  link:
    type: link_it
    text: false
```

### Aria
`bool` - Whether to allow control over the `aria-label`.

![Aria](https://github.com/Rias500/statamic-linkit/raw/master/resources/assets/img/aria.png)

```yaml
fields:
  link:
    type: link_it
    aria: false
```

### Title
`bool` - Whether to allow control over the link `title`.

![Title](https://github.com/Rias500/statamic-linkit/raw/master/resources/assets/img/title.png)

```yaml
fields:
  link:
    type: link_it
    title: false
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