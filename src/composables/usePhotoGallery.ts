import { ref } from 'vue';
import { Camera } from '@capacitor/camera';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Preferences } from '@capacitor/preferences';
import { Capacitor } from '@capacitor/core';

// So sieht ein gespeichertes Foto bei uns aus
export interface UserPhoto {
  filepath: string;   // Dateiname im Speicher
  webviewPath: string; // Pfad zum Anzeigen im <img>
}

const PHOTO_STORAGE = 'photos'; // Schlüssel für die Preferences-Liste
const photos = ref<UserPhoto[]>([]);

export const usePhotoGallery = () => {

  // Ein neues Foto aufnehmen und speichern
  const takePhoto = async () => {
    const result = await Camera.takePhoto({ quality: 90 });

    const fileName = Date.now() + '.jpeg';
    const savedFile = await savePicture(result, fileName);

    // Vorne in die Liste einfügen (neuestes zuerst)
    photos.value = [savedFile, ...photos.value];

    // Liste in Preferences merken
    await Preferences.set({
      key: PHOTO_STORAGE,
      value: JSON.stringify(photos.value),
    });
  };

  // Das Bild dauerhaft ins Dateisystem schreiben
  const savePicture = async (photo: any, fileName: string): Promise<UserPhoto> => {
    let base64Data: string;

    if (Capacitor.isNativePlatform()) {
      // Auf dem Handy: Datei über die URI einlesen
      const file = await Filesystem.readFile({ path: photo.uri });
      base64Data = file.data as string;
    } else {
      // Im Browser: das Bild steckt in "thumbnail" (base64)
      base64Data = photo.thumbnail;
    }

    const savedFile = await Filesystem.writeFile({
      path: fileName,
      data: base64Data,
      directory: Directory.Data,
    });

    if (Capacitor.isNativePlatform()) {
      // Auf dem Handy: URI in einen anzeigbaren Pfad umwandeln
      return {
        filepath: savedFile.uri,
        webviewPath: Capacitor.convertFileSrc(savedFile.uri),
      };
    } else {
      // Im Browser: den webPath direkt nutzen
      return {
        filepath: fileName,
        webviewPath: photo.webPath,
      };
    }
  };

  // Beim App-Start: gespeicherte Fotos wieder laden
  const loadSaved = async () => {
    const { value } = await Preferences.get({ key: PHOTO_STORAGE });
    const photosInPreferences = value ? JSON.parse(value) : [];

    // Im Browser müssen wir die Bilddaten aus dem Dateisystem neu einlesen
    if (!Capacitor.isNativePlatform()) {
      for (const photo of photosInPreferences) {
        const file = await Filesystem.readFile({
          path: photo.filepath,
          directory: Directory.Data,
        });
        photo.webviewPath = `data:image/jpeg;base64,${file.data}`;
      }
    }

    photos.value = photosInPreferences;
  };

  // Ein Foto löschen
  const deletePhoto = async (photo: UserPhoto) => {
    // Aus der Liste entfernen
    photos.value = photos.value.filter((p) => p.filepath !== photo.filepath);

    // Aktualisierte Liste merken
    await Preferences.set({
      key: PHOTO_STORAGE,
      value: JSON.stringify(photos.value),
    });

    // Datei aus dem Dateisystem löschen
    const fileName = photo.filepath.substring(photo.filepath.lastIndexOf('/') + 1);
    try {
      await Filesystem.deleteFile({
        path: fileName,
        directory: Directory.Data,
      });
    } catch (e) {
      console.error('Datei löschen fehlgeschlagen:', e);
    }
  };

  return {
    photos,
    takePhoto,
    loadSaved,
    deletePhoto,
  };
};