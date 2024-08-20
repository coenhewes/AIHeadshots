'use client';

import { useSearchParams } from 'next/navigation';
import PredictionClient from '../../components/PredictionClient';

export default function PredictionResultPage() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id');

  if (!id) {
    return <div>Error: No prediction ID provided</div>;
  }

  return <PredictionClient id={id} />;
}
