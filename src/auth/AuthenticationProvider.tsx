import React, {ReactNode} from 'react';
import {AuthProvider, TAuthConfig, TRefreshTokenExpiredEvent} from "react-oauth2-code-pkce";

interface AuthenticationProviderProps {
    children: ReactNode;
}

const authConfig: TAuthConfig = {
    clientId: process.env.REACT_APP_CLIENT_ID!,
    authorizationEndpoint: process.env.REACT_APP_AUTH_ENDPOINT!,
    tokenEndpoint: process.env.REACT_APP_TOKEN_ENDPOINT!,
    redirectUri: process.env.REACT_APP_REDIRECT_URI!,
    scope: process.env.REACT_APP_SCOPE,
    extraTokenParameters: {client_secret: process.env.REACT_APP_CLIENT_SECRET!},
    onRefreshTokenExpire: (event: TRefreshTokenExpiredEvent) => window.confirm('Session expired. Refresh page to continue using the site?') && event.login(),
}

const AuthenticationProvider = ({children}: AuthenticationProviderProps): JSX.Element => {
    return (
        <AuthProvider authConfig={authConfig}>
            {children}
        </AuthProvider>
    )
}

export {AuthenticationProvider}
