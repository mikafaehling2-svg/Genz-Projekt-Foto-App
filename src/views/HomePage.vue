<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Meine Fotos</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true" class="ion-padding">
      <!-- Wenn ein Foto da ist, zeige es an -->
      <div v-if="fotoUrl" class="foto-container">
        <img :src="fotoUrl" alt="Aufgenommenes Foto" />
      </div>

      <!-- Wenn noch kein Foto da ist, zeige einen Hinweis -->
      <div v-else class="hinweis">
        <p>Noch kein Foto aufgenommen.</p>
        <p>Tippe auf den Button, um zu starten.</p>
      </div>

      <!-- Der Kamera-Button -->
      <ion-button expand="block" @click="fotoAufnehmen()">
        <ion-icon :icon="camera" slot="start"></ion-icon>
        Foto aufnehmen
      </ion-button>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonIcon,
} from '@ionic/vue';
import { camera } from 'ionicons/icons';
import { ref } from 'vue';
import { Camera } from '@capacitor/camera';

// Hier speichern wir die Bild-URL, die im Template angezeigt wird
const fotoUrl = ref<string>('');

const fotoAufnehmen = async () => {
  try {
    const result = await Camera.takePhoto({
      quality: 90,
    });
    // webPath kann direkt als Bildquelle verwendet werden
    fotoUrl.value = result.webPath;
  } catch (e) {
    // Wenn der Nutzer abbricht oder ein Fehler auftritt
    console.error('Foto aufnehmen fehlgeschlagen:', e);
  }
};
</script>

<style scoped>
.foto-container {
  text-align: center;
  margin-bottom: 20px;
}
.foto-container img {
  max-width: 100%;
  border-radius: 8px;
}
.hinweis {
  text-align: center;
  color: #888;
  margin: 40px 0;
}
</style>