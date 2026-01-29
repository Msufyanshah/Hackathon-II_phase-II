import React from 'react';
import Head from 'next/head';
import { BaseComponentProps } from '../../lib/types';

interface MetaTagsProps extends BaseComponentProps {
  title?: string;
  description?: string;
  keywords?: string;
  canonicalUrl?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogUrl?: string;
  twitterCard?: 'summary' | 'summary_large_image' | 'app' | 'player';
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
  robots?: 'index,follow' | 'noindex,nofollow' | 'noindex,follow' | 'index,nofollow';
  author?: string;
  viewport?: string;
  language?: string;
}

const MetaTags: React.FC<MetaTagsProps> = ({
  title = 'Todo Application',
  description = 'A secure and intuitive task management application',
  keywords = 'todo, tasks, productivity, management',
  canonicalUrl,
  ogTitle,
  ogDescription,
  ogImage = '/og-image.jpg',
  ogUrl,
  twitterCard = 'summary_large_image',
  twitterTitle,
  twitterDescription,
  twitterImage,
  robots = 'index,follow',
  author = 'Hackathon Team',
  viewport = 'width=device-width, initial-scale=1.0',
  language = 'en-US',
  children
}) => {
  return (
    <Head>
      {/* Essential SEO tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content={author} />
      <meta name="robots" content={robots} />
      <meta name="viewport" content={viewport} />
      <meta charSet="utf-8" />

      {/* Canonical URL */}
      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}

      {/* Open Graph tags for social media */}
      <meta property="og:title" content={ogTitle || title} />
      <meta property="og:description" content={ogDescription || description} />
      <meta property="og:type" content="website" />
      <meta property="og:image" content={ogImage} />
      <meta property="og:url" content={ogUrl || canonicalUrl} />
      <meta property="og:site_name" content="Todo Application" />
      <meta property="og:locale" content={language} />

      {/* Twitter Card tags */}
      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:title" content={twitterTitle || title} />
      <meta name="twitter:description" content={twitterDescription || description} />
      <meta name="twitter:image" content={twitterImage || ogImage} />

      {/* Language and localization */}
      <meta name="language" content={language} />
      <html lang={language.split('-')[0]} />

      {/* Additional SEO optimizations */}
      <meta name="theme-color" content="#ffffff" />
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-title" content="TodoApp" />
      <meta name="application-name" content="Todo Application" />

      {/* Preconnect for performance */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

      {children}
    </Head>
  );
};

export default MetaTags;