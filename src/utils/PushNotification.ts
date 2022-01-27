const admin = require('firebase-admin');

const path = require('path');

// const admin = require('firebase-admin');
// const dirPath = path.join('./firebase/kpmg-firebase.json');

const serviceAccount = require('./firebase/kpmg-firebase.json');

export class PushNotification {
  constructor(dirPath = './firebase/kpmg-firebase.json') {
    if (
      typeof admin !== 'undefined' &&
      typeof admin.apps !== 'undefined' &&
      admin.apps.length > 0
    ) {
      // console.log('EXIST', admin)
    } else {
      admin.initializeApp({
        // credential: admin.credential.cert(path.join(dirPath))
        credential: admin.credential.cert(serviceAccount)
      });
    }

    // console.log(dirPath);
    // if (!admin.apps.length) {
    //   admin.initializeApp({
    //     // credential: admin.credential.cert(path.join(dirPath))
    //     credential: admin.credential.cert(serviceAccount)
    //   });
    // }
  }

  public finish() {
    // Kill this firebase app.
    admin.app().delete();
  }

  public async sendPush(
    pushToken: string,
    platform: string,
    title: string,
    body: string,
    data = {}
  ) {
    try {
      const message = {
        token: pushToken,
        notification: {
          title,
          body
        }
      } as any;
      const sizeData = Object.keys(data).length;

      if (platform === 'a') {
        message.android = {
          priority: 'high'
        };

        if (sizeData > 0) {
          message.android.data = data;
          message.android.data.click_action = 'FLUTTER_NOTIFICATION_CLICK';
        }
      } else if (platform === 'i') {
        message.apns = {
          headers: {
            'apns-priority': '10'
          }
        };

        if (sizeData > 0) {
          message.apns.data = data;
          message.apns.data.click_action = 'FLUTTER_NOTIFICATION_CLICK';
        }
      } else if (platform === 'w') {
        // ? En caso de enviar la notificación a web usa el tag webpush
      }

      if (sizeData > 0) {
        message.data = data;
        message.data.click_action = 'FLUTTER_NOTIFICATION_CLICK';
      }

      const resultMessage = await admin.messaging().send(message);

      return {
        code: 100,
        data: resultMessage
      };
    } catch (error) {
      console.log('Error sending message:', error);

      return {
        code: 102,
        message: 'Ocurrió un error desde firebase',
        error
      };
    }
  }

  public async sendMulticast(
    tokens: [],
    title: string,
    body: string,
    data = {}
  ) {
    try {
      const message = {
        tokens,
        notification: {
          title,
          body
        }
      } as any;
      const sizeData = Object.keys(data).length;

      if (sizeData > 0) {
        message.data = data;
        message.data.click_action = 'FLUTTER_NOTIFICATION_CLICK';
      }

      const resultMessage = await admin.messaging().sendMulticast(message);

      return {
        code: 100,
        data: resultMessage
      };
    } catch (error) {
      console.log('Error sending message:', error);

      return {
        code: 102,
        message: 'Ocurrió un error desde firebase',
        error
      };
    }
  }
}
