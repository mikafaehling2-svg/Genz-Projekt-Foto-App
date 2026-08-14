<template>
  <ion-page>
    <ion-header>
      <ion-toolbar color="primary">
        <ion-title>Meine Fotos</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <!-- Ladeindikator, während Fotos geladen werden -->
      <ion-loading
        :is-open="laedt"
        message="Fotos werden geladen..."
      ></ion-loading>

      <!-- Hinweis, wenn noch keine Fotos da sind -->
      <div v-if="photos.length === 0 && !laedt" class="leer">
        <ion-icon :icon="images" class="leer-icon"></ion-icon>
        <p class="leer-titel">Noch keine Fotos</p>
        <p class="leer-text">Tippe unten auf den Button, um dein erstes Foto aufzunehmen.</p>
      </div>

      <!-- Galerie: quadratische Kacheln, 3 pro Zeile -->
      <ion-grid class="galerie">
        <ion-row>
          <ion-col size="4" v-for="photo in photos" :key="photo.filepath">
            <div class="thumbnail" @click="oeffneFoto(photo)">
              <img :src="photo.webviewPath" alt="Foto" />
              <span class="datum">{{ formatiereDatum(photo.aufnahmedatum) }}</span>
            </div>
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
  IonGrid, IonRow, IonCol, IonFab, IonFabButton, IonIcon, IonLoading,
} from '@ionic/vue';
import { camera, images } from 'ionicons/icons';
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { usePhotoGallery, UserPhoto } from '@/composables/usePhotoGallery';

const { photos, takePhoto, loadSaved } = usePhotoGallery();
const router = useRouter();

const laedt = ref(false);

onMounted(async () => {
  laedt.value = true;
  try {
    await loadSaved();
  } catch (e) {
    console.error('Laden fehlgeschlagen:', e);
  } finally {
    laedt.value = false;
  }
});

const oeffneFoto = (photo: UserPhoto) => {
  const index = photos.value.indexOf(photo);
  router.push(`/foto/${index}`);
};

// Wandelt den gespeicherten Zeitstempel in ein lesbares Datum um
const formatiereDatum = (zeitstempel: number | undefined): string => {
  if (!zeitstempel) return '';
  const datum = new Date(zeitstempel);
  return datum.toLocaleDateString('de-DE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};
</script>

<style scoped>
.galerie {
  padding: 4px;
}

ion-col {
  padding: 10px;
}

.thumbnail {
  position: relative;
  width: 100%;
  aspect-ratio: 1 / 1;
  overflow: hidden;
  border-radius: 10px;
  cursor: pointer;
  border: 2px solid transparent;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.25);
  transition: transform 0.15s ease, box-shadow 0.15s ease, border-color 0.15s ease;
}
.thumbnail:hover {
  transform: scale(1.04);
  border-color: var(--ion-color-primary);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.5);
  z-index: 1;
}
.thumbnail img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.datum {
  position: absolute;
  bottom: 6px;
  right: 6px;
  font-size: 12px;
  font-weight: 600;
  color: #fff;
  background: rgba(0, 0, 0, 0.65);
  padding: 3px 8px;
  border-radius: 12px;
  backdrop-filter: blur(2px);
}

.leer {
  text-align: center;
  margin: 80px 20px;
  color: #888;
}
.leer-icon {
  font-size: 64px;
  color: #bbb;
  margin-bottom: 16px;
}
.leer-titel {
  font-size: 18px;
  font-weight: 600;
  margin: 0 0 8px;
}
.leer-text {
  font-size: 14px;
  margin: 0;
}
</style>