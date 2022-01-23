import { gql } from 'apollo-server';
import readTypeDefs from '../../lib/read-type-defs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const userTypeDefs = readTypeDefs(`${__dirname}/user`);

const base = gql`
  type Query
`;

const typeDefs = [
  base,
  userTypeDefs
]

export { typeDefs as default }
