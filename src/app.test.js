const app = require("./app");
const request = require("supertest")(app);

describe("EventAPI", () => {

    let client;
    let repository;

    // Cria a conexão com o banco antes de cada teste
    beforeAll(async() => {
        const container = app.get("container");
        client = container.getClient();
        repository = await container.getRepository();
    });
    
    // Deleta os dados do banco antes de cada teste
    beforeEach(async() => {
        await repository.deleteAll();
    });

    // Encerra a conexão com o banco após cada teste
    afterAll(async() => {
        await client.close();
    });


    test("GET /events", async() =>{

        // preparacao
        await repository.create({
            name: "Copa do Mundo",
            date: "2026-01-01"
        });

        // executo o cenario
        const response = await request.get("/events");
        
        // assercoes do cenario (validacao)
        expect(response.header).toHaveProperty("content-type", "application/json; charset=utf-8");
        expect(response.status).toBe(200);
        expect(response.body.length).toBe(1);
        expect(response.body[0]).toStrictEqual(expect.objectContaining({
            name: "Copa do Mundo",
            date: "2026-01-01"
        }))
    });


    test("POST /events", async() =>{
        // preparacao - OK

        // executo o cenario
        const response = await request.post("/events")
            .send({
                name: "Copa do Mundo",
                date: "2026-01-01"
             })
        
        // assercoes do cenario (validacao)
        expect(response.header).toHaveProperty("content-type", "application/json; charset=utf-8");
        expect(response.statusCode).toBe(201);
        expect(response.body).toStrictEqual(expect.objectContaining({
            name: "Copa do Mundo",
            date: "2026-01-01"
        }));
    });


    test("GET /events/{id} - Evento existente", async() =>{
        // preparacao
        const event = await repository.create({
            name: "Copa do Mundo",
            date: "2026-01-01"
        });
        // console.log(event._id);

        // executo o cenario
        const response = await request.get(`/events/${event._id}`);       
        
        // assercoes do cenario (validacao)
        expect(response.header).toHaveProperty("content-type", "application/json; charset=utf-8");
        expect(response.statusCode).toBe(200);
        expect(response.body).toStrictEqual(expect.objectContaining({
            name: "Copa do Mundo",
            date: "2026-01-01"
        }));
    });


    test("GET /events/{id} - Evento não existente", async() =>{
        // preparacao-OK

        // executo o cenario
        const response = await request.get(`/events/650f23a1587522c2bc776e3e`);       
        
        // assercoes do cenario (validacao)
        expect(response.statusCode).toBe(404);
        expect(response.body).toStrictEqual(expect.objectContaining({
            error: "Event not found"
        }));
    });


    test("PUT /events/{id} - Evento existente", async() => {
        // preparacao
        const event = await repository.create({
            name: "Copa do Mundo",
            date: "2026-01-01"
        });

        // executo o cenario
        const response = await request.put(`/events/${event._id}`)
            .send({
                name: "Rock in Rio",
                date: "2030-01-01"
            });

        // assercoes do cenario (validacao)
        expect(response.statusCode).toBe(200);
        expect(response.body).toStrictEqual(expect.objectContaining({
            name: "Rock in Rio",
            date: "2030-01-01"
        }));
    });


    test("PUT /events/{id} - Evento não existente", async() => {
        // preparacao - OK

        // executo o cenario
        const response = await request.put(`/events/650f23a1587522c2bc776e3e`)
            .send({
                name: "Rock in Rio",
                date: "2030-01-01"
            });

        // assercoes do cenario (validacao)
        expect(response.statusCode).toBe(404);
        expect(response.body).toStrictEqual(expect.objectContaining({
            error: "Event not found"
        }));
    });


    test("DELETE /events/{id} - Evento existente", async() => {
        // preparacao
        const event = await repository.create({
            name: "Copa do Mundo",
            date: "2026-01-01"
        });

        // executo o cenario
        const response = await request.delete(`/events/${event._id}`)

        // assercoes do cenario (validacao)
        expect(response.statusCode).toBe(204);
        expect(response.body).toStrictEqual({});
    });


    test("DELETE /events/{id} - Evento não existente", async() => {
        // preparacao - OK

        // executo o cenario
        const response = await request.delete(`/events/650f23a1587522c2bc776e3e`)

        // assercoes do cenario (validacao)
        expect(response.statusCode).toBe(404);
        expect(response.body).toStrictEqual(expect.objectContaining({
            error: "Event not found"
        }));
    });


});