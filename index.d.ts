interface WebSocketMessageEvent {
  data?: any;
}
interface WebSocketErrorEvent {
  message: string;
}
interface WebSocketCloseEvent {
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
  // Number of reconnections
  reconnectAttempts?: number;
  // Maximum number of reconnections
  maxReconnectAttempts?: number;
}

export default class SSWebSocket {
  static getInstance(params: SSWebSocketParams): void;
  sendMessage(data: string | ArrayBuffer | ArrayBufferView | Blob): void;
  sendGroupMessage(data: string | ArrayBuffer | ArrayBufferView | Blob): void;
  close(code?: number, reason?: string): void;
  onopen: (() => void) | null;
  onmessage: ((event: WebSocketMessageEvent) => void) | null;
  onerror: ((event: WebSocketErrorEvent) => void) | null;
  onclose: ((event: WebSocketCloseEvent) => void) | null;
}