import { Metadata } from 'next';
import dynamic from 'next/dynamic';

export const metadata: Metadata = {
  title: 'Prediction Result',
  description: 'View your generated professional headshot',
};

// Dynamically import the client component with ssr disabled
const PredictionClient = dynamic(() => import('../../../components/PredictionClient'), { ssr: false });

export default function PredictionPage({ params }: { params: { id: string } }) {
  return <PredictionClient id={params.id} />;
}
