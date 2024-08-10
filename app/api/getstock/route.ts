import { createClient } from "pexels";

const client = createClient(process.env.PEXELS_API_KEY!);

export async function GET(request: Request){
    const {searchParams} = new URL(request.url);
    const stockQuery = searchParams.get('stockQuery')!;
    const count = parseInt(searchParams.get('count') || "3");
    const photos = await client.photos.search({query:stockQuery,orientation:'landscape', per_page: count, page:1});

    return Response.json({photos})
}
