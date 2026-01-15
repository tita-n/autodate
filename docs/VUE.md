# Using autodate with Vue 3 (Composition API)

```vue
<template>
  <footer>
    <span ref="yearRef"></span> My Company
  </footer>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { autoDate } from 'autodate';

const yearRef = ref(null);
let controller = null;

onMounted(() => {
  if (yearRef.value) {
    controller = autoDate(yearRef.value, {
      format: 'full',
      startYear: 2021
    });
  }
});

onUnmounted(() => {
  if (controller) controller.stop();
});
</script>
```
