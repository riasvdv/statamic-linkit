<?php

namespace Statamic\Addons\LinkIt;

use Statamic\Extend\Fieldtype;

class LinkItFieldtype extends Fieldtype
{
    /**
     * Pre-process the data before it gets sent to the publish page.
     *
     * @param mixed $data
     *
     * @return array|mixed
     */
    public function preProcess($data)
    {
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
        if ($data) {
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
                'append',
            ]));
        }

        return $data;
    }
}
