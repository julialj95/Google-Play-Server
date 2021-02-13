const supertest = require("supertest");
const app = require("../app");
const { expect } = require("chai");

describe("GET /apps", () => {
  it("should return an array of apps", () => {
    return supertest(app)
      .get("/apps")
      .expect(200)
      .expect("content-type", /json/)
      .then((res) => {
        expect(res.body).to.be.an("array");
        expect(res.body).to.have.lengthOf.at.least(1);
      });
  });
  it("should be 400 if sort is incorrect", () => {
    return supertest(app)
      .get("/apps")
      .query({ sort: "MISTAKE" })
      .expect(400, "Please sort your search by 'app' or 'rating'");
  });
  it("should be 400 if genres is incorrect", () => {
    return supertest(app)
      .get("/apps")
      .query({ genres: "MISTAKE" })
      .expect(
        400,
        "Please select a genre from the list: Action, Puzzle, Strategy, Casual, Arcade, or Card"
      );
  });
  it("should sort apps alphabetically by title", () => {
    return supertest(app)
      .get("/apps")
      .query({ sort: "app" })
      .expect(200)
      .expect("Content-Type", /json/)
      .then((res) => {
        expect(res.body).to.be.an("array");
        let sorted = true;

        let i = 0;
        while (i < res.body.length - 1) {
          const appAtI = res.body[i];
          const appAtIPlus1 = res.body[i + 1];
          if (appAtIPlus1.title < appAtI.title) {
            sorted = false;
            break;
          }
          i++;
        }
        expect(sorted).to.be.true;
      });
  });
  it("should sort apps descending by rating", () => {
    return supertest(app)
      .get("/apps")
      .query({ sort: "rating" })
      .expect(200)
      .expect("Content-Type", /json/)
      .then((res) => {
        expect(res.body).to.be.an("array");
        let sorted = true;

        let i = 0;
        while (i < res.body.length - 1) {
          const appAtI = res.body[i];
          const appAtIPlus1 = res.body[i + 1];
          if (appAtIPlus1.rating > appAtI.rating) {
            sorted = false;
            break;
          }
          i++;
        }
        expect(sorted).to.be.true;
      });
  });
  // it("should sort apps by genre", () => {
  //   return supertest(app).get("/books").query({ genres });
  // });
});
