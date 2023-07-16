type EndPoint = {
  name: string;
  url: string;
  score: number;
  questionCount: number;
};

export const db: {
  endpoints: EndPoint[];
} = {
  endpoints: [],
};

export default {
  db,
};
