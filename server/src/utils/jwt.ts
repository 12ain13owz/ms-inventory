import config from 'config';
import { SignOptions, sign, verify } from 'jsonwebtoken';
import log from './logger';

export function signAccessToken(userId: number): string | null {
  try {
    const accessToken = signJwt({ userId }, 'accessTokenPrivateKey', {
      expiresIn: '1d',
    });

    return accessToken;
  } catch (error) {
    const e = error as Error;
    log.error(`signAccessToken: ${e.message}`);

    return null;
  }
}

export function signRefreshToken(userId: number): string | null {
  try {
    const refreshtoken = signJwt({ userId }, 'refreshTokenPrivateKey', {
      expiresIn: '7d',
    });

    return refreshtoken;
  } catch (error) {
    const e = error as Error;
    log.error(`signRefreshToken: ${e.message}`);

    return null;
  }
}

export function signJwt(
  object: Record<string, unknown>,
  keyName: 'accessTokenPrivateKey' | 'refreshTokenPrivateKey',
  options?: SignOptions | undefined
): string | null {
  try {
    const signingKey = config.get<string>(keyName);

    return sign(object, signingKey, {
      algorithm: 'RS256',
      ...(options && options),
    });
  } catch (error) {
    const e = error as Error;
    log.error(`signJwt: ${e.message}`);

    return null;
  }
}

export function verifyJwt<T>(
  token: string,
  keyName: 'accessTokenPublicKey' | 'refreshTokenPublicKey'
): T | null {
  try {
    const publicKey = config.get<string>(keyName);
    const decode = verify(token, publicKey) as T;

    return decode;
  } catch (error) {
    const e = error as Error;
    log.error(`verifyJwt: ${e.message}`);

    return null;
  }
}

export function verifyAccessToken(token: string): string | null {
  try {
    const keyName = 'accessTokenPublicKey';
    const publicKey = config.get<string>(keyName);
    verify(token, publicKey);

    return null;
  } catch (error) {
    const e = error as Error;
    const errorMessage = e.message === 'jwt expired' ? null : e.message;

    log.error(`verifyAccessToken: ${e.message}`);
    return errorMessage;
  }
}
