<template>
    <div>
        <div class="flex flex-wrap items-center">
            <v-select
                    class="w-1/5"
                    :options="types"
                    :reduce="selection => selection.value"
                    v-model="internal.type"
            />

            <!-- TAXONOMIES -->
            <v-select
                    v-if="internal.type === 'term'"
                    class="ml-2 w-1/5"
                    :options="taxonomies"
                    :reduce="selection => selection.value"
                    v-model="internal.taxonomy"
            />
            <publish-field-meta
                    v-for="(taxonomy, index) in taxonomies"
                    v-if="internal.type === 'term' && internal.taxonomy === taxonomy.value"
                    :key="index"
                    :config="{ handle: 'taxonomies', type: 'taxonomy', taxonomy: taxonomy.value }"
                    :initial-value="internal.term"
                    class="ml-2 flex-1"
            >
                <div slot-scope="{ meta, value, loading, config }">
                    <relationship-fieldtype
                            v-if="!loading"
                            :config="{ handle: 'taxonomies', type: 'taxonomy', taxonomy: taxonomy.value, mode: 'select', max_items: 1 }"
                            :value="value"
                            :meta="meta"
                            handle="taxonomies"
                            @input="internal.term = $event" />
                </div>
            </publish-field-meta>

            <!-- ASSETS -->
            <v-select
                    v-if="internal.type === 'asset'"
                    class="ml-2 w-1/5"
                    :options="containers"
                    :reduce="selection => selection.value"
                    v-model="internal.container"
            />
            <publish-field-meta
                    v-if="internal.type === 'asset' && internal.container"
                    :config='{type: "assets"}'
                    :initial-value="internal.asset"
                    :initial-meta="{container: internal.container}"
                    class="w-full assets-fieldtype mt-2"
            >
                <div slot-scope="{ meta, value, loading }">
                    <assets-fieldtype
                        v-if="!loading"
                        :config='{
                            container: internal.container,
                            "mode":"list",
                            "allow_uploads":true,
                            "max_files":1,
                            "type":"assets",
                            "display":"assets",
                            "component":"assets",
                            "handle":"assets",
                        }'
                        :value="value"
                        :meta="meta"
                        handle="asset"
                        @input="internal.asset = $event" />
                </div>
            </publish-field-meta>

            <!-- ENTRIES -->
            <v-select
                    v-if="internal.type === 'entry'"
                    class="ml-2 w-1/5"
                    :options="collections"
                    :reduce="selection => selection.value"
                    v-model="internal.collection"
            />
            <publish-field-meta
                    v-for="(collection, index) in collections"
                    v-if="internal.type === 'entry' && internal.collection === collection.value"
                    :key="index"
                    :config="{ handle: 'collections', type: 'entries', collections: [collection.value] }"
                    :initial-value="internal.entry"
                    class="ml-2 flex-1"
            >
                <div slot-scope="{ meta, value, loading, config }">
                    <relationship-fieldtype
                            v-if="!loading"
                            :config="{ handle: 'collections', type: 'entries', collections: [collection.value], mode: 'select', max_items: 1 }"
                            :value="value"
                            :meta="meta"
                            handle="collections"
                            @input="internal.entry = $event" />
                </div>
            </publish-field-meta>

            <!-- TEXT, CUSTOM -->
            <text-input
                    v-if="['url', 'custom', 'email', 'tel'].indexOf(internal.type) !== -1"
                    class="flex-1 ml-2"
                    :prepend="textPrepend"
                    v-model="internal.url"
                    type="text"
                    :placeholder="urlPlaceholder"
            />

            <div v-if="internal.type && config.text" class="w-full flex items-center mt-2">
                <label class="w-1/5 flex-no-shrink" for="text">{{ __('link-it::fieldtype.text_label') }}</label>
                <text-input class="flex-1 ml-2" v-model="internal.text" type="text"
                            :placeholder="__('link-it::fieldtype.text_placeholder')"/>
            </div>
            <div v-if="internal.type && config.aria" class="w-full flex items-center mt-2">
                <label class="w-1/5 flex-no-shrink" for="aria">{{ __('link-it::fieldtype.aria_label') }}</label>
                <text-input class="flex-1 ml-2" v-model="internal.aria" type="text"
                            :placeholder="__('link-it::fieldtype.aria_placeholder')"/>
            </div>
            <div v-if="internal.type && config.title" class="w-full flex items-center mt-2">
                <label class="w-1/5 flex-no-shrink" for="title">{{ __('link-it::fieldtype.title_label') }}</label>
                <text-input class="flex-1 ml-2" v-model="internal.title" type="text"
                            :placeholder="__('link-it::fieldtype.title_placeholder')"/>
            </div>
            <div v-if="internal.type && config.append && internal.type !== 'custom'" class="w-full flex items-center mt-2">
                <label class="w-1/5 flex-no-shrink" for="append">{{ __('link-it::fieldtype.append_label') }}</label>
                <text-input class="flex-1 ml-2" v-model="internal.append" type="text"
                            :placeholder="__('link-it::fieldtype.append_placeholder')"/>
            </div>

            <div v-if="internal.type && config.newWindow" class="ml-auto w-full mt-2 flex items-center">
                <toggle-fieldtype
                        handle="newWindow"
                        v-model="internal.newWindow"
                />
                <label class="ml-1 font-normal" @click="internal.newWindow = !internal.newWindow">{{ __('link-it::fieldtype.new_window') }}</label>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    mixins: [Fieldtype],

    data: function () {
        return {
            internal: {
                type: null,
                url: null,
                newWindow: null,

                taxonomy: null,
                container: null,
                collection: null,

                asset: null,
                term: null,
                entry: null,

                text: null,
                aria: null,
                title: null,
                append: null,
            },
            uuid: this._uid,
        }
    },

    mounted() {
        if (this.value !== null) {
            Object.keys(this.value).forEach(key => {
                this.internal[key] = this.value[key];
            });
        }
    },

    watch: {
        'internal': {
            deep: true,
            handler: function (newValue, oldValue) {
                Object.keys(newValue).map(key => {
                    let statamicValue = this.value;

                    if (statamicValue === null) {
                        statamicValue = {};
                    }

                    statamicValue[key] = newValue[key];

                    this.update(statamicValue);
                });
            }
        },
        'internal.container': function (newValue, oldValue) {
            if (newValue !== oldValue && oldValue !== null) {
                this.internal.asset = null;
            }
        },
        'internal.collection': function (newValue, oldValue) {
            if (newValue !== oldValue && oldValue !== null) {
                this.internal.entry = null;
            }
        },
        'internal.taxonomy': function (newValue, oldValue) {
            if (newValue !== oldValue && oldValue !== null) {
                this.internal.term = null;
            }
        },
        'internal.type': function (newValue, oldValue) {
            if (newValue !== oldValue && oldValue !== null) {
                // Reset url data
                this.internal.url = '';
                this.internal.newWindow = false;
                this.internal.asset = [];
                this.internal.term = [];
                this.internal.page = [];
                this.internal.entry = [];

                // Reset dropdown data
                this.internal.collection = '';
                this.internal.taxonomy = '';
                this.internal.container = '';

                // Reset custom data
                this.internal.text = '';
                this.internal.aria = '';
                this.internal.title = '';
                this.internal.append = '';
            }
        },
    },

    computed: {
        types: function () {
            let types = this.config.types || [
                'asset',
                'entry',
                'custom',
                'email',
                'term',
                'tel',
                'url',
            ];

            if (this.containers.length === 0 && types.indexOf('asset') !== -1) {
                types.splice(types.indexOf('asset'), 1);
            }

            if (this.collections.length === 0 && types.indexOf('entry') !== -1) {
                types.splice(types.indexOf('entry'), 1);
            }

            if (this.taxonomies.length === 0 && types.indexOf('term') !== -1) {
                types.splice(types.indexOf('term'), 1);
            }

            return types.map(type => {
                return {value: type, label: __('link-it::fieldtype.' + type)};
            });
        },
        taxonomies: function () {
            return this.config.taxonomies ? _.map(this.config.taxonomies, function (taxonomy) {
                return {value: taxonomy, label: __(taxonomy)};
            }) : [];
        },
        containers: function () {
            return this.config.containers ? _.map(this.config.containers, function (container) {
                return {value: container, label: __(container)};
            }) : [];
        },
        collections: function () {
            return this.config.collections ? _.map(this.config.collections, function (collection) {
                return {value: collection, label: __(collection)};
            }) : [];
        },
        urlPlaceholder: function () {
            switch (this.internal.type) {
                case 'email':
                    return __('link-it::fieldtype.email_placeholder');
                case 'url':
                    return __('link-it::fieldtype.url_placeholder');
                case 'tel':
                    return __('link-it::fieldtype.tel_placeholder');
                case 'custom':
                    return __('link-it::fieldtype.custom_placeholder');
            }

            return '';
        },
        textPrepend: function () {
            switch (this.internal.type) {
                case 'email':
                    return 'mailto:';
                case 'tel':
                    return 'tel:';
            }

            return '';
        }
    },

    methods: {
        getReplicatorPreviewText() {
            if (!this.value) return;

            return __('link-it::fieldtype.' + this.value.type);
        },
    },

    ready: function () {
        this.config = Object.assign({
            aria: false,
            title: false,
            append: false,
            newWindow: false,
        }, this.config);
    }
}
</script>