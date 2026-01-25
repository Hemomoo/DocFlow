import { clientRequest } from '../request';
import { QuickCreateRoomDto, LiveKitConnectionDetailsDto } from './type';

export class LivekitService {
  createRoom = async (data: QuickCreateRoomDto) => {
    console.log('Creating room with data:', data);

    const result = await clientRequest.post<LiveKitConnectionDetailsDto>('/livekit/quick-create', {
      params: data,
    });

    console.log('Room created:', result);

    return result;
  };
}
