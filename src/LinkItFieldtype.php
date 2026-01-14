<?php

namespace Rias\LinkIt;

use Illuminate\Container\Container;
use Illuminate\Support\Arr;
use Statamic\Facades\AssetContainer;
use Statamic\Facades\Collection;
use Statamic\Facades\Taxonomy;
use Statamic\Fields\Field;
use Statamic\Fields\Fieldtype;
use Statamic\Support\Str;

class LinkItFieldtype extends Fieldtype
{
    protected $icon = 'link';
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
            return $data;
        }

        return ucfirst($data['type']).': '.$modifier->index($data, ['text'], []);
    }

    public function preload(): array
    {
        $fieldConfig = $this->field()->config();
        $value = $this->field()->value();

        return [
            'collections' => Collection::all()
                ->whereIn('handle', $fieldConfig['collections'] ?? [])
                ->map(function (\Statamic\Entries\Collection $collection) use ($value) {
                    $field = $this->nestedEntriesFieldtype(
                        $collection,
                        $value && $value['type'] === 'entry' && $value['collection'] === $collection->handle()
                            ? ($value['entry'] ?? null)
                            : null,
                    );

                    return [
                        'value' => $collection->handle(),
                        'label' => $collection->title(),
                        'config' => $field->config(),
                        'meta' => $field->preload(),
                    ];
                })->all(),
            'containers' => AssetContainer::all()
                ->whereIn('handle', $fieldConfig['containers'] ?? [])
                ->map(function (\Statamic\Assets\AssetContainer $container) use ($value) {
                    $field = $this->nestedAssetsFieldtype(
                        $container,
                        $value && $value['type'] === 'asset' && $value['container'] === $container->handle()
                            ? ($value['asset'] ?? null)
                            : null,
                    );

                    return [
                        'value' => $container->handle(),
                        'label' => $container->title(),
                        'config' => $field->config(),
                        'meta' => $field->preload(),
                    ];
                })->all(),
            'taxonomies' => Taxonomy::all()
                ->whereIn('handle', $fieldConfig['taxonomies'] ?? [])
                ->map(function (\Statamic\Taxonomies\Taxonomy $taxonomy) use ($value) {
                    $field = $this->nestedTermsFieldtype(
                        $taxonomy,
                        $value && $value['type'] === 'term' && $value['taxonomy'] === $taxonomy->handle()
                            ? ($value['term'] ?? null)
                            : null,
                    );

                    return [
                        'value' => $taxonomy->handle(),
                        'label' => $taxonomy->title(),
                        'config' => $field->config(),
                        'meta' => $field->preload(),
                    ];
                })->all(),
        ];
    }

    private function nestedTermsFieldtype(\Statamic\Taxonomies\Taxonomy $taxonomy, mixed $value): Fieldtype
    {
        $field = (new Field('term', [
            'type' => 'terms',
            'taxonomies' => [$taxonomy->handle()],
            'max_items' => 1,
            'create' => false,
        ]));

        if (! is_null($value)) {
            $field->setValue($value);
        }

        return $field->fieldtype();
    }

    private function nestedEntriesFieldtype(\Statamic\Entries\Collection $collection, mixed $value): Fieldtype
    {
        $field = (new Field('entry', [
            'type' => 'entries',
            'collections' => [$collection->handle()],
            'max_items' => 1,
            'create' => false,
        ]));

        if (! is_null($value)) {
            $field->setValue($value);
        }

        return $field->fieldtype();
    }

    private function nestedAssetsFieldtype(\Statamic\Assets\AssetContainer $container, mixed $value): Fieldtype
    {
        $field = (new Field('asset', [
            'type' => 'assets',
            'container' => $container->handle(),
            'max_files' => 1,
            'mode' => 'list',
        ]));

        if (! is_null($value)) {
            $field->setValue($value);
        }

        return $field->fieldtype();
    }
}
