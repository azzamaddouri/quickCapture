import { Component } from '@angular/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { FilePicker } from '@capawesome/capacitor-file-picker';
import { Chooser } from "@awesome-cordova-plugins/chooser/ngx";
import { AlertController } from '@ionic/angular';
import { Firestore, addDoc, collection } from '@angular/fire/firestore';
import { Storage, getDownloadURL, ref, uploadBytes } from '@angular/fire/storage';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  duration: Number = 0;
  constructor(private alertController: AlertController, private firestore: Firestore,
    private storage: Storage, private chooser: Chooser) { }
  async presentErrorAlert() {
    const alert = await this.alertController.create({
      header: 'Error',
      message: 'The selected video\'s duration should not be greater than 1mins30s ',
      buttons: ['OK']
    });

    await alert.present();
  }
  async chooseVideoFromGallery() {
    try {
      const video = await FilePicker.pickFiles({
        types: ['video/mp4'],
        multiple: false
      });
      const path = video.files[0].path;
      const duration = video.files[0].duration;
      this.duration = duration!;
      if (/* duration! <= 90 */true) {
        /* const data = video.files[0].data!.split(',')[1];
        const mimeType = video.files[0].data!.split(';')[0].split(':')[1];
        const blob = this.dataURLtoBlob(data, mimeType); */
        const blob = this.dataURLtoBlob(video.files[0].data!);
        const url = await this.uploadVideo(blob, video.files[0].data!);
        console.log(url);
        const response = await this.addDocument('test', { videoUrl: url });
        console.log(response);

      } else {
        this.presentErrorAlert();
      }

    } catch (e) {
      console.log(e);
    }

  }
  dataURLtoBlob(dataurl: any) {
    var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
  }
  async uploadVideo(blob: any, videoData: any) {
    try {
      const currentDate = Date.now();
      const filePath = `test/${currentDate}.${videoData.format}`;
      const fileRef = ref(this.storage, filePath);
      const task = await uploadBytes(fileRef, blob);
      const url = getDownloadURL(fileRef);
      return url;
    } catch (e) {
      throw (e);
    }
  }

  addDocument(path: any, data: any) {
    const dataRef = collection(this.firestore, path);
    return addDoc(dataRef, data);
  } 
  recordVideo() { }
  chooseFile() {
    this.chooser.getFile().then((res) => {
      res?.path
    })
  }
}
