'use client';

import { useEffect, useState } from 'react';
import Image from "next/image";
import Header from "./Header";
import Footer from "./Footer";
import downloadPhoto from "../utils/downloadPhoto";
import appendNewToName from "../utils/appendNewToName";
import HeadshotGenerationLoader from "./HeadshotGenerationLoader";

export default function PredictionClient({ id }: { id: string }) {
  const [prediction, setPrediction] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const pollPrediction = async () => {
      try {
        const res = await fetch(`/api/predictions/${id}`);
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
  }, [id]);

  if (error) return <div>Error: {error}</div>;
  if (!prediction) return <HeadshotGenerationLoader />;

  return (
    <div className="flex max-w-6xl mx-auto flex-col items-center justify-center py-2 min-h-screen">
      <Header />
      <main className="flex flex-1 w-full flex-col items-center justify-center text-center px-4 mt-4 sm:mb-0 mb-8">
        <h1 className="mx-auto max-w-4xl font-display text-4xl font-bold tracking-normal text-black-800 sm:text-6xl mb-5">
          Your Generated <span className="text-blue-600">Headshot</span>
        </h1>
        <div className="flex sm:space-x-4 sm:flex-row flex-col">
          <div>
            <h2 className="mb-1 font-medium text-lg">Original Photo</h2>
            <Image
              alt="original photo"
              src={prediction.input.input_image}
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
        <button
          onClick={() => {
            downloadPhoto(prediction.output[0], appendNewToName("generated-headshot.png"));
          }}
          className="bg-blue-500 rounded-full text-white font-medium px-4 py-2 mt-8 hover:bg-blue-500/80 transition"
        >
          Download Generated Headshot
        </button>
      </main>
      <Footer />
    </div>
  );
}
