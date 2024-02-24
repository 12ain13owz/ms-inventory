import config from 'config';
import { SignOptions, sign, verify } from 'jsonwebtoken';
import log from './logger';
import { User } from '../models/user.model';
import { omit } from 'lodash';

export function signAccessToken(user: User, privateFields: string[]) {
  try {
    const payload = omit(user.dataValues, privateFields);
    const accessToken = signJwt(payload, 'accessTokenPrivateKey', {
      expiresIn: '1d',
    });

    return accessToken;
  } catch (error) {
    const e = error as Error;
    log.error(`signAccessToken: ${e.message}`);

    return null;
  }
}

export function signRefreshToken(userId: number) {
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
) {
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
) {
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
