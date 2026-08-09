// src\config\dev.example.ts
//
// Modèle versionné de `dev.ts`, lui-même gitignoré car il porte un secret.
// Installation d'un poste :
//
//   cp src/config/dev.example.ts src/config/dev.ts
//
// Ce qui dépend de la MACHINE (URL de la base, ports, URL des services voisins)
// n'a rien à faire ici : ces valeurs viennent de `.env.local` en natif et de
// `.env.docker` en conteneur, lues par `defaults.ts`. Ce fichier-ci ne porte que
// ce qui définit le MODE dev lui-même, identique sur tous les postes.
import { DeepPartial } from '@happykiller/sunny-apis';
import { Configuration } from '@src/config/configuration';

export const conf: DeepPartial<Configuration> = {
  env: {
    mode: 'dev',
  },
  graphQL: {
    schemaFileName: 'docs/gqlschema.gql',
  },
  jwt: {
    // Le hash d'un mot de passe est HmacSHA512(sha256(app_name + mdp),
    // jwt.secret) : ce secret doit valoir celui de la production pour qu'un
    // compte issu d'un dump restauré en local puisse se connecter. Sinon,
    // l'authentification échoue sans message explicite.
    secret: '<secret de production>',
    signOptions: {
      expiresIn: '8h',
    },
  },
};
