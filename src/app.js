import onChange from 'on-change';
import { flatten } from 'lodash';
import * as yup from 'yup';
import axios from 'axios';

import render from './render.js';
import nodes from './nodes.js';

import getRssData, { checkUpdates } from './rss.js';
import constants from './constant.js';

const refreshFeeds = (state) => {
  const currentPostsLinks = flatten([...state.posts]).map((post) => post.link);

  const RssPromises = [...state.feeds].map((feed) => checkUpdates(feed.link, currentPostsLinks)
    .then((response) => {
      const { posts } = response;
      if (posts.length > 0) state.posts[0].unshift(...posts);
    })
    .catch((err) => {
      console.log(err);
    }));

  return Promise.all(RssPromises).then(() => setTimeout(refreshFeeds, 5000, state));
};

const setRssToState = (url, state) => {
  getRssData(url)
    .then((data) => {
      state.posts.unshift(data.posts);
      state.feeds.unshift(data.feed);
      state.status = constants.status.RECEIVED;
    })
    .catch((err) => {
      if (axios.isAxiosError(err)) {
        state.error = constants.errors.NETWORK;
      }
      if (err.message === constants.errors.PARSE) {
        state.error = constants.errors.PARSE;
      }
      state.status = constants.status.INVALID;
    });
};

const formHandler = (schema, state) => {
  nodes.form.addEventListener('submit', (e) => {
    e.preventDefault();
    const target = nodes.form;
    const formData = new FormData(target);
    const urlProvided = formData.get('url').toString();

    schema
      .validate(urlProvided)
      .then(() => {
        state.status = constants.status.SENDING;
        state.error = null;
        setRssToState(urlProvided, state);
      })
      .catch((error) => {
        state.error = error.message;
        state.status = constants.status.INVALID;
      });
  });
};

const buttonHandler = (state) => {
  nodes.posts.addEventListener('click', (e) => {
    e.preventDefault();
    const { target } = e;
    if (target.dataset.bsToggle !== undefined) {
      const postId = parseInt(target.dataset.id, 10);
      const posts = flatten([...state.posts]);
      const clickedPost = posts.filter((post) => post.id === postId)[0];
      state.postsViewed.current = clickedPost;
      state.postsViewed.all.push(clickedPost.id);
    }
  });
};

const isUrlInFeeds = (url, feeds) => {
  const feedWithUrl = feeds.slice().filter((feed) => feed.link === url);
  return feedWithUrl.length === 1;
};

const app = (translation) => {
  const state = {
    status: constants.status.FILLING,
    posts: [],
    postsViewed: {
      current: null,
      all: [],
    },
    feeds: [],
    error: null,
  };

  translation.promise.then(() => {
    const watchedState = onChange(state, (path) => {
      render(state, path, translation.instance.t);
    });

    const schema = yup
      .string()
      .required(constants.errors.REQUIRED)
      .url(constants.errors.NOT_URL)
      .test(
        'is url in feeds?',
        constants.errors.ALREADY,
        (value) => isUrlInFeeds(value, state.feeds) === false,
      );

    formHandler(schema, watchedState);
    buttonHandler(watchedState);
    refreshFeeds(watchedState);
  });
};

export default app;
