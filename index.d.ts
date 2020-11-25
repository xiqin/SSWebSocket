interface SSWebSocketMessageEvent {
  data?: any;
}
interface SSWebSocketErrorEvent {
  message: string;
}
interface SSWebSocketCloseEvent {
  code?: number;
  reason?: string;
}

interface SSWebSocketParams {
  uri: string;
  protocols?: string | string[] | null;
  options?: {
    headers: { [headerName: string]: string };
    [optionName: string]: any;
  } | null;
  needReconnect?: boolean;
  // Reconnection interval (ms)
  reconnectInterval?: number;
  // Maximum number of reconnections
  maxReconnectAttempts?: number;
}

export default class SSWebSocket {
  static getInstance(params: SSWebSocketParams): void;
  sendMessage(data: string | ArrayBuffer | ArrayBufferView | Blob): void;
  sendGroupMessage(data: string | ArrayBuffer | ArrayBufferView | Blob): void;
  close(code?: number, reason?: string): void;
  onopen: (() => void) | null;
  onmessage: ((event: SSWebSocketMessageEvent) => void) | null;
  onerror: ((event: SSWebSocketErrorEvent) => void) | null;
  onclose: ((event: SSWebSocketCloseEvent) => void) | null;
}