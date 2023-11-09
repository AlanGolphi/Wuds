interface Weather {
  results: {
    location: {
      id: string;
      name: string;
      country: string;
      path: string;
      timezone: string;
      timezone_offset: string;
    };
    now: {
      text: string;
      code: string;
      temperature: string;
    };
    last_update: string;
  }[];
}