import { Component } from '@angular/core';
import { FilePicker } from '@capawesome/capacitor-file-picker';
import { Chooser } from "@awesome-cordova-plugins/chooser/ngx";
import { AlertController } from '@ionic/angular';
import { Storage, getDownloadURL, ref, uploadBytes } from '@angular/fire/storage';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  duration: Number = 0;
  constructor(private alertController: AlertController,
    private storage: Storage, private chooser: Chooser) { }
  // Error on upload
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
        multiple: false,
        readData: true
      });
      console.log(video.files[0].data);
      const base64String = 'data:video/mp4;base64,' + video.files[0].data;
      console.log(base64String);
      const blob = this.dataURItoBlob(base64String);
      console.log(blob);
      await this.uploadImage(blob, "mp4");


    } catch (e) {
      console.log(e);
    }
  }


  dataURItoBlob(dataURI: any) {
    const byteString = atob(dataURI.split(',')[1]);
    const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const uint8Array = new Uint8Array(arrayBuffer);

    for (let i = 0; i < byteString.length; i++) {
      uint8Array[i] = byteString.charCodeAt(i);
    }

    return new Blob([arrayBuffer], { type: mimeString });
  }
  async uploadImage(blob: any, format: any) {
    try {
      const currentDate = Date.now();
      const filePath = `test/${currentDate}.${format}`;
      const fileRef = ref(this.storage, filePath);
      const task = await uploadBytes(fileRef, blob);
      console.log('task: ', task);
      const url = getDownloadURL(fileRef);
      console.log('File uploaded successfully:', url);
    } catch (e) {
      throw (e);
    }
  }



}
