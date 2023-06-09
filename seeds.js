const { faker } = require("@faker-js/faker");
const mongoose = require("mongoose");
require("dotenv").config();

const User = require("./models/user");
const Comment = require("./models/comment");
const Like = require("./models/like");
const Post = require("./models/post");
const FriendRequest = require("./models/friendRequest");

// Generate fake data for a user
function generateFakeUser() {
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();
  const email = faker.internet.email();
  const password = faker.internet.password();
  const profileImg = faker.internet.avatar();
  const profilePhoto = faker.image.imageUrl(
    undefined,
    undefined,
    undefined,
    true
  );

  // Generate fake posts with references
  const posts = [];
  for (let i = 0; i < 5; i++) {
    const post = new Post({
      title: faker.lorem.words(3),
      content: faker.lorem.paragraph(),
    });
    posts.push(post);
  }

  // Generate fake friend requests with references
  const friendRequests = [];
  for (let i = 0; i < 3; i++) {
    const friendRequest = new FriendRequest({
      sender: faker.person.firstName(),
      receiver: faker.person.firstName(),
    });
    friendRequests.push(friendRequest);
  }

  // Generate fake comments with references
  const comments = [];
  for (let i = 0; i < 10; i++) {
    const comment = new Comment({ content: faker.lorem.sentence() });
    comments.push(comment);
  }

  // Generate fake likes with references
  const likes = [];
  for (let i = 0; i < 5; i++) {
    const like = new Like({ user: faker.person.firstName() });
    likes.push(like);
  }

  // Generate fake friends with references
  const friends = [];
  for (let i = 0; i < 3; i++) {
    const friend = new User({
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
    });
    friends.push(friend);
  }

  return {
    firstName,
    lastName,
    email,
    password,
    profileImg,
    posts,
    friendRequests,
    comments,
    likes,
    friends,
    profilePhoto,
  };
}

// Save the generated fake user data to the database
async function saveFakeUser(count) {
  try {
    // Connect to the database
    await mongoose.connect(process.env.MONGODB_URI);

    for (let i = 0; i < count; i++) {
      // Generate fake user data
      const fakeUser = generateFakeUser();

      // Create user record in the database
      const user = await User.create(fakeUser);

      console.log("Fake user saved:", user);
    }
  } catch (err) {
    console.error(err);
  } finally {
    // Disconnect from the database
    mongoose.disconnect();
  }
}

// Call the function to save the fake user
saveFakeUser(10);
