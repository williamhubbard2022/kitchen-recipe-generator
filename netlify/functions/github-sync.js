// netlify/functions/github-sync.js
exports.handler = async (event, context) => {
  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS'
      },
      body: ''
    };
  }

  try {
    // Debug logging
    console.log('=== FUNCTION START ===');
    console.log('Method:', event.httpMethod);
    console.log('Query params:', event.queryStringParameters);
    console.log('Body:', event.body);
    console.log('Environment check:', {
      hasToken: !!process.env.GITHUB_TOKEN,
      hasRepo: !!process.env.GITHUB_REPO,
      tokenPrefix: process.env.GITHUB_TOKEN ? process.env.GITHUB_TOKEN.substring(0, 10) + '...' : 'undefined',
      repoValue: process.env.GITHUB_REPO
    });

    const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
    const GITHUB_REPO = process.env.GITHUB_REPO; // Should be "williamhubbard2022/kitchen-recipe-generator"
    
    if (!GITHUB_TOKEN || !GITHUB_REPO) {
      console.error('Missing environment variables:', {
        hasToken: !!GITHUB_TOKEN,
        hasRepo: !!GITHUB_REPO,
        tokenLength: GITHUB_TOKEN ? GITHUB_TOKEN.length : 0,
        repoValue: GITHUB_REPO || 'undefined'
      });
      return {
        statusCode: 500,
        headers: { 
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          error: 'GitHub credentials not configured',
          details: `Missing ${!GITHUB_TOKEN ? 'GITHUB_TOKEN' : ''} ${!GITHUB_REPO ? 'GITHUB_REPO' : ''}`,
          debug: {
            hasToken: !!GITHUB_TOKEN,
            hasRepo: !!GITHUB_REPO,
            tokenLength: GITHUB_TOKEN ? GITHUB_TOKEN.length : 0,
            repoValue: GITHUB_REPO || 'undefined'
          }
        })
      };
    }

    const { httpMethod } = event;
    let userId, ingredients, equipment;

    if (httpMethod === 'GET') {
      userId = event.queryStringParameters?.userId;
      console.log('GET request for user:', userId);
    } else if (httpMethod === 'POST') {
      try {
        const body = JSON.parse(event.body || '{}');
        userId = body.userId;
        ingredients = body.ingredients;
        equipment = body.equipment;
        console.log('POST request for user:', userId, 'with', ingredients?.length || 0, 'ingredients and', equipment?.length || 0, 'equipment');
      } catch (parseError) {
        console.error('JSON parse error:', parseError);
        return {
          statusCode: 400,
          headers: { 
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ 
            error: 'Invalid JSON in request body',
            details: parseError.message,
            receivedBody: event.body
          })
        };
      }
    } else {
      console.error('Invalid method:', httpMethod);
      return {
        statusCode: 405,
        headers: { 
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          error: `Method ${httpMethod} not allowed`,
          allowedMethods: ['GET', 'POST', 'OPTIONS']
        })
      };
    }

    if (!userId) {
      console.error('No userId provided');
      return {
        statusCode: 400,
        headers: { 
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          error: 'User ID is required',
          debug: {
            method: httpMethod,
            queryParams: event.queryStringParameters,
            bodyProvided: !!event.body
          }
        })
      };
    }

    console.log('Processing request for user:', userId);

    const fileName = `data/${userId}.json`;
    const apiUrl = `https://api.github.com/repos/${GITHUB_REPO}/contents/${fileName}`;
    
    // Common headers for GitHub API
    const githubHeaders = {
      'Authorization': `Bearer ${GITHUB_TOKEN}`,
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': 'kitchen-recipe-generator-app',
      'X-GitHub-Api-Version': '2022-11-28'
    };

    console.log('API URL:', apiUrl);

    switch (httpMethod) {
      case 'GET':
        try {
          console.log('Attempting to fetch file from GitHub...');
          const response = await fetch(apiUrl, {
            method: 'GET',
            headers: githubHeaders
          });

          console.log('GitHub GET response status:', response.status);

          if (response.status === 404) {
            console.log('File not found, returning empty data');
            return {
              statusCode: 200,
              headers: { 
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                ingredients: [],
                equipment: [],
                lastUpdated: null,
                debug: { message: 'File not found, returned empty data' }
              })
            };
          }

          if (!response.ok) {
            const errorText = await response.text();
            console.error('GitHub API error:', response.status, errorText);
            throw new Error(`GitHub API error: ${response.status} - ${errorText}`);
          }

          const fileData = await response.json();
          const content = JSON.parse(Buffer.from(fileData.content, 'base64').toString());

          console.log('Successfully retrieved data from GitHub');

          return {
            statusCode: 200,
            headers: { 
              'Access-Control-Allow-Origin': '*',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              ...content,
              debug: { message: 'Data loaded from GitHub successfully' }
            })
          };

        } catch (error) {
          console.error('Error fetching from GitHub:', error);
          return {
            statusCode: 200, // Return 200 to provide fallback data
            headers: { 
              'Access-Control-Allow-Origin': '*',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              ingredients: [],
              equipment: [],
              lastUpdated: null,
              debug: { 
                error: error.message,
                message: 'Failed to load from GitHub, returned empty data'
              }
            })
          };
        }

      case 'POST':
        try {
          console.log('Attempting to save to GitHub...');
          
          const dataToSave = {
            ingredients: ingredients || [],
            equipment: equipment || [],
            lastUpdated: new Date().toISOString(),
            debug: { message: 'Data saved successfully' }
          };

          const content = Buffer.from(JSON.stringify(dataToSave, null, 2)).toString('base64');

          // First, try to get the current file to get its SHA
          let sha = null;
          try {
            console.log('Getting current file SHA...');
            const getResponse = await fetch(apiUrl, {
              method: 'GET',
              headers: githubHeaders
            });

            if (getResponse.ok) {
              const fileData = await getResponse.json();
              sha = fileData.sha;
              console.log('Found existing file, SHA:', sha);
            } else {
              console.log('File does not exist yet, will create new');
            }
          } catch (e) {
            console.log('Error getting SHA (file probably doesn\'t exist):', e.message);
          }

          // Create or update the file
          const saveData = {
            message: `Update kitchen data for ${userId} at ${new Date().toISOString()}`,
            content: content,
            ...(sha && { sha })
          };

          console.log('Saving to GitHub with data:', { 
            message: saveData.message, 
            hasSha: !!sha,
            contentLength: content.length 
          });

          const saveResponse = await fetch(apiUrl, {
            method: 'PUT',
            headers: {
              ...githubHeaders,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(saveData)
          });

          console.log('GitHub PUT response status:', saveResponse.status);

          if (!saveResponse.ok) {
            const errorText = await saveResponse.text();
            console.error('GitHub save error:', saveResponse.status, errorText);
            throw new Error(`GitHub save error: ${saveResponse.status} - ${errorText}`);
          }

          const saveResult = await saveResponse.json();
          console.log('Successfully saved to GitHub');

          return {
            statusCode: 200,
            headers: { 
              'Access-Control-Allow-Origin': '*',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 
              success: true, 
              data: dataToSave,
              github: {
                sha: saveResult.content?.sha,
                url: saveResult.content?.html_url
              }
            })
          };

        } catch (error) {
          console.error('Error saving to GitHub:', error);
          return {
            statusCode: 500,
            headers: { 
              'Access-Control-Allow-Origin': '*',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 
              error: 'Failed to save data to GitHub',
              details: error.message,
              debug: {
                userId,
                timestamp: new Date().toISOString()
              }
            })
          };
        }

      default:
        return {
          statusCode: 405,
          headers: { 
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ 
            error: `Method ${httpMethod} not allowed`,
            allowedMethods: ['GET', 'POST', 'OPTIONS']
          })
        };
    }

  } catch (error) {
    console.error('Function error:', error);
    return {
      statusCode: 500,
      headers: { 
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 
        error: 'Internal server error',
        details: error.message,
        debug: {
          timestamp: new Date().toISOString(),
          method: event.httpMethod
        }
      })
    };
  }
};
