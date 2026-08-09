<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Meine Fotos</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <!-- Hinweis, wenn noch keine Fotos da sind -->
      <div v-if="photos.length === 0" class="hinweis">
        <p>Noch keine Fotos.</p>
        <p>Tippe auf den Button, um ein Foto aufzunehmen.</p>
      </div>

      <!-- Galerie: alle Fotos als Raster -->
      <ion-grid>
        <ion-row>
          <ion-col size="6" v-for="photo in photos" :key="photo.filepath">
            <ion-img :src="photo.webviewPath" @click="oeffneFoto(photo)"></ion-img>
          </ion-col>
        </ion-row>
      </ion-grid>

      <!-- Kamera-Button, schwebend unten rechts -->
      <ion-fab vertical="bottom" horizontal="end" slot="fixed">
        <ion-fab-button @click="takePhoto()">
          <ion-icon :icon="camera"></ion-icon>
        </ion-fab-button>
      </ion-fab>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent,
  IonGrid, IonRow, IonCol, IonImg, IonFab, IonFabButton, IonIcon,
} from '@ionic/vue';
import { camera } from 'ionicons/icons';
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { usePhotoGallery, UserPhoto } from '@/composables/usePhotoGallery';

const { photos, takePhoto, loadSaved } = usePhotoGallery();
const router = useRouter();

// Beim Öffnen der Seite gespeicherte Fotos laden
onMounted(() => {
  loadSaved();
});

// Beim Antippen eines Fotos zur Detailseite wechseln
const oeffneFoto = (photo: UserPhoto) => {
  // Wir merken uns das gewählte Foto kurz und navigieren
  const index = photos.value.indexOf(photo);
  router.push(`/foto/${index}`);
};
</script>

<style scoped>
.hinweis {
  text-align: center;
  color: #888;
  margin: 60px 20px;
}
</style>