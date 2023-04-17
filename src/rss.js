import axios from 'axios';
import { uniqueId } from 'lodash';
import constants from './constant.js';
import parse from './parser.js';

const getUrlPromise = (url) => axios.get('https://allorigins.hexlet.app/get', {
  params: {
    disableCache: true,
    url,
  },
});

const parsePost = (post) => {
  const parsedPost = {
    id: parseInt(uniqueId(), 10) - 1,
    title: post.querySelector('title').textContent,
    description: post.querySelector('description').textContent,
    link: post.querySelector('link').textContent,
    viewed: false,
  };

  return parsedPost;
};

const parseFeed = (channel, url) => {
  const feed = {
    id: parseInt(uniqueId(), 10) - 1,
    title: channel.querySelector('title').textContent,
    description: channel.querySelector('description').textContent,
    link: url,
  };
  return feed;
};

export const checkUpdates = (url, links) => {
  const proxy = getUrlPromise(url);
  return proxy.then((res) => {
    const { data, error } = parse(res);
    if (error) {
      const context = new Error(constants.errors.PARSE);
      throw context;
    }

    const postsNodes = [...data.querySelectorAll('item')];
    const newPosts = postsNodes.filter((post) => {
      const link = post.querySelector('link').textContent;
      return links.includes(link) === false;
    });

    if (newPosts.length < 1) return { posts: [] };

    const posts = newPosts.map((post) => parsePost(post));

    return { posts };
  });
};

const getRssData = (url) => {
  const proxy = getUrlPromise(url);
  return proxy.then((res) => {
    const { data, error } = parse(res);
    if (error) {
      const context = new Error(constants.errors.PARSE);
      throw context;
    }

    const channel = data.querySelector('channel');
    const postsNodes = [...data.querySelectorAll('item')];

    const feed = parseFeed(channel, url);
    const posts = postsNodes.map((post) => parsePost(post));

    return { feed, posts };
  });
};

export default getRssData;
