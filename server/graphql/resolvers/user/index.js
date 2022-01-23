import resolve from '../../../lib/resolve';

const settings = { isPrivate: true };

function getUsers(_, _args, context) {
  const users = [
    {
      username: 'Paolo',
      email: 'paolo@gmail.com',
    },
    {
      username: 'Monica',
      email: 'monica@gmail.com',
    },
  ];
  console.log('getUsers context', context);
  return users;
}

export default {
  Query: {
    get_users: resolve(getUsers, settings),
  },
};
