import { FastifyInstance } from "fastify";
import dotenv from "dotenv";
import path from "path";

dotenv.config({
  path: path.resolve(__dirname, "../../../.env"),
});

const INTERNAL_API_KEY = process.env.INTERNAL_API_KEY;
const DOMAIN = process.env.DOMAIN;
const USER_SERVICE_PORT = process.env.USER_SERVICE_PORT;
const USER_SERVICE_URL = `${DOMAIN}:${USER_SERVICE_PORT}`;

export async function hydrateRecipes(app: FastifyInstance, data: any) {
    if (!data)
        return data;
    const isArray = Array.isArray(data);
    const recipes = isArray ? data : [data];
    const authorIds = Array.from(new Set(recipes.map((r: any) => r.authorId).filter(Boolean)));
    if (authorIds.length === 0)
        return data;
    const response = await fetch(`${USER_SERVICE_URL}/api/v1/internal/users/batch?ids=${authorIds.join(",")}`, {
        method: "GET",
        headers: {
            "x-internal-api-key": INTERNAL_API_KEY,
            "Content-Type": "application/json"
        }
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch users: ${response.statusText}`);
    }

    const json = await response.json();
    const users = json.data || [];
    const usersMap = users.reduce((acc: any, user: any) => {
        acc[user.id] = user;
        return acc;
    }, {});
    recipes.forEach((recipe: any) => {
        if (recipe.authorId && usersMap[recipe.authorId]) {
            recipe.author = usersMap[recipe.authorId];
        }
        else {
            recipe.author = {
                id: recipe.authorId,
                username: "Unknown user",
                avatarUrl: "/default-avatar.png"
            };
        }
    });
    return isArray ? recipes : recipes[0];
}