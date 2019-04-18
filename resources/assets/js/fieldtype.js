Vue.component('link_it-fieldtype', {

    mixins: [Fieldtype],

    template: `
        <div>
            <div class="flex flex-wrap items-center">
                <select-fieldtype class="w-1/5" :data.sync="data.type" :name="type" :options="options"></select-fieldtype>
                <select-fieldtype v-show="data.type === 'taxonomy'" class="ml-2 w-1/5" :data.sync="data.taxonomy" name="taxonomy" :options="taxonomies"></select-fieldtype>
                <select-fieldtype v-show="data.type === 'asset'" class="ml-2 w-1/5" :data.sync="data.container" name="container" :options="containers"></select-fieldtype>
                <select-fieldtype v-show="data.type === 'collection'" class="ml-2 w-1/5" :data.sync="data.collection" name="collection" :options="collections"></select-fieldtype>
                <text-fieldtype v-show="['url', 'custom', 'email', 'tel'].indexOf(data.type) !== -1" :class="[config.newWindow ? 'mx-2' : 'ml-2']" class="flex-1" :data.sync="data.url" :config="{ mode: 'text', placeholder: urlPlaceholder, required: config.required }"></text-fieldtype>
                
                <div v-if="config.newWindow" class="ml-auto w-1/4 text-right">
                    <input type="checkbox"
                           name="newWindow"
                           id="newWindow"
                           :value="true"
                           v-model="data.newWindow"
                    />
                    <label for="newWindow">Open in new window?</label>
                </div>
            </div>
            <assets-fieldtype 
                v-show="data.type === 'asset' && data.container"
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
                v-if="data.type === 'taxonomy' && data.taxonomy === taxonomy.value"
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
                v-if="data.type === 'collection' && data.collection === collection.value"
                :data.sync="data.entry"
                :config.sync="{
                    max_items: 1,
                    type: 'collection',
                    collection: collection.value,
                }"
            ></collection-fieldtype>
            <div v-if="config.text" class="flex items-center mt-2">
                <label class="w-1/6" for="text">Custom Link Text</label>
                <text-fieldtype class="ml-2" :data.sync="data.text" :config="{ mode: 'text', placeholder: 'Read more' }"></text-fieldtype>
            </div>
            <div v-if="config.aria" class="flex items-center mt-2">
                <label class="w-1/6" for="aria">Aria</label>
                <text-fieldtype class="ml-2" :data.sync="data.aria" :config="{ mode: 'text', placeholder: 'Read more about this' }"></text-fieldtype>
            </div>
            <div v-if="config.title" class="flex items-center mt-2">
                <label class="w-1/6" for="title">Title</label>
                <text-fieldtype class="ml-2" :data.sync="data.title" :config="{ mode: 'text', placeholder: 'Link title' }"></text-fieldtype>
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
        options: function () {
            let options = this.config.types || [
                'asset',
                'collection',
                'custom',
                'email',
                'page',
                'taxonomy',
                'tel',
                'url',
            ];

            return options.map(function (option) {
                return { text: translate(option), value: option }
            });
        },
        taxonomies: function () {
            return this.data.taxonomies.map(function (taxonomy) {
                return { value: taxonomy, text: translate(taxonomy) };
            });
        },
        containers: function () {
            return this.data.containers.map(function (container) {
                return { value: container, text: translate(container) };
            });
        },
        collections: function () {
            return this.data.collections.map(function (collection) {
                return { value: collection, text: translate(collection) };
            });
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
                    return '#maybe-an-anchor';
            }

            return '';
        }
    },

    methods: {
    },

    ready: function () {
        this.config = Object.assign({
            aria: false,
            title: false,
            newWindow: false,
        }, this.config);
    }
});
