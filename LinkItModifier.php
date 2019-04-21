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
        $prefix = $link['type'] === 'email' ? 'mailto:' : ($link['type'] === 'tel' ? 'tel:' : '');
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
            return Term::find($link['term'][0])->slug();
        }

        if (isset($link['page'])) {
            return Page::find($link['page'][0])->get('title');
        }

        if (isset($link['entry'])) {
            return Entry::find($link['entry'][0])->get('title');
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
            $url = Asset::find($link['asset'][0])->url();
        }

        if (isset($link['term'])) {
            $url = Term::find($link['term'][0])->url();
        }

        if (isset($link['page'])) {
            $url = Page::find($link['page'][0])->url();
        }

        if (isset($link['entry'])) {
            $url = Entry::find($link['entry'][0])->url();
        }

        return $url.($link['append'] ?? '');
    }

    protected function getTarget($link)
    {
        return isset($link['newWindow']) && $link['newWindow'] ? '_BLANK' : '_SELF';
    }
}
