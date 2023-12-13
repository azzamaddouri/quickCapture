import { Component } from '@angular/core';
import { FilePicker } from '@capawesome/capacitor-file-picker';
import { Chooser } from "@awesome-cordova-plugins/chooser/ngx";
import { AlertController, LoadingController, ToastController } from '@ionic/angular';
import { Storage, getDownloadURL, ref, uploadBytesResumable } from '@angular/fire/storage';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  duration: number = 0;
  uploadProgress: number = 0;
  uploadLoader!: HTMLIonLoadingElement;
  constructor(private alertController: AlertController,
    private storage: Storage,
    private loadingController: LoadingController,
    private toastController: ToastController,
    private chooser: Chooser) { }
  
  async chooseVideoFromGallery() {
      await FilePicker.pickFiles({
        types: ['video/*'],
        multiple: false,
        readData: true
      }).then((video)=>{
        const duration = video.files[0].duration;
        this.duration = duration!;
        if (duration && duration! > 90 ) {
          this.presentErrorAlert('The selected video\'s duration should not be greater than 1mins30s !');
        } else{
          
          this.uploadVideo(video);
        }
      }).catch((e)=>{
        this.presentErrorAlert('Please choose a video with a duration of 1mins30s or less ');
        console.log(e);
      });
  }
  recordVideo() {
    throw new Error('Method not implemented.');
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
  async uploadVideo(video:any) {
    try {
       console.log(video.files[0]);
        const base64String = 'data:video/mp4;base64,' + video.files[0].data;
        console.log(base64String);
        const blob = this.base64toBlob(base64String);
        console.log(blob);
      const filePath = `videos/${video.files[0].name}.${video.files[0].mimeType.substring("video/".length)}`;
      const fileRef = ref(this.storage, filePath);
      const metadata = {
        contentType: blob.type,
      };
      const uploadTask = uploadBytesResumable(fileRef, blob, metadata);
      await this.presentLoading();
       /* const startTime = new Date().getTime();
       let prevTime = startTime; */
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          // Upload progress in terms of percentage
          this.uploadProgress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          this.uploadLoader.message = `Uploading: ${Math.round(this.uploadProgress)}%`;
          
         /*
         // Upload progress in terms of time remaining
         const currentTime = new Date().getTime();
          const elapsedTime = (currentTime - startTime) / 1000;
          const bytesTransferred = snapshot.bytesTransferred;
          const totalBytes = snapshot.totalBytes;
          if (elapsedTime > 0) {
            const bytesPerSecond = bytesTransferred / elapsedTime;
            const bytesRemaining = totalBytes - bytesTransferred;
            const timeRemaining = bytesRemaining / bytesPerSecond;
            this.uploadLoader.message = `Dismissing after ${Math.round(timeRemaining)} seconds...`;
          }
          prevTime = currentTime; */
        },
        (error) => {
          console.error('Upload error:', error);
          throw error;
        },
        async () => {
          const url = await getDownloadURL(fileRef);
          console.log('Video uploaded successfully:', url);
          await this.dismissLoading();
          await this.presentToast('Video uploaded successfully!');
        }
      );
    } catch (e) {
      throw e;
    }
  }
  async presentErrorAlert(message:string) {
    const alert = await this.alertController.create({
      header: 'Error',
      message:message,
      buttons: ['OK']
    });

    await alert.present();
  }
  async presentLoading() {
    this.uploadLoader = await this.loadingController.create({
      backdropDismiss: false,
      spinner:'circles'
    });

    await this.uploadLoader.present();
  }

  async dismissLoading() {
    if (this.uploadLoader) {
      await this.uploadLoader.dismiss();
    }
  }
  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      position: 'bottom',
      color: 'success'
    });
    await toast.present();
  }
 
 
}
