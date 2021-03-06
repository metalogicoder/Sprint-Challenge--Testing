const request = require('supertest');
const mongoose = require('mongoose');

const server = require('./server');
const Game = require('./games/Game');

describe('Games', () => {
  beforeAll(() => {
    return mongoose
      .connect('mongodb://localhost/test')
      .then(() => console.log('\n=== connected to TEST DB ==='));
  });

  afterAll(() => {
    return mongoose
      .disconnect()
      .then(() => console.log('\n=== disconnected from TEST DB ==='));
  });

  let gameId;
  // // hint - these wont be constants because you'll need to override them.

  const game = {
    title: 'Black Desert Online',
    genre: 'Fantasy',
    releaseDate: 'July 2016'
  };
  
  beforeEach(() => {
    //   // write a beforeEach hook that will populate your test DB with data
    //   // each time this hook runs, you should save a document to your db
    //   // by saving the document you'll be able to use it in each of your `it` blocks
    return Game.create(game, (err, savedGame) => {
      if(err) return err;
      gameId = savedGame._id;
      console.log('\n=== game added to test db ===');
    });
  });

  afterEach(() => {
    //   // clear collection.
    return Game.remove().then(() => {
      gameId = null;
      console.log('\n=== game deleted from test db ===')
    });
  });

  it('runs the tests', () => {});

  // test the POST here
  describe('[POST] /api/games', () => {
    it('take in and object without throwing error', async () => {
      const response = await request(server).post("/api/games").send(game);
      const { title, genre, releaseDate } = response.body;

      expect(response.status).toEqual(201);
      expect(response.type).toEqual("application/json");
    });
  
    it('return created game object in server response', async () => {
      const response = await request(server).post("/api/games").send(game);
      const { title, genre, releaseDate } = response.body;
  
      expect(title).toEqual(game.title);
      expect(genre).toEqual(game.genre);
      expect(releaseDate).toEqual(game.releaseDate);
    });
  });
  

  // test the GET here
  describe('[GET] /api/games', () => {
    it('returns a body in the response', async () => {
      const response = await request(server).get("/api/games");
  
      expect(response.body).not.toBe('undefined');
    });
  
    it('returns a list of games', async () => {
      const response = await request(server).get("/api/games");

      expect(response.body.length).toBeGreaterThan(0);
      expect(response.body).toContain(response.body[0]);
    });

    it('returns data stored withing test db', async () => {
      const response = await request(server).get("/api/games");

      await Game.find({}, (err, games) => {
        if(err) return err;
        gameList = JSON.stringify(games);
      });

      expect(JSON.stringify(response.body)).toEqual(gameList);
    });
  })
  
  // Test the DELETE here
  describe('[DELETE] /api/games/:id', () => {
    it('not fuck up', async () => {
      await request(server)
        .delete(`/api/games${gameId}`)
        .then(response => {
          console.log(gameId, response.status);
          Game.find({}, (err, games) => {
            if(err) return err;
            console.log(games);
          });
        });
      

      // await request(server)
      //   .delete(`/api/games/${gameId}`)
      //   .set('Accept', 'application/json')
      //   .expect('Content-Type', /json/)
      //   // .expect(res => console.log(gameId))
      //   .expect(200)
        

        

      // console.log(gameId);
      // const responsew = await request(server).delete(`/api/games${gameId}`);
      // console.log(gameId);
    });
  });
 
});
