import { Component, OnInit } from '@angular/core';
import { FingerprintAIO } from '@ionic-native/fingerprint-aio/ngx';
import { AlertController, NavController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  data = { userName: ''};

  constructor(
    private navController: NavController,
    private faio: FingerprintAIO,
    public alertController: AlertController
  ) { }

  ngOnInit() {
  }

  async presentAlert(title: string, msg: string) {
    const alert = await this.alertController.create({
      header: title,
      message: msg,
      buttons: ['OK']
    });

    await alert.present();
  }

  login() {
    if (!this.data.userName) {
      this.presentAlert('Warning', 'Please enter Username!');
      return;
    } else {
      this.faio.isAvailable().then(result => {
        if (result === 'finger' || result === 'face') {
          // Fingerprint or Face Auth is available
          this.faio.show({
            clientId: 'Fingerprint-Demo',
            clientSecret: 'nihinBioAuthDemo', // Only necessary for Android
            disableBackup: true, // Only for Android(optional)
            localizedFallbackTitle: 'Use Pin', // Only for iOS
            localizedReason: 'Please Authenticate' // Only for iOS
          // tslint:disable-next-line: no-shadowed-variable
          }).then((result: any) => {
            if (result === 'Success'){
              // Fingerprint/Face was successfully verified
              // Go to dashboard
              // this.setAndGet.UserName = this.data.userName;
              this.navController.navigateForward('/dashboard');
             } else {
              // Fingerprint/Face was not successfully verified
              this.presentAlert('Oops', result);
            }
          }).catch((error: any) => {
            // Fingerprint/Face was not successfully verified
            this.presentAlert('Error', error);
          });
        }
      });
    }
  }

}
