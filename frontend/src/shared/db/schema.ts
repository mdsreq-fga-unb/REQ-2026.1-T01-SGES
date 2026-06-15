import Dexie, { type Table } from 'dexie';

export interface OfflineMutation {
  id?: number;
  url: string;
  method: 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  payload: string; // Criptografado (JSON stringificado e cifrado)
  timestamp: number;
}

export interface CachedData {
  key: string;
  data: any;
  updatedAt: number;
}

class SgesDatabase extends Dexie {
  offlineQueue!: Table<OfflineMutation, number>;
  structuralCache!: Table<CachedData, string>;

  constructor() {
    super('sges_db');
    this.version(1).stores({
      offlineQueue: '++id, timestamp',
      structuralCache: 'key, updatedAt',
    });
  }
}

export const db = new SgesDatabase();

// --- Utilitários de Criptografia Simples para a Fila Offline (LGPD) ---
// Em produção, a chave deve ser derivada dinamicamente (PBKDF2) da senha do usuário
// durante o login e mantida estritamente em memória do processo (sessionStorage/state).
const ENCRYPTION_KEY_NAME = 'sges_session_key';

export function getSessionKey(): string | null {
  return sessionStorage.getItem(ENCRYPTION_KEY_NAME);
}

export function setSessionKey(key: string): void {
  sessionStorage.setItem(ENCRYPTION_KEY_NAME, key);
}

export function clearSessionKey(): void {
  sessionStorage.removeItem(ENCRYPTION_KEY_NAME);
}

/**
 * Criptografa dados sensíveis salvos offline.
 * Atualmente usa codificação Base64 como stub extensível, mas deve ser substituído
 * por criptografia real baseada em Web Crypto API (AES-GCM) em ambiente de produção.
 */
export function encryptPayload(data: any): string {
  const jsonStr = JSON.stringify(data);
  const key = getSessionKey() || 'default_local_key';
  
  // Exemplo de cifragem simples XOR com a chave para evitar plaintext imediato
  let result = '';
  for (let i = 0; i < jsonStr.length; i++) {
    const charCode = jsonStr.charCodeAt(i) ^ key.charCodeAt(i % key.length);
    result += String.fromCharCode(charCode);
  }
  return btoa(unescape(encodeURIComponent(result)));
}

/**
 * Descriptografa dados recuperados do IndexedDB.
 */
export function decryptPayload(encryptedStr: string): any {
  const rawStr = decodeURIComponent(escape(atob(encryptedStr)));
  const key = getSessionKey() || 'default_local_key';
  
  let result = '';
  for (let i = 0; i < rawStr.length; i++) {
    const charCode = rawStr.charCodeAt(i) ^ key.charCodeAt(i % key.length);
    result += String.fromCharCode(charCode);
  }
  return JSON.parse(result);
}
