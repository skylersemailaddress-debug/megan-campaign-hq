export async function sendGoogleChatAlert(message: string) {
  return {
    ok: false,
    message: 'Stub only. Wire GOOGLE_CHAT_WEBHOOK_URL to enable live alerts.',
    preview: message
  };
}

export async function createGoogleDoc(title: string, body: string) {
  return {
    ok: false,
    message: 'Stub only. Wire Google service credentials to enable document creation.',
    title,
    bodyPreview: body.slice(0, 200)
  };
}
