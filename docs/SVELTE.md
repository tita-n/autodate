# Using autodate with Svelte

```svelte
<script>
  import { onMount } from 'svelte';
  import { autoDate } from 'autodate';

  let yearSpan;
  let controller;

  onMount(() => {
    controller = autoDate(yearSpan, {
      format: 'range',
      startYear: 2019
    });

    return () => controller.stop();
  });
</script>

<footer>
  <span bind:this={yearSpan}></span> My Company
</footer>
```
