import { registerAs } from '@intentjs/core';

export default registerAs('auth', () => ({
  /**
   * -----------------------------------------------------
   * JWT SECRET
   * -----------------------------------------------------
   *
   * This value is the secret of the JWT token.
   */
  secret: process.env.JWT_SECRET,

  /**
   * -----------------------------------------------------
   * JWT TTL
   * -----------------------------------------------------
   *
   * This value determines the life time of the jwt token.
   */
  ttl: process.env.JWT_TTL || '3h',
}));
