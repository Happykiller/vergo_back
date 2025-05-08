export class Configuration {
  public app_name?: string;

  public version?: string;

  public env?: {
    mode?: string;
    port?: number;
  };

  public graphQL?: {
    schemaFileName: boolean | string;
    playground?: boolean;
    introspection?: boolean;
    installSubscriptionHandlers?: boolean;
  };

  public jwt?: {
    refreshTokenName?: string;
    secret?: string;
    signOptions?: {
      expiresIn?: string;
    };
  };

  public db?: {
    connection_string?: string;
    name?: string;
  };

  public puppet?: {
    url?: string;
    token?: string;
  }

  public morgans?: {
    url?: string;
  }

  /**
   * request limitation per second
   * DOC https://docs.nestjs.com/security/rate-limiting
   */
  public throttle?: [
    {
      /**
       * ttl the number of seconds that each request will last in storage
       */
      ttl: number;
      /**
       * limit the maximum number of requests within the TTL limit
       */
      limit: number;
    },
  ];
}
