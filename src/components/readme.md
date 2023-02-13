# Components

Inserisci qui i componenti specifici per la landing page. 

## Registrazione componenti globali
Per registrare dei componenti globali, creare un file `index.js`,
importare Vue e registrarli tramite `Vue.component()`.
Infine importare `src/components/index.js` nel file `src/main.js`


Come buona pratica nei componenti, indicare sempre la proprietà `name`,
cosi da poter registrare il componente con quel name. (vedi esempio)

### Esempio

```vue
//src/components/MyGlobalComponent.vue
<template>
<!-- ... -->
</template>

<script>
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'MyGlobalCommponent',
  ...
});
</script>
```

```js
//src/components/index.js
import Vue from 'vue';
import MyGlobalComponent from '@/components/MyGlobalComponent.vue';

[
  MyGlobalComponent
  //altri componenti globali
].forEach(
    Component => (Vue.component(Component.name, Component))
  );
```

```js
//src/main.js
import Vue from "vue";
import App from "./src/App.vue";
//...
import "@/components/index.js";
//...
new Vue({
  render: h => h(App)
})
.$mount('#app');
```
