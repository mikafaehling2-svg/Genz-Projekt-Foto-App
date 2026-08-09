<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <!-- Zurück-Button zur Galerie -->
        <ion-buttons slot="start">
          <ion-back-button default-href="/home"></ion-back-button>
        </ion-buttons>
        <ion-title>Foto</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true" class="ion-padding">
      <!-- Das große Foto -->
      <div v-if="foto" class="detail-container">
        <img :src="foto.webviewPath" alt="Foto" />

        <!-- Löschen-Button -->
        <ion-button expand="block" color="danger" @click="loeschen()">
          <ion-icon :icon="trash" slot="start"></ion-icon>
          Foto löschen
        </ion-button>
      </div>

      <!-- Falls kein Foto gefunden wurde -->
      <div v-else class="hinweis">
        <p>Foto nicht gefunden.</p>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent,
  IonButtons, IonBackButton, IonButton, IonIcon,
} from '@ionic/vue';
import { trash } from 'ionicons/icons';
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { usePhotoGallery } from '@/composables/usePhotoGallery';

const route = useRoute();
const router = useRouter();
const { photos, deletePhoto } = usePhotoGallery();

// Den Index aus der URL holen (z. B. /foto/2 → 2)
const index = computed(() => Number(route.params.index));

// Das passende Foto aus der Liste herausgreifen
const foto = computed(() => photos.value[index.value]);

const loeschen = async () => {
  if (foto.value) {
    await deletePhoto(foto.value);
    // Zurück zur Galerie
    router.push('/home');
  }
};
</script>

<style scoped>
.detail-container {
  text-align: center;
}
.detail-container img {
  max-width: 100%;
  border-radius: 8px;
  margin-bottom: 20px;
}
.hinweis {
  text-align: center;
  color: #888;
  margin: 60px 0;
}
</style>