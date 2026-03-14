import { getDrive } from './googleDriveAuth';

export async function readDriveFile(fileId:string){
  const drive=getDrive();
  const res=await drive.files.get({fileId,alt:'media'},{responseType:'text'});
  return JSON.parse(res.data as string);
}

export async function writeDriveFile(fileId:string,data:any){
  const drive=getDrive();
  await drive.files.update({
    fileId,
    media:{
      mimeType:'application/json',
      body:JSON.stringify(data,null,2)
    }
  });
}
