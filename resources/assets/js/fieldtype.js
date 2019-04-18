Vue.component('link_it-fieldtype', {

    mixins: [Fieldtype],

    template: `
        <div>
            <div class="flex flex-wrap items-center">
                <select-fieldtype class="w-1/5" :data.sync="data.type" :name="type" :options="types"></select-fieldtype>
                <select-fieldtype v-if="data.type === 'term'" class="ml-2 w-1/5" :data.sync="data.taxonomy" name="taxonomy" :options="taxonomies"></select-fieldtype>
                <select-fieldtype v-if="data.type === 'asset'" class="ml-2 w-1/5" :data.sync="data.container" name="container" :options="containers"></select-fieldtype>
                <select-fieldtype v-if="data.type === 'entry'" class="ml-2 w-1/5" :data.sync="data.collection" name="collection" :options="collections"></select-fieldtype>
                <text-fieldtype v-if="['url', 'custom', 'email', 'tel'].indexOf(data.type) !== -1" :class="[config.newWindow ? 'mx-2' : 'ml-2']" class="flex-1" :data.sync="data.url" :config="{ mode: 'text', placeholder: urlPlaceholder, required: config.required }"></text-fieldtype>
                
                <div v-if="config.newWindow" class="ml-auto w-1/4 text-right">
                    <input type="checkbox"
                           name="newWindow"
                           id="newWindow"
                           :value="true"
                           v-model="data.newWindow"
                    />
                    <label for="newWindow">{{ translate('Open in a new window?') }}</label>
                </div>
            </div>
            <assets-fieldtype 
                v-if="data.type === 'asset' && data.container"
                class="mt-2"
                :data.sync="data.asset"
                :config="{
                    max_files: 1,
                    container: data.container,
                    type: 'asset',
                }"
            ></assets-fieldtype>
            <taxonomy-fieldtype
                class="mt-2"
                v-for="taxonomy in taxonomies"
                v-if="data.type === 'term' && data.taxonomy === taxonomy.value"
                :data.sync="data.term"
                :config.sync="{
                    max_items: 1,
                    type: 'taxonomy',
                    taxonomy: taxonomy.value,
                }"
            ></taxonomy-fieldtype>
            <pages-fieldtype
                class="mt-2"
                v-if="data.type === 'page'"
                :data.sync="data.page"
                :config.sync="{
                    max_items: 1,
                    type: 'pages'
                }" 
            ></pages-fieldtype>
            <collection-fieldtype
                class="mt-2"
                v-for="collection in collections"
                v-if="data.type === 'entry' && data.collection === collection.value"
                :data.sync="data.entry"
                :config.sync="{
                    max_items: 1,
                    type: 'collection',
                    collection: collection.value,
                }"
            ></collection-fieldtype>
            <div v-if="config.text" class="flex items-center mt-2">
                <label class="w-1/5 flex-no-shrink" for="text">{{ translate('Custom Link Text') }}</label>
                <text-fieldtype class="ml-2" :data.sync="data.text" :config="{ mode: 'text', placeholder: translate('Read more') }"></text-fieldtype>
            </div>
            <div v-if="config.aria" class="flex items-center mt-2">
                <label class="w-1/5 flex-no-shrink" for="aria">{{ translate('Aria') }}</label>
                <text-fieldtype class="ml-2" :data.sync="data.aria" :config="{ mode: 'text', placeholder: translate('Read more about this') }"></text-fieldtype>
            </div>
            <div v-if="config.title" class="flex items-center mt-2">
                <label class="w-1/5 flex-no-shrink" for="title">{{ translate('Title') }}</label>
                <text-fieldtype class="ml-2" :data.sync="data.title" :config="{ mode: 'text', placeholder: translate('Link title') }"></text-fieldtype>
            </div>
        </div>
    `,

    data: function () {
        return {
        }
    },

    watch: {
        'data.type': function (newValue, oldValue) {
            if (newValue !== oldValue) {
                // Reset url data
                this.data.url = null;
                this.data.newWindow = false;
                this.data.asset = [];
                this.data.term = [];
                this.data.page = [];
                this.data.entry = [];

                // Reset custom data
                this.data.text = null;
                this.data.aria = null;
                this.data.title = null;
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
                'page',
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

            return types.map(function (type) {
                return { text: translate(type), value: type }
            });
        },
        taxonomies: function () {
            return this.config.taxonomies ? _.map(this.config.taxonomies, function (taxonomy) {
                return { value: taxonomy, text: translate(taxonomy) };
            }) : [];
        },
        containers: function () {
            return this.config.containers ? _.map(this.config.containers, function (container) {
                return { value: container, text: translate(container) };
            }) : [];
        },
        collections: function () {
            return this.config.collections ? _.map(this.config.collections, function (collection) {
                return { value: collection, text: translate(collection) };
            }) : [];
        },
        urlPlaceholder: function () {
            switch (this.data.type) {
                case 'email':
                    return 'john@example.com';
                case 'url':
                    return 'https://example.com';
                case 'tel':
                    return '+1 123 456 789';
                case 'custom':
                    return translate('#maybe-an-anchor');
            }

            return '';
        }
    },

    methods: {
        getReplicatorPreviewText() {
            if (! this.data) return;

            return translate(this.data.type);
        },
    },

    ready: function () {
        this.config = Object.assign({
            aria: false,
            title: false,
            newWindow: false,
        }, this.config);
    }
});
