<?php

namespace Rias\LinkIt;

use Illuminate\Support\Arr;
use Statamic\Fields\Fieldtype;

class LinkItFieldtype extends Fieldtype
{
    protected $icon = 'external-link';
    protected $categories = ['text', 'media', 'relationship'];

    protected $configFields = [
        'types' => [
            'type'     => 'select',
            'multiple' => true,
            'display'  => 'Available types',
            'options'  => [
                'asset'  => 'Asset',
                'entry'  => 'Entry',
                'custom' => 'Custom',
                'email'  => 'Email',
                'term'   => 'Term',
                'tel'    => 'Tel',
                'url'    => 'Url',
            ],
            'default' => ['asset', 'entry', 'custom', 'email', 'term', 'tel', 'url'],
        ],
        'newWindow' => [
            'type'         => 'toggle',
            'width'        => 50,
            'instructions' => 'Give editors the option to open the links in a new window.',
        ],
        'text' => [
            'type'         => 'toggle',
            'width'        => 50,
            'instructions' => 'Add a custom text field.',
        ],
        'aria' => [
            'type'         => 'toggle',
            'width'        => 50,
            'instructions' => 'Add a field to enter aria information.',
        ],
        'append' => [
            'type'         => 'toggle',
            'width'        => 50,
            'instructions' => 'Add a field to append something to a dynamically generated url.',
        ],
        'collections' => [
            'type'         => 'collections',
            'instructions' => 'Select the available collections.',
        ],
        'containers' => [
            'type'         => 'asset_container',
            'instructions' => 'Select the available asset containers.',
        ],
        'taxonomies' => [
            'type'         => 'taxonomies',
            'instructions' => 'Select the available taxonomies.',
        ],
    ];

    public function extraRules(): array
    {
        return [
            'link_it:'.($this->config('required') ? 'required' : 'nullable'),
        ];
    }

    protected function configFieldItems(): array
    {
        return array_map(function ($fieldConfig) {
            if (isset($fieldConfig['instructions'])) {
                $fieldConfig['instructions'] = __('link-it::config.'.$fieldConfig['instructions']);
            }

            return $fieldConfig;
        }, $this->configFields);
    }

    public function process($data)
    {
        if ($data) {
            $data = array_filter(Arr::only($data, [
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

    public function preProcessIndex($data)
    {
        $modifier = new LinkItModifier();

        if (!isset($data['type'])) {
            return;
        }

        return ucfirst($data['type']).': '.$modifier->index($data, ['text'], []);
    }
}
