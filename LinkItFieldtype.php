<?php

namespace Statamic\Addons\LinkIt;

use Statamic\API\AssetContainer;
use Statamic\API\Collection;
use Statamic\API\Taxonomy;
use Statamic\Extend\Fieldtype;

class LinkItFieldtype extends Fieldtype
{
    /**
     * The blank/default value.
     *
     * @return array
     */
    public function blank()
    {
    }

    /**
     * Pre-process the data before it gets sent to the publish page.
     *
     * @param mixed $data
     *
     * @return array|mixed
     */
    public function preProcess($data)
    {
        $data['taxonomies'] = $this->getFieldConfig('taxonomies', Taxonomy::all()->keys()->toArray());
        $data['containers'] = $this->getFieldConfig('containers', AssetContainer::all()->keys()->toArray());
        $data['collections'] = $this->getFieldConfig('collections', Collection::all()->keys()->toArray());

        return $data;
    }

    public function rules()
    {
        return 'link_it:'.($this->getFieldConfig('required') ? 'required' : 'nullable');
    }

    /**
     * Process the data before it gets saved.
     *
     * @param mixed $data
     *
     * @return array|mixed
     */
    public function process($data)
    {
        $data = array_filter(array_only($data, [
            'type',
            'url',
            'newWindow',
            'container',
            'asset',
            'taxonomy',
            'term',
            'page',
            'collection',
            'entry',
            'user',
            'text',
            'aria',
            'title',
        ]));

        return $data;
    }
}
