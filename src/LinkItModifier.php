<?php

namespace Rias\LinkIt;

use Statamic\Facades\Asset;
use Statamic\Facades\Entry;
use Statamic\Facades\Term;
use Statamic\Modifiers\Modifier;

class LinkItModifier extends Modifier
{
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
            $asset = Asset::find($link['asset'][0]);

            if (!$asset) {
                return '';
            }

            return $asset->get('title', $asset->filename());
        }
        if (isset($link['term'])) {
            $term = Term::find($link['term'][0]);

            if (!$term) {
                return '';
            }

            $term->locale(app()->getLocale());

            return $term->slug();
        }

        if (isset($link['entry'])) {
            $entry = Entry::find($link['entry'][0]);

            if (!$entry) {
                return '';
            }

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

            if ($asset) {
                $asset->locale(app()->getLocale());
                $url = $asset->url();
            }
        }

        if (isset($link['term'])) {
            $term = Term::find($link['term'][0]);

            if ($term) {
                $term->locale(app()->getLocale());
                $url = $term->url();
            }
        }

        if (isset($link['entry'])) {
            $entry = Entry::find($link['entry'][0]);

            if ($entry) {
                $entry->locale(app()->getLocale());
                $url = $entry->url();
            }
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
