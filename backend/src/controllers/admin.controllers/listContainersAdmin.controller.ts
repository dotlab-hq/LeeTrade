import { requireRoles } from "@/middlewares/auth.middleware";
import { dockerService } from "@/services/docker.service";
import { createRoute, type RouteHandler, z } from "@hono/zod-openapi";

const containerSummarySchema = z
  .object( {
    Id: z.string(),
    Image: z.string(),
    State: z.string(),
    Status: z.string(),
    Names: z.array( z.string() ),
  } )
  .openapi( "ContainerSummary" );

const listContainersQuerySchema = z.object( {
  all: z
    .enum( ["true", "false"] )
    .optional()
    .openapi( { param: { name: "all", in: "query" } } ),
} );

export const listContainersRoute = createRoute( {
  method: "get",
  path: "/containers",
  tags: ["Container Management"],
  summary: "List Docker containers",
  security: [{ Bearer: [] }],
  request: {
    query: listContainersQuerySchema,
  },
  middleware: [requireRoles( ["admin"] )] as const,
  responses: {
    200: {
      description: "Docker containers",
      content: {
        "application/json": {
          schema: z.object( {
            containers: z.array( containerSummarySchema ),
          } ),
        },
      },
    },
  },
} );

export const listContainersHandler: RouteHandler<typeof listContainersRoute> = async ( c ) => {
  const query = c.req.valid( "query" );
  const containers = await dockerService.listContainers( query.all === "true" );
  const mapped = containers.map( ( container ) => ( {
    Id: container.Id,
    Image: container.Image,
    State: container.State,
    Status: container.Status,
    Names: container.Names,
  } ) );
  return c.json( { containers: mapped }, 200 );
};
