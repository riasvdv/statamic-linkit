<style>
  .w-1\/5 {
    width: 20%;
  }
</style>
<template>
  <div>
    <div class="flex flex-wrap items-center">
      <Select
        class="w-1/5 mr-2"
        :options="types"
        :reduce="selection => selection.value"
        v-model="internal.type"
        v-show="types.length > 1"
      />

      <!-- TAXONOMIES -->
      <Select
        v-if="internal.type === 'term'"
        class="w-1/5 mr-2"
        :options="meta.taxonomies"
        :reduce="selection => selection.value"
        v-model="internal.taxonomy"
        v-show="meta.taxonomies.length >= 1"
      />
      <relationship-fieldtype
          v-show="internal.type === 'term' && taxonomy.value === internal.taxonomy"
          v-for="taxonomy in meta.taxonomies"
          :key="taxonomy.value"
          class="w-1/5"
          :config="taxonomy.config"
          :meta="taxonomy.meta"
          :value="internal.term"
          @update:meta="taxonomy.meta = $event"
          @update:value="internal.term = $event"
          button-size="base"
          handle="term"
      />

      <!-- ENTRIES -->
      <Select
          v-if="internal.type === 'entry'"
          class="w-1/5 mr-2"
          :options="meta.collections"
          :reduce="selection => selection.value"
          v-model="internal.collection"
          v-show="meta.collections.length >= 1"
      />
      <relationship-fieldtype
          v-show="internal.type === 'entry' && collection.value === internal.collection"
          v-for="collection in meta.collections"
          :key="collection.value"
          class="w-1/5"
          :config="collection.config"
          :meta="collection.meta"
          :value="internal.entry"
          @update:meta="collection.meta = $event"
          @update:value="internal.entry = $event"
          button-size="base"
          handle="entry"
      />

      <!-- ASSETS -->
      <Select
          v-if="internal.type === 'asset'"
          class="w-1/5 mr-2"
          :options="meta.containers"
          :reduce="selection => selection.value"
          v-model="internal.container"
          v-show="meta.containers.length >= 1"
      />
      <div class="mt-2 min-w-full">
        <assets-fieldtype
            v-show="internal.type === 'asset' && container.value === internal.container"
            v-for="container in meta.containers"
            ref="assets"
            handle="asset"
            :value="internal.asset"
            :config="container.config"
            :meta="container.meta"
            @update:meta="container.meta = $event"
            @update:value="internal.asset = $event"
        />
      </div>

      <!-- TEXT, CUSTOM -->
      <Text
        v-if="['url', 'custom', 'email', 'tel'].indexOf(internal.type) !== -1"
        class="flex-1"
        :prepend="textPrepend"
        v-model="internal.url"
        type="text"
        :placeholder="urlPlaceholder"
      />

      <div
        v-if="internal.type && config.text"
        class="w-full flex items-center mt-2"
      >
        <label class="w-1/5 flex-no-shrink" for="text">{{
          __("link-it::fieldtype.text_label")
        }}</label>
        <Text
          class="flex-1 ml-2"
          v-model="internal.text"
          type="text"
          :placeholder="__('link-it::fieldtype.text_placeholder')"
        />
      </div>
      <div
        v-if="internal.type && config.aria"
        class="w-full flex items-center mt-2"
      >
        <label class="w-1/5 flex-no-shrink" for="aria">{{
          __("link-it::fieldtype.aria_label")
        }}</label>
        <Text
          class="flex-1 ml-2"
          v-model="internal.aria"
          type="text"
          :placeholder="__('link-it::fieldtype.aria_placeholder')"
        />
      </div>
      <div
        v-if="internal.type && config.title"
        class="w-full flex items-center mt-2"
      >
        <label class="w-1/5 flex-no-shrink" for="title">{{
          __("link-it::fieldtype.title_label")
        }}</label>
        <Text
          class="flex-1 ml-2"
          v-model="internal.title"
          type="text"
          :placeholder="__('link-it::fieldtype.title_placeholder')"
        />
      </div>
      <div
        v-if="internal.type && config.append && internal.type !== 'custom'"
        class="w-full flex items-center mt-2"
      >
        <label class="w-1/5 flex-no-shrink" for="append">{{
          __("link-it::fieldtype.append_label")
        }}</label>
        <Text
          class="flex-1 ml-2"
          v-model="internal.append"
          type="text"
          :placeholder="__('link-it::fieldtype.append_placeholder')"
        />
      </div>

      <div
        v-if="internal.type && config.newWindow"
        class="ml-auto w-full mt-2 flex items-center"
      >
        <Switch id="newWindow" v-model="internal.newWindow" />
        <label
          class="ml-2 font-normal"
          @click="internal.newWindow = !internal.newWindow"
          >{{ __("link-it::fieldtype.new_window") }}</label
        >
      </div>
    </div>
  </div>
</template>
<script>
import { FieldtypeMixin } from "@statamic/cms";
import { Input as Text, Select, Switch } from "@statamic/cms/ui";
import PositionsSelectOptions from '../../vendor/statamic/cms/resources/js/mixins/PositionsSelectOptions.js'

export default {
  mixins: [FieldtypeMixin, PositionsSelectOptions],

  components: {
    Text,
    Select,
    Switch,
  },

  data: function() {
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
        append: null
      },
      uuid: this._uid
    };
  },

  mounted() {
    if (this.value !== null) {
      Object.keys(this.value).forEach(key => {
        this.internal[key] = this.value[key];
      });
    }

    if (this.types.length === 1) {
      this.internal.type = this.types[0].value;
    }
  },

  watch: {
    value: function(newValue) {
      Object.keys(newValue).forEach(key => {
        this.internal[key] = newValue[key];
      });
    },
    internal: {
      deep: true,
      handler: function(newValue, oldValue) {
        Object.keys(newValue).map(key => {
          let statamicValue = this.value;

          if (statamicValue === null || statamicValue.length === 0) {
            statamicValue = {};
          }

          statamicValue[key] = newValue[key];

          this.update(statamicValue);
        });
      }
    },
    "internal.container": function(newValue, oldValue) {
      if (newValue !== oldValue && oldValue !== null) {
        this.internal.asset = null;
      }
    },
    "internal.collection": function(newValue, oldValue) {
      if (newValue !== oldValue && oldValue !== null) {
        this.internal.entry = null;
      }
    },
    "internal.taxonomy": function(newValue, oldValue) {
      if (newValue !== oldValue && oldValue !== null) {
        this.internal.term = null;
      }
    },
    "internal.type": function(newValue, oldValue) {
      if (newValue !== oldValue && oldValue !== null) {
        // Reset url data
        this.internal.url = "";
        this.internal.newWindow = false;
        this.internal.asset = [];
        this.internal.term = [];
        this.internal.page = [];
        this.internal.entry = [];

        // Reset dropdown data
        this.internal.collection = "";
        this.internal.taxonomy = "";
        this.internal.container = "";

        // Reset custom data
        this.internal.text = "";
        this.internal.aria = "";
        this.internal.title = "";
        this.internal.append = "";
      }

      if (newValue === "entry" && this.meta.collections.length === 1) {
        this.internal.collection = this.meta.collections[0].value;
      }

      if (newValue === "term" && this.meta.taxonomies.length === 1) {
        this.internal.taxonomy = this.meta.taxonomies[0].value;
      }

      if (newValue === "asset" && this.meta.containers.length === 1) {
        this.internal.container = this.meta.containers[0].value;
      }
    }
  },

  computed: {
    replicatorPreview() {
      if (!this.value) return;

      return __("link-it::fieldtype." + this.value.type);
    },

    types: function() {
      let types = this.config.types || [
        "asset",
        "entry",
        "custom",
        "email",
        "term",
        "tel",
        "url"
      ];

      if (this.meta.containers.length === 0 && types.indexOf("asset") !== -1) {
        types.splice(types.indexOf("asset"), 1);
      }

      if (this.meta.collections.length === 0 && types.indexOf("entry") !== -1) {
        types.splice(types.indexOf("entry"), 1);
      }

      if (this.meta.taxonomies.length === 0 && types.indexOf("term") !== -1) {
        types.splice(types.indexOf("term"), 1);
      }

      return types.map(type => {
        return { value: type, label: __("link-it::fieldtype." + type) };
      });
    },
    urlPlaceholder: function() {
      switch (this.internal.type) {
        case "email":
          return __("link-it::fieldtype.email_placeholder");
        case "url":
          return __("link-it::fieldtype.url_placeholder");
        case "tel":
          return __("link-it::fieldtype.tel_placeholder");
        case "custom":
          return __("link-it::fieldtype.custom_placeholder");
      }

      return "";
    },
    textPrepend: function() {
      switch (this.internal.type) {
        case "email":
          return "mailto:";
        case "tel":
          return "tel:";
      }

      return "";
    }
  },

  ready: function() {
    this.config = Object.assign(
      {
        aria: false,
        title: false,
        append: false,
        newWindow: false
      },
      this.config
    );
  }
};
</script>
