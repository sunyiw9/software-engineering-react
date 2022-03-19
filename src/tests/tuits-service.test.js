import {
    createUser,
    deleteUsersByUsername,
} from "../services/users-service";
import {createTuit, deleteTuit, findTuitById, findTuitByUser} from "../services/tuits-service";

describe('can create tuit with REST API', () => {
    // create a fake ID for tuit
    let mockObjectId = null;

    const tuitTest = {
        tuit: 'This is the create tuit test',
    };

    const ripley = {
        username: 'ellenripley',
        password: 'lv426',
        email: 'ellenripley@aliens.com'
    };

    // setup test before running test
    beforeAll(() => {
        // remove any/all users to make sure we create it in the test
        return deleteUsersByUsername(ripley.username);
    })

    // clean up after test runs
    afterAll(() => {
        // remove any data we created
        deleteTuit(mockObjectId);
        return deleteUsersByUsername(ripley.username);
    })

    test('can insert new tuits with REST API', async () => {
        const newUser = await createUser(ripley);

        expect(newUser.username).toEqual(ripley.username);
        expect(newUser.password).toEqual(ripley.password);
        expect(newUser.email).toEqual(ripley.email);

        const newTuit = await createTuit(newUser._id, tuitTest);
        mockObjectId = newTuit._id;
        expect(newTuit.tuit).toEqual(tuitTest.tuit);
    });

});

describe('can delete tuit wtih REST API', () => {
    let mockObjectId = null;

    const tuitTest = {
        tuit: 'This is the create tuit test',
    };

    const ripley = {
        username: 'ellenripley',
        password: 'lv426',
        email: 'ellenripley@aliens.com'
    };

    // setup test before running test
    beforeAll(() => {
        // remove any/all users to make sure we create it in the test
        return deleteUsersByUsername(ripley.username);
    })

    // clean up after test runs
    afterAll(() => {
        // remove any data we created
        deleteTuit(mockObjectId);
        return deleteUsersByUsername(ripley.username);
    })

    test('can delete tuits from REST API', async () => {
        const newUser = await createUser(ripley);

        expect(newUser.username).toEqual(ripley.username);
        expect(newUser.password).toEqual(ripley.password);
        expect(newUser.email).toEqual(ripley.email);

        const newTuit = await createTuit(newUser._id, tuitTest);
        mockObjectId = newTuit._id;
        expect(newTuit.tuit).toEqual(tuitTest.tuit);

        const status = await deleteTuit(mockObjectId);
        expect(status.deletedCount).toBeGreaterThanOrEqual(1);
    });
});

describe('can retrieve a tuit by their primary key with REST API', () => {
    let mockObjectId = null;

    const tuitTest = {
        tuit: 'This is the create tuit test',
    };

    const ripley = {
        username: 'ellenripley',
        password: 'lv426',
        email: 'ellenripley@aliens.com'
    };

    // setup test before running test
    beforeAll(() => {
        // remove any/all users to make sure we create it in the test
        return deleteUsersByUsername(ripley.username);
    })

    // clean up after test runs
    afterAll(() => {
        // remove any data we created
        deleteTuit(mockObjectId);
        return deleteUsersByUsername(ripley.username);
    })

    test('can retrieve tuit from REST API by primary key', async () => {
        const newUser = await createUser(ripley);

        expect(newUser.username).toEqual(ripley.username);
        expect(newUser.password).toEqual(ripley.password);
        expect(newUser.email).toEqual(ripley.email);

        const newTuit = await createTuit(newUser._id, tuitTest);
        mockObjectId = newTuit._id;
        expect(newTuit.tuit).toEqual(tuitTest.tuit);

        const existingTuit = await findTuitById(newTuit._id);

        expect(existingTuit.tuit).toEqual(tuitTest.tuit);
    });

});

describe('can retrieve all tuits with REST API', () => {
    const tuits = [
        {tuit : "tuit 1"},
        {tuit : "tuit 2"},
        {tuit : "tuit 3"}
    ];
    const ripley = {
        username: 'ellenripley',
        password: 'lv426',
        email: 'ellenripley@aliens.com'
    };

    let existingTuits = null;
    let newUser = null;

    beforeAll( () => {
      return  deleteUsersByUsername(ripley.username);
      }
    )

    afterAll(() => {
        // (existingTuits || []).map((tuit) => {
        //     deleteTuit(tuit._id);
        // });
        // return deleteUsersByUsername(ripley.username);
        deleteUsersByUsername(ripley.username);
        return Promise.all(existingTuits.map((tuit) => {
            return deleteTuit(tuit._id);
        }));
    });

    test('can retrieve all tuits', async () => {
        newUser = await createUser(ripley);

        const createdTuits = await Promise.all(tuits.map(tuit =>
          {return createTuit(newUser._id, tuit);}
        ));

        existingTuits = await findTuitByUser(newUser._id);

        expect(existingTuits).toHaveLength(tuits.length);
    });
});