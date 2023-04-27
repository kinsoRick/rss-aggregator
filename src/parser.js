import { uniqueId } from 'lodash';
import constants from './constant.js';

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

const parse = (response, links, url) => {
  const parser = new DOMParser();
  const data = parser.parseFromString(response.data.contents, 'text/xml');
  const error = data.querySelector('parsererror');
  const channel = data.querySelector('channel');
  const postsNodes = [...data.querySelectorAll('item')];

  if (error) {
    const context = new Error(constants.errors.PARSE);
    throw context;
  }

  const newPosts = postsNodes.filter((post) => {
    const link = post.querySelector('link').textContent;
    return !links.includes(link);
  });

  const posts = newPosts.map((post) => parsePost(post));
  const feed = parseFeed(channel, url);

  return {
    posts,
    feed,
  };
};

export default parse;
