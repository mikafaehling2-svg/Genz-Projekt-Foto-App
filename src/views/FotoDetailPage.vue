<template>
  <ion-page>
    <ion-header>
      <ion-toolbar color="primary">
        <ion-buttons slot="start">
          <ion-back-button default-href="/home"></ion-back-button>
        </ion-buttons>
        <ion-title>Foto</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true" class="ion-padding">
      <div v-if="foto" class="detail-container">
        <img :src="foto.webviewPath" alt="Foto" />

        <!-- Bearbeiten-Button: nur auf Android sinnvoll -->
        <ion-button
          v-if="istAndroid"
          expand="block"
          @click="bearbeiten()"
        >
          <ion-icon :icon="create" slot="start"></ion-icon>
          Foto bearbeiten
        </ion-button>

        <!-- Löschen-Button -->
        <ion-button expand="block" color="danger" @click="loeschen()">
          <ion-icon :icon="trash" slot="start"></ion-icon>
          Foto löschen
        </ion-button>
      </div>

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
import { trash, create } from 'ionicons/icons';
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { Capacitor } from '@capacitor/core';
import { PhotoEditor } from '@capawesome/capacitor-photo-editor';
import { usePhotoGallery } from '@/composables/usePhotoGallery';

const route = useRoute();
const router = useRouter();
const { photos, deletePhoto } = usePhotoGallery();

// Nur auf Android soll der Bearbeiten-Button erscheinen
const istAndroid = computed(() => Capacitor.getPlatform() === 'android');

const index = computed(() => Number(route.params.index));
const foto = computed(() => photos.value[index.value]);

const bearbeiten = async () => {
  if (!foto.value) return;
  try {
    // Der Editor braucht den nativen Dateipfad (filepath), nicht den webviewPath
    await PhotoEditor.editPhoto({ path: foto.value.filepath });
  } catch (e) {
    console.error('Bearbeiten fehlgeschlagen:', e);
  }
};

const loeschen = async () => {
  if (foto.value) {
    await deletePhoto(foto.value);
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