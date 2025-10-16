import React, { useState } from 'react';
import { PlayIcon, EyeSlashIcon } from './Icons';

interface YoutubeEmbedProps {
  url: string;
  onDelete: () => void;
}

function getYoutubeVideoId(url: string): string | null {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  if (match && match[2].length === 11) {
    return match[2];
  }
  return null;
}

const YoutubeEmbed: React.FC<YoutubeEmbedProps> = ({ url, onDelete }) => {
  const [isVisible, setIsVisible] = useState(false);
  const videoId = getYoutubeVideoId(url);

  if (!videoId) {
    return (
      <div className="flex items-center justify-between p-2 bg-raisin-black/50 rounded">
        <p className="text-sm text-bone/70">Link do YouTube inválido: {url}</p>
        <button onClick={onDelete} className="text-bone/50 hover:text-bone text-xs">Remover</button>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <button onClick={() => setIsVisible(!isVisible)} className="flex items-center gap-2 text-bone hover:underline">
          {isVisible ? <EyeSlashIcon className="w-5 h-5" /> : <PlayIcon className="w-5 h-5" />}
          <span>{isVisible ? 'Ocultar Vídeo' : 'Mostrar Vídeo'}</span>
        </button>
        <button onClick={onDelete} className="text-bone/50 hover:text-bone text-xs">Remover</button>
      </div>
      {isVisible && (
        <div className="aspect-video">
          <iframe
            className="w-full h-full rounded-lg"
            src={`https://www.youtube.com/embed/${videoId}`}
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      )}
    </div>
  );
};

export default YoutubeEmbed;