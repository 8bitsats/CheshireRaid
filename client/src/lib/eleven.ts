const ELEVEN_LABS_API_URL = 'https://api.elevenlabs.io/v1';

export async function synthesizeSpeech(
  text: string
): Promise<ArrayBuffer | null> {
  try {
    const response = await fetch(`${ELEVEN_LABS_API_URL}/text-to-speech`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'xi-api-key': import.meta.env.VITE_ELEVEN_LABS_API_KEY
      },
      body: JSON.stringify({
        text,
        voice_id: import.meta.env.VITE_ELEVEN_LABS_AGENT_ID,
        model_id: 'eleven_multilingual_v2'
      })
    });

    if (!response.ok) {
      throw new Error('Speech synthesis failed');
    }

    return response.arrayBuffer();
  } catch (error) {
    console.error("Error synthesizing speech:", error);
    return null;
  }
}

export async function playAudio(audioBuffer: ArrayBuffer): Promise<void> {
  const audioContext = new AudioContext();
  const audioSource = audioContext.createBufferSource();
  
  try {
    const decodedAudio = await audioContext.decodeAudioData(audioBuffer);
    audioSource.buffer = decodedAudio;
    audioSource.connect(audioContext.destination);
    audioSource.start(0);
  } catch (error) {
    console.error("Error playing audio:", error);
  }
}
