import axios from 'axios';
import parse from './parser.js';

const getUrlPromise = (url) => axios.get('https://allorigins.hexlet.app/get', {
  params: {
    disableCache: true,
    url,
  },
});

const getRssData = (url, links) => {
  const proxy = getUrlPromise(url);
  return proxy.then((res) => {
    const { posts, feed } = parse(res, links, url);

    return { feed, posts };
  });
};

export default getRssData;
