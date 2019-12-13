![Icon](icon.svg)

[![Latest Version](https://img.shields.io/github/release/riasvdv/statamic-linkit.svg?style=flat-square)](https://github.com/riasvdv/statamic-linkit/releases)
[![Quality Score](https://img.shields.io/scrutinizer/g/riasvdv/statamic-linkit.svg?style=flat-square)](https://scrutinizer-ci.com/g/riasvdv/statamic-linkit)
[![StyleCI](https://styleci.io/repos/182076674/shield)](https://styleci.io/repos/182076674)

# LinkIt plugin for Statamic

A fieldtype to link to anything.

![Screenshot](docs/img/screenshot.png)

## License

LinkIt requires a license to be used while on a production site.  
You can purchase one at https://statamic.com/marketplace/addons/link-it.

You may use LinkIt without a license while Statamic is in [Trial mode](https://docs.statamic.com/knowledge-base/trial-mode).

## Installation

Require it using Composer.

```
composer require rias/statamic-link-it
```

Publish the assets:

```
php artisan vendor:publish --provider="Rias\LinkIt\ServiceProvider"
```

## Using LinkIt

[Read the documentation](https://github.com/riasvdv/statamic-linkit/blob/master/DOCUMENTATION.md)

Brought to you by [Rias](https://rias.be)
