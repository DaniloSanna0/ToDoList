<template>
  <section class="app-notes text-center">
    <slot></slot>
  </section>
</template>

<script>
export default {
  props: {
    id: Number,
    title: String,
    description: String,
    link: String,
  },
};
</script>

<style></style>
