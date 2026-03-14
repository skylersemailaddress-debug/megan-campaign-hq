import { google } from 'googleapis';

export function getDrive(){
  const auth = new google.auth.GoogleAuth({
    scopes: ['https://www.googleapis.com/auth/drive']
  });
  return google.drive({version:'v3', auth});
}
