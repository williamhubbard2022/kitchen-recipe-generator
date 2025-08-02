const { useState, useEffect } = React;

// Lucide icons
const ChefHat = () => React.createElement('svg', {
    width: 24, height: 24, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round'
}, React.createElement('path', { d: 'm15 11-1 9h-4l-1-9' }), React.createElement('path', { d: 'm5 11 1-2c0-5 4-7 8-7s8 2 8 7l1 2-4.5 0.5' }), React.createElement('path', { d: 'm4 11 5-8' }), React.createElement('path', { d: 'm20 11-5-8' }));

const Plus = () => React.createElement('svg', {
    width: 16, height: 16, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round'
}, React.createElement('path', { d: 'M5 12h14' }), React.createElement('path', { d: 'M12 5v14' }));

const Edit2 = () => React.createElement('svg', {
    width: 14, height: 14, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round'
}, React.createElement('path', { d: 'M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7' }), React.createElement('path', { d: 'M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z' }));

const Trash2 = () => React.createElement('svg', {
    width: 14, height: 14, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round'
}, React.createElement('polyline', { points: '3,6 5,6 21,6' }), React.createElement('path', { d: 'M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2' }), React.createElement('line', { x1: 10, y1: 11, x2: 10, y2: 17 }), React.createElement('line', { x1: 14, y1: 11, x2: 14, y2: 17 }));

const Check = () => React.createElement('svg', {
    width: 14, height: 14, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round'
}, React.createElement('polyline', { points: '20,6 9,17 4,12' }));

const Utensils = () => React.createElement('svg', {
    width: 16, height: 16, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round'
}, React.createElement('path', { d: 'M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2' }), React.createElement('path', { d: 'M7 2v20' }), React.createElement('path', { d: 'M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7' }));

const AlertTriangle = () => React.createElement('svg', {
    width: 20, height: 20, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round'
}, React.createElement('path', { d: 'M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z' }), React.createElement('line', { x1: 12, y1: 9, x2: 12, y2: 13 }), React.createElement('line', { x1: 12, y1: 17, x2: 12.01, y2: 17 }));

const Save = () => React.createElement('svg', {
    width: 14, height: 14, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round'
}, React.createElement('path', { d: 'M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z' }), React.createElement('polyline', { points: '17,21 17,13 7,13 7,21' }), React.createElement('polyline', { points: '7,3 7,8 15,8' }));

const X = () => React.createElement('svg', {
    width: 14, height: 14, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round'
}, React.createElement('line', { x1: 18, y1: 6, x2: 6, y2: 18 }), React.createElement('line', { x1: 6, y1: 6, x2: 18, y2: 18 }));

const RecipeGenerator = () => {
  // Get API key from environment or prompt user
  const getApiKey = () => {
    let apiKey = localStorage.getItem('anthropic_api_key');
    if (!apiKey) {
      apiKey = prompt('Please enter your Anthropic API key (starts with sk-ant-):');
      if (apiKey) {
        localStorage.setItem('anthropic_api_key', apiKey);
      }
    }
    return apiKey;
  };

  const [ingredients, setIngredients] = useState([
    { id: 1, name: 'Chicken Breast', quantity: 2, unit: 'lbs', category: 'Protein', expires: '2025-08-05' },
    { id: 2, name: 'Basmati Rice', quantity: 1, unit: 'cup', category: 'Grain', expires: '2026-01-01' },
    { id: 3, name: 'Heavy Cream', quantity: 1, unit: 'cup', category: 'Dairy', expires: '2025-08-03' },
    { id: 4, name: 'Mushrooms', quantity: 8, unit: 'oz', category: 'Vegetable', expires: '2025-08-04' },
    { id: 5, name: 'Garlic', quantity: 1, unit: 'head', category: 'Aromatics', expires: '2025-08-10' },
    { id: 6, name: 'Onion', quantity: 2, unit: 'medium', category: 'Aromatics', expires: '2025-08-08' },
    { id: 7, name: 'Butter', quantity: 1, unit: 'stick', category: 'Dairy', expires: '2025-08-15' },
    { id: 8, name: 'Parmesan', quantity: 4, unit: 'oz', category: 'Cheese', expires: '2025-08-20' }
  ]);

  const [equipment, setEquipment] = useState([
    { id: 1, name: 'Sous Vide Immersion Circulator', type: 'Precision Cooking', capabilities: 'Precise temperature control, long slow cooking' },
    { id: 2, name: 'Stand Mixer', type: 'Mixing', capabilities: 'Kneading, whipping, mixing large batches' },
    { id: 3, name: 'Food Processor', type: 'Prep', capabilities: 'Chopping, pureeing, dough making' },
    { id: 4, name: 'Immersion Blender', type: 'Blending', capabilities: 'Soups, sauces, emulsification' },
    { id: 5, name: 'Cast Iron Dutch Oven', type: 'Cooking', capabilities: 'Braising, bread baking, high heat retention' },
    { id: 6, name: 'Pressure Cooker', type: 'Cooking', capabilities: 'Fast cooking, tenderizing tough cuts' }
  ]);

  const [activeTab, setActiveTab] = useState('ingredients');
  const [editingItem, setEditingItem] = useState(null);
  const [generatedRecipe, setGeneratedRecipe] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [recipePreferences, setRecipePreferences] = useState('');

  // Load data from localStorage
  useEffect(() => {
    const savedIngredients = localStorage.getItem('ingredients');
    const savedEquipment = localStorage.getItem('equipment');
    
    if (savedIngredients) {
      setIngredients(JSON.parse(savedIngredients));
    }
    if (savedEquipment) {
      setEquipment(JSON.parse(savedEquipment));
    }
  }, []);

  // Save data to localStorage
  useEffect(() => {
    localStorage.setItem('ingredients', JSON.stringify(ingredients));
  }, [ingredients]);

  useEffect(() => {
    localStorage.setItem('equipment', JSON.stringify(equipment));
  }, [equipment]);

  const markAsUsed = (id) => {
    setIngredients(ingredients.filter(item => item.id !== id));
  };

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity <= 0) {
      markAsUsed(id);
    } else {
      setIngredients(ingredients.map(item => 
        item.id === id ? { ...item, quantity: newQuantity } : item
      ));
    }
  };

  const addIngredient = () => {
    const newIngredient = {
      id: Date.now(),
      name: 'New Ingredient',
      quantity: 1,
      unit: 'unit',
      category: 'Other',
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    };
    setIngredients([...ingredients, newIngredient]);
    setEditingItem({ type: 'ingredient', id: newIngredient.id });
  };

  const addEquipment = () => {
    const newEquipment = {
      id: Date.now(),
      name: 'New Equipment',
      type: 'Other',
      capabilities: 'Describe what this equipment can do'
    };
    setEquipment([...equipment, newEquipment]);
    setEditingItem({ type: 'equipment', id: newEquipment.id });
  };

  const deleteIngredient = (id) => {
    setIngredients(ingredients.filter(item => item.id !== id));
  };

  const deleteEquipment = (id) => {
    setEquipment(equipment.filter(item => item.id !== id));
  };

  const updateIngredient = (id, field, value) => {
    setIngredients(ingredients.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const updateEquipment = (id, field, value) => {
    setEquipment(equipment.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const generateRecipe = async () => {
    const apiKey = getApiKey();
    if (!apiKey) {
      alert('API key is required to generate recipes');
      return;
    }

    setIsGenerating(true);
    setGeneratedRecipe('');

    try {
      const ingredientsList = ingredients.map(ing => 
        `${ing.name} (${ing.quantity} ${ing.unit})`
      ).join(', ');

      const equipmentList = equipment.map(eq => 
        `${eq.name} - ${eq.capabilities}`
      ).join(', ');

      const prompt = `Create a detailed recipe using these available ingredients: ${ingredientsList}

Available specialized equipment: ${equipmentList}

User preferences/notes: ${recipePreferences || 'No specific preferences'}

Please create a recipe that:
1. Uses primarily the ingredients I have available
2. Takes advantage of my specialized kitchen equipment when possible
3. Includes clear step-by-step instructions
4. Mentions cooking times and temperatures
5. If I'm missing any key ingredients, suggest simple substitutions or mention they're optional

Format the recipe with a clear title, ingredient list, and numbered steps.`;

      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey,
          "anthropic-version": "2023-06-01"
        },
        body: JSON.stringify({
          model: "claude-3-sonnet-20240229",
          max_tokens: 1500,
          messages: [
            { role: "user", content: prompt }
          ]
        })
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }

      const data = await response.json();
      setGeneratedRecipe(data.content[0].text);
    } catch (error) {
      console.error("Error generating recipe:", error);
      setGeneratedRecipe(`Error generating recipe: ${error.message}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const isExpiringSoon = (expirationDate) => {
    const today = new Date();
    const expiry = new Date(expirationDate);
    const diffTime = expiry - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 3 && diffDays >= 0;
  };

  const expiringSoon = ingredients.filter(ing => isExpiringSoon(ing.expires));

  return React.createElement('div', { className: 'max-w-7xl mx-auto p-4 bg-gray-50 min-h-screen' },
    // Header
    React.createElement('div', { className: 'bg-white rounded-lg shadow-lg p-6 mb-6' },
      React.createElement('div', { className: 'flex justify-between items-center' },
        React.createElement('div', null,
          React.createElement('h1', { className: 'text-3xl font-bold text-gray-800 mb-2 flex items-center gap-2' },
            React.createElement(ChefHat, { className: 'text-orange-500' }),
            'Kitchen Recipe Generator'
          ),
          React.createElement('p', { className: 'text-gray-600' }, '🎯 Manage your kitchen inventory and generate AI recipes')
        )
      )
    ),

    // Expiring Soon Alert
    expiringSoon.length > 0 && React.createElement('div', { className: 'bg-red-50 border border-red-200 rounded-lg p-4 mb-6' },
      React.createElement('div', { className: 'flex items-center gap-2 mb-2' },
        React.createElement(AlertTriangle, { className: 'text-red-500' }),
        React.createElement('h3', { className: 'font-semibold text-red-800' }, 'Ingredients Expiring Soon!')
      ),
      React.createElement('div', { className: 'text-red-700 text-sm' },
        expiringSoon.map(ing => ing.name).join(', ') + ' - Consider using these first!'
      )
    ),

    React.createElement('div', { className: 'grid grid-cols-1 xl:grid-cols-2 gap-6' },
      // Left Panel - Inventory Management
      React.createElement('div', { className: 'bg-white rounded-lg shadow-lg p-6' },
        React.createElement('div', { className: 'flex gap-2 mb-6 overflow-x-auto' },
          React.createElement('button', {
            onClick: () => setActiveTab('ingredients'),
            className: `px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
              activeTab === 'ingredients' 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`
          }, `🥘 Ingredients (${ingredients.length})`),
          React.createElement('button', {
            onClick: () => setActiveTab('equipment'),
            className: `px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors flex items-center gap-2 ${
              activeTab === 'equipment' 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`
          }, React.createElement(Utensils), `Equipment (${equipment.length})`)
        ),

        // Ingredients Tab
        activeTab === 'ingredients' && React.createElement('div', null,
          React.createElement('div', { className: 'flex justify-between items-center mb-4' },
            React.createElement('h2', { className: 'text-xl font-semibold text-gray-800' }, 'Your Ingredients'),
            React.createElement('button', {
              onClick: addIngredient,
              className: 'bg-green-500 text-white px-3 py-2 rounded-lg hover:bg-green-600 transition-colors flex items-center gap-2 text-sm'
            }, React.createElement(Plus), 'Add')
          ),
          
          React.createElement('div', { className: 'space-y-3 max-h-96 overflow-y-auto' },
            ingredients.map(ingredient => 
              React.createElement('div', {
                key: ingredient.id,
                className: `p-4 rounded-lg border-2 ${
                  isExpiringSoon(ingredient.expires) ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-gray-50'
                }`
              },
                editingItem?.type === 'ingredient' && editingItem?.id === ingredient.id ? 
                  // Edit mode
                  React.createElement('div', { className: 'space-y-3' },
                    React.createElement('input', {
                      value: ingredient.name,
                      onChange: (e) => updateIngredient(ingredient.id, 'name', e.target.value),
                      className: 'w-full p-2 border rounded-lg',
                      placeholder: 'Ingredient name'
                    }),
                    React.createElement('div', { className: 'grid grid-cols-3 gap-2' },
                      React.createElement('input', {
                        type: 'number',
                        step: '0.1',
                        value: ingredient.quantity,
                        onChange: (e) => updateIngredient(ingredient.id, 'quantity', parseFloat(e.target.value)),
                        className: 'p-2 border rounded-lg',
                        placeholder: 'Qty'
                      }),
                      React.createElement('input', {
                        value: ingredient.unit,
                        onChange: (e) => updateIngredient(ingredient.id, 'unit', e.target.value),
                        className: 'p-2 border rounded-lg',
                        placeholder: 'Unit'
                      }),
                      React.createElement('input', {
                        type: 'date',
                        value: ingredient.expires,
                        onChange: (e) => updateIngredient(ingredient.id, 'expires', e.target.value),
                        className: 'p-2 border rounded-lg'
                      })
                    ),
                    React.createElement('select', {
                      value: ingredient.category,
                      onChange: (e) => updateIngredient(ingredient.id, 'category', e.target.value),
                      className: 'w-full p-2 border rounded-lg'
                    },
                      React.createElement('option', { value: 'Protein' }, 'Protein'),
                      React.createElement('option', { value: 'Vegetable' }, 'Vegetable'),
                      React.createElement('option', { value: 'Grain' }, 'Grain'),
                      React.createElement('option', { value: 'Dairy' }, 'Dairy'),
                      React.createElement('option', { value: 'Cheese' }, 'Cheese'),
                      React.createElement('option', { value: 'Aromatics' }, 'Aromatics'),
                      React.createElement('option', { value: 'Pantry' }, 'Pantry'),
                      React.createElement('option', { value: 'Other' }, 'Other')
                    ),
                    React.createElement('div', { className: 'flex gap-2' },
                      React.createElement('button', {
                        onClick: () => setEditingItem(null),
                        className: 'bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600 flex items-center gap-1'
                      }, React.createElement(Save), 'Save'),
                      React.createElement('button', {
                        onClick: () => setEditingItem(null),
                        className: 'bg-gray-500 text-white px-3 py-1 rounded text-sm hover:bg-gray-600 flex items-center gap-1'
                      }, React.createElement(X), 'Cancel')
                    )
                  ) :
                  // Display mode
                  React.createElement('div', null,
                    React.createElement('div', { className: 'flex justify-between items-start mb-2' },
                      React.createElement('div', { className: 'flex-1' },
                        React.createElement('div', { className: 'font-medium text-gray-800 text-lg' }, ingredient.name),
                        React.createElement('div', { className: 'text-sm text-gray-600 leading-relaxed' }, item.capabilities)
                    ),
                    React.createElement('div', { className: 'flex gap-1 ml-4' },
                      React.createElement('button', {
                        onClick: () => setEditingItem({ type: 'equipment', id: item.id }),
                        className: 'text-blue-500 hover:text-blue-700 p-1',
                        title: 'Edit'
                      }, React.createElement(Edit2)),
                      React.createElement('button', {
                        onClick: () => deleteEquipment(item.id),
                        className: 'text-red-500 hover:text-red-700 p-1',
                        title: 'Delete'
                      }, React.createElement(Trash2))
                    )
                  )
              )
            )
          )
        )
      ),

      // Right Panel - Recipe Generation
      React.createElement('div', { className: 'bg-white rounded-lg shadow-lg p-6' },
        React.createElement('h2', { className: 'text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2' },
          React.createElement(ChefHat, { className: 'text-orange-500' }),
          'Generate Recipe'
        ),
        
        React.createElement('div', { className: 'mb-4' },
          React.createElement('label', { className: 'block text-sm font-medium text-gray-700 mb-2' },
            'Preferences & Notes (optional)'
          ),
          React.createElement('textarea', {
            value: recipePreferences,
            onChange: (e) => setRecipePreferences(e.target.value),
            className: 'w-full p-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500',
            placeholder: "e.g., 'vegetarian', 'under 30 minutes', 'comfort food', 'use the sous vide', 'low carb', 'use expiring ingredients first'",
            rows: 3
          })
        ),

        React.createElement('button', {
          onClick: generateRecipe,
          disabled: isGenerating || ingredients.length === 0,
          className: 'w-full bg-orange-500 text-white py-3 px-4 rounded-lg hover:bg-orange-600 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2 mb-4'
        },
          isGenerating ? 
            React.createElement(React.Fragment, null,
              React.createElement('div', { className: 'animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent' }),
              'Generating Recipe...'
            ) :
            React.createElement(React.Fragment, null,
              React.createElement(ChefHat),
              `Generate Recipe (${ingredients.length} ingredients)`
            )
        ),

        ingredients.length === 0 && React.createElement('p', { className: 'text-sm text-gray-500 text-center mb-4' }, 
          'Add some ingredients first to generate recipes!'
        ),

        generatedRecipe && React.createElement('div', { className: 'mt-4 p-4 bg-gray-50 rounded-lg border max-h-96 overflow-y-auto' },
          React.createElement('h3', { className: 'font-semibold text-gray-800 mb-3 flex items-center gap-2' },
            React.createElement(ChefHat, { className: 'text-orange-500', size: 18 }),
            'Your Custom Recipe:'
          ),
          React.createElement('div', { className: 'whitespace-pre-wrap text-gray-700 text-sm leading-relaxed' },
            generatedRecipe
          )
        )
      )
    ),

    // Footer
    React.createElement('div', { className: 'mt-6 bg-gradient-to-r from-blue-50 to-green-50 border border-blue-200 rounded-lg p-4' },
      React.createElement('div', { className: 'text-center' },
        React.createElement('h3', { className: 'font-semibold text-blue-800 mb-1' }, '🎯 Pro Tips:'),
        React.createElement('p', { className: 'text-blue-700 text-sm' },
          '• Use "Mark as Used" (✓) for quick ingredient removal • Try preferences like "use expiring ingredients first" • Update quantities with +1, ÷2, -1 buttons • Data saves automatically to your browser'
        )
      )
    )
  );
};

ReactDOM.render(React.createElement(RecipeGenerator), document.getElementById('root'));