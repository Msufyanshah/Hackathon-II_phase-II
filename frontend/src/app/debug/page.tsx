'use client';

import React from 'react';

export default function DebugPage() {
  return (
    <div className="p-8">
      <h1>Environment Debug</h1>
      <pre>
        {JSON.stringify({
          NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
          NEXT_PUBLIC_BETTER_AUTH_URL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL,
        }, null, 2)}
      </pre>
    </div>
  );
}
