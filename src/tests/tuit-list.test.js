import {default as Tuits} from "../components/tuits";
import {screen, render} from "@testing-library/react";
import {HashRouter} from "react-router-dom";
import axios from "axios";
import {findAllTuits} from "../services/tuits-service";

//jest.mock('axios');

const MOCKED_USERS = [
  "alice", "bob", "charlie"
];

const MOCKED_TUITS = [
  "alice's tuit", "bob's tuit", "charlie's tuit"
];

const TEST_TUITS = [
  {
    tuit : "test tuit 1"
  },
  {
    tuit : "test tuit 2"
  }
]

test('tuit list renders static tuit array', () => {
  render(
      <HashRouter>
        <Tuits tuits={TEST_TUITS} />
      </HashRouter>);
  const tuitElement = screen.getByText('test tuit 1');
  expect(tuitElement).toBeInTheDocument();
});

test('tuit list renders async', async () => {

  const tuits = await findAllTuits();

  render (
      <HashRouter>
        <Tuits tuits={tuits} />
      </HashRouter>
  );
  const tuitElement = screen.getByText('I am alice');
  expect(tuitElement).toBeInTheDocument();
})

test('tuit list renders mocked', async () => {
  const mock = jest.spyOn(axios, 'get');
  mock.mockImplementation(() =>
      Promise.resolve({data: {tuits: TEST_TUITS}}));
  const response = await findAllTuits();
  const tuits = response.tuits;

  render(
      <HashRouter>
        <Tuits tuits={tuits} />
      </HashRouter>);

  const tuitElement = screen.getByText('test tuit 2');
  expect(tuitElement).toBeInTheDocument();
  mock.mockRestore();
});