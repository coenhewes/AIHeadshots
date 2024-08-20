import { Metadata } from 'next';
import PredictionClient from '../../../components/PredictionClient';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Prediction Result',
  description: 'View your generated professional headshot',
};

export default function PredictionPage({ params }: { params: { id: string } }) {
  return <PredictionClient id={params.id} />;
}
