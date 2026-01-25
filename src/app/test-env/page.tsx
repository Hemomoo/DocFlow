'use client';

import React, { useEffect, useState } from 'react';

export default function EnvTestPage() {
  const [envVars, setEnvVars] = useState<Record<string, string>>({});

  useEffect(() => {
    setEnvVars({
      'NEXT_PUBLIC_SERVER_URL': process.env.NEXT_PUBLIC_SERVER_URL || 'undefined',
      'NEXT_PUBLIC_AUTH_LOGIN_URL': process.env.NEXT_PUBLIC_AUTH_LOGIN_URL || 'undefined',
      'NEXT_PUBLIC_WEBSOCKET_URL': process.env.NEXT_PUBLIC_WEBSOCKET_URL || 'undefined',
      'NODE_ENV': process.env.NODE_ENV || 'undefined',
    });
  }, []);

  return (
    <div className="p-8 bg-gray-900 min-h-screen text-white">
      <h1 className="text-2xl font-bold mb-4">环境变量测试</h1>
      <div className="space-y-2">
        {Object.entries(envVars).map(([key, value]) => (
          <div key={key} className="bg-gray-800 p-4 rounded-lg">
            <div className="text-gray-400 text-sm mb-1">{key}</div>
            <div className="text-green-400 font-mono">{value}</div>
          </div>
        ))}
      </div>
      <div className="mt-8 p-4 bg-yellow-900/50 rounded-lg">
        <p className="text-yellow-300">
          💡 如果 NEXT_PUBLIC_SERVER_URL 显示为 undefined 或空字符串，说明环境变量没有正确加载。
          请重启开发服务器：pnpm dev
        </p>
      </div>
    </div>
  );
}
