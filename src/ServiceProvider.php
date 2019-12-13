<?php

namespace Rias\LinkIt;

use Illuminate\Support\Facades\Validator;
use Statamic\Providers\AddonServiceProvider;

class ServiceProvider extends AddonServiceProvider
{
    protected $modifiers = [
        LinkItModifier::class,
    ];

    protected $fieldtypes = [
        LinkItFieldtype::class,
    ];

    protected $scripts = [
        __DIR__.'/../dist/js/link-it.js',
    ];

    /**
     * Bootstrap the application services.
     *
     * @return void
     */
    public function boot()
    {
        parent::boot();

        $this->loadTranslationsFrom(__DIR__.'/../resources/lang', 'link-it');

        Validator::extend(
            'link_it',
            function ($attribute, $value, $parameters, \Illuminate\Validation\Validator $validator) {
                $required = $parameters[0] === 'required';

                switch ($value['type']) {
                    case 'url':
                        if (!$required && empty($value['url'])) {
                            return true;
                        }

                        if ($required && empty($value['url'])) {
                            $validator->errors()->add($attribute, trans('addons.LinkIt::messages.required', ['attribute' => trans('addons.LinkIt::fieldtype.url')]));

                            return true;
                        }

                        if (!$this->validateUrl($value['url'])) {
                            $validator->errors()->add($attribute, trans('addons.LinkIt::messages.url', ['attribute' => trans('addons.LinkIt::fieldtype.url')]));

                            return true;
                        }
                        break;
                    case 'email':
                        if (!$required && empty($value['url'])) {
                            return true;
                        }

                        if ($required && empty($value['url'])) {
                            $validator->errors()->add($attribute, trans('addons.LinkIt::messages.required', ['attribute' => trans('addons.LinkIt::fieldtype.email')]));

                            return true;
                        }

                        if (filter_var($value['url'], FILTER_VALIDATE_EMAIL) === false) {
                            $validator->errors()->add($attribute, trans('addons.LinkIt::messages.email', ['attribute' => trans('addons.LinkIt::fieldtype.email')]));

                            return true;
                        }
                        break;
                    default:
                        if ($required && (
                                empty($value['url'])
                                && empty($value['asset'])
                                && empty($value['page'])
                                && empty($value['term'])
                                && empty($value['entry'])
                            )
                        ) {
                            $validator->errors()->add($attribute, trans('addons.LinkIt::messages.required', ['attribute' => 'LinkIt']));

                            return true;
                        }
                        break;
                }

                return true;
            }
        );
    }

    /**
     * Validate that an attribute is a valid URL.
     *
     * @param mixed $value
     *
     * @return bool
     */
    protected function validateUrl($value)
    {
        if (!is_string($value)) {
            return false;
        }
        /*
         * This pattern is derived from Symfony\Component\Validator\Constraints\UrlValidator (2.7.4).
         *
         * (c) Fabien Potencier <fabien@symfony.com> http://symfony.com
         */
        $pattern = '~^
            ((aaa|aaas|about|acap|acct|acr|adiumxtra|afp|afs|aim|apt|attachment|aw|barion|beshare|bitcoin|blob|bolo|callto|cap|chrome|chrome-extension|cid|coap|coaps|com-eventbrite-attendee|content|crid|cvs|data|dav|dict|dlna-playcontainer|dlna-playsingle|dns|dntp|dtn|dvb|ed2k|example|facetime|fax|feed|feedready|file|filesystem|finger|fish|ftp|geo|gg|git|gizmoproject|go|gopher|gtalk|h323|ham|hcp|http|https|iax|icap|icon|im|imap|info|iotdisco|ipn|ipp|ipps|irc|irc6|ircs|iris|iris.beep|iris.lwz|iris.xpc|iris.xpcs|itms|jabber|jar|jms|keyparc|lastfm|ldap|ldaps|magnet|mailserver|mailto|maps|market|message|mid|mms|modem|ms-help|ms-settings|ms-settings-airplanemode|ms-settings-bluetooth|ms-settings-camera|ms-settings-cellular|ms-settings-cloudstorage|ms-settings-emailandaccounts|ms-settings-language|ms-settings-location|ms-settings-lock|ms-settings-nfctransactions|ms-settings-notifications|ms-settings-power|ms-settings-privacy|ms-settings-proximity|ms-settings-screenrotation|ms-settings-wifi|ms-settings-workplace|msnim|msrp|msrps|mtqp|mumble|mupdate|mvn|news|nfs|ni|nih|nntp|notes|oid|opaquelocktoken|pack|palm|paparazzi|pkcs11|platform|pop|pres|prospero|proxy|psyc|query|redis|rediss|reload|res|resource|rmi|rsync|rtmfp|rtmp|rtsp|rtsps|rtspu|secondlife|s3|service|session|sftp|sgn|shttp|sieve|sip|sips|skype|smb|sms|smtp|snews|snmp|soap.beep|soap.beeps|soldat|spotify|ssh|steam|stun|stuns|submit|svn|tag|teamspeak|tel|teliaeid|telnet|tftp|things|thismessage|tip|tn3270|turn|turns|tv|udp|unreal|urn|ut2004|vemmi|ventrilo|videotex|view-source|wais|webcal|ws|wss|wtai|wyciwyg|xcon|xcon-userid|xfire|xmlrpc\.beep|xmlrpc.beeps|xmpp|xri|ymsgr|z39\.50|z39\.50r|z39\.50s))://                                 # protocol
            (([\pL\pN-]+:)?([\pL\pN-]+)@)?          # basic auth
            (
                ([\pL\pN\pS\-\.])+(\.?([\pL]|xn\-\-[\pL\pN-]+)+\.?) # a domain name
                    |                                              # or
                \d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}                 # an IP address
                    |                                              # or
                \[
                    (?:(?:(?:(?:(?:(?:(?:[0-9a-f]{1,4})):){6})(?:(?:(?:(?:(?:[0-9a-f]{1,4})):(?:(?:[0-9a-f]{1,4})))|(?:(?:(?:(?:(?:25[0-5]|(?:[1-9]|1[0-9]|2[0-4])?[0-9]))\.){3}(?:(?:25[0-5]|(?:[1-9]|1[0-9]|2[0-4])?[0-9])))))))|(?:(?:::(?:(?:(?:[0-9a-f]{1,4})):){5})(?:(?:(?:(?:(?:[0-9a-f]{1,4})):(?:(?:[0-9a-f]{1,4})))|(?:(?:(?:(?:(?:25[0-5]|(?:[1-9]|1[0-9]|2[0-4])?[0-9]))\.){3}(?:(?:25[0-5]|(?:[1-9]|1[0-9]|2[0-4])?[0-9])))))))|(?:(?:(?:(?:(?:[0-9a-f]{1,4})))?::(?:(?:(?:[0-9a-f]{1,4})):){4})(?:(?:(?:(?:(?:[0-9a-f]{1,4})):(?:(?:[0-9a-f]{1,4})))|(?:(?:(?:(?:(?:25[0-5]|(?:[1-9]|1[0-9]|2[0-4])?[0-9]))\.){3}(?:(?:25[0-5]|(?:[1-9]|1[0-9]|2[0-4])?[0-9])))))))|(?:(?:(?:(?:(?:(?:[0-9a-f]{1,4})):){0,1}(?:(?:[0-9a-f]{1,4})))?::(?:(?:(?:[0-9a-f]{1,4})):){3})(?:(?:(?:(?:(?:[0-9a-f]{1,4})):(?:(?:[0-9a-f]{1,4})))|(?:(?:(?:(?:(?:25[0-5]|(?:[1-9]|1[0-9]|2[0-4])?[0-9]))\.){3}(?:(?:25[0-5]|(?:[1-9]|1[0-9]|2[0-4])?[0-9])))))))|(?:(?:(?:(?:(?:(?:[0-9a-f]{1,4})):){0,2}(?:(?:[0-9a-f]{1,4})))?::(?:(?:(?:[0-9a-f]{1,4})):){2})(?:(?:(?:(?:(?:[0-9a-f]{1,4})):(?:(?:[0-9a-f]{1,4})))|(?:(?:(?:(?:(?:25[0-5]|(?:[1-9]|1[0-9]|2[0-4])?[0-9]))\.){3}(?:(?:25[0-5]|(?:[1-9]|1[0-9]|2[0-4])?[0-9])))))))|(?:(?:(?:(?:(?:(?:[0-9a-f]{1,4})):){0,3}(?:(?:[0-9a-f]{1,4})))?::(?:(?:[0-9a-f]{1,4})):)(?:(?:(?:(?:(?:[0-9a-f]{1,4})):(?:(?:[0-9a-f]{1,4})))|(?:(?:(?:(?:(?:25[0-5]|(?:[1-9]|1[0-9]|2[0-4])?[0-9]))\.){3}(?:(?:25[0-5]|(?:[1-9]|1[0-9]|2[0-4])?[0-9])))))))|(?:(?:(?:(?:(?:(?:[0-9a-f]{1,4})):){0,4}(?:(?:[0-9a-f]{1,4})))?::)(?:(?:(?:(?:(?:[0-9a-f]{1,4})):(?:(?:[0-9a-f]{1,4})))|(?:(?:(?:(?:(?:25[0-5]|(?:[1-9]|1[0-9]|2[0-4])?[0-9]))\.){3}(?:(?:25[0-5]|(?:[1-9]|1[0-9]|2[0-4])?[0-9])))))))|(?:(?:(?:(?:(?:(?:[0-9a-f]{1,4})):){0,5}(?:(?:[0-9a-f]{1,4})))?::)(?:(?:[0-9a-f]{1,4})))|(?:(?:(?:(?:(?:(?:[0-9a-f]{1,4})):){0,6}(?:(?:[0-9a-f]{1,4})))?::))))
                \]  # an IPv6 address
            )
            (:[0-9]+)?                              # a port (optional)
            (/?|/\S+|\?\S*|\#\S*)                   # a /, nothing, a / with something, a query or a fragment
        $~ixu';

        return preg_match($pattern, $value) > 0;
    }
}
