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
  // Upload from gallery
  async chooseVideoFromGallery() {
    try {
      const video = await FilePicker.pickFiles({
        types: ['video/mp4'],
        multiple: false,
        readData: true
      });
      const duration = video.files[0].duration;
      this.duration = duration!;
      if (duration! <= 90) {
        console.log(video.files[0].data);
        const base64String = 'data:video/mp4;base64,' + video.files[0].data;
        console.log(base64String);
        const blob = this.base64toBlob(base64String);
        console.log(blob);
        await this.uploadVideo(blob, "mp4");
      } else {
        this.presentErrorAlert();
      }
    } catch (e) {
      console.log(e);
    }
  }


  base64toBlob(dataURI: any) {
    const byteString = atob(dataURI.split(',')[1]);
    const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const uint8Array = new Uint8Array(arrayBuffer);

    for (let i = 0; i < byteString.length; i++) {
      uint8Array[i] = byteString.charCodeAt(i);
    }

    return new Blob([arrayBuffer], { type: mimeString });
  }
  async uploadVideo(blob: any, format: any) {
    try {
      const currentDate = new Date();
      const year = currentDate.getFullYear();
      const month = ('0' + (currentDate.getMonth() + 1)).slice(-2);
      const day = ('0' + currentDate.getDate()).slice(-2);
      const hours = ('0' + currentDate.getHours()).slice(-2);
      const minutes = ('0' + currentDate.getMinutes()).slice(-2);
      const seconds = ('0' + currentDate.getSeconds()).slice(-2);

      const fileName = `${year}-${month}-${day}_${hours}-${minutes}-${seconds}`;
      const filePath = `videos/${fileName}.${format}`;

      const fileRef = ref(this.storage, filePath);
      const task = await uploadBytes(fileRef, blob);

      console.log('Task:', task);

      const url = await getDownloadURL(fileRef);
      console.log('Video uploaded successfully:', url);
    } catch (e) {
      throw e;
    }
  }
  recordVideo() {
    throw new Error('Method not implemented.');
  }
}
