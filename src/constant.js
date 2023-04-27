const constants = {
  status: {
    FILLING: 'FILLING',
    SENDING: 'SENDING',
    INVALID: 'INVALID',
    RECEIVED: 'RECEIVED',
    SUCCESS: 'SUCCESS',
  },
  errors: {
    UNKNOWN: 'UNKNOWN',
    REQUIRED: 'REQUIRED',
    NOT_URL: 'NOT_URL',
    ALREADY: 'ALREADY',
    PARSE: 'PARSE',
    NETWORK: 'NETWORK',
  },
  ui: {
    FEEDS: 'FEEDS',
    POSTS: 'POSTS',
    VIEW: 'VIEW',
  },
  nodes() {
    const elements = {
      form: document.querySelector('#rss-form'),
      label: document.querySelector('#feedback'),
      rssInput: document.querySelector('#url-input'),
      rssbtn: document.querySelector('button[type="submit"]'),
      feeds: document.querySelector('#feeds'),
      posts: document.querySelector('#posts'),
      modalTitle: document.querySelector('#modal-title'),
      modalInfo: document.querySelector('#additional-info'),
      modalBtn: document.querySelector('#learn-more-btn'),
    };
    return elements;
  },
};

export default constants;
