<template>
  <div id="app">
    <s-header-brands
      class="py-5"
      :left-logo="buyerLogo"
      :right-logo="accountLogos"
      data-testid="header-brands"
      @click="landing.params.get('useHeaderScroll') && scrollTo()"
    />

    <b-overlay :show="products.loading.value" spinner-variant="primary">
      <template #overlay="{ spinnerVariant }">
        <overlay-loading-screen
          :logo="accountLogos[0]"
          :spinner-variant="spinnerVariant"
        />
      </template>

      <template v-if="!products.loading.value">
        <!-- app-hero -->
        <div class="center">
          <button @click="setSelectedTab('app-form')">New note</button>
          <button @click="setSelectedTab('app-notes')">Notes</button>
        </div>
        <main>
          <!-- sections -->

          <app-form v-if="selectedTab === 'app-form'"
            ><form @click.prevent class="p-6 d-flex flex-column gap-2">
              <app-header title="New note"></app-header>

              <label>Title</label>
              <input type="text" v-model="form.title" />
              <label>Description</label>
              <textarea v-model="form.description"></textarea>
              <label>Link</label>
              <input type="text" v-model="form.link" />
              <button class="d-block mt-5" @click="submit">Add Note</button>
            </form>
          </app-form>

          <app-notes
            v-if="selectedTab === 'app-notes'"
            :id="form.id"
            :title="form.title"
            :description="form.description"
            :link="form.link"
          >
            <app-header title="Notes"></app-header>

            <div v-for="(n, i) in notes" :key="i">
              <ul>
                <li v-for="(note, i) in n" :key="i">
                  {{ note }}
                </li>
                <button @click="removeNote(n.id)">Delete</button>
                <button @click="updateNote(n.id)">Update</button>
                <hr />
              </ul>
            </div>
          </app-notes>
          <div v-if="inputIsInvalid" class="text-center">inputIsInvalid</div>
          <div v-if="inputSended" class="text-center">inputSended</div>
          <!-- <component :is="selectedTab"></component> -->
        </main>
      </template>
    </b-overlay>

    <s-footer class="py-6 text-center" data-testid="footer">
      <span v-html="landing.params.get('copyFooter')" />
    </s-footer>

    <s-call-me-back-modal
      id="call-me-back-modal"
      :call-me-back-form-options="callMeBackFormOptions"
      v-on="modalEvents"
      @submit="sendLead"
    />
  </div>
</template>

<script setup>
import { computed, provide, onBeforeMount, inject, ref } from "vue";
import { breakpointsBootstrapV5, useBreakpoints } from "@vueuse/core";
import {
  useProducts,
  useLead,
  useLanding,
  HeaderBrands as SHeaderBrands,
  // CallMeBackForm as SCallMeBackForm,
  Footer as SFooter,
  CallMeBackModal as SCallMeBackModal,
} from "@smart-contact/smartify";
import OverlayLoadingScreen from "@/components/OverlayLoadingScreen.vue";
import AppHeader from "./components/AppHeader.vue";
import AppForm from "./components/AppForm.vue";
import AppNotes from "./components/AppNotes.vue";

// for (const note of notes) {
//   note;
// }

let n = ref(0);
const form = ref({
  id: n,
  title: "",
  description: "",
  link: "",
});

const notes = ref([]);

let selectedTab = ref("app-form");

const setSelectedTab = function (tab) {
  selectedTab.value = tab;
};

const removeNote = function (resId) {
  const resIndex = notes.value.findIndex((res) => res.id === resId);
  // notes.value.splice(form.value.id, 1);
  notes.value.splice(resIndex, 1);
  console.log(notes.value);
  console.log(resIndex);
};

const updateNote = function (resId) {
  const resIndex = notes.value.findIndex((res) => res.id - 1 === resId - 1);
  notes.value.map((obj) => {
    if (obj.id - 1 === resIndex) {
      obj.title = form.value.title;
      obj.description = form.value.description;
      obj.link = form.value.link;
    }
    console.log(obj);
    return obj;
  });
};

let inputIsInvalid = ref(false);
let inputSended = ref(undefined);

const submit = function () {
  if (
    form.value.title.trim() === "" ||
    form.value.description.trim() === "" ||
    form.value.link.trim() === ""
  ) {
    inputIsInvalid.value = true;
    inputSended.value = false;
  } else {
    inputIsInvalid.value = false;
    inputSended.value = true;

    console.log(form);
    n.value += 1;
    notes.value.push({
      id: form.value.id,
      title: form.value.title,
      description: form.value.description,
      link: form.value.link,
    });
    console.log(notes.value);
    console.log(form.value.id);
  }
  console.log(inputIsInvalid);
};

const landing = useLanding();
const { logoAccountMobile, logoAccount, account } = landing.params.get();
const products = useProducts();
const lead = useLead({
  disableRecaptchaCheck: !landing.params.get("useRecaptcha"),
});
const callMeBackFormOptions = inject("callMeBackFormOptions");
const $bvModal = inject("$bvModal");

const breakpoints = useBreakpoints(breakpointsBootstrapV5);
const scrollTo = (selector) => {
  document.querySelector(selector)?.scrollIntoView();
};
const accountLogos = [
  {
    src: `${LIVELANDING_CDN_IMAGES_BASE_URL}/${logoAccount}`,
    media: "(min-width: 768px)",
  },
  {
    src: `${LIVELANDING_CDN_IMAGES_BASE_URL}/${logoAccountMobile}`,
    alt: `logo ${account}`,
    default: true,
    media: "(max-width: 767.98px)",
  },
];

const buyerLogo = computed(() => {
  const [buyer] = products.buyers.value;
  return buyer
    ? {
        src: buyer.imageUrl,
        alt: `logo ${buyer.name}`,
      }
    : {};
});

const sendLead = async (data = {}) => {
  const { successURL } = landing.params.get();
  try {
    if (window.dataLayer) {
      window.dataLayer.push({
        event: "form_submit",
        eventCategory: "form",
        eventAction: "submit_ok",
        eventLabel: "call-back landing",
      });
    }
    await lead.send(data);
    if (successURL) {
      window.location.href = successURL;
    }
  } catch (err) {
    console.log(err);
  }
};

const onProductSelected = (productIndex) => {
  products.setSelectedIndex(productIndex);
  $bvModal.show("call-me-back-modal");
};

const modalEvents = {
  show: () => {
    if (products.selected.value != undefined) {
      landing.data.set("buyer", products.selected.value.buyer.name);
      landing.data.set("offer", products.selected.value.name);
    }
  },
  hide: () => {
    landing.data.restoreDefaults();
    products.setSelectedIndex(undefined);
  },
};

onBeforeMount(() => {
  products.load({
    // collection: landing.params.get('collection'),
    productsIds: landing.params.get("products"),
  });
});
// let prova = "prova";
provide("isMobile", breakpoints.smaller("md"));
provide("isTablet", breakpoints.greater("sm"));
provide("isDesk", breakpoints.greater("md"));
provide("params", landing.params.get());
provide("onProductSelected", onProductSelected);
provide("sendLead", sendLead);
// provide("prova", prova);
</script>

<style lang="scss">
ul {
  list-style-type: none;
  padding: 0;
}
html {
  scroll-behavior: smooth;
}

#app {
  .b-overlay {
    min-height: calc(100vh - #{$s-header-brands-logo-height + (spacer(5) * 2)});

    div:nth-child(2) {
      width: 100%;
    }
  }
  input::placeholder {
    font-size: 0.75em;
  }
}
</style>
