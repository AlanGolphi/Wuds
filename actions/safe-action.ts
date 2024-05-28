import {createSafeActionClient, DEFAULT_SERVER_ERROR} from 'next-safe-action'

export const action = createSafeActionClient({
  handleReturnedServerError: (e) => {
    if (e instanceof Error) {
      return e.message
    }

    return DEFAULT_SERVER_ERROR;
  },
});