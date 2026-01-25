'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Video, Mic, Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

const preJoinSchema = z.object({
  maxParticipants: z.number().min(2, '至少需要2个参与者').max(100, '最多100个参与者').optional(),
  emptyTimeout: z.number().min(60, '空闲超时至少60秒').max(86400, '空闲超时最多24小时').optional(),
  metadata: z.string().max(500, '元数据不能超过500个字符').optional(),
});

type PreJoinFormValues = z.infer<typeof preJoinSchema>;

interface PreJoinScreenProps {
  onCreateRoom: (data: PreJoinFormValues) => Promise<void>;
  onJoinRoom: (roomName: string, data: PreJoinFormValues) => Promise<void>;
  isCreating: boolean;
  isJoining: boolean;
}

export function PreJoinScreen({
  onCreateRoom,
  onJoinRoom,
  isCreating,
  isJoining,
}: PreJoinScreenProps) {
  const [mode, setMode] = React.useState<'create' | 'join'>('create');
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const form = useForm<PreJoinFormValues>({
    resolver: zodResolver(preJoinSchema),
    defaultValues: {},
  });

  const handleCreateRoom = async (data: PreJoinFormValues) => {
    await onCreateRoom(data);
  };

  const handleJoinRoom = async (data: PreJoinFormValues) => {
    console.log(data);
  };

  if (!mounted) {
    return null;
  }

  return (
    <div className="h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
      <div className="bg-gray-800/95 backdrop-blur-sm rounded-2xl p-8 max-w-lg w-full shadow-2xl">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Video className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">视频会议</h1>
          <p className="text-gray-400">创建或加入一个房间开始会议</p>
        </div>

        <div className="flex gap-2 mb-6 bg-gray-700/50 p-1 rounded-lg">
          <button
            onClick={() => setMode('create')}
            className={`flex-1 py-2 px-4 rounded-md font-medium transition-all ${
              mode === 'create' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'
            }`}
          >
            创建房间
          </button>
          <button
            onClick={() => setMode('join')}
            className={`flex-1 py-2 px-4 rounded-md font-medium transition-all ${
              mode === 'join' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'
            }`}
          >
            加入房间
          </button>
        </div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(mode === 'create' ? handleCreateRoom : handleJoinRoom)}
            className="space-y-4"
          >
            {mode === 'create' && (
              <>
                <FormField
                  control={form.control}
                  name="maxParticipants"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-300">
                        最大参与者数
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="默认20人"
                          min={2}
                          max={100}
                          className="bg-gray-700/50 border-gray-600 text-white placeholder-gray-500 focus-visible:border-blue-500"
                          value={field.value ?? ''}
                          onChange={(e) => {
                            const value = e.target.value ? parseInt(e.target.value, 10) : undefined;
                            field.onChange(value);
                          }}
                        />
                      </FormControl>
                      <div className="text-xs text-gray-500">2-100人，默认20人</div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="emptyTimeout"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-300">
                        空闲超时时间（秒）
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="默认300秒"
                          min={60}
                          max={86400}
                          className="bg-gray-700/50 border-gray-600 text-white placeholder-gray-500 focus-visible:border-blue-500"
                          value={field.value ?? ''}
                          onChange={(e) => {
                            const value = e.target.value ? parseInt(e.target.value, 10) : undefined;
                            field.onChange(value);
                          }}
                        />
                      </FormControl>
                      <div className="text-xs text-gray-500">60-86400秒，默认300秒（5分钟）</div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="metadata"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-300">房间描述</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="可选：添加房间描述"
                          maxLength={500}
                          className="bg-gray-700/50 border-gray-600 text-white placeholder-gray-500 focus-visible:border-blue-500"
                          value={field.value ?? ''}
                          onChange={field.onChange}
                        />
                      </FormControl>
                      <div className="text-xs text-gray-500">
                        {field.value ? `${field.value.length}/500` : '最多500个字符'}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}

            <Button
              type="submit"
              disabled={isCreating || isJoining}
              className="w-full h-14 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-600 text-white rounded-xl font-semibold shadow-lg"
            >
              {isCreating || isJoining ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  {mode === 'create' ? '正在创建房间...' : '正在加入房间...'}
                </>
              ) : (
                <>
                  {mode === 'create' ? (
                    <>
                      <Video className="w-5 h-5" />
                      创建房间
                    </>
                  ) : (
                    <>
                      <Video className="w-5 h-5" />
                      加入房间
                    </>
                  )}
                </>
              )}
            </Button>
          </form>
        </Form>

        <div className="mt-6 pt-6 border-t border-gray-700">
          <p className="text-center text-sm text-gray-500">
            💡 提示：即使没有摄像头也可以加入，只用麦克风聊天
          </p>
        </div>
      </div>
    </div>
  );
}
