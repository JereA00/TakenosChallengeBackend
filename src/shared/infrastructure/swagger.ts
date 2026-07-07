import swaggerJsdoc from "swagger-jsdoc";

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "UCL Draw API",
      version: "1.0.0",
      description: "REST API for the UEFA Champions League draw simulation",
    },
    servers: [{ url: "http://localhost:8000", description: "Local development" }],
    components: {
      schemas: {
        Country: {
          type: "object",
          properties: {
            id: { type: "integer", example: 1 },
            name: { type: "string", example: "Spain" },
          },
        },
        Team: {
          type: "object",
          properties: {
            id: { type: "integer", example: 1 },
            name: { type: "string", example: "Real Madrid" },
            country: { $ref: "#/components/schemas/Country" },
            pot: { type: "integer", nullable: true, example: 1 },
          },
        },
        Match: {
          type: "object",
          properties: {
            id: { type: "integer", example: 1 },
            drawId: { type: "integer", example: 1 },
            homeTeam: { $ref: "#/components/schemas/Team" },
            awayTeam: { $ref: "#/components/schemas/Team" },
            matchDay: { type: "integer", example: 1 },
          },
        },
        Pot: {
          type: "object",
          properties: {
            id: { type: "integer", example: 1 },
            teams: { type: "array", items: { $ref: "#/components/schemas/Team" } },
          },
        },
        DrawPrimitives: {
          type: "object",
          properties: {
            id: { type: "integer", example: 1 },
            createdAt: { type: "string", format: "date-time", example: "2024-08-29T10:00:00.000Z" },
            pots: { type: "array", items: { $ref: "#/components/schemas/Pot" } },
            matches: { type: "array", items: { $ref: "#/components/schemas/Match" } },
          },
        },
        DrawStatistics: {
          type: "object",
          properties: {
            drawId: { type: "integer", example: 1 },
            createdAt: { type: "string", format: "date-time", example: "2024-08-29T10:00:00.000Z" },
            totalMatches: { type: "integer", example: 144 },
            matchesPerMatchDay: {
              type: "object",
              additionalProperties: { type: "integer" },
              example: { "1": 18, "2": 18 },
            },
            matchesPerPot: {
              type: "object",
              additionalProperties: { type: "integer" },
              example: { "1": 36, "2": 36 },
            },
            teamsPerPot: {
              type: "object",
              additionalProperties: { type: "integer" },
              example: { "1": 9, "2": 9 },
            },
          },
        },
        Pagination: {
          type: "object",
          properties: {
            page: { type: "integer", example: 1 },
            limit: { type: "integer", example: 10 },
            total: { type: "integer", example: 144 },
            totalPages: { type: "integer", example: 15 },
          },
        },
        MessageResponse: {
          type: "object",
          properties: {
            message: { type: "string", example: "Operation completed successfully" },
          },
        },
      },
    },
    paths: {
      "/draw": {
        post: {
          summary: "Run the UCL draw",
          description: "Executes the draw algorithm and persists the result. Returns 409 if a draw already exists.",
          operationId: "createDraw",
          tags: ["Draw"],
          responses: {
            "201": {
              description: "Draw created successfully",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/MessageResponse" },
                  example: { message: "Draw created successfully" },
                },
              },
            },
            "409": {
              description: "Draw already exists",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/MessageResponse" },
                  example: { message: "Draw already exists" },
                },
              },
            },
          },
        },
        get: {
          summary: "Get draw result",
          description: "Returns the current draw with pots and all generated matches.",
          operationId: "getDraw",
          tags: ["Draw"],
          responses: {
            "200": {
              description: "Current draw",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/DrawPrimitives" },
                },
              },
            },
            "404": {
              description: "No draw found",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/MessageResponse" },
                  example: { message: "No draw found" },
                },
              },
            },
          },
        },
        delete: {
          summary: "Delete the draw",
          description: "Deletes the current draw and all associated matches.",
          operationId: "deleteDraw",
          tags: ["Draw"],
          responses: {
            "200": {
              description: "Draw deleted successfully",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/MessageResponse" },
                  example: { message: "Draw deleted successfully" },
                },
              },
            },
            "404": {
              description: "No draw found",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/MessageResponse" },
                  example: { message: "No draw found" },
                },
              },
            },
          },
        },
      },
      "/draw/statistics": {
        get: {
          summary: "Get draw statistics",
          description: "Returns aggregated statistics about the current draw.",
          operationId: "getDrawStatistics",
          tags: ["Draw"],
          responses: {
            "200": {
              description: "Draw statistics",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/DrawStatistics" },
                },
              },
            },
            "404": {
              description: "No draw found",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/MessageResponse" },
                  example: { message: "No draw found" },
                },
              },
            },
          },
        },
      },
      "/teams": {
        get: {
          summary: "List all teams",
          description: "Returns all teams participating in the UCL.",
          operationId: "getTeams",
          tags: ["Teams"],
          responses: {
            "200": {
              description: "Array of teams",
              content: {
                "application/json": {
                  schema: { type: "array", items: { $ref: "#/components/schemas/Team" } },
                },
              },
            },
          },
        },
      },
      "/teams/{id}": {
        get: {
          summary: "Get team by ID",
          description: "Returns a team and all its matches.",
          operationId: "getTeamById",
          tags: ["Teams"],
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "integer" },
              example: 1,
            },
          ],
          responses: {
            "200": {
              description: "Team with matches",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      team: { $ref: "#/components/schemas/Team" },
                      matches: { type: "array", items: { $ref: "#/components/schemas/Match" } },
                    },
                  },
                },
              },
            },
            "400": {
              description: "Invalid ID supplied",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/MessageResponse" },
                },
              },
            },
            "404": {
              description: "Team not found",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/MessageResponse" },
                  example: { message: "Team not found" },
                },
              },
            },
          },
        },
      },
      "/matches": {
        get: {
          summary: "List matches",
          description: "Returns a paginated list of matches with optional filters.",
          operationId: "getMatches",
          tags: ["Matches"],
          parameters: [
            { name: "teamId", in: "query", schema: { type: "integer" }, description: "Filter by team ID" },
            { name: "matchDay", in: "query", schema: { type: "integer" }, description: "Filter by match day" },
            {
              name: "location",
              in: "query",
              schema: { type: "string", enum: ["home", "away"] },
              description: "Filter by team location (requires teamId)",
            },
            { name: "countryName", in: "query", schema: { type: "string" }, description: "Filter by country name" },
            { name: "page", in: "query", schema: { type: "integer", default: 1 }, description: "Page number" },
            { name: "limit", in: "query", schema: { type: "integer", default: 10 }, description: "Items per page" },
          ],
          responses: {
            "200": {
              description: "Paginated matches",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      matches: { type: "array", items: { $ref: "#/components/schemas/Match" } },
                      pagination: { $ref: "#/components/schemas/Pagination" },
                    },
                  },
                },
              },
            },
          },
        },
      },
      "/matches/{id}": {
        get: {
          summary: "Get match by ID",
          description: "Returns a single match by its ID.",
          operationId: "getMatchById",
          tags: ["Matches"],
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "integer" },
              example: 1,
            },
          ],
          responses: {
            "200": {
              description: "Match found",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Match" },
                },
              },
            },
            "404": {
              description: "Match not found",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/MessageResponse" },
                  example: { message: "Match not found" },
                },
              },
            },
          },
        },
      },
    },
  },
  apis: [],
};

export const swaggerSpec = swaggerJsdoc(options);
