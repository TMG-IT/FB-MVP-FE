const BASE_URL = process.env.REACT_APP_BACKEND_API_BASE_URL;
const headers = {
  'Content-Type': 'application/json',
  accept: 'application/json'
};

export interface IAnswerPayload {
  text: string;
  answer_placeholder?: any;
  uuid: string;
}

export interface ISubscriptionPayload {
  first_name: string;
  last_name: string;
  email: string;
}

const getPrivacyPolicy = async () => {
  const url = `${BASE_URL}/policy`;
  const response = await fetch(url, {
    method: 'GET',
    headers: { ...headers }
  });
  const status = response.status;
  const data = await response.json();
  return { status, data };
};

const getTermsOfService = async () => {
  const url = `${BASE_URL}/terms`;
  const response = await fetch(url, {
    method: 'GET',
    headers: { ...headers }
  });
  const status = response.status;
  const data = await response.json();
  return { status, data };
};

const postSubscription = async (payload: ISubscriptionPayload) => {
  const url = `${BASE_URL}/subscribe`;
  const response = await fetch(url, {
    method: 'POST',
    headers: { ...headers },
    body: JSON.stringify({ ...payload })
  });
  const status = response.status;
  const data = await response.json();
  return { status, data };
};

const validateSessionCode = async (code: string) => {
  const url = `${BASE_URL}/sessions`;
  const response = await fetch(url, {
    method: 'POST',
    headers: { ...headers },
    body: JSON.stringify({ session_code: code })
  });
  const status = response.status;
  const data = await response.json();
  return { status, data };
};

const postUserAnswer = async (payload: IAnswerPayload, questionId: number) => {
  const url = `${BASE_URL}/questions/${questionId}/answers`;
  const response = await fetch(url, {
    method: 'POST',
    headers: { ...headers },
    body: JSON.stringify({
      ...payload
    })
  });
  const status = response.status;
  const data = await response.json();
  return { status, data };
};

export {
  validateSessionCode,
  postUserAnswer,
  postSubscription,
  getPrivacyPolicy,
  getTermsOfService
};
