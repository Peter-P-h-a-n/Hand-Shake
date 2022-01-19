import { initializeApp } from 'firebase/app';
import { ref, getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: '<your-api-key>',
  authDomain: '<your-auth-domain>',
  databaseURL: '<your-database-url>',
  storageBucket: 'gs://hand-shake-ffcf9.appspot.com',
};
export const firebaseApp = initializeApp(firebaseConfig);

export const storage = getStorage(firebaseApp);

export const getStorageRef = (name) => {
  return ref(storage, name);
};
