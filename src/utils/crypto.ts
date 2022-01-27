import crypto from 'crypto';

const sectret_key = 'c83kYBmohfmopT12Z25UZiQ6IB2bnanR';
const ivs = crypto.randomBytes(16);

export class CryptoUtil {
  static decrypt = (str: string, iv: string) => {
    console.log('ivs', ivs);
    console.log('iv', Buffer.from(iv, 'hex'));
    const di = crypto.createDecipheriv(
      'aes-256-ctr',
      sectret_key,
      Buffer.from(iv, 'hex')
    );

    console.log('di contrase�a', di);

    return Buffer.concat([
      di.update(Buffer.from(str, 'hex')),
      di.final()
    ]).toString();
  };
}
