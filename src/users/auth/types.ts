export interface JwtAccessPayload {
  userId: string;
}

export interface JwtModuleConfig {
  secret: string;
  expiresIn: string;
}
