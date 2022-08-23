<div align="center">
  
# Valorant API - Authentication
  
[![Profile](https://github.com/valapi/.github/blob/main/128_valapi.png?raw=true)](https://github.com/valapi)
  
Valorant Authentication
  
[![LICENSE](https://badgen.net/badge/license/MIT/blue)](https://github.com/valapi/.github/blob/main/LICENSE)
[![Github](https://badgen.net/badge/icon/github?icon=github&label)](https://github.com/valapi)
[![Discord](https://badgen.net/badge/icon/discord?icon=discord&label)](https://discord.gg/pbyWbUYjyt)
  
</div>

-----------

> - **@valapi** isn't endorsed by Riot Games and doesn't reflect the views or opinions of Riot Games or anyone officially involved in producing or managing Riot Games properties. Riot Games, and all associated properties are trademarks or registered trademarks of Riot Games, Inc.
> - **@valapi** was created under [Riot Games' "Legal Jibber Jabber"](https://www.riotgames.com/en/legal)
> - [MIT License](https://github.com/valapi/.github/blob/main/LICENSE)

## Guide

Full Guide: **[Click Here](https://valapi.github.io/docs/PACKAGE/auth/Intro.html#contents)**

```typescript
import { Client } from '@valapi/auth';
```

### Client

```typescript
const AuthClient = new Client();
```

### Auth

```typescript
await AuthClient.login('BestUsername', 'SuperSecretPassword');
```

```typescript
if (AuthClient.isMultifactor === true) {

    await AuthClient.verify(428793 /* <--- Verify Code */);
    
}
```

### PlayerUUID (puuid)

```typescript
const puuid = AuthClient.parseToken();
```