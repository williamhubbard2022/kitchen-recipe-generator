// netlify/functions/github-sync.js
exports.handler = async (event, context) => {
  // Handle CORS
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
      },
      body: ''
    };
  }

  try {
    const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
    const GITHUB_REPO = process.env.GITHUB_REPO; // format: "username/repo-name"
    
    if (!GITHUB_TOKEN || !GITHUB_REPO) {
      return {
        statusCode: 500,
        headers: { 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify({ 
          error: 'GitHub credentials not configured',
          details: 'Missing GITHUB_TOKEN or GITHUB_REPO environment variables'
        })
      };
    }

    const { method } = event;
    const { userId, ingredients, equipment } = method === 'GET' ? 
      { userId: event.queryStringParameters?.userId } : 
      JSON.parse(event.body || '{}');

    if (!userId) {
      return {
        statusCode: 400,
        headers: { 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify({ error: 'User ID is required' })
      };
    }

    const fileName = `data/${userId}.json`;
    const apiUrl = `https://api.github.com/repos/${GITHUB_REPO}/contents/${fileName}`;

    switch (method) {
      case 'GET':
        // Get user's data from GitHub
        try {
          const response = await fetch(apiUrl, {
            headers: {
              'Authorization': `token ${GITHUB_TOKEN}`,
              'Accept': 'application/vnd.github.v3+json'
            }
          });

          if (response.status === 404) {
            // File doesn't exist yet - return empty data
            return {
              statusCode: 200,
              headers: { 'Access-Control-Allow-Origin': '*' },
              body: JSON.stringify({
                ingredients: [],
                equipment: [],
                lastUpdated: null
              })
            };
          }

          if (!response.ok) {
            throw new Error(`GitHub API error: ${response.status}`);
          }

          const fileData = await response.json();
          const content = JSON.parse(Buffer.from(fileData.content, 'base64').toString());

          return {
            statusCode: 200,
            headers: { 'Access-Control-Allow-Origin': '*' },
            body: JSON.stringify(content)
          };

        } catch (error) {
          console.error('Error fetching from GitHub:', error);
          return {
            statusCode: 200,
            headers: { 'Access-Control-Allow-Origin': '*' },
            body: JSON.stringify({
              ingredients: [],
              equipment: [],
              lastUpdated: null
            })
          };
        }

      case 'POST':
        // Save user's data to GitHub
        const dataToSave = {
          ingredients: ingredients || [],
          equipment: equipment || [],
          lastUpdated: new Date().toISOString()
        };

        const content = Buffer.from(JSON.stringify(dataToSave, null, 2)).toString('base64');

        try {
          // First, try to get the file to get its SHA (needed for updates)
          let sha = null;
          try {
            const getResponse = await fetch(apiUrl, {
              headers: {
                'Authorization': `token ${GITHUB_TOKEN}`,
                'Accept': 'application/vnd.github.v3+json'
              }
            });
            if (getResponse.ok) {
              const fileData = await getResponse.json();
              sha = fileData.sha;
            }
          } catch (e) {
            // File doesn't exist, that's okay
          }

          // Create or update the file
          const saveResponse = await fetch(apiUrl, {
            method: 'PUT',
            headers: {
              'Authorization': `token ${GITHUB_TOKEN}`,
              'Accept': 'application/vnd.github.v3+json',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              message: `Update kitchen data for ${userId}`,
              content: content,
              ...(sha && { sha })
            })
          });

          if (!saveResponse.ok) {
            const errorText = await saveResponse.text();
            throw new Error(`GitHub save error: ${saveResponse.status} - ${errorText}`);
          }

          return {
            statusCode: 200,
            headers: { 'Access-Control-Allow-Origin': '*' },
            body: JSON.stringify({ success: true, data: dataToSave })
          };

        } catch (error) {
          console.error('Error saving to GitHub:', error);
          return {
            statusCode: 500,
            headers: { 'Access-Control-Allow-Origin': '*' },
            body: JSON.stringify({ 
              error: 'Failed to save data',
              details: error.message
            })
          };
        }

      default:
        return {
          statusCode: 405,
          headers: { 'Access-Control-Allow-Origin': '*' },
          body: JSON.stringify({ error: 'Method not allowed' })
        };
    }

  } catch (error) {
    console.error('Sync error:', error);
    return {
      statusCode: 500,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ 
        error: 'Internal server error',
        details: error.message
      })
    };
  }
};
