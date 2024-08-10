import Groq from "groq-sdk";
import { sleep } from "groq-sdk/core.mjs";
import { NextResponse } from "next/server";
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function GET(request: Request) {
    const {searchParams} = new URL(request.url);
    const requestType = searchParams.get('requestType');
    const ingredients = searchParams.get('ingredients');

    if(!requestType){
        return Response.json({error: 'Invalid request type'}, {status: 400})
    }

    if(!ingredients){
        return Response.json({error: 'Invalid ingredients'}, {status: 400})
    }

    switch(requestType){
        case 'getRecipes':
            const recipes = await getRecipesCompletion(ingredients);
            console.log(recipes);
            return Response.json({dishes: JSON.parse(recipes!).dishes});
        case 'generateRecipe':
            const recipeName = searchParams.get('recipeName')!;
            const prep_time = searchParams.get('prep_time')!;
            const tools = searchParams.get('tools')!;

            const iterator = makeRecipeIterator(recipeName, ingredients, prep_time, tools);
            const stream = iteratorToStream(iterator);

            return new Response(stream, {
                headers: { 'Content-Type': 'text/plain' },
            });
            
        default:
            return Response.json({error: 'Invalid request type'}, {status: 400})
    }
}

async function getRecipesCompletion(ingredients: string){
    const response = await groq.chat.completions.create({
        "messages": [
          {
            "role": "system",
            "content": "You are JSON dishes provider for listing dishes or other things that can be made using only the ingredients provided by user. Provide only the name of dishes, time to prepare and ingredient it will use with name and quantity separate, tools that might be used like blender, knife etc and servings. remember only use the ingredient that are available in enough amount. Try to give atleast 5 recipes"
          },
          {
            "role": "user",
            "content": "Cherries : 1000 gm\nMilk : 1000 ml\nChocolate Powder :  5 cups"
          },
          {
            "role": "assistant",
            "content":  "{ \"dishes\": [ { \"name\": \"Cherry Chocolate Smoothie\", \"prep_time\": \"10 minutes\", \"ingredients\": [ { \"name\": \"Cherries\", \"quantity\": \"500 gm\" }, { \"name\": \"Milk\", \"quantity\": \"500 ml\" }, { \"name\": \"Chocolate Powder\", \"quantity\": \"1 cup\" } ], \"tools\": [ \"Blender\" ], \"servings\": \"1-2\" }, { \"name\": \"Chocolate Covered Cherries\", \"prep_time\": \"30 minutes\", \"ingredients\": [ { \"name\": \"Cherries\", \"quantity\": \"300 gm\" }, { \"name\": \"Chocolate Powder\", \"quantity\": \"2 cups\" }, { \"name\": \"Milk\", \"quantity\": \"200 ml\" } ], \"tools\": [ \"Knife\", \"Double Boiler\" ], \"servings\": \"1-2\" }, { \"name\": \"Cherry and Chocolate Parfait\", \"prep_time\": \"20 minutes\", \"ingredients\": [ { \"name\": \"Cherries\", \"quantity\": \"200 gm\" }, { \"name\": \"Chocolate Powder\", \"quantity\": \"1 cup\" }, { \"name\": \"Milk\", \"quantity\": \"300 ml\" } ], \"tools\": [ \"Mixing Bowls\", \"Whisk\", \"Glasses\" ], \"servings\": \"1\"  }, { \"name\": \"Chocolate Cherry Mousse\", \"prep_time\": \"40 minutes\", \"ingredients\": [ { \"name\": \"Cherries\", \"quantity\": \"400 gm\" }, { \"name\": \"Chocolate Powder\", \"quantity\": \"3 cups\" }, { \"name\": \"Milk\", \"quantity\": \"400 ml\" } ], \"tools\": [ \"Double Boiler\", \"Electric Mixer\" ], \"servings\": \"1-2\"  }, { \"name\": \"Cherry and Chocolate Crepes\", \"prep_time\": \"45 minutes\", \"ingredients\": [ { \"name\": \"Cherries\", \"quantity\": \"500 gm\" }, { \"name\": \"Chocolate Powder\", \"quantity\": \"2 cups\" }, { \"name\": \"Milk\", \"quantity\": \"500 ml\" } ], \"tools\": [ \"Mixing Bowls\", \"Whisk\", \"Crepe Pan\", \"Spatula\" ], \"servings\": \"1-2\"  } ] }"
          },
          {
            "role": "user",
            "content": ingredients
          }
        ],
        "model": "mixtral-8x7b-32768",
        "temperature": 0.7,
        "max_tokens": 1024,
        "top_p": 1,
        "stream": false,
        "response_format": {
          "type": "json_object"
        },
        "stop": null
      });

      return response.choices[0].message.content;
}

async function* makeRecipeIterator(name:string, ingredients: string, prep_time: string, tools: string) {
    const chatCompletion = await groq.chat.completions.create({
        "messages": [
          {
            "role": "system",
            "content": "You are recipe provider that tells about preparing a dish with given name, ingredients and tool. Give other informations like Servings and time."
          },
          {
            "role": "user",
            "content": "Cherry Chocolate Smoothie\nIngredients:\nCherries : 500 gm\nMilk : 500 ml\nChocolate Powder :  1 cups\nTools:\nBlender\nPreparation Time: 10 minutes"
          },
          {
            "role": "assistant",
            "content": "- Add the pitted cherries to the blender.\n- Pour in the milk.\n- Add the chocolate powder.\n- Blend until smooth. This will take about 1-2 minutes depending on the strength of your blender.\n- Taste and adjust the sweetness if necessary. You can add more chocolate powder or a sweetener of your choice.\n- Pour the smoothie into glasses and serve immediately. Enjoy!\n\nNote: If you want a thicker smoothie, you can add some ice cubes or frozen cherries. If you want a thinner smoothie, you can add more milk. You can also add other ingredients such as chia seeds, flax seeds, or spinach for extra nutrition."
          },
          {
            "role": "user",
            "content": `${name}\nIngredients:\n${ingredients}\nTools:\n${tools}\nPreparation Time: ${prep_time}`
          }
        ],
        "model": "mixtral-8x7b-32768",
        "temperature": 1,
        "max_tokens": 2048,
        "top_p": 1,
        "stream": true,
        "stop": null
      });
    
      for await (const chunk of chatCompletion) {
        yield(chunk.choices[0]?.delta?.content || '');
      }
}

function iteratorToStream(iterator: AsyncIterator<string>) {
    const encoder = new TextEncoder();
    return new ReadableStream({
        async start(controller) {
            async function push() {
                const { done, value } = await iterator.next();
                if (done) {
                    controller.close();
                    return;
                }
                controller.enqueue(encoder.encode(value));
                push();
            }
            push();
        }
    });
}