<?php

namespace Statamic\Addons\LinkIt;

use Statamic\API\Asset;
use Statamic\API\Entry;
use Statamic\API\Page;
use Statamic\API\Term;
use Statamic\Extend\Modifier;

class LinkItModifier extends Modifier
{
    /**
     * Modify a value.
     *
     * @param mixed $link    The value to be modified
     * @param array $params  Any parameters used in the modifier
     * @param array $context Contextual values
     *
     * @return mixed
     */
    public function index($link, $params, $context)
    {
        if (!count($params)) {
            return $this->getLink($link);
        }

        if ($params[0] === 'text') {
            return $this->getText($link);
        }

        if ($params[0] === 'url') {
            return $this->getUrl($link);
        }

        if ($params[0] === 'target') {
            return $this->getTarget($link);
        }

        if ($params[0] === 'aria') {
            return $link['aria'] ?? '';
        }

        if ($params[0] === 'title') {
            return $link['title'] ?? '';
        }

        return $link;
    }

    protected function getLink($link)
    {
        switch ($link['type']) {
            case 'email':
                $prefix = 'mailto:';
                break;
            case 'tel':
                $prefix = 'tel:';
                break;
            default:
                $prefix = '';
                break;
        }

        $return = "<a href='{$prefix}{$this->getUrl($link)}' target='{$this->getTarget($link)}' ";
        if (isset($link['title'])) {
            $return .= "title='{$link['title']}' ";
        }

        if (isset($link['aria'])) {
            $return .= "aria-label='{$link['aria']}' ";
        }

        if (isset($link['newWindow']) && $link['newWindow']) {
            $return .= "target='_blank' ";
        }

        $return .= ">{$this->getText($link)}</a>";

        return $return;
    }

    protected function getText($link)
    {
        if (isset($link['text'])) {
            return $link['text'];
        }

        if (isset($link['asset'])) {
            return Asset::find($link['asset'][0])->get('title', Asset::find($link['asset'][0])->filename());
        }
        if (isset($link['term'])) {
            $term = Term::find($link['term'][0]);
            $term->locale(app()->getLocale());
            return $term->slug();
        }

        if (isset($link['page'])) {
            $page = Page::find($link['page'][0]);
            $page->locale(app()->getLocale());
            return $page->get('title');
        }

        if (isset($link['entry'])) {
            $entry = Entry::find($link['entry'][0]);
            $entry->locale(app()->getLocale());
            return $entry->get('title');
        }

        return $this->getUrl($link);
    }

    protected function getUrl($link)
    {
        $url = '';

        if (isset($link['url'])) {
            $url = $link['url'];
        }

        if (isset($link['asset'])) {
            $asset = Asset::find($link['asset'][0]);
            $asset->locale(app()->getLocale());
            $url = $asset->url();
        }

        if (isset($link['term'])) {
            $term = Term::find($link['term'][0]);
            $term->locale(app()->getLocale());
            $url = $term->url();
        }

        if (isset($link['page'])) {
            $page = Page::find($link['page'][0]);
            $page->locale(app()->getLocale());
            $url = $page->url();
        }

        if (isset($link['entry'])) {
            $entry = Entry::find($link['entry'][0]);
            $entry->locale(app()->getLocale());
            $url = $entry->url();
        }

        return $url.($link['append'] ?? '');
    }

    protected function getTarget($link)
    {
        return isset($link['newWindow']) && $link['newWindow'] ? '_BLANK' : '_SELF';
    }

    protected function getType($link)
    {
        return $link['type'];
    }
}
