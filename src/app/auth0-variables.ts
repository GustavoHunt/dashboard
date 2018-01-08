interface AuthConfig {
    CLIENT_ID: string;
    CLIENT_DOMAIN: string;
    AUDIENCE: string;
    REDIRECT: string;
    SCOPE: string;
  }
  
  export const AUTH_CONFIG: AuthConfig = {
    CLIENT_ID: '59c01c7a1af04b6c7037d72d',
    CLIENT_DOMAIN: 'msite.auth0.com',
    AUDIENCE: 'https://msite.auth0.com/api/v2/',
    REDIRECT: 'http://localhost:4200/dashboard',
    SCOPE: 'openid'
  };