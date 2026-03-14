import { readDriveFile } from './googleDriveMemory';

export async function loadMemory(){
  const campaignBrain=process.env.CAMPAIGN_BRAIN_FILE
    ? await readDriveFile(process.env.CAMPAIGN_BRAIN_FILE)
    : {};

  const workingMemory=process.env.WORKING_MEMORY_FILE
    ? await readDriveFile(process.env.WORKING_MEMORY_FILE)
    : {};

  return {campaignBrain,workingMemory};
}
