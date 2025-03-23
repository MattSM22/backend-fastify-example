import { randomUUID } from "node:crypto";
import type { FastifyTypedInstance } from "./types";
import z from "zod";

interface Users {
  id: string,
  name: string,
  email: string
}

const users: Users[] = [];

export async function routes(app: FastifyTypedInstance) {
  app.get("/users", {
    schema:{
      tags: ['users'],
      description: 'List users',
      response: {
        200: z.array(z.object({
          id: z.string(),
          name: z.string(),
          email: z.string(),
        })),
      }
    }
  }, () => {
    return users;
  });

  app.post("/users", {
    schema: {
      tags: ['users'],
      description: 'Create a new user',
      body: z.object({
        name: z.string(),
        email: z.string().email()
      }),
      response: {
        201: z.null().describe('User Created!'),
      }
    }
  }, async(request, reply) => {
    const { name, email } = request.body;

    users.push({
      id: randomUUID(),
      name,
      email
    });

    return reply.status(201).send();
  });
}