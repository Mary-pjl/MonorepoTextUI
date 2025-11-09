<template>
  <button class="m-button">
    <slot>按钮</slot>
  </button>
</template>

<script setup lang="ts">
import "./style/index.less";

defineOptions({
  name: "MButton", // M 前缀，使用时 <m-button>
});
</script>
