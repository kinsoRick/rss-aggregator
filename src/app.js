import onChange from 'on-change';
import * as yup from 'yup';
import axios from 'axios';
import i18next from 'i18next';

import render from './render.js';

import getRssData, { checkUpdates } from './rss.js';
import constants from './constant.js';
import resources from './locales/index.js';

const refreshFeeds = (state) => {
  const currentPostsLinks = [...state.posts].map((post) => post.link);

  const rssPromises = [...state.feeds].map((feed) => checkUpdates(feed.link, currentPostsLinks)
    .then((response) => {
      const { posts } = response;
      // if (posts.length > 0) state.posts[0] = [...posts, ...state.posts[0]];
      if (posts.length > 0) {
        state.posts.splice(0, 0, ...posts);
      }
    })
    .catch((err) => {
      throw new Error(`Unexpected error -> ${err.message}`);
    }));

  const updateTime = 1000 * 5;
  return Promise.all(rssPromises).then(() => setTimeout(refreshFeeds, updateTime, state));
};

const setRssToState = (url, state) => {
  getRssData(url)
    .then((data) => {
      state.posts.splice(0, 0, ...data.posts);
      state.feeds.splice(0, 0, data.feed);
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

const formHandler = (state, form) => {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const target = form;
    const formData = new FormData(target);
    const urlProvided = formData.get('url').toString();

    const allLinks = [...state.feeds].map((feed) => feed.link);

    const schema = yup
      .string()
      .required(constants.errors.REQUIRED)
      .url(constants.errors.NOT_URL)
      .notOneOf(allLinks, constants.errors.ALREADY);

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

const buttonHandler = (state, postsContainer) => {
  postsContainer.addEventListener('click', (e) => {
    e.preventDefault();
    const { target } = e;
    if (target.dataset.bsToggle !== undefined) {
      const postId = parseInt(target.dataset.id, 10);
      const posts = [...state.posts];
      const clickedPost = posts.find((post) => post.id === postId);
      state.postsViewed.current = clickedPost;
      state.postsViewed.all.push(clickedPost.id);
    }
  });
};

const app = () => {
  const nodes = constants.nodes();
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

  const i18n = i18next.createInstance();
  i18n.init({
    lng: 'ru',
    debug: true,
    resources,
  }).then(() => {
    const watchedState = onChange(state, (path) => {
      render(state, path, i18n.t);
    });

    formHandler(watchedState, nodes.form);
    buttonHandler(watchedState, nodes.posts);
    refreshFeeds(watchedState);
  });
};

export default app;
