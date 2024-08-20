import { useState, useEffect } from 'react';
import Image from 'next/image';
import downloadPhoto from "../utils/downloadPhoto";
import appendNewToName from "../utils/appendNewToName";

export default function PredictionResults({ predictionId, originalPhoto, onReset }: { predictionId: string, originalPhoto: string, onReset: () => void }) {
  const [prediction, setPrediction] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const pollPrediction = async () => {
      try {
        const res = await fetch(`/api/predictions/${predictionId}`);
        const data = await res.json();

        if (data.status === 'succeeded') {
          setPrediction(data);
        } else if (data.status === 'failed') {
          setError('Prediction failed');
        } else {
          // If still processing, poll again after a delay
          setTimeout(pollPrediction, 1000);
        }
      } catch (err) {
        setError('Error fetching prediction');
      }
    };

    pollPrediction();
  }, [predictionId]);

  if (error) return <div>Error: {error}</div>;
  if (!prediction) return <div>Loading...</div>;

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="flex sm:space-x-4 sm:flex-row flex-col">
        <div>
          <h2 className="mb-1 font-medium text-lg">Original Photo</h2>
          <Image
            alt="original photo"
            src={originalPhoto}
            className="rounded-2xl"
            width={400}
            height={400}
          />
        </div>
        <div className="sm:mt-0 mt-8">
          <h2 className="mb-1 font-medium text-lg">Generated Headshot</h2>
          <a href={prediction.output[0]} target="_blank" rel="noreferrer">
            <Image
              alt="restored photo"
              src={prediction.output[0]}
              className="rounded-2xl cursor-zoom-in"
              width={400}
              height={400}
            />
          </a>
        </div>
      </div>
      <div className="flex space-x-4 justify-center mt-8">
        <button
          onClick={() => {
            downloadPhoto(prediction.output[0], appendNewToName("generated-headshot.png"));
          }}
          className="bg-blue-500 rounded-full text-white font-medium px-4 py-2 hover:bg-blue-500/80 transition"
        >
          Download Generated Headshot
        </button>
        <button
          onClick={onReset}
          className="bg-white rounded-full text-black border font-medium px-4 py-2 hover:bg-gray-100 transition"
        >
          Generate Another Headshot
        </button>
      </div>
    </div>
  );
}
