import LinkItFieldtype from "./LinkItFieldtype.vue";

Statamic.booting(() => {
  Statamic.$components.register("link_it-fieldtype", LinkItFieldtype);
});
