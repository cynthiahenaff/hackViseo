const rp = require('request-promise');

//Create Game
const createGame = async () => {
  const options = {
    uri:
      'https://us-central1-quiz2018bow.cloudfunctions.net/elmServerless/createGame',
    json: true,
  };
  const result = await rp(options);
  return result.sessionId;
};

//Next Question
const nextQuestion = async (sessionId, goodResponse) => {
  const options = {
    uri: `https://us-central1-quiz2018bow.cloudfunctions.net/elmServerless/nextQuestion/${sessionId}?response=${goodResponse}`,
    json: true,
  };
  const result = await rp(options);
  if (result.currentQuestion === null) {
    return {
      score: result.score,
    };
  }
  return {
    goodResponse: result.currentQuestion.question.ok,
    score: result.score,
  };
};

//Save Score
const saveScore = async (sessionId, score) => {
  const options = {
    method: 'POST',
    uri: `https://us-central1-quiz2018bow.cloudfunctions.net/elmServerless/addScore/${sessionId}`,
    body: {
      email: 'cynthia@henaff.io',
      firstName: 'Cynthia',
      isCallable: true,
      lastName: 'HENAFF',
      nickname: 'LOL',
      score: score,
    },
    json: true,
  };
  const result = await rp(options);
  console.log(result);
};

const main = async () => {
  //Create Game
  const sessionId = await createGame();

  //Next Question
  let lastResponse = await nextQuestion(sessionId, 'NOP');
  console.log(lastResponse);
  while (lastResponse.goodResponse !== undefined) {
    lastResponse = await nextQuestion(sessionId, lastResponse.goodResponse);
    console.log(lastResponse);
  }

  // Save Score
  await saveScore(sessionId, lastResponse.score);
};

main();
