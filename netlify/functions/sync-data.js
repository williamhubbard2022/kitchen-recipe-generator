// netlify/functions/sync-data.js
const { createClient } = require('@supabase/supabase-js');

exports.handler = async (event, context) => {
  // Handle CORS
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS'
      },
      body: ''
    };
  }

  try {
    // Initialize Supabase (you'll need to set these as environment variables)
    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_ANON_KEY
    );

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

    switch (method) {
      case 'GET':
        // Get user's data
        const { data: userData, error: fetchError } = await supabase
          .from('user_kitchens')
          .select('*')
          .eq('user_id', userId)
          .single();

        if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 = no rows found
          throw fetchError;
        }

        return {
          statusCode: 200,
          headers: { 'Access-Control-Allow-Origin': '*' },
          body: JSON.stringify({
            ingredients: userData?.ingredients || [],
            equipment: userData?.equipment || [],
            lastUpdated: userData?.updated_at || null
          })
        };

      case 'POST':
        // Save/update user's data
        const { data: upsertData, error: upsertError } = await supabase
          .from('user_kitchens')
          .upsert({
            user_id: userId,
            ingredients: ingredients || [],
            equipment: equipment || [],
            updated_at: new Date().toISOString()
          }, {
            onConflict: 'user_id'
          });

        if (upsertError) {
          throw upsertError;
        }

        return {
          statusCode: 200,
          headers: { 'Access-Control-Allow-Origin': '*' },
          body: JSON.stringify({ success: true, data: upsertData })
        };

      default:
        return {
          statusCode: 405,
          headers: { 'Access-Control-Allow-Origin': '*' },
          body: JSON.stringify({ error: 'Method not allowed' })
        };
    }

  } catch (error) {
    console.error('Database error:', error);
    return {
      statusCode: 500,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ 
        error: 'Database error',
        details: error.message
      })
    };
  }
};
