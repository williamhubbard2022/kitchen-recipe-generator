// netlify/functions/test.js
exports.handler = async (event, context) => {
  console.log('Test function called!');
  console.log('Method:', event.httpMethod);
  console.log('Query params:', event.queryStringParameters);
  console.log('Environment vars check:', {
    hasGithubToken: !!process.env.GITHUB_TOKEN,
    hasGithubRepo: !!process.env.GITHUB_REPO,
    githubRepo: process.env.GITHUB_REPO
  });
  
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      message: 'Test function works!',
      timestamp: new Date().toISOString(),
      method: event.httpMethod,
      path: event.path,
      environment: {
        hasGithubToken: !!process.env.GITHUB_TOKEN,
        hasGithubRepo: !!process.env.GITHUB_REPO,
        githubRepo: process.env.GITHUB_REPO,
        tokenPrefix: process.env.GITHUB_TOKEN ? process.env.GITHUB_TOKEN.substring(0, 8) + '...' : 'missing'
      }
    })
  };
};
