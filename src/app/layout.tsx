import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Jenson T Rajan — Software Engineer',
  description:
    'Software engineer building high-throughput distributed systems, AI-powered tooling, and full-stack products. Kafka, Spring Boot, FastAPI, RAG.',
  keywords: ['Jenson T Rajan', 'Software Engineer', 'Distributed Systems', 'Apache Kafka', 'Spring Boot', 'FastAPI', 'AI', 'RAG', 'Full Stack'],
  authors: [{ name: 'Jenson T Rajan', url: 'https://byjenson.tech' }],
  openGraph: {
    title: 'Jenson T Rajan — Software Engineer',
    description: 'Building distributed systems, AI tooling, and full-stack products.',
    url: 'https://byjenson.tech',
    siteName: 'Jenson T Rajan',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Jenson T Rajan — Software Engineer',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}